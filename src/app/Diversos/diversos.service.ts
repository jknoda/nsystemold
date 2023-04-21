import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {QuizEstatRespModel} from '../model/quizestatresp.model';

@Injectable()
export class DiversosService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    getDadosQuizRespList(body:any): Observable<QuizEstatRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizEstatRespModel>(this.url + "/api/quiz2resp/findresp", body, httpOptions);
    }

}