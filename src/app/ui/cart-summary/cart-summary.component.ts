import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface CartSummaryData {
  itemsTotal: number;
  discount?: number;
  shipping?: number;
  taxes?: number;
  grandTotal: number;
}

@Component({
  standalone: true,
  selector: 'app-cart-summary',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  styles: [
    `
      .cart-summary {
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border: 1px solid #e5e7eb;
      }

      .summary-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        color: #1f2937;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        color: #6b7280;
      }

      .summary-row.total {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
        padding: 1rem 0 0 0;
      }

      .summary-row.discount {
        color: #059669;
      }

      .summary-row.shipping {
        color: #2563eb;
      }

      .checkout-btn {
        width: 100%;
        margin-top: 1rem;
        padding: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
      }

      .loading-state {
        display: flex;
        justify-content: center;
        padding: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
        color: #9ca3af;
      }
    `,
  ],
  template: `
    <mat-card class="cart-summary">
      <mat-card-content>
        <h2 class="summary-title">Récapitulatif</h2>

        <ng-container *ngIf="!loading && summary; else loadingOrEmpty">
          <div class="summary-row">
            <span>Sous-total</span>
            <span>{{ summary.itemsTotal | number: '1.2-2' }} €</span>
          </div>

          <div class="summary-row discount" *ngIf="summary.discount && summary.discount > 0">
            <span>Réduction</span>
            <span>- {{ summary.discount | number: '1.2-2' }} €</span>
          </div>

          <div class="summary-row shipping" *ngIf="summary.shipping !== undefined">
            <span>Livraison</span>
            <span *ngIf="summary.shipping === 0">Gratuite</span>
            <span *ngIf="summary.shipping > 0">{{ summary.shipping | number: '1.2-2' }} €</span>
          </div>

          <div class="summary-row" *ngIf="summary.taxes !== undefined">
            <span>TVA (20%)</span>
            <span>{{ summary.taxes | number: '1.2-2' }} €</span>
          </div>

          <mat-divider></mat-divider>

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ summary.grandTotal | number: '1.2-2' }} €</span>
          </div>

          <button
            mat-raised-button
            color="primary"
            class="checkout-btn"
            (click)="onCheckout()"
            [disabled]="checkoutDisabled"
          >
            {{ checkoutLabel }}
          </button>
        </ng-container>

        <ng-template #loadingOrEmpty>
          <div *ngIf="loading" class="loading-state">
            <mat-progress-spinner
              diameter="40"
              mode="indeterminate"
            ></mat-progress-spinner>
          </div>
          <div *ngIf="!loading && !summary" class="empty-state">
            Votre panier est vide
          </div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
})
export class CartSummaryComponent {
  @Input() summary: CartSummaryData | null = null;
  @Input() loading = false;
  @Input() checkoutDisabled = false;
  @Input() checkoutLabel = 'Passer la commande';

  @Output() checkout = new EventEmitter<void>();

  onCheckout() {
    this.checkout.emit();
  }
}