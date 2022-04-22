import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {  CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import ptbrLocale from '@fullcalendar/core/locales/pt-br';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TreinosCalendarioModel } from 'src/app/model/treinoscalendario.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { TreinoviacalenService } from './treinoviacalen.service';
import { DatePipe } from '@angular/common'
import { List } from 'linqts';
import { AtividadeService } from 'src/app/Cadastros/atividadelista/atividade.service';
import { AtividadeModel } from 'src/app/model/atividade.model';
import { AlunoService } from 'src/app/Cadastros/aluno/aluno.service';
import { TreinoalunoService } from 'src/app/Treinos/treinoalu/treinoaluno.service';

@Component({
  selector: 'app-treinoviacalen',
  templateUrl: './treinoviacalen.component.html',
  styleUrls: ['./treinoviacalen.component.css'],
  providers: [TreinoviacalenService,MessageService,DatePipe,AtividadeService,AlunoService,TreinoalunoService]
})
export class treinoviacalenComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  private EmpIdf: number = ServiceConfig.EMPIDF;
  TreIdf = 0;
  
  dadosTreinos: Subscription;
  lerAtividade: Subscription;
  lerAlunos: Subscription;
  addAluno: Subscription;

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
  displayCheckin: boolean = false;
  displayParticipantes: boolean = false;

  alunos: DropDown[] = [];
  selectedAluno: DropDown;

  constructor(private srvTreinos: TreinoviacalenService, 
    private srvAtv: AtividadeService, 
    private messageService: MessageService, 
    private datePipe:DatePipe,
    private srvAluno: AlunoService,
    private srvTreinoAlu: TreinoalunoService) {}

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
          let title = this.datePipe.transform(item.TreData, 'HH:mm') + "-" + item.TreTitulo;
          this.eventos.push({
            id: index,
            title: title,
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
    this.title = this.datePipe.transform(atividades.TreData, 'HH:mm') + "- " + atividades.TreTitulo;
    this.TreIdf = atividades.TreIdf;
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
    // novo treino
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

  checkin(){
    let dados = {
      EmpIdf: this.EmpIdf
    }
    this.isLoading = true;
    this.alunos = [];
    this.lerAlunos = this.srvAluno.getAluTodos(dados).subscribe(
      (dados:any) => {
        dados.forEach(element => {
          this.alunos.push({
            name: element.AluNome,
            code: element.AluIdf.toString()
          });
        });
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.displayCheckin = true;
      });    
  }

  checkinOk(){
    if (this.selectedAluno == null)
    {
      alert("Selecione um aluno!");
      return;
    }

    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: this.TreIdf,
      AluIdf: parseInt(this.selectedAluno.code),
      TreAluNome: this.selectedAluno.name,
      TreAluObs: 'Checkin'
    }
    this.addAluno = this.srvTreinoAlu.addTreAluDados(dados).subscribe(
      (dados) => {
      },
      err => { 
        //console.log('error',err);
        let msg = err.error.errors.toString();
        if (msg.toUpperCase().includes('PRIMARY'))
        {
          msg = "Aluno '" + this.selectedAluno.name + "' já fez checkin neste treino!";
        }
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        this.displayCheckin = false;
      },
      ()=>{
        this.displayCheckin = false;
      });      
  }

  listaParticipantes(){
    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: this.TreIdf
    }
    this.isLoading = true;
    this.alunos = [];
    this.lerAlunos = this.srvTreinoAlu.getTreAluTodos(dados).subscribe(
      (dados:any) => {
        dados.forEach(element => {
          this.alunos.push({
            name: element.TreAluNome,
            code: element.AluIdf.toString()
          });
        });
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.displayParticipantes = true;
      });    
  }

  participantesOk(){
    this.displayParticipantes = false;
  }

  ngOnDestroy(): void {
    if (this.dadosTreinos != null)
    {
      this.dadosTreinos.unsubscribe();
    }
    if (this.lerAtividade != null){
      this.lerAtividade.unsubscribe();
    }
    if (this.lerAlunos != null){
      this.lerAlunos.unsubscribe();
    }
    if (this.addAluno != null){
      this.addAluno.unsubscribe();
    }

  }
}

interface DropDown {
  name: string,
  code: string
}