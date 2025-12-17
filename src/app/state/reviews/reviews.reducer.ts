import { createReducer, on } from '@ngrx/store';
import * as ReviewsActions from './reviews.actions';
import { Review } from './reviews.actions';

export interface ReviewsState {
  reviewsByProduct: { [productId: number]: Review[] };
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

export const initialReviewsState: ReviewsState = {
  reviewsByProduct: {},
  loading: false,
  submitting: false,
  error: null,
};

export const reviewsReducer = createReducer(
  initialReviewsState,

  on(ReviewsActions.loadReviews, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ReviewsActions.loadReviewsSuccess, (state, { productId, reviews }) => ({
    ...state,
    loading: false,
    reviewsByProduct: {
      ...state.reviewsByProduct,
      [productId]: reviews,
    },
  })),

  on(ReviewsActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ReviewsActions.submitReview, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(ReviewsActions.submitReviewSuccess, (state, { review }) => ({
    ...state,
    submitting: false,
    reviewsByProduct: {
      ...state.reviewsByProduct,
      [review.productId]: [
        ...(state.reviewsByProduct[review.productId] || []),
        review,
      ],
    },
  })),

  on(ReviewsActions.submitReviewFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  }))
);