import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ access: string; refresh: string }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshSuccess = createAction(
  '[Auth] Refresh Success',
  props<{ access: string }>(),
);
