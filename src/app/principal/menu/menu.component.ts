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
    private userSub: Subscription;
    
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
          });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}