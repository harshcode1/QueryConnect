// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private apiUrl = 'http://localhost:8081/api/auth/login'; // Your backend API URL

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<boolean> {
    const loginData = { email, password };

    // Perform an HTTP POST request to the login API
    return this.http.post<any>(this.apiUrl, loginData).pipe(
      tap(response => {
        // If login is successful, store the token and user information
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_email', email);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(() => {
        // Handle error, login failed
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }

  logout(): void {
    // Remove token and user information from local storage on logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    this.isAuthenticatedSubject.next(false);
    // Optionally, navigate to the login page after logout
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // Get the stored token from local storage
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): any {
    // Get the stored user email from local storage
    const email = localStorage.getItem('user_email');
    return email ? { email } : null;
  }

  private hasToken(): boolean {
    // Check if there is a valid token in local storage
    return !!localStorage.getItem('auth_token');
  }
}
