import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  imports: [CommonModule, MatCardModule],
})
export class ProductCardComponent {
  @Input() name = '';
  @Input() price = 0;
  @Input() createdAt: string | Date = '';
  @Input() avgRating: number | null = null;
}
