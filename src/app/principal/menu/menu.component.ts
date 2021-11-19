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
                label: 'Consultas',
                icon: 'pi pi-pw pi-file',
                items: [
                    {label: 'Treinos', icon: 'pi pi-fw pi-external-link', routerLink:'treinoscalendario'},
                ]
            },
            {
                label: 'Cadastros',
                icon: 'pi pi-pw pi-file',
                items: [
                    {label: 'Usuário', icon: 'pi pi-fw pi-external-link', routerLink: 'usuario', visible:!this.isAdm},
                    {label: 'Usuários', icon: 'pi pi-fw pi-times', routerLink: 'usuariolista',visible:this.isAdm},
                    {label: 'Alunos',  icon: 'pi pi-fw pi-pencil', routerLink: 'alunolista',visible:this.isAdm},
                    {label: 'Atividades',  icon: 'pi pi-fw pi-pencil', routerLink: 'atividadelista',visible:this.isTecnico}
                ]
            },
            {
                label: 'Treinos',
                icon: 'pi pi-pw pi-file',
                items: [
                    {label: 'Treinos', icon: 'pi pi-fw pi-external-link', routerLink:'treinolista',visible:this.isTecnico},
                ],
                visible:this.isTecnico
            },
        ];        
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}