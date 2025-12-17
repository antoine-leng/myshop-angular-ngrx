import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Product } from '../../state/products/products.actions';

@Component({
  standalone: true,
  selector: 'app-cart-item',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  styles: [
    `
      .cart-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.2s;
      }

      .cart-item:hover {
        background-color: #f9fafb;
      }

      .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1.5rem;
      }

      .product-info {
        flex: 1;
        min-width: 0;
      }

      .product-name {
        font-weight: 600;
        font-size: 1rem;
        margin: 0 0 0.25rem 0;
        color: #1f2937;
      }

      .product-price {
        color: #6b7280;
        font-size: 0.875rem;
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .quantity-input {
        width: 60px;
        text-align: center;
      }

      .subtotal {
        font-weight: 600;
        color: #2563eb;
        font-size: 1.125rem;
        min-width: 80px;
        text-align: right;
      }

      .remove-btn {
        color: #dc2626;
      }

      @media (max-width: 640px) {
        .cart-item {
          flex-direction: column;
          align-items: flex-start;
        }

        .subtotal {
          align-self: flex-end;
        }
      }
    `,
  ],
  template: `
    <div class="cart-item">
      <div class="product-image">
        {{ product.name.charAt(0) }}
      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-price">{{ product.price | number: '1.2-2' }} € / unité</p>
      </div>

      <div class="quantity-controls">
        <button
          mat-icon-button
          color="primary"
          (click)="onDecrement()"
          [disabled]="quantity <= 1"
        >
          <mat-icon>remove</mat-icon>
        </button>

        <mat-form-field appearance="outline" class="quantity-input">
          <input
            matInput
            type="number"
            min="1"
            max="99"
            [(ngModel)]="quantity"
            (ngModelChange)="onQuantityChange($event)"
          />
        </mat-form-field>

        <button mat-icon-button color="primary" (click)="onIncrement()">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <div class="subtotal">
        {{ (product.price * quantity) | number: '1.2-2' }} €
      </div>

      <button
        mat-icon-button
        class="remove-btn"
        (click)="onRemove()"
        aria-label="Supprimer du panier"
      >
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
})
export class CartItemComponent {
  @Input() product!: Product;
  @Input() quantity = 1;

  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  onQuantityChange(newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= 99) {
      this.quantityChange.emit(newQuantity);
    }
  }

  onIncrement() {
    if (this.quantity < 99) {
      this.quantityChange.emit(this.quantity + 1);
    }
  }

  onDecrement() {
    if (this.quantity > 1) {
      this.quantityChange.emit(this.quantity - 1);
    }
  }

  onRemove() {
    this.remove.emit();
  }
}