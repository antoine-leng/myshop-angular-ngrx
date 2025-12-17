import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProductsQuery,
  ProductsResponse,
  Product,
} from '../state/products/products.actions';
import { CartItem } from '../state/cart/cart.actions';

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

export interface ProductRatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

// Nouveaux types pour l'exercice 2
export interface ProductDetailsResponse extends Product {
  description?: string;
  stock?: number;
  category?: string;
  images?: string[];
}

export interface CartValidationResponse {
  itemsTotal: number;
  discount: number;
  shipping: number;
  taxes: number;
  grandTotal: number;
}

export interface OrderRequest {
  items: CartItem[];
  address: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface OrderResponse {
  orderId: string;
  status: string;
  total: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  constructor(private http: HttpClient) {}

  // Auth endpoints (existants)
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/token/', {
      username,
      password,
    });
  }

  refreshToken(refresh: string): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>('/api/auth/token/refresh/', {
      refresh,
    });
  }

  // Products endpoints (existants)
  getProducts(query: ProductsQuery): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('page_size', query.pageSize);

    if (query.minRating != null) {
      params = params.set('min_rating', query.minRating);
    }
    if (query.ordering) {
      params = params.set('ordering', query.ordering);
    }

    return this.http.get<ProductsResponse>('/api/products/', { params });
  }

  getProductRating(id: number): Observable<ProductRatingResponse> {
    return this.http.get<ProductRatingResponse>(
      `/api/products/${id}/rating/`
    );
  }

  // Nouveaux endpoints pour l'exercice 2
  getProductDetails(id: number): Observable<ProductDetailsResponse> {
    return this.http.get<ProductDetailsResponse>(`/api/products/${id}/`);
  }

  validateCart(items: CartItem[]): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>('/api/cart/validate/', {
      items,
    });
  }

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/api/order/', order);
  }
}