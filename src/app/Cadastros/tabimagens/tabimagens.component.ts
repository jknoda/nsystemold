import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TabimagensService } from './tabimagens.service';
import { TabImagensModel } from 'src/app/model/tabimagens.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tabimagens',
  templateUrl: './tabimagens.component.html',
  styleUrls: ['./tabimagens.component.css'],
  providers: [ConfirmationService,TabimagensService,MessageService]
})
export class TabimagensComponent implements OnInit , OnDestroy{

  private EmpIdf: number = ServiceConfig.EMPIDF;
  private Data: Date = new Date();
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  Idf = 0;
  IdfAux = 0;
  IdfSeqAux = 0;
  Questao = '';

  isTecnico = false;

  dadosForm: FormGroup;
  
  classes : DD[];
  categorias: DD[];

  addDadosTabImagens: Subscription;
  updateDadosTabImagens: Subscription;
  deleteDadosTabImagens: Subscription;
  lerDadosTabImagens: Subscription;

  isLoading = true;
  editMode = false;

  isUpdate = true;

  uploadedFile : any;
  uploadedName: any;
  TabImagensImg: SafeResourceUrl;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvTabImagens: TabimagensService, 
    private messageService: MessageService,
    private sanitizer:DomSanitizer) {

      this.categorias = [
        {name: 'GERAL', code: '0'},
        {name: 'KIHON-Fundamentos', code: '1'},
        {name: 'GOKYO', code: '2'},
        {name: 'KATAMEWAZA', code: '3'},
        {name: 'DIVERSOS', code: '4'},
        {name: 'SORTE ou REVES', code: '5'}
      ]
  }

  
  ngOnDestroy(): void {
    if (this.lerDadosTabImagens != null){
      this.lerDadosTabImagens.unsubscribe();
    }
    if (this.addDadosTabImagens != null){
      this.addDadosTabImagens.unsubscribe();
    }
    if (this.updateDadosTabImagens != null){
      this.updateDadosTabImagens.unsubscribe();
    }
  }

  ngOnInit() {
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.TabImagens();
  }

  private TabImagens() {
    this.route.queryParams
      .subscribe(params => {
        this.Idf = params.Idf;
        if (params.Modo == "EDIT") {
          this.editMode = true;
          this.getTabImagens();
        } else {
          this.editMode = false;
          let TabImagens: TabImagensModel;
          this.initForm(TabImagens);
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

  private getTabImagens() {
    let TabImagens: TabImagensModel;
    let dados = {
      Idf: this.Idf
    };
    this.lerDadosTabImagens = this.srvTabImagens.getDados(dados).subscribe(
      (dados) => {
        TabImagens = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.message; 
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(TabImagens);
      });
  }

  onSubmit() {
    let dados = {
      Idf: this.Idf,
      Imagem: this.uploadedFile,
      ImgIdf: parseInt(this.dadosForm.value['imgidf']),
      CatIdf: parseInt(this.dadosForm.value['categoria']),
      ImgNom: this.dadosForm.value['imgnom'],
      FileName: this.uploadedName
    }; 
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      this.updateDadosTabImagens = this.srvTabImagens.updateDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Imagem atualizada!'});
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
      this.addDadosTabImagens = this.srvTabImagens.addDados(dadosAdd).subscribe(
        (ret:any) => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Imagem incluida!'});
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
          this.TabImagens();
          this.router.navigate(['tabimagens'], { queryParams: { Modo:'INSERT', Idf: 0 } });
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
      this.router.navigate(['../tabimagenslista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:TabImagensModel) {   
    this.isLoading = false;
    this.Idf = 0;
    let ImgIdf = 0;
    let CatIdf = 1;
    let ImgNom = '';
    let FileName = '';
    if (dados != null)
    {
      this.Idf = dados.Idf;
      ImgIdf = dados.ImgIdf;
      CatIdf = dados.CatIdf;
      ImgNom = dados.ImgNom;
      FileName = dados.FileName;
      if (dados.Imagem){
        let imagem = this.bin2String(dados.Imagem["data"]);
        this.TabImagensImg = this.sanitizer.bypassSecurityTrustUrl(imagem);
      }
    }
    this.dadosForm = new FormGroup({
      'imgidf': new FormControl(ImgIdf),
      'categoria': new FormControl(CatIdf.toString()),
      'imgnom': new FormControl(ImgNom, Validators.required)
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
