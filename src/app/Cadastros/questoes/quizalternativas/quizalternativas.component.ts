import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { QuizalterService } from './quizalter.service';
import { QuizAlterModel } from 'src/app/model/quizalter.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-quizalternativas',
  templateUrl: './quizalternativas.component.html',
  styleUrls: ['./quizalternativas.component.css'],
  providers: [ConfirmationService,QuizalterService,MessageService]
})
export class QuizalternativasComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  private QuizIdf: number = 0;
  QuizPergunta = '';
  QuizResSeq = 0;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  isTecnico = false;

  dadosForm: FormGroup;

  addDadosQuizAlt: Subscription;
  updateDadosQuizAlt: Subscription;
  lerDadosQuizAlt: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvQuizAlt: QuizalterService, 
    private messageService: MessageService) {
  }
  
  ngOnDestroy(): void {
    if (this.lerDadosQuizAlt != null){
      this.lerDadosQuizAlt.unsubscribe();
    }
    if (this.addDadosQuizAlt != null){
      this.addDadosQuizAlt.unsubscribe();
    }
    if (this.updateDadosQuizAlt != null){
      this.updateDadosQuizAlt.unsubscribe();
    }
  }

  ngOnInit() {
    this.QuizAlters();
  }

  private QuizAlters() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.QuizIdf = params.QuizIdf;
        this.QuizPergunta = params.QuizPergunta;
        this.QuizResSeq = params.QuizResSeq;
        if (params.Modo == "EDIT") {
          this.editMode = true;
          this.getQuizAlt();
        } else {
          this.editMode = false;
          let Quizalter: QuizAlterModel;
          this.initForm(Quizalter);
        }
      }
    );
  }

   private getQuizAlt() {
    let Quizalter: QuizAlterModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf,
      QuizResSeq: this.QuizResSeq
    };
    this.lerDadosQuizAlt = this.srvQuizAlt.getDados(dados).subscribe(
      (dados) => {
        Quizalter = JSON.parse(JSON.stringify(dados));
        this.UsuIdf = Quizalter.UsuIdf;
      },
      err => { 
        let msg = err.message; 
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Quizalter);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf,
      UsuIdf: this.UsuIdf,
      QuizResSeq: this.QuizResSeq,
      QuizResposta: this.dadosForm.value['resposta'],
      QuizCerta: this.dadosForm.value['certa'],
      QuizResCompl: this.dadosForm.value['complemento'],
    }; 
    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      //console.log(dadosUpdate);
      this.updateDadosQuizAlt = this.srvQuizAlt.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Resposta atualizada!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.retorno();
        }
      );
    }else{
      let dadosAdd = {
        ...dados
      }
      this.addDadosQuizAlt = this.srvQuizAlt.addDados(dadosAdd).subscribe(
        (ret:any) => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Resposta incluida!'});
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
          this.retorno();
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
      //this.router.navigate(['../quizalterlista'], {relativeTo: this.route});
      this.router.navigate(['quizalterlista'], { queryParams: { EmpIdf: this.EmpIdf, QuizIdf: this.QuizIdf, QuizPergunta: this.QuizPergunta } });
    },
    tempo);
  }

  private initForm(dados:QuizAlterModel) {   
    this.isLoading = false;
    let QuizResposta = null;
    let QuizCerta = 'N';
    let QuizResCompl = null;
  
    if (dados != null)
    {
      QuizResposta = dados.QuizResposta;
      QuizCerta = dados.QuizCerta;
      QuizResCompl = dados.QuizResCompl;
    }
    this.dadosForm = new FormGroup({
      'resposta': new FormControl(QuizResposta, Validators.required),
      'certa': new FormControl(QuizCerta),
      'complemento': new FormControl(QuizResCompl),
    });
  }

 
  clear() {
    this.messageService.clear();
  }    

}

