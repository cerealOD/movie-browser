import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IndexMovie } from '../../models/indexMovie.model';
import { Cast } from '../../models/cast.model';
import { MovieComponent } from '../movie/movie.component';
import { AuthService } from '../../services/auth.service';
import { FetchDataService } from '../../services/fetch-state.service';

@Component({
  selector: 'app-movie-show',
  imports: [DatePipe, DecimalPipe, MovieComponent],
  templateUrl: './movie-show.component.html',
  styleUrl: './movie-show.component.css',
})
export class MovieShowComponent {
  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);
  private fetchState = inject(FetchDataService);

  isFetching = this.fetchState.isFetching;
  movieId = signal<number>(0);
  isFetchingSimilars = signal(false);
  isFetchingCredits = signal(false);
  error = signal('');
  movie = signal<Movie | undefined>(undefined);
  similars = signal<IndexMovie[] | undefined>([]);
  cast = signal<Cast[] | undefined>([]);
  isAdding = signal(false);
  addError = signal<string | null>(null);

  // pull favorites as readonly signal
  userFavorites = this.moviesService.loadedUserFavorites;

  ngOnInit() {
    console.log(this.isFavorite());
    const movieIdSub = this.route.paramMap.subscribe((params) => {
      this.movieId.set(parseInt(params.get('id') || ''));
      this.fetchMovie(this.movieId());
      this.fetchSimilars(this.movieId());
      this.fetchCast(this.movieId());
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
        this.isFetching.set(false);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
  }

  private fetchSimilars(movieId: number) {
    this.isFetchingSimilars.set(true);
    this.moviesService.loadSimilarMovies(movieId).subscribe({
      next: (res) => {
        this.similars.set(res.results.slice(0, 12));
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to load similar movies');
        this.isFetchingSimilars.set(false);
      },
      complete: () => {
        this.isFetchingSimilars.set(false);
      },
    });
  }

  private fetchCast(movieId: number) {
    this.isFetchingCredits.set(true);
    this.moviesService.loadCast(movieId).subscribe({
      next: (res) => {
        this.cast.set(
          // only get cast with existing profile picture
          res.cast.filter((value) => value.profile_path).slice(0, 12)
        );
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to load cast');
        this.isFetchingCredits.set(false);
      },
      complete: () => {
        this.isFetchingCredits.set(false);
      },
    });
  }

  isFavorite = computed(() =>
    this.auth.isLoggedIn()
      ? this.moviesService.isFavorite(this.movie()?.id ?? -1)
      : false
  );

  toggleFavorite() {
    if (this.auth.isLoggedIn()) {
      const movie = this.movie();
      if (!movie) return;

      const indexMovie = {
        adult: movie.adult,
        id: movie.id,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        genre_ids: movie.genres.map((g) => Number(g.id)),
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
    } else {
      this.router.navigate(['/login']);
    }
  }
}
