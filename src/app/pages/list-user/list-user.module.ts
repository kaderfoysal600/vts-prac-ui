import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListUserRoutingModule } from './list-user-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { MatTableModule } from '@angular/material/table';
import { UserEditDialogModule } from 'src/app/dialog/user-edit-dialog/user-edit-dialog.module';
import { MatButtonModule } from '@angular/material/button';
// import { UserDialogComponent } from 'src/app/dialog/user-dialog/user-dialog.component';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ListUserRoutingModule,
    MaterialModule,
    MatTableModule,
    UserEditDialogModule,
    MatButtonModule
    // UserDialogComponent
    
  ]
})
export class ListUserModule { }
