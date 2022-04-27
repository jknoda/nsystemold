import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ServiceConfig } from '../_config/services.config';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  display:boolean = false;
  isAuthenticated = false;
  isAdm = false;
  isTecnico = false;
  isAuxiliar = false;  
  private userSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {
          this.isAuthenticated = !!user;
          let perfil = '';
          if (JSON.parse(localStorage.getItem('userData')) != null){
              perfil = JSON.parse(localStorage.getItem('userData')).perfil;
          }else if (user != null){
              perfil = user.perfil;
          }
          this.isAdm = (perfil == 'A');
          this.isTecnico = (perfil == 'A' || perfil == 'T');
          this.isAuxiliar = (perfil == 'A' || perfil == 'T' || perfil == 'X');
      });       
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  } 

  logout()
  {
    this.authService.logout();
    window.location.href = 'http://www.yamazakijudo.com.br';
  }

}
