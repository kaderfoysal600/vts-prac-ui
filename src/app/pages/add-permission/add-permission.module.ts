import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPermissionRoutingModule } from './add-permission-routing.module';
import { AddPermissionComponent } from './add-permission.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddPermissionComponent
  ],
  imports: [
    CommonModule,
    AddPermissionRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddPermissionModule { }
