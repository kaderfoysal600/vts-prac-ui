import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionGroupItemRoutingModule } from './permission-group-item-routing.module';
import { PermissionGroupItemComponent } from './permission-group-item.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PermissionGroupItemComponent
  ],
  imports: [
    CommonModule,
    PermissionGroupItemRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PermissionGroupItemModule { }
