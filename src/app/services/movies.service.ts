import { inject, Injectable, signal } from '@angular/core';

import { IndexMovie } from '../models/indexMovie.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap, throwError } from 'rxjs';
import { Movie } from '../models/movie.model';
import { Cast } from '../models/cast.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private httpClient = inject(HttpClient);
  private userFavorites = signal<IndexMovie[]>([]);
  loadedUserFavorites = this.userFavorites.asReadonly();

  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // or from auth service
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  loadUserFavorites() {
    return this.httpClient
      .get<IndexMovie[]>(
        `${environment.apiUrl}/favorites`,
        this.getAuthHeaders()
      )
      .pipe(
        tap((favorites) => this.userFavorites.set(favorites)),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  isFavorite(movieId: number): boolean {
    return this.userFavorites().some((fav) => fav.id === movieId);
  }

  addMovieToUserFavorites(movie: IndexMovie) {
    const prevFavs = this.userFavorites();
    if (prevFavs.some((m) => m.id === movie.id)) {
      return throwError(() => new Error('Already in favorites'));
    }

    return this.httpClient
      .post(`${environment.apiUrl}/favorites`, movie, this.getAuthHeaders())
      .pipe(
        tap(() => this.userFavorites.set([...prevFavs, movie])),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  removeMovieFromUserFavorites(movieId: number) {
    return this.httpClient
      .delete(
        `${environment.apiUrl}/favorites/${movieId}`,
        this.getAuthHeaders()
      )
      .pipe(
        tap(() => {
          const updated = this.userFavorites().filter((m) => m.id !== movieId);
          this.userFavorites.set(updated);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  loadCategoricalMovies(category: string, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movies/${category}?page=${page}`
    );
  }

  loadSimilarMovies(movieId: number, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movie/${movieId}/similar?page=${page}`
    );
  }

  searchMovies(query: string, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movies/search?query=${query}&page=${page}`
    );
  }

  fetchCast(movieId: number) {
    return this.httpClient
      .get<{
        id: string;
        cast: Cast[];
      }>(`${environment.apiUrl}/movie/${movieId}/credits`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  fetchMovie(movieId: number) {
    return this.httpClient
      .get<Movie>(`${environment.apiUrl}/movie/${movieId}`)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  private fetchMovies(url: string) {
    return this.httpClient
      .get<{
        page: number;
        results: IndexMovie[];
        total_pages: number;
        total_results: number;
      }>(url)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
