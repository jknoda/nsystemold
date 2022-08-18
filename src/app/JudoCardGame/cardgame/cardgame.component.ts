import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { JudocardService } from '../judocard.service';
import { JudocardModel } from 'src/app/model/judocard.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { sharedStylesheetJitUrl } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-cardgame',
  templateUrl: './cardgame.component.html',
  styleUrls: ['./cardgame.component.css'],
  providers: [ConfirmationService,JudocardService,MessageService]
})
export class CardgameComponent implements OnInit, OnDestroy{

  private EmpIdf: number = ServiceConfig.EMPIDF;
  private Data: Date = new Date();
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  Idf = 0;

  classes : DD[];
  categorias: DD[];

  selectedClasCode : string;
  selectedCatCode : string;
  selectedClasName : string;
  selectedCatName : string;
  selectedClasNameAux: string;

  card : JudocardModel;
  allCards : JudocardModel[];

  addDadosJudocard: Subscription;
  updateDadosJudocard: Subscription;
  deleteDadosJudocard: Subscription;
  lerDadosJudocard: Subscription;

  isLoading = true;
  showCard = false;
  hasImagem = false;
  showResposta = false;
  showErro = false;
  isSortReves = 'N';

  uploadedFile : any;
  uploadedName: any;
  JudocardImg: SafeResourceUrl;

  cont = 0;

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
    this.selectedClasCode = "4";
    this.selectedCatCode = "1";  
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.getAllCards();
  }

  private getAllCards() {
    this.lerDadosJudocard = this.srvJudocard.getTodos().subscribe(
      (dados) => {
        this.allCards = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.message;
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        return;
      });
  }

  sorteiaCard()
  {
    let Aux : JudocardModel;
    let nMax = this.allCards.length;
    for(let i=0; i<nMax; i++){
      let ind1 = Math.floor(Math.random() * this.allCards.length);
      let ind2 = Math.floor(Math.random() * this.allCards.length);
      Aux = this.allCards[ind1];
      this.allCards[ind1] = this.allCards[ind2];
      this.allCards[ind2] = Aux;
    }
    let clasIdf = parseInt(this.selectedClasCode);
    let catIdf = parseInt(this.selectedCatCode);
    let ind = this.allCards.findIndex(x=>x.CatIdf == catIdf && x.ClasIdf == clasIdf && x.Selecionado == 'N');
    if (ind == -1)
    {
      this.Idf = -1;
      return;
    }
    this.cont += 1;
    this.Idf = this.allCards[ind].Idf;
    this.allCards[ind].Selecionado = 'S';
  }

  getCard()
  {
    this.isLoading = true;
    this.showErro = false;
    let indCat = parseInt(this.selectedCatCode)-1;
    this.selectedCatName = this.categorias[indCat].name;
    let indClas = parseInt(this.selectedClasCode)-1;
    this.selectedClasName = this.classes[indClas].name;
    this.sorteiaCard();
    if (this.Idf == -1)
    {
      let clasIdf = parseInt(this.selectedClasCode);
      let catIdf = parseInt(this.selectedCatCode);
      this.allCards.forEach(item=>{
        if (item.CatIdf == catIdf && item.ClasIdf == clasIdf){
          item.Selecionado = 'N';
        }
      });
      this.sorteiaCard();
    }
    if (this.Idf == -1)
    {
      this.isLoading = false;
      this.showErro = true;
    }
    else
    {
      this.showResposta = false;
      this.getJudocard();
    }
  }

  retCard()
  {
    this.showCard = false;
    this.showResposta = false;
  }

  resposta()
  {
    this.showResposta = !this.showResposta;
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
    this.isLoading = true;
    this.hasImagem = false;
    let dados = {
      Idf: this.Idf
    };
    let Judocard : JudocardModel;
    this.lerDadosJudocard = this.srvJudocard.getDados(dados).subscribe(
      (dados) => {
        Judocard = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.message; 
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.card = Judocard;
        if (Judocard.Imagem){
          let imagem = this.bin2String(Judocard.Imagem["data"]);
          this.JudocardImg = this.sanitizer.bypassSecurityTrustUrl(imagem);
          this.hasImagem = true;
        }        
        this.selectedClasNameAux = this.selectedClasName + ' (' + this.card.CardIdf.toString()+')';
        this.isSortReves = 'N';
        if (this.selectedCatCode == '5') {
           // Sorte ou reves
          this.isSortReves = this.card.Resposta.substring(0,1);
          this.card.Desafio = this.card.Desafio.replace('REVÉS','').replace('SORTE','');          
        }
        this.isLoading = false;
        this.showCard = true;
      });
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
  
  alterCat()
  {
    if (this.selectedCatCode == '1' || this.selectedCatCode == '5')
    {
      this.selectedClasCode = '4';
    }
    else
    {
      this.selectedClasCode = '1';
    }
  }

}

interface DD {
  name: string,
  code: string
}
