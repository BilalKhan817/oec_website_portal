// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  last_login?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}

const TOKEN_KEY = 'oec_portal_token';
const USER_KEY = 'oec_portal_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://oec.gov.pk/api';
  // private baseUrl = 'http://localhost:3000/api';
  

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch (e) {
      return null;
    }
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            localStorage.setItem(TOKEN_KEY, response.data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
            this.currentUserSubject.next(response.data.user);
            return response.data.user;
          }
          throw new Error(response.message || 'Login failed');
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.post<{ success: boolean; message?: string }>(
      `${this.baseUrl}/auth/change-password`,
      { currentPassword, newPassword }
    ).pipe(
      map(response => {
        if (response.success) {
          return true;
        }
        throw new Error(response.message || 'Failed to change password');
      })
    );
  }
}
