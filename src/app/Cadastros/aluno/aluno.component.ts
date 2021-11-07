import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AlunoService } from './aluno.service';
import { AlunoModel } from 'src/app/model/aluno.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [MessageService,ConfirmationService,AlunoService,MessageService]
})
export class AlunoComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  addDadosAluno: Subscription;
  updateDadosAluno: Subscription;
  deleteDadosAluno: Subscription;
  lerDadosAluno: Subscription;

  estados: UF[];
  selectedEstado: UF;
  
  alunoDialog: boolean;

  Alunos: AlunoModel[];

  Aluno: AlunoModel;

  submitted: boolean;

  isUpdate = true;

  constructor(private srvAluno: AlunoService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.estados = [
      {name: 'Acre', code: 'AC'},
      {name: 'Alagoas', code: 'AL'},
      {name: 'Amapá', code: 'AP'},
      {name: 'Amazonas', code: 'AM'},
      {name: 'Bahia', code: 'BA'},
      {name: 'Ceará', code: 'CE'},
      {name: 'Distrito Federal', code: 'DF'},
      {name: 'Espirito Santo', code: 'ES'},
      {name: 'Goiás', code: 'GO'},
      {name: 'Maranhão', code: 'MA'},
      {name: 'Mato Grosso do Sul', code: 'MS'},
      {name: 'Mato Grosso', code: 'MT'},
      {name: 'Minas Gerais', code: 'MG'},
      {name: 'Paraná', code: 'PR'},
      {name: 'Paraíba', code: 'PB'},
      {name: 'Pará', code: 'PA'},
      {name: 'Pernambuco', code: 'PE'},
      {name: 'Piauí', code: 'PI'},
      {name: 'Rio Grande do Norte', code: 'RN'},
      {name: 'Rio Grande do Sul', code: 'RS'},
      {name: 'Rio de Janeiro', code: 'RJ'},
      {name: 'Rondonia', code: 'RO'},
      {name: 'Roraima', code: 'RR'},
      {name: 'Santa Catarina', code: 'SC'},
      {name: 'Sergipe', code: 'SE'},
      {name: 'São Paulo', code: 'SP'},
      {name: 'Tocantins', code: 'TO'}
    ];    
   }

  ngOnInit() {
    this.getAlunos();
  }

  private getAlunos() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerDadosAluno = this.srvAluno.getTodos(dados).subscribe(
      (dados) => {
        this.Alunos = JSON.parse(JSON.stringify(dados));
        this.Alunos.forEach(item=>{
          item.AluDataNasc = new Date(item.AluDataNasc);
        })
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        return;
      });
  }

  openNew() {
    this.Aluno = new AlunoModel();
    this.submitted = false;
    this.alunoDialog = true;
    this.isUpdate = false;
  }

  editAluno(Aluno: AlunoModel) {
    this.isUpdate = true;
    this.Aluno = {...Aluno};
    this.alunoDialog = true;
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
        this.deleteDadosAluno = this.srvAluno.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Aluno excluido!', life: 3000});
          },
          err => { 
            let msg = err.error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.refresh();
          });
        }
    });
  }

  hideDialog() {
      this.alunoDialog = false;
      this.submitted = false;
  }

  saveAluno() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AluNome: this.Aluno.AluNome,
      AluCPF: this.Aluno.AluCPF,
      AluDataNasc: this.Aluno.AluDataNasc,
      AluNomeResp: this.Aluno.AluNomeResp,
      AluFoneResp: this.Aluno.AluFoneResp,
      AluFone: this.Aluno.AluFone,
      AluLogradouro: this.Aluno.AluLogradouro,
      AluLogNum: this.Aluno.AluLogNum,
      AluBairro: this.Aluno.AluBairro,
      AluCidade: this.Aluno.AluCidade,
      AluUF: this.Aluno.AluUF,
      AluEmail: this.Aluno.AluEmail,
      AluPeso: this.Aluno.AluPeso,
      AluAltura: this.Aluno.AluAltura,
      AluStatus: this.Aluno.AluStatus
    };    
    if (this.isUpdate){
      let dadosUpdate = {
        ...dados,
        AluIdf: this.Aluno.AluIdf
      }
      this.updateDadosAluno = this.srvAluno.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.refresh();
        }
      );
    }
    else{
      let dadosAdd = {
        ...dados
      }
      this.addDadosAluno = this.srvAluno.addDados(dadosAdd).subscribe(
        () => {
              this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno incluido!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.refresh();
        }
      );
    }
  }

  private refresh(){
    this.submitted = true;
    this.getAlunos();
    this.alunoDialog = false;
    this.Aluno = new AlunoModel();

  }

  ngOnDestroy() {
      this.addDadosAluno.unsubscribe();
      this.updateDadosAluno.unsubscribe();
      this.lerDadosAluno.unsubscribe();
      this.deleteDadosAluno.unsubscribe();
  }
}

interface UF {
  name: string,
  code: string
}