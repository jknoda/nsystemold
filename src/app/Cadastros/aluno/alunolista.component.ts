import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AlunoService } from './aluno.service';
import { AlunoModel } from 'src/app/model/aluno.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alunolista',
  templateUrl: './alunolista.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [MessageService,ConfirmationService,AlunoService]
})
export class AlunoListaComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  deleteDadosAluno: Subscription;
  lerDadosAluno: Subscription;
  lerDadosAnamnese: Subscription;
  statusDadosAluno: Subscription;

  Alunos: AlunoModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  isTecnico = false;
  
  constructor(private router: Router, private srvAluno: AlunoService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.isTecnico = (perfil == 'A' || perfil == 'T');
    this.getAlunos();
  }

  private getAlunos() {
    let usuidf = this.UsuIdf;
    if (this.isTecnico) usuidf = 0;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluStatus: 'X',
      UsuIdf: usuidf
    };
    this.lerDadosAluno = this.srvAluno.getAluTodosResp(dados).subscribe(
      (dados) => {
        this.Alunos = JSON.parse(JSON.stringify(dados));
        this.Alunos.forEach(item=>{
          item.AluDataNasc = new Date(item.AluDataNasc);
          item.isAtivo = item.AluStatus == 'A';
        })
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.verAnamnese();
        this.isLoading = false;
        return;
      });
  }

  private verAnamnese()
  {
    let ret = false;
    this.Alunos.forEach(item=>{
      let dados = {
        EmpIdf: item.EmpIdf,
        AluIdf: item.AluIdf
      };
      item.isUser = true; //(item.UsuIdf == this.UsuIdf);
      this.lerDadosAnamnese = this.srvAluno.hasAnamnese(dados).subscribe(
        (dados) => {
          ret = dados;
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          item.HasAnamnese = ret;
      });
    })
  }

  openNew() {
    this.router.navigate(['aluno'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, AluIdf: 0 } });
  }

  editAluno(Aluno: AlunoModel) {
    this.router.navigate(['aluno'], { queryParams: { Modo:'EDIT', EmpIdf: Aluno.EmpIdf, AluIdf: Aluno.AluIdf } });
  }

  anamneseAluno(Aluno: AlunoModel) {
    this.router.navigate(['anamnese'], { queryParams: { EmpIdf: Aluno.EmpIdf, AluIdf: Aluno.AluIdf, AluNome: Aluno.AluNome } });
  }

  alterarStatus(Aluno: AlunoModel) {
    this.isLoading = true;
    let stsTxt = "";
    if (Aluno.AluStatus == 'A'){
      Aluno.AluStatus = 'I';
      stsTxt = 'inativado';
    }else{
      Aluno.AluStatus = 'A';
      stsTxt = 'ativado';
    }
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: Aluno.AluIdf,
      AluStatus: Aluno.AluStatus
    };
    this.statusDadosAluno = this.srvAluno.statusAluDados(dados).subscribe(
      (ret) => {
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Aluno '+stsTxt+'!', life: 3000});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.refresh();
      });
  }

  deleteAluno(Aluno: AlunoModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Aluno.AluNome + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Aluno.EmpIdf,
          AluIdf: Aluno.AluIdf
        };
        this.isLoading = true;
        this.deleteDadosAluno = this.srvAluno.deleteAluDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Aluno excluido!', life: 3000});
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

  responsaveis(Aluno: AlunoModel) {
    this.router.navigate(['responsaveis'], { queryParams: { EmpIdf: Aluno.EmpIdf, AluIdf: Aluno.AluIdf, AluNome: Aluno.AluNome } });
  }

  judoAluno(Aluno: AlunoModel) {
    this.router.navigate(['judolista'], { queryParams: { EmpIdf: Aluno.EmpIdf, AluIdf: Aluno.AluIdf, AluNome:Aluno.AluNome } });
  }

  private refresh(){
    this.submitted = true;
    this.getAlunos();
  }

  ngOnDestroy() {
    if ( this.lerDadosAluno != null){
      this.lerDadosAluno.unsubscribe();
    }
    if (this.deleteDadosAluno != null){
      this.deleteDadosAluno.unsubscribe();
    }
  }
}
