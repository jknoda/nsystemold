import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MenuModule } from '../menu/menu.module';
import { TopoComponent } from './topo.component';

@NgModule({
    declarations: [TopoComponent],
    imports: [
        BrowserModule, 
        RouterModule,
        CommonModule,
        MenuModule
    ],
    exports: [TopoComponent]
})

export class TopoModule { }