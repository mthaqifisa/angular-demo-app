import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Select the auth state from the root state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Select the user from the auth state
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

// Derive whether the user is authenticated
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.user
);

// Select the loading state
export const selectLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

// Select the error state
export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
