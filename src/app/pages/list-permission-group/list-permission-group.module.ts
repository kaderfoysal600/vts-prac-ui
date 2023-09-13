import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListPermissionGroupRoutingModule } from './list-permission-group-routing.module';
import { ListPermissionGroupComponent } from './list-permission-group.component';
import { PermissionGroupDialogModule } from 'src/app/dialog/permission-group-dialog/permission-group-dialog.module';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ListPermissionGroupComponent
  ],
  imports: [
    CommonModule,
    PermissionGroupDialogModule,
    ListPermissionGroupRoutingModule,
    MatButtonModule
  ]
})
export class ListPermissionGroupModule { }
