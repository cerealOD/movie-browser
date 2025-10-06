import { inject, Injectable, signal } from '@angular/core';

import { IndexMovie } from '../models/indexMovie.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';
import { Movie } from '../models/movie.model';
import { Cast } from '../models/cast.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private errorService = inject(ErrorService);
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

  loadMovie(movieId: number) {
    return this.fetchMovie(
      `${environment.apiUrl}/movie/${movieId}`,
      'Something went wrong fetching the requested movie'
    );
  }

  loadUserFavorites() {
    return this.httpClient
      .get<IndexMovie[]>(
        `${environment.apiUrl}/favorites`,
        this.getAuthHeaders()
      )
      .pipe(
        tap((favorites) => this.userFavorites.set(favorites)),
        catchError((err) => {
          console.error('Failed to load favorites:', err);
          return throwError(() => new Error('Failed to load favorites'));
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
        catchError((err) => {
          console.error('Failed to add favorite:', err);
          return throwError(() => new Error('Failed to add favorite'));
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
        catchError((err) => {
          console.error('Failed to remove favorite:', err);
          return throwError(() => new Error('Failed to remove favorite'));
        })
      );
  }

  loadCategoricalMovies(category: string, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movies/${category}?page=${page}`,
      'Something went wrong fetching popular movies'
    );
  }

  loadSimilarMovies(movieId: number, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movie/${movieId}/similar?page=${page}`,
      'Something went wrong fetching similar movies'
    );
  }

  loadCast(movieId: number) {
    return this.fetchCast(
      `${environment.apiUrl}/movie/${movieId}/credits`,
      'Something went wrong fetching cast'
    );
  }

  searchMovies(query: string, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movies/search?query=${query}&page=${page}`,
      'Something went wrong fetching search result'
    );
  }

  private fetchMovie(url: string, errorMessage: string) {
    return this.httpClient.get<Movie>(url).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private fetchMovies(url: string, errorMessage: string) {
    return this.httpClient
      .get<{
        page: number;
        results: IndexMovie[];
        total_pages: number;
        total_results: number;
      }>(url)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  private fetchCast(url: string, errorMessage: string) {
    return this.httpClient
      .get<{
        id: string;
        cast: Cast[];
      }>(url)
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
