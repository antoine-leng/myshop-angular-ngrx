import { createAction, props } from '@ngrx/store';
import { Product } from '../products/products.actions';

export interface CartItem {
  product: Product;
  quantity: number;
}

// Actions pour ajouter/modifier/supprimer des items
export const addItem = createAction(
  '[Cart] Add Item',
  props<{ product: Product; quantity: number }>()
);

export const removeItem = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

// Actions pour la restauration depuis localStorage
export const loadCartFromStorage = createAction(
  '[Cart] Load From Storage',
  props<{ items: CartItem[] }>()
);

// Actions pour la validation du panier
export const validateCart = createAction('[Cart] Validate Cart');

export const validateCartSuccess = createAction(
  '[Cart] Validate Cart Success',
  props<{
    itemsTotal: number;
    discount: number;
    shipping: number;
    taxes: number;
    grandTotal: number;
    appliedPromos?: string[];  
  }>()
);

export const validateCartFailure = createAction(
  '[Cart] Validate Cart Failure',
  props<{ error: string }>()
);