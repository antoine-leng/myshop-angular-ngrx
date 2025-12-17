import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WishlistState } from './wishlist.reducer';
import { selectProducts } from '../products/products.selectors';

export const selectWishlistState = createFeatureSelector<WishlistState>('wishlist');

export const selectWishlistProductIds = createSelector(
  selectWishlistState,
  (state) => state.productIds
);

export const selectWishlistCount = createSelector(
  selectWishlistProductIds,
  (ids) => ids.length
);

export const selectWishlistSyncing = createSelector(
  selectWishlistState,
  (state) => state.syncing
);

export const selectWishlistError = createSelector(
  selectWishlistState,
  (state) => state.error
);

// Selector composé: vérifier si un produit est dans la wishlist
export const selectIsInWishlist = (productId: number) =>
  createSelector(
    selectWishlistProductIds,
    (ids) => ids.includes(productId)
  );

// Selector composé: obtenir les produits de la wishlist avec leurs détails
export const selectWishlistProducts = createSelector(
  selectProducts,
  selectWishlistProductIds,
  (products, wishlistIds) => {
    if (!products) return [];
    return products.filter((p) => wishlistIds.includes(p.id));
  }
);