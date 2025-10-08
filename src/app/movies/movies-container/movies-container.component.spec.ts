import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesContainerComponent } from './movies-container.component';

import { Component } from '@angular/core';

@Component({
  template: `<app-movies-container [title]="title"></app-movies-container>`,
  standalone: true,
  imports: [MoviesContainerComponent],
})
class TestHostComponent {
  title: string = 'Title';
}

describe('MovieComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = hostFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Title');
  });
});
