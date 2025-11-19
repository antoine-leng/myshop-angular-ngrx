import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.api.login(username, password).pipe(
          map(({ access, refresh }) =>
            AuthActions.loginSuccess({ access, refresh }),
          ),
          catchError((error) => {
            const message =
              error?.error?.detail ?? 'Login failed. Please try again.';
            return of(AuthActions.loginFailure({ error: message }));
          }),
        ),
      ),
    ),
  );
}
