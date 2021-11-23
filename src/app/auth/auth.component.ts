import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {MessageService} from 'primeng/api';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',  
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: [ MessageService]
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  displayOk = false;
  aceito = false;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (!this.isLoginMode && !this.aceito)
    {
      this.messageService.add({severity:'error', summary: 'Erro', detail: "Clique em 'Concordo com a política de privacidade'!"});
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const passwordRep = form.value.passwordRep;

    let authObs: any; //Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
      .then(()=>{
        this.router.navigate(['']);
      }).catch(errorMessage=>{
        this.messageService.add({severity:'error', summary: 'Erro', detail: errorMessage});
      });
    } else {
      if (password != passwordRep){
        this.messageService.add({severity:'error', summary: 'Erro', detail: "Senha diferente da confirmação!"});
      }else{
        authObs = this.authService.signup(email, password)
        .then(()=>{
          this.router.navigate(['']);
        }).catch(errorMessage=>{
          this.messageService.add({severity:'error', summary: 'Erro', detail: errorMessage});
        });
      }
    }
    this.isLoading = false;
    form.reset();
  }

  clear() {
    this.messageService.clear();
  }  

  clickLer(){
    this.displayOk = true;
  }

  aceitoClick(){
    this.displayOk = false;
    this.aceito = true;
  }
}
