import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../modules/auth/store/auth.reducer';
import { take, map, switchMap } from 'rxjs/operators';
import { selectAuthToken } from '../../modules/auth/store/auth.selector';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<{ auth: AuthState }>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(selectAuthToken).pipe(
      // Esperar a tener un token real o null, pero SOLO despues del restoreSession
      take(1),

      switchMap((token) => {
        if (!token) {
          return next.handle(req);  
        }

        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(cloned);
      })
    );
  }
}
