import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private headerService = inject(HeaderService);
  private toast = inject(ToastService);

  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required],
    }),
  });

  onSubmit() {
    const username = this.form.value.username!;
    const password = this.form.value.password!;

    this.auth.login(username, password).subscribe({
      next: (res) => {
        console.log('Logged in:', res);
        this.headerService.close();
        this.router.navigate(['/']);
        this.toast.show('Login successful!', 'success');
      },
      error: (err) => {
        this.toast.show(err.error?.error || 'Login failed', 'error');
      },
    });
  }
}
