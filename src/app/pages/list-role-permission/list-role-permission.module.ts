import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRolePermissionRoutingModule } from './list-role-permission-routing.module';
import { ListRolePermissionComponent } from './list-role-permission.component';
import { RolePermissionDialogModule } from 'src/app/dialog/role-permission-dialog/role-permission-dialog.module';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ListRolePermissionComponent
  ],
  imports: [
    CommonModule,
    ListRolePermissionRoutingModule,
    RolePermissionDialogModule,
    MatButtonModule
  ]
})
export class ListRolePermissionModule { }
