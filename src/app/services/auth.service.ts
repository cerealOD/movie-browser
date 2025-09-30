import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private API_URL = (window as any).__env?.apiUrl || 'http://localhost:5000';

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, {
      username,
      password,
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string; user: { username: string } }>(
        `${this.API_URL}/auth/login`,
        {
          username,
          password,
        }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('auth_user', JSON.stringify(res.user));
          this.loggedIn.next(true);
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token; // very basic check without checking if the token expired
  }
}
