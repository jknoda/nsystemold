import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TreinoaluModel } from 'src/app/model/treinoalu.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AlunoModel } from 'src/app/model/aluno.model';
import { AlunoService } from 'src/app/Cadastros/aluno/aluno.service';
import { TreinoalunoService } from './treinoaluno.service';

@Component({
  selector: 'app-treinoalu',
  templateUrl: './treinoalu.component.html',
  styleUrls: ['./treinoalu.component.css'],
  providers: [MessageService,ConfirmationService,TreinoalunoService,MessageService,AlunoService]
})

export class TreinoaluComponent implements OnInit, OnDestroy {
  Param = {
    EmpIdf: 0,
    TreIdf: 0,
    TreTitulo: "",
    Data: ""
  }  
  AluIdf = 0;

  dadosForm: FormGroup;

  addDadosTreinoAlu: Subscription;
  updateDadosTreinoAlu: Subscription;
  deleteDadosTreinoAlu: Subscription;
  lerDadosTreinoAlu: Subscription;
  lerDadosAluno: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  alus: ALU[];
  
  alunos: AlunoModel[];

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvTreinoAlu: TreinoalunoService, private srvAluno: AlunoService,
    private messageService: MessageService) {
    }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.Param = JSON.parse(params.Param);
        this.carregaAluno();        
        if (params.Modo == "EDIT")
        {
          this.editMode = true;
          this.AluIdf = params.AluIdf;
          this.getTreinoAlu();
        } else {
          this.editMode = false;
          let TreinoAlu: TreinoaluModel;
          this.initForm(TreinoAlu);
        }
      }
    );
  }

  private carregaAluno()
  {
    let dados = {
      EmpIdf: this.Param.EmpIdf
    };
    this.lerDadosAluno = this.srvAluno.getAluTodos(dados).subscribe(
      (dados) => {
        this.alunos = JSON.parse(JSON.stringify(dados));
        let lista = [];
        this.alunos.forEach(item=>{
          let aux = {
            name: item.AluNome,
            code: item.AluIdf.toString()
          }
          lista.push(aux);
        })
        this.alus = lista;
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        return;
      });  
  }


  private getTreinoAlu() {
    let TreinoAlu: TreinoaluModel;
    let dados = {
      EmpIdf: this.Param.EmpIdf,
      TreIdf: this.Param.TreIdf,
      AluIdf: this.AluIdf
    };
    this.lerDadosTreinoAlu = this.srvTreinoAlu.getTreAluDados(dados).subscribe(
      (dados) => {
        TreinoAlu = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.initForm(TreinoAlu);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.Param.EmpIdf,
      TreIdf: this.Param.TreIdf,
      AluIdf: parseInt(this.dadosForm.value['alu']),
      TreAluNome: this.dadosForm.value['nome'],
      TreAluObs: this.dadosForm.value['obs']
    };    
    if (dados.AluIdf == 0){
      dados.AluIdf = parseInt(this.alus[0].code);
    }
    dados.TreAluNome = this.alus.find(x=>x.code == dados.AluIdf.toString()).name;
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosTreinoAlu = this.srvTreinoAlu.updateTreAluDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno do treino atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.retorno();
        }
      );
    }else{
      let dadosAdd = {
        ...dados
      }
      this.addDadosTreinoAlu = this.srvTreinoAlu.addTreAluDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno do treino incluido!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          if (msg.includes('MUST BE UNIQUE')){
               msg = 'Aluno já incluído!';
          }
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.retorno();
        }
      );
    }
  }

  cancelar() {
    this.retorno(0);
  }

  private retorno(tempo=1010){
    setTimeout(() => 
    {
      this.router.navigate(['../treinoalulista'], { queryParams: { EmpIdf: this.Param.EmpIdf, TreIdf: this.Param.TreIdf, TreTitulo: this.Param.TreTitulo, Data: this.Param.Data } });
    },
    tempo);
  }

  private initForm(dados:TreinoaluModel) { 
    this.isLoading = false;
    let AluIdf = 0;
    let TreAluObs = null;

    if (dados != null)
    {
      AluIdf = dados.AluIdf;
      TreAluObs = dados.TreAluObs;
    }
    this.dadosForm = new FormGroup({
      'alu': new FormControl(AluIdf.toString()),
      'obs': new FormControl(TreAluObs),
    });
  }
  ngOnDestroy(): void {
    if (this.lerDadosTreinoAlu != null){
      this.lerDadosTreinoAlu.unsubscribe();
    }
    if (this.addDadosTreinoAlu != null){
      this.addDadosTreinoAlu.unsubscribe();
    }
    if (this.updateDadosTreinoAlu != null){
      this.updateDadosTreinoAlu.unsubscribe();
    }
    if (this.lerDadosAluno != null){
      this.lerDadosAluno.unsubscribe();
    }
  }

  clear() {
    this.messageService.clear();
  }    

} 

interface ALU {
  name: string,
  code: string
}