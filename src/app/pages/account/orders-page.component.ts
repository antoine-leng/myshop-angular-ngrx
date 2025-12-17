import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import * as UserActions from '../../state/user/user.actions';
import {
  selectUserOrders,
  selectOrdersLoading,
} from '../../state/user/user.selectors';

@Component({
  standalone: true,
  selector: 'app-orders-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .orders-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
      }

      .orders-list {
        display: grid;
        gap: 1rem;
      }

      .order-card {
        padding: 1.5rem;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .order-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .order-id {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
      }

      .order-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-top: 1rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
      }

      .info-label {
        font-size: 0.75rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .info-value {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-top: 0.25rem;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      @media (max-width: 640px) {
        .order-info {
          grid-template-columns: 1fr;
        }

        .order-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
      }
    `,
  ],
  template: `
    <div class="orders-page">
      <h1 class="page-title">Mes Commandes</h1>

      <div *ngIf="loading$ | async" class="loading-container">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <div
        *ngIf="!(loading$ | async) && (orders$ | async)?.length === 0"
        class="empty-state"
      >
        <mat-icon style="font-size: 4rem; width: 4rem; height: 4rem; color: #d1d5db;"
          >shopping_bag</mat-icon
        >
        <h2>Aucune commande</h2>
        <p>Vous n'avez pas encore passé de commande.</p>
        <button mat-raised-button color="primary" routerLink="/shop/products">
          Découvrir nos produits
        </button>
      </div>

      <div class="orders-list" *ngIf="!(loading$ | async) && (orders$ | async)?.length">
        <mat-card
          class="order-card"
          *ngFor="let order of orders$ | async; trackBy: trackByOrderId"
          [routerLink]="['/account/orders', order.id]"
        >
          <div class="order-header">
            <span class="order-id">{{ order.id }}</span>
            <mat-chip [color]="getStatusColor(order.status)">
              {{ getStatusLabel(order.status) }}
            </mat-chip>
          </div>

          <div class="order-info">
            <div class="info-item">
              <span class="info-label">Date</span>
              <span class="info-value">{{
                order.createdAt | date : 'dd MMM yyyy'
              }}</span>
            </div>

            <div class="info-item">
              <span class="info-label">Articles</span>
              <span class="info-value">{{ order.itemCount }} article(s)</span>
            </div>

            <div class="info-item">
              <span class="info-label">Total</span>
              <span class="info-value"
                >{{ order.total | number : '1.2-2' }} €</span
              >
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
})
export class OrdersPage implements OnInit {
  private readonly store = inject(Store);

  readonly orders$ = this.store.select(selectUserOrders);
  readonly loading$ = this.store.select(selectOrdersLoading);

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadOrders());
  }

  trackByOrderId(index: number, order: any): string {
    return order.id;
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