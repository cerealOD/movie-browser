import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { MoviesService } from './movies.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private moviesService = inject(MoviesService);

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

          this.moviesService.loadUserFavorites().subscribe();
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
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      // JWT exp is in s so get current time in s
      const currentTime = Date.now() / 1000;
      return decoded.exp && decoded.exp > currentTime;
    } catch (e) {
      // invalid token
      return false;
    }
  }
}
