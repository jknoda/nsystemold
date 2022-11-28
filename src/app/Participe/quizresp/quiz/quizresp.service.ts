import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {QuizModel} from '../../../model/quiz.model';
import {QuizAlterModel} from '../../../model/quizalter.model';
import {QuizRespModel} from '../../../model/quizresp.model';

@Injectable()
export class QuizrespService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<QuizRespModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizRespModel>(this.url + "/api/quizresp/create", body, httpOptions);
    }

    getDados(body:any): Observable<QuizModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizModel>(this.url + "/api/quiz/find", body, httpOptions);
    }

    getTodos(body:any): Observable<QuizModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizModel>(this.url + "/api/quiz/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<QuizModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizModel>(this.url + "/api/quiz/update", body, httpOptions);
    }

    delDado(body:any): Observable<QuizModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizModel>(this.url + "/api/quiz/delete", body, httpOptions);
    }

    getAlternativas(body:any): Observable<QuizAlterModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizAlterModel>(this.url + "/api/quizalter/findall", body, httpOptions);
    }

    getJaRespondeu(body:any): Observable<boolean> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<boolean>(this.url + "/api/quizresp/has", body, httpOptions);
    }
}