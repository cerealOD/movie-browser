import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { IndexMovie } from '../../models/indexMovie.model';
import { MoviesComponent } from '../movies.component';
import { MoviesContainerComponent } from '../movies-container/movies-container.component';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleizePipe } from '../../pipes/titleize.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { FetchDataService } from '../../services/fetch-state.service';

@Component({
  selector: 'app-popular-movies',
  standalone: true,
  templateUrl: './categorical-movies.component.html',
  styleUrl: './categorical-movies.component.css',
  imports: [
    MoviesComponent,
    MoviesContainerComponent,
    TitleizePipe,
    PaginatorModule,
  ],
})
export class CategoricalMoviesComponent implements OnInit {
  category = signal<string>('');
  movies = signal<IndexMovie[] | undefined>(undefined);
  currentPage = signal(1);
  totalRecords = signal(1);
  error = signal('');

  private moviesService = inject(MoviesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private lastLoadedCategory = '';
  private lastLoadedPage = 0;
  private fetchState = inject(FetchDataService);
  isFetching = this.fetchState.isFetching;

  ngOnInit() {
    const categorySub = this.route.paramMap.subscribe((params) => {
      const newCategory = params.get('category') || '';
      if (newCategory !== this.category()) {
        this.category.set(newCategory);

        const pageParam = Number(this.route.snapshot.queryParamMap.get('page'));
        if (!pageParam || pageParam < 1) {
          // Reset page to 1 in URL
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: 1 },
            queryParamsHandling: 'merge',
          });
        }
      }
    });

    // Watch page query param separately
    const pageSub = this.route.queryParamMap.subscribe((qparams) => {
      const page = Number(qparams.get('page')) || 1;

      // Only load if category is set
      if (!this.category()) return;

      // Avoid double load if page/category didn't change
      if (
        this.lastLoadedCategory === this.category() &&
        this.lastLoadedPage === page
      )
        return;

      this.lastLoadedCategory = this.category();
      this.lastLoadedPage = page;

      this.loadMoviesForPage(page);
    });

    this.destroyRef.onDestroy(() => {
      categorySub.unsubscribe();
      pageSub.unsubscribe();
    });
  }

  private loadMoviesForPage(page: number) {
    console.log(this.category());
    this.isFetching.set(true);
    this.moviesService.loadCategoricalMovies(this.category(), page).subscribe({
      next: (response: any) => {
        this.movies.set(response.results || []);
        this.totalRecords.set(response.total_results);
        this.currentPage.set(page);
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

  cappedTotalRecords = computed(() => {
    const itemsPerPage = 20;
    const maxPages = 500;
    return Math.min(this.totalRecords(), maxPages * itemsPerPage);
  });

  loadPageFromPaginator(event: any) {
    const page = event.page + 1; // PrimeNG is zero based
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
    // The subscription on queryParamMap will call loadMoviesForPage
  }
}
