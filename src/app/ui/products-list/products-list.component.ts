import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  created_at: string;
  avgRating?: number | null;
}

@Component({
  standalone: true,
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  imports: [CommonModule, ProductCardComponent],
})
export class ProductsListComponent {
  @Input() products: ProductItem[] = [];
}
