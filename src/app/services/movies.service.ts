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

  // loadUserPlaces() {
  //   return this.fetchPlaces(
  //     'http://localhost:3000/user-places',
  //     'Something went wrong fetching user places'
  //   ).pipe(
  //     tap({
  //       next: (userPlaces) => {
  //         this.userPlaces.set(userPlaces);
  //       },
  //     })
  //   );
  // }

  // addPlaceToUserPlaces(place: Place) {
  //   //the code here is optimistic updating. the same thing can be done with pessimistic updating, which would only update our userPlaces if the request is surely 200. this would be done after the request in a tap. but optimistic updating is faster so our ui is faster
  //   const prevPlaces = this.userPlaces();
  //   if (!prevPlaces.some((value) => value.id === place.id)) {
  //     this.userPlaces.set([...prevPlaces, place]);
  //   }

  //   return this.httpClient
  //     .put('http://localhost:3000/user-places', {
  //       placeId: place.id,
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         this.userPlaces.set(prevPlaces);
  //         this.errorService.showError('Failed to save place');
  //         return throwError(() => new Error('Failed to save place'));
  //       })
  //     );
  // }

  // removeUserPlace(place: Place) {
  //   const prevPlaces = this.userPlaces();
  //   if (prevPlaces.some((value) => value.id === place.id)) {
  //     this.userPlaces.set(prevPlaces.filter((value) => value.id !== place.id));
  //   }

  //   return this.httpClient
  //     .delete('http://localhost:3000/user-places/' + place.id)
  //     .pipe(
  //       catchError((error) => {
  //         this.userPlaces.set(prevPlaces);
  //         this.errorService.showError('Failed to delete place');
  //         return throwError(() => new Error('Failed to delete place'));
  //       })
  //     );
  // }

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
