import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { RespcardService } from './respcard.service';
import { JudocardrespModel } from 'src/app/model/judocardresp.model';

@Component({
  selector: 'app-respcard',
  templateUrl: './respcard.component.html',
  styleUrls: ['./respcard.component.css'],
  providers: [ConfirmationService,RespcardService,MessageService]
})
export class RespcardComponent implements OnInit,OnDestroy {

  dadosForm: FormGroup;
  
  addDadosJudocard: Subscription;
  updateDadosJudocard: Subscription;
  deleteDadosJudocard: Subscription;
  lerDadosJudocard: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  Idf = 0;
  IdfSeq = 0;
  Questao = '';

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvJudocard: RespcardService, 
    private messageService: MessageService) { }

  ngOnDestroy(): void {
     if (this.lerDadosJudocard != null){
      this.lerDadosJudocard.unsubscribe();
    }
    if (this.addDadosJudocard != null){
      this.addDadosJudocard.unsubscribe();
    }
    if (this.updateDadosJudocard != null){
      this.updateDadosJudocard.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.Judocards();
  }

  private Judocards() {
    this.route.queryParams
      .subscribe(params => {
        this.Idf = params.Idf;
        this.IdfSeq = params.IdfSeq;
        this.Questao = params.Questao;
        if (params.Modo == "EDIT") {
          this.editMode = true;
          this.getJudocard();
        } else {
          this.editMode = false;
          let Judocard: JudocardrespModel;
          this.initForm(Judocard);
        }
      }
      );
  }

  private getJudocard() {
    let Judocard: JudocardrespModel;
    let dados = {
      Idf: this.Idf,
      IdfSeq: this.IdfSeq
    };
    this.lerDadosJudocard = this.srvJudocard.getDados(dados).subscribe(
      (dados) => {
        Judocard = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.message; 
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Judocard);
      });
  }

  onSubmit() {
    let dados = {
      Idf: this.Idf,
      IdfSeq: this.IdfSeq,
      Correto: this.dadosForm.value['correto'],
      RespostaTxt: this.dadosForm.value['respostatxt'],
      RespostaUrl: this.dadosForm.value['respostaurl']
    };   

    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosJudocard = this.srvJudocard.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Judocard atualizado!'});
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
      this.addDadosJudocard = this.srvJudocard.addDados(dadosAdd).subscribe(
        (ret:any) => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Judocard incluido!'});
          dados.Idf = ret;
        },
        err => { 
          let msg = err.error.errors.toString();
          if (!msg)
          {
            msg = err.error.msg;
          }
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.retorno();        }
      );
    }
  }

  cancelar() {
    this.retorno(0);
  }

  private retorno(tempo=1010){
    setTimeout(() => 
    {
      this.router.navigate(['respcardlista'], { queryParams: { Idf: this.Idf, Questao: this.Questao} });
    },
    tempo);
  }

  private initForm(dados:JudocardrespModel) {   
    this.isLoading = false;
    let Correto = 'N';
    let RespostaTxt = '';
    let RespostaUrl = '';
    if (dados != null)
    {
      Correto = dados.Correto;
      RespostaTxt = dados.RespostaTxt;
      RespostaUrl = dados.RespostaUrl;
    }
    this.dadosForm = new FormGroup({
      'correto': new FormControl(Correto, Validators.required),
      'respostatxt': new FormControl(RespostaTxt),
      'respostaurl': new FormControl(RespostaUrl)
    });
  }
}
