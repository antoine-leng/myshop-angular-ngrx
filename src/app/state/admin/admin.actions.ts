import { createAction, props } from '@ngrx/store';

export interface TopProduct {
  productId: number;
  name: string;
  sold: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  user: string;
  total: number;
  createdAt: string;
  status: string;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

export const loadAdminStats = createAction('[Admin] Load Stats');

export const loadAdminStatsSuccess = createAction(
  '[Admin] Load Stats Success',
  props<{ stats: AdminStats }>()
);

export const loadAdminStatsFailure = createAction(
  '[Admin] Load Stats Failure',
  props<{ error: string }>()
);