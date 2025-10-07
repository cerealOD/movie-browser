import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderService } from '../services/header.service';
import { AuthService } from '../services/auth.service';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // mock injected services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['close']);

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
