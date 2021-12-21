import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MailModel } from '../model/mail.model';
import { NewsModel } from '../model/news.model';
import { SendmailService } from '../shared/sendmail.service';
import { ServiceConfig } from '../_config/services.config';
import { NewsService } from './noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticiaslista.component.css'],
  providers: [NewsService,MessageService,SendmailService]
})
export class NoticiasComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private NewsIdf: number = 0;
  mail = new MailModel();

  dadosForm: FormGroup;

  addDados: Subscription;
  sendMailSub: Subscription;  

  isLoading = true;
  editMode = false;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvNews: NewsService, private messageService: MessageService, private sendmailService: SendmailService) 
  {    
  }

  ngOnInit() {
    this.mail = JSON.parse(localStorage.getItem('emailConfig'));
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
      NewsAutor: JSON.parse(localStorage.getItem('userData')).nome,
      NewsEmail: JSON.parse(localStorage.getItem('userData')).email
    };    
    this.addDados = this.srvNews.addNewsDados(dados).subscribe(
      () => {
        this.sendMail(dados.NewsAutor,dados.NewsEmail,dados.NewsTexto,dados.NewsTexto);
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

  sendMail(nome, email, texto, textoHtml){
    this.mail.subject = "Nova notícia";
    this.mail.cc = "";
    this.mail.subject += " enviado por " + nome + " - "+email;
    this.mail.text = "Notícia: \n" + "( " + texto +" )";
    this.mail.html = "Notícia: <br/>" + "( " + textoHtml +" )";
    this.sendMailSub = this.sendmailService.sendMail(this.mail).subscribe(
      () => {
        //this.messageService.add({severity:'success', summary: 'Successo', detail: 'Comentário excluído!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      }
    );
  }

  ngOnDestroy(): void {
    if (this.addDados != null){
      this.addDados.unsubscribe();
    }

    if (this.sendMailSub != null){
      this.sendMailSub.unsubscribe();
    }
  }

}
