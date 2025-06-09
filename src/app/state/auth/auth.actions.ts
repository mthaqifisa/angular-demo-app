import { createAction, props } from '@ngrx/store';
import { LoginRequest, User } from '../../services/auth.service';

// Login actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);


// Logout action
export const logout = createAction('[Auth] Logout');
