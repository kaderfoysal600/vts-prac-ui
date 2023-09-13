import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditDialogComponent } from './user-edit-dialog.component';
import { MaterialModule } from 'src/app/material/material.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    UserEditDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatButtonModule
  ],
  exports: [
      UserEditDialogComponent
    ]
})
export class UserEditDialogModule { }
