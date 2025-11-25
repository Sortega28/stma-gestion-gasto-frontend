import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';


export const selectAuthState = createFeatureSelector<AuthState>('auth');

// USER
export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

// TOKEN
export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);

// ROLE
export const selectAuthRole = createSelector(
  selectAuthState,
  (state) => state.role
);

// ERROR
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// LOADING
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
