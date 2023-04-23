import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {QuizModel} from '../../model/quiz.model';
import { JudocardModel } from 'src/app/model/judocard.model';

@Injectable()
export class Questao2Service {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    getTodos(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/findallcards", body, httpOptions);
    }

    updateDados(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/update", body, httpOptions);
    }
}