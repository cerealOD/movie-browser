import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieShowComponent } from './movie-show.component';
import { MoviesService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';
import { convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { IndexMovie } from '../../models/index-movie.model';
import { computed } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { MoviesResponse } from '../../models/movies-response.model';
import { CastResponse } from '../../models/cast-response.model';

describe('MovieShowComponent', () => {
  let component: MovieShowComponent;
  let fixture: ComponentFixture<MovieShowComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  // let activatedRouteStub: Partial<ActivatedRoute>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  const fakeMovie = {
    adult: false,
    backdrop_path: 'something',
    id: 1,
    imdb_id: 'something',
    original_title: 'title',
    overview: 'overview',
    poster_path: 'something',
    release_date: '2025-10-08',
    runtime: 120,
    genres: [],
    title: 'title',
    vote_average: 6.3,
  } as Movie;

  beforeEach(async () => {
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);

    moviesServiceSpy = jasmine.createSpyObj(
      'MoviesService',
      [
        'fetchMovie',
        'loadSimilarMovies',
        'fetchCast',
        'removeMovieFromUserFavorites',
        'addMovieToUserFavorites',
        'isFavorite',
      ],
      {
        loadedUserFavorites: of([]), // readonly signal for user favorites
      }
    );

    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    moviesServiceSpy.fetchMovie.and.returnValue(of(fakeMovie));
    moviesServiceSpy.loadSimilarMovies.and.returnValue(
      of({
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      } as MoviesResponse)
    );
    moviesServiceSpy.fetchCast.and.returnValue(
      of({ cast: [] } as CastResponse)
    );
    moviesServiceSpy.addMovieToUserFavorites.and.returnValue(of({}));
    moviesServiceSpy.removeMovieFromUserFavorites.and.returnValue(of({}));
    moviesServiceSpy.isFavorite.and.returnValue(false);

    authServiceSpy.isLoggedIn.and.returnValue(true);

    const activatedRouteStub = {
      paramMap: of(convertToParamMap({ id: '1' })),
    };

    await TestBed.configureTestingModule({
      imports: [MovieShowComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movie, similars, and cast on ngOnInit', () => {
    component.ngOnInit();
    expect(moviesServiceSpy.fetchMovie).toHaveBeenCalledWith(1);
    expect(moviesServiceSpy.loadSimilarMovies).toHaveBeenCalledWith(1);
    expect(moviesServiceSpy.fetchCast).toHaveBeenCalledWith(1);
    expect(component.isFetching()).toBeFalse();
    expect(component.movie()).toEqual(fakeMovie);
  });

  it('should toggle favorite: add when not favorite', () => {
    moviesServiceSpy.isFavorite.and.returnValue(false);
    component.movie.set(fakeMovie);

    component.toggleFavorite();

    const fakeIndexMovie = {
      adult: fakeMovie.adult,
      id: fakeMovie.id,
      poster_path: fakeMovie.poster_path,
      release_date: fakeMovie.release_date,
      genre_ids: fakeMovie.genres.map((g) => Number(g.id)),
      title: fakeMovie.title,
      vote_average: fakeMovie.vote_average,
    } as IndexMovie;

    expect(moviesServiceSpy.addMovieToUserFavorites).toHaveBeenCalledWith(
      fakeIndexMovie
    );
    expect(
      moviesServiceSpy.removeMovieFromUserFavorites
    ).not.toHaveBeenCalled();
  });

  it('should toggle favorite: remove when already favorite', () => {
    component.movie.set(fakeMovie);
    authServiceSpy.isLoggedIn.and.returnValue(true);
    moviesServiceSpy.isFavorite.and.returnValue(true);

    // force signal to recompute
    component.isFavorite = computed(() =>
      authServiceSpy.isLoggedIn()
        ? moviesServiceSpy.isFavorite(component.movie()?.id ?? -1)
        : false
    );

    component.toggleFavorite();

    expect(moviesServiceSpy.removeMovieFromUserFavorites).toHaveBeenCalledWith(
      1
    );
  });

  it('should show error toast if fetchMovie fails', () => {
    moviesServiceSpy.fetchMovie.and.returnValue(
      throwError(() => new Error('Failed'))
    );
    component.ngOnInit();

    expect(toastSpy.show).toHaveBeenCalledWith(
      'Failed to load movie. Please try again later.',
      'error'
    );
  });
});
