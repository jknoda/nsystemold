﻿import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";
import { TopoService } from "./topo.service";

@Component({
    selector: 'topo',
    templateUrl: './topo.component.html',
    styleUrls: ['./topo.component.css']
})

export class TopoComponent implements OnInit, OnDestroy {
    isCollapsed = false;
    isLoading: boolean = true;
    companyName: string = "";
    isOpen: boolean = true;

    isAuthenticated = false;
    private userSub: Subscription;

    userEmail = "";


    constructor(private router: Router, private authService:AuthService, private topoService: TopoService) {
        this.topoService.isAuthenticated.subscribe(
            (isAuth:boolean)=>{
                this.isAuthenticated = isAuth;
            });
    }
    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
            this.userEmail = user.email;
        });
    }

    onLogout() {
        this.authService.logout();
    }

    /*
     * Collapse the menu.
     */
    onMenuCollapse() {
        this.isCollapsed = !this.isCollapsed;
        //this.topoService.isCollapsed = this.isCollapsed;
        //this.topoService.toggle.next(this.isCollapsed);
    }
}