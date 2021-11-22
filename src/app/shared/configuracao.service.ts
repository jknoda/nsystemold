import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfiguracaoModel } from '../model/configuracao.model';

@Injectable()
export class ConfiguracaoService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    findArray(body:any): Observable<ConfiguracaoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<ConfiguracaoModel>(this.url + "/api/configuracao/findarray", body, httpOptions);
    }

    find(body:any): Observable<ConfiguracaoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<ConfiguracaoModel>(this.url + "/api/configuracao/find", body, httpOptions);
    }

}