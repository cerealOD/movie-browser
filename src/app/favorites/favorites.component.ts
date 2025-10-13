import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MoviesComponent } from '../movies/movies.component';
import { MoviesContainerComponent } from '../movies/movies-container/movies-container.component';
import { MoviesService } from '../services/movies.service';
import { FetchDataService } from '../services/fetch-state.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-favorites',
  imports: [MoviesComponent, MoviesContainerComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  private fetchState = inject(FetchDataService);
  isFetching = this.fetchState.isFetching;

  private moviesService = inject(MoviesService);
  movies = this.moviesService.loadedUserFavorites;

  currentPage = signal(1);
  totalRecords = signal(1);

  private destroyRef = inject(DestroyRef);
  private toast = inject(ToastService);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.moviesService.loadUserFavorites().subscribe({
      error: (err: Error) => {
        console.error('Favorite movies fetch failed:', err);
        this.toast.show(
          'Failed to load favorite movies. Please try again later.',
          'error'
        );
        this.isFetching.set(false);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
