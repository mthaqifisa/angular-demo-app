import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  // Handle login action
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  // Handle login success action
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),

  // Handle login failure action
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error
  })),

  // Handle logout action
  on(AuthActions.logout, () => initialAuthState)
);
