import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AnamneseModel} from '../../../model/anamnese.model';

@Injectable()
export class AnamneseService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addAnaDados(body:any): Observable<AnamneseModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AnamneseModel>(this.url + "/api/anamnese/create", body, httpOptions);
    }

    getAnaDados(body:any): Observable<AnamneseModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AnamneseModel>(this.url + "/api/anamnese/find", body, httpOptions);
    }

    lastAnaDados(body:any): Observable<AnamneseModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AnamneseModel>(this.url + "/api/anamnese/findlast", body, httpOptions);
    }

    getAnaTodos(body:any): Observable<AnamneseModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AnamneseModel>(this.url + "/api/anamnese/findall", body, httpOptions);
    }

    updateAnaDados(body:any): Observable<AnamneseModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AnamneseModel>(this.url + "/api/anamnese/update", body, httpOptions);
    }

    deleteAnaDados(body:any): Observable<AnamneseModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<AnamneseModel>(this.url + "/api/anamnese/delete", body, httpOptions);
    }

}