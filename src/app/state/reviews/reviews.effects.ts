import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import * as ReviewsActions from './reviews.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);

  readonly loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.loadReviews),
      switchMap(({ productId }) =>
        this.api.getProductReviews(productId).pipe(
          map((reviews) =>
            ReviewsActions.loadReviewsSuccess({ productId, reviews })
          ),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to load reviews';
            return of(ReviewsActions.loadReviewsFailure({ error: message }));
          })
        )
      )
    )
  );

  readonly submitReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewsActions.submitReview),
      switchMap(({ productId, rating, comment }) =>
        this.api.submitProductReview(productId, rating, comment).pipe(
          map((review) => ReviewsActions.submitReviewSuccess({ review })),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to submit review';
            return of(ReviewsActions.submitReviewFailure({ error: message }));
          })
        )
      )
    )
  );
}