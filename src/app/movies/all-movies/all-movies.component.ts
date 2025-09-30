import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Movie } from '../movie.model';
import { MoviesComponent } from '../movies.component';
import { MoviesContainerComponent } from '../movies-container/movies-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { MoviesService } from '../movies.service';
@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [MoviesComponent, MoviesContainerComponent],
  templateUrl: './all-movies.component.html',
  styleUrl: './all-movies.component.css',
})
export class AllMoviesComponent implements OnInit {
  movies = signal<Movie[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    //the backend provides an observable to which we need to sub
    const subscription = this.moviesService.loadPopularMovies().subscribe({
      next: (movies) => {
        console.log(movies);
        this.movies.set(movies);
      },
      error: (error: Error) => {
        // to get the original error message
        this.error.set(error.message);
        // this.error.set('Something went wrong fetching data');
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  //send some data to the backend
  onSelectMovie(selectedMovie: Movie) {
    // const subscription = this.placesService
    //   .addPlaceToUserPlaces(selectedPlace)
    //   .subscribe({
    //     next: (resData) => console.log(resData),
    //     error: (err) => console.log('Caught in component subscribe:', err),
    //   });
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });
  }
}
