import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import * as CartActions from '../../state/cart/cart.actions';
import {
  selectCartItems,
  selectCartIsEmpty,
  selectCartTotal,
} from '../../state/cart/cart.selectors';
import { CartItemComponent } from '../../ui/cart-item/cart-item.component';
import { CartSummaryComponent } from '../../ui/cart-summary/cart-summary.component';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CartItemComponent,
    CartSummaryComponent,
  ],
  styles: [
    `
      .cart-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
      }

      .cart-content {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 2rem;
      }

      .cart-items {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .empty-cart {
        text-align: center;
        padding: 4rem 2rem;
      }

      .empty-cart-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: #d1d5db;
        margin-bottom: 1rem;
      }

      .empty-cart-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      .empty-cart-text {
        color: #6b7280;
        margin: 0 0 2rem 0;
      }

      @media (max-width: 768px) {
        .cart-content {
          grid-template-columns: 1fr;
        }

        .page-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
      }
    `,
  ],
  template: `
    <div class="cart-page">
      <div class="page-header">
        <h1 class="page-title">Mon panier</h1>
        <button
          mat-stroked-button
          routerLink="/shop/products"
          color="primary"
        >
          <mat-icon>arrow_back</mat-icon>
          Continuer mes achats
        </button>
      </div>

      <div *ngIf="isEmpty$ | async; else cartContent" class="empty-cart">
        <mat-icon class="empty-cart-icon">shopping_cart</mat-icon>
        <h2 class="empty-cart-title">Votre panier est vide</h2>
        <p class="empty-cart-text">
          Découvrez nos produits et ajoutez-en à votre panier
        </p>
        <button
          mat-raised-button
          color="primary"
          routerLink="/shop/products"
        >
          Voir les produits
        </button>
      </div>

      <ng-template #cartContent>
        <div class="cart-content">
          <div class="cart-items">
            <app-cart-item
              *ngFor="let item of items$ | async; trackBy: trackByProductId"
              [product]="item.product"
              [quantity]="item.quantity"
              (quantityChange)="onQuantityChange(item.product.id, $event)"
              (remove)="onRemoveItem(item.product.id)"
            ></app-cart-item>
          </div>

          <app-cart-summary
            [summary]="{
              itemsTotal: (total$ | async) || 0,
              grandTotal: (total$ | async) || 0
            }"
            [loading]="false"
            checkoutLabel="Passer la commande"
            (checkout)="onCheckout()"
          ></app-cart-summary>
        </div>
      </ng-template>
    </div>
  `,
})
export class CartPage implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly items$ = this.store.select(selectCartItems);
  readonly isEmpty$ = this.store.select(selectCartIsEmpty);
  readonly total$ = this.store.select(selectCartTotal);

  ngOnInit(): void {
    // Rien de spécial à initialiser ici
  }

  onQuantityChange(productId: number, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  onRemoveItem(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
    this.toast.success('Produit retiré du panier');
  }

  onCheckout(): void {
    this.router.navigate(['/shop/checkout']);
  }

  trackByProductId(index: number, item: any): number {
    return item.product.id;
  }
}