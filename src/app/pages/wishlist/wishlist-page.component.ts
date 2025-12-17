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
import { MatIconModule } from '@angular/material/icon';

import * as WishlistActions from '../../state/wishlist/wishlist.actions';
import * as CartActions from '../../state/cart/cart.actions';
import {
  selectWishlistProducts,
  selectWishlistCount,
} from '../../state/wishlist/wishlist.selectors';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-wishlist-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .wishlist-page {
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
        margin: 0;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .product-card {
        position: relative;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .product-image {
        width: 100%;
        aspect-ratio: 1;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 3rem;
        font-weight: 700;
      }

      .remove-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: white;
        border-radius: 50%;
      }

      .product-info {
        padding: 1rem;
      }

      .product-name {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      }

      .product-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2563eb;
        margin: 0.5rem 0;
      }

      .product-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      @media (max-width: 768px) {
        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
      }
    `,
  ],
  template: `
    <div class="wishlist-page">
      <div class="page-header">
        <h1 class="page-title">
          Ma Wishlist ({{ count$ | async }} article(s))
        </h1>
        <button mat-stroked-button routerLink="/shop/products">
          <mat-icon>arrow_back</mat-icon>
          Retour aux produits
        </button>
      </div>

      <div
        *ngIf="(products$ | async)?.length === 0"
        class="empty-state"
      >
        <mat-icon
          style="font-size: 4rem; width: 4rem; height: 4rem; color: #d1d5db;"
          >favorite_border</mat-icon
        >
        <h2>Votre wishlist est vide</h2>
        <p>Ajoutez des produits à votre wishlist pour les retrouver facilement</p>
        <button mat-raised-button color="primary" routerLink="/shop/products">
          Découvrir nos produits
        </button>
      </div>

      <div class="products-grid">
        <mat-card
          class="product-card"
          *ngFor="let product of products$ | async; trackBy: trackByProductId"
        >
          <button
            mat-icon-button
            class="remove-btn"
            (click)="removeFromWishlist(product.id)"
            color="warn"
          >
            <mat-icon>close</mat-icon>
          </button>

          <div class="product-image">{{ product.name.charAt(0) }}</div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ product.price | number : '1.2-2' }} €</p>

            <div class="product-actions">
              <button
                mat-raised-button
                color="primary"
                class="flex-1"
                (click)="addToCart(product)"
              >
                <mat-icon>shopping_cart</mat-icon>
                Ajouter au panier
              </button>

              <button
                mat-button
                [routerLink]="['/shop/products', product.id]"
              >
                Voir
              </button>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
})
export class WishlistPage implements OnInit {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  readonly products$ = this.store.select(selectWishlistProducts);
  readonly count$ = this.store.select(selectWishlistCount);

  ngOnInit(): void {
    // Les produits de la wishlist sont chargés via le selector composé
    // qui combine les IDs de la wishlist avec les produits du store
  }

  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  removeFromWishlist(productId: number): void {
    this.store.dispatch(WishlistActions.removeFromWishlist({ productId }));
    this.toast.success('Produit retiré de la wishlist');
  }

  addToCart(product: any): void {
    this.store.dispatch(CartActions.addItem({ product, quantity: 1 }));
    this.toast.success(`${product.name} ajouté au panier`);
  }
}
