import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JudocardModel} from '../model/judocard.model';

@Injectable()
export class JudocardService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };    
        return this.http.post<JudocardModel>(this.url + "/api/judocard/create", body, httpOptions);
    }

    getDados(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/find", body, httpOptions);
    }

    getTodos(): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/findall", null, httpOptions);
    }

    updateDados(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/delete", body, httpOptions);
    }    
}