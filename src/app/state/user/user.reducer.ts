import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { UserProfile, OrderSummary, OrderDetails } from './user.actions';

export interface UserState {
  profile: UserProfile | null;
  orders: OrderSummary[];
  currentOrder: OrderDetails | null;
  loading: boolean;
  ordersLoading: boolean;
  orderDetailsLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  profile: null,
  orders: [],
  currentOrder: null,
  loading: false,
  ordersLoading: false,
  orderDetailsLoading: false,
  error: null,
};

export const userReducer = createReducer(
  initialUserState,

  // Load Profile
  on(UserActions.loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    loading: false,
    profile,
    error: null,
  })),

  on(UserActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Profile
  on(UserActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UserActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    loading: false,
    profile,
    error: null,
  })),

  on(UserActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Orders
  on(UserActions.loadOrders, (state) => ({
    ...state,
    ordersLoading: true,
    error: null,
  })),

  on(UserActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    ordersLoading: false,
    orders,
    error: null,
  })),

  on(UserActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    ordersLoading: false,
    error,
  })),

  // Load Order Details
  on(UserActions.loadOrderDetails, (state) => ({
    ...state,
    orderDetailsLoading: true,
    error: null,
  })),

  on(UserActions.loadOrderDetailsSuccess, (state, { order }) => ({
    ...state,
    orderDetailsLoading: false,
    currentOrder: order,
    error: null,
  })),

  on(UserActions.loadOrderDetailsFailure, (state, { error }) => ({
    ...state,
    orderDetailsLoading: false,
    error,
  }))
);