import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as ProductsActions from './products.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ShopApiService);

  readonly loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap((query) =>
        this.api.getProducts(query).pipe(
          map((data) => ProductsActions.loadProductsSuccess({ data })),
          catchError((error) => {
            const message =
              error?.error?.detail ?? 'Failed to load products.';
            return of(
              ProductsActions.loadProductsFailure({ error: message }),
            );
          }),
        ),
      ),
    ),
  );
}
