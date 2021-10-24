import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector: 'topo',
    templateUrl: './topo.component.html',
    styleUrls: ['./topo.component.css']
})

export class TopoComponent implements OnInit {
    isCollapsed = false;
    isLoading: boolean = true;
    companyName: string = "";
    isOpen: boolean = true;

    isAuthenticated = false;
    private userSub: Subscription;


    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
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