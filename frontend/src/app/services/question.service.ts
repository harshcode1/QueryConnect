import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8081/api';
  private questionsUrl = `${this.apiUrl}/questions`;
  private statsUrl = `${this.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getMyQuestions(): Observable<any[]> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.questionsUrl}/my`, { headers });
  }

  getQuestionById(id: string): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.questionsUrl}/${id}`, { headers });
  }
  
  getAllQuestions(): Observable<any[]> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.questionsUrl, { headers });
  }
  
  searchQuestions(params: {
    title?: string,
    productCode?: string,
    email?: string,
    label?: string,
    dateFrom?: string,
    dateTo?: string
  }): Observable<any[]> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Build query parameters
    let httpParams = new HttpParams();
    
    if (params.title) httpParams = httpParams.set('title', params.title);
    if (params.productCode) httpParams = httpParams.set('productCode', params.productCode);
    if (params.email) httpParams = httpParams.set('email', params.email);
    if (params.label) httpParams = httpParams.set('label', params.label);
    if (params.dateFrom) httpParams = httpParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) httpParams = httpParams.set('dateTo', params.dateTo);
    
    return this.http.get<any[]>(`${this.questionsUrl}/search`, { 
      headers,
      params: httpParams
    });
  }
  
  getCommunityStats(): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.statsUrl, { headers });
  }


  closeQuestion(questionId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${questionId}/close`, {});
  }
}