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

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },
  { path: 'app', component: AppPlaceholderComponent },
  { path: 'login', component: LoginPage },
  { path: 'shop/products', component: ProductsPage },
  { path: 'shop/rating', component: ProductRatingPage },
  { path: '**', redirectTo: '' },
];
