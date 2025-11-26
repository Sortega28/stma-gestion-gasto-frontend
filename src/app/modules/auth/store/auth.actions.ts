import { createAction, props } from '@ngrx/store';
import { User } from '../core/models/user.model';

// LOGIN
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; access_token: string; role: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// LOGOUT
export const logout = createAction('[Auth] Logout');

// RESTAURAR SESIÓN DESDE LOCALSTORAGE
export const restoreSession = createAction(
  '[Auth] Restore Session',
  props<{ user: User | null; token: string; role: string }>()
);
