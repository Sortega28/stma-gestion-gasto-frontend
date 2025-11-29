import { Component, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthUser } from '../../../auth/store/auth.selector';
import * as AuthActions from '../../../auth/store/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() sidebarToggle = new EventEmitter<void>();

  user$: Observable<any>;

  constructor(private store: Store, private router: Router) {
    this.user$ = this.store.select(selectAuthUser);
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }
}
