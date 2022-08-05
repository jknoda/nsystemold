import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { QuestaoService } from './questoes.service';
import { QuizModel } from 'src/app/model/quiz.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-questoes',
  templateUrl: './questoes.component.html',
  styleUrls: ['./questoes.component.css'],
  providers: [ConfirmationService,QuestaoService,MessageService]
})
export class QuestoesComponent implements OnInit, OnDestroy{

  private EmpIdf: number = ServiceConfig.EMPIDF;
  private QuizIdf: number = 0;
  private Data: Date = new Date();
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  isTecnico = false;

  dadosForm: FormGroup;

  addDadosQuiz: Subscription;
  updateDadosQuiz: Subscription;
  deleteDadosQuiz: Subscription;
  lerDadosQuiz: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  uploadedFile : any;
  uploadedName: any;
  quizImg: SafeResourceUrl;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvQuiz: QuestaoService, 
    private messageService: MessageService,
    private sanitizer:DomSanitizer) {
  }
  
  ngOnDestroy(): void {
    if (this.lerDadosQuiz != null){
      this.lerDadosQuiz.unsubscribe();
    }
    if (this.addDadosQuiz != null){
      this.addDadosQuiz.unsubscribe();
    }
    if (this.updateDadosQuiz != null){
      this.updateDadosQuiz.unsubscribe();
    }
  }

  ngOnInit() {
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.Quizs();
  }

  private Quizs() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.QuizIdf = params.QuizIdf;
        if (params.Modo == "EDIT") {
          this.editMode = true;
          this.getQuiz();
        } else {
          this.editMode = false;
          let Quiz: QuizModel;
          this.initForm(Quiz);
        }
      }
      );
  }

  myUploader(event) {
    let fileReader = new FileReader();
    let _this = this;
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onloadend = function () {
          _this.ler(file.name, fileReader.result);
      };
    }
  }

  remove()
  {
    this.uploadedFile = null;
    this.uploadedName = null;
  }

  private ler(nome, arquivo)
  {
    this.uploadedFile = arquivo;
    this.uploadedName = nome;
    this.messageService.add({severity:'success', summary: 'Successo', detail: 'Imagem incluida!'});
  }

  private getQuiz() {
    let Quiz: QuizModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf
    };
    this.lerDadosQuiz = this.srvQuiz.getDados(dados).subscribe(
      (dados) => {
        Quiz = JSON.parse(JSON.stringify(dados));
        Quiz.QuizDataIni = new Date(dados.QuizDataIni);
        Quiz.QuizDataFim = new Date(dados.QuizDataFim);  
        if (Quiz.QuizDataIni.getFullYear() < 2000) Quiz.QuizDataIni = new Date;
        if (Quiz.QuizDataFim.getFullYear() < 2000){
          Quiz.QuizDataFim = new Date;
          Quiz.QuizDataFim.setDate(Quiz.QuizDataFim.getDate() + 10);
        }
        this.UsuIdf = Quiz.UsuIdf;
      },
      err => { 
        let msg = err.message; 
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Quiz);
      });
  }

  onSubmit() {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf,
      UsuIdf: this.UsuIdf,
      QuizData: this.Data,
      QuizImagem: this.uploadedFile,
      QuizPergunta: this.dadosForm.value['pergunta'],
      QuizLiberado: this.dadosForm.value['liberado'],
      QuizDataIni: this.dadosForm.value['inicio'],
      QuizDataFim: this.dadosForm.value['fim']
    }; 
    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosQuiz = this.srvQuiz.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Quiz atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.isLoading = false;
          this.retorno();
        }
      );
    }else{
      let dadosAdd = {
        ...dados
      }
      this.addDadosQuiz = this.srvQuiz.addDados(dadosAdd).subscribe(
        (ret:any) => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Quiz incluido!'});
          dados.QuizIdf = ret;
        },
        err => { 
          console.log('err',err);
          let msg = err.error.errors.toString();
          if (!msg)
          {
            msg = err.error.msg;
          }
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.isLoading = false;
          this.alterQuiz(dados);
        }
      );
    }
  }

  cancelar() {
    this.retorno(0);
  }

  private retorno(tempo=1010){
    setTimeout(() => 
    {
      this.router.navigate(['../questoeslista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:QuizModel) {   
    this.isLoading = false;
    let QuizPergunta = null;
    let QuizLiberado = 'N';
    let QuizDataIni = new Date;
    let QuizDataFim = new Date;
    QuizDataFim.setDate(QuizDataFim.getDate() + 30);
    if (dados != null)
    {
      QuizPergunta = dados.QuizPergunta;
      QuizLiberado = dados.QuizLiberado;
      if (dados.QuizImagem){
        let imagem = this.bin2String(dados.QuizImagem["data"]);
        this.quizImg = this.sanitizer.bypassSecurityTrustUrl(imagem);
      }
      QuizDataIni = dados.QuizDataIni;
      QuizDataFim = dados.QuizDataFim;
    }
    this.dadosForm = new FormGroup({
      'pergunta': new FormControl(QuizPergunta, Validators.required),
      'liberado': new FormControl(QuizLiberado),
      'inicio': new FormControl(QuizDataIni),
      'fim': new FormControl(QuizDataFim)
    });
  }

  bin2String(array) {
    var retorno = '';
    for(let j=0;j<array.length;j++){
      retorno = retorno + String.fromCharCode(array[j])
    }
    return retorno;
  }

  clear() {
    this.messageService.clear();
  }    

  alterQuiz(Quiz) {
    console.log(Quiz);
    this.router.navigate(['quizalterlista'], { queryParams: { EmpIdf: this.EmpIdf, QuizIdf: Quiz.QuizIdf, QuizPergunta: Quiz.QuizPergunta } });
  }

}