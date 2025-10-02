import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Movie } from '../movie.model';
import { MoviesComponent } from '../movies.component';
import { MoviesContainerComponent } from '../movies-container/movies-container.component';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  throwError,
} from 'rxjs';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleizePipe } from '../../pipes/titleize.pipe';

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  templateUrl: './categorical-movies.component.html',
  styleUrl: './categorical-movies.component.css',
  imports: [MoviesComponent, MoviesContainerComponent, TitleizePipe],
})
export class CategoricalMoviesComponent implements OnInit {
  category = signal<string>('');
  movies = signal<Movie[] | undefined>(undefined);
  currentPage = signal(1);
  totalPages = signal(1);
  isFetching = signal(false);
  error = signal('');

  private moviesService = inject(MoviesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // Single combined subscription: reacts when either route param or query param changes
    const sub = combineLatest([
      this.route.paramMap, // e.g. /movies/:category
      this.route.queryParamMap, // e.g. ?page=2
    ])
      .pipe(
        map(([params, qparams]) => ({
          category: params.get('category'),
          page: Number(qparams.get('page')) || 1,
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.category === curr.category && prev.page === curr.page
        )
      )
      .subscribe(({ category, page }) => {
        if (this.category() !== category) {
          this.category.set(category!);

          // Reset page to 1 when category changes
          if (page !== 1) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { page: 1 },
              queryParamsHandling: 'merge',
            });
            return; // wait for next emission
          }
        }

        this.category.set(category!);
        this.loadMoviesForPage(page);
      });

    // Clean up
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  // Call this only to fetch data; it does NOT update the URL
  private loadMoviesForPage(page: number) {
    console.log(this.category());
    this.isFetching.set(true);
    this.moviesService.loadCategoricalMovies(this.category(), page).subscribe({
      next: (response: any) => {
        this.movies.set(response.results || []);
        this.totalPages.set(response.total_pages || 1);
        this.currentPage.set(page);
      },
      error: (err: Error) => {
        this.error.set(err.message || 'Failed to load');
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
  }

  // User-driven navigation: update the URL only. The subscription will load data.
  nextPage() {
    const curr = this.currentPage();
    if (curr < this.totalPages()) {
      const next = curr + 1;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: next },
        queryParamsHandling: 'merge',
      });
    }
  }

  prevPage() {
    const curr = this.currentPage();
    if (curr > 1) {
      const prev = curr - 1;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: prev },
        queryParamsHandling: 'merge',
      });
    }
  }

  // optional: direct go-to-page function for numbered buttons
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge',
      });
    }
  }

  //send some data to the backend
  onSelectMovie(selectedMovie: Movie) {}
}
