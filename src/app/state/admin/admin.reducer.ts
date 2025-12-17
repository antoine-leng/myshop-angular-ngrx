import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { AdminStats } from './admin.actions';

export interface AdminState {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

export const initialAdminState: AdminState = {
  stats: null,
  loading: false,
  error: null,
};

export const adminReducer = createReducer(
  initialAdminState,

  on(AdminActions.loadAdminStats, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AdminActions.loadAdminStatsSuccess, (state, { stats }) => ({
    ...state,
    loading: false,
    stats,
    error: null,
  })),

  on(AdminActions.loadAdminStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);