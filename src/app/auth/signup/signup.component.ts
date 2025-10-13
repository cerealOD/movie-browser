import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HeaderService } from '../../services/header.service';
import { Router, RouterLink } from '@angular/router';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value; //searches formgroups and gives the control that has controlName as name if it exists
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }

    return { valuesNotEq: true };
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    username: new FormControl('', {
      validators: [Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.minLength(6), Validators.required],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.minLength(6), Validators.required],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      }
    ),
  });

  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private headerService = inject(HeaderService);
  private router = inject(Router);

  onSubmit() {
    if (this.form.invalid) return;

    const username = this.form.value.username!;
    const password = this.form.value.passwords?.password!;

    this.auth.register(username, password).subscribe({
      next: () => {
        this.auth.login(username, password).subscribe({
          next: () => {
            // instantly login user
            this.headerService.close();
            this.router.navigate(['/']);
            this.toast.show('Signup and Login successful!', 'success');
          },
          error: (err) => {
            const message =
              (err?.error && err.error.error) ||
              err?.message ||
              'Signup failed';
            this.toast.show(message, 'error');
          },
        });
      },
      error: (err) => {
        const message =
          (err?.error && err.error.error) || err?.message || 'Signup failed';
        this.toast.show(message, 'error');
      },
    });
  }
}
