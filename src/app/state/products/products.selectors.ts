import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState =
  createFeatureSelector<ProductsState>('products');

export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.items,
);

export const selectProductsCount = createSelector(
  selectProductsState,
  (state) => state.count,
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading,
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error,
);
