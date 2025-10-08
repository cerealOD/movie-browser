import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesService } from '../../services/movies.service';
import { provideRouter, Router } from '@angular/router';
import { MovieComponent } from './movie.component';
import { IndexMovie } from '../../models/indexMovie.model';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';

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

describe('MovieComponent (Host)', () => {
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let movieDebugEl: any;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'removeMovieFromUserFavorites',
      'addMovieToUserFavorites',
      'isFavorite',
    ]);

    moviesServiceSpy.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
      ],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    movieDebugEl = hostFixture.debugElement.query(By.directive(MovieComponent));

    hostFixture.detectChanges();
  });

  it('should create host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render movie title and release date', () => {
    const titleEl = movieDebugEl.nativeElement.querySelector('h2');
    const dateEl = movieDebugEl.nativeElement.querySelector('p');

    expect(titleEl.textContent).toContain(hostComponent.testMovie.title);
    expect(dateEl.textContent).toContain('Sep 30, 2025'); // formatted by date pipe
  });

  it('should show favorite button if currentRoute is "favorites"', () => {
    const movieComp = movieDebugEl.componentInstance as MovieComponent;
    movieComp.currentRoute.set('favorites');
    hostFixture.detectChanges();

    const button = movieDebugEl.query(By.css('button.favorite-btn'));
    expect(button).toBeTruthy();
  });

  it('should hide favorite button if currentRoute is not "favorites"', () => {
    const movieComp = movieDebugEl.componentInstance as MovieComponent;
    movieComp.currentRoute.set('popular');
    hostFixture.detectChanges();

    const button = movieDebugEl.query(By.css('button.favorite-btn'));
    expect(button).toBeFalsy();
  });

  it('should call addMovieToUserFavorites when favorite button clicked', () => {
    const movieComp = movieDebugEl.componentInstance as MovieComponent;
    movieComp.currentRoute.set('favorites');
    moviesServiceSpy.isFavorite.and.returnValue(false);
    moviesServiceSpy.addMovieToUserFavorites.and.returnValue(of({}));

    hostFixture.detectChanges();

    const button = movieDebugEl.query(By.css('button.favorite-btn'));
    button.nativeElement.click();
    hostFixture.detectChanges();

    expect(moviesServiceSpy.addMovieToUserFavorites).toHaveBeenCalledWith(
      hostComponent.testMovie
    );
  });

  it('should call removeMovieFromUserFavorites if already favorite', () => {
    const movieComp = movieDebugEl.componentInstance as MovieComponent;
    movieComp.currentRoute.set('favorites');
    moviesServiceSpy.isFavorite.and.returnValue(true);
    moviesServiceSpy.removeMovieFromUserFavorites.and.returnValue(of({}));

    hostFixture.detectChanges();

    const button = movieDebugEl.query(By.css('button.favorite-btn'));
    button.nativeElement.click();
    hostFixture.detectChanges();

    expect(moviesServiceSpy.removeMovieFromUserFavorites).toHaveBeenCalledWith(
      hostComponent.testMovie.id
    );
  });
});
