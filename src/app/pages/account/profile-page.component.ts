import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import * as UserActions from '../../state/user/user.actions';
import { UserProfile } from '../../state/user/user.actions'; 
import {
  selectUserProfile,
  selectUserLoading,
  selectUserError,
} from '../../state/user/user.selectors';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .profile-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
      }

      .form-card {
        padding: 2rem;
      }

      .form-section {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        color: #1f2937;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .form-field-full {
        width: 100%;
      }

      .actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      @media (max-width: 640px) {
        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  template: `
    <div class="profile-page">
      <h1 class="page-title">Mon Profil</h1>

      <div *ngIf="loading$ | async" class="loading-container">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <mat-card class="form-card" *ngIf="!(loading$ | async)">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <!-- Informations personnelles -->
          <div class="form-section">
            <h2 class="section-title">Informations personnelles</h2>

            <div class="form-row">
              <!-- 🔧 CHANGEMENT: appearance="fill" au lieu de "outline" -->
              <mat-form-field appearance="fill">
                <mat-label>Nom d'utilisateur</mat-label>
                <input matInput formControlName="username" readonly />
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
                <mat-error
                  *ngIf="profileForm.controls.email.hasError('required')"
                >
                  Email requis
                </mat-error>
                <mat-error
                  *ngIf="profileForm.controls.email.hasError('email')"
                >
                  Email invalide
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="fill" class="form-field-full">
              <mat-label>Nom complet</mat-label>
              <input matInput formControlName="fullName" />
            </mat-form-field>
          </div>

          <!-- Adresse par défaut -->
          <div class="form-section" formGroupName="defaultAddress">
            <h2 class="section-title">Adresse par défaut</h2>

            <mat-form-field appearance="fill" class="form-field-full">
              <mat-label>Rue</mat-label>
              <input matInput formControlName="street" />
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="fill">
                <mat-label>Code postal</mat-label>
                <input matInput formControlName="postalCode" />
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Ville</mat-label>
                <input matInput formControlName="city" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="fill" class="form-field-full">
              <mat-label>Pays</mat-label>
              <input matInput formControlName="country" />
            </mat-form-field>
          </div>

          <!-- Préférences -->
          <div class="form-section" formGroupName="preferences">
            <h2 class="section-title">Préférences</h2>

            <mat-slide-toggle formControlName="newsletter" color="primary">
              Recevoir la newsletter
            </mat-slide-toggle>

            <mat-form-field appearance="fill" class="form-field-full" style="margin-top: 1rem;">
              <mat-label>Note minimale par défaut (filtres produits)</mat-label>
              <input
                matInput
                type="number"
                min="0"
                max="5"
                step="0.5"
                formControlName="defaultMinRating"
              />
            </mat-form-field>
          </div>

          <div class="actions">
            <button
              mat-button
              type="button"
              routerLink="/"
            >
              Annuler
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="profileForm.invalid || profileForm.pristine"
            >
              <mat-icon>save</mat-icon>
              Enregistrer
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  readonly loading$ = this.store.select(selectUserLoading);
  readonly error$ = this.store.select(selectUserError);
  readonly profile$ = this.store.select(selectUserProfile);

  readonly profileForm = this.fb.nonNullable.group({
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    fullName: [''],
    defaultAddress: this.fb.group({
      street: [''],
      postalCode: [''],
      city: [''],
      country: [''],
    }),
    preferences: this.fb.group({
      newsletter: [false],
      defaultMinRating: [0],
    }),
  });

  ngOnInit(): void {
    // Charger le profil
    this.store.dispatch(UserActions.loadProfile());

    // Remplir le formulaire quand le profil arrive
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.profileForm.patchValue(
          {
            username: profile.username,
            email: profile.email,
            fullName: profile.fullName || '',
            defaultAddress: profile.defaultAddress || {
              street: '',
              postalCode: '',
              city: '',
              country: '',
            },
            preferences: profile.preferences,
          },
          { emitEvent: false }
        );

        // Le username est readonly
        this.profileForm.controls.username.disable();
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();
    
    const updates: Partial<UserProfile> = {
      email: formValue.email,
      fullName: formValue.fullName || undefined,
      preferences: {
        newsletter: formValue.preferences.newsletter ?? false,
        defaultMinRating: formValue.preferences.defaultMinRating || undefined,
      },
    };

    const hasAddress = 
      formValue.defaultAddress.street ||
      formValue.defaultAddress.postalCode ||
      formValue.defaultAddress.city ||
      formValue.defaultAddress.country;

    if (hasAddress) {
      updates.defaultAddress = {
        street: formValue.defaultAddress.street || null,
        postalCode: formValue.defaultAddress.postalCode || null,
        city: formValue.defaultAddress.city || null,
        country: formValue.defaultAddress.country || null,
      };
    }

    this.store.dispatch(UserActions.updateProfile({ updates }));
    this.toast.success('Profil mis à jour avec succès');
    this.profileForm.markAsPristine();
  }
}