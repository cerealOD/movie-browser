import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IndexMovie } from '../../models/indexMovie.model';
import { MoviesService } from '../../services/movies.service';
import { FetchDataService } from '../../services/fetch-state.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-movie',
  imports: [RouterLink, DatePipe],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  movie = input.required<IndexMovie>();
  currentRoute = signal<string | undefined>('');

  private fetchState = inject(FetchDataService);
  isFetching = this.fetchState.isFetching;

  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toast = inject(ToastService);

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.currentRoute.set(url.split('/')[1]);
    });
  }

  // get whether a movie is favorites for logged in user
  isFavorite = computed(() =>
    this.moviesService.isFavorite(this.movie()?.id ?? -1)
  );

  toggleFavorite() {
    const movie = this.movie();
    if (!movie) return;

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
      const sub = this.moviesService.addMovieToUserFavorites(movie).subscribe({
        next: () => this.toast.show('Added to favorites!', 'success'),
        error: (err: Error) =>
          this.toast.show(err.message || 'Failed to add', 'error'),
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }
}
