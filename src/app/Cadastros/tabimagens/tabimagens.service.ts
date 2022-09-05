import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TabImagensModel} from '../../model/tabimagens.model';

@Injectable()
export class TabimagensService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };    
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/create", body, httpOptions);
    }

    getDados(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/findnormal", body, httpOptions);
    }

    getDadosNome(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/findnome", body, httpOptions);
    }

    getTodos(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/delete", body, httpOptions);
    }    
}