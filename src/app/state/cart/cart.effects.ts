import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, catchError, of, withLatestFrom, switchMap } from 'rxjs';
import * as CartActions from './cart.actions';
import { selectCartState, selectCartItems } from './cart.selectors';
import { ShopApiService } from '../../services/shop-api.service';

const STORAGE_KEY = 'myshop_cart';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ShopApiService);

  // Sauvegarder le panier dans localStorage après chaque modification
  saveCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addItem,
          CartActions.removeItem,
          CartActions.updateQuantity,
          CartActions.clearCart
        ),
        withLatestFrom(this.store.select(selectCartItems)),
        tap(([, items]) => {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );

  // Valider le panier via l'API
  validateCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.validateCart),
      withLatestFrom(this.store.select(selectCartState)),
      switchMap(([, cartState]) =>
        this.api.validateCart(cartState.items).pipe(
          map((response) =>
            CartActions.validateCartSuccess({
              itemsTotal: response.itemsTotal,
              discount: response.discount,
              shipping: response.shipping,
              taxes: response.taxes,
              grandTotal: response.grandTotal,
            })
          ),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Cart validation failed';
            return of(CartActions.validateCartFailure({ error: message }));
          })
        )
      )
    )
  );
}

// Helper function pour charger le panier depuis localStorage
// À appeler depuis app.config.ts ou un APP_INITIALIZER
export function loadCartFromLocalStorage(): CartActions.CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
}