import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';

import { SignupComponent } from './signup.component';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // mock injected services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should call AuthService.register() on valid form', () => {
    authServiceSpy.register.and.returnValue(of({ success: true }));
    component.form.setValue({
      username: 'test',
      passwords: { password: '123456', confirmPassword: '123456' },
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith('test', '123456');
  });

  it('should NOT call auth.register with invalid form', () => {
    component.form.setValue({
      username: 'test',
      passwords: {
        password: '123456',
        confirmPassword: 'different',
      },
    });

    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should handle register error', () => {
    const mockError = { error: { error: 'Signup failed' } };
    authServiceSpy.register.and.returnValue(throwError(() => mockError));
    spyOn(window, 'alert');

    component.form.setValue({
      username: 'test',
      passwords: {
        password: '123456',
        confirmPassword: '123456',
      },
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Signup failed');
  });
});
