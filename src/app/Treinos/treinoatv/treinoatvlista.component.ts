import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TreinoatvModel } from 'src/app/model/treinoatv.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TreinoatvService } from './treinoatv.service';

@Component({
  selector: 'app-treinoatvlista',
  templateUrl: './treinoatvlista.component.html',
  styleUrls: ['./treinoatv.component.css'],
  providers: [MessageService,ConfirmationService,TreinoatvService,MessageService]
})
export class TreinoatvlistaComponent implements OnInit, OnDestroy {
    Param = {
      EmpIdf: 0,
      TreIdf: 0,
      TreTitulo: "",
      Data: ""
    }

    TreAtvItem = 0;

    totalTempoTxt = "";
    totalAtividadesTxt = "";

    deleteDadosTreinoatv: Subscription;
    lerDadosTreinoatv: Subscription;
    updateDadosTreinoAtv: Subscription;
  
    Treinoatvs: TreinoatvModel[];
    submitted: boolean;
    isUpdate = true;
    isLoading = true;

    cloneTreinos: { [s: string]: TreinoatvModel; } = {};
  
    constructor(private router: Router, private srvTreinoatv: TreinoatvService, 
      private messageService: MessageService, private confirmationService: ConfirmationService,
      private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.queryParams
      .subscribe(params => {
        this.Param.EmpIdf = params.EmpIdf;
        this.Param.TreIdf = params.TreIdf;
        this.Param.TreTitulo = params.TreTitulo;
        this.Param.Data = params.Data;
        this.getTreinoatvs();
      });
    }
  
    private getTreinoatvs() {
      let dados = {
        EmpIdf: this.Param.EmpIdf,
        TreIdf: this.Param.TreIdf
      };
      this.lerDadosTreinoatv = this.srvTreinoatv.getTreAtvTodosOrdem(dados).subscribe(
        (dados) => {
          this.Treinoatvs = JSON.parse(JSON.stringify(dados));
          let tot = 0;
          let qde = 0;
          this.Treinoatvs.forEach(item=>{
            qde++;
            tot += item.TreAtvMin;
          })
          this.totalAtividadesTxt = qde.toString() + " atividade" + (qde > 1? "s" : "");
          this.totalTempoTxt = tot.toString() + " minuto" + (tot > 1? "s" : "");
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

    onRowEditInit(treino: TreinoatvModel) {
        this.cloneTreinos[treino.TreAtvItem] = {...treino};
    }

    onRowEditSave(treino: TreinoatvModel) {
      let dados = {
        EmpIdf: treino.EmpIdf,
        TreIdf: treino.TreIdf,
        TreAtvItem: treino.TreAtvItem,
        TreAtvMin: treino.TreAtvMin
      };
      this.updateDadosTreinoAtv = this.srvTreinoatv.updateTreAtvDados(dados).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Atividade do treino atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.refresh();
        }
      );
    }

    onRowEditCancel(treino: TreinoatvModel, index: number) {
        this.Treinoatvs[index] = this.cloneTreinos[treino.TreAtvItem];
        delete this.cloneTreinos[treino.TreAtvItem];
    }
  
    openNew() {
      let p = JSON.stringify(this.Param);
      this.router.navigate(['treinoatv'], { queryParams: { Modo:'INSERT', TreAtvItem: 0, Param: p}});
    }
  
    editTreinoatv(Treinoatv: TreinoatvModel) {
      let p = JSON.stringify(this.Param);
      this.router.navigate(['treinoatv'], { queryParams: { Modo:'EDIT', TreAtvItem: Treinoatv.TreAtvItem, Param: p}});

    }

    deleteTreinoatv(Treinoatv: TreinoatvModel) {
      this.confirmationService.confirm({
        message: 'Confirma exclusão de <b>' + Treinoatv.TreAtvDesc + '</b> ?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Sim",
        rejectLabel: "Não",
        accept: () => {
          let dados = {
            EmpIdf: Treinoatv.EmpIdf,
            TreIdf: Treinoatv.TreIdf,
            TreAtvItem: Treinoatv.TreAtvItem
          };
          this.deleteDadosTreinoatv = this.srvTreinoatv.deleteTreAtvDados(dados).subscribe(
            () => {
              this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Treinoatv excluido!', life: 3000});
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
  
    retornar() {
      this.router.navigate(['treinolista']);
    }

    private refresh(){
      this.submitted = true;
      this.getTreinoatvs();
    }
  
    ngOnDestroy() {
      if ( this.lerDadosTreinoatv != null){
        this.lerDadosTreinoatv.unsubscribe();
      }
      if (this.deleteDadosTreinoatv != null){
        this.deleteDadosTreinoatv.unsubscribe();
      }
    }
  }
  
  