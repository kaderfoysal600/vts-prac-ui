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
  isLoadingFeaturedProducts: boolean = false;
  color = 'red'
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
      }
    })
  }


  getAllPermissionGroupItem() {
    this.spinner.show();
    this.subDataOne = this.authService.getAllPermissionGroupItem().subscribe({
      next: (res) => {

        if (res) {
          this.spinner.hide();
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
    this.authService.getAllPermissionGroup().subscribe({
      next: (res: any) => {
        console.log('res', res)
        this.spinner.hide();
        this.allp(res)
     
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }


  allp(data: any) {
   data?.map((item: any) => {
      item['permission_group_items'] = []
      this.allPermissionGroupItem?.map(item2 => {
        if (item.id == item2.permission_group_id) {
          item['permission_group_items'].push(item2)
        }
      })
    })
    console.log('data', data)
    this.newfunc(data)
  }

  private newfunc(d) {
    d?.forEach(item => {
      item.permission_group_items = item.permission_group_items?.map(val =>
        ({ itemData: val, isChecked: false })
      );
    });
    console.log('d', d)
    this.allPermissionGroup = d;
    this.getAllPermission(this.Id)

    
  }




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



  checkAllPermissions(event: any, item: any) {
    this.isButtonDisabled = false;
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






  itemTobeSubmit() {
    this.getCheckedData.forEach((item) => {
      if (item.checked) {
        item.permission_group_items.forEach((elm) => {
          if (elm.isChecked) {
            let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
              return elmPermission?.permission === elm.itemData?.permission;
            });
            if (capableUpdate.length === 0) {
              this.itemToSubmit[0].itemToUpdate.push(elm.itemData);
            }
          }
          else if (!elm.isChecked) {
            let capableUpdate = this.allRolePermisson.filter((elmPermission) => {
              return elmPermission?.permission === elm.itemData?.permission;
            });
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


  addRolePermission(data) {
    console.log('data', data);
    
    this.spinner.show();
    this.authService.addRolePermission(data).subscribe({
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



  getAllPermission(id) {
    this.spinner.show();
    this.subDataThree = this.authService.getAllRolePermission(id).subscribe({
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
    res['data'].map((m:any)=> {
      if (this.allPermissionGroup?.length > 0) {
        this.allPermissionGroup.map((item:any)=> {
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
    this.getCheckedData = res['data']   
    this.getCheckedData = this.allPermissionGroup;
    

  }


}

