import { createAction, props } from '@ngrx/store';

export interface ProductsQuery {
  page: number;
  pageSize: number;
  minRating?: number | null;
  ordering?: string | null;
}

export interface ProductsResponse {
  count: number;
  results: Product[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  // on pourra ajouter d'autres champs si nécessaire
}

export const loadProducts = createAction(
  '[Products] Load Products',
  props<ProductsQuery>(),
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ data: ProductsResponse }>(),
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>(),
);
