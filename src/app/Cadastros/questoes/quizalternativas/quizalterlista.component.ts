import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { QuizalterService } from './quizalter.service';
import { QuizAlterModel } from 'src/app/model/quizalter.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quizalterlista',
  templateUrl: './quizalterlista.component.html',
  styleUrls: ['./quizalternativas.component.css'],
  providers: [MessageService,ConfirmationService,QuizalterService]
})
export class QuizalterlistaComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private QuizIdf = 0;
  QuizPergunta = '';
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  deleteDados: Subscription;
  lerDados: Subscription;

  Alternativas: QuizAlterModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  
  constructor(private router: Router, private srvQuizAlter: QuizalterService,  private route: ActivatedRoute, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.QuizIdf = params.QuizIdf;
        this.QuizPergunta = params.QuizPergunta;
        this.getAlter();
      }
    );
  }

  private getAlter() {
    let dados = {
      EmpIdf: this.EmpIdf,
      QuizIdf: this.QuizIdf
    };
    this.lerDados = this.srvQuizAlter.getTodos(dados).subscribe(
      (dados) => {
        this.Alternativas = JSON.parse(JSON.stringify(dados));
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

  retornar(){
    this.router.navigate(['questoeslista']);
  }

  openNew() {
    this.router.navigate(['quizalter'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, QuizIdf: this.QuizIdf, QuizResSeq: 0, QuizPergunta: this.QuizPergunta } });
  }

  editar(Quizalter: QuizAlterModel) {
    this.router.navigate(['quizalter'], { queryParams: { Modo:'EDIT', EmpIdf: Quizalter.EmpIdf, QuizIdf: Quizalter.QuizIdf, QuizResSeq: Quizalter.QuizResSeq, QuizPergunta: this.QuizPergunta } });
  }

  deletar(Quizalter: QuizAlterModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Quizalter.QuizResposta + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: this.EmpIdf,
          QuizIdf: Quizalter.QuizIdf,
          QuizResSeq: Quizalter.QuizResSeq
        };
        this.isLoading = true;
        this.deleteDados = this.srvQuizAlter.deleteDados(dados).subscribe(
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
    this.getAlter();
  }

  ngOnDestroy() {
    if ( this.lerDados != null){
      this.lerDados.unsubscribe();
    }
    if (this.deleteDados != null){
      this.deleteDados.unsubscribe();
    }
  }
}
