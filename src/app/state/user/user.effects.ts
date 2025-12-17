import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import * as UserActions from './user.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);

  readonly loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadProfile),
      switchMap(() =>
        this.api.getUserProfile().pipe(
          map((profile) => UserActions.loadProfileSuccess({ profile })),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to load profile';
            return of(UserActions.loadProfileFailure({ error: message }));
          })
        )
      )
    )
  );

  readonly updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfile),
      switchMap(({ updates }) =>
        this.api.updateUserProfile(updates).pipe(
          map((profile) => UserActions.updateProfileSuccess({ profile })),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to update profile';
            return of(UserActions.updateProfileFailure({ error: message }));
          })
        )
      )
    )
  );

  readonly loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadOrders),
      switchMap(() =>
        this.api.getUserOrders().pipe(
          map((orders) => UserActions.loadOrdersSuccess({ orders })),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to load orders';
            return of(UserActions.loadOrdersFailure({ error: message }));
          })
        )
      )
    )
  );

  readonly loadOrderDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadOrderDetails),
      switchMap(({ orderId }) =>
        this.api.getOrderDetails(orderId).pipe(
          map((order) => UserActions.loadOrderDetailsSuccess({ order })),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to load order details';
            return of(UserActions.loadOrderDetailsFailure({ error: message }));
          })
        )
      )
    )
  );
}