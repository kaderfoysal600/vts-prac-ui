import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDialogComponent } from './role-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    RoleDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    RoleDialogComponent
  ]
})
export class RoleDialogModule { }
