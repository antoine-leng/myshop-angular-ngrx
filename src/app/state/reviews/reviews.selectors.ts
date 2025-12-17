import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewsState } from './reviews.reducer';

export const selectReviewsState = createFeatureSelector<ReviewsState>('reviews');

export const selectReviewsByProduct = (productId: number) =>
  createSelector(
    selectReviewsState,
    (state) => state.reviewsByProduct[productId] || []
  );

export const selectReviewsLoading = createSelector(
  selectReviewsState,
  (state) => state.loading
);

export const selectReviewsSubmitting = createSelector(
  selectReviewsState,
  (state) => state.submitting
);

export const selectReviewsError = createSelector(
  selectReviewsState,
  (state) => state.error
);

// Selector composé: note moyenne pour un produit
export const selectAverageRating = (productId: number) =>
  createSelector(selectReviewsByProduct(productId), (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  });

// Selector composé: nombre d'avis pour un produit
export const selectReviewCount = (productId: number) =>
  createSelector(selectReviewsByProduct(productId), (reviews) => reviews.length);