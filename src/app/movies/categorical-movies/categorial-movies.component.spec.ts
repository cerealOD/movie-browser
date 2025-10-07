import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesService } from '../../services/movies.service';
import { provideRouter } from '@angular/router';

import { CategoricalMoviesComponent } from './categorical-movies.component';

describe('CategoricalMoviesComponent', () => {
  let component: CategoricalMoviesComponent;
  let fixture: ComponentFixture<CategoricalMoviesComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    // mock injected services
    moviesServiceSpy = jasmine.createSpyObj('MoviesService', [
      'loadCategoricalMovies',
    ]);

    await TestBed.configureTestingModule({
      imports: [CategoricalMoviesComponent],
      providers: [
        provideRouter([]),
        { provide: MoviesService, useValue: moviesServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoricalMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
