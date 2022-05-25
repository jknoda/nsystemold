import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  lerDadosUsuario: Subscription;
  updateDadosUsuario: Subscription;
  userForm: FormGroup;

  private EmpIdf: number = ServiceConfig.EMPIDF;
  editMode = false;

  perfis: DropDown[];
  selectedPerfil: DropDown;
  UsuIdf = 0;
  UsuPerfil = 'U';
  UsuEmail = "";
  
  isAdm = false;
  isLoading = true;
  viaLista = false;
  //acessoSubscription: Subscription;

  constructor(private srvUsuario: UsuarioService, private route: ActivatedRoute, private router: Router, private messageService: MessageService) { 
    this.perfis = [
      {name: 'Administrador', code: 'A'},
      {name: 'Técnico', code: 'T'},
      {name: 'Auxiliar Técnico', code: 'X'},
      {name: 'Usuário', code: 'U'}
    ];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.Modo == "EDIT")
      {
        this.EmpIdf = params.EmpIdf;
        this.UsuIdf = params.UsuIdf;
        this.UsuEmail = params.UsuEmail;
        this.viaLista = true;
        this.editMode = true;
      } else{
        this.viaLista = false;
      }
    });
    if (!this.viaLista){
      this.UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
      this.UsuEmail = JSON.parse(localStorage.getItem('userData')).email;
    }    
    if (this.UsuIdf == null || this.UsuIdf == 0)
    {
      // Incluir usuario
      let dados = {
        EmpIdf: this.EmpIdf,
        UsuEmail: this.UsuEmail,
        UsuNome:  this.UsuEmail,
        UsuCPF:  0,
        UsuPerfil:  'U',
        ReceberEmail: 'S'
      };
      this.incluirUser(dados);
    }
    else
    {
      this.editUser();
    }
  }

  editUser()
  {    
    if (this.UsuIdf != 0 && this.UsuIdf != null){
      this.editMode = true;
      let dados = {
        EmpIdf: this.EmpIdf,
        UsuIdf: this.UsuIdf
      };
      let dadosOk : UsuarioModel;
      this.addDadosUsuario = this.srvUsuario.getDados(dados).subscribe(
        (dados) => {
          dadosOk = dados;
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.isLoading = false;
          this.initForm(dadosOk);      
        }
      );
    }   
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      UsuEmail: this.userForm.value['email'],
      UsuNome:  this.userForm.value['nome'],
      UsuCPF:  this.userForm.value['cpf'].replace(/[^\d]+/g,''),
      UsuPerfil:  this.userForm.value['perfil'],
      ReceberEmail: this.userForm.value['receberEmail']
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados,
        UsuIdf: this.UsuIdf,
      }
      console.log("update ",dadosUpdate);
      this.updateDadosUsuario = this.srvUsuario.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Cadastro atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        ()=>{
          this.isLoading = false;
          this.retorno();
        }
      );
    }else{
      this.incluirUser(dados);
    }
  }

  incluirUser(dados)
  {
    let dadosAdd = {
      ...dados,
      UsuEmail: this.UsuEmail
    }
    this.addDadosUsuario = this.srvUsuario.addDados(dadosAdd).subscribe(
      (ret) => {
          let user = JSON.parse(localStorage.getItem('userData'));
          user.usuidf = ret;
          this.UsuIdf = user.usuidf;
          localStorage.setItem('userData', JSON.stringify(user));
          //let dados = {
            //Origem: 'A',
            //Usuario: user.nome,
            //Email: user.email,
            //UsuIdf: user.usuidf
          //};
          //this.acessoSubscription = this.srvUsuario.saveAcesso(dados).subscribe();            
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Cadastro incluido!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        if (msg.includes('usuemail_UNIQUE')){
          msg = 'Email já cadastrado!';
        }
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(null);
        this.editMode = true;
        this.editUser();
      }
    );
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm(dados:UsuarioModel) {   
    this.isLoading = false;
    let UserEmail = this.UsuEmail;
    let UserNome = null;
    let UserCpf = null;
    let UserPerfil = 'U';
    let ReceberEmail = 'S';
    if (dados != null)
    {
      UserNome = dados.UsuNome;
      UserCpf = dados.UsuCPF;
      UserPerfil = dados.UsuPerfil;
      ReceberEmail = dados.ReceberEmail;
    }
    let meuPerfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.isAdm = meuPerfil == 'A';
    this.userForm = new FormGroup({
      'email': new FormControl(UserEmail, Validators.required),
      'nome': new FormControl(UserNome, Validators.required),
      'cpf': new FormControl(UserCpf, Validators.required),
      'perfil': new FormControl(UserPerfil, Validators.required),
      'receberEmail': new FormControl(ReceberEmail, Validators.required)
    });
  }

  cancelar() {
    this.retorno(0);
  }

  private retorno(tempo=1010){
    if (this.viaLista)
    {
      setTimeout(() => 
      {
        this.router.navigate(['../usuariolista'], {relativeTo: this.route});
      },
      tempo);
    }
  }

  clear() {
    this.messageService.clear();
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
    if (this.lerDadosUsuario != null){
      this.lerDadosUsuario.unsubscribe();
    }
    //if (this.acessoSubscription != null){
//      this.acessoSubscription.unsubscribe();
    //}
  }  
}

interface DropDown {
  name: string,
  code: string
}
