import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TreinoModel} from '../../model/treino.model';

@Injectable()
export class TreinoService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addTreDados(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/treino/create", body, httpOptions);
    }

    getTreDados(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/treino/find", body, httpOptions);
    }

    getTreTodos(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/treino/findall", body, httpOptions);
    }

    getTreTodosData(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/treino/findalldate", body, httpOptions);
    }

    updateTreDados(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/treino/update", body, httpOptions);
    }

    deleteTreDados(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/treino/deletetreino", body, httpOptions);
    }
}