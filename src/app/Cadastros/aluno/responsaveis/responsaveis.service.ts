import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AluRespModel} from '../../../model/aluresp.model';

@Injectable()
export class AluRespService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<AluRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluRespModel>(this.url + "/api/aluresp/create", body, httpOptions);
    }

    getDados(body:any): Observable<AluRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluRespModel>(this.url + "/api/aluresp/find", body, httpOptions);
    }

    getTodos(body:any): Observable<AluRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluRespModel>(this.url + "/api/aluresp/findall", body, httpOptions);
    }

    getTodosUsu(body:any): Observable<AluRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluRespModel>(this.url + "/api/aluresp/findallusu", body, httpOptions);
    }

    updateDados(body:any): Observable<AluRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluRespModel>(this.url + "/api/aluresp/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<AluRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AluRespModel>(this.url + "/api/aluresp/delete", body, httpOptions);
    }

}