import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';
import { QuizModel } from 'src/app/model/quiz.model';
import { QuizAlterModel } from 'src/app/model/quizalter.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { QuizrespService } from './quizresp.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-quizresp',
  templateUrl: './quizresp.component.html',
  styleUrls: ['./quizresp.component.css'],
  providers: [QuizrespService, MessageService]
})
export class QuizrespComponent implements OnInit, OnDestroy {

  Quiz: QuizModel;
  QuizAlternativas: QuizAlterModel[];
  selectedAlter: QuizAlterModel = null;

  lerQuiz: Subscription;
  addDadosQuizResp: Subscription;
  getDadosQuizAlter: Subscription;
  lerDadosQuizResp: Subscription;
  updateDadosQuizResp: Subscription;
  
  private EmpIdf: number = ServiceConfig.EMPIDF;
  editMode = false;

  UsuIdf = 0;
  UsuEmail = "";
  QuizIdf = 0;
  
  isLoading = true;
  existeInfo = false;
  mostraImagem = false;
  respostaCerta = false;

  quizImg: SafeResourceUrl;

  constructor(private srvQuizResp: QuizrespService, private route: ActivatedRoute, 
    private router: Router, private messageService: MessageService, private sanitizer:DomSanitizer) { 
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.QuizIdf = params.QuizIdf;
    });
    this.UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
    this.UsuEmail = JSON.parse(localStorage.getItem('userData')).email;
    this.getQuiz();
  }

  private getQuiz()
  {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf
    };
    this.lerQuiz = this.srvQuizResp.getDados(dados).subscribe(
      (dados) => {
        this.Quiz = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        if (this.Quiz.QuizImagem){
          let imagem = this.bin2String(this.Quiz.QuizImagem["data"]);
          this.quizImg = this.sanitizer.bypassSecurityTrustUrl(imagem);
        }
        this.isLoading = false;
        this.getAlter();
      });
  }

  private getAlter()
  {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf
    };
    this.lerQuiz = this.srvQuizResp.getAlternativas(dados).subscribe(
      (dados) => {
        this.QuizAlternativas = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.selectedAlter = this.QuizAlternativas[0];        
        return;
      });
  }

  alterClick(){
    this.mostraImagem = false;
  }

  responder(){
    this.mostraImagem = true;
    this.respostaCerta = this.selectedAlter.QuizCerta == 'S';
    this.existeInfo = this.selectedAlter.QuizResCompl != null && this.selectedAlter.QuizResCompl.length > 0;
    this.gravarResposta();
  }


  private gravarResposta()
  {
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.selectedAlter.QuizIdf,
      QuizRespEmail: this.UsuEmail,
      QuizResSeq: this.selectedAlter.QuizResSeq,
      QuizRespAcerto: this.selectedAlter.QuizCerta == 'S',
      UsuIdf: this.UsuIdf
    }
    this.addDadosQuizResp = this.srvQuizResp.addDados(dados).subscribe(
      (ret:any) => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Resposta concluída!'});
      },
      err => { 
        console.log('err',err);
        let msg = err.error.errors.toString();
        if (!msg)
        {
          msg = err.error.msg;
        }
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      }
    );
  }

  cancelar(){
    this.router.navigate(['../quizlista'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    if (this.lerQuiz != null){
      this.lerQuiz.unsubscribe();
    }
    if (this.addDadosQuizResp != null){
      this.addDadosQuizResp.unsubscribe();
    }
    if (this.getDadosQuizAlter != null){
      this.getDadosQuizAlter.unsubscribe();
    }
    if (this.lerDadosQuizResp != null){
      this.lerDadosQuizResp.unsubscribe();
    }
    if (this.updateDadosQuizResp != null){
      this.updateDadosQuizResp.unsubscribe();
    }
  
  }  

  bin2String(array) {
    var retorno = '';
    for(let j=0;j<array.length;j++){
      retorno = retorno + String.fromCharCode(array[j])
    }
    return retorno;
  }
}
