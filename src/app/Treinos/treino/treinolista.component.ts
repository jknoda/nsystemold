import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TreinoService } from './treino.service';
import { TreinoModel } from 'src/app/model/treino.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treinolista',
  templateUrl: './treinolista.component.html',
  styleUrls: ['./treino.component.css'],
  providers: [MessageService,ConfirmationService,TreinoService,MessageService]
})
export class TreinoListaComponent implements OnInit, OnDestroy {
    private EmpIdf: number = ServiceConfig.EMPIDF;
    deleteDadosTreino: Subscription;
    lerDadosTreino: Subscription;
  
    Treinos: TreinoModel[];
    submitted: boolean;
    isUpdate = true;
    isLoading = true;
  
    constructor(private router: Router, private srvTreino: TreinoService, 
      private messageService: MessageService, private confirmationService: ConfirmationService) {}
  
    ngOnInit() {
      this.getTreinos();
    }
  
    private getTreinos() {
      let dados = {
        EmpIdf: this.EmpIdf
      };
      this.lerDadosTreino = this.srvTreino.getTreTodos(dados).subscribe(
        (dados) => {
          this.Treinos = JSON.parse(JSON.stringify(dados));
          this.Treinos.forEach(item=>{
            item.TreData = new Date(item.TreData);
            item.DataStr = item.TreData.getDay().toString().padStart(2,'0') + '/' + 
               (item.TreData.getMonth()+1).toString().padStart(2,'0') + '/' +  // janeiro começa com 0
               item.TreData.getFullYear().toString();
          })
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.isLoading = false;
          return;
        });
    }
  
    openNew() {
      this.router.navigate(['treino'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, TreIdf: 0 } });
    }
  
    editTreino(Treino: TreinoModel) {
      this.router.navigate(['treino'], { queryParams: { Modo:'EDIT', EmpIdf: this.EmpIdf, TreIdf: Treino.TreIdf } });
    }

    editAtividades(Treino: TreinoModel) {
      this.router.navigate(['treinoatvlista'], { queryParams: { EmpIdf: Treino.EmpIdf, TreIdf: Treino.TreIdf, TreTitulo: Treino.TreTitulo, Data: Treino.DataStr } });
    }

    editAlunos(Treino: TreinoModel) {
      console.log('alunos');
    }

    deleteTreino(Treino: TreinoModel) {
      this.confirmationService.confirm({
        message: 'Confirma exclusão de <b>' + Treino.TreTitulo + '</b> ?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Sim",
        rejectLabel: "Não",
        accept: () => {
          let dados = {
            EmpIdf: Treino.EmpIdf,
            TreIdf: Treino.TreIdf
          };
          this.deleteDadosTreino = this.srvTreino.deleteTreDados(dados).subscribe(
            () => {
              this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Treino excluido!', life: 3000});
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
      this.getTreinos();
    }
  
    ngOnDestroy() {
      if ( this.lerDadosTreino != null){
        this.lerDadosTreino.unsubscribe();
      }
      if (this.deleteDadosTreino != null){
        this.deleteDadosTreino.unsubscribe();
      }
    }
  }
  
  