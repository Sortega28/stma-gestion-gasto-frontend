import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { DashboardHomeRoutingModule } from './dashboard-home-routing.module';
import { DashboardHomeComponent } from './dashboard-home.component';
import { LayoutModule } from '../../../../layout/layout.module';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    DashboardHomeRoutingModule,
    LayoutModule
  ]
})
export class DashboardHomeModule {}
