import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AtividadeService } from './atividade.service';
import { AtividadeModel } from 'src/app/model/atividade.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-atividade',
  templateUrl: './atividade.component.html',
  styleUrls: ['./atividade.component.css'],
  providers: [ConfirmationService,AtividadeService,MessageService]
})

export class AtividadeComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private AtvIdf: number = 0;

  text1 = "";

  dadosForm: FormGroup;

  addDadosAtividade: Subscription;
  updateDadosAtividade: Subscription;
  deleteDadosAtividade: Subscription;
  lerDadosAtividade: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvAtividade: AtividadeService, private messageService: MessageService) {
   }
  ngOnDestroy(): void {
    if (this.lerDadosAtividade != null){
      this.lerDadosAtividade.unsubscribe();
    }
    if (this.addDadosAtividade != null){
      this.addDadosAtividade.unsubscribe();
    }
    if (this.updateDadosAtividade != null){
      this.updateDadosAtividade.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.AtvIdf = params.AtvIdf;
        if (params.Modo == "EDIT")
        {
          this.editMode = true;
          this.getAtividade();
        } else {
          this.editMode = false;
          let Atividade: AtividadeModel;
          this.initForm(Atividade);
        }
      }
    );
  }

  private getAtividade() {
    let Atividade: AtividadeModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AtvIdf: this.AtvIdf
    };
    this.lerDadosAtividade = this.srvAtividade.getAtvDados(dados).subscribe(
      (dados) => {
        Atividade = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Atividade);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AtvIdf: this.AtvIdf,
      Atividademe: this.dadosForm.value['nome'],
      AtvTitulo:  this.dadosForm.value['titulo'],
      AtvObjetivo: this.dadosForm.value['objetivo'],
      AtvDescricao: this.dadosForm.value['descricao'],
      AtvMaterial: this.dadosForm.value['material'],
      AtvObs: this.dadosForm.value['obs'],
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosAtividade = this.srvAtividade.updateAtvDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Atividade atualizado!'});
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
      this.addDadosAtividade = this.srvAtividade.addAtvDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Atividade incluido!'});
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
      this.router.navigate(['../atividadelista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:AtividadeModel) {   
    this.isLoading = false;
    let AtvTitulo = null;
    let AtvObjetivo = null;
    let AtvDescricao = null;
    let AtvMaterial = null;
    let AtvObs = null;
    if (dados != null)
    {
      AtvTitulo = dados.AtvTitulo;
      AtvObjetivo = dados.AtvObjetivo;
      AtvDescricao = dados.AtvDescricao;		
      AtvMaterial = dados.AtvMaterial;
      AtvObs = dados.AtvObs;
    }
    this.dadosForm = new FormGroup({
      'titulo': new FormControl(AtvTitulo, Validators.required),
      'objetivo': new FormControl(AtvObjetivo),
      'descricao': new FormControl(AtvDescricao),
      'material': new FormControl(AtvMaterial),
      'obs': new FormControl(AtvObs),
    });
  }

  clear() {
    this.messageService.clear();
  }    

}