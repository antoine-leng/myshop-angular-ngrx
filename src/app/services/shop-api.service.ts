import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProductsQuery,
  ProductsResponse,
} from '../state/products/products.actions';

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

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  constructor(private http: HttpClient) {}

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
      `/api/products/${id}/rating/`,
    );
  }
}
