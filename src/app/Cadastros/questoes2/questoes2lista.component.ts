import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Questao2Service } from './questoes2.service';
import { QuizModel } from 'src/app/model/quiz.model';
import { JudocardModel } from 'src/app/model/judocard.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questoes2lista',
  templateUrl: './questoes2lista.component.html',
  styleUrls: ['../questoes/questoes.component.css'],
  providers: [MessageService,ConfirmationService,Questao2Service]
})
export class Questoes2listaComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  lerDadosQuiz: Subscription;
  updateDadosQuiz: Subscription;

  Questoes: JudocardModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  
  constructor(private router: Router, private srvQuiz: Questao2Service, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getQuiz();
  }

  private getQuiz() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerDadosQuiz = this.srvQuiz.getTodos(dados).subscribe(
      (dados) => {
        this.Questoes = JSON.parse(JSON.stringify(dados));
        /*
        this.Questoes.forEach(item=>{
          let data = new Date;
          data = new Date(data.getFullYear(), data.getMonth(), data.getDate()); // data sem hh
          let dataIni = new Date(item.QuizDataIni);
          let dataFim = new Date(item.QuizDataFim);
          if (dataIni >= data && dataIni.getFullYear() > 2000) item.Vencido = 'NÃO';
          if (data > dataFim && dataFim.getFullYear() > 2000) item.Vencido = 'SIM';
          item.DataInicio = dataIni.getFullYear().toString() + '/' + (dataIni.getMonth()+1).toString() + '/' + dataIni.getDate().toString();
          item.DataFim = dataFim.getFullYear().toString() + '/' + (dataFim.getMonth()+1).toString() + '/' + dataFim.getDate().toString();
        });
        */
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
    this.router.navigate(['questoes'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, QuizIdf: 0 } });
  }
 
  liberarQuiz(Quiz: JudocardModel) {
    this.isLoading = true;
    let liberado = Quiz.Quiz;
    let texto = 'liberado';
    if (liberado == 'S'){
       liberado = 'N';
       texto = 'bloqueado';
    }
    else {
       liberado = 'S';
       texto = 'liberado';
    }
    let dados = {
      Idf: Quiz.Idf,
      Quiz: liberado
    }; 
    
    let dadosUpdate = {
      ...dados
    }
    this.updateDadosQuiz = this.srvQuiz.updateDados(dadosUpdate).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Quiz '+texto+'!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.isLoading = false;
        this.refresh();
      }
    );
  }

  private refresh(){
    this.submitted = true;
    this.getQuiz();
  }

  ngOnDestroy() {
    if ( this.lerDadosQuiz != null){
      this.lerDadosQuiz.unsubscribe();
    }
    if (this.updateDadosQuiz != null){
      this.updateDadosQuiz.unsubscribe();
    }
  }
}
