import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {


  //store data
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
  isLoadingFeaturedProducts: boolean = false;
  itemToSubmit: any = [
    { itemToUpdate: [], itemToDelete: [] },
    { role_id: Number }
  ]
  getCheckedData: any

  //subscription
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription
  private subDataFour: Subscription;


  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
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
    this.getRoleById()
  }


  getRoleById() {
    this.spinner.show();
    this.subDataTwo = this.authService.getAllrole().subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res) {
          this.allRole = res;
          this.singleRole = this.allRole.find(role => role.id == this.Id)
        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
        this.spinner.hide();
      }
    })
  }

  //initial data

  getAllPermissionGroupItem() {
    this.spinner.show();
    this.subDataOne = this.authService.getAllPermissionGroupItem().subscribe({
      next: (res) => {
        if (res) {
          this.spinner.hide();
          console.log('res for all permission grop item', res)
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
    this.spinner.show();
    this.subDataTwo = this.authService.getAllPermissionGroup().subscribe({
      next: (res: any) => {
        console.log('res of permission group', res)
        this.spinner.hide();
        this.insertItemToPermissionGroup(res)
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  insertItemToPermissionGroup(data: any) {
    data?.map((item: any) => {
      item['permission_group_items'] = []
      this.allPermissionGroupItem?.map(item2 => {
        if (item.id == item2.permission_group_id) {
          item['permission_group_items'].push(item2)
        }
      })

      item.permission_group_items = item.permission_group_items?.map(val =>
        ({ itemData: val, isChecked: false })
      );
    })
    console.log('data', data)
    this.allPermissionGroup = data;
    this.getAllPermission(this.Id)
  }


  //checked data 

  checkParentData(event: any, item: any) {
    this.isButtonDisabled = false;
    this.itemChecked = event.checked;
    const checkArray: FormArray = this.form.get('checkArray1') as FormArray;
    if (this.itemChecked) {
      this.form.get('permission_group_id').setValue(item.id);
      checkArray.push(new FormControl(item));
      item.permission_group_items.forEach(val => {
        val.isChecked = event.checked;
        if (val.isChecked) {
          this.form.get('permission').setValue(val?.itemData?.permission);
        }
        else if (!val.isChecked) {
          console.log('value unchecked', val.isChecked)
        }
      });
    }
    else {
      this.form.get('permission_group_id').setValue(item.id);
      item.permission_group_items.forEach(val => {
        val.isChecked = event.checked;
      });

    }


  }

  checkChieldData(e: any, name: string) {
    this.isButtonDisabled = false;
    const checkArray1: FormArray = this.form.get('checkArray1') as FormArray;
    this.getCheckedData.forEach((item) => {
      item.permission_group_items.map((child) => {
        if (child?.itemData?.permission === e.source.value.itemData.permission) {
            checkArray1.push(new FormControl(item));
        }
      })
    })

  }

  //submit data

  submitForm() {
    this.form.get('role_id').setValue(this.Id);
    this.checkedData = this.form.value;
    if (this.form.invalid) {
      console.log('Invalid Input field!');
      return;
    } else {
      this.itemTobeSubmit()
    }

  }

  itemTobeSubmit() {
    this.getCheckedData.forEach((item) => {
      if (item.checked) {
        item.permission_group_items.forEach((elm) => {
          let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
            return elmPermission?.permission === elm.itemData?.permission;
          });
          if (elm.isChecked) {
            if (capableUpdate.length === 0) {
              this.itemToSubmit[0].itemToUpdate.push(elm.itemData);
            }
          }
          else if (!elm.isChecked) {
            if (capableUpdate.length > 0) {
              this.itemToSubmit[0].itemToDelete.push(elm.itemData);
            }
          }
        });
      }

      if (!item.checked) {
        item.permission_group_items.forEach((elm) => {
          console.log('elm', elm);
          let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
            return elmPermission?.permission === elm.itemData?.permission;
          });
          if (capableUpdate.length > 0) {
            this.itemToSubmit[0].itemToDelete.push(elm.itemData);
          }

        });
      }
    });

    this.itemToSubmit[1]['role_id'] = this.Id;
    this.addRolePermission(this.itemToSubmit)
  }

  //add data to api 
  addRolePermission(data) {
    console.log('data', data);

    this.spinner.show();
    this.subDataThree = this.authService.addRolePermission(data).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res) {
          this.itemToSubmit = [
            { itemToUpdate: [], itemToDelete: [] },
            { role_id: Number }
          ]
          console.log('role permission added successfully')

          this._snackBar.open('Role Permission added Successfully', '', {
            duration: 2000,
            panelClass: ['green-snackbar']
          })
          this.getAllPermission(this.Id)
        } else {
          console.log('Error! Please try again.')
          this.spinner.hide();
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err)
      }
    })
  }

  //get data form api 
  getAllPermission(id) {
    this.spinner.show();
    this.subDataFour = this.authService.getAllRolePermission(id).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res) {
          this.anotherFunc(res)
          console.log('data fatched successfully');

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
    res['data'].map((m: any) => {
      if (this.allPermissionGroup?.length > 0) {
        this.allPermissionGroup.map((item: any) => {
          if (item.id === m.permission_group_id) {
            item.checked = true;
            item['permission_group_items'].forEach((elm) => {
              if (m?.permission === elm?.itemData?.permission) {
                elm.isChecked = true;
              }
            });
          }
        })
      }
    })
    this.allRolePermisson = res['data'];
    this.getCheckedData = res['data'];
    this.getCheckedData = this.allPermissionGroup;
  }

  //when click check all permission

  checkAllPermission(event) {
    console.log(event.checked)
    if (event.checked === true && this.getCheckedData?.length > 0) {
      this.isButtonDisabled = false;
      console.log('this.isButtonDisabled', this.isButtonDisabled)

      this.getCheckedData.map((item) => {
        item.checked = true;
        item.permission_group_items.map((child) => {
          child.isChecked = true;
        })

      })
    }
    else if (event.checked === false) {
      this.getCheckedData.map((item) => {
        item.checked = false;
        item.permission_group_items.map((child) => {
          child.isChecked = false;
        })

      })
    }

  }

  /**
    * ON DESTROY
    */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }
}

