import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../modules/auth/store/auth.selector';

@Directive({
  selector: '[appShowFor]'
})
export class ShowForDirective {

  @Input('appShowFor') allowedRoles: string[] = [];

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private store: Store
  ) {
    this.store.select(selectAuthUser).subscribe(user => {
      this.vcr.clear();

      if (user && user.role) {
        const role = user.role.toLowerCase();

        if (this.allowedRoles.map(r => r.toLowerCase()).includes(role)) {
          this.vcr.createEmbeddedView(this.tpl);
        }
      }
    });
  }
}
