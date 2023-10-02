import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListPermissionGroupRoutingModule } from './list-permission-group-routing.module';
import { ListPermissionGroupComponent } from './list-permission-group.component';
import { PermissionGroupDialogModule } from 'src/app/dialog/permission-group-dialog/permission-group-dialog.module';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    ListPermissionGroupComponent
  ],
  imports: [
    CommonModule,
    PermissionGroupDialogModule,
    ListPermissionGroupRoutingModule,
    MatButtonModule,
    MaterialModule,
    MatPaginatorModule,
  ]
})
export class ListPermissionGroupModule { }
