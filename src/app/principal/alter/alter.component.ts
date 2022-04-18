import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-alter',
  templateUrl: './alter.component.html',
  styleUrls: ['./alter.component.css'],
  providers: [ MessageService]
})
export class AlterComponent implements OnInit {

  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const password = form.value.password;
    const passwordRep = form.value.passwordRep;

    let authObs: any; //Observable<AuthResponseData>;

    this.isLoading = true;
    if (password != passwordRep){
      this.messageService.add({severity:'error', summary: 'Erro', detail: "Senha diferente da confirmação!"});
    }
    else {
      authObs = this.authService.redefine(password)
        .then(()=>{
          this.messageService.add({severity:'success', summary: 'Successo', detail: 'Senha alterada com sucesso!'});
        }).catch(errorMessage=>{
          this.messageService.add({severity:'error', summary: 'Erro', detail: errorMessage});
        });        
    }
    
    this.isLoading = false;
    form.reset();
  }

  clear() {
    this.messageService.clear();
  }  


}
