import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { TabimagensService } from './tabimagens.service';
import { TabImagensModel } from 'src/app/model/tabimagens.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-tabimagenslista',
  templateUrl: './tabimagenslista.component.html',
  styleUrls: ['./tabimagens.component.css'],
  providers: [MessageService,ConfirmationService,TabimagensService]
})
export class TabimagenslistaComponent implements OnInit, OnDestroy {

  private EmpIdf: number = ServiceConfig.EMPIDF;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;

  deleteDadosImagens: Subscription;
  lerDadosImagens: Subscription;
  statusDadosImagens: Subscription;

  Tabimagens: TabImagensModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;
  
  constructor(private router: Router, private srvImagens: TabimagensService, 
    private messageService: MessageService, private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getImagens();
  }

  private getImagens() {
    let dados = {
      Idf: 0
    };
    this.lerDadosImagens = this.srvImagens.getTodos(dados).subscribe(
      (dados) => {
        this.Tabimagens = JSON.parse(JSON.stringify(dados));
        this.Tabimagens.forEach(item=>{
          let imagem = this.bin2String(item.Imagem["data"]);
          item.Img = this.sanitizer.bypassSecurityTrustUrl(imagem);
        })
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

  bin2String(array) {
    var retorno = '';
    for(let j=0;j<array.length;j++){
      retorno = retorno + String.fromCharCode(array[j])
    }
    return retorno;
  }

  openNew() {
    this.router.navigate(['tabimagens'], { queryParams: { Modo:'INSERT', Idf: 0 } });
  }

  editImagens(Imagens: TabImagensModel) {
    this.router.navigate(['tabimagens'], { queryParams: { Modo:'EDIT', Idf: Imagens.Idf } });
  }

  respostasImagens(Imagens: TabImagensModel) {
    this.router.navigate(['tabimagenslista'], { queryParams: { Modo:'LISTA', Idf: Imagens.Idf, Nome: Imagens.ImgNom } });
  }

  deleteImagens(Imagens: TabImagensModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Imagens.ImgNom + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          Idf: Imagens.Idf
        };
        this.isLoading = true;
        this.deleteDadosImagens = this.srvImagens.deleteDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Imagens excluido!', life: 3000});
          },
          err => { 
            let msg = err.message; 
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.isLoading = false;
            this.refresh();
          });
        }
    });
  }

  private refresh(){
    this.submitted = true;
    this.getImagens();
  }

  ngOnDestroy() {
    if ( this.lerDadosImagens != null){
      this.lerDadosImagens.unsubscribe();
    }
    if (this.deleteDadosImagens != null){
      this.deleteDadosImagens.unsubscribe();
    }
  }
}
