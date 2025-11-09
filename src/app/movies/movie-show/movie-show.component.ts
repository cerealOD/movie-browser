import {
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatePipe, DecimalPipe, ViewportScroller } from '@angular/common';
import { IndexMovie } from '../../models/index-movie.model';
import { Cast } from '../../models/cast.model';
import { MovieComponent } from '../movie/movie.component';
import { AuthService } from '../../services/auth.service';
import { FetchDataService } from '../../services/fetch-state.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CastResponse } from '../../models/cast-response.model';
import { filter } from 'rxjs';

@Component({
  selector: 'app-movie-show',
  imports: [DatePipe, DecimalPipe, MovieComponent],
  templateUrl: './movie-show.component.html',
  styleUrl: './movie-show.component.css',
})
export class MovieShowComponent implements OnInit {
  movieId = signal<number>(0);
  movie = signal<Movie | undefined>(undefined);
  similars = signal<IndexMovie[] | undefined>([]);
  cast = signal<Cast[] | undefined>([]);
  isAdding = signal(false);

  private fetchState = inject(FetchDataService);
  isFetching = this.fetchState.isFetching;

  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  private viewportScroller = inject(ViewportScroller);

  // pull favorites as readonly signal
  userFavorites = this.moviesService.loadedUserFavorites;

  ngOnInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const nav = this.router.currentNavigation();
        if (!nav) return;

        if (nav.trigger === 'imperative') {
          // if we click on similar movie, start on top
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        // otherwise, if we go back, restore scroll state
      });
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
    this.moviesService.fetchMovie(movieId).subscribe({
      next: (res) => {
        this.movie.set(res);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Movie fetch error:', err);

        if (err.status === 404) {
          this.router.navigateByUrl('/not-found');
        } else {
          this.toast.show(
            'Failed to load movie. Please try again later.',
            'error'
          );
        }
        this.isFetching.set(false);
      },
      complete: () => {
        this.fetchCast(this.movieId());
      },
    });
  }

  private fetchCast(movieId: number) {
    this.moviesService.fetchCast(movieId).subscribe({
      next: (res: CastResponse) => {
        this.cast.set(
          // only get cast with existing profile picture
          res.cast.filter((value) => value.profile_path).slice(0, 12)
        );
      },
      error: (err: Error) => {
        console.error('Similar movies fetch failed:', err);
        this.toast.show(
          'Failed to load cast. Please try again later.',
          'error'
        );
        this.isFetching.set(false);
      },
      complete: () => {
        this.fetchSimilars(this.movieId());
      },
    });
  }

  private fetchSimilars(movieId: number) {
    this.moviesService.loadSimilarMovies(movieId).subscribe({
      next: (res) => {
        this.similars.set(res.results.slice(0, 12));
      },
      error: (err: Error) => {
        console.error('Similar movies fetch failed:', err);
        this.toast.show(
          'Failed to load similar movies. Please try again later.',
          'error'
        );
        this.isFetching.set(false);
      },
      complete: () => {
        this.isFetching.set(false);
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
        const sub = this.moviesService
          .removeMovieFromUserFavorites(movie.id)
          .subscribe({
            next: () => this.toast.show('Removed from favorites!', 'success'),
            error: (err: Error) =>
              this.toast.show(err.message || 'Failed to remove', 'error'),
          });
        this.destroyRef.onDestroy(() => sub.unsubscribe());
      } else {
        const sub = this.moviesService
          .addMovieToUserFavorites(indexMovie)
          .subscribe({
            next: () => {
              this.toast.show('Added to favorites!', 'success');
            },
            error: (err: Error) =>
              this.toast.show(err.message || 'Failed to add', 'error'),
          });
        this.destroyRef.onDestroy(() => sub.unsubscribe());
      }
    } else {
      this.toast.show('Must login to add favorites', 'info');
    }
  }
}
