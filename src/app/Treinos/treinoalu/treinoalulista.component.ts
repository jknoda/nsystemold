import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TreinoaluModel } from 'src/app/model/treinoalu.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TreinoalunoService } from './treinoaluno.service';

@Component({
  selector: 'app-treinoalulista',
  templateUrl: './treinoalulista.component.html',
  styleUrls: ['./treinoalu.component.css'],
  providers: [MessageService,ConfirmationService,MessageService,TreinoalunoService]
})
export class TreinoalulistaComponent implements OnInit, OnDestroy {
    Param = {
      EmpIdf: 0,
      TreIdf: 0,
      TreTitulo: "",
      Data: ""
    }

    AluIdf = 0;

    totalQdeTxt = "";

    deleteDadosTreinoalu: Subscription;
    lerDadosTreinoalu: Subscription;
  
    Treinoalus: TreinoaluModel[];
    submitted: boolean;
    isUpdate = true;
    isLoading = true;
  
    constructor(private router: Router, private srvTreinoalu: TreinoalunoService, 
      private messageService: MessageService, private confirmationService: ConfirmationService,
      private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.route.queryParams
      .subscribe(params => {
        this.Param.EmpIdf = params.EmpIdf;
        this.Param.TreIdf = params.TreIdf;
        this.Param.TreTitulo = params.TreTitulo;
        this.Param.Data = params.Data;
        this.getTreinoalus();
      });
    }
  
    private getTreinoalus() {
      let dados = {
        EmpIdf: this.Param.EmpIdf,
        TreIdf: this.Param.TreIdf
      };
      this.lerDadosTreinoalu = this.srvTreinoalu.getTreAluTodos(dados).subscribe(
        (dados) => {
          this.Treinoalus = JSON.parse(JSON.stringify(dados));
          let qde = 0;
          this.Treinoalus.forEach(item=>{
            qde++;
          })
          this.totalQdeTxt = qde.toString() + " aluno" + (qde > 1 ?"s" : "");
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
      let p = JSON.stringify(this.Param);
      this.router.navigate(['treinoalu'], { queryParams: { Modo:'INSERT', AluIdf: 0, Param: p}});
    }
  
    editTreinoalu(Treinoalu: TreinoaluModel) {
      let p = JSON.stringify(this.Param);
      this.router.navigate(['treinoalu'], { queryParams: { Modo:'EDIT', AluIdf: Treinoalu.AluIdf, Param: p}});
    }

    deleteTreinoalu(Treinoalu: TreinoaluModel) {
      this.confirmationService.confirm({
        message: 'Confirma exclusão de <b>' + Treinoalu.TreAluNome + '</b> ?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Sim",
        rejectLabel: "Não",
        accept: () => {
          let dados = {
            EmpIdf: Treinoalu.EmpIdf,
            TreIdf: Treinoalu.TreIdf,
            AluIdf: Treinoalu.AluIdf
          };
          this.deleteDadosTreinoalu = this.srvTreinoalu.deleteTreAluDados(dados).subscribe(
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
  
    retornar() {
      this.router.navigate(['treinolista']);
    }

    private refresh(){
      this.submitted = true;
      this.getTreinoalus();
    }
  
    ngOnDestroy() {
      if ( this.lerDadosTreinoalu != null){
        this.lerDadosTreinoalu.unsubscribe();
      }
      if (this.deleteDadosTreinoalu != null){
        this.deleteDadosTreinoalu.unsubscribe();
      }
    }
  }
  
  