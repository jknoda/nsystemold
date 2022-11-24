import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService} from 'primeng/api';
import { User } from '../../auth/user.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from '../../shared/configuracao.service';

@Component({
  selector: 'app-sugestoesinit',
  templateUrl: './sugestoesinit.component.html',
  styleUrls: ['./sugestoes.component.css'],
  providers: [MessageService]
})
export class SugestoesinitComponent implements OnInit, OnDestroy {
 
  userForm: FormGroup;

  private EmpIdf: number = ServiceConfig.EMPIDF;

  UsuIdf = 0;
  UsuPerfil = 'U';
  UsuEmail = "";
  
  isAdm = false;
  isLoading = true;

  getConfigSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private configSrv: ConfiguracaoService) { 
  }

  ngOnInit(): void {
    this.initForm();
    this.setEmail(this.EmpIdf);
  }

  onSubmit() {
    let dados = {
      EmpIdf: this.EmpIdf,
      UsuEmail: this.userForm.value['email'],
      UsuNome:  this.userForm.value['nome']
    };    
    let user = new User('','','',new Date(), 0, 0, '', '');
    user.email = dados.UsuEmail;
    user.nome = dados.UsuNome;
    localStorage.setItem('userData', JSON.stringify(user));
    this.router.navigate(['../sugestoes'], {relativeTo: this.route});
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {   
    this.isLoading = false;
    let UserEmail = '';
    let UserNome = '';
    this.userForm = new FormGroup({
      'email': new FormControl(UserEmail, [Validators.required, Validators.email]),
      'nome': new FormControl(UserNome, Validators.required),
    });
  }

  cancelar() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private setEmail(EmpIdf){
    let dados = {
      EmpIdf,
      CfgIdfArray: [10,11,12,13,14]

    }
    this.getConfigSubscription = this.configSrv.findArray(dados).subscribe(
      data => {
        let emailConfig = {
          /*
          "service": data[0].CfgVlrStr,
          "user": data[1].CfgVlrStr,
          "pass": data[2].CfgVlrStr,
          "from": data[3].CfgVlrStr,
          "to": data[4].CfgVlrStr,
          */
          "subject": "",
          "text": "",
          "html": ""
        };
        localStorage.setItem('emailConfig', JSON.stringify(emailConfig));
    });
  }

  ngOnDestroy(): void {
    if (this.getConfigSubscription != null){
      this.getConfigSubscription.unsubscribe();
    }
  }
}


