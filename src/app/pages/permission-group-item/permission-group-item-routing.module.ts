import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGroupItemComponent } from './permission-group-item.component';

const routes: Routes = [{
  path:'',
  component:PermissionGroupItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionGroupItemRoutingModule { }
