import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {TreinoModel} from '../../model/treino.model';

@Injectable()
export class TreinoviacalenService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    getTreinos(body:any): Observable<TreinoModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TreinoModel>(this.url + "/api/participe/findmonthyear", body, httpOptions);
    }
}