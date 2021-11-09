import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AtividadeService } from './atividade.service';
import { AtividadeModel } from 'src/app/model/atividade.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-atividadelista',
  templateUrl: './atividadelista.component.html',
  styleUrls: ['./atividade.component.css'],
  providers: [MessageService,ConfirmationService,AtividadeService,MessageService]
})
export class AtividadeListaComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  deleteDadosAtividade: Subscription;
  lerDadosAtividade: Subscription;

  Atividades: AtividadeModel[];
  submitted: boolean;
  isUpdate = true;

  constructor(private router: Router, private srvAtividade: AtividadeService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getAtividades();
  }

  private getAtividades() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerDadosAtividade = this.srvAtividade.getAtvTodos(dados).subscribe(
      (dados) => {
        this.Atividades = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        return;
      });
  }

  openNew() {
    this.router.navigate(['atividade'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, AtvIdf: 0 } });
  }

  editAtividade(Atividade: AtividadeModel) {
    this.router.navigate(['atividade'], { queryParams: { Modo:'EDIT', EmpIdf: Atividade.EmpIdf, AtvIdf: Atividade.AtvIdf } });
  }

  deleteAtividade(Atividade: AtividadeModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Atividade.AtvTitulo + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Atividade.EmpIdf,
          AtvIdf: Atividade.AtvIdf
        };
        this.deleteDadosAtividade = this.srvAtividade.deleteAtvDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Atividade excluido!', life: 3000});
          },
          err => { 
            let msg = err.error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.refresh();
          });
        }
    });
  }

  private refresh(){
    this.submitted = true;
    this.getAtividades();
  }

  ngOnDestroy() {
    if ( this.lerDadosAtividade != null){
      this.lerDadosAtividade.unsubscribe();
    }
    if (this.deleteDadosAtividade != null){
      this.deleteDadosAtividade.unsubscribe();
    }
  }
}

