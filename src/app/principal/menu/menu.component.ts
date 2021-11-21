import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {MenuItem} from 'primeng/api';
import { mergeScan } from 'rxjs/operators';

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

    items: MenuItem[];
    
    constructor(private authService: AuthService) {
    }

    ngOnInit() {
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
            this.menuInit();
        });   
    }

    private menuInit() {
        this.items = [
            {
                label: 'Participe!',
                icon: 'icon-party',
                items: [
                    {label: 'Treinos', icon: 'far fa-calendar-alt', routerLink:'treinoscalendario'},
                    {label: 'Sugestões', icon: 'icon-chat', routerLink:'sugestoes'},
                ]
            },
            {
                label: 'Cadastros',
                icon: 'far fa-edit',
                items: [
                    {label: 'Usuário', icon: 'fas fa-user', routerLink: 'usuario', visible:!this.isAdm},
                    {label: 'Usuários', icon: 'fas fa-users', routerLink: 'usuariolista',visible:this.isAdm},
                    {label: 'Alunos',  icon: 'fas fa-user-graduate', routerLink: 'alunolista',visible:this.isAdm},
                    {label: 'Atividades',  icon: 'fas fa-cogs', routerLink: 'atividadelista',visible:this.isTecnico}
                ]
            },
            {
                label: 'Treinos',
                icon: 'icon-judo',
                items: [
                    {label: 'Programação', icon: 'fas fa-tasks', routerLink:'treinolista',visible:this.isTecnico},
                ],
                visible:this.isTecnico
            },
            {
                label: 'Sair',
                icon: 'icon-exit',
                command: ()=>{
                    this.authService.logout();
                },
                url: 'http://www.yamazakijudo.com.br'                
            },
        ];        
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}