import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  
  // Pages dev (tests MSW) - pas de lazy loading car zone de test
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  
  // App placeholder
  { path: 'app', component: AppPlaceholderComponent },
  
  // Auth - pas de lazy loading car souvent accédé immédiatement
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login-page').then((m) => m.LoginPage),
  },
  
  // Shop module - LAZY LOADING
  {
    path: 'shop',
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products/products-page').then((m) => m.ProductsPage),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./shop/product-details/product-details-page.component').then(
            (m) => m.ProductDetailsPage
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./shop/cart/cart-page.component').then((m) => m.CartPage),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./shop/checkout/checkout-page.component').then(
            (m) => m.CheckoutPage
          ),
      },
      {
        path: 'rating',
        loadComponent: () =>
          import('./pages/rating/product-rating-page').then(
            (m) => m.ProductRatingPage
          ),
      },
    ],
  },
  
  // Account module - LAZY LOADING
  {
    path: 'account',
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/account/profile-page.component').then(
            (m) => m.ProfilePage
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/account/orders-page.component').then(
            (m) => m.OrdersPage
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/account/order-details-page.component').then(
            (m) => m.OrderDetailsPage
          ),
      },
    ],
  },
  
  // Wishlist - LAZY LOADING
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist-page.component').then(
        (m) => m.WishlistPage
      ),
  },
  
  // Admin module - LAZY LOADING
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/dashboard-page.component').then(
            (m) => m.AdminDashboardPage
          ),
      },
    ],
  },
  
  // Fallback
  { path: '**', redirectTo: '' },
];