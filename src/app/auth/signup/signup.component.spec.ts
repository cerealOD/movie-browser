import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';

import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;

  beforeEach(async () => {
    // mock injected services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['close']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
