import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoleRoutingModule } from './list-role-routing.module';
import { ListRoleComponent } from './list-role.component';
import { RoleDialogModule } from 'src/app/dialog/role-dialog/role-dialog.module';


@NgModule({
  declarations: [
    ListRoleComponent
  ],
  imports: [
    CommonModule,
    ListRoleRoutingModule,
    RoleDialogModule
  ]
})
export class ListRoleModule { }
