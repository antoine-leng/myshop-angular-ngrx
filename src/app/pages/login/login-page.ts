import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import * as AuthActions from '../../state/auth/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectAccessToken,
} from '../../state/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);
  readonly accessToken$ = this.store.select(selectAccessToken);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();

    this.store.dispatch(
      AuthActions.login({
        username,
        password,
      }),
    );
  }
}
