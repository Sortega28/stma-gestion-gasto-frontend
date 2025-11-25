import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardLayoutComponent } from './pages/layout/dashboard-layout/dashboard-layout.component';

// Guards
import { AuthGuard } from '../auth/core/guards/auth.guard';
import { RoleGuard } from '../auth/core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // HOME (todos los roles)
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/dashboard-home/dashboard-home.module')
            .then(m => m.DashboardHomeModule)
      },

      // ORDENES
      {
        path: 'ordenes',
        loadChildren: () =>
          import('./pages/orders/orders.module')
            .then(m => m.OrdersModule)
      },
      {
        path: 'ordenes/nueva',
        loadChildren: () =>
          import('./pages/new-order/new-order.module')
            .then(m => m.NewOrderModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'auditor'] }
      },
      {
        path: 'ordenes/ver/:id',
        loadChildren: () =>
          import('./pages/ver-detalle/ver-detalle.module')
            .then(m => m.VerDetalleModule)
      },

      // USUARIOS (admin solo)
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./pages/users/users.module')
            .then(m => m.UsersModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },

      // REPORTES (todos, pero export solo auditor/admin)
      {
        path: 'reportes',
        loadChildren: () =>
          import('./pages/reports/reports.module')
            .then(m => m.ReportsModule)
      },

      // ALERTAS (solo admin/auditor)
      {
        path: 'alertas',
        loadChildren: () =>
          import('./pages/alertas/alertas.module')
            .then(m => m.AlertasModule),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'auditor'] }
      }

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
