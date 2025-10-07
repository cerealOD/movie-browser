import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesService } from '../../services/movies.service';
import { provideRouter } from '@angular/router';

import { MovieComponent } from './movie.component';
import { IndexMovie } from '../../models/indexMovie.model';
import { Component } from '@angular/core';

@Component({
  template: `<app-movie [movie]="testMovie"></app-movie>`,
  standalone: true,
  imports: [MovieComponent],
})
class TestHostComponent {
  testMovie: IndexMovie = {
    adult: false,
    id: 1,
    poster_path: 'something',
    release_date: '2025-09-30',
    genre_ids: [1, 2],
    title: 'something',
    vote_average: 6,
  };
}

describe('MovieComponent', () => {
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    // mock injected services
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'removeMovieFromUserFavorites',
      'addMovieToUserFavorites',
    ]);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });
});
