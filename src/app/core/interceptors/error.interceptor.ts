import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          console.warn('Error 401 (No autenticado)');
        }

        else if (error.status === 403) {
          console.warn('Error 403 (Acceso denegado)');
        }

        else if (error.status >= 500) {
          console.error('Error en el servidor:', error.message);
          alert('Error en el servidor. Por favor, intenta más tarde.');
        }

        return throwError(() => error);
      })
    );
  }
}
