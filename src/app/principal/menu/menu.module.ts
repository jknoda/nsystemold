import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import { HomeComponent } from 'src/app/home/home.component';


import { MenuComponent } from './menu.component';

@NgModule({
    declarations: [        
        MenuComponent,
        HomeComponent
    ],
    exports: [
        MenuComponent,
        HomeComponent
    ],
    providers: [],
    imports: [
        CommonModule, 
        RouterModule,
        DialogModule,
        AccordionModule

    ]
})

export class MenuModule { }