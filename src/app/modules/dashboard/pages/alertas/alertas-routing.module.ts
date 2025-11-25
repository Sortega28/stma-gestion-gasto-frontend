import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertasComponent } from './alertas.component';
import { AuthGuard } from '../../../auth/core/guards/auth.guard';
import { RoleGuard } from '../../../auth/core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AlertasComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'auditor'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertasRoutingModule {}
