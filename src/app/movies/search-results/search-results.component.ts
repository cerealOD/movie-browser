import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexMovie } from '../../models/indexMovie.model';
import { MoviesContainerComponent } from '../movies-container/movies-container.component';
import { MoviesComponent } from '../movies.component';
import { PaginatorModule } from 'primeng/paginator';
import { FetchDataService } from '../../services/fetch-state.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-search-results',
  imports: [MoviesContainerComponent, MoviesComponent, PaginatorModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent implements OnInit {
  query = '';
  movies = signal<IndexMovie[] | undefined>(undefined);
  currentPage = signal(1);
  totalRecords = signal(1);

  private fetchState = inject(FetchDataService);
  isFetching = this.fetchState.isFetching;

  private moviesService = inject(MoviesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'] || '';
      this.currentPage.set(params['page'] || 1);

      if (this.query) {
        this.fetchResults();
      }
    });
  }

  private fetchResults() {
    this.isFetching.set(true);
    this.moviesService.searchMovies(this.query, this.currentPage()).subscribe({
      next: (res) => {
        this.movies.set(res.results);
        this.totalRecords.set(res.total_results);
      },
      error: (err: Error) => {
        console.error('Search results fetch failed:', err);
        this.toast.show(
          'Failed to fetch search results. Please try again later.',
          'error'
        );
        this.isFetching.set(false);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });
  }

  loadPageFromPaginator(event: any) {
    const page = event.page + 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  cappedTotalRecords = computed(() => {
    const itemsPerPage = 20;
    const maxPages = 500;
    return Math.min(this.totalRecords(), maxPages * itemsPerPage);
  });
}
