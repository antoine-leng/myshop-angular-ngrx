import { createReducer, on } from '@ngrx/store';
import * as WishlistActions from './wishlist.actions';

export interface WishlistState {
  productIds: number[];
  syncing: boolean;
  error: string | null;
}

export const initialWishlistState: WishlistState = {
  productIds: [],
  syncing: false,
  error: null,
};

export const wishlistReducer = createReducer(
  initialWishlistState,

  on(WishlistActions.addToWishlist, (state, { productId }) => ({
    ...state,
    productIds: state.productIds.includes(productId)
      ? state.productIds
      : [...state.productIds, productId],
  })),

  on(WishlistActions.removeFromWishlist, (state, { productId }) => ({
    ...state,
    productIds: state.productIds.filter((id) => id !== productId),
  })),

  on(WishlistActions.toggleWishlist, (state, { productId }) => ({
    ...state,
    productIds: state.productIds.includes(productId)
      ? state.productIds.filter((id) => id !== productId)
      : [...state.productIds, productId],
  })),

  on(WishlistActions.loadWishlistFromStorage, (state, { productIds }) => ({
    ...state,
    productIds,
  })),

  on(WishlistActions.syncWishlistToServer, (state) => ({
    ...state,
    syncing: true,
    error: null,
  })),

  on(WishlistActions.syncWishlistSuccess, (state, { productIds }) => ({
    ...state,
    syncing: false,
    productIds,
  })),

  on(WishlistActions.syncWishlistFailure, (state, { error }) => ({
    ...state,
    syncing: false,
    error,
  }))
);