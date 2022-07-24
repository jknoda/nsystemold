import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { QuestaoService } from './questoes.service';
import { QuizModel } from 'src/app/model/quiz.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questoeslista',
  templateUrl: './questoeslista.component.html',
  styleUrls: ['./questoes.component.css'],
  providers: [MessageService,ConfirmationService,QuestaoService]
})
export class QuestoeslistaComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  deleteDadosQuiz: Subscription;
  lerDadosQuiz: Subscription;
  statusDadosQuiz: Subscription;

  Questoes: QuizModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  
  constructor(private router: Router, private srvQuiz: QuestaoService, 
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
  alterQuiz(Quiz: QuizModel) {
    this.router.navigate(['quizalterlista'], { queryParams: { EmpIdf: this.EmpIdf, QuizIdf: Quiz.QuizIdf, QuizPergunta: Quiz.QuizPergunta } });
  }

  editQuiz(Quiz: QuizModel) {
    this.router.navigate(['questoes'], { queryParams: { Modo:'EDIT', EmpIdf: Quiz.EmpIdf, QuizIdf: Quiz.QuizIdf } });
  }

  deleteQuiz(Quiz: QuizModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Quiz.QuizPergunta + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Quiz.EmpIdf,
          QuizIdf: Quiz.QuizIdf
        };
        this.isLoading = true;
        this.deleteDadosQuiz = this.srvQuiz.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Quiz excluido!', life: 3000});
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
    this.getQuiz();
  }

  ngOnDestroy() {
    if ( this.lerDadosQuiz != null){
      this.lerDadosQuiz.unsubscribe();
    }
    if (this.deleteDadosQuiz != null){
      this.deleteDadosQuiz.unsubscribe();
    }
  }
}
