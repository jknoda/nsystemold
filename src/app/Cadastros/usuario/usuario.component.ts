import { Component, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { discardPeriodicTasks } from '@angular/core/testing';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';
import { mergeScan } from 'rxjs/operators';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [UsuarioService, MessageService]
})

export class UsuarioComponent implements OnInit, OnDestroy {
  addDadosUsuario: Subscription;
  getDadosUsuario: Subscription;
  updateDadosUsuario: Subscription;
  userForm: FormGroup;

  private EmpIdf: number = ServiceConfig.EMPIDF;
  editMode = false;

  estados: UF[];
  selectedEstado: UF;
  usuidf = 0;

  isLoading = true;

  constructor(private srvUsuario: UsuarioService, private route: ActivatedRoute, private router: Router, private messageService: MessageService) { 
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
  ngOnDestroy(): void {
    if (this.addDadosUsuario != null){
      this.addDadosUsuario.unsubscribe();
    }
    if (this.getDadosUsuario != null){
      this.getDadosUsuario.unsubscribe();
    }
    if (this.updateDadosUsuario != null){
      this.updateDadosUsuario.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.usuidf = JSON.parse(localStorage.getItem('userData')).usuidf;
    if (this.usuidf != 0 && this.usuidf != null){
      this.editMode = true;
      let dados = {
        empidf: this.EmpIdf,
        usuidf: this.usuidf
      };
      let dadosOk : UsuarioModel;
      this.addDadosUsuario = this.srvUsuario.getDados(dados).subscribe(
        (dados) => {
          dadosOk = dados;
        },
        err => { 
          let msg = err.error.errors.toString();
          if (msg.includes('usuemail_UNIQUE')){
            msg = 'Email já cadastrado!';
          }
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.initForm(dadosOk);      
        }
      );
    }
    else {
      this.editMode = false;
      this.initForm(null);
    }    
  }

  onSubmit() {
    let dados = {
      empidf: this.EmpIdf,
      usunome:  this.userForm.value['nome'],
      usucpf:  this.userForm.value['cpf'].replace(/[^\d]+/g,''),
      usulogradouro:  this.userForm.value['logradouro'],
      usulognum:  this.userForm.value['lognum'],
      usubairro:  this.userForm.value['bairro'],
      usucidade:  this.userForm.value['cidade'],
      usuuf:  this.userForm.value['uf'],
      usucelular:  this.userForm.value['celular'],
      usufone:  this.userForm.value['fone']
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados,
        usuidf: this.usuidf
      }
      this.updateDadosUsuario = this.srvUsuario.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Cadastro atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        }
      );
    }else{
      let dadosAdd = {
        ...dados,
        usuemail: this.userForm.value['email']
      }
      this.addDadosUsuario = this.srvUsuario.addDados(dadosAdd).subscribe(
        () => {
              this.messageService.add({severity:'success', summary: 'Successo', detail: 'Cadastro incluido!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          if (msg.includes('usuemail_UNIQUE')){
            msg = 'Email já cadastrado!';
          }
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        }
      );
    }
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm(dados:UsuarioModel) {   
    this.isLoading = false;
    let UserEmail = JSON.parse(localStorage.getItem('userData')).email;
    let UserNome = null;
    let UserCpf = null;
    let UserLogradouro = null;
    let UserLognum = null;
    let UserBairro = null;
    let UserCidade = null;
    let UserUf = "SP";
    let UserCelular = null;
    let UserFone = null;
    if (dados != null)
    {
      UserNome = dados.usunome;
      UserCpf = dados.usucpf;
      UserLogradouro = dados.usulogradouro;
      UserLognum = dados.usulognum;
      UserBairro = dados.usubairro;
      UserCidade = dados.usucidade;
      UserUf = dados.usuuf;
      UserCelular = dados.usucelular;
      UserFone = dados.usufone
    }
    this.userForm = new FormGroup({
      'email': new FormControl(UserEmail, Validators.required),
      'nome': new FormControl(UserNome, Validators.required),
      'cpf': new FormControl(UserCpf, Validators.required),
      'logradouro': new FormControl(UserLogradouro),
      'lognum': new FormControl(UserLognum),
      'bairro': new FormControl(UserBairro),
      'cidade': new FormControl(UserCidade),
      'uf': new FormControl(UserUf),
      'celular': new FormControl(UserCelular),
      'fone': new FormControl(UserFone)
    });
  }

  clear() {
    this.messageService.clear();
  }  
}

interface UF {
  name: string,
  code: string
}
