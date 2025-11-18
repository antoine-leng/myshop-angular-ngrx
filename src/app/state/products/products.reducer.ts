import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { Product, ProductsQuery } from './products.actions';

export interface ProductsState {
  items: Product[];
  count: number;
  loading: boolean;
  error: string | null;
  lastQuery: ProductsQuery | null;
}

export const initialProductsState: ProductsState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
  lastQuery: null,
};

export const productsReducer = createReducer(
  initialProductsState,

  on(ProductsActions.loadProducts, (state, query) => ({
    ...state,
    loading: true,
    error: null,
    lastQuery: query,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    items: data.results,
    count: data.count,
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
