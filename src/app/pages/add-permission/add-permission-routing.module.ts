import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPermissionComponent } from './add-permission.component';

const routes: Routes = [{
  path: '',
  component: AddPermissionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPermissionRoutingModule { }
