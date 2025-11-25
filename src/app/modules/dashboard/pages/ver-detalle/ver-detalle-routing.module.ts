import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerDetalleComponent } from './ver-detalle.component';

const routes: Routes = [
  {
    path: '',
    component: VerDetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerDetalleRoutingModule {}
