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

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.currentRoute.set(url.split('/')[1].split('?')[0]);
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
          next: () => console.log('Removed from favorites'),
          error: (err: Error) => console.error(err.message),
        });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    } else {
      // Add
      const sub = this.moviesService.addMovieToUserFavorites(movie).subscribe({
        next: () => console.log('Added to favorites'),
        error: (err: Error) => console.error(err.message),
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }
}
