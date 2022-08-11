import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { JudoService } from './judo.service';
import { AluJudoModel } from 'src/app/model/alujudo.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-judolista',
  templateUrl: './judolista.component.html',
  styleUrls: ['./judo.component.css'],
  providers: [MessageService,ConfirmationService,JudoService]
})
export class JudolistaComponent implements OnInit , OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  AluIdf = 0;  
  aluno = '';

  deleteDadosAluJudo: Subscription;
  lerDadosAluJudo: Subscription;

  AluJudos: AluJudoModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  
  constructor(private router: Router, private route: ActivatedRoute,  private srvAluJudo: JudoService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.EmpIdf = params.EmpIdf;
      this.AluIdf = params.AluIdf;
      this.aluno = params.AluNome;
      this.getAluJudo();
    });
  }

  private getAluJudo() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };
    this.lerDadosAluJudo = this.srvAluJudo.getTodos(dados).subscribe(
      (dados) => {
        this.AluJudos = JSON.parse(JSON.stringify(dados));
        this.AluJudos.forEach(item=>{
          item.AluJuData = new Date(item.AluJuData);
          item.Data = item.AluJuData.getDate().toString() + '/' + (item.AluJuData.getMonth()+1).toString() + '/' + item.AluJuData.getFullYear().toString();
        })
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        return;
      });
  }

  openNew() {
    this.router.navigate(['judo'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, AluIdf: this.AluIdf, AluJuIdf:0, AluNome:this.aluno} });
  }

  editFaixa(AluJudo: AluJudoModel) {
    this.router.navigate(['judo'], { queryParams: { Modo:'EDIT', EmpIdf: AluJudo.EmpIdf, AluIdf: AluJudo.AluIdf, AluJuIdf:AluJudo.AluJuIdf, AluNome:this.aluno} });
  }

  deleteFaixa(AluJudo: AluJudoModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão da faixa ' + AluJudo.FaixaCor + ' ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: AluJudo.EmpIdf,
          AluIdf: AluJudo.AluIdf,
          AluJuIdf: AluJudo.AluJuIdf
        };
        this.isLoading = true;
        this.deleteDadosAluJudo = this.srvAluJudo.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'AluJudo excluido!', life: 3000});
          },
          err => { 
            let msg = err.message; //error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.isLoading = false;
            this.refresh();
          });
        }
    });
  }

  retornar(AluJudo: AluJudoModel) {
    this.router.navigate(['alunolista']); //, { queryParams: { EmpIdf: AluJudo.EmpIdf } });
  }

  private refresh(){
    this.submitted = true;
    this.getAluJudo();
  }

  ngOnDestroy() {
    if ( this.lerDadosAluJudo != null){
      this.lerDadosAluJudo.unsubscribe();
    }
    if (this.deleteDadosAluJudo != null){
      this.deleteDadosAluJudo.unsubscribe();
    }
  }
}
