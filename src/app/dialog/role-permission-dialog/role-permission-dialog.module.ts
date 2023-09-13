import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePermissionDialogComponent } from './role-permission-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    RolePermissionDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    RolePermissionDialogComponent
  ]
})
export class RolePermissionDialogModule { }
