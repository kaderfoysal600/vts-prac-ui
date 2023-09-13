import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRolePermissionComponent } from './list-role-permission.component';

const routes: Routes = [{
  path:'',
  component:ListRolePermissionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRolePermissionRoutingModule { }
