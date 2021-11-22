import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { UsuarioService } from './usuario.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Usuariolista',
  templateUrl: './usuariolista.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [MessageService,ConfirmationService,UsuarioService,MessageService]
})
export class UsuarioListaComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  deleteDadosUsuario: Subscription;
  lerDadosUsuario: Subscription;

  Usuarios: UsuarioModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;

  constructor(private router: Router, private srvUsuario: UsuarioService, 
    private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getUsuarios();
  }

  private getUsuarios() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerDadosUsuario = this.srvUsuario.getTodos(dados).subscribe(
      (dados) => {
        this.Usuarios = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        return;
      });
  }

  editUsuario(Usuario: UsuarioModel) {
    this.router.navigate(['usuario'], { queryParams: { Modo:'EDIT', EmpIdf: Usuario.EmpIdf, UsuIdf: Usuario.UsuIdf , UsuEmail: Usuario.UsuEmail} });
  }

  deleteUsuario(Usuario: UsuarioModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Usuario.UsuNome + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Usuario.EmpIdf,
          UsuIdf: Usuario.UsuIdf
        };
        this.deleteDadosUsuario = this.srvUsuario.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Usuario excluido!', life: 3000});
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

  private refresh(){
    this.submitted = true;
    this.getUsuarios();
  }

  ngOnDestroy() {
    if ( this.lerDadosUsuario != null){
      this.lerDadosUsuario.unsubscribe();
    }
    if (this.deleteDadosUsuario != null){
      this.deleteDadosUsuario.unsubscribe();
    }
  }
}

