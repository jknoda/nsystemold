import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { DiversosService } from '../diversos.service';
import { Router } from '@angular/router';
import { CdTimerComponent } from 'angular-cd-timer';

@Component({
  selector: 'app-placar',
  templateUrl: './placar.component.html',
  styleUrls: ['./placar.component.css'],
  providers: [MessageService,ConfirmationService,DiversosService,MessageService]
})
export class PlacarComponent implements OnInit {
  @ViewChild("jikan") jikan : CdTimerComponent;
  @ViewChild("osaekomi") osaekomi : CdTimerComponent;

  isLoading = false;
  ipponA = 0;
  wazariA = 0;
  shidoA = 0;

  ipponB = 0;
  wazariB = 0;
  shidoB = 0;

  started = false;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  
  ngOnInit(): void {    
  }

  hajime(){
    if (this.started){
      this.jikan.resume();
    }
    else{
      this.jikan.start();
    }
    this.started = true;
  }
  matte(){
    this.jikan.stop();
    this.osaekomi.stop();
  }
  osae(){
    this.osaekomi.start();
  }
  toketa(){
    this.osaekomi.stop();
  }
  zerar(){
    this.jikan.reset();
    this.osaekomi.reset();
  }
}
