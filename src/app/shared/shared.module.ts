import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowForDirective } from './directives/show-for.directive';

@NgModule({
  declarations: [
    ShowForDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShowForDirective
  ]
})
export class SharedModule {}
