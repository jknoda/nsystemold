import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceConfig } from '../_config/services.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NewsModel} from '../model/news.model';

@Injectable()
export class NewsService {
    private url: string = ServiceConfig.API_ENDPOINT;
    constructor(private http: HttpClient) { }

    addNewsDados(body:any): Observable<NewsModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<NewsModel>(this.url + "/api/news/create", body, httpOptions);
    }

    getNewsTodos(body:any): Observable<NewsModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<NewsModel>(this.url + "/api/news/findall", body, httpOptions);
    }

    deleteNewsDados(body:any): Observable<NewsModel> {
        let httpOptions = {
            headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        };        
        return this.http.post<NewsModel>(this.url + "/api/news/delete", body, httpOptions);
    }
}