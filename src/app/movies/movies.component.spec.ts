import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Component } from '@angular/core';
import { IndexMovie } from '../models/indexMovie.model';

@Component({
  template: `<app-movies [movies]="movies"></app-movies>`,
  standalone: true,
  imports: [MoviesComponent],
})
class TestHostComponent {
  movies: IndexMovie[] = [
    {
      adult: false,
      id: 1,
      poster_path: 'something',
      release_date: '2025-09-30',
      genre_ids: [1, 2],
      title: 'something',
      vote_average: 6,
    },
  ];
}

describe('MoviesComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
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
