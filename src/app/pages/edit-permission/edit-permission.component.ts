import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  checked = false;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;

  getCheckedData: any;


  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.Id = parseInt(params.get("id"))
      console.log('Id', this.Id);
    });
    this.getAllPermission(this.Id)
  }


  data = [
    {
      permission_group_id: 17,
      permissions: [
        { isChecked: true, permission: 'Address_Book_Link' },
        { isChecked: true, permission: 'Address_Book_Link' },
        { isChecked: true, permission: 'Address_Book_Link' },
        { isChecked: true, permission: 'Address_Book_Link' },
      ],
    }
  ];



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



  getAllPermission(id) {
    this.subDataOne = this.authService.getAllRolePermission(id).subscribe({
      next: (res) => {
        if (res) {
          console.log('role permission', res);
          this.anotherFunc(res)
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

    res['data'].map((m) => {
      let parentBoolean = this.allPermissionGroup?.some((item) => {
        return item.id === m.permission_group_id
      });
      console.log('parentBoolean', parentBoolean)

      this.allPermissionGroup?.forEach((item: any) => {
        console.log('item...', item.id);
        console.log('m.permission_group_id', m.permission_group_id)
        if (parentBoolean) {
          item.checked = true;
          let permissionIndex = 0;
          item['permission_group_items'].map((elm) => {

            let childCheckd = res['data'].some(e => {
              return e?.permission === elm?.itemData?.permission
            })
            console.log('childCheckd', childCheckd)

            console.log('elm', elm?.itemData?.permission);
            console.log('m', res['data'][permissionIndex]?.permission)

            if (childCheckd) {
              console.log("res['data'][permissionIndex]?.permission", res['data'][permissionIndex]?.permission)

              elm.isChecked = true;
              elm['itemData'] = res['data'][permissionIndex];
              console.log("res['data'][permissionIndex];", res['data'][permissionIndex])
              permissionIndex++;

            } else if (!childCheckd){
              elm.isChecked = false;
            }



          });
          console.log('item.permission_group_items', item?.permission_group_items);
        } else if (!parentBoolean) {
          item.checked = false
        }

      });
    });


    this.getCheckedData = this.allPermissionGroup;
    console.log(' this.getCheckedData', this.getCheckedData)
  }

}
