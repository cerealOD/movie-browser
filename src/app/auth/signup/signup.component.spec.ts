import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HeaderService } from '../../services/header.service';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let headerSpy: jasmine.SpyObj<HeaderService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'login']);
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    headerSpy = jasmine.createSpyObj('HeaderService', ['close']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: HeaderService, useValue: headerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should call register and login, then close header, navigate, and show success toast', () => {
    authServiceSpy.register.and.returnValue(of({}));
    authServiceSpy.login.and.returnValue(of({ token: 'fake' }));

    component.form.setValue({
      username: 'testuser',
      passwords: { password: '123456', confirmPassword: '123456' },
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('testuser', '123456');
    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', '123456');
    expect(headerSpy.close).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(toastSpy.show).toHaveBeenCalledWith(
      'Signup and Login successful!',
      'success'
    );
  });

  it('should not call register when form is invalid (passwords mismatch)', () => {
    component.form.setValue({
      username: 'test',
      passwords: {
        password: '123456',
        confirmPassword: 'notmatch',
      },
    });

    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should handle register error correctly', () => {
    const mockError = { error: { error: 'Signup failed' } };
    authServiceSpy.register.and.returnValue(throwError(() => mockError));

    component.form.setValue({
      username: 'test',
      passwords: { password: '123456', confirmPassword: '123456' },
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(toastSpy.show).toHaveBeenCalledWith('Signup failed', 'error');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should handle login error after successful register', () => {
    authServiceSpy.register.and.returnValue(of({}));
    const mockError = new Error('Login failed');
    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    component.form.setValue({
      username: 'testuser',
      passwords: { password: '123456', confirmPassword: '123456' },
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(toastSpy.show).toHaveBeenCalledWith('Login failed', 'error');
    expect(headerSpy.close).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
