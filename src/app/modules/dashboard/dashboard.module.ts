import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';

// Layout
import { LayoutModule } from '../../layout/layout.module';

// Routing
import { DashboardRoutingModule } from './dashboard-routing.module';

// Component ONLY belonging to dashboard layout
import { DashboardLayoutComponent } from './pages/layout/dashboard-layout/dashboard-layout.component';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// Shared
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    DashboardLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    LayoutModule,
    SharedModule,

    // Formularios
    FormsModule,
    ReactiveFormsModule,

    // Material
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDividerModule,

    // HTTP
    HttpClientModule
  ]
})
export class DashboardModule {}
