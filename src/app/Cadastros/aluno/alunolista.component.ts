import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AlunoService } from './aluno.service';
import { AlunoModel } from 'src/app/model/aluno.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alunolista',
  templateUrl: './alunolista.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [MessageService,ConfirmationService,AlunoService,MessageService]
})
export class AlunoListaComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  deleteDadosAluno: Subscription;
  lerDadosAluno: Subscription;

  Alunos: AlunoModel[];
  submitted: boolean;
  isUpdate = true;

  constructor(private router: Router, private srvAluno: AlunoService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getAlunos();
  }

  private getAlunos() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerDadosAluno = this.srvAluno.getTodos(dados).subscribe(
      (dados) => {
        this.Alunos = JSON.parse(JSON.stringify(dados));
        this.Alunos.forEach(item=>{
          item.AluDataNasc = new Date(item.AluDataNasc);
        })
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
    this.router.navigate(['aluno'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, AluIdf: 0 } });
  }

  editAluno(Aluno: AlunoModel) {
    this.router.navigate(['aluno'], { queryParams: { Modo:'EDIT', EmpIdf: Aluno.EmpIdf, AluIdf: Aluno.AluIdf } });
  }

  deleteAluno(Aluno: AlunoModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Aluno.AluNome + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Aluno.EmpIdf,
          AluIdf: Aluno.AluIdf
        };
        this.deleteDadosAluno = this.srvAluno.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Aluno excluido!', life: 3000});
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
    this.getAlunos();
  }

  ngOnDestroy() {
    if ( this.lerDadosAluno != null){
      this.lerDadosAluno.unsubscribe();
    }
    if (this.deleteDadosAluno != null){
      this.deleteDadosAluno.unsubscribe();
    }
  }
}
