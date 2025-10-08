import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MoviesComponent } from '../movies/movies.component';
import { MoviesContainerComponent } from '../movies/movies-container/movies-container.component';
import { MoviesService } from '../services/movies.service';
import { FetchDataService } from '../services/fetch-state.service';

@Component({
  selector: 'app-favorites',
  imports: [MoviesComponent, MoviesContainerComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private fetchState = inject(FetchDataService);
  isFetching = this.fetchState.isFetching;
  movies = this.moviesService.loadedUserFavorites;
  currentPage = signal(1);
  totalRecords = signal(1);
  error = signal('');

  ngOnInit() {
    this.isFetching.set(true);
    //the backend provides an observable to which we need to sub
    const subscription = this.moviesService.loadUserFavorites().subscribe({
      error: (error: Error) => {
        // to get the original error message
        this.error.set(error.message);
        this.isFetching.set(false);
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
}
