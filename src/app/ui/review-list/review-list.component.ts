import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '../../state/reviews/reviews.actions';

@Component({
  standalone: true,
  selector: 'app-review-list',
  imports: [CommonModule, MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .reviews-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .review-card {
        padding: 1.5rem;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .reviewer-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .reviewer-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
      }

      .reviewer-name {
        font-weight: 600;
        color: #1f2937;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #f59e0b;
      }

      .review-date {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
      }

      .review-comment {
        color: #374151;
        line-height: 1.6;
        margin: 0;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #9ca3af;
      }
    `,
  ],
  template: `
    <div class="reviews-container">
      <div *ngIf="reviews.length === 0" class="empty-state">
        <mat-icon style="font-size: 3rem; width: 3rem; height: 3rem;"
          >rate_review</mat-icon
        >
        <p>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
      </div>

      <mat-card class="review-card" *ngFor="let review of reviews; trackBy: trackById">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">{{ review.user.charAt(0).toUpperCase() }}</div>
            <span class="reviewer-name">{{ review.user }}</span>
          </div>

          <div class="rating">
            <mat-icon *ngFor="let star of getStars(review.rating)">{{
              star
            }}</mat-icon>
          </div>
        </div>

        <div class="review-date">
          {{ review.createdAt | date : 'dd MMMM yyyy' }}
        </div>

        <p class="review-comment">{{ review.comment }}</p>
      </mat-card>
    </div>
  `,
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];

  trackById(index: number, review: Review): string {
    return review.id;
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('star');
    }
    if (hasHalfStar) {
      stars.push('star_half');
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('star_border');
    }

    return stars;
  }
}