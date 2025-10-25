import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required],
    }),
  });

  private router = inject(Router);
  private auth = inject(AuthService);
  private headerService = inject(HeaderService);
  private toast = inject(ToastService);

  onSubmit() {
    const username = this.form.value.username!;
    const password = this.form.value.password!;

    this.auth.login(username, password).subscribe({
      next: () => {
        this.headerService.close();
        this.router.navigate(['/']);
        this.toast.show('Login successful!', 'success');
      },
      error: (err) => {
        const message =
          (err?.error && err.error.error) || err?.message || 'Login failed';
        this.toast.show(message, 'error');
      },
    });
  }
}
