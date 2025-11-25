import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../core/models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // LOGIN
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  // LOGIN SUCCESS
  on(AuthActions.loginSuccess, (state, { user, token, role }) => ({
    ...state,
    user,
    token,
    role,
    loading: false,
    error: null,
  })),

  // RESTORE SESSION
  on(AuthActions.restoreSession, (state, { user, token, role }) => ({
    ...state,
    user,
    token,
    role,
    loading: false,
    error: null,
  })),

  // LOGIN FAILURE
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // LOGOUT
  on(AuthActions.logout, () => initialState)
);
