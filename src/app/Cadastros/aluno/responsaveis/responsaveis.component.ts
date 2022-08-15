import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AluRespModel } from 'src/app/model/aluresp.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { UsuarioService } from '../../usuario/usuario.service';
import { AluRespService } from './responsaveis.service';

@Component({
  selector: 'app-responsaveis',
  templateUrl: './responsaveis.component.html',
  styleUrls: ['./responsaveis.component.css'],
  providers: [ConfirmationService,AluRespService,MessageService,UsuarioService]  
})
export class ResponsaveisComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  private AluIdf;
  private aluno;

  deleteDadosResponsavel: Subscription;
  aadDadosResponsavel: Subscription;
  lerDadosResponsavel: Subscription;  
  lerDadosUsuario: Subscription;
  
  Responsaveis: AluRespModel[];
  submitted: boolean;
  isLoading = true;

  usuarios: DD[];
  usuSelect: string;
  
  constructor(private router: Router, private route: ActivatedRoute, 
    private srvResponsavel: AluRespService, 
    private srvUsuario: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.AluIdf = params.AluIdf;
        this.aluno = params.AluNome;
        this.getResponsavel();
      }
    );
    this.getUsuario();
  }

  private getResponsavel() {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };    
    this.lerDadosResponsavel = this.srvResponsavel.getTodosUsu(dados).subscribe(
      (dados) => {
        this.Responsaveis = JSON.parse(JSON.stringify(dados));
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

  private getUsuario() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.usuarios = [];
    this.lerDadosUsuario = this.srvUsuario.getTodos(dados).subscribe(
      (dadosRet:any) => {        
        dadosRet.forEach(element => {
            this.usuarios.push({
              name:  element.UsuIdf.toString() + "-" + element.UsuNome + " - " + element.UsuEmail,
              code: element.UsuIdf.toString()
            });
        });
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        return;
      });
  }

  incluirResponsavel()
  {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf,
      UsuIdf: parseInt(this.usuSelect)
    }
    this.aadDadosResponsavel = this.srvResponsavel.addDados(dados).subscribe(
      (retorno) => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Responsável incluido!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        if (!msg)
        {
          msg = err.error.msg;
        }
        if (msg.includes("MUST BE UNIQUE"))
        {
          msg = "Responsável já incluido!";
        }
        if (msg.includes("cannot be null"))
        {
          msg = "Selecione um Responsável!";
        }

        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        this.isLoading = false;
        this.getResponsavel();
      },
      () => {
        this.isLoading = false;
        this.getResponsavel();
      }
    );
  }

  deleteResponsavel(Responsavel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Responsavel.UsuNome + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Responsavel.EmpIdf,
          AluIdf: Responsavel.AluIdf,
          UsuIdf: Responsavel.UsuIdf
        };
        this.isLoading = true;
        this.deleteDadosResponsavel = this.srvResponsavel.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Responsável excluido!', life: 3000});
          },
          err => { 
            let msg = err.message; //error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.isLoading = false;
            this.getResponsavel();
          });
        }
    });
  }

  ngOnDestroy() {
    if ( this.lerDadosResponsavel != null){
      this.lerDadosResponsavel.unsubscribe();
    }
    if (this.deleteDadosResponsavel != null){
      this.deleteDadosResponsavel.unsubscribe();
    }
    if (this.aadDadosResponsavel != null){
      this.aadDadosResponsavel.unsubscribe();
    }
    if (this.lerDadosUsuario != null){
      this.lerDadosUsuario.unsubscribe();
    }
  }

  cancelar() {
    this.retorno(0);
  }

  private retorno(tempo=1010){
    setTimeout(() => 
    {
      this.router.navigate(['../alunolista'], {relativeTo: this.route});
    },
    tempo);
  }
}

interface DD {
  name: string,
  code: string
}
