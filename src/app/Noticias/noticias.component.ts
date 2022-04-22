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

  uploadedFile : any;
  uploadedName: any;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvNews: NewsService, private messageService: MessageService, private sendmailService: SendmailService) 
  {    
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
    //console.log(arquivo);
    this.uploadedName = nome;
    this.messageService.add({severity:'success', summary: 'Successo', detail: 'Imagem incluida!'});
  }

  ngOnInit() {
    //console.log("Start")
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
      NewsEmail: JSON.parse(localStorage.getItem('userData')).email,
      NewsImage: this.uploadedFile,
      NewsImageFile: this.uploadedName
    };    
    this.addDados = this.srvNews.addNewsDados(dados).subscribe(
      () => {
        this.sendMail(dados.NewsAutor,dados.NewsEmail,dados.NewsTexto,dados.NewsTexto, dados.NewsTitulo);
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

  sendMail(nome, email, texto, textoHtml, titulo){
    this.mail.subject = "News - " + titulo;
    this.mail.cc = "";
    this.mail.text = " Enviado por " + nome + " - "+email+"\n\n";
    this.mail.text += "Notícia: \n" + "( " + texto +" )";
    this.mail.html = " Enviado por " + nome + " - "+email+"<br/><br/>";
    this.mail.html += "Notícia: <br/>" + "( " + textoHtml +" )";
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
