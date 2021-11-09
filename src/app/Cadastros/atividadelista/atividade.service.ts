import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AtividadeModel} from '../../model/atividade.model';

@Injectable()
export class AtividadeService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addAtvDados(body:any): Observable<AtividadeModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AtividadeModel>(this.url + "/api/atividade/create", body, httpOptions);
    }

    getAtvDados(body:any): Observable<AtividadeModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AtividadeModel>(this.url + "/api/atividade/find", body, httpOptions);
    }

    getAtvTodos(body:any): Observable<AtividadeModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AtividadeModel>(this.url + "/api/atividade/findall", body, httpOptions);
    }

    updateAtvDados(body:any): Observable<AtividadeModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AtividadeModel>(this.url + "/api/atividade/update", body, httpOptions);
    }

    deleteAtvDados(body:any): Observable<AtividadeModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AtividadeModel>(this.url + "/api/atividade/delete", body, httpOptions);
    }
}