import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { JudocardService } from '../judocard.service';
import { JudocardModel } from 'src/app/model/judocard.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mantercard',
  templateUrl: './mantercard.component.html',
  styleUrls: ['./mantercard.component.css'],
  providers: [ConfirmationService,JudocardService,MessageService]
})
export class MantercardComponent implements OnInit, OnDestroy{

  private EmpIdf: number = ServiceConfig.EMPIDF;
  private Data: Date = new Date();
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  Idf = 0;
  isTecnico = false;

  dadosForm: FormGroup;
  
  classes : DD[];
  categorias: DD[];

  addDadosJudocard: Subscription;
  updateDadosJudocard: Subscription;
  deleteDadosJudocard: Subscription;
  lerDadosJudocard: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  uploadedFile : any;
  uploadedName: any;
  JudocardImg: SafeResourceUrl;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvJudocard: JudocardService, 
    private messageService: MessageService,
    private sanitizer:DomSanitizer) {

      this.categorias = [
        {name: 'KIHON-Fundamentos', code: '1'},
        {name: 'GOKYO', code: '2'},
        {name: 'KATAMEWAZA', code: '3'},
        {name: 'DIVERSOS', code: '4'},
        {name: 'SORTE ou REVES', code: '5'}
      ]

      this.classes = [
        {name: 'INFANTIL', code: '1'},
        {name: 'JUVENIL', code: '2'},
        {name: 'SÊNIOR', code: '3'},
        {name: 'GERAL', code: '4'}
      ]
  }

 
  
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

  ngOnInit() {
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.Judocards();
  }

  private Judocards() {
    this.route.queryParams
      .subscribe(params => {
        this.Idf = params.Idf;
        if (params.Modo == "EDIT") {
          this.editMode = true;
          this.getJudocard();
        } else {
          this.editMode = false;
          let Judocard: JudocardModel;
          this.initForm(Judocard);
        }
      }
      );
  }

  myUploader(event) {
    let fileReader = new FileReader();
    let _this = this;
    for (let file of event.files) {
      fileReader.readAsDataURL(file);
      fileReader.onloadend = function () {
          _this.ler(file.name, fileReader.result);
      };
    }
  }

  remove()
  {
    this.uploadedFile = null;
    this.uploadedName = null;
  }

  private ler(nome, arquivo)
  {
    this.uploadedFile = arquivo;
    this.uploadedName = nome;
    this.messageService.add({severity:'success', summary: 'Successo', detail: 'Imagem incluida!'});
  }

  private getJudocard() {
    let Judocard: JudocardModel;
    let dados = {
      Idf: this.Idf
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
      UsuIdf: this.UsuIdf,
      Imagem: this.uploadedFile,
      Desafio: this.dadosForm.value['desafio'],
      CatIdf: parseInt(this.dadosForm.value['categoria']),
      ClasIdf: parseInt(this.dadosForm.value['classe']),
      Resposta: this.dadosForm.value['resposta'],
      CardIdf: this.dadosForm.value['cardidf'],
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
      dadosAdd.Idf = 0;
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
          this.Judocards();
          this.router.navigate(['mantercard'], { queryParams: { Modo:'INSERT', Idf: 0 } });
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
      this.router.navigate(['../mantercardlista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:JudocardModel) {   
    this.isLoading = false;
    let Desafio = '';
    let CatIdf = 1;
    let ClassIdf = 1;
    let Resposta = '';
    let CardIdf = 0;
    if (dados != null)
    {
      Desafio = dados.Desafio;
      CatIdf = dados.CatIdf;
      ClassIdf = dados.ClasIdf;
      Resposta = dados.Resposta;
      CardIdf = dados.CardIdf;
      if (dados.Imagem){
        let imagem = this.bin2String(dados.Imagem["data"]);
        this.JudocardImg = this.sanitizer.bypassSecurityTrustUrl(imagem);
      }
    }
    this.dadosForm = new FormGroup({
      'desafio': new FormControl(Desafio, Validators.required),
      'categoria': new FormControl(CatIdf.toString(), Validators.required),
      'classe': new FormControl(ClassIdf.toString(), Validators.required),
      'resposta': new FormControl(Resposta, Validators.required),
      'cardidf': new FormControl(String(CardIdf))
    });
  }

  bin2String(array) {
    var retorno = '';
    for(let j=0;j<array.length;j++){
      retorno = retorno + String.fromCharCode(array[j])
    }
    return retorno;
  }

  clear() {
    this.messageService.clear();
  }    

}

interface DD {
  name: string,
  code: string
}
