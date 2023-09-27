import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListPermissionGroupItemRoutingModule } from './list-permission-group-item-routing.module';
import { ListPermissionGroupItemComponent } from './list-permission-group-item.component';
import { PermissionGroupItemDialogModule } from 'src/app/dialog/permission-group-item-dialog/permission-group-item-dialog.module';
import { MatButtonModule } from '@angular/material/button';
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    ListPermissionGroupItemComponent
  ],
  imports: [
    CommonModule,
    ListPermissionGroupItemRoutingModule,
    PermissionGroupItemDialogModule,
    MatButtonModule,
    NgxPaginationModule
  ]
})
export class ListPermissionGroupItemModule { }
