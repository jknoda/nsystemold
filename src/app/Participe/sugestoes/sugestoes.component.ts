import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService,MessageService} from 'primeng/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ServiceConfig } from 'src/app/_config/services.config';
import { MensagemModel } from 'src/app/model/mensagem.model';
import { SugestoesService } from './sugestoes.service';
import { SendmailService } from 'src/app/shared/sendmail.service';
import { MailModel } from 'src/app/model/mail.model';


@Component({
  selector: 'app-sugestoes',
  templateUrl: './sugestoes.component.html',
  styleUrls: ['./sugestoes.component.css'],
  providers: [SugestoesService,MessageService,ConfirmationService,SendmailService]
})

export class SugestoesComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  private UsuEmail = JSON.parse(localStorage.getItem('userData')).email;
  private MsgNome = JSON.parse(localStorage.getItem('userData')).nome;

  mail = new MailModel();

  addDados: Subscription;
  addDadosItem: Subscription;
  getDados: Subscription;
  delDados: Subscription;
  sendMailSub: Subscription;
  Sugestoes: MensagemModel[];

  dadosForm: FormGroup;

  isLoading = true;
  isComentario = false;
  displayModal = false;
  MsgIdf = 0;  
  MsgTexto = "";
  MsgSugestao = "";
  perfil = "";


  constructor(private srvMensagem:SugestoesService, 
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private sendmailService: SendmailService) { }


  ngOnInit(): void {
    this.perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.mail = JSON.parse(localStorage.getItem('emailConfig'));
    console.log(this.mail);
    this.carregaDados();
  }

  carregaDados(){
    this.isLoading = true;
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.getDados = this.srvMensagem.getTodos(dados).subscribe(
      (dados) => {
        this.Sugestoes = JSON.parse(JSON.stringify(dados));
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.initForm(null);
      });
  }  

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      MsgEmail: this.UsuEmail,
      MsgNome: this.MsgNome,
      UsuIdf: this.UsuIdf,
      MsgTexto: this.dadosForm.value['texto'],
    };    
    this.addDados = this.srvMensagem.addDados(dados).subscribe(
      () => {
        this.sendMail(dados.MsgNome,dados.MsgEmail,dados.MsgTexto,dados.MsgTexto,"S");
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Assunto incluido!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.carregaDados();
      }
    );
  }

  private initForm(dados:MensagemModel) {   
    this.isLoading = false;
    let MsgTexto = "";
    if (dados != null)
    {
      MsgTexto = dados.MsgTexto;
    }
    this.dadosForm = new FormGroup({
      'texto': new FormControl(MsgTexto, Validators.required),
    });
  }

  confirm(event: Event, msg) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Confirma exclusão deste assunto ?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            this.deleteMsg(msg);
        },
        reject: () => {
          this.carregaDados();
        }
    });
  }

  deleteMsg(msg) {
    let dados = {
      EmpIdf: this.EmpIdf,
      MsgIdf: msg.MsgIdf,
      MsgIdfIt: msg.MsgIdfIt
    };    
    this.delDados = this.srvMensagem.delDado(dados).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Assunto excluído!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.carregaDados();
      }
    );
  }

  comentar(msg){
    this.MsgTexto = "";
    this.MsgIdf = msg.MsgIdf;
    this.displayModal = true;
    this.MsgSugestao = msg.DataInc.toString() + " - " +  msg.MsgTexto;
  }

  salvarComentario(){
    let dados = {
      EmpIdf: this.EmpIdf,
      MsgIdf: this.MsgIdf,
      MsgEmail: this.UsuEmail,
      MsgNome: this.MsgNome,
      UsuIdf: this.UsuIdf,
      MsgTexto: this.MsgTexto
    };    
    this.addDadosItem = this.srvMensagem.addDadosItem(dados).subscribe(
      () => {
        this.sendMail(dados.MsgNome, dados.MsgEmail,dados.MsgTexto,dados.MsgTexto,"C");
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Comentário incluído!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.carregaDados();
      }
    );
  }

  confirmComentario(event: Event, msg) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Confirma exclusão deste comentário ?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => {
            this.deleteComentario(msg);
        },
        reject: () => {
          this.carregaDados();
        }
    });
  }

  deleteComentario(msg) {
    let dados = {
      EmpIdf: this.EmpIdf,
      MsgIdf: msg.MsgIdf,
      MsgIdfIt: msg.MsgIdfIt
    };    
    this.delDados = this.srvMensagem.delDado(dados).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: 'Successo', detail: 'Comentário excluído!'});
      },
      err => { 
        let msg = err.error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      () => {
        this.carregaDados();
      }
    );
  }

  sendMail(nome, email, texto, textoHtml, tipo){
    this.mail.subject = tipo == "S" ? "Assunto" : "Comentário";
    this.mail.cc = "";
    if (tipo == "C"){
      this.mail.cc = email;
    }
    this.mail.subject += " enviado por " + nome + " - "+email;
    this.mail.text = (tipo == "S" ? "Novo assunto: " : "Comentário ref. assunto: " + this.MsgSugestao + "\n") + "( " + texto +" )";
    this.mail.html = (tipo == "S" ? "Novo assunto: " : "Comentário ref. assunto: " + this.MsgSugestao + "<br/>") + "( " + textoHtml +" )";
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

  clear() {
    this.messageService.clear();
  }  

  ngOnDestroy(): void {
    if (this.addDados != null){
      this.addDados.unsubscribe();
    }
    if (this.getDados != null){
      this.getDados.unsubscribe();
    }
    if (this.delDados != null){
      this.delDados.unsubscribe();
    }
    if (this.addDadosItem != null){
      this.addDadosItem.unsubscribe();
    }
    if (this.sendMailSub != null){
      this.sendMailSub.unsubscribe();
    }

  }

}
