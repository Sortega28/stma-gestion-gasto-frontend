import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './modules/auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class SessionBootstrapService {

  constructor(private store: Store) {}

  init() {
    return () => {
      const token = localStorage.getItem('access_token');
      const role = localStorage.getItem('role');
      const user = localStorage.getItem('user');

      if (token && role && user) {
        this.store.dispatch(AuthActions.restoreSession({
          token,
          role,
          user: JSON.parse(user)
        }));
      }
    };
  }
}
