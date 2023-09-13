import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionGroupItemDialogComponent } from './permission-group-item-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    PermissionGroupItemDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PermissionGroupItemDialogComponent
  ]
})
export class PermissionGroupItemDialogModule { }
