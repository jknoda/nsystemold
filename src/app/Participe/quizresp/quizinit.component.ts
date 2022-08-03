import { Component, OnInit } from '@angular/core';
import { MessageService} from 'primeng/api';
import { User } from '../../auth/user.model';
import { ServiceConfig } from 'src/app/_config/services.config';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quizinit',
  templateUrl: './quizinit.component.html',
  styleUrls: ['./quizresp.component.css'],
  providers: [MessageService]
})
export class QuizinitComponent implements OnInit {
 
  userForm: FormGroup;

  private EmpIdf: number = ServiceConfig.EMPIDF;

  UsuIdf = 0;
  UsuPerfil = 'U';
  UsuEmail = "";
  
  isAdm = false;
  isLoading = true;

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService) { 
  }

  ngOnInit(): void {
    this.initForm();
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
    this.router.navigate(['../quizlista'], {relativeTo: this.route});
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {   
    this.isLoading = false;
    let UserEmail = '';
    let UserNome = '';
    this.userForm = new FormGroup({
      'email': new FormControl(UserEmail),
      'nome': new FormControl(UserNome, Validators.required),
    });
  }

  cancelar() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}


