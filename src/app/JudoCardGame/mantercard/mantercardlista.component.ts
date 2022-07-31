import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { JudocardService } from '../judocard.service';
import { JudocardModel } from 'src/app/model/judocard.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-mantercardlista',
  templateUrl: './mantercardlista.component.html',
  styleUrls: ['./mantercard.component.css'],
  providers: [MessageService,ConfirmationService,JudocardService]
})
export class MantercardlistaComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  deleteDadosJudocard: Subscription;
  lerDadosJudocard: Subscription;
  statusDadosJudocard: Subscription;

  Judocards: JudocardModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  
  constructor(private router: Router, private srvJudocard: JudocardService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getJudocard();
  }

  private getJudocard() {
    this.lerDadosJudocard = this.srvJudocard.getTodos().subscribe(
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

  openNew() {
    this.router.navigate(['mantercard'], { queryParams: { Modo:'INSERT', Idf: 0 } });
  }

  editJudocard(Judocard: JudocardModel) {
    this.router.navigate(['mantercard'], { queryParams: { Modo:'EDIT', Idf: Judocard.Idf } });
  }

  deleteJudocard(Judocard: JudocardModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Judocard.Desafio + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          Idf: Judocard.Idf
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
