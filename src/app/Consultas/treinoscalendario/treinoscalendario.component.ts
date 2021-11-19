import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {  CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TreinosCalendarioModel } from 'src/app/model/treinoscalendario.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { TreinoscalendarioService } from './treinoscalendario.service';
import { DatePipe } from '@angular/common'
import { List } from 'linqts';
import { AtividadeService } from 'src/app/Cadastros/atividadelista/atividade.service';
import { AtividadeModel } from 'src/app/model/atividade.model';

@Component({
  selector: 'app-treinoscalendario',
  templateUrl: './treinoscalendario.component.html',
  styleUrls: ['./treinoscalendario.component.css'],
  providers: [TreinoscalendarioService,MessageService,DatePipe,AtividadeService]
})
export class TreinoscalendarioComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  private EmpIdf: number = ServiceConfig.EMPIDF;
  
  dadosTreinos: Subscription;
  lerAtividade: Subscription;

  calendarOptions: CalendarOptions;
  isLoading = true;

  listaTreinos = new List<TreinosCalendarioModel>();
  listaAtv: any[];
  title = "";
  titleAtv = "";
  itemAtv: AtividadeModel = new AtividadeModel;

  eventos: any[] = [];

  display: boolean = false;
  displayAtv: boolean = false;

  constructor(private srvTreinos: TreinoscalendarioService, private srvAtv: AtividadeService, private messageService: MessageService, private datePipe:DatePipe) { }

  ngOnInit(): void {  
    this.eventos = [];
    this.lerTreinos();
  }

  carregaCalendario(){
    this.calendarOptions = {
      locales:[ptbrLocale],
      initialView: 'dayGridMonth',
      dateClick: this.handleDateClick.bind(this), // bind is important!
      eventClick: this.handleEventClick.bind(this),
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
    this.isLoading = false;
  }

  private lerTreinos() {
    let Treinos: any;
    let anoAux = new Date().getFullYear();
    let dados = {
      EmpIdf: this.EmpIdf,
      mes: 0,
      ano: (anoAux-1)
    };
    let _this = this;
    _this.listaTreinos.Clear();
    this.dadosTreinos = this.srvTreinos.getTreinos(dados).subscribe(
      (dados) => {
        Treinos = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        let index = 0;
        Treinos.forEach(item=>{
          let data = this.datePipe.transform(item.TreData, 'yyyy-MM-dd')
          this.listaTreinos.Add({
            ...item,
            data,
            index
          });
          this.eventos.push({
            id: index,
            title: item.TreTitulo,
            date: data
          });
          index++;
        }); 
        this.carregaCalendario();                 
      });
  }

  nextMonth(arg){
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  prevMonth(arg){
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
  }

  handleEventClick(arg) {
    let atividades = this.listaTreinos.First(x=>x.index == arg.event.id);
    this.title = atividades.TreTitulo;
    this.listaAtv = [];
    let _this = this;
    if (atividades.TreAtvDesc != null){
      atividades.TreAtvDesc.forEach(item=>{
        let aux = item.split('@@');
        let auxItem = {
          idf: aux[0],
          descricao: aux[1]
        }
        _this.listaAtv.push(auxItem);
      });
    }
    this.display = true;
  }

  handleDateClick(arg) {
    let data = this.datePipe.transform(arg.dateStr, 'yyyy-MM-dd')
    let treinos = this.listaTreinos.Where(x=>x.data == data);
  }

  verDetalhe(atv){
    this.titleAtv = atv.descricao;
    let dados = {
      EmpIdf: this.EmpIdf,
      AtvIdf: atv.idf
    }
    let _this = this;
    this.lerAtividade = this.srvAtv.getAtvDados(dados).subscribe(
      (dados) => {
        _this.itemAtv = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.displayAtv = true;
      });    
  }

  ngOnDestroy(): void {
    if (this.dadosTreinos != null)
    {
      this.dadosTreinos.unsubscribe();
    }
    if (this.lerAtividade != null){
      this.lerAtividade.unsubscribe();
    }
  }
}

