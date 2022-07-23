import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../../../_config/services.config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {QuizAlterModel} from '../../../model/quizalter.model';

@Injectable()
export class QuizalterService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addDados(body:any): Observable<QuizAlterModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };    
        return this.http.post<QuizAlterModel>(this.url + "/api/quizalter/create", body, httpOptions);
    }

    getDados(body:any): Observable<QuizAlterModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizAlterModel>(this.url + "/api/quizalter/find", body, httpOptions);
    }

    getTodos(body:any): Observable<QuizAlterModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizAlterModel>(this.url + "/api/quizalter/findall", body, httpOptions);
    }

    updateDados(body:any): Observable<QuizAlterModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizAlterModel>(this.url + "/api/quizalter/update", body, httpOptions);
    }

    deleteDados(body:any): Observable<QuizAlterModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<QuizAlterModel>(this.url + "/api/quizalter/delete", body, httpOptions);
    }    
}