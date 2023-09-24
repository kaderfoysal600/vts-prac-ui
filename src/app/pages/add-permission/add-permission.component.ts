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
  itemChecked = false;
  checked = false;
  isButtonDisabled = true;
  allRolePermisson : any = [];
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  getCheckedData: any

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
      let itemAdd: Boolean;
      let deleteId;
        this.authService.addRolePermission(this.checkedData).subscribe({
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
    setTimeout(() => {
      this.getAllPermission(this.Id);
    }, 2000);
  }



  checkAllPermissions(event: any, item: any) {
    this.isButtonDisabled = false;
    console.log('item', item);
    console.log('event', event);
   this.itemChecked =  event.checked;
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
    console.log(' this.allRolePermisson',  this.allRolePermisson)
    const checkArray1: FormArray = this.form.get('checkArray1') as FormArray;
    console.log('checkArray1-1', checkArray1);
    console.log('checkedData', this.getCheckedData)
    this.getCheckedData.forEach((item)=> {
      // this.form.get('permission_group_id').setValue(item.id);
    
    item.permission_group_items.map((child)=> {
      console.log('child', child?.itemData?.permission);
      if(child?.itemData?.permission === e.source.value.itemData.permission){
        if(checkArray1.value.length<=0){
          checkArray1.push(new FormControl(item));
        console.log('checkArray1', checkArray1);
        console.log('item', item?.permission_group_items);
        }
        
        


        
      }
      // let allChieldCheckFalse = e.source

    })
      
    })
    // if (e.isChecked) {
    //   console.log(name, 'checkedhhhhhhhhhh')
    //   checkArray.push(new FormControl(e.source.value));
    // }
    // else {
    //   let index = checkArray.controls.findIndex(x => x.value == name)
    //   checkArray.removeAt(index);

    // }
  }




  checkAllP() {
    console.log("Check All Permissions");
    console.log(this.checkedData);

  }


  getAllPermission(id) {

    this.subDataThree = this.authService.getAllRolePermission(id).subscribe({
      next: (res) => {
        if (res) {
          console.log('role permission', res['data']);
          this.allRolePermisson = res['data'];
          this.anotherFunc(res)
          // this.staticDataFunc(res)
     
          console.log('this.getCheckedData', this.getCheckedData);
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
      

      for (const item of this.allPermissionGroup) {
        console.log('item', item)
        if (item.id === m.permission_group_id) {
          item.checked = true;
       
          item['permission_group_items'].forEach((elm) => {

            res['data'].forEach(e => {
              // let permissionIndex = 0;
              if (e?.permission === elm?.itemData?.permission) {
                elm.isChecked = true;

                // elm['itemData'] = res['data'][permissionIndex];
                // permissionIndex++;
              }

            })




          });
        }
      }

    }
    this.getCheckedData = this.allPermissionGroup;
    console.log('this.form.value', this.form.value)
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
