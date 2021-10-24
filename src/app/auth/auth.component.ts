import { computeMsgId } from '@angular/compiler';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.error = null;
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: any; //Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
      .then(()=>{
        this.router.navigate(['home']);
      }).catch(errorMessage=>{
        this.error = errorMessage;
      });
    } else {
      authObs = this.authService.signup(email, password)
      .then(()=>{
        this.router.navigate(['home']);
      }).catch(errorMessage=>{
        this.error = errorMessage;
      });
    }
    this.isLoading = false;
    form.reset();
  }
}
