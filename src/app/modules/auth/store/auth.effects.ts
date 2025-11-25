import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../core/services/auth.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // LOGIN
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.access_token,
              role: response.user.role
            })
          ),
          catchError((error) => {
            let message = 'Error al iniciar sesión';

            if (error.error?.message) {
              message = error.error.message;
            }
            if (error.error?.errors) {
              message = Object.values(error.error.errors)[0] as string;
            }

            return of(AuthActions.loginFailure({ error: message }));
          })
        )
      )
    )
  );

  // LOGIN SUCCESS → Guarda token + usuario + rol y navega
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token, role }) => {
          localStorage.setItem('access_token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('user', JSON.stringify(user));

          this.router.navigate(['/dashboard/home']);
        })
      ),
    { dispatch: false }
  );

  // LOGOUT
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');

          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
