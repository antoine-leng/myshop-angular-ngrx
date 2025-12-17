import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.reducer';

export const selectAdminState = createFeatureSelector<AdminState>('admin');

export const selectAdminStats = createSelector(
  selectAdminState,
  (state) => state.stats
);

export const selectAdminLoading = createSelector(
  selectAdminState,
  (state) => state.loading
);

export const selectAdminError = createSelector(
  selectAdminState,
  (state) => state.error
);

export const selectTotalUsers = createSelector(
  selectAdminStats,
  (stats) => stats?.totalUsers ?? 0
);

export const selectTotalOrders = createSelector(
  selectAdminStats,
  (stats) => stats?.totalOrders ?? 0
);

export const selectTotalRevenue = createSelector(
  selectAdminStats,
  (stats) => stats?.totalRevenue ?? 0
);

export const selectTopProducts = createSelector(
  selectAdminStats,
  (stats) => stats?.topProducts ?? []
);

export const selectRecentOrders = createSelector(
  selectAdminStats,
  (stats) => stats?.recentOrders ?? []
);