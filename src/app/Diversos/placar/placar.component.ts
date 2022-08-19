import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import { DiversosService } from '../diversos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-placar',
  templateUrl: './placar.component.html',
  styleUrls: ['./placar.component.css'],
  providers: [MessageService,ConfirmationService,DiversosService,MessageService]
})
export class PlacarComponent implements OnInit {

  isLoading = false;
  ipponA = 0;
  wazariA = 0;
  shidoA = 0;

  ipponB = 0;
  wazariB = 0;
  shidoB = 0;

  constructor(private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) {}


  ngOnInit(): void {
  }

}
