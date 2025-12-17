import { Component, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-promo-code-input',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .promo-container {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }

      .promo-field {
        flex: 1;
      }

      .success-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #059669;
        font-weight: 500;
        margin-top: 0.5rem;
      }

      .error-message {
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    `,
  ],
  template: `
    <div>
      <div class="promo-container">
        <mat-form-field appearance="outline" class="promo-field">
          <mat-label>Code promo</mat-label>
          <input
            matInput
            [(ngModel)]="promoCode"
            placeholder="Ex: WELCOME10"
            [disabled]="applying()"
          />
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          (click)="apply()"
          [disabled]="!promoCode || applying()"
          style="margin-top: 0.25rem;"
        >
          <mat-icon *ngIf="!applying()">check</mat-icon>
          <mat-progress-spinner
            *ngIf="applying()"
            diameter="20"
            mode="indeterminate"
          ></mat-progress-spinner>
          {{ applying() ? 'Application...' : 'Appliquer' }}
        </button>
      </div>

      <div *ngIf="success()" class="success-message">
        <mat-icon>check_circle</mat-icon>
        <span>Code promo appliqué avec succès !</span>
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>
    </div>
  `,
})
export class PromoCodeInputComponent {
  @Output() applyPromoCode = new EventEmitter<string>();

  promoCode = '';
  applying = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  apply(): void {
    if (!this.promoCode) return;

    this.applying.set(true);
    this.success.set(false);
    this.error.set(null);

    this.applyPromoCode.emit(this.promoCode);

    // Simuler une réponse
    setTimeout(() => {
      this.applying.set(false);
      if (this.promoCode === 'INVALID') {
        this.error.set('Code promo invalide ou expiré');
      } else {
        this.success.set(true);
      }
    }, 1000);
  }
}