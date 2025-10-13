import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderService } from '../services/header.service';
import { AuthService } from '../services/auth.service';
import { provideRouter, Router } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    // mock injected services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'user']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', [
      'close',
      'dropdownOpen',
      'toggle',
      'isMenuOpen',
      'toggleMenu',
    ]);

    authServiceSpy.user.and.returnValue({ username: 'alice' }); //mock user signal
    headerServiceSpy.dropdownOpen.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute the correct initial', () => {
    expect(component.initial()).toBe('A');
  });

  it('should call logout and navigate to /auth/login', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(headerServiceSpy.close).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should not search when query is empty', () => {
    component.searchQuery = '   '; // empty after trim
    component.onSearch();
    expect(router.navigate).not.toHaveBeenCalled;
  });

  it('should navigate with correct search query', () => {
    component.searchQuery = 'matrix';
    component.onSearch();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/search?query=matrix&page=1'
    );
  });

  it('should toggle dropdown', () => {
    component.toggleDropdown();
    expect(headerServiceSpy.toggle).toHaveBeenCalled();
  });

  it('should close dropdown on outside click', () => {
    // setup fake dropdown element
    const fakeEl = document.createElement('div');
    component.dropdownWrapper = { nativeElement: fakeEl } as any;

    headerServiceSpy.dropdownOpen.and.returnValue(true);
    spyOn(fakeEl, 'contains').and.returnValue(false);

    const event = new MouseEvent('click');
    component.onClickOutside(event);

    expect(headerServiceSpy.close).toHaveBeenCalled();
  });
});
