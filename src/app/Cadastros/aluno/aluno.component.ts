import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { AlunoService } from './aluno.service';
import { AlunoModel } from 'src/app/model/aluno.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThisReceiver } from '@angular/compiler';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from '../usuario/usuario.service';
import { elementMatches } from '@fullcalendar/core';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css'],
  providers: [ConfirmationService,AlunoService,MessageService,UsuarioService]
})
export class AlunoComponent implements OnInit, OnDestroy {
  private EmpIdf: number = ServiceConfig.EMPIDF;
  private AluIdf: number = 0;
  UsuIdf = JSON.parse(localStorage.getItem('userData')).usuidf;
  isTecnico = false;

  dadosForm: FormGroup;

  addDadosAluno: Subscription;
  updateDadosAluno: Subscription;
  deleteDadosAluno: Subscription;
  lerDadosAluno: Subscription;
  lerDadosUsuario: Subscription;

  isLoading = true;
  editMode = false;

  estados: DD[];

  usuarios: DD[];
  
  isUpdate = true;
  isOk = false;

  uploadedFile : any;
  uploadedName: any;
  fotoAluno: SafeResourceUrl;

  constructor(private router: Router, private route: ActivatedRoute, 
    private srvAluno: AlunoService, 
    private srvUsuario: UsuarioService, 
    private messageService: MessageService,
    private sanitizer:DomSanitizer) {

    this.estados = [
      {name: 'Acre', code: 'AC'},
      {name: 'Alagoas', code: 'AL'},
      {name: 'Amapá', code: 'AP'},
      {name: 'Amazonas', code: 'AM'},
      {name: 'Bahia', code: 'BA'},
      {name: 'Ceará', code: 'CE'},
      {name: 'Distrito Federal', code: 'DF'},
      {name: 'Espirito Santo', code: 'ES'},
      {name: 'Goiás', code: 'GO'},
      {name: 'Maranhão', code: 'MA'},
      {name: 'Mato Grosso do Sul', code: 'MS'},
      {name: 'Mato Grosso', code: 'MT'},
      {name: 'Minas Gerais', code: 'MG'},
      {name: 'Paraná', code: 'PR'},
      {name: 'Paraíba', code: 'PB'},
      {name: 'Pará', code: 'PA'},
      {name: 'Pernambuco', code: 'PE'},
      {name: 'Piauí', code: 'PI'},
      {name: 'Rio Grande do Norte', code: 'RN'},
      {name: 'Rio Grande do Sul', code: 'RS'},
      {name: 'Rio de Janeiro', code: 'RJ'},
      {name: 'Rondonia', code: 'RO'},
      {name: 'Roraima', code: 'RR'},
      {name: 'Santa Catarina', code: 'SC'},
      {name: 'Sergipe', code: 'SE'},
      {name: 'São Paulo', code: 'SP'},
      {name: 'Tocantins', code: 'TO'}
    ];    
   }
  ngOnDestroy(): void {
    if (this.lerDadosAluno != null){
      this.lerDadosAluno.unsubscribe();
    }
    if (this.addDadosAluno != null){
      this.addDadosAluno.unsubscribe();
    }
    if (this.updateDadosAluno != null){
      this.updateDadosAluno.unsubscribe();
    }
    if (this.lerDadosUsuario != null){
      this.lerDadosUsuario.unsubscribe();
    }
  }

  ngOnInit() {
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    this.isTecnico = (perfil == 'A' || perfil == 'T');
    this.route.queryParams
      .subscribe(params => {
        this.EmpIdf = params.EmpIdf;
        this.AluIdf = params.AluIdf;
        if (params.Modo == "EDIT")
        {
          this.editMode = true;
          this.getAluno();
        } else {
          if (this.isTecnico)
          {
            this.getUsuario();
          }
          this.editMode = false;
          let Aluno: AlunoModel;
          this.initForm(Aluno);
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
    //console.log(arquivo);
    this.uploadedName = nome;
    this.messageService.add({severity:'success', summary: 'Successo', detail: 'Foto incluido!'});
  }
  
  private getUsuario() {
    let dados = {
      EmpIdf: this.EmpIdf
    };
    this.usuarios = [];
    this.lerDadosUsuario = this.srvUsuario.getTodos(dados).subscribe(
      (dadosRet:any) => {        
        dadosRet.forEach(element => {
            this.usuarios.push({
              name:  element.UsuIdf.toString() + "-" + element.UsuNome + " - " + element.UsuEmail,
              code: element.UsuIdf.toString()
            });
        });
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        return;
      });
  }

  private getAluno() {
    let Aluno: AlunoModel;
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf
    };
    this.lerDadosAluno = this.srvAluno.getAluDados(dados).subscribe(
      (dados) => {
        Aluno = JSON.parse(JSON.stringify(dados));
        Aluno.AluDataNasc = new Date(Aluno.AluDataNasc);
        this.UsuIdf = Aluno.UsuIdf;
      },
      err => { 
        let msg = err.message; //error.errors.toString();
        this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
      },
      ()=>{
        this.isLoading = false;
        this.initForm(Aluno);
      });
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      AluIdf: this.AluIdf,
      UsuIdf: JSON.parse(localStorage.getItem('userData')).usuidf,
      AluNome: this.dadosForm.value['nome'],
      AluCPF:  this.dadosForm.value['cpf'],
      AluDataNasc: this.dadosForm.value['nascimento'],
      AluNomeResp: this.dadosForm.value['resp'],
      AluFoneResp: this.dadosForm.value['foneresp'],
      AluFone: this.dadosForm.value['fone'],
      AluLogradouro: this.dadosForm.value['logradouro'],
      AluLogNum: this.dadosForm.value['lognum'],
      AluBairro: this.dadosForm.value['bairro'],
      AluCidade: this.dadosForm.value['cidade'],
      AluUF: this.dadosForm.value['uf'],
      AluEmail: this.dadosForm.value['email'],
      AluPeso: this.dadosForm.value['peso'],
      AluAltura: this.dadosForm.value['altura'],
      AluFoto: this.uploadedFile
    };    
    if (dados.AluCPF != null)
    {
      dados.AluCPF = dados.AluCPF.replace(/[^\d]+/g,'');
    }
    //console.log('edit',this.editMode);
    if (this.editMode)
    {
      let dadosUpdate = {
        ...dados
      }
      dadosUpdate.UsuIdf = this.UsuIdf;
      this.updateDadosAluno = this.srvAluno.updateAluDados(dadosUpdate).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno atualizado!'});
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
        ...dados,
        AluStatus: 'A'
      }
      this.addDadosAluno = this.srvAluno.addAluDados(dadosAdd).subscribe(
        (ret:any) => {
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Aluno incluido!'});
          dados.AluIdf = ret;
        },
        err => { 
          console.log('err',err);
          let msg = err.error.errors.toString();
          if (!msg)
          {
            msg = err.error.msg;
          }
          this.messageService.add({severity:'error', summary: 'Erro', detail: msg});
        },
        () => {
          this.router.navigate(['anamnese'], { queryParams: { EmpIdf: dados.EmpIdf, AluIdf: dados.AluIdf, AluNome: dados.AluNome } });
          //this.retorno();
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
      this.router.navigate(['../alunolista'], {relativeTo: this.route});
    },
    tempo);
  }

  private initForm(dados:AlunoModel) {   
    this.isLoading = false;
    let AluNome = null;
    let AluCPF = null;
    let AluDataNasc = null;
    let AluNomeResp = null;
    let AluFoneResp = null;
    let AluFone = null;
    let AluLogradouro = null;
    let AluLogNum = null;
    let AluBairro = null;
    let AluCidade = null;
    let AluUF = "SP";
    let AluEmail = null;
    let AluPeso = null;
    let AluAltura = null;
    let UsuIdf = this.UsuIdf;
    //let objectURL = null;
   
    if (dados != null)
    {
      AluNome = dados.AluNome;
      AluCPF = dados.AluCPF;
      AluNome = dados.AluNome;
      AluCPF = dados.AluCPF;		
      AluDataNasc = dados.AluDataNasc;
      AluNomeResp = dados.AluNomeResp;
      AluFoneResp = dados.AluFoneResp;
      AluFone = dados.AluFone;
      AluLogradouro = dados.AluLogradouro;
      AluLogNum = dados.AluLogNum;
      AluBairro = dados.AluBairro;
      AluCidade = dados.AluCidade;
      AluUF = dados.AluUF;
      AluEmail = dados.AluEmail;
      AluPeso = dados.AluPeso;
      AluAltura = dados.AluAltura;
      UsuIdf = dados.UsuIdf;

      if (dados.AluFoto){
        let imagem = this.bin2String(dados.AluFoto["data"]);
        this.fotoAluno = this.sanitizer.bypassSecurityTrustUrl(imagem);
      }

    }
    let perfil = JSON.parse(localStorage.getItem('userData')).perfil;
    let isTecnico = (perfil == 'A' || perfil == 'T');
    this.isOk = UsuIdf == this.UsuIdf || isTecnico;
    if (!this.isOk){
      this.router.navigate(['/denied']);
    }

    this.dadosForm = new FormGroup({
      'usuidf': new FormControl(UsuIdf, Validators.required),
      'nome': new FormControl(AluNome, Validators.required),
      'cpf': new FormControl(AluCPF),
      'nascimento': new FormControl(AluDataNasc),
      'resp': new FormControl(AluNomeResp),
      'foneresp': new FormControl(AluFoneResp),
      'fone': new FormControl(AluFone),
      'logradouro': new FormControl(AluLogradouro),
      'lognum': new FormControl(AluLogNum),
      'bairro': new FormControl(AluBairro),
      'cidade': new FormControl(AluCidade),
      'uf': new FormControl(AluUF),
      'email': new FormControl(AluEmail, Validators.email),
      'peso': new FormControl(AluPeso, Validators.max(300)),
      'altura': new FormControl(AluAltura, Validators.max(2.9))
    });
  }

  bin2String(array) {
    var retorno = '';
    //var j = 0;
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
