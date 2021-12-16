import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NewsModel } from '../model/news.model';
import { ServiceConfig } from '../_config/services.config';
import { NewsService } from './noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticiaslista.component.css'],
  providers: [NewsService,MessageService]
})
export class NoticiasComponent implements OnInit {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private NewsIdf: number = 0;

  dadosForm: FormGroup;

  addDados: Subscription;
  
  isLoading = true;
  editMode = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvNews: NewsService, private messageService: MessageService) 
  {    
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.NewsIdf = params.NewsIdf;
        this.editMode = false;
        let News: NewsModel;
        this.initForm(News);
      }
    );
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      NewsTitulo: this.dadosForm.value['titulo'],
      NewsTexto: this.dadosForm.value['noticia'],
      NewsData: new Date(),
      NewsAutor: JSON.parse(localStorage.getItem('userData')).nome
    };    
    this.addDados = this.srvNews.addNewsDados(dados).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Notícia incluida!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.retorno();
      });
  }

  cancelar() {
    this.retorno(0);
  }

  private retorno(tempo=1010){
    setTimeout(() => 
    {
      this.router.navigate(['../noticiaslista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:NewsModel) {   
    this.isLoading = false;
    let NewsTitulo = null;
    let NewsTexto = null;
    if (dados != null)
    {
      NewsTitulo = dados.NewsTitulo;	
      NewsTexto = dados.NewsTexto;	
    }
    this.dadosForm = new FormGroup({
      'titulo': new FormControl(NewsTitulo, Validators.required),
      'noticia': new FormControl(NewsTexto, Validators.required),
    });
  }

  clear() {
    this.messageService.clear();
  }    


  ngOnDestroy(): void {
    if (this.addDados != null){
      this.addDados.unsubscribe();
    }
  }

}
