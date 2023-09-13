import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
interface Status {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-permission-group-item',
  templateUrl: './permission-group-item.component.html',
  styleUrls: ['./permission-group-item.component.scss']
})
export class PermissionGroupItemComponent implements OnInit {
    // Form Template Ref
    @ViewChild('templateForm') templateForm: NgForm;
  allPermissionGroup
  selectedValue2: string;
  allStatus: Status[] = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inActive', viewValue: 'InActive' }
  ];
  // Reactive Form
  roleForm: FormGroup;
  name = new FormControl('', [Validators.required]);
  permission = new FormControl('', [Validators.required]);
  permissionGroupId = new FormControl('');
  weight = new FormControl('')
  status = new FormControl('');
  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    // Main reactive form..
    this.roleForm = new FormGroup({
      name: this.name,
      permission: this.permission,
      status: this.status,
      permissionGroupId: this.permissionGroupId,
      weight: this.weight
    });
    this.getAllPermissionGroup()
  }


  getAllPermissionGroup() {
    this.authService.getAllPermissionGroup().subscribe({
      next: (res) => {
        if (res) {
          this.allPermissionGroup = res
          console.log(res)

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }




  /**
* Add Role
*/
  AddPermissionGroupItem() {
    if (this.roleForm.invalid) {
      console.log('Invalid Input field!');
      return;
    }
    // Form Data..
    const name = this.roleForm.value.name;
    const permission = this.roleForm.value.permission;
    const status = this.roleForm.value.status;
    const permission_group_id = this.roleForm.value.permissionGroupId
    const weight = this.roleForm.value.weight
    const data = { name, permission, status, permission_group_id,weight };

      this.authService.addPermissionGroupItem(data).subscribe({
        next: (res) => {
          if (res) {
            console.log(res)
            console.log('permissionGroup successfully Added')

          } else {
            console.log('Error! Please try again.')
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

}
