import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndexMovie } from '../../models/indexMovie.model';
import { Component } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { MovieShowComponent } from './movie-show.component';

describe('MovieShowComponent', () => {
  let component: MovieShowComponent;
  let fixture: ComponentFixture<MovieShowComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    // mock injected services
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'loadMovie',
      'loadSimilarMovies',
      'loadCast',
      'removeMovieFromUserFavorites',
      'addMovieToUserFavorites',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [MovieShowComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
