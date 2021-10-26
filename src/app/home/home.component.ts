import { Component, OnInit } from '@angular/core';
import { ServiceConfig } from '../_config/services.config';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  display:boolean = false;

    constructor() { }

  ngOnInit(): void {
  }

}
