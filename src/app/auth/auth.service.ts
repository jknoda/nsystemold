import { Injectable, OnDestroy  } from '@angular/core';
import { Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth, user } from "@angular/fire/auth";
import { TopoService } from '../principal/topo/topo.service';

import { User } from './user.model';
import { ServiceConfig } from '../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioModel } from '../model/usuario.model';
import { ConfiguracaoService } from '../shared/configuracao.service';

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

  getConfigSubscription: Subscription;
  acessoSubscription: Subscription;
   
  constructor(public auth: Auth, private router: Router, private http: HttpClient, private topoService: TopoService, private configSrv: ConfiguracaoService) {}
   
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
      perfil: string;
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
    localStorage.removeItem('emailConfig');
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
    let nome = "";
    this.getUsuarioSubscription = this.getUsuario(dados).subscribe(
      data => {
        if (typeof(data) != 'undefined' && data != null)
        {
          usuidf = data["UsuIdf"];
          perfil = data["UsuPerfil"];
          nome = data["UsuNome"];
          if (nome == null || nome == "")
            nome = email;
        }else{
          nome = email;
        }
      },
      err => {
         console.log('ERRO:',err);
         this.handleError(err);
         this.router.navigate(["auth"]);
      },
      () => {
        const user = new User(email, userId, token, expirationDate, empidf, usuidf, perfil, nome);
        this.setEmail(empidf);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
        if (usuidf == null || usuidf == 0){
          this.router.navigate(["usuario"]);
        }else{
          this.acesso(user);
          this.router.navigate(["home"]);
        }
      }
    )
  }

  private acesso(user)
  {
    let dados = {
      Origem: 'A',
      Usuario: user.nome,
      Email: user.email,
      UsuIdf: user.usuidf
    };
    this.acessoSubscription = this.saveAcesso(dados).subscribe();
  }

  private setEmail(EmpIdf){
    let dados = {
      EmpIdf,
      CfgIdfArray: [10,11,12,13,14]

    }
    this.getConfigSubscription = this.configSrv.findArray(dados).subscribe(
      data => {
        let emailConfig = {
          "service": data[0].CfgVlrStr,
          "user": data[1].CfgVlrStr,
          "pass": data[2].CfgVlrStr,
          "from": data[3].CfgVlrStr,
          "to": data[4].CfgVlrStr,
          "subject": "",
          "text": "",
          "html": ""
        };
        localStorage.setItem('emailConfig', JSON.stringify(emailConfig));
    });
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

  getUsuario(body:any): Observable<UsuarioModel> {
    let httpOptions = {
        headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    };        
    return this.http.post<UsuarioModel>(this.url + "/api/usuario/finduser", body, httpOptions);
  }

  saveAcesso(body:any): Observable<UsuarioModel> {
    let httpOptions = {
        headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
    };        
    return this.http.post<UsuarioModel>(this.url + "/api/acesso/create", body, httpOptions);
  }

  ngOnDestroy(): void {
    if (this.getConfigSubscription != null){
      this.getUsuarioSubscription.unsubscribe();
    }
    if (this.getConfigSubscription != null){
      this.getConfigSubscription.unsubscribe();
    }
    if (this.acessoSubscription != null){
      this.acessoSubscription.unsubscribe();
    }

  }

}

