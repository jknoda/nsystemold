import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';

import {FullCalendarModule} from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import {TesteComponent } from './teste.component';
import { BrowserModule } from '@angular/platform-browser';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [TesteComponent],
  exports: [
    TesteComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    FullCalendarModule
  ]
})
export class TesteModule { }
