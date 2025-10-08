import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FetchDataService {
  // Generic global loader
  isFetching = signal(false);

  // // Optional: more fine-grained loaders
  // isFetchingMovies = signal(false);
  // isFetchingSimilars = signal(false);
  // isFetchingFavorites = signal(false);
  // isFetchingCredits = signal(false);

  // // You can also expose a computed() to show a global spinner
  // anyLoading = computed(
  //   () =>
  //     this.isFetching() ||
  //     this.isFetchingMovies() ||
  //     this.isFetchingFavorites() ||
  //     this.isFetchingSimilars() ||
  //     this.isFetchingCredits()
  // );
}
