import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { ToastService } from '../../services/toast.service';
import { of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';
import { LoginResponse } from '../../models/login-response.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let router: Router;

  beforeEach(async () => {
    // mock injected services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['close']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login(), close header, navigate, and show success toast', () => {
    component.form.setValue({ username: 'test', password: '123456' });
    authServiceSpy.login.and.returnValue(
      of({ token: 'fake-jwt' } as LoginResponse)
    );

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test', '123456');
    expect(headerServiceSpy.close).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Login successful!',
      'success'
    );
  });

  it('should show error toast and not navigate on login failure', () => {
    component.form.setValue({ username: 'fail', password: '123456' });
    authServiceSpy.login.and.returnValue(
      throwError(() => ({ error: { error: 'Invalid credentials' } }))
    );

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Invalid credentials',
      'error'
    );
  });

  it('should show generic error toast if no error message is provided', () => {
    component.form.setValue({ username: 'fail', password: '123456' });
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Something went wrong'))
    );

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith(
      'Something went wrong',
      'error'
    );
  });
});
