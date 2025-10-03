import { inject, Injectable, signal } from '@angular/core';

import { Movie } from '../movies/movie.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);

  // loadedUserPlaces = this.userPlaces.asReadonly();

  loadCategoricalMovies(category: string, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movies/${category}?page=${page}`,
      'Something went wrong fetching popular movies'
    );
  }

  searchMovies(query: string, page: number = 1) {
    return this.fetchMovies(
      `${environment.apiUrl}/movies/search?query=${query}&page=${page}`,
      'Something went wrong fetching search result'
    );
  }

  private fetchMovies(url: string, errorMessage: string) {
    return this.httpClient
      .get<{
        page: number;
        results: Movie[];
        total_pages: number;
        total_results: number;
      }>(url) //we can add a pipe at this step
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
