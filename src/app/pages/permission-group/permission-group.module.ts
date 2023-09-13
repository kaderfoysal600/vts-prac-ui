import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionGroupRoutingModule } from './permission-group-routing.module';
import { PermissionGroupComponent } from './permission-group.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    PermissionGroupComponent
  ],
  imports: [
    CommonModule,
    PermissionGroupRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class PermissionGroupModule { }
