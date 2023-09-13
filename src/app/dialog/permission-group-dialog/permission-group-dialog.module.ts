import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionGroupDialogComponent } from './permission-group-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    PermissionGroupDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
      PermissionGroupDialogComponent
    ]
})
export class PermissionGroupDialogModule { }
