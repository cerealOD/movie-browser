import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { MoviesService } from '../../services/movies.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    moviesServiceSpy = jasmine.createSpyObj(
      'MoviesService',
      ['loadUserFavorites'],
      {
        // mock loadedUserFavorites so it acts like real signal
        loadedUserFavorites: signal([]),
      }
    );

    moviesServiceSpy.loadUserFavorites.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [{ provide: MoviesService, useValue: moviesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
