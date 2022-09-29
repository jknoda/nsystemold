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

  classes : DD[];
  categorias: DD[];
  selectedClasCode : string;
  selectedCatCode : string;

  CatIdf = 0;
  ClasIdf = 0;
  
  constructor(private router: Router, private srvJudocard: JudocardService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {
      this.categorias = [
        {name: 'Todas', code: '-1'},
        {name: 'KIHON-Fundamentos', code: '1'},
        {name: 'GOKYO', code: '2'},
        {name: 'KATAMEWAZA', code: '3'},
        {name: 'DIVERSOS', code: '4'},
        {name: 'SORTE ou REVES', code: '5'}
      ]

      this.classes = [
        {name: 'Todas', code: '-1'},
        {name: 'INFANTIL', code: '1'},
        {name: 'JUVENIL', code: '2'},
        {name: 'SÊNIOR', code: '3'},
        {name: 'GERAL', code: '4'}
      ]
  }

  ngOnInit() {
    this.getJudocard();
  }

  private getJudocard() {
    this.ClasIdf = parseInt(localStorage.getItem("clasidf"));
    this.CatIdf = parseInt(localStorage.getItem("catidf"));
    this.selectedCatCode = localStorage.getItem("catidf");
    this.selectedClasCode = localStorage.getItem("clasidf");
    let dadosParm = {
      CatIdf: this.CatIdf,
      ClasIdf: this.ClasIdf
    };
    this.lerDadosJudocard = this.srvJudocard.getTodos(dadosParm).subscribe(
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

  respostasJudocard(Judocard: JudocardModel) {
    this.router.navigate(['respcardlista'], { queryParams: { Modo:'LISTA', Idf: Judocard.Idf, Questao: Judocard.Desafio } });
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

  alterFiltro()
  {
    this.ClasIdf = parseInt(this.selectedClasCode);
    this.CatIdf = parseInt(this.selectedCatCode);
    localStorage.setItem('clasidf', this.selectedClasCode);
    localStorage.setItem('catidf', this.selectedCatCode);
    this.getJudocard();
  }

  private refresh(){
    this.submitted = true;
    this.getJudocard();
  }

  ngOnDestroy() {
    //localStorage.removeItem('catidf');
    //localStorage.removeItem('clasidf');
    if ( this.lerDadosJudocard != null){
      this.lerDadosJudocard.unsubscribe();
    }
    if (this.deleteDadosJudocard != null){
      this.deleteDadosJudocard.unsubscribe();
    }
  }
}

interface DD {
  name: string,
  code: string
}

