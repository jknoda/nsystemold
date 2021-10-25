import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [UsuarioService]
})
export class UsuarioComponent implements OnInit {
  addDadosUsuario: Subscription;
  userForm: FormGroup;

  constructor(private srvUsuario: UsuarioService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    console.log('dados:', this.userForm);
    //this.srvUsuario.addDados(this.userForm.value);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {   
    let UserEmail = JSON.parse(localStorage.getItem('userData')).email;
    console.log('email:',UserEmail);
    let UserNome = null;
    let UserCpf = null;
    let UserLogradouro = null;
    let UserLognum = null;
    let UserBairro = null;
    let UserCidade = null;
    let UserUf = null;
    let UserCelular = null;
    let UserFone = null;
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

}
