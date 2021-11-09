  import { Component, OnDestroy, OnInit } from '@angular/core';
  import {ConfirmationService, MessageService} from 'primeng/api';
  import { TreinoaluService } from './treinoalu.service';
  import { TreinoaluModel } from 'src/app/model/treinoalu.model';
  import { Subscription } from 'rxjs';
  import { ActivatedRoute, Router } from '@angular/router';
  import { FormControl, FormGroup } from '@angular/forms';
  
@Component({
  selector: 'app-treinoalu',
  templateUrl: './treinoalu.component.html',
  styleUrls: ['./treinoalu.component.css'],
  providers: [ConfirmationService,TreinoaluService,MessageService]
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

  addDadosTreinoalu: Subscription;
  updateDadosTreinoalu: Subscription;
  deleteDadosTreinoalu: Subscription;
  lerDadosTreinoalu: Subscription;
  
  isLoading = true;
  editMode = false;

  isUpdate = true;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvTreinoalu: TreinoaluService,
    private messageService: MessageService) {}

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.Param = JSON.parse(params.Param);
        if (params.Modo == "EDIT")
        {
          this.editMode = true;
          this.AluIdf = params.AluIdf;
          this.getTreinoalu();
        } else {
          this.editMode = false;
          let Treinoalu: TreinoaluModel;
          this.initForm(Treinoalu);
        }
      }
    );
  }
 

  private getTreinoalu() {
    let Treinoalu: TreinoaluModel;
    let dados = {
      EmpIdf: this.Param.EmpIdf,
      TreIdf: this.Param.TreIdf,
      AluIdf: this.AluIdf
    };
    this.lerDadosTreinoalu = this.srvTreinoalu.getTreAluDados(dados).subscribe(
      (dados) => {
        Treinoalu = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Treinoalu);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.Param.EmpIdf,
      TreIdf: this.Param.TreIdf,
      AluIdf: this.AluIdf,
      TreAluObs: this.dadosForm.value['obs'],
    };    
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosTreinoalu = this.srvTreinoalu.updateTreAluDados(dadosUpdate).subscribe(
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
      this.addDadosTreinoalu = this.srvTreinoalu.addTreAluDados(dadosAdd).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno do treino incluido!'});
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
      this.router.navigate(['../treinoalulista'], { queryParams: { EmpIdf: this.Param.EmpIdf, TreIdf: this.Param.TreIdf, TreTitulo: this.Param.TreTitulo, Data: this.Param.Data } });
    },
    tempo);
  }

  private initForm(dados:TreinoaluModel) { 
    this.isLoading = false;  
    let TreAluObs = null;
    this.dadosForm = new FormGroup({
      'obs': new FormControl(TreAluObs),
    });
  }
  ngOnDestroy(): void {
    if (this.lerDadosTreinoalu != null){
      this.lerDadosTreinoalu.unsubscribe();
    }
    if (this.addDadosTreinoalu != null){
      this.addDadosTreinoalu.unsubscribe();
    }
    if (this.updateDadosTreinoalu != null){
      this.updateDadosTreinoalu.unsubscribe();
    }
  }

  clear() {
    this.messageService.clear();
  }    

} 
