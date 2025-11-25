import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectAuthUser } from '../../store/auth.selector';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles: string[] = route.data['roles'] || [];

    return this.store.select(selectAuthUser).pipe(
      take(1),
      map((user) => {

        // Sin usuario o sin rol → NO autorizado
        if (!user?.role) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        const userRole = user.role.toLowerCase();
        const allowed = expectedRoles.map(r => r.toLowerCase());

        // Si no hay roles definidos en la ruta → permitir por defecto
        if (allowed.length === 0) {
          return true;
        }

        // Si el rol coincide → permitir acceso
        if (allowed.includes(userRole)) {
          return true;
        }

        // Rol no permitido → redirigir
        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}
