import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate , OnDestroy{
  getUsuarioSubscription: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {          
          return this.checarRota(route);
        }
        return this.router.createUrlTree(['auth']);
      })
    );
  }

  private checarRota(route: ActivatedRouteSnapshot){
    let rolesRota = '';
    let roles = '';
    if (typeof route.data['roles'] !== 'undefined' && route.data['roles']){
      rolesRota = route.data['roles'];
      const perfil = JSON.parse(localStorage.getItem('userData')).perfil;
      switch(perfil){
        case 'A' : roles = 'ADM';
          break;
        case 'T' : roles = 'TEC';
          break;
        case 'X' : roles = 'AUX';
          break;
        default: roles = 'USU';
          break;
      }
      if (rolesRota != roles && roles != 'ADM')
      {        
        this.router.navigate(['/denied']);
      }else{
        if (JSON.parse(localStorage.getItem('userData')).email == JSON.parse(localStorage.getItem('userData')).nome || JSON.parse(localStorage.getItem('userData')).nome == null)
        {
          this.buscarNome();
        }
      }
    }
    return true;
  }

  private buscarNome() {
    let dados = {
      EmpIdf: JSON.parse(localStorage.getItem('userData')).empidf,
      UsuEmail: JSON.parse(localStorage.getItem('userData')).email
    };
    let nome = "";
    this.getUsuarioSubscription = this.authService.getUsuario(dados).subscribe(
      data => {
        if (typeof(data) != 'undefined' && data != null)
        {
          nome = data["UsuNome"];
          if (nome != null)
          JSON.parse(localStorage.getItem('userData')).nome = nome;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.getUsuarioSubscription != null){
      this.getUsuarioSubscription.unsubscribe();
    }
  }

}
