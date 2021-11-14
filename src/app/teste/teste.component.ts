import { Component, OnInit, ViewChild } from '@angular/core';
import {  CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  calendarOptions: CalendarOptions;
 
  eventos: any[];

  constructor() { }

  ngOnInit(): void {  
    this.eventos = [
      { title: 'event 1', date: '2021-11-15' },
      { title: 'event 3', date: '2021-11-15' },
      { title: 'event 2', date: '2021-11-20' }
    ]; 
    this.carregaCalendario();
  }

  carregaCalendario(){
    this.calendarOptions = {
      locales:[ptbrLocale],
      initialView: 'dayGridMonth',
      dateClick: this.handleDateClick.bind(this), // bind is important!
      eventClick: this.teste.bind(this),
      events: this.eventos,  
      customButtons: {
        next: {
            click: this.nextMonth.bind(this),
        },
        prev: {
            click: this.prevMonth.bind(this),
        }
      }, 
    };
  }

  nextMonth(arg){
    alert('nextMonth');
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  prevMonth(arg){
    alert('prevMonth');
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
  }

  teste(arg) {
    alert('evento ' + arg.event.title)
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

}
