import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path:'',
  component:PagesComponent,


  children: [
    // {
    //   path: 'login',
    //   loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
    // },
    {
      path: '',
      redirectTo: 'list-user',
      pathMatch: 'full',
      
    },
    {
      path: 'create-user',
      loadChildren: () => import('./create-user/create-user.module').then(m => m.CreateUserModule),
    },
    {
      path: 'role',
      loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
    },
    {
      path: 'permission-group',
      loadChildren: () => import('./permission-group/permission-group.module').then(m => m.PermissionGroupModule)
    },
    {
      path: 'permission-group-item',
      loadChildren: () => import('./permission-group-item/permission-group-item.module').then(m => m.PermissionGroupItemModule)
    },
    {
      path: 'role-permission',
      loadChildren: () => import('./role-permission/role-permission.module').then(m => m.RolePermissionModule)
    },
    {
      path: 'list-user',
      loadChildren: () => import('./list-user/list-user.module').then(m => m.ListUserModule),
      
    },

    {
      path: 'list-role',
      loadChildren: () => import('./list-role/list-role.module').then(m => m.ListRoleModule)
    },
    {
      path: 'updateUser/:id',
      loadChildren: () => import('./update-user/update-user.module').then(m => m.UpdateUserModule)
    },
    {
      path: 'list-permission-group',
      loadChildren: () => import('./list-permission-group/list-permission-group.module').then(m => m.ListPermissionGroupModule)
    },

    {
      path: 'list-permission-group-item',
      loadChildren: () => import('./list-permission-group-item/list-permission-group-item.module').then(m => m.ListPermissionGroupItemModule)
    },

    {
      path: 'list-role-permission',
      loadChildren: () => import('./list-role-permission/list-role-permission.module').then(m => m.ListRolePermissionModule)
    },
    {
      path: 'add-permission/:id',
      loadChildren: () => import('./add-permission/add-permission.module').then(m => m.AddPermissionModule)
    },
    {
      path: 'edit-permission',
      loadChildren: () => import('./edit-permission/edit-permission.module').then(m => m.EditPermissionModule)
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
