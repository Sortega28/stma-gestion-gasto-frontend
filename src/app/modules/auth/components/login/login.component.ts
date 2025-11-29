import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth.actions';
import { Observable, Subject } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  email = '';
  password = '';
  showPassword = false;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(err => {
        if (err) {
          this.snackBar.open(err, 'Cerrar', {
            duration: 3500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    const email = this.email.trim();
    const password = this.password.trim();

    if (!email || !password) {
      this.snackBar.open('Introduce correo y contraseña', 'OK', {
        duration: 2500,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.store.dispatch(AuthActions.login({ email, password }));
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
