import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private API_URL = (window as any).__env?.apiUrl || 'http://localhost:5000';

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  user = signal<{ username: string } | null>(null);

  constructor() {
    // repopulate user on startup
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

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
          this.user.set(res.user);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.loggedIn.next(true);
        })
      );
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // very basic check without checking if the token expired
  }
}
