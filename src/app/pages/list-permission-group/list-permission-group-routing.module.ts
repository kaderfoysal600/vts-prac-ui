import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPermissionGroupComponent } from './list-permission-group.component';

const routes: Routes = [{
  path:'',
  component:ListPermissionGroupComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListPermissionGroupRoutingModule { }
