import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from '../favorites/favorites.component';
import { MoviesService } from '../services/movies.service';
import { FetchDataService } from '../services/fetch-state.service';
import { ToastService } from '../services/toast.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  const fakeMovies = [
    {
      adult: false,
      id: 1,
      poster_path: 'poster1.png',
      release_date: '2025-01-01',
      genre_ids: [1, 2],
      title: 'Movie 1',
      vote_average: 7,
    },
    {
      adult: false,
      id: 2,
      poster_path: 'poster2.png',
      release_date: '2025-02-01',
      genre_ids: [3],
      title: 'Movie 2',
      vote_average: 8,
    },
  ];

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj(
      'MoviesService',
      ['loadUserFavorites'],
      {
        loadedUserFavorites: signal(fakeMovies),
      }
    );

    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        FetchDataService,
      ],
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    moviesServiceSpy.loadUserFavorites.and.returnValue(of(fakeMovies));
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should call loadUserFavorites and update isFetching', () => {
    moviesServiceSpy.loadUserFavorites.and.returnValue(of(fakeMovies));
    createComponent();

    expect(moviesServiceSpy.loadUserFavorites).toHaveBeenCalled();
    expect(component.isFetching()).toBeFalse();
  });

  it('should show a toast and stop fetching if service throws an error', () => {
    moviesServiceSpy.loadUserFavorites.and.returnValue(
      throwError(() => new Error('Test error'))
    );
    createComponent();

    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Failed to load favorite movies. Please try again later.',
      'error'
    );

    expect(component.isFetching()).toBeFalse();
  });

  it('should have movies from loadedUserFavorites', () => {
    moviesServiceSpy.loadUserFavorites.and.returnValue(of(fakeMovies));
    createComponent();

    expect(component.movies()).toEqual(fakeMovies);
  });
});
