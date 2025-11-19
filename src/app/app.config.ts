import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { authReducer } from './state/auth/auth.reducer';
import { productsReducer } from './state/products/products.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { ProductsEffects } from './state/products/products.effects';

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideStore({
      auth: authReducer,
      products: productsReducer,
    }),
    provideEffects([AuthEffects, ProductsEffects]),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
