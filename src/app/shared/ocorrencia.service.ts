import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OcorrenciaModel } from '../model/ocorrencia.model';
import { OcotipoModel } from '../model/ocotipo.model';

@Injectable()
export class OcorrenciaService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    create(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/create", body, httpOptions);
    }

    findall(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/findall", body, httpOptions);
    }

    findaluall(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/findaluall", body, httpOptions);
    }

    findalutre(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/findalutre", body, httpOptions);
    }


    find(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/find", body, httpOptions);
    }

    delete(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/delete", body, httpOptions);
    }

    update(body:any): Observable<OcorrenciaModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcorrenciaModel>(this.url + "/api/ocorrencia/update", body, httpOptions);
    }

    findalltipo(body:any): Observable<OcotipoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<OcotipoModel>(this.url + "/api/ocotipo/findall", body, httpOptions);
    }
}