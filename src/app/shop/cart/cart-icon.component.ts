import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { selectCartCount } from '../../state/cart/cart.selectors';

@Component({
  standalone: true,
  selector: 'app-cart-icon',
  imports: [CommonModule, RouterLink, MatIconModule, MatBadgeModule, MatButtonModule],
  styles: [
    `
      .cart-button {
        position: relative;
        transition: transform 0.2s;
      }

      .cart-button:hover {
        transform: scale(1.05);
      }

      .cart-button:active {
        transform: scale(0.95);
      }

      ::ng-deep .mat-badge-content {
        background-color: #ef4444;
        color: white;
        font-weight: 600;
        font-size: 0.75rem;
      }
    `,
  ],
  template: `
    <button
      mat-icon-button
      class="cart-button"
      routerLink="/shop/cart"
      [matBadge]="cartCount$ | async"
      [matBadgeHidden]="(cartCount$ | async) === 0"
      matBadgeColor="warn"
      matBadgeSize="small"
      aria-label="Voir le panier"
    >
      <mat-icon>shopping_cart</mat-icon>
    </button>
  `,
})
export class CartIconComponent {
  private readonly store = inject(Store);
  readonly cartCount$ = this.store.select(selectCartCount);
}