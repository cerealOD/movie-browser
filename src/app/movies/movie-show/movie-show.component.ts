import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IndexMovie } from '../../models/indexMovie.model';

@Component({
  selector: 'app-movie-show',
  imports: [DatePipe],
  templateUrl: './movie-show.component.html',
  styleUrl: './movie-show.component.css',
})
export class MovieShowComponent {
  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movieId = signal<number>(0);
  isFetching = signal(false);
  error = signal('');
  movie = signal<Movie | undefined>(undefined);
  isAdding = signal(false);
  addError = signal<string | null>(null);

  // pull favorites as readonly signal
  userFavorites = this.moviesService.loadedUserFavorites;

  ngOnInit() {
    const movieIdSub = this.route.paramMap.subscribe((params) => {
      this.movieId.set(parseInt(params.get('id') || ''));
      this.fetchMovie(this.movieId());
    });
    this.destroyRef.onDestroy(() => {
      movieIdSub.unsubscribe();
    });
  }

  private fetchMovie(movieId: number) {
    this.isFetching.set(true);
    this.moviesService.loadMovie(movieId).subscribe({
      next: (res) => {
        this.movie.set(res);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to load');
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
  }

  isFavorite = computed(() =>
    this.moviesService.isFavorite(this.movie()?.id ?? -1)
  );

  toggleFavorite() {
    const movie = this.movie();
    if (!movie) return;

    const indexMovie = {
      adult: movie.adult,
      id: movie.id,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      genre_ids: movie.genres.map((g) => Number(g.id)), // convert Genre[] → number[]
      title: movie.title,
      vote_average: movie.vote_average,
    } satisfies IndexMovie;

    if (this.isFavorite()) {
      // Remove
      const sub = this.moviesService
        .removeMovieFromUserFavorites(movie.id)
        .subscribe({
          next: () => console.log('Removed from favorites'),
          error: (err: Error) => console.error(err.message),
        });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    } else {
      // Add
      const sub = this.moviesService
        .addMovieToUserFavorites(indexMovie)
        .subscribe({
          next: () => console.log('Added to favorites'),
          error: (err: Error) => console.error(err.message),
        });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }
}
