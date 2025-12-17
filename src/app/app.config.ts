import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { cartReducer } from './state/cart/cart.reducer';
import { userReducer } from './state/user/user.reducer';
import { wishlistReducer } from './state/wishlist/wishlist.reducer';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { adminReducer } from './state/admin/admin.reducer';

import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';
import { CartEffects, loadCartFromLocalStorage } from './state/cart/cart.effects';
import { UserEffects } from './state/user/user.effects';
import { WishlistEffects, loadWishlistFromLocalStorage } from './state/wishlist/wishlist.effects';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { AdminEffects } from './state/admin/admin.effects';

import * as CartActions from './state/cart/cart.actions';
import * as WishlistActions from './state/wishlist/wishlist.actions';

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { routes } from './app.routes';

// Initializer pour restaurer le panier depuis localStorage
export function initializeCart(store: Store) {
  return () => {
    const items = loadCartFromLocalStorage();
    if (items.length > 0) {
      store.dispatch(CartActions.loadCartFromStorage({ items }));
    }
  };
}

// Initializer pour restaurer la wishlist depuis localStorage
export function initializeWishlist(store: Store) {
  return () => {
    const productIds = loadWishlistFromLocalStorage();
    if (productIds.length > 0) {
      store.dispatch(WishlistActions.loadWishlistFromStorage({ productIds }));
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),

    // NgRx Store avec tous les slices
    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      user: userReducer,
      wishlist: wishlistReducer,
      reviews: reviewsReducer,
      admin: adminReducer,
    }),

    // Effects
    provideEffects([
      AuthEffects,
      ProductsEffects,
      CartEffects,
      UserEffects,
      WishlistEffects,
      ReviewsEffects,
      AdminEffects,
    ]),

    // Initializations depuis localStorage
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCart,
      deps: [Store],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeWishlist,
      deps: [Store],
      multi: true,
    },

    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};