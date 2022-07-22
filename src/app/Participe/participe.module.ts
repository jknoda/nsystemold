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
import { TreinoscalendarioComponent } from './treinoscalendario/treinoscalendario.component';
import { SugestoesComponent } from './sugestoes/sugestoes.component';
import { LoadingSpinner2Component } from '../shared/loading-spinner/loading-spinner2.component';
import { treinoviacalenComponent } from '../Treinos/treinoviacalendario/treinoviacalen.component';
import { QuizlistaComponent } from './quizresp/quizlista.component';
import { QuizrespComponent } from './quizresp/quizresp.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    LoadingSpinner2Component,
    TreinoscalendarioComponent,
    SugestoesComponent,
    treinoviacalenComponent,
    QuizlistaComponent,
    QuizrespComponent
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
export class ParticipeModule { }
