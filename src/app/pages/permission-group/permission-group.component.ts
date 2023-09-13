import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
interface Status {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.scss']
})
export class PermissionGroupComponent implements OnInit {
  selectedValue2: string;
  allStatus: Status[] = [
    {value: 'active', viewValue: 'Active'},
    {value: 'inActive', viewValue: 'InActive'}
  ];
  // Reactive Form
  roleForm: FormGroup;
  name = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  status = new FormControl('');
  constructor(private authService :AuthService, public router: Router) { }

  ngOnInit(): void {
    // Main reactive form..
    this.roleForm = new FormGroup({
      name: this.name,
      description:this.description,
      status:this.status,
    });
    // this.getRoleData()
}
  /**
* Add Role
*/
  AddPermissionGroup() {
    if (this.roleForm.invalid) {
     console.log('Invalid Input field!');
      return;
    }
    // Form Data..
    const name = this.roleForm.value.name;
    const description = this.roleForm.value.description;
    const status = this.roleForm.value.status;
    const data = {name,description,status};


    this.authService.addPermissionGroup(data).subscribe({
      next: (res) => {
        if (res ) {
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
