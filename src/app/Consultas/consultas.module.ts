import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

import {FullCalendarModule} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


import { BrowserModule } from '@angular/platform-browser';
import { TreinoscalendarioComponent } from './treinoscalendario/treinoscalendario.component';
import { SugestoesComponent } from './sugestoes/sugestoes.component';
import { LoadingSpinner2Component } from '../shared/loading-spinner/loading-spinner2.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    LoadingSpinner2Component,
    TreinoscalendarioComponent,
    SugestoesComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    FullCalendarModule,
    ToastModule,
    DialogModule,
    TableModule,

    ConfirmDialogModule
  ]
})
export class ConsultasModule { }
