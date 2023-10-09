import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubMenuComponent } from './sub-menu.component';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    SubMenuComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule
  ],
  exports: [
    SubMenuComponent
  ]
})
export class SubMenuModule { }
