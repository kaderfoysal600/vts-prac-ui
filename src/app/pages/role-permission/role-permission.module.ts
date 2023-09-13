import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePermissionRoutingModule } from './role-permission-routing.module';
import { RolePermissionComponent } from './role-permission.component';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    RolePermissionComponent
  ],
  imports: [
    CommonModule,
    RolePermissionRoutingModule,
    MaterialModule
  ]
})
export class RolePermissionModule { }
