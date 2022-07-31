import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {EditorModule} from 'primeng/editor';
import {DataViewModule} from 'primeng/dataview';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CardModule} from 'primeng/card';

import {FullCalendarModule} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { BrowserModule } from '@angular/platform-browser';
import { MantercardlistaComponent } from './mantercard/mantercardlista.component';
import { MantercardComponent } from './mantercard/mantercard.component';
import { CardgamelistaComponent } from './cardgame/cardgamelista.component';
import { CardgameComponent } from './cardgame/cardgame.component';
import { LoadingSpinner3Component } from '../shared/loading-spinner/loading-spinner3.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    LoadingSpinner3Component,
    MantercardlistaComponent,
    MantercardComponent,
    CardgamelistaComponent,
    CardgameComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    ToastModule,
    DialogModule,
    TableModule,
    EditorModule,
    DataViewModule,    
    ConfirmPopupModule,
    DropdownModule,
    RadioButtonModule,
    CardModule,

    ConfirmDialogModule
  ]
})
export class JudocardModule { }
