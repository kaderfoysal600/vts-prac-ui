import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionChieldComponent } from './permission-chield.component';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';


@NgModule({
  declarations: [
    PermissionChieldComponent
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule
  ]
})
export class PermissionChieldModule { }
