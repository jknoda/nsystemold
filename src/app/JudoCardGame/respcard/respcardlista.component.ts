import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { RespcardService } from './respcard.service';
import { JudocardrespModel } from 'src/app/model/judocardresp.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-mantercardlista',
  templateUrl: './respcardlista.component.html',
  styleUrls: ['./respcard.component.css'],
  providers: [MessageService,ConfirmationService,RespcardService]
})
export class RespcardlistaComponent implements OnInit, OnDestroy {

  deleteDadosJudocard: Subscription;
  lerDadosJudocard: Subscription;
  statusDadosJudocard: Subscription;

  Judocards: JudocardrespModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;

  Idf = 0;
  Questao = "";
  
  constructor(private router: Router,private route: ActivatedRoute,  private srvJudocard: RespcardService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.Idf = params.Idf;
        this.Questao = params.Questao;
      })
    this.getJudocard();
  }

  private getJudocard() {
    let dados = {
      Idf: this.Idf
    };
    this.lerDadosJudocard = this.srvJudocard.getTodos(dados).subscribe(
      (dados) => {
        this.Judocards = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.message;
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        return;
      });
  }

  openNew(Judocard: JudocardrespModel) {
    this.router.navigate(['respcard'], { queryParams: { Modo:'INSERT', Idf: this.Idf, IdfSeq: 0, Questao: this.Questao } });
  }

  editJudocard(Judocard: JudocardrespModel) {
    this.router.navigate(['respcard'], { queryParams: { Modo:'EDIT', Idf: this.Idf, IdfSeq: Judocard.IdfSeq, Questao: this.Questao } });
  }

  deleteJudocard(Judocard: JudocardrespModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Judocard.RespostaTxt + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          Idf: Judocard.Idf,
          IdfSeq: Judocard.IdfSeq
        };
        this.isLoading = true;
        this.deleteDadosJudocard = this.srvJudocard.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Judocard excluido!', life: 3000});
          },
          err => { 
            let msg = err.message; 
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.isLoading = false;
            this.refresh();
          });
        }
    });
  }
  retornar(){
    this.router.navigate(['mantercardlista']);
  }
  private refresh(){
    this.submitted = true;
    this.getJudocard();
  }

  ngOnDestroy() {
    if ( this.lerDadosJudocard != null){
      this.lerDadosJudocard.unsubscribe();
    }
    if (this.deleteDadosJudocard != null){
      this.deleteDadosJudocard.unsubscribe();
    }
  }
}
