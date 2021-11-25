import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
    @Output() onMenuCollapse = new EventEmitter<any>();
    
    isAuthenticated = false;
    isAdm = false;
    isTecnico = false;
    isAuxiliar = false;
    private userSub: Subscription;

    items: MenuItem[];
    
    constructor(private authService: AuthService) {
    }

    onClick(){
        this.onMenuCollapse.emit();
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
            this.isAuxiliar = (perfil == 'A' || perfil == 'T' || perfil == 'X');
            this.menuInit();
        });   
    }

    private menuInit() {
        this.items = [
            {
                label: 'Participe!',
                icon: 'icon-party',
                items: [
                    {label: 'Calendário', icon: 'far fa-calendar-alt', routerLink:'treinoscalendario', command:()=>{this.onClick();}},
                    {label: 'Sugestões', icon: 'icon-chat', routerLink:'sugestoes', command:()=>{this.onClick();}},
                ]
            },
            {
                label: 'Cadastros',
                icon: 'far fa-edit',
                items: [
                    {label: 'Usuário', icon: 'fas fa-user', routerLink: 'usuario', visible:!this.isAdm, command:()=>{this.onClick();}},
                    {label: 'Usuários', icon: 'fas fa-users', routerLink: 'usuariolista',visible:this.isAdm, command:()=>{this.onClick();}},
                    {label: 'Alunos',  icon: 'fas fa-user-graduate', routerLink: 'alunolista', command:()=>{this.onClick();}},
                    {label: 'Atividades',  icon: 'fas fa-cogs', routerLink: 'atividadelista',visible:this.isAuxiliar, command:()=>{this.onClick();}}
                ]
            },
            {
                label: 'Eventos',
                icon: 'icon-judo',
                items: [
                    {label: 'Programação', icon: 'fas fa-tasks', routerLink:'treinolista',visible:this.isAuxiliar, command:()=>{this.onClick();}},
                    //{label: 'via Calendario', icon: 'fas fa-tasks', routerLink:'treinoviacalen',visible:this.isTecnico, command:()=>{this.onClick();}},
                ],
                visible:this.isAuxiliar
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