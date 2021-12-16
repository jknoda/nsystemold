import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NewsModel } from '../model/news.model';
import { ServiceConfig } from '../_config/services.config';
import { NewsService } from './noticias.service';

@Component({
  selector: 'app-noticiaslista',
  templateUrl: './noticiaslista.component.html',
  styleUrls: ['./noticiaslista.component.css'],
  providers: [MessageService,ConfirmationService,NewsService,MessageService]
})
export class NoticiaslistaComponent implements OnInit {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  deleteDados: Subscription;
  lerDados: Subscription;
  Autor = JSON.parse(localStorage.getItem('userData')).nome;

  News: NewsModel[];
  submitted: boolean;
  isUpdate = true;
  isLoading = true;

  isAdm = false;
  
  constructor(private router: Router, private route: ActivatedRoute, 
    private srvNews: NewsService, private messageService: MessageService, 
    private confirmationService: ConfirmationService) 
  {
  }
  
  ngOnInit() {
    this.isAdm = JSON.parse(localStorage.getItem('userData')).perfil == 'A';
    this.getNews();
  }

  private getNews() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.lerDados = this.srvNews.getNewsTodos(dados).subscribe(
      (dados) => {
        this.News = JSON.parse(JSON.stringify(dados));
        this.News.forEach(item=>{
          item.NewsData = new Date(item.NewsData);
          item.DataStr = item.NewsData.getDate().toString().padStart(2,'0') + '/' + 
             (item.NewsData.getMonth()+1).toString().padStart(2,'0') + '/' +  // janeiro começa com 0
             item.NewsData.getFullYear().toString();
        })
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        return;
      });
  }

  openNew() {
    this.router.navigate(['noticias'], { queryParams: { Modo:'INSERT', EmpIdf: this.EmpIdf, TreIdf: 0 } });
  }


  delete(Item: NewsModel) {
    this.confirmationService.confirm({
      message: 'Confirma exclusão de <b>' + Item.NewsTitulo + '</b> ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => {
        let dados = {
          EmpIdf: Item.EmpIdf,
          NewsIdf: Item.NewsIdf
        };
        this.deleteDados = this.srvNews.deleteNewsDados(dados).subscribe(
          () => {
            this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Notícia excluida!', life: 3000});
          },
          err => { 
            let msg = err.error.errors.toString();
            this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
          },
          ()=>{
            this.refresh();
          });
        }
    });
  }

  private refresh(){
    this.submitted = true;
    this.getNews();
  }

  ngOnDestroy() {
    if ( this.lerDados != null){
      this.lerDados.unsubscribe();
    }
    if (this.deleteDados != null){
      this.deleteDados.unsubscribe();
    }
  }
}
