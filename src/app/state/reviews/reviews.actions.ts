import { createAction, props } from '@ngrx/store';

export interface Review {
  id: string;
  productId: number;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const loadReviews = createAction(
  '[Reviews] Load Reviews',
  props<{ productId: number }>()
);

export const loadReviewsSuccess = createAction(
  '[Reviews] Load Reviews Success',
  props<{ productId: number; reviews: Review[] }>()
);

export const loadReviewsFailure = createAction(
  '[Reviews] Load Reviews Failure',
  props<{ error: string }>()
);

export const submitReview = createAction(
  '[Reviews] Submit Review',
  props<{ productId: number; rating: number; comment: string }>()
);

export const submitReviewSuccess = createAction(
  '[Reviews] Submit Review Success',
  props<{ review: Review }>()
);

export const submitReviewFailure = createAction(
  '[Reviews] Submit Review Failure',
  props<{ error: string }>()
);