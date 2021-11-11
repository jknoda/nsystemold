import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AnamneseService } from './anamnese.service';
import { AnamneseModel } from 'src/app/model/anamnese.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anamnese',
  templateUrl: './anamnese.component.html',
  styleUrls: ['./anamnese.component.css'],
  providers: [ConfirmationService,AnamneseService,MessageService]
})
export class AnamneseComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private AluIdf: number = 0;
  private AnaIdf: number = 0;

  aluno = "";

  dadosForm: FormGroup;

  addDadosAnamnese: Subscription;
  updateDadosAnamnese: Subscription;
  deleteDadosAnamnese: Subscription;
  lerDadosAnamnese: Subscription;

  isLoading = true;
  editMode = true;

  isUpdate = true;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvAnamnese: AnamneseService, private messageService: MessageService) {}
 
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.AluIdf = params.AluIdf;
        this.aluno = params.AluNome;
        this.getAnamnese();
      }
    );
  }

  private getAnamnese() {
    let Anamnese: AnamneseModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };
    this.lerDadosAnamnese = this.srvAnamnese.lastAnaDados(dados).subscribe(
      (dados) => {
        if (dados){
          Anamnese = JSON.parse(JSON.stringify(dados));
          Anamnese.AnaData = new Date(Anamnese.AnaData);
        }else{
          Anamnese = new AnamneseModel;
          Anamnese.AnaIdf = 0;
        }
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.AnaIdf = Anamnese.AnaIdf;
        if (this.AnaIdf == 0){
          this.editMode = false;
        }else{
          this.editMode = true;
        }

        this.initForm(Anamnese);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf,
      AnaIdf: this.AnaIdf,
      AnaData: this.dadosForm.value['data'],
      AnaConvenio: this.dadosForm.value['convenio'],
      AnaRespEmergencia: this.dadosForm.value['respemer'],
      AnaRespEmeFone: this.dadosForm.value['foneemer'],
      AnaRespEmeObs: this.dadosForm.value['obsemer'],
      AnaTipoSangue: this.dadosForm.value['sangue'],
      AnaHipertenso: this.dadosForm.value['hipertenso'],
      AnaDiabetes: this.dadosForm.value['diabetes'],
      AnaCardiaco: this.dadosForm.value['cardiaco'],
      AnaLabirintite: this.dadosForm.value['labirintite'],
      AnaAsma: this.dadosForm.value['asma'],
      AnaConvulcoes: this.dadosForm.value['convulcoes'],
      AnaAlergia: this.dadosForm.value['alergia'],
      AnaDepressao: this.dadosForm.value['depressao'],
      AnaOutras: this.dadosForm.value['outras'],
      AnaMedicamentos: this.dadosForm.value['medicamentos'],
      AnaCirurgia: this.dadosForm.value['cirurgia'],
      AnaOsseo: this.dadosForm.value['osseo'],
      AnaFratura: this.dadosForm.value['fratura']
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosAnamnese = this.srvAnamnese.updateAnaDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Anamnese atualizado!'});
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
        ...dados,
        AnaStatus: 'A'
    }
    this.addDadosAnamnese = this.srvAnamnese.addAnaDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Anamnese incluido!'});
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

  private retorno(tempo=3010){
    setTimeout(() => 
    {
      this.router.navigate(['../alunolista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:AnamneseModel) {   
    this.isLoading = false;
    let AnaData = new Date();
    let AnaConvenio = null;
    let AnaRespEmergencia = null;
    let AnaRespEmeFone = null;
    let AnaRespEmeObs = null;
    let AnaTipoSangue = null;
    let AnaHipertenso = false;
    let AnaDiabetes = false;
    let AnaCardiaco = false;
    let AnaLabirintite = false;
    let AnaAsma = false;
    let AnaConvulcoes = false;
    let AnaAlergia = null;
    let AnaDepressao = false;
    let AnaOutras = null;
    let AnaMedicamentos = null;
    let AnaCirurgia = null;
    let AnaOsseo = null;
    let AnaFratura = null;
   
    if (dados != null)
    {
      AnaData = dados.AnaData;
      AnaConvenio = dados.AnaConvenio;
      AnaRespEmergencia = dados.AnaRespEmergencia;
      AnaRespEmeFone = dados.AnaRespEmeFone;
      AnaRespEmeObs = dados.AnaRespEmeObs;
      AnaTipoSangue = dados.AnaTipoSangue;
      AnaHipertenso = dados.AnaHipertenso == '1';
      AnaDiabetes = dados.AnaDiabetes == '1';
      AnaCardiaco = dados.AnaCardiaco == '1';
      AnaLabirintite = dados.AnaLabirintite == '1';
      AnaAsma = dados.AnaAsma == '1';
      AnaConvulcoes = dados.AnaConvulcoes == '1';
      AnaAlergia = dados.AnaAlergia;
      AnaDepressao = dados.AnaDepressao == '1';
      AnaOutras = dados.AnaOutras;
      AnaMedicamentos = dados.AnaMedicamentos;
      AnaCirurgia = dados.AnaCirurgia;
      AnaOsseo = dados.AnaOsseo;
      AnaFratura = dados.AnaFratura;
    }
    this.dadosForm = new FormGroup({
      'data': new FormControl(AnaData),
      'convenio': new FormControl(AnaConvenio),
      'respemer': new FormControl(AnaRespEmergencia, Validators.required),
      'foneemer': new FormControl(AnaRespEmeFone, Validators.required),
      'obsemer': new FormControl(AnaRespEmeObs),
      'sangue': new FormControl(AnaTipoSangue),
      'hipertenso': new FormControl(AnaHipertenso),
      'diabetes': new FormControl(AnaDiabetes),
      'cardiaco': new FormControl(AnaCardiaco),
      'labirintite': new FormControl(AnaLabirintite),
      'asma': new FormControl(AnaAsma),
      'convulcoes': new FormControl(AnaConvulcoes),
      'alergia': new FormControl(AnaAlergia),
      'depressao': new FormControl(AnaDepressao),
      'outras': new FormControl(AnaOutras),
      'medicamentos': new FormControl(AnaMedicamentos),
      'cirurgia': new FormControl(AnaCirurgia),
      'osseo': new FormControl(AnaOsseo),
      'fratura': new FormControl(AnaFratura)
    });
  }

  clear() {
    this.messageService.clear();
  }

  ngOnDestroy(): void {
    if (this.lerDadosAnamnese != null){
      this.lerDadosAnamnese.unsubscribe();
    }
    if (this.addDadosAnamnese != null){
      this.addDadosAnamnese.unsubscribe();
    }
    if (this.updateDadosAnamnese != null){
      this.updateDadosAnamnese.unsubscribe();
    }
  }
}
