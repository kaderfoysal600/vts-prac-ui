import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit {
  //storeDtaa
  allPermissionGroup
  allRole
  // Reactive Form
  rolePermissionForm: FormGroup;
  permissionGroupId = new FormControl('');
  roleId = new FormControl('');
  permission = new FormControl('')
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.rolePermissionForm = new FormGroup({
      permissionGroupId: this.permissionGroupId,
      roleId:this.roleId,
      permission: this.permission
    });
    this.getAllPermissionGroup()
    this.getAllRole()
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

  getAllRole() {
    this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRole = res
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



  AddRolePermission() {
    if (this.rolePermissionForm.invalid) {
      console.log('Invalid Input field!');
      return;
    }
    // Form Data..
    const role_id = this.rolePermissionForm.value.roleId;
    const permission_group_id = this.rolePermissionForm.value.permissionGroupId
    const permission= this.rolePermissionForm.value.permission
    const data = {permission_group_id,role_id , permission};

      this.authService.addRolePermission(data).subscribe({
        next: (res) => {
          if (res) {
            console.log(res)
            console.log('rolePermission successfully Added')

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
