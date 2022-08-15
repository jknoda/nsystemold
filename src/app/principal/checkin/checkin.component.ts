import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AlunoService } from 'src/app/Cadastros/aluno/aluno.service';
import { AlunoModel } from 'src/app/model/aluno.model';
import { TreinoService } from 'src/app/Treinos/treino/treino.service';
import { TreinoalunoService } from 'src/app/Treinos/treinoalu/treinoaluno.service';
import { ServiceConfig } from 'src/app/_config/services.config';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css'],
  providers: [MessageService,AlunoService,ConfirmationService,TreinoService,TreinoalunoService,DatePipe]  
})
export class CheckinComponent implements OnInit {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  lerDadosAluno: Subscription;
  lerTreinos: Subscription;
  addDadosTreino: Subscription;
  addAluno: Subscription;

  Alunos: AlunoModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  isTecnico = false;

  Treinos: treinos[];
  selectTreinoCode: string;
  
  data = new Date();

  constructor(private router: Router, private srvAluno: AlunoService, 
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private srvTreino: TreinoService,
    private srvTreinoAlu: TreinoalunoService,
    private datePipe:DatePipe) {}

  ngOnInit() {
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.isTecnico = (perfil == 'A' || perfil == 'T');
    this.getAlunos();
    this.getTreino(0,"");
  }

  private getAlunos() {
    this.isLoading = true;
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    let usuidf = JSON.parse(localStorage.getItem('userData')).usuidf;
    if (perfil == 'A' || perfil == 'T') usuidf = 0;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluStatus: 'A',
      UsuIdf: usuidf
    };
    this.lerDadosAluno = this.srvAluno.getAluTodosResp(dados).subscribe(
      (dados) => {
        this.Alunos = JSON.parse(JSON.stringify(dados));        
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        return;
      }); 
  }

  private getTreino(AluIdf, AluNome)
  {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      TreData: this.data
    };
    this.Treinos = [];
    this.lerTreinos = this.srvTreino.getTreTodosData(dados).subscribe(
      (dados) => {
        let TreinosAux = JSON.parse(JSON.stringify(dados)); 
        TreinosAux.forEach(item=>{
          let dado = 
          {
            name:item.TreTitulo,
            code:item.TreIdf
          };
          this.Treinos.push(dado);
        })
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        if (this.Treinos.length == 0)
        {
          this.Treinos.push({name:"Treino",code:"0"});
        }
        this.selectTreinoCode = this.Treinos[0].code;
        if (AluIdf > 0)
        {
          this.incluirCheckinAluno(AluIdf, AluNome);
        }
        this.isLoading = false;
        return;
      }); 
  }

  changeData(e)
  {
    this.getTreino(0,"");
  }

  checkinAluno(AluIdf, AluNome)
  {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: Number(this.selectTreinoCode),
      AluIdf: AluIdf,
      TreAluNome: AluNome,
      UsuIdf: this.UsuIdf,
      TreAluObs: 'Checkin'
    }
    if (dados.TreIdf == 0)
    {
      this.incluirTreino(AluIdf, AluNome);
    }
    else
    {
      this.incluirCheckinAluno(AluIdf, AluNome);
    }
  }

  private incluirCheckinAluno(AluIdf, AluNome)
  {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: Number(this.selectTreinoCode),
      AluIdf: AluIdf,
      TreAluNome: AluNome,
      TreAluObs: 'Checkin',
      UsuIdf: this.UsuIdf
    }
    this.addAluno = this.srvTreinoAlu.addTreAluDados(dados).subscribe(
      () => {
      },
      err => { 
        let msg = err.error.errors.toString();
        if (msg.toUpperCase().includes('MUST BE UNIQUE'))
        {
          msg = "Aluno '" + AluNome + "' já fez checkin neste treino!";
          this.messageService.add({severity:'warn', summary: 'Aviso!', detail: msg});
        }
        else
        {
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        }        
        this.isLoading = false;
      },
      ()=>{
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Checkin Ok!'});
        this.isLoading = false;
        return;
      });      
  }

  private incluirTreino(AluIdf, AluNome)
  {
    let data = new Date();
    let dados = {
      EmpIdf: this.EmpIdf,
      TreIdf: 0,
      TreTipo: 'T',
      TreData: data,
      TreTitulo:  'TREINO ' + this.datePipe.transform(new Date(), 'dd-MM-yyyy'),
      TreResponsavel:  'Sensei',
      TreObs: 'Gerado por checkin'
    };    
    this.addDadosTreino = this.srvTreino.addTreDados(dados).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Treino incluido!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.getTreino(AluIdf, AluNome);
        return;
      }
    );
  }

  ngOnDestroy() {
    if ( this.lerDadosAluno != null){
      this.lerDadosAluno.unsubscribe();
    }
    if ( this.lerTreinos != null){
      this.lerTreinos.unsubscribe();
    }
    if ( this.addAluno != null){
      this.addAluno.unsubscribe();
    }
    if ( this.addDadosTreino != null){
      this.addDadosTreino.unsubscribe();
    }
  }

}

interface treinos {
  name: string,
  code: string
}