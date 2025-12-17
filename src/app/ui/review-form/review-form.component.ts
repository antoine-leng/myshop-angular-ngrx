import {
  Component,
  Output,
  EventEmitter,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ReviewFormValue {
  rating: number;
  comment: string;
}

@Component({
  standalone: true,
  selector: 'app-review-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .review-form-card {
        padding: 1.5rem;
      }

      .form-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
      }

      .rating-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
      }

      .rating-label {
        font-weight: 500;
        margin-right: 0.5rem;
      }

      .star-btn {
        transition: transform 0.2s;
      }

      .star-btn:hover {
        transform: scale(1.2);
      }

      .star-btn.active {
        color: #f59e0b;
      }

      .star-btn.inactive {
        color: #d1d5db;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
      }
    `,
  ],
  template: `
    <mat-card class="review-form-card">
      <h3 class="form-title">Donnez votre avis</h3>

      <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
        <div class="rating-selector">
          <span class="rating-label">Note :</span>
          <button
            mat-icon-button
            type="button"
            *ngFor="let star of [1, 2, 3, 4, 5]"
            [class.active]="star <= selectedRating"
            [class.inactive]="star > selectedRating"
            class="star-btn"
            (click)="setRating(star)"
          >
            <mat-icon>{{ star <= selectedRating ? 'star' : 'star_border' }}</mat-icon>
          </button>
          <span style="color: #6b7280; margin-left: 0.5rem;">{{ selectedRating }}/5</span>
        </div>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Votre commentaire</mat-label>
          <textarea
            matInput
            formControlName="comment"
            rows="4"
            placeholder="Partagez votre expérience avec ce produit..."
          ></textarea>
          <mat-error *ngIf="reviewForm.controls.comment.hasError('required')">
            Le commentaire est requis
          </mat-error>
          <mat-error *ngIf="reviewForm.controls.comment.hasError('minlength')">
            Le commentaire doit faire au moins 10 caractères
          </mat-error>
        </mat-form-field>

        <div class="form-actions">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="reviewForm.invalid"
          >
            <mat-icon>send</mat-icon>
            Publier mon avis
          </button>
        </div>
      </form>
    </mat-card>
  `,
})
export class ReviewFormComponent {
  private readonly fb = inject(FormBuilder);

  @Output() submitReview = new EventEmitter<ReviewFormValue>();

  selectedRating = 0;

  readonly reviewForm = this.fb.nonNullable.group({
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  onSubmit(): void {
    if (this.reviewForm.invalid || this.selectedRating === 0) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.submitReview.emit({
      rating: this.selectedRating,
      comment: this.reviewForm.value.comment!,
    });

    // Reset
    this.reviewForm.reset();
    this.selectedRating = 0;
  }
}