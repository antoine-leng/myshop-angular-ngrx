import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import * as ProductsActions from '../../state/products/products.actions';
import {
  selectProducts,
  selectProductsCount,
  selectProductsLoading,
  selectProductsError,
} from '../../state/products/products.selectors';

@Component({
  standalone: true,
  selector: 'app-products-page',
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
})

export class ProductsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  readonly displayedColumns = ['id', 'name', 'price', 'created_at'];

  readonly products$ = this.store.select(selectProducts);
  readonly totalCount$ = this.store.select(selectProductsCount);
  readonly loading$ = this.store.select(selectProductsLoading);
  readonly error$ = this.store.select(selectProductsError);
  readonly productsDataSource$ = this.products$.pipe(
    map((items) => items ?? []),
  );

  readonly filtersForm = this.fb.nonNullable.group({
    page: 1,
    pageSize: 10,
    minRating: 0,
    ordering: '',
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const { page, pageSize, minRating, ordering } =
      this.filtersForm.getRawValue();

    this.store.dispatch(
      ProductsActions.loadProducts({
        page,
        pageSize,
        minRating: minRating || undefined,
        ordering: ordering || undefined,
      }),
    );
  }

  onApplyFilters() {
    this.filtersForm.patchValue({ page: 1 }, { emitEvent: false });
    this.loadProducts();
  }
}
