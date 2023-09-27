import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateUserRoutingModule } from './update-user-routing.module';
import { UpdateUserComponent } from './update-user.component';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    UpdateUserRoutingModule,
    MaterialModule,
    NgxSpinnerModule
  ]
})
export class UpdateUserModule { }
