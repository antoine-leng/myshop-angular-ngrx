import { createAction, props } from '@ngrx/store';

export const addToWishlist = createAction(
  '[Wishlist] Add To Wishlist',
  props<{ productId: number }>()
);

export const removeFromWishlist = createAction(
  '[Wishlist] Remove From Wishlist',
  props<{ productId: number }>()
);

export const toggleWishlist = createAction(
  '[Wishlist] Toggle Wishlist',
  props<{ productId: number }>()
);

export const loadWishlistFromStorage = createAction(
  '[Wishlist] Load From Storage',
  props<{ productIds: number[] }>()
);

export const syncWishlistToServer = createAction('[Wishlist] Sync To Server');

export const syncWishlistSuccess = createAction(
  '[Wishlist] Sync Success',
  props<{ productIds: number[] }>()
);

export const syncWishlistFailure = createAction(
  '[Wishlist] Sync Failure',
  props<{ error: string }>()
);
