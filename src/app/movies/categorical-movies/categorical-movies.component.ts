import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Movie } from '../movie.model';
import { MoviesComponent } from '../movies.component';
import { MoviesContainerComponent } from '../movies-container/movies-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { TitleizePipe } from '../../pipes/titleize.pipe';

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  templateUrl: './categorical-movies.component.html',
  styleUrl: './categorical-movies.component.css',
  imports: [MoviesComponent, MoviesContainerComponent, TitleizePipe],
})
export class CategoricalMoviesComponent implements OnInit {
  movies = signal<Movie[] | undefined>(undefined);
  category = signal<string>('');
  isFetching = signal(false);
  error = signal('');
  private moviesService = inject(MoviesService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    //the backend provides an observable to which we need to sub
    const subscription = this.route.paramMap.subscribe((params) => {
      const category = params.get('category');

      if (!category) return;

      this.category.set(category);

      this.moviesService.loadCategoricalMovies(category).subscribe({
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
