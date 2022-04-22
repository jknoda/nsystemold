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
import { AlunoService } from 'src/app/Cadastros/aluno/aluno.service';
import { TreinoalunoService } from 'src/app/Treinos/treinoalu/treinoaluno.service';
import { OcorrenciaService } from 'src/app/shared/ocorrencia.service';

@Component({
  selector: 'app-treinoscalendario',
  templateUrl: './treinoscalendario.component.html',
  styleUrls: ['./treinoscalendario.component.css'],
  providers: [TreinoscalendarioService,MessageService,DatePipe,
    AtividadeService,AlunoService,TreinoalunoService,OcorrenciaService]
})
export class TreinoscalendarioComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  TreIdf = 0;
  AluIdf = 0;
  RO = false; // Read Only
  
  dadosTreinos: Subscription;
  lerAtividade: Subscription;
  lerAlunos: Subscription;
  addAluno: Subscription;
  lerOcorrencias: Subscription;
  lerTipoocorrencia: Subscription;
  subSalvarOcorrencia: Subscription;

  calendarOptions: CalendarOptions;
  isLoading = true;

  listaTreinos = new List<TreinosCalendarioModel>();
  listaAtv: any[];
  title = "";
  titleDet = "";
  titleAtv = "";
  itemAtv: AtividadeModel = new AtividadeModel;
  ocoTexto = "";

  eventos: any[] = [];

  ocorrencias: any[] = [];

  tipoOco: DropDown[] = [];
  selectedTipoOco: DropDown;

  display: boolean = false;
  displayAtv: boolean = false;
  displayCheckin: boolean = false;
  displayParticipantes: boolean = false;
  displayOcorrencias: boolean = false;
  displayOcorrenciaDescricao: boolean = false;

  alunos: DropDown[] = [];
  selectedAluno: DropDown;

  constructor(private srvTreinos: TreinoscalendarioService, 
    private srvAtv: AtividadeService, 
    private messageService: MessageService, 
    private datePipe:DatePipe,
    private srvAluno: AlunoService,
    private srvTreinoAlu: TreinoalunoService,
    private srvOcorrencia: OcorrenciaService) {}

  ngOnInit(): void {  
    this.eventos = [];
    this.lerTreinos();
    this.lerTipoOco();
  }

  private lerTipoOco()
  {
    let dados = {
      EmpIdf: this.EmpIdf
    }
    this.isLoading = true;
    this.tipoOco = [];
    this.lerTipoocorrencia = this.srvOcorrencia.findalltipo(dados).subscribe(
      (dados:any) => {
        dados.forEach(element => {
          this.alunos.push({
            name: element.OcoDescricao,
            code: element.OcoTipo
          });
        });
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
      });    
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
    this.title = this.datePipe.transform(atividades.TreData, 'HH:mm') + "- " + atividades.TreTitulo + " - " + atividades.TreResponsavel;
    this.TreIdf = atividades.TreIdf;
    this.listaAtv = [];
    let _this = this;
    if (atividades.TreAtvDesc != null){
      atividades.TreAtvDesc.forEach(item=>{
        let aux = item.split('@@');
        let auxItem = {
          idf: aux[0],
          descricao: aux[1],
          tempo: aux[2]
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

  checkin(){
    if (this.alunos.length > 0)
    {
      this.displayCheckin = true;
      return;
    }
    let dados = {
      EmpIdf: this.EmpIdf,
      AluStatus: 'A'
    }
    this.isLoading = true;    
    this.alunos = [];
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    let isTecnico = (perfil == 'A' || perfil == 'T');
    this.lerAlunos = this.srvAluno.getAluTodosStatus(dados).subscribe(
      (dados:any) => {
        dados.forEach(element => {
          if (element.UsuIdf == this.UsuIdf || isTecnico){
            this.alunos.push({
              name: element.AluNome,
              code: element.AluIdf.toString()
            });
          }
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

  atividadesOk(){
    this.display = false;
  }


  listaOcorrencias(dado,tipo){
    if (tipo == 'ATV'){
      this.AluIdf = 0;
    }else{
      this.AluIdf = parseInt(dado.code);
    }
    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: this.TreIdf,
      AluIdf: this.AluIdf
    }
    this.isLoading = true;
    this.ocorrencias = [];
    this.lerOcorrencias = this.srvOcorrencia.findall(dados).subscribe(
      (dados:any) => {
        dados.forEach(element => {
          this.ocorrencias.push({
            name: element.OcoDescricao,
            code: element.OcoIdf.toString()
          });
        });
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.displayOcorrencias = true;
      });       
  }

  incluirOcorrencia()
  {
    this.RO = false;
    this.ocoTexto = "";
    this.displayOcorrenciaDescricao = true;
  }

  detalheOcorrencia(detalhe)
  {
    this.RO = true;
    this.ocoTexto = detalhe;
    this.displayOcorrenciaDescricao = true;
  }

  salvarOcorrencia()
  {
    this.displayOcorrenciaDescricao = false;
    if (this.RO) {
      return;
    }
    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: this.TreIdf,
      AluIdf: this.AluIdf,
      OcoTipo: "I",
      OcoDescricao: this.ocoTexto,
      UsuIdf: this.UsuIdf
    }
    this.isLoading = true;
    this.subSalvarOcorrencia = this.srvOcorrencia.create(dados).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Ocorrência incluida!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.isLoading = false;
        this.listaOcorrencias({code:this.AluIdf},this.AluIdf == 0 ? 'ATV' : 'ALU');
      }
    );
  }

  ocorrenciasOk(){
    this.displayOcorrencias = false;
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
    if (this.lerTipoocorrencia != null){
      this.lerTipoocorrencia.unsubscribe();
    }    
    if (this.subSalvarOcorrencia != null){
      this.subSalvarOcorrencia.unsubscribe();
    }    

  }
}

interface DropDown {
  name: string,
  code: string
}