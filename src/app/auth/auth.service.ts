import { Injectable, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth } from "@angular/fire/auth";
import { TopoService } from '../principal/topo/topo.service';

import { User } from './user.model';
import { ServiceConfig } from '../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioModel } from '../model/usuario.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  private url: string = ServiceConfig.API_ENDPOINT;
  getUsuarioSubscription: Subscription;

   
  constructor(public auth: Auth, private router: Router, private http: HttpClient, private topoService: TopoService) {}
  ngOnDestroy(): void {
    this.getUsuarioSubscription.unsubscribe();
  }
   
  signup (email: string, password: string){
    //console.log(email,password);
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential)=>{
      //console.log('resp signup: ', userCredential);
      this.handleAuthentication(
        userCredential.user['email'],
        userCredential.user['reloadUserInfo']['localId'],
        userCredential.user['stsTokenManager']['accessToken'],
        +userCredential.user['stsTokenManager']['expirationTime']
      );
      this.topoService.isAuthenticated.emit(true);
      return userCredential;
    }).catch((error) => {
      this.topoService.isAuthenticated.emit(false);
      this.handleError(error);
    });
  }

  login (email: string, password: string){
    //console.log(email,password);
    return signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential)=>{
      this.handleAuthentication(
        userCredential.user['email'],
        userCredential.user['reloadUserInfo']['localId'],
        userCredential.user['stsTokenManager']['accessToken'],
        +userCredential.user['stsTokenManager']['expirationTime']
      );
      this.topoService.isAuthenticated.emit(true);
      return userCredential;
    }).catch((error) => {
      this.topoService.isAuthenticated.emit(false);
      this.handleError(error);
    });
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      empidf: number;
      usuidf: number;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.topoService.isAuthenticated.emit(false);    
    this.user.next(null);
    this.router.navigate(['auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    // this.tokenExpirationTimer = setTimeout(() => {
    //   console.log('auto logout');
    //   this.logout();
    // }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    // Buscar userid do sistema
    let dados = {
      EmpIdf: ServiceConfig.EMPIDF,
      UsuEmail: email
    };
    let empidf = dados.EmpIdf;
    let usuidf = 0;
    let perfil = 'U';
    this.getUsuarioSubscription = this.getUsuario(dados).subscribe(
      data => {
        if (typeof(data) != 'undefined' && data != null)
        {
          usuidf = data["UsuIdf"];
          perfil = data["UsuPerfil"];
        }
      },
      err => {
         console.log('ERRO:',err);
         this.handleError(err);
         this.router.navigate(["auth"]);
      },
      () => {
        const user = new User(email, userId, token, expirationDate, empidf, usuidf, perfil);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        if (usuidf == null || usuidf == 0){
          this.router.navigate(["usuario"]);
        }else{
          this.router.navigate(["home"]);
        }
      }
    )
  }

  private handleError(errorRes) {    
    let errorMessage = 'Erro!';
    let errorAux = errorRes.toString();
    if (errorAux.includes('email-already-in-use)'))
        errorMessage = 'Email já cadastrado.';
    if (errorAux.includes('wrong-password)'))
        errorMessage = 'Email/Senha inválido';
    if (errorAux.includes('user-not-found)'))
        errorMessage = 'Email/Senha inválido';
    throw errorMessage;  
  }

  private getUsuario(body:any): Observable<UsuarioModel> {
    let httpOptions = {
        headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    };        
    return this.http.post<UsuarioModel>(this.url + "/api/usuario/finduser", body, httpOptions);
  }
}
