import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { cartReducer } from './state/cart/cart.reducer';

import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';
import { CartEffects, loadCartFromLocalStorage } from './state/cart/cart.effects';
import * as CartActions from './state/cart/cart.actions';

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),

    // NgRx Store avec les 3 slices
    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
    }),

    // Effects
    provideEffects([AuthEffects, ProductsEffects, CartEffects]),

    // Initialisation du panier depuis localStorage
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCart,
      deps: [Store],
      multi: true,
    },

    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};