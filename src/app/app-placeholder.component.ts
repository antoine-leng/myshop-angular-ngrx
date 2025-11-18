import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h2 class="text-2xl font-semibold">App Shop — Placeholder</h2>
      <p class="text-gray-600">
        Ici viendra l’UI cohérente (login, liste produits, avis...).
      </p>

      <nav class="flex flex-wrap gap-3">
        <!-- Liens demandés par l'exo -->
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

        <!-- Bouton déjà présent : zone de tests -->
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
export class AppPlaceholderComponent {}
