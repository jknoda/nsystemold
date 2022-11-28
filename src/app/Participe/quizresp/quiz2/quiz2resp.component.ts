import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';
import { QuizModel } from 'src/app/model/quiz.model';
import { QuizAlterModel } from 'src/app/model/quizalter.model';
import { TabImagensModel } from 'src/app/model/tabimagens.model';
import {JudocardModel} from '../../../model/judocard.model';
import { JudocardrespModel } from 'src/app/model/judocardresp.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Quiz2respService } from './quiz2resp.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-quiz2resp',
  templateUrl: './quiz2resp.component.html',
  styleUrls: ['./quiz2resp.component.css'],
  providers: [Quiz2respService, MessageService]
})
export class Quiz2respComponent implements OnInit, OnDestroy {

  Quiz: JudocardModel;
  QuizAlternativas: JudocardrespModel[];
  selectedAlter: JudocardrespModel = null;

  Imagem: TabImagensModel;

  lerQuiz: Subscription;
  lerImagem: Subscription;
  addDadosQuizResp: Subscription;
  getDadosQuizAlter: Subscription;
  lerDadosQuizResp: Subscription;
  updateDadosQuizResp: Subscription;
  
  private EmpIdf: number = ServiceConfig.EMPIDF;
  editMode = false;

  Idf = 0;

  UsuIdf = 0;
  UsuEmail = "";
  QuizIdf = 0;
  QuizNome = "";
  
  isLoading = true;
  existeInfo = false;
  mostraImagem = false;
  respostaCerta = false;

  quizImg: SafeResourceUrl;

  constructor(private srvQuizResp: Quiz2respService, private route: ActivatedRoute, 
    private router: Router, private messageService: MessageService, private sanitizer:DomSanitizer) { 
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.Idf = params.Idf;
    });
    this.UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
    this.UsuEmail = JSON.parse(localStorage.getItem('userData')).email;
    this.QuizNome = JSON.parse(localStorage.getItem('userData')).nome;
    this.getQuiz();
  }

  private getQuiz()
  {
    this.isLoading = true;
    let dados = {
      Idf: this.Idf
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
        this.Quiz.Desafio = this.Quiz.Desafio.replace("ou EXECUTE","");
        if (this.Quiz.ImgNom){
          this.getImagem(this.Quiz.ImgNom)
        }
        else
        {
          this.isLoading = false;
          this.getAlter();
        }
      });
  }

  private getImagem(imgNom)
  {
    this.isLoading = true;
    let dados = {
      ImgNom: imgNom
    };
    this.lerImagem = this.srvQuizResp.getImagem(dados).subscribe(
      (dados) => {
        this.Imagem = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        let imagem = this.bin2String(this.Imagem.Imagem["data"]);
        this.quizImg = this.sanitizer.bypassSecurityTrustUrl(imagem);
        this.isLoading = false;
        this.getAlter();
        return;
      });
  }

  private getAlter()
  {
    this.isLoading = true;
    let dados = {
      Idf: this.Idf
    };
    this.lerQuiz = this.srvQuizResp.getAlternativas(dados).subscribe(
      (dados) => {
        this.QuizAlternativas = JSON.parse(JSON.stringify(dados));
        // embaralhar
        let QuizAux: JudocardrespModel; 
        for(let i=0; i<100; i++){
          let qde = this.QuizAlternativas.length;
          let ind1 = Math.floor(Math.random() * qde);
          let ind2 = Math.floor(Math.random() * qde);
          QuizAux = this.QuizAlternativas[ind1];
          this.QuizAlternativas[ind1] = this.QuizAlternativas[ind2];
          this.QuizAlternativas[ind2] = QuizAux;
        }
        let ok = (this.QuizAlternativas.filter(x=>x.Correto == "S").length > 1);
        while (ok){
          let ind = this.QuizAlternativas.findIndex(x=>x.Correto == "S");
          this.QuizAlternativas.splice(ind,1);
          ok = (this.QuizAlternativas.filter(x=>x.Correto == "S").length > 1);
        }
        ok = (this.QuizAlternativas.length > 4)
        while (ok){
          let ind = this.QuizAlternativas.findIndex(x=>x.Correto != "S");
          this.QuizAlternativas.splice(ind,1);
          ok = (this.QuizAlternativas.filter(x=>x.Correto == "S").length > 1);
        }        
        this.QuizAlternativas.forEach(item=>{
          if (item.ImgNom)
          {
            let dados = {
              ImgNom: item.ImgNom
            };
            this.lerImagem = this.srvQuizResp.getImagem(dados).subscribe(
              (dados) => {
                this.Imagem = JSON.parse(JSON.stringify(dados));
              },
              err => { 
                let msg = err.error.errors.toString();
                this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
              },
              ()=>{
                let imagem = this.bin2String(this.Imagem.Imagem["data"]);
                item.Img= this.sanitizer.bypassSecurityTrustUrl(imagem);
              });
          }
        });        
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
    this.respostaCerta = this.selectedAlter.Correto == 'S';
    this.existeInfo = null; //this.selectedAlter.QuizResCompl != null && this.selectedAlter.QuizResCompl.length > 0;
    this.gravarResposta();
  }

  private gravarResposta()
  {
    let dados = {
      Idf: this.Idf,
      RespEmail: this.UsuEmail,
      IdfSeq: this.selectedAlter.IdfSeq,
      RespAcerto: this.selectedAlter.Correto == 'S',
      UsuIdf: this.UsuIdf,
      Nome: this.QuizNome
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
    this.router.navigate(['../quiz2lista'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    if (this.lerQuiz != null){
      this.lerQuiz.unsubscribe();
    }
    if (this.lerImagem != null){
      this.lerImagem.unsubscribe();
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
