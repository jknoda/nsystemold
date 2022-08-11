import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { JudoService } from './judo.service';
import { AluJudoModel } from 'src/app/model/alujudo.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-judo',
  templateUrl: './judo.component.html',
  styleUrls: ['./judo.component.css'],
  providers: [ConfirmationService,JudoService,MessageService]
})
export class JudoComponent implements OnInit , OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  AluIdf = 0;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  AluJuIdf = 0;
  AluNome = '';

  dadosForm: FormGroup;

  addDadosAluJudo: Subscription;
  updateDadosAluJudo: Subscription;
  deleteDadosAluJudo: Subscription;
  lerDadosAluJudo: Subscription;
  lerDadosFaixas: Subscription;

  isLoading = true;
  editMode = false;

  faixas: DD[] = [];

  isUpdate = true;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvAluJudo: JudoService, 
    private messageService: MessageService) {
  }

  ngOnDestroy(): void {
    if (this.lerDadosAluJudo != null){
      this.lerDadosAluJudo.unsubscribe();
    }
    if (this.addDadosAluJudo != null){
      this.addDadosAluJudo.unsubscribe();
    }
    if (this.updateDadosAluJudo != null){
      this.updateDadosAluJudo.unsubscribe();
    }
    if (this.lerDadosFaixas != null){
      this.lerDadosFaixas.unsubscribe();
    }
  }

  ngOnInit() {
    let dados = {
      EmpIdf: this.EmpIdf,
    };
    this.lerDadosFaixas = this.srvAluJudo.getFaixas(dados).subscribe(
      (dadosRet:any) => {      
        dadosRet.forEach(element => {
            this.faixas.push({
              name:  element.FaixaCor,
              code: element.FaixaIdf.toString()
            });
        });
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.route.queryParams
          .subscribe(params => {
            this.EmpIdf = params.EmpIdf;
            this.AluIdf = params.AluIdf;
            this.AluJuIdf = params.AluJuIdf;
            this.AluNome = params.AluNome;
            if (params.Modo == "EDIT") {
              this.editMode = true;
              this.getAluJudo();
            } else {
              this.editMode = false;
              let AluJudo: AluJudoModel;
              this.initForm(AluJudo);
            }
          });
      }
    );
  }

  private getAluJudo() {
    let AluJudo: AluJudoModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf,
      AluJuIdf: this.AluJuIdf
    };
    this.lerDadosAluJudo = this.srvAluJudo.getDados(dados).subscribe(
      (dados) => {
        AluJudo = JSON.parse(JSON.stringify(dados));
        AluJudo.AluJuData = new Date(AluJudo.AluJuData);
        this.UsuIdf = AluJudo.UsuIdf;        
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(AluJudo);
      });
  }

  onSubmit() {
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf,
      AluJuIdf: this.AluJuIdf,
      UsuIdf: this.UsuIdf,
      AluJuNrFed: this.dadosForm.value['FPJ'],
      AluJuPeso:  this.dadosForm.value['peso'],
      FaixaIdf: this.dadosForm.value['faixa'],
      AluJuData: this.dadosForm.value['data'],
      AluJuObs: this.dadosForm.value['obs']
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosAluJudo = this.srvAluJudo.updateDados(dadosUpdate).subscribe(
        () => {
          this.isLoading = false;
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Dados judô atualizado!'});
        },
        err => { 
          let msg = err.error.errors.toString();
          this.isLoading = false;
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.retorno();
        }
      );
    }else{
      let dadosAdd = {
        ...dados,
        AluStatus: 'A'
      }
      this.addDadosAluJudo = this.srvAluJudo.addDados(dadosAdd).subscribe(
        (ret:any) => {
          this.isLoading = false;
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Dados judô incluido!'});
          dados.AluJuIdf = ret;
        },
        err => { 
          this.isLoading = false;
          console.log('err',err);
          let msg = err.error.errors.toString();
          if (!msg)
          {
            msg = err.error.msg;
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
    this.isLoading = false;
    setTimeout(() => 
    {
      this.router.navigate(['judolista'], { queryParams: { EmpIdf: this.EmpIdf, AluIdf: this.AluIdf, AluNome:this.AluNome } });
    },
    tempo);
  }

  private initForm(dados:AluJudoModel) {   
    this.isLoading = false;
    let AluJuNrFed = null;
    let AluJuPeso = null;
    let FaixaIdf = 1;
    let AluJuData = new Date();
    let AluJuObs = null;
   
    if (dados != null)
    {
      AluJuNrFed = dados.AluJuNrFed;
      AluJuPeso = dados.AluJuPeso;
      FaixaIdf = dados.FaixaIdf;		
      AluJuData = dados.AluJuData;
      AluJuObs = dados.AluJuObs;
    }
    this.dadosForm = new FormGroup({
      'FPJ': new FormControl(AluJuNrFed),
      'peso': new FormControl(AluJuPeso),
      'faixa': new FormControl(FaixaIdf.toString(), Validators.required),
      'data': new FormControl(AluJuData, Validators.required),
      'obs': new FormControl(AluJuObs),
    });
  }

  clear() {
    this.messageService.clear();
  }    

}

interface DD {
  name: string,
  code: string
}
