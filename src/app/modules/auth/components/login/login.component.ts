import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth.actions';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selector';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';
  showPassword = false;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    // Mostrar alerta automáticamente cuando existe un error
    this.error$.subscribe(err => {
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

  // Alternar visibilidad contraseña
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Acción de login
  onLogin(): void {
    if (!this.email || !this.password) {
      this.snackBar.open('Introduce correo y contraseña', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.store.dispatch(AuthActions.login({ email: this.email, password: this.password }));
  }
}
