import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../modules/auth/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],   
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../modules/dashboard/pages/dashboard-home/dashboard-home.module')
            .then(m => m.DashboardHomeModule),
      },
      {
        path: 'solicitudes',
        loadChildren: () =>
          import('../modules/dashboard/pages/orders/orders.module')
            .then(m => m.OrdersModule),
      },
      {
        path: 'nueva-solicitud',
        loadChildren: () =>
          import('../modules/dashboard/pages/new-order/new-order.module')
            .then(m => m.NewOrderModule),
      },
      {
        path: 'solicitudes/:id',
        loadChildren: () =>
          import('../modules/dashboard/pages/ver-detalle/ver-detalle.module')
            .then(m => m.VerDetalleModule),
      },
      {
        path: 'alertas',
        loadChildren: () =>
          import('../modules/dashboard/pages/alertas/alertas.module')
            .then(m => m.AlertasModule),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('../modules/dashboard/pages/reports/reports.module')
            .then(m => m.ReportsModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../modules/dashboard/pages/users/users.module')
            .then(m => m.UsersModule),
      },

      // redirección por defecto
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
