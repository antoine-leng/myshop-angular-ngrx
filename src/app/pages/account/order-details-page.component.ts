import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import * as UserActions from '../../state/user/user.actions';
import {
  selectCurrentOrder,
  selectOrderDetailsLoading,
} from '../../state/user/user.selectors';

@Component({
  standalone: true,
  selector: 'app-order-details-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .order-details-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
      }

      .details-card {
        padding: 2rem;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
      }

      .order-items {
        margin: 2rem 0;
      }

      .item-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .item-row:first-child {
        font-weight: 600;
        color: #6b7280;
      }

      .summary-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #e5e7eb;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
      }

      .summary-row.total {
        font-size: 1.25rem;
        font-weight: 700;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }

      .address-section {
        background: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      @media (max-width: 640px) {
        .item-row {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
      }
    `,
  ],
  template: `
    <div class="order-details-page">
      <div class="page-header">
        <button mat-button routerLink="/account/orders">
          <mat-icon>arrow_back</mat-icon>
          Retour aux commandes
        </button>
      </div>

      <div *ngIf="loading$ | async" class="loading-container">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <mat-card class="details-card" *ngIf="order$ | async as order">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
          <h1 class="page-title">Commande {{ order.id }}</h1>
          <mat-chip [color]="getStatusColor(order.status)">
            {{ getStatusLabel(order.status) }}
          </mat-chip>
        </div>

        <div style="color: #6b7280; margin-bottom: 2rem;">
          Passée le {{ order.createdAt | date : 'dd MMMM yyyy à HH:mm' }}
        </div>

        <!-- Articles -->
        <div class="order-items">
          <h2 class="section-title">Articles commandés</h2>

          <div class="item-row">
            <span>Produit</span>
            <span>Prix unitaire</span>
            <span>Quantité</span>
            <span>Total</span>
          </div>

          <div class="item-row" *ngFor="let item of order.items; trackBy: trackByProductId">
            <span>{{ item.productName }}</span>
            <span>{{ item.price | number : '1.2-2' }} €</span>
            <span>{{ item.quantity }}</span>
            <span>{{ item.price * item.quantity | number : '1.2-2' }} €</span>
          </div>
        </div>

        <!-- Récapitulatif -->
        <div class="summary-section">
          <h2 class="section-title">Récapitulatif</h2>

          <div class="summary-row">
            <span>Sous-total</span>
            <span>{{ order.subtotal | number : '1.2-2' }} €</span>
          </div>

          <div class="summary-row">
            <span>Livraison</span>
            <span *ngIf="order.shipping === 0">Gratuite</span>
            <span *ngIf="order.shipping > 0">{{
              order.shipping | number : '1.2-2'
            }} €</span>
          </div>

          <div class="summary-row">
            <span>TVA (20%)</span>
            <span>{{ order.taxes | number : '1.2-2' }} €</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ order.total | number : '1.2-2' }} €</span>
          </div>
        </div>

        <!-- Adresse de livraison -->
        <div style="margin-top: 2rem;">
          <h2 class="section-title">Adresse de livraison</h2>
          <div class="address-section">
            <p style="margin: 0; line-height: 1.6;">
              {{ order.address.street }}<br />
              {{ order.address.postalCode }} {{ order.address.city }}<br />
              {{ order.address.country }}
            </p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
})
export class OrderDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  readonly order$ = this.store.select(selectCurrentOrder);
  readonly loading$ = this.store.select(selectOrderDetailsLoading);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.store.dispatch(UserActions.loadOrderDetails({ orderId }));
    }
  }

  trackByProductId(index: number, item: any): number {
    return item.productId;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered':
        return 'primary';
      case 'shipped':
        return 'accent';
      case 'processing':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'delivered':
        return 'Livrée';
      case 'shipped':
        return 'Expédiée';
      case 'processing':
        return 'En cours';
      case 'confirmed':
        return 'Confirmée';
      default:
        return status;
    }
  }
}