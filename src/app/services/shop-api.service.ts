import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProductsQuery,
  ProductsResponse,
  Product,
} from '../state/products/products.actions';
import { CartItem } from '../state/cart/cart.actions';
import { UserProfile, OrderSummary, OrderDetails } from '../state/user/user.actions';
import { Review } from '../state/reviews/reviews.actions';
import { AdminStats } from '../state/admin/admin.actions';

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

export interface ProductDetailsResponse extends Product {
  description?: string;
  stock?: number;
  lowStockThreshold?: number;
  category?: string;
  images?: string[];
}

export interface CartValidationResponse {
  itemsTotal: number;
  discount: number;
  shipping: number;
  taxes: number;
  grandTotal: number;
  appliedPromos?: string[];  
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
  promoCode?: string;  
}

export interface OrderResponse {
  orderId: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface WishlistSyncResponse {
  productIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  constructor(private http: HttpClient) {}

  // ========== Auth endpoints ==========
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

  // ========== Products endpoints ==========
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

  getProductDetails(id: number): Observable<ProductDetailsResponse> {
    return this.http.get<ProductDetailsResponse>(`/api/products/${id}/`);
  }

  // ========== Cart endpoints ==========
  validateCart(items: CartItem[], promoCode?: string): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>('/api/cart/validate/', {
      items,
      promoCode,  
    });
  }

  validateStock(items: CartItem[]): Observable<{ valid: boolean; message?: string }> {
    return this.http.post<{ valid: boolean; message?: string }>(
      '/api/cart/validate-stock/',
      { items }
    );
  }

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/api/order/', order);
  }

  // ========== User endpoints ==========
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/me/');
  }

  updateUserProfile(updates: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>('/api/me/', updates);
  }

  getUserOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>('/api/me/orders/');
  }

  getOrderDetails(orderId: string): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`/api/orders/${orderId}/`);
  }

  // ========== Wishlist endpoints ==========
  getWishlist(): Observable<{ productIds: number[] }> {
    return this.http.get<{ productIds: number[] }>('/api/me/wishlist/');
  }

  syncWishlist(productIds: number[]): Observable<WishlistSyncResponse> {
    return this.http.post<WishlistSyncResponse>('/api/me/wishlist/', {
      productIds,
    });
  }

  // ========== Reviews endpoints ==========
  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`/api/products/${productId}/reviews/`);
  }

  submitProductReview(
    productId: number,
    rating: number,
    comment: string
  ): Observable<Review> {
    return this.http.post<Review>(`/api/products/${productId}/reviews/`, {
      rating,
      comment,
    });
  }

  // ========== Admin endpoints ==========
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>('/api/admin/stats/');
  }
}