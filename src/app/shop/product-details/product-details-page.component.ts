import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

import { ShopApiService, ProductDetailsResponse } from '../../services/shop-api.service';
import * as CartActions from '../../state/cart/cart.actions';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  styles: [
    `
      .product-details-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #2563eb;
        text-decoration: none;
        margin-bottom: 2rem;
        font-weight: 500;
        transition: color 0.2s;
      }

      .back-link:hover {
        color: #1d4ed8;
      }

      .product-card {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 3rem;
        padding: 2rem;
      }

      .product-image-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 6rem;
        font-weight: 700;
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      }

      .product-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .product-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }

      .product-price {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2563eb;
        margin: 0;
      }

      .product-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .product-description {
        color: #6b7280;
        line-height: 1.6;
      }

      .quantity-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .quantity-input {
        width: 100px;
      }

      .add-to-cart-btn {
        padding: 1rem 2rem;
        font-size: 1.125rem;
        font-weight: 600;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
      }

      .error-container {
        text-align: center;
        padding: 3rem;
      }

      .error-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #dc2626;
        margin: 0 0 1rem 0;
      }

      @media (max-width: 768px) {
        .product-card {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .product-image-container {
          max-width: 300px;
          margin: 0 auto;
        }
      }
    `,
  ],
  template: `
    <div class="product-details-page">
      <a routerLink="/shop/products" class="back-link">
        <mat-icon>arrow_back</mat-icon>
        Retour aux produits
      </a>

      <mat-card class="product-card" *ngIf="!loading() && product(); else loadingOrError">
        <div class="product-image-container">
          {{ product()!.name.charAt(0) }}
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product()!.name }}</h1>

          <div class="product-meta">
            <mat-chip-set>
              <mat-chip *ngIf="product()!.category">
                {{ product()!.category }}
              </mat-chip>
              <mat-chip *ngIf="product()!.stock !== undefined" [color]="getStockColor()">
                <mat-icon>inventory_2</mat-icon>
                {{ getStockLabel() }}
              </mat-chip>
            </mat-chip-set>
          </div>

          <p class="product-price">{{ product()!.price | number: '1.2-2' }} €</p>

          <p class="product-description">
            {{ product()!.description || 'Aucune description disponible.' }}
          </p>

          <div class="quantity-selector">
            <mat-form-field appearance="outline" class="quantity-input">
              <mat-label>Quantité</mat-label>
              <input
                matInput
                type="number"
                min="1"
                max="99"
                [(ngModel)]="quantity"
              />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              class="add-to-cart-btn"
              (click)="addToCart()"
              [disabled]="!canAddToCart()"
            >
              <mat-icon>shopping_cart</mat-icon>
              Ajouter au panier
            </button>
          </div>
        </div>
      </mat-card>

      <ng-template #loadingOrError>
        <div class="loading-container" *ngIf="loading()">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        </div>

        <div class="error-container" *ngIf="error()">
          <h2 class="error-title">Erreur</h2>
          <p>{{ error() }}</p>
          <button mat-raised-button color="primary" routerLink="/shop/products">
            Retour aux produits
          </button>
        </div>
      </ng-template>
    </div>
  `,
})
export class ProductDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ShopApiService);
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  readonly product = signal<ProductDetailsResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  quantity = 1;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
    } else {
      this.error.set('ID de produit invalide');
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getProductDetails(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.detail || 'Impossible de charger le produit');
        this.loading.set(false);
      },
    });
  }

  addToCart(): void {
    const prod = this.product();
    if (!prod || this.quantity < 1) return;

    this.store.dispatch(
      CartActions.addItem({
        product: prod,
        quantity: this.quantity,
      })
    );

    this.toast.success(`${prod.name} ajouté au panier (x${this.quantity})`);
    this.quantity = 1;
  }

  canAddToCart(): boolean {
    const prod = this.product();
    if (!prod) return false;
    if (prod.stock !== undefined && prod.stock < this.quantity) return false;
    return this.quantity > 0;
  }

  getStockLabel(): string {
    const stock = this.product()?.stock;
    if (stock === undefined) return 'Stock inconnu';
    if (stock === 0) return 'Rupture de stock';
    if (stock < 10) return `Plus que ${stock} en stock`;
    return 'En stock';
  }

  getStockColor(): string {
    const stock = this.product()?.stock;
    if (stock === undefined) return '';
    if (stock === 0) return 'warn';
    if (stock < 10) return 'accent';
    return 'primary';
  }
}