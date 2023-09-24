import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditPermissionRoutingModule } from './edit-permission-routing.module';
import { EditPermissionComponent } from './edit-permission.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  declarations: [
    EditPermissionComponent
  ],
  imports: [
    CommonModule,
    EditPermissionRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class EditPermissionModule { }
