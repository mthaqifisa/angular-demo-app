import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  login$ = createEffect(() => {
    // Check if actions$ is defined
    if (!this.actions$) {
      console.error('actions$ is undefined in AuthEffects');
      return of();
    }

    return this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) => {
        // Check if authService is defined
        if (!this.authService) {
          console.error('authService is undefined in AuthEffects');
          return of(AuthActions.loginFailure({ error: 'Auth service is not available' }));
        }

        return this.authService.login(credentials).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError(error =>
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        );
      })
    );
  });

  constructor() {}
}
