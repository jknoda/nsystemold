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
    isTecnico = false;
    private userSub: Subscription;
    
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
            let perfil = '';
            if (JSON.parse(localStorage.getItem('userData')) != null){
                perfil = JSON.parse(localStorage.getItem('userData')).perfil;
            }else if (user != null){
                perfil = user.perfil;
            }
            this.isAdm = (perfil == 'A');
            this.isTecnico = (perfil == 'A' || perfil == 'T');
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}