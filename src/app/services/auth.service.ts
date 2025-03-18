import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest } from '../user';

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = this.getUser();
    if (user && this.isAuthenticated()) {
      this.currentUserSubject.next(user);
    } else {
      this.clearAuthData();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/user/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.setAuthData(response);
        }
      })
    );
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    localStorage.setItem('loginTimestamp', new Date().toISOString());
    this.currentUserSubject.next(authResponse.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.clearAuthData();
      return false;
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenData.exp * 1000);
      const isTokenValid = new Date() < expirationDate;

      if (!isTokenValid) {
        this.clearAuthData();
        return false;
      }

      return true;
    } catch {
      this.clearAuthData();
      return false;
    }
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('token') : null;
  }

  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr && this.isAuthenticated() ? JSON.parse(userStr) : null;
  }

  getAuthorizationHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
} 