import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import * as WishlistActions from '../../state/wishlist/wishlist.actions';
import { selectIsInWishlist } from '../../state/wishlist/wishlist.selectors';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-wishlist-button',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .wishlist-btn {
        transition: transform 0.2s;
      }

      .wishlist-btn:active {
        transform: scale(0.9);
      }

      .wishlist-btn.in-wishlist {
        color: #ef4444;
      }

      @keyframes heartBeat {
        0%, 100% {
          transform: scale(1);
        }
        25% {
          transform: scale(1.3);
        }
        50% {
          transform: scale(1);
        }
      }

      .wishlist-btn.animate {
        animation: heartBeat 0.5s ease;
      }
    `,
  ],
  template: `
    <button
      mat-icon-button
      class="wishlist-btn"
      [class.in-wishlist]="isInWishlist$ | async"
      [class.animate]="animating"
      [matTooltip]="
        (isInWishlist$ | async)
          ? 'Retirer de la wishlist'
          : 'Ajouter à la wishlist'
      "
      (click)="toggle($event)"
    >
      <mat-icon>{{
        (isInWishlist$ | async) ? 'favorite' : 'favorite_border'
      }}</mat-icon>
    </button>
  `,
})
export class WishlistButtonComponent {
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  @Input() productId!: number;
  @Input() productName?: string;

  animating = false;

  get isInWishlist$() {
    return this.store.select(selectIsInWishlist(this.productId));
  }

  toggle(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.store.dispatch(
      WishlistActions.toggleWishlist({ productId: this.productId })
    );

    // Animation
    this.animating = true;
    setTimeout(() => (this.animating = false), 500);

    // Toast
    let isCurrentlyInWishlist = false;
    this.isInWishlist$.subscribe((val) => (isCurrentlyInWishlist = val)).unsubscribe();

    if (!isCurrentlyInWishlist) {
      this.toast.success(
        `${this.productName || 'Produit'} ajouté à la wishlist`
      );
    } else {
      this.toast.info(
        `${this.productName || 'Produit'} retiré de la wishlist`
      );
    }
  }
}