import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

// Selectors de base
export const selectUserProfile = createSelector(
  selectUserState,
  (state) => state.profile
);

export const selectUserOrders = createSelector(
  selectUserState,
  (state) => state.orders
);

export const selectCurrentOrder = createSelector(
  selectUserState,
  (state) => state.currentOrder
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectOrdersLoading = createSelector(
  selectUserState,
  (state) => state.ordersLoading
);

export const selectOrderDetailsLoading = createSelector(
  selectUserState,
  (state) => state.orderDetailsLoading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

// Selectors composés (mémorisés)
export const selectUserPreferences = createSelector(
  selectUserProfile,
  (profile) => profile?.preferences ?? null
);

export const selectUserDefaultAddress = createSelector(
  selectUserProfile,
  (profile) => profile?.defaultAddress ?? null
);

export const selectUserEmail = createSelector(
  selectUserProfile,
  (profile) => profile?.email ?? ''
);

export const selectUserFullName = createSelector(
  selectUserProfile,
  (profile) => profile?.fullName ?? profile?.username ?? ''
);

// Selector composé: commandes par status
export const selectOrdersByStatus = (status: string) =>
  createSelector(selectUserOrders, (orders) =>
    orders.filter((order) => order.status === status)
  );

// Selector composé: nombre total de commandes
export const selectTotalOrders = createSelector(
  selectUserOrders,
  (orders) => orders.length
);

// Selector composé: total dépensé
export const selectTotalSpent = createSelector(
  selectUserOrders,
  (orders) => orders.reduce((sum, order) => sum + order.total, 0)
);