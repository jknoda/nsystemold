import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    isAdm = false;
    private userSub: Subscription;
    
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
            if (JSON.parse(localStorage.getItem('userData')) != null){
                this.isAdm = JSON.parse(localStorage.getItem('userData')).perfil == 'A';
            }else if (user != null){
                this.isAdm = user.perfil == 'A';
            }
          });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}