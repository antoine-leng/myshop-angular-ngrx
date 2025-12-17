import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { LoginPage } from './pages/login/login-page';
import { ProductsPage } from './pages/products/products-page';
import { ProductRatingPage } from './pages/rating/product-rating-page';

// Nouvelles pages Exercice 2
import { ProductDetailsPage } from './shop/product-details/product-details-page.component';
import { CartPage } from './shop/cart/cart-page.component';
import { CheckoutPage } from './shop/checkout/checkout-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  
  // Pages dev (tests MSW)
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  
  // App placeholder
  { path: 'app', component: AppPlaceholderComponent },
  
  // Pages Exercice 1
  { path: 'login', component: LoginPage },
  { path: 'shop/products', component: ProductsPage },
  { path: 'shop/rating', component: ProductRatingPage },
  
  // Nouvelles pages Exercice 2
  { path: 'shop/products/:id', component: ProductDetailsPage },
  { path: 'shop/cart', component: CartPage },
  { path: 'shop/checkout', component: CheckoutPage },
  
  // Fallback
  { path: '**', redirectTo: '' },
];