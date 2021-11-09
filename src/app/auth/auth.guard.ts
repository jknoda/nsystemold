import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
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
        default: roles = 'USU';
          break;
      }
      if (rolesRota != roles && roles != 'ADM')
      {        
        this.router.navigate(['/denied']);
      }
    }
    return true;
  }
}
