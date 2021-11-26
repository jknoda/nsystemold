import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TreinoatvService } from './treinoatv.service';
import { TreinoatvModel } from 'src/app/model/treinoatv.model';
import { AtividadeModel } from 'src/app/model/atividade.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AtividadeService } from 'src/app/Cadastros/atividadelista/atividade.service';

@Component({
  selector: 'app-TreinoAtv',
  templateUrl: './treinoatv.component.html',
  styleUrls: ['./treinoatv.component.css'],
  providers: [ConfirmationService,TreinoatvService,MessageService,AtividadeService]
})

export class TreinoatvComponent implements OnInit, OnDestroy {
  Param = {
    EmpIdf: 0,
    TreIdf: 0,
    TreTitulo: "",
    Data: ""
  }  
  TreAtvItem = 0;

  dadosForm: FormGroup;

  addDadosTreinoAtv: Subscription;
  updateDadosTreinoAtv: Subscription;
  deleteDadosTreinoAtv: Subscription;
  lerDadosTreinoAtv: Subscription;
  lerDadosAtividade: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  atvs: ATV[];

  atividades: AtividadeModel[];

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvTreinoAtv: TreinoatvService, private srvAtv: AtividadeService,
    private messageService: MessageService) {
    }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.Param = JSON.parse(params.Param);
        this.carregaAtv();
        if (params.Modo == "EDIT")
        {
          this.editMode = true;
          this.TreAtvItem = params.TreAtvItem;
          this.getTreinoAtv();
        } else {
          this.editMode = false;
          let TreinoAtv: TreinoatvModel;
          this.initForm(TreinoAtv);
        }
      }
    );
  }

  private carregaAtv()
  {
    let dados = {
      EmpIdf: this.Param.EmpIdf
    };
    this.lerDadosAtividade = this.srvAtv.getAtvTodos(dados).subscribe(
      (dados) => {
        this.atividades = JSON.parse(JSON.stringify(dados));
        let lista = [];
        this.atividades.forEach(item=>{
          let aux = {
            name: item.AtvTitulo,
            code: item.AtvIdf.toString()
          }
          lista.push(aux);
        })
        this.atvs = lista;
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        return;
      });  
  }

  private getTreinoAtv() {
    let TreinoAtv: TreinoatvModel;
    let dados = {
      EmpIdf: this.Param.EmpIdf,
      TreIdf: this.Param.TreIdf,
      TreAtvItem: this.TreAtvItem
    };
    this.lerDadosTreinoAtv = this.srvTreinoAtv.getTreAtvDados(dados).subscribe(
      (dados) => {
        TreinoAtv = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(TreinoAtv);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.Param.EmpIdf,
      TreIdf: this.Param.TreIdf,
      TreAtvItem: this.TreAtvItem,
      TreAtvOrdem: this.dadosForm.value['ordem'],
      AtvIdf:  parseInt(this.dadosForm.value['atv']),
      TreAtvDesc:  this.dadosForm.value['descricao'],
      TreAtvRep:  this.dadosForm.value['repeticao'],
      TreAtvMin:  this.dadosForm.value['minutos'],
      TreObs: this.dadosForm.value['obs'],
    };    
    //if (dados.TreAtvDesc == ""){
      dados.TreAtvDesc = this.atvs.find(x=>x.code == dados.AtvIdf.toString()).name;
      // this.atvs.forEach(item=>{
      //   if (item.code == dados.AtvIdf.toString()){
      //     dados.TreAtvDesc = item.name;
      //   }
      //})
    //}
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosTreinoAtv = this.srvTreinoAtv.updateTreAtvDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Atividade do treino atualizado!'});
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
      this.addDadosTreinoAtv = this.srvTreinoAtv.addTreAtvDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Atividade do treino incluido!'});
        },
        err => { 
          let msg = err.error.errors.toString();
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
      this.router.navigate(['../treinoatvlista'], { queryParams: { EmpIdf: this.Param.EmpIdf, TreIdf: this.Param.TreIdf, TreTitulo: this.Param.TreTitulo, Data: this.Param.Data } });
    },
    tempo);
  }

  private initForm(dados:TreinoatvModel) { 
    this.isLoading = false;  
    let TreAtvOrdem = 1;
    let AtvIdf = 1;
    let TreAtvDesc = "";
    let TreAtvRep = "";
    let TreAtvMin = 0;
    let TreAtvObs = null;

    if (dados != null)
    {
      TreAtvOrdem = dados.TreAtvOrdem;
      AtvIdf = dados.AtvIdf;
      TreAtvDesc = dados.TreAtvDesc;
      TreAtvRep = dados.TreAtvRep;
      TreAtvMin = dados.TreAtvMin;
      TreAtvObs = dados.TreAtvObs;
    }
    this.dadosForm = new FormGroup({
      'ordem': new FormControl(TreAtvOrdem),
      'atv': new FormControl(AtvIdf.toString()),
      'descricao': new FormControl(TreAtvDesc),
      'repeticao': new FormControl(TreAtvRep),
      'minutos': new FormControl(TreAtvMin),
      'obs': new FormControl(TreAtvObs),
    });
  }
  ngOnDestroy(): void {
    if (this.lerDadosTreinoAtv != null){
      this.lerDadosTreinoAtv.unsubscribe();
    }
    if (this.addDadosTreinoAtv != null){
      this.addDadosTreinoAtv.unsubscribe();
    }
    if (this.updateDadosTreinoAtv != null){
      this.updateDadosTreinoAtv.unsubscribe();
    }
    if (this.lerDadosAtividade != null){
      this.lerDadosAtividade.unsubscribe();
    }
  }

  clear() {
    this.messageService.clear();
  }    

} 

interface ATV {
  name: string,
  code: string
}