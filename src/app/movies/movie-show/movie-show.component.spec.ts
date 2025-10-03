import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieShowComponent } from './movie-show.component';

describe('MovieShowComponent', () => {
  let component: MovieShowComponent;
  let fixture: ComponentFixture<MovieShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
