import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {QuizModel} from '../../model/quiz.model';

@Injectable()
export class QuestaoService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<QuizModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };    
        return this.http.post<QuizModel>(this.url + "/api/quiz/create", body, httpOptions);
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

    deleteDados(body:any): Observable<QuizModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizModel>(this.url + "/api/quiz/delete", body, httpOptions);
    }    
}