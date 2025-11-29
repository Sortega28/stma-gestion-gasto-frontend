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

  sidebarOpen = false;

  role$ = this.store.select(selectAuthUser).pipe(
    map(user => user?.role?.toLowerCase() || '')
  );

  constructor(public router: Router, private store: Store) {}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.sidebarOpen = false;
  }

  isActive(menu: string): boolean {
    const url = this.router.url;

    switch (menu) {
      case 'home': return url === '/dashboard/home';
      case 'solicitudes': return url.startsWith('/dashboard/solicitudes');
      case 'users': return url.startsWith('/dashboard/users');
      case 'reportes': return url.startsWith('/dashboard/reportes');
      case 'alertas': return url.startsWith('/dashboard/alertas');
      default: return false;
    }
  }
}
