import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Redirige la raíz al login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Módulo de autenticación
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },

  // Módulo del layout (dashboard)
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },

  // Rutas desconocidas → login
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
