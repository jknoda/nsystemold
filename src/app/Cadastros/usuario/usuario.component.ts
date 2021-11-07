import { Component, OnInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';
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
    this.usuidf = JSON.parse(localStorage.getItem('userData')).UsuIdf;
    if (this.usuidf != 0 && this.usuidf != null){
      this.editMode = true;
      let dados = {
        EmpIdf: this.EmpIdf,
        UsuIdf: this.usuidf
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
      EmpIdf: this.EmpIdf,
      UsuNome:  this.userForm.value['nome'],
      UsuCPF:  this.userForm.value['cpf'].replace(/[^\d]+/g,''),
      UsuLogradouro:  this.userForm.value['logradouro'],
      UsuLogNum:  this.userForm.value['lognum'],
      UsuBairro:  this.userForm.value['bairro'],
      UsuCidade:  this.userForm.value['cidade'],
      UsuUF:  this.userForm.value['uf'],
      UsuCelular:  this.userForm.value['celular'],
      UsuFone:  this.userForm.value['fone'],
      UsuPeso:  this.userForm.value['peso'],
      UsuAltura:  this.userForm.value['altura'],
      UsuDataNasc:  this.userForm.value['nascimento'],
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados,
        UsuIdf: this.usuidf
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
    let UserPeso = null;
    let UserAltura = null;
    let UserNascimento = null;
    if (dados != null)
    {
      UserNome = dados.UsuNome;
      UserCpf = dados.UsuCPF;
      UserLogradouro = dados.UsuLogradouro;
      UserLognum = dados.UsuLogNum;
      UserBairro = dados.UsuBairro;
      UserCidade = dados.UsuCidade;
      UserUf = dados.UsuUF;
      UserCelular = dados.UsuCelular;
      UserFone = dados.UsuFone;
      UserPeso = dados.UsuPeso;
      UserAltura = dados.UsuAltura;
      UserNascimento = dados.UsuDataNasc;

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
      'fone': new FormControl(UserFone),
      'peso': new FormControl(UserPeso),
      'altura': new FormControl(UserAltura),
      'nascimento': new FormControl(UserNascimento)
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
