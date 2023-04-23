import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Quiz2respService } from './quiz2resp.service';
import { QuizModel } from 'src/app/model/quiz.model';
import {JudocardModel} from '../../../model/judocard.model';
import {TabImagensModel} from '../../../model/tabimagens.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TabimagensComponent } from 'src/app/Cadastros/tabimagens/tabimagens.component';

@Component({
  selector: 'app-quiz2lista',
  templateUrl: './quiz2lista.component.html',
  styleUrls: ['./quiz2resp.component.css'],
  providers: [MessageService,ConfirmationService,Quiz2respService,MessageService]
})
export class Quiz2listaComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = 0;
  UsuEmail = "";

  lerQuiz: Subscription;
  lerImagem: Subscription;
  lerJaRespondeu: Subscription;

  Quizes: JudocardModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  imagem: TabImagensModel;

  categorias: DD[];
  selectedCatCode : string;

  constructor(private router: Router, private srvQuiz: Quiz2respService, 
    private messageService: MessageService, private confirmationService: ConfirmationService, 
    private sanitizer:DomSanitizer) {
      this.categorias = [
        {name: 'Todas', code: '-1'},
        {name: 'KIHON-Fundamentos', code: '1'},
        {name: 'GOKYO', code: '2'},
        {name: 'KATAMEWAZA', code: '3'},
        {name: 'DIVERSOS', code: '4'}
      ]      
  }

  ngOnInit() {
    this.UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
    this.selectedCatCode = localStorage.getItem("selectedCatCode");
    this.UsuEmail = JSON.parse(localStorage.getItem('userData')).email;
    this.getQuizes();
  }

  private getQuizes() {
    this.isLoading = true;
    let catIdfFiltro = parseInt(this.selectedCatCode);
    if (!catIdfFiltro)
    {
      catIdfFiltro = -1;
    }
    let dados = {
      CatIdf: catIdfFiltro,
      ClasIdf: 0,
      Quiz: 'S'
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
        this.Embaralhar();
        this.VerRespondida();
        return;
      });
  }

  private Embaralhar()
  {
    let Aux : JudocardModel;
    let nMax = this.Quizes.length;
    for(let i=0; i<nMax; i++){
      let ind1 = Math.floor(Math.random() * this.Quizes.length);
      let ind2 = Math.floor(Math.random() * this.Quizes.length);
      Aux = this.Quizes[ind1];
      this.Quizes[ind1] = this.Quizes[ind2];
      this.Quizes[ind2] = Aux;
    }
  }

  private VerRespondida()
  {
    this.isLoading = true;
    let ret = false;
    this.Quizes.forEach(item=>{
      item.Desafio = item.Desafio.replace("ou EXECUTE","");
      item.QuizLiberado = 'S';
      if (this.UsuIdf != 0){
        let dados = {
          Idf: item.Idf,
          UsuIdf: this.UsuIdf,
          RespEmail: this.UsuEmail
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
      }
      else
      {
        item.JaRespondeu = false;
        this.isLoading = false;
      }
    })
  }

  private getImagem(imagemParm) {
    this.isLoading = true;
    let dados = {
      ImgNom: imagemParm
    };
    this.lerImagem = this.srvQuiz.getImagem(dados).subscribe(
      (dados) => {
        this.imagem = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        this.isLoading = false;
      },
      ()=>{
        return;
      });
  }

  responder(Quiz: JudocardModel) {
    this.router.navigate(['quiz2resp'], { queryParams: { Idf: Quiz.Idf} });
  }

  private refresh(){
    this.submitted = true;
    this.getQuizes();
  }

  alterFiltro()
  {
    localStorage.setItem('selectedCatCode', this.selectedCatCode);
    this.refresh();
  }

  ngOnDestroy() {
    if ( this.lerQuiz != null){
      this.lerQuiz.unsubscribe();
    }
    if ( this.lerJaRespondeu != null){
      this.lerJaRespondeu.unsubscribe();
    }    
    if ( this.lerImagem != null){
      this.lerImagem.unsubscribe();
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
interface DD {
  name: string,
  code: string
}