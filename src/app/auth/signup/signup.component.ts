import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private auth = inject(AuthService);

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
        validators: [equalValues('password', 'confirmPassword')], //these validators run for all inputs in a form group
      }
    ),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const username = this.form.value.username!;
    const password = this.form.value.passwords?.password!;

    this.auth.register(username, password).subscribe({
      next: (res) => {
        console.log('Registered:', res);
        alert('Signup successful! You can now log in.');
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Signup failed');
      },
    });
  }
}
