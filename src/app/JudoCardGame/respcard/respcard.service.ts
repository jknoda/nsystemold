import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JudocardrespModel} from '../../model/judocardresp.model';

@Injectable()
export class RespcardService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<JudocardrespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };    
        console.log(body);
        return this.http.post<JudocardrespModel>(this.url + "/api/judocardresp/create", body, httpOptions);
    }

    getDados(body:any): Observable<JudocardrespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardrespModel>(this.url + "/api/judocardresp/find", body, httpOptions);
    }

    getTodos(body:any): Observable<JudocardrespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardrespModel>(this.url + "/api/judocardresp/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<JudocardrespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardrespModel>(this.url + "/api/judocardresp/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<JudocardrespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardrespModel>(this.url + "/api/judocardresp/delete", body, httpOptions);
    }    
}