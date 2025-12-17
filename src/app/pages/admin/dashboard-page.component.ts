import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import * as AdminActions from '../../state/admin/admin.actions';
import {
  selectAdminStats,
  selectAdminLoading,
  selectTotalUsers,
  selectTotalOrders,
  selectTotalRevenue,
  selectTopProducts,
  selectRecentOrders,
} from '../../state/admin/admin.selectors';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .dashboard-page {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        padding: 1.5rem;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border-left: 4px solid #667eea;
      }

      .stat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
        color: #667eea;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-top: 0.5rem;
      }

      .section-card {
        padding: 2rem;
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 3rem;
      }

      @media (max-width: 768px) {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  template: `
    <div class="dashboard-page">
      <h1 class="page-title">Dashboard Admin</h1>

      <div *ngIf="loading$ | async" class="loading-container">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <div *ngIf="!(loading$ | async)">
        <!-- Statistiques globales -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-icon class="stat-icon">people</mat-icon>
            <div class="stat-label">Utilisateurs</div>
            <div class="stat-value">
              {{ totalUsers$ | async | number }}
            </div>
          </mat-card>

          <mat-card class="stat-card" style="border-left-color: #10b981;">
            <mat-icon class="stat-icon" style="color: #10b981;">shopping_cart</mat-icon>
            <div class="stat-label">Commandes</div>
            <div class="stat-value">
              {{ totalOrders$ | async | number }}
            </div>
          </mat-card>

          <mat-card class="stat-card" style="border-left-color: #f59e0b;">
            <mat-icon class="stat-icon" style="color: #f59e0b;">euro</mat-icon>
            <div class="stat-label">Chiffre d'affaires</div>
            <div class="stat-value">
              {{ (totalRevenue$ | async) || 0 | number : '1.2-2' }} €
            </div>
          </mat-card>
        </div>

        <!-- Top produits -->
        <mat-card class="section-card">
          <h2 class="section-title">Top 5 des produits</h2>

          <table mat-table [dataSource]="(topProducts$ | async) ?? []" style="width: 100%;">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Produit</th>
              <td mat-cell *matCellDef="let product">{{ product.name }}</td>
            </ng-container>

            <ng-container matColumnDef="sold">
              <th mat-header-cell *matHeaderCellDef>Vendus</th>
              <td mat-cell *matCellDef="let product">{{ product.sold }}</td>
            </ng-container>

            <ng-container matColumnDef="revenue">
              <th mat-header-cell *matHeaderCellDef>Revenus</th>
              <td mat-cell *matCellDef="let product">
                {{ product.revenue | number : '1.2-2' }} €
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="topProductsColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: topProductsColumns"
            ></tr>
          </table>
        </mat-card>

        <!-- Commandes récentes -->
        <mat-card class="section-card">
          <h2 class="section-title">Commandes récentes</h2>

          <table mat-table [dataSource]="(recentOrders$ | async) ?? []" style="width: 100%;">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let order">{{ order.id }}</td>
            </ng-container>

            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>Client</th>
              <td mat-cell *matCellDef="let order">{{ order.user }}</td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let order">
                {{ order.total | number : '1.2-2' }} €
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let order">{{ order.status }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let order">
                {{ order.createdAt | date : 'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="recentOrdersColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: recentOrdersColumns"
            ></tr>
          </table>
        </mat-card>
      </div>
    </div>
  `,
})
export class AdminDashboardPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading$ = this.store.select(selectAdminLoading);
  readonly totalUsers$ = this.store.select(selectTotalUsers);
  readonly totalOrders$ = this.store.select(selectTotalOrders);
  readonly totalRevenue$ = this.store.select(selectTotalRevenue);
  readonly topProducts$ = this.store.select(selectTopProducts);
  readonly recentOrders$ = this.store.select(selectRecentOrders);

  readonly topProductsColumns = ['name', 'sold', 'revenue'];
  readonly recentOrdersColumns = ['id', 'user', 'total', 'status', 'createdAt'];

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadAdminStats());
  }
}