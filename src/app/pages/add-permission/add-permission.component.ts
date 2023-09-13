import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss']
})
export class AddPermissionComponent implements OnInit {
  selectedValue: string;
  allRoles: any;
  checkedData: any;
  allRole: any;
  singleRole: any;
  allPermissionGroup: any;
  allPermissionGroupItem: any;
  form: FormGroup;
  Id: any;

  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.getAllPermissionGroupItem()
    this.getAllPermissionGroup()
    this._route.paramMap.subscribe(params => {
      this.Id = params.get("id");
      console.log('Id', this.Id);

    });
    this.form = this.fb.group({
      checkArray: this.fb.array([]),
      checkArray1: this.fb.array([]),
      role_id: null,
      permission_group_id: null

    })
    this.getRoleData()
    this.getRoleById()

  }


  getRoleById() {
    this.subDataTwo = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRole = res;
          this.singleRole = this.allRole.find(role => role.id == this.Id)
          console.log('singleUser', this.singleRole)
          // this.setUser(this.singleUser);
        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getRoleData() {
    this.subDataOne = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRoles = res
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



  getAllPermissionGroupItem() {
    this.subDataOne = this.authService.getAllPermissionGroupItem().subscribe({
      next: (res) => {
        if (res) {
          this.allPermissionGroupItem = res
          this.getAllPermissionGroup()

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
  private getAllPermissionGroup() {
    this.authService.getAllPermissionGroup().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allPermissionGroup = res;
        this.allPermissionGroup.forEach((item: any) => {
          item['permission_group_items'] = []
          this.allPermissionGroupItem.forEach(item2 => {
            // console.log('item.id', item.id)
            // console.log('item2.permission_group_id', item2.permission_group_id)
            if (item.id == item2.permission_group_id) {

              item['permission_group_items'].push(item2.name)

            }
          })
        })
        this.newfunc()
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  private newfunc() {
    console.log('allPermissionGroup', this.allPermissionGroup);

    this.allPermissionGroup.forEach(item => {
      item.permission_group_items = item.permission_group_items?.map(val => ({ name: val, isChecked: false }));
    });
  }

  submitForm() {
    console.log("this.form.value = ", this.form.value)
    this.checkedData = this.form.value;
    console.log('this.checkedData', this.checkedData);
    if (this.form.invalid) {
      console.log('Invalid Input field!');
      return;
    }

  }



  checkAllPermissions(event: any, item: any) {
    console.log('item', item);
    const checkArray: FormArray = this.form.get('checkArray1') as FormArray;
    if (event.checked) {
      console.log('checked')
      checkArray.push(new FormControl(event.source.value));
    }
    else {
      let index = checkArray.controls.findIndex(x => x.value == name)
      checkArray.removeAt(index);
    }
    this.form.patchValue({
      permission_group_id: item.id,
      role_id: this.Id
    })
  }


  getCheckedData(e: any, name: string) {
    console.log(e)
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.checked) {
      console.log(name, 'checked')
      checkArray.push(new FormControl(e.source.value));
    }
    else {
      let index = checkArray.controls.findIndex(x => x.value == name)
      checkArray.removeAt(index);
    }
  }




  /////

  // this.dataForm.patchValue({
  //   areWhereYouLiveIn: this.selectedDatas1
  // })
  // const mData = {
  //   ...this.dataForm.value,
  //   ...{
  //     checkBoxData: this.selectedDatas,
  //     checkBoxData2: this.selectedDatas1
  //   }

  // }

}




