import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { QuizrespService } from './quizresp.service';
import { QuizModel } from 'src/app/model/quiz.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizlista',
  templateUrl: './quizlista.component.html',
  styleUrls: ['./quizresp.component.css'],
  providers: [MessageService,ConfirmationService,QuizrespService,MessageService]
})
export class QuizlistaComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = 0;

  deleteQuiz: Subscription;
  lerQuiz: Subscription;
  lerJaRespondeu: Subscription;

  Quizes: QuizModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;

  constructor(private router: Router, private srvQuiz: QuizrespService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
    this.getQuizes();
  }

  private getQuizes() {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerQuiz = this.srvQuiz.getTodos(dados).subscribe(
      (dados) => {
        this.Quizes = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        this.isLoading = false;
      },
      ()=>{
        this.VerRespondida();
        return;
      });
  }

  private VerRespondida()
  {
    this.isLoading = true;
    let ret = false;
    this.Quizes.forEach(item=>{
      if (item.QuizLiberado == 'S'){
        let data = new Date;
        let dataIni = new Date(item.QuizDataIni);
        let dataFim = new Date(item.QuizDataFim);
        item.QuizLiberado = 'N';
        if (data >= dataIni) item.QuizLiberado = 'S';
        if (data > dataFim) item.QuizLiberado = 'N';
      }
      let dados = {
        EmpIdf: item.EmpIdf,
        QuizIdf: item.QuizIdf,
        UsuIdf: this.UsuIdf
      };
      this.lerJaRespondeu = this.srvQuiz.getJaRespondeu(dados).subscribe(
        (dados) => {
          ret = dados;
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          this.isLoading = false;
        },
        ()=>{
          item.JaRespondeu = ret;
          this.isLoading = false;
      });
    })
  }

  responder(Quiz: QuizModel) {
    this.router.navigate(['quizresp'], { queryParams: { EmpIdf: Quiz.EmpIdf, QuizIdf: Quiz.QuizIdf} });
  }

  private refresh(){
    this.submitted = true;
    this.getQuizes();
  }

  ngOnDestroy() {
    if ( this.lerQuiz != null){
      this.lerQuiz.unsubscribe();
    }
    if ( this.lerJaRespondeu != null){
      this.lerJaRespondeu.unsubscribe();
    }    
  }

}
