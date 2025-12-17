import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, catchError, of, withLatestFrom, switchMap } from 'rxjs';
import * as WishlistActions from './wishlist.actions';
import { selectWishlistProductIds } from './wishlist.selectors';
import { ShopApiService } from '../../services/shop-api.service';

const STORAGE_KEY = 'myshop_wishlist';

@Injectable()
export class WishlistEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(ShopApiService);

  // Sauvegarder la wishlist dans localStorage
  saveWishlist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WishlistActions.addToWishlist,
          WishlistActions.removeFromWishlist,
          WishlistActions.toggleWishlist
        ),
        withLatestFrom(this.store.select(selectWishlistProductIds)),
        tap(([, productIds]) => {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
          } catch (error) {
            console.error('Failed to save wishlist to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );

  // Synchroniser avec le serveur (optionnel)
  syncWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WishlistActions.syncWishlistToServer),
      withLatestFrom(this.store.select(selectWishlistProductIds)),
      switchMap(([, productIds]) =>
        this.api.syncWishlist(productIds).pipe(
          map((response) =>
            WishlistActions.syncWishlistSuccess({ productIds: response.productIds })
          ),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Wishlist sync failed';
            return of(WishlistActions.syncWishlistFailure({ error: message }));
          })
        )
      )
    )
  );
}

// Helper function pour charger la wishlist depuis localStorage
export function loadWishlistFromLocalStorage(): number[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load wishlist from localStorage:', error);
  }
  return [];
}