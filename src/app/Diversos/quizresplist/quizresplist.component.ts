import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { DiversosService } from '../diversos.service';
import { QuizEstatRespModel } from 'src/app/model/quizestatresp.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quizresplist',
  templateUrl: './quizresplist.component.html',
  styleUrls: ['./quizresplist.component.css'],
  providers: [MessageService,ConfirmationService,DiversosService,MessageService]
})
export class QuizresplistComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = 0;

  deleteQuiz: Subscription;
  lerQuiz: Subscription;
  lerJaRespondeu: Subscription;

  Quizes: QuizEstatRespModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;

  constructor(private router: Router, private srvQuiz: DiversosService, 
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
    this.lerQuiz = this.srvQuiz.getDadosQuizRespList(dados).subscribe(
      (dados) => {
        this.Quizes = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        this.isLoading = false;
      },
      ()=>{
        this.isLoading = false;
        this.ajustar();
        return;
      });
  }

  ajustar(){
    this.isLoading = true;
    let quebra = -9;
    this.Quizes.forEach(item=>{
      item.First = 'N';
      if (item.QuizIdf != quebra)
      {
        item.First = 'S';
        quebra = item.QuizIdf;
      }
    });
    this.isLoading = false;
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
