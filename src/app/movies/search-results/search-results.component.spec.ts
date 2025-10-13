import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { SearchResultsComponent } from './search-results.component';
import { IndexMovie } from '../../models/indexMovie.model';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ToastService } from '../../services/toast.service';

const queryParamsSubject = new BehaviorSubject({ query: 'matrix', page: 2 });

const activatedRouteStub = {
  queryParams: queryParamsSubject.asObservable(),
} as any;

const fakeResults: IndexMovie[] = [
  {
    id: 1,
    title: 'Movie 1',
    poster_path: 'path.jpg',
    release_date: '2025-10-08',
    vote_average: 7,
    adult: false,
    genre_ids: [],
  },
];

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', ['searchMovies']);
    moviesServiceSpy.searchMovies.and.returnValue(
      of({ page: 1, results: fakeResults, total_pages: 3, total_results: 50 })
    );
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch search results on init', () => {
    queryParamsSubject.next({ query: 'matrix', page: 2 });
    expect(moviesServiceSpy.searchMovies).toHaveBeenCalledWith('matrix', 2);
    expect(component.movies()).toEqual(fakeResults);
    expect(component.totalRecords()).toBe(50);
    expect(component.isFetching()).toBeFalse();
  });

  it('should show error toast if search fails', () => {
    // return observable that errors
    moviesServiceSpy.searchMovies.and.returnValue(
      throwError(() => new Error('Search failed'))
    );

    const errorFixture = TestBed.createComponent(SearchResultsComponent);
    const errorComponent = errorFixture.componentInstance;

    errorFixture.detectChanges();

    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Failed to fetch search results. Please try again later.',
      'error'
    );
    expect(errorComponent.isFetching()).toBeFalse();
  });

  it('should compute cappedTotalRecords correctly', () => {
    component.totalRecords.set(10000); // higher than max
    expect(component.cappedTotalRecords()).toBe(500 * 20); // 500 pages * 20 items
  });
});
