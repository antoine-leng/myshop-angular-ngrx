import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import * as AdminActions from './admin.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class AdminEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);

  readonly loadAdminStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdminStats),
      switchMap(() =>
        this.api.getAdminStats().pipe(
          map((stats) => AdminActions.loadAdminStatsSuccess({ stats })),
          catchError((error) => {
            const message = error?.error?.detail ?? 'Failed to load admin stats';
            return of(AdminActions.loadAdminStatsFailure({ error: message }));
          })
        )
      )
    )
  );
}