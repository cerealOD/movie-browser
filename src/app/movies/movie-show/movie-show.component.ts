import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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

  addToFavs() {}
}
