import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import { selectAccessToken } from './state/auth/auth.selectors';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <header class="space-y-2">
        <h2 class="text-2xl font-semibold">App Shop — Placeholder</h2>
        <p class="text-gray-600">
          Ici viendra l’UI cohérente (login, liste produits, avis...).
        </p>

        <!-- mini tableau de bord -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">État de la session :</span>

          <div
            class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
            [ngClass]="(isLoggedIn$ | async) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
          >
            <ng-container *ngIf="isLoggedIn$ | async; else loggedOutTpl">
              Logged in
            </ng-container>
            <ng-template #loggedOutTpl>Logged out</ng-template>
          </div>
        </div>
      </header>

      <nav class="flex flex-wrap gap-3">
        <button
          type="button"
          routerLink="/login"
          class="rounded border px-3 py-2 hover:bg-gray-50"
        >
          Login
        </button>

        <button
          type="button"
          routerLink="/shop/products"
          class="rounded border px-3 py-2 hover:bg-gray-50"
        >
          Products
        </button>

        <button
          type="button"
          routerLink="/shop/rating"
          class="rounded border px-3 py-2 hover:bg-gray-50"
        >
          Rating
        </button>

        <button
          type="button"
          routerLink="/dev"
          class="rounded border px-3 py-2 hover:bg-gray-50"
        >
          → Aller à la zone de tests
        </button>
      </nav>
    </section>
  `,
})
export class AppPlaceholderComponent {
  private readonly store = inject(Store);

  // true si un access token est présent dans le slice auth
  readonly isLoggedIn$ = this.store
    .select(selectAccessToken)
    .pipe(map((token) => !!token));
}
