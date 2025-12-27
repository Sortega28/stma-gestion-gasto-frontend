import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material
import { MatIconModule } from '@angular/material/icon';

// Layout components
import { LayoutComponent } from './layout.component';

// UI components
import { HeaderComponent } from '../modules/auth/components/header/header.component';
import { SidebarComponent } from '../modules/auth/components/sidebar/sidebar.component';
import { FooterComponent } from '../modules/auth/components/footer/footer.component';

// Layout
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    LayoutRoutingModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LayoutComponent
  ]
})
export class LayoutModule {}
