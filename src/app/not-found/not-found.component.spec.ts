import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 404 title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      '404 - Page Not Found'
    );
    expect(compiled.querySelector('p')?.textContent).toContain('doesn’t exist');
  });

  it('should have a link to home page', () => {
    const linkEl: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector('a');

    expect(linkEl).withContext('link element should exist').not.toBeNull();
    expect(linkEl?.textContent).toContain('Go back home');

    const attrValue = linkEl?.getAttribute('routerlink');

    expect(attrValue).toContain('/');
  });
});
