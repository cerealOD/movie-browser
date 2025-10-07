import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let headerServiceSpy: jasmine.SpyObj<HeaderService>;

  beforeEach(async () => {
    // mock injected services
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    headerServiceSpy = jasmine.createSpyObj('HeaderService', ['close']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: HeaderService, useValue: headerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login() and navigate on success', () => {
    component.form.setValue({ username: 'test', password: '123456' });
    authServiceSpy.login.and.returnValue(of({ token: 'fake-jwt' }));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test', '123456');
    expect(headerServiceSpy.close).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    component.form.setValue({ username: 'fail', password: '123456' });
    authServiceSpy.login.and.returnValue(
      throwError(() => new Error('Login failed'))
    );

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    // expect no navigation on error
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
