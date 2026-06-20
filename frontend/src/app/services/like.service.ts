import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://localhost:8081/api/likes';

  constructor(private http: HttpClient) {}

  /**
   * Toggle like status for a comment
   * @param commentId ID of the comment
   * @returns Observable with like status and count
   */
  toggleLike(commentId: number): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/toggle/${commentId}`, {}, { headers });
  }

  /**
   * Get like count for a comment
   * @param commentId ID of the comment
   * @returns Observable with like count
   */
  getLikeCount(commentId: number): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/count/${commentId}`, { headers });
  }

  /**
   * Check if current user has liked a specific comment
   * @param commentId ID of the comment
   * @returns Observable with liked status
   */
  hasUserLikedComment(commentId: number): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/status/${commentId}`, { headers });
  }

  /**
   * Get like counts for multiple comments
   * @param commentIds List of comment IDs
   * @returns Map of comment ID to like count
   */
  getLikeCounts(commentIds: number[]): Observable<any> {
    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/counts`, commentIds, { headers });
  }
}