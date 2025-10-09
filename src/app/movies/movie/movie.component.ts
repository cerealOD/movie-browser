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
  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private fetchState = inject(FetchDataService);
  private toast = inject(ToastService);
  isFetching = this.fetchState.isFetching;

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.currentRoute.set(url.split('/')[1]);
    });
  }

  isFavorite = computed(() =>
    this.moviesService.isFavorite(this.movie()?.id ?? -1)
  );

  toggleFavorite() {
    const movie = this.movie();
    if (!movie) return;

    if (this.isFavorite()) {
      // Remove
      const sub = this.moviesService
        .removeMovieFromUserFavorites(movie.id)
        .subscribe({
          next: () => this.toast.show('Removed from favorites!', 'success'),
          error: (err: Error) => console.error(err.message),
        });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    } else {
      // Add
      const sub = this.moviesService.addMovieToUserFavorites(movie).subscribe({
        next: () => this.toast.show('Added to favorites!', 'success'),
        error: (err: Error) => console.error(err.message),
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }
}
