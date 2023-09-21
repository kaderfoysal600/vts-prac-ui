import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {
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
  itemChecked = false;
  checked = false;
  isButtonDisabled = true;
  allRolePermisson: any = [];
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  itemToUpdate: any = [];
  itemToDelete: any = [];

  itemToSubmit: any = [
    { itemToUpdate: [], itemToDelete: [] },
    { role_id: Number }

  ]

  getCheckedData: any

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.getAllPermissionGroupItem()
    this.getAllPermissionGroup()
    this._route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get("id"))
    });



    this.form = this.fb.group({
      // checkArray: this.fb.array([]),
      checkArray1: this.fb.array([]),
      role_id: [""],
      permission_group_id: ['', {}],
      permission: ['', {}],
    })
    // this.getRoleData()
    this.getRoleById()
    this.getAllPermission(this.Id)
    console.log('this.getCheckedData', this.getCheckedData);
  }


  getRoleById() {
    this.subDataTwo = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRole = res;
          this.singleRole = this.allRole.find(role => role.id == this.Id)
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
        this.allPermissionGroup = res;
        this.allPermissionGroup?.forEach((item: any) => {
          item['permission_group_items'] = []
          this.allPermissionGroupItem?.forEach(item2 => {
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
    this.allPermissionGroup?.forEach(item => {
      item.permission_group_items = item.permission_group_items?.map(val =>
        ({ itemData: val, isChecked: false })
      );
    });
    console.log('allPermissionGroup', this.allPermissionGroup);
  }




  submitForm() {
    console.log("this.form.value = ", this.form.value)
    this.form.get('role_id').setValue(this.Id);
    this.checkedData = this.form.value;
    console.log('this.checkedData', this.checkedData);
    if (this.form.invalid) {
      console.log('Invalid Input field!');
      return;
    } else {
      this.itemTobeSubmit()
    }

  }



  checkAllPermissions(event: any, item: any) {
    this.isButtonDisabled = false;
    console.log('item', item);
    console.log('event', event);
    this.itemChecked = event.checked;
    this.form.patchValue({
      role_id: this.Id
    })
    const checkArray: FormArray = this.form.get('checkArray1') as FormArray;
    if (this.itemChecked) {
      this.form.get('permission_group_id').setValue(item.id);
      checkArray.push(new FormControl(item));
      item.permission_group_items.forEach(val => {
        val.isChecked = event.checked;
        if (val.isChecked) {
          console.log('val checked');


          this.form.get('permission').setValue(val?.itemData?.permission);
        }

        else if (!val.isChecked) {

          console.log('val unchecked');
          console.log('value unchecked', val.isChecked)
        }
      });
    }
    else {
      this.form.get('permission_group_id').setValue(item.id);
      checkArray.push(new FormControl(item));
      let index = checkArray.controls.findIndex(x => x.value == name)
      console.log('index', index)
      // checkArray.removeAt(index);
      item.permission_group_items.forEach(val => {

        val.isChecked = event.checked;
        console.log('val?.itemData.id', val?.itemData.id)
      });

    }


  }


  checkChieldData(e: any, name: string) {
    this.isButtonDisabled = false;
    console.log(' this.allRolePermisson', this.allRolePermisson)
    const checkArray1: FormArray = this.form.get('checkArray1') as FormArray;
    console.log('checkArray1-1', checkArray1);
    console.log('checkedData', this.getCheckedData)
    this.getCheckedData.forEach((item) => {
      // this.form.get('permission_group_id').setValue(item.id);

      item.permission_group_items.map((child) => {
        console.log('child', child?.itemData?.permission);
        if (child?.itemData?.permission === e.source.value.itemData.permission) {
          if (checkArray1.value.length <= 0) {
            checkArray1.push(new FormControl(item));
            console.log('checkArray1', checkArray1);
            console.log('item', item?.permission_group_items);
          }

        }

      })

    })

    console.log('checkedData', this.getCheckedData)
  }




  checkAllP(event) {
    console.log(event.checked)
    if (event.checked === true && this.getCheckedData.length>0) {
      this.isButtonDisabled = false;
      console.log('this.isButtonDisabled', this.isButtonDisabled)

      this.getCheckedData.map((item) => {
        item.checked = true;
        item.permission_group_items.map((child) => {
          child.isChecked = true;
        })

      })
    }
    else if(event.checked === false) {
      this.getCheckedData.map((item) => {
        item.checked = false;
        item.permission_group_items.map((child) => {
          child.isChecked = false;
        })

      })
    }

  }


  getAllPermission(id) {

    this.subDataThree = this.authService.getAllRolePermission(id).subscribe({
      next: (res) => {
        if (res) {
          console.log('role permission', res['data']);
          this.allRolePermisson = res['data'];
          this.getCheckedData = res['data']
          console.log('this.getCheckedData', this.getCheckedData);
          console.log('Data Fatched successfully')
          this.anotherFunc(res)
        } else {
          console.log('Error! Please try again.');
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }



  anotherFunc(res) {
    for (const m of res['data']) {
      console.log('m.role_id', m.role_id);

      console.log('allPermissionGroupaaa', this.allPermissionGroup)
      // if(this.allPermissionGroup?.length > 0 || undefined || null || false){
      //   console.log('data loading')
      // }

      if (this.allPermissionGroup?.length > 0) {
        for (const item of this.allPermissionGroup) {
          console.log('item', item)
          if (item.id === m.permission_group_id) {
            item.checked = true;

            item['permission_group_items'].forEach((elm) => {

              res['data'].forEach(e => {
                if (e?.permission === elm?.itemData?.permission) {
                  elm.isChecked = true;
                }
              })
            });
          }
        }
      }

    }
    console.log('this.allPermissionGroup', this.allPermissionGroup);

    this.getCheckedData = this.allPermissionGroup;
    console.log('this.getCheckedData', this.getCheckedData);
    if (this.getCheckedData?.length === 0) {
      console.log("now form should be empty")
    } else if (this.getCheckedData?.length > 0) {
      console.log('now data shown as api')
    }

  }



  itemTobeSubmit() {
    console.log('all checked Data', this.getCheckedData);


    this.getCheckedData.forEach((item) => {
      if (item.checked) {
        item.permission_group_items.forEach((elm) => {
          console.log('elm', elm);
          if (elm.isChecked) {
            // Filter elements in allRolePermisson based on the condition
            let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
              return elmPermission?.permission === elm.itemData?.permission;
            });

            // Assuming you want to update itemToDelete and itemToUpdate arrays
            if (capableUpdate.length === 0) {
              // If no matching permissions were found, add to itemToDelete
              this.itemToSubmit[0].itemToUpdate.push(elm.itemData);
            } else {
              // If matching permissions were found, add to itemToUpdate
              // this.itemToDelete.push(elm.itemData);
            }
          }
          else if (!elm.isChecked) {
            console.log('now item should be delete')

            console.log('should be delete', elm)

            // Filter elements in allRolePermisson based on the condition
            let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
              return elmPermission?.permission === elm.itemData?.permission;
            });

            // Assuming you want to update itemToDelete and itemToUpdate arrays
            if (capableUpdate.length === 0) {
              // If no matching permissions were found, add to itemToDelete
              // this.itemToSubmit[0].itemToUpdate.push(elm.itemData);
            } else {
              // If matching permissions were found, add to itemToUpdate
              this.itemToSubmit[0].itemToDelete.push(elm.itemData);
            }



          }
        });
      }

      if (!item.checked) {
        item.permission_group_items.forEach((elm) => {
          console.log('elm', elm);

          // Filter elements in allRolePermisson based on the condition
          let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
            console.log('elmPermission?.permission', elmPermission?.permission);
            console.log('elm.itemData?.permission', elm.itemData?.permission);
            return elmPermission?.permission === elm.itemData?.permission;
          });
          console.log('capableUpdate', capableUpdate);
          // Assuming you want to update itemToDelete and itemToUpdate arrays
          if (capableUpdate.length === 0) {
            // If no matching permissions were found, add to itemToDelete
          } else {
            // If matching permissions were found, add to itemToUpdate
            this.itemToSubmit[0].itemToDelete.push(elm.itemData);
            console.log('this.itemToDelete', this.itemToDelete)
          }

        });
      }
    });

    console.log('this.allRolePermisson', this.allRolePermisson);
    console.log('this.itemToSubmit', this.itemToSubmit[0]);

    this.itemToSubmit[1]['role_id'] = this.Id;
    this.addRolePermission(this.itemToSubmit)
  }


  addRolePermission(data) {
    this.authService.addRolePermission(data).subscribe({
      next: (res) => {
        if (res) {
          console.log('res from api', res)
          console.log('role permission added successfully')

          this._snackBar.open('Role Permission added Successfully', '', {
            duration: 2000,
            panelClass: ['green-snackbar']
          })
          // this.getAllPermission(this.Id)


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

