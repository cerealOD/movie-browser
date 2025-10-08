import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from '../favorites/favorites.component';
import { MoviesService } from '../services/movies.service';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

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
        // mock loadedUserFavorites so it acts like real signal
        loadedUserFavorites: signal(fakeMovies),
      }
    );

    moviesServiceSpy.loadUserFavorites.and.returnValue(of(fakeMovies));

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUserFavorites and update isFetching', () => {
    expect(moviesServiceSpy.loadUserFavorites).toHaveBeenCalled();
    expect(component.isFetching()).toBeFalse(); // observable completes immediately
  });

  it('should set error signal if service throws an error', () => {
    moviesServiceSpy.loadUserFavorites.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error()).toBe('Test error');
    expect(component.isFetching()).toBeFalse();
  });

  it('should have movies from loadedUserFavorites', () => {
    expect(component.movies()).toEqual(fakeMovies);
  });
});
