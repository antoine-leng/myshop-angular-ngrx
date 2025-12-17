import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartValidation,
  selectCartValidating,
} from '../../state/cart/cart.selectors';
import * as CartActions from '../../state/cart/cart.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { ToastService } from '../../services/toast.service';
import { CartItemComponent } from '../../ui/cart-item/cart-item.component';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CartItemComponent,
  ],
  styles: [
    `
      .checkout-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 2rem 0;
        text-align: center;
      }

      .stepper-card {
        padding: 2rem;
      }

      .step-content {
        padding: 2rem 0;
      }

      .cart-summary-section {
        background: #f9fafb;
        border-radius: 8px;
        padding: 1.5rem;
        margin-top: 1.5rem;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        color: #6b7280;
      }

      .summary-row.total {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1f2937;
        border-top: 2px solid #e5e7eb;
        padding-top: 1rem;
        margin-top: 0.5rem;
      }

      .address-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 600px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .confirmation-section {
        text-align: center;
        padding: 3rem 1rem;
      }

      .success-icon {
        font-size: 5rem;
        width: 5rem;
        height: 5rem;
        color: #059669;
        margin-bottom: 1rem;
      }

      .confirmation-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 0.5rem 0;
      }

      .confirmation-subtitle {
        color: #6b7280;
        margin: 0 0 2rem 0;
      }

      .order-id {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 8px;
        padding: 1rem;
        font-family: monospace;
        font-size: 1.125rem;
        margin: 2rem 0;
        color: #059669;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      @media (max-width: 640px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
  template: `
    <div class="checkout-page">
      <h1 class="page-title">Finaliser ma commande</h1>

      <mat-card class="stepper-card">
        <mat-stepper [linear]="true" #stepper>
          <!-- Étape 1: Récapitulatif du panier -->
          <mat-step label="Récapitulatif">
            <div class="step-content">
              <h2>Votre panier ({{ cartCount$ | async }} articles)</h2>

              <div *ngFor="let item of cartItems$ | async">
                <app-cart-item
                  [product]="item.product"
                  [quantity]="item.quantity"
                  (quantityChange)="onQuantityChange(item.product.id, $event)"
                  (remove)="onRemoveItem(item.product.id)"
                ></app-cart-item>
              </div>

              <div class="cart-summary-section">
                <div class="summary-row">
                  <span>Sous-total</span>
                  <span>{{ (cartTotal$ | async) | number: '1.2-2' }} €</span>
                </div>
                <ng-container *ngIf="validation$ | async as validation">
                  <div class="summary-row" *ngIf="validation.discount > 0">
                    <span>Réduction</span>
                    <span>-{{ validation.discount | number: '1.2-2' }} €</span>
                  </div>
                  <div class="summary-row">
                    <span>Livraison</span>
                    <span *ngIf="validation.shipping === 0">Gratuite</span>
                    <span *ngIf="validation.shipping > 0">
                      {{ validation.shipping | number: '1.2-2' }} €
                    </span>
                  </div>
                  <div class="summary-row">
                    <span>TVA (20%)</span>
                    <span>{{ validation.taxes | number: '1.2-2' }} €</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total</span>
                    <span>{{ validation.grandTotal | number: '1.2-2' }} €</span>
                  </div>
                </ng-container>
              </div>

              <div style="margin-top: 2rem;">
                <button mat-raised-button color="primary" matStepperNext>
                  Continuer vers l'adresse
                </button>
                <button mat-button routerLink="/shop/cart" style="margin-left: 1rem;">
                  Modifier le panier
                </button>
              </div>
            </div>
          </mat-step>

          <!-- Étape 2: Adresse de livraison -->
          <mat-step [stepControl]="addressForm" label="Adresse">
            <div class="step-content">
              <h2>Adresse de livraison</h2>

              <form [formGroup]="addressForm" class="address-form">
                <mat-form-field appearance="outline">
                  <mat-label>Nom complet</mat-label>
                  <input matInput formControlName="fullName" />
                  <mat-error *ngIf="addressForm.controls.fullName.hasError('required')">
                    Le nom est requis
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Adresse</mat-label>
                  <input matInput formControlName="street" />
                  <mat-error *ngIf="addressForm.controls.street.hasError('required')">
                    L'adresse est requise
                  </mat-error>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Code postal</mat-label>
                    <input matInput formControlName="postalCode" />
                    <mat-error *ngIf="addressForm.controls.postalCode.hasError('required')">
                      Requis
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Ville</mat-label>
                    <input matInput formControlName="city" />
                    <mat-error *ngIf="addressForm.controls.city.hasError('required')">
                      Requis
                    </mat-error>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline">
                  <mat-label>Pays</mat-label>
                  <input matInput formControlName="country" />
                  <mat-error *ngIf="addressForm.controls.country.hasError('required')">
                    Le pays est requis
                  </mat-error>
                </mat-form-field>

                <div>
                  <button mat-button matStepperPrevious>Retour</button>
                  <button
                    mat-raised-button
                    color="primary"
                    matStepperNext
                    [disabled]="addressForm.invalid"
                    style="margin-left: 1rem;"
                  >
                    Valider et commander
                  </button>
                </div>
              </form>
            </div>
          </mat-step>

          <!-- Étape 3: Confirmation -->
          <mat-step label="Confirmation">
            <div class="step-content">
              <div class="confirmation-section" *ngIf="!submitting(); else submittingTpl">
                <mat-icon class="success-icon">check_circle</mat-icon>
                <h2 class="confirmation-title">Commande confirmée !</h2>
                <p class="confirmation-subtitle">
                  Merci pour votre commande. Vous allez recevoir un email de confirmation.
                </p>

                <div class="order-id" *ngIf="orderId()">
                  Numéro de commande: {{ orderId() }}
                </div>

                <div class="action-buttons">
                  <button mat-raised-button color="primary" routerLink="/shop/products">
                    Continuer mes achats
                  </button>
                  <button mat-stroked-button routerLink="/">
                    Retour à l'accueil
                  </button>
                </div>
              </div>

              <ng-template #submittingTpl>
                <div class="confirmation-section">
                  <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
                  <p style="margin-top: 1rem;">Traitement de votre commande...</p>
                </div>
              </ng-template>

              <div style="margin-top: 2rem;" *ngIf="!submitting() && !orderId()">
                <button mat-button matStepperPrevious>Retour</button>
                <button
                  mat-raised-button
                  color="primary"
                  (click)="submitOrder()"
                  style="margin-left: 1rem;"
                >
                  Confirmer la commande
                </button>
              </div>
            </div>
          </mat-step>
        </mat-stepper>
      </mat-card>
    </div>
  `,
})
export class CheckoutPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly api = inject(ShopApiService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly cartItems$ = this.store.select(selectCartItems);
  readonly cartTotal$ = this.store.select(selectCartTotal);
  readonly cartCount$ = this.store.select(selectCartCount);
  readonly validation$ = this.store.select(selectCartValidation);
  readonly validating$ = this.store.select(selectCartValidating);

  readonly submitting = signal(false);
  readonly orderId = signal<string | null>(null);

  readonly addressForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    street: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    country: ['France', Validators.required],
  });

  ngOnInit(): void {
    // Valider le panier pour obtenir les frais
    this.store.dispatch(CartActions.validateCart());
  }

  onQuantityChange(productId: number, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
    // Revalider après changement
    this.store.dispatch(CartActions.validateCart());
  }

  onRemoveItem(productId: number): void {
    this.store.dispatch(CartActions.removeItem({ productId }));
    this.toast.success('Produit retiré du panier');
    this.store.dispatch(CartActions.validateCart());
  }

  submitOrder(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    // Récupérer les items et l'adresse
    let items: any[] = [];
    this.cartItems$.subscribe((val) => (items = val)).unsubscribe();

    const address = this.addressForm.getRawValue();

    this.api.createOrder({ items, address }).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.orderId.set(response.orderId);
        this.toast.success('Commande validée avec succès !');
        
        // Vider le panier
        this.store.dispatch(CartActions.clearCart());
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error(err?.error?.detail || 'Erreur lors de la commande');
      },
    });
  }
}