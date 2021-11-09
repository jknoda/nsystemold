import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TreinoatvModel} from '../../model/treinoatv.model';

@Injectable()
export class TreinoatvService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addTreAtvDados(body:any): Observable<TreinoatvModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoatvModel>(this.url + "/api/treinoatv/create", body, httpOptions);
    }

    getTreAtvDados(body:any): Observable<TreinoatvModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoatvModel>(this.url + "/api/treinoatv/find", body, httpOptions);
    }

    getTreAtvTodos(body:any): Observable<TreinoatvModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoatvModel>(this.url + "/api/treinoatv/findall", body, httpOptions);
    }

    getTreAtvTodosOrdem(body:any): Observable<TreinoatvModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoatvModel>(this.url + "/api/treinoatv/findallordem", body, httpOptions);
    }

    updateTreAtvDados(body:any): Observable<TreinoatvModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoatvModel>(this.url + "/api/treinoatv/update", body, httpOptions);
    }

    deleteTreAtvDados(body:any): Observable<TreinoatvModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoatvModel>(this.url + "/api/treinoatv/delete", body, httpOptions);
    }
}