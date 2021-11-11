import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TreinoaluModel} from '../../model/treinoalu.model';

@Injectable()
export class TreinoalunoService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addTreAluDados(body:any): Observable<TreinoaluModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoaluModel>(this.url + "/api/treinoalu/create", body, httpOptions);
    }

    getTreAluDados(body:any): Observable<TreinoaluModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoaluModel>(this.url + "/api/treinoalu/find", body, httpOptions);
    }

    getTreAluTodos(body:any): Observable<TreinoaluModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoaluModel>(this.url + "/api/treinoalu/findall", body, httpOptions);
    }

    updateTreAluDados(body:any): Observable<TreinoaluModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoaluModel>(this.url + "/api/treinoalu/update", body, httpOptions);
    }

    deleteTreAluDados(body:any): Observable<TreinoaluModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoaluModel>(this.url + "/api/treinoalu/delete", body, httpOptions);
    }
}