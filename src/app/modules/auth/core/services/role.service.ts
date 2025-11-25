import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../auth/store/auth.selector';
import { User } from '../../../auth/core/models/user.model';
import { take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {

  private user: User | null = null;

  constructor(private store: Store) {
    this.store.select(selectAuthUser)
      .pipe(take(1))
      .subscribe(u => this.user = u);
  }

  get rol(): string {
    return this.user?.role ?? localStorage.getItem('role') ?? '';
  }

  esAdmin(): boolean {
    return this.rol === 'admin';
  }

  esAuditor(): boolean {
    return this.rol === 'auditor';
  }

  esUser(): boolean {
    return this.rol === 'user';
  }

  esGestor(): boolean {
    return this.esAuditor();  
  }

  esConsulta(): boolean {
    return this.esUser();
  }

  // PERMISOS

  puedeVerDashboard(): boolean { return true; }

  puedeVerSolicitudes(): boolean { return true; }

  puedeCrearOrdenes(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeValidar(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeRechazar(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeEditarOrdenes(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeEditarSolicitud(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeExportarReportes(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeVerAlertas(): boolean {
    return this.esAdmin() || this.esAuditor();
  }

  puedeVerUsuarios(): boolean {
    return this.esAdmin();
  }

  puedeGestionarUsuarios(): boolean {
    return this.esAdmin();
  }

  soloLectura(): boolean {
    return this.esUser();
  }
}
