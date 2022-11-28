import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {QuizModel} from '../../../model/quiz.model';
import {QuizAlterModel} from '../../../model/quizalter.model';
import {Quiz2RespModel} from '../../../model/quiz2resp.model';
import {JudocardModel} from '../../../model/judocard.model';
import {JudocardrespModel} from '../../../model/judocardresp.model';
import {TabImagensModel} from '../../../model/tabimagens.model';

@Injectable()
export class Quiz2respService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<Quiz2RespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<Quiz2RespModel>(this.url + "/api/quiz2resp/create", body, httpOptions);
    }

    getDados(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/find", body, httpOptions);
    }

    getTodos(body:any): Observable<JudocardModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardModel>(this.url + "/api/judocard/findall", body, httpOptions);
    }

    getImagem(body:any): Observable<TabImagensModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<TabImagensModel>(this.url + "/api/tabimagens/findnome", body, httpOptions);
    }

    getAlternativas(body:any): Observable<JudocardrespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<JudocardrespModel>(this.url + "/api/judocardresp/findall", body, httpOptions);
    }

    getJaRespondeu(body:any): Observable<boolean> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<boolean>(this.url + "/api/quiz2resp/has", body, httpOptions);
    }
}