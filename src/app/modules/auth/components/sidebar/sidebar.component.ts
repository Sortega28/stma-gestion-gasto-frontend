import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectAuthUser } from '../../../auth/store/auth.selector';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  role$ = this.store.select(selectAuthUser).pipe(
    map(user => user?.role?.toLowerCase() || '')
  );

  constructor(
    public router: Router,
    private store: Store
  ) {}

  isActive(menu: string): boolean {
    const url = this.router.url;

    switch (menu) {
      case 'dashboard': return url === '/dashboard';
      case 'ordenes':   return url.startsWith('/dashboard/ordenes');
      case 'usuarios':  return url.startsWith('/dashboard/usuarios');
      case 'reportes':  return url.startsWith('/dashboard/reportes');
      case 'alertas':   return url.startsWith('/dashboard/alertas');
      default:          return false;
    }
  }
}
