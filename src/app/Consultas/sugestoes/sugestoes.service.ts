import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MensagemModel} from '../../model/mensagem.model';

@Injectable()
export class SugestoesService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<MensagemModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<MensagemModel>(this.url + "/api/mensagem/create", body, httpOptions);
    }

    addDadosItem(body:any): Observable<MensagemModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<MensagemModel>(this.url + "/api/mensagem/createresp", body, httpOptions);
    }

    getTodos(body:any): Observable<MensagemModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<MensagemModel>(this.url + "/api/mensagem/findall", body, httpOptions);
    }

    delDado(body:any): Observable<MensagemModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<MensagemModel>(this.url + "/api/mensagem/delete", body, httpOptions);
    }
}