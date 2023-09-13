import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPermissionGroupItemComponent } from './list-permission-group-item.component';

const routes: Routes = [{
  path:'',
  component:ListPermissionGroupItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListPermissionGroupItemRoutingModule { }
