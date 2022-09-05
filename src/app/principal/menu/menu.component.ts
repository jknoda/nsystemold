import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import {MenuItem} from 'primeng/api';

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
                    {label: 'QUIZ', icon: 'fa fa-question-circle', routerLink:'quizlista', command:()=>{this.onClick();}},
                    {label: 'Sugestões', icon: 'icon-chat', routerLink:'sugestoes', command:()=>{this.onClick();}},
                ]
            },
            {
                label: 'Notícias',
                icon: 'far fa-newspaper',
                items: [
                    {label: 'Notícias', icon: 'fas fa-newspaper', routerLink:'noticiaslista', command:()=>{this.onClick();}},
                ],
            },
            {
                label: 'Cadastros',
                icon: 'far fa-edit',
                items: [
                    {label: 'Usuário', icon: 'fas fa-user', routerLink: 'usuario', visible:!this.isAdm, command:()=>{this.onClick();}},
                    {label: 'Usuários', icon: 'fas fa-users', routerLink: 'usuariolista',visible:this.isAdm, command:()=>{this.onClick();}},
                    {label: 'Alunos',  icon: 'fas fa-user-graduate', routerLink: 'alunolista', command:()=>{this.onClick();}},
                    {label: 'Atividades',  icon: 'fas fa-cogs', routerLink: 'atividadelista',visible:this.isAuxiliar, command:()=>{this.onClick();}},
                    {label: 'QUIZ',  icon: 'fa fa-question-circle', routerLink: 'questoeslista',visible:this.isAuxiliar, command:()=>{this.onClick();}},
                    {label: 'Imagens',  icon: 'fa-regular fa-image', routerLink: 'tabimagenslista',visible:this.isAuxiliar, command:()=>{this.onClick();}}
                ]
            },
            {
                label: 'Eventos',
                icon: 'icon-judo',
                items: [
                    {label: 'Programação', icon: 'fas fa-tasks', routerLink:'treinolista',visible:this.isAuxiliar, command:()=>{this.onClick();}},
                ],
                visible:this.isAuxiliar
            },
            {
                label: 'Card Game',
                icon: 'fa fa-gamepad',
                items: [
                    {label: 'Cadastrar Cards', icon: 'fa fa-columns', routerLink:'mantercardlista',visible:this.isAdm, command:()=>{this.onClick();}},
                    {label: 'Game Cards', icon: 'fa fa-hand-o-up', routerLink:'cardgame',visible:this.isAdm, command:()=>{this.onClick();}},
                ],
                visible:this.isAdm
            },
            {
                label: 'Diversos',
                icon: 'fa fa-table',
                items: [
                    {label: 'Respostas QUIZ', icon: 'fa fa-columns', routerLink:'quizresplist',visible:this.isAdm, command:()=>{this.onClick();}},
                    {label: 'Placar', icon: 'fa fa-columns', routerLink:'placar',visible:this.isAdm, command:()=>{this.onClick();}},
                ],
                visible:this.isAdm
            },            
            {
                label: 'Checkin',
                icon: 'fas fa-check',
                routerLink:'checkin',
                visible: true,
                command:()=>{this.onClick();}
            },
            {
                label: 'Alterar senha',
                icon: 'fa fa-key',
                routerLink:'alter',
                visible: true,
                command:()=>{this.onClick();}
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