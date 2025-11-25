import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerDetalleRoutingModule } from './ver-detalle-routing.module';
import { VerDetalleComponent } from './ver-detalle.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [VerDetalleComponent],
  imports: [
    CommonModule,
    FormsModule,
    VerDetalleRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,

  ]
})
export class VerDetalleModule {}
