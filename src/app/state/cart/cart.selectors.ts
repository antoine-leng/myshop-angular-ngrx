import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

// Sélecteurs de base
export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectCartTotal = createSelector(
  selectCartState,
  (state) => state.totalPrice
);

export const selectCartCount = createSelector(
  selectCartState,
  (state) => state.count
);

export const selectCartValidation = createSelector(
  selectCartState,
  (state) => state.validation
);

export const selectCartValidating = createSelector(
  selectCartState,
  (state) => state.validating
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error
);

// Sélecteur composé: est-ce que le panier est vide?
export const selectCartIsEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0
);

// Sélecteur composé: obtenir un item spécifique par product ID
export const selectCartItemByProductId = (productId: number) =>
  createSelector(selectCartItems, (items) =>
    items.find((item) => item.product.id === productId)
  );

// Sélecteur composé: total formaté
export const selectCartTotalFormatted = createSelector(
  selectCartTotal,
  (total) => total.toFixed(2)
);