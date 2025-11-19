import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  ShopApiService,
  ProductRatingResponse,
} from '../../services/shop-api.service';

@Component({
  standalone: true,
  selector: 'app-product-rating-page',
  templateUrl: './product-rating-page.html',
  styleUrl: './product-rating-page.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class ProductRatingPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ShopApiService);

  readonly form = this.fb.nonNullable.group({
    productId: [1, [Validators.required, Validators.min(1)]],
  });

  loading = false;
  error: string | null = null;
  rating: ProductRatingResponse | null = null;

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { productId } = this.form.getRawValue();

    this.loading = true;
    this.error = null;
    this.rating = null;

    this.api.getProductRating(productId).subscribe({
      next: (res) => {
        this.loading = false;
        this.rating = res;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.detail ??
          'Impossible de charger la note pour ce produit.';
      },
    });
  }
}
