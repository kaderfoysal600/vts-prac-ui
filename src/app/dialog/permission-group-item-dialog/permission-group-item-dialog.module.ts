import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionGroupItemDialogComponent } from './permission-group-item-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    PermissionGroupItemDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatIconModule
  ],
  exports: [
    PermissionGroupItemDialogComponent
  ]
})
export class PermissionGroupItemDialogModule { }
