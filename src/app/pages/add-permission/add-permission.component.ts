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
  checkAll: false;
  checkedData: any;
  allRole: any;
  singleRole: any;
  allPermissionGroup: any;
  allPermissionGroupItem: any;
  form: FormGroup;
  Id: any;
  checked = false;
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
      this.Id = parseInt(params.get("id"))
      console.log('Id', this.Id);
    });
    this.form = this.fb.group({
      // checkArray: this.fb.array([]),
      checkArray1: this.fb.array([]),
      role_id: [""],
      permission_group_id: ['', {}],
      permission: ['', {}],
    })
    this.getRoleData()
    this.getRoleById()
    this.getAllPermission()
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

              item['permission_group_items'].push(item2)

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
      item.permission_group_items = item.permission_group_items?.map(val =>
        ({ itemData: val, isChecked: false })
      );
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
    console.log('event', event);
    item.checked = event.checked;
    this.form.patchValue({
      role_id: this.Id
    })
    const checkArray: FormArray = this.form.get('checkArray1') as FormArray;
    if (event.checked) {
      this.form.get('permission_group_id').setValue(item.id);
      checkArray.push(new FormControl(item));
      item.permission_group_items.forEach(val => {
        val.isChecked = event.checked;
        if (val.isChecked) {
          console.log("aaaaaa", val)
          this.form.get('permission').setValue(val?.itemData?.permission);
          this.submitForm();
          this.authService.addRolePermission(this.form.value).subscribe({
            next: (res) => {
              if (res) {
                console.log('res from api', res)
                console.log('role permission added successfully')

              } else {
                console.log('Error! Please try again.')
              }
            },
            error: (err) => {
              console.log(err)
            }
          })


        }
        
        else if (!val.isChecked){
          console.log('value unchecked', val.isChecked)
          this.authService.deleteRolePermission(val?.itemData.id).subscribe({
            next : (res) => {
              if(res){
                console.log("deleted Successfully")
              }
            },
            error : (err)=> {

            }
          })
        }
        // this.getCheckedData({ checked: event.checked }, val);
      });
    }
    else {
      let index = checkArray.controls.findIndex(x => x.value == name)
      checkArray.removeAt(index);
      item.permission_group_items.forEach(val => {
        val.isChecked = event.checked;
        console.log('val?.itemData.id', val?.itemData.id)
        this.authService.deleteRolePermission(val?.itemData.id).subscribe({
          next : (res) => {
            if(res){
              console.log('delete response', res);
              console.log("deleted Successfully")
            }
          },
          error : (err)=> {

          }
        })
        // this.getCheckedData({ checked: event.checked }, val);
      });
      
    }


  }


  // getCheckedData(e: any, name: string) {
  //   console.log('eeeeee', e)
  //   console.log(e)
  //   const checkArray: FormArray = this.form.get('checkArray') as FormArray;
  //   if (e.isChecked) {
  //     console.log(name, 'checkedhhhhhhhhhh')
  //     checkArray.push(new FormControl(e.source.value));
  //   }
  //   else {
  //     let index = checkArray.controls.findIndex(x => x.value == name)
  //     checkArray.removeAt(index);

  //   }
  // }




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


  checkAllP() {
    console.log("Check All Permissions");
    console.log(this.checkedData);

  }



  getAllPermission() {
    this.subDataOne = this.authService.getAllRolePermission().subscribe({
      next: (res) => {
        if (res) {
          // this.allRoles = res
          console.log('role permission', res)

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




