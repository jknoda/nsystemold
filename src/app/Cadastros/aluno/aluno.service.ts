import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AlunoModel} from '../../model/aluno.model';

@Injectable()
export class AlunoService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<AlunoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AlunoModel>(this.url + "/api/aluno/create", body, httpOptions);
    }

    getDados(body:any): Observable<AlunoModel[]> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AlunoModel[]>(this.url + "/api/aluno/find", body, httpOptions);
    }

    getTodos(body:any): Observable<AlunoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AlunoModel>(this.url + "/api/aluno/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<AlunoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AlunoModel>(this.url + "/api/aluno/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<AlunoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AlunoModel>(this.url + "/api/aluno/delete", body, httpOptions);
    }

}