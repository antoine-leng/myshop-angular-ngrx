import { createAction, props } from '@ngrx/store';

export interface Address {
  street: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface UserPreferences {
  newsletter: boolean;
  defaultMinRating?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  defaultAddress?: Address;
  preferences: UserPreferences;
}

export interface OrderSummary {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export interface OrderDetails extends OrderSummary {
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  taxes: number;
  shipping: number;
  address: Address;
}

// Charger le profil
export const loadProfile = createAction('[User] Load Profile');

export const loadProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ profile: UserProfile }>()
);

export const loadProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: string }>()
);

// Mettre à jour le profil
export const updateProfile = createAction(
  '[User] Update Profile',
  props<{ updates: Partial<UserProfile> }>()
);

export const updateProfileSuccess = createAction(
  '[User] Update Profile Success',
  props<{ profile: UserProfile }>()
);

export const updateProfileFailure = createAction(
  '[User] Update Profile Failure',
  props<{ error: string }>()
);

// Charger les commandes
export const loadOrders = createAction('[User] Load Orders');

export const loadOrdersSuccess = createAction(
  '[User] Load Orders Success',
  props<{ orders: OrderSummary[] }>()
);

export const loadOrdersFailure = createAction(
  '[User] Load Orders Failure',
  props<{ error: string }>()
);

// Charger les détails d'une commande
export const loadOrderDetails = createAction(
  '[User] Load Order Details',
  props<{ orderId: string }>()
);

export const loadOrderDetailsSuccess = createAction(
  '[User] Load Order Details Success',
  props<{ order: OrderDetails }>()
);

export const loadOrderDetailsFailure = createAction(
  '[User] Load Order Details Failure',
  props<{ error: string }>()
);