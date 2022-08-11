import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AluJudoModel} from '../../../model/alujudo.model';
import {FaixasModel} from '../../../model/faixas.model';

@Injectable()
export class JudoService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<AluJudoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluJudoModel>(this.url + "/api/alujudo/create", body, httpOptions);
    }

    getDados(body:any): Observable<AluJudoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluJudoModel>(this.url + "/api/alujudo/find", body, httpOptions);
    }

    getTodos(body:any): Observable<AluJudoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluJudoModel>(this.url + "/api/alujudo/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<AluJudoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluJudoModel>(this.url + "/api/alujudo/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<AluJudoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluJudoModel>(this.url + "/api/alujudo/delete", body, httpOptions);
    }

    getFaixas(body:any): Observable<AluJudoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluJudoModel>(this.url + "/api/faixas/findall", body, httpOptions);
    }

}