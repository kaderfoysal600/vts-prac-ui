import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-role-permission-dialog',
  templateUrl: './role-permission-dialog.component.html',
  styleUrls: ['./role-permission-dialog.component.scss']
})
export class RolePermissionDialogComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data+
  userdata: any;
  allPermissionGroup: any;
  allRole:any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();
    if (this.data) {
      this.userdata = this.data;
      this.setFormValue();
    }
    this.getAllPermissionGroup()
    this.getAllRole()
  }


    /**
 * INIT FORM & Submit
 * initDataForm()
 * setFormValue()
 * onSubmit()
 */
    private initDataForm() {
      this.dataForm = this.fb.group({
        permission: [null, Validators.required],
        role_id: [null],
        permission_group_id: [null],
      });
    }
  
    private setFormValue() {
      this.dataForm.patchValue(this.userdata);
    }
  
    onSubmit() {
      if (this.dataForm.invalid) {
        return;
      }
      this.dialogRef.close({
        data: this.dataForm.value,
      });
      console.log('user data from frontend', this.dataForm.value);
    }
  
    /**
     * ON CLOSE DIALOG
     */
    onClose() {
      this.dialogRef.close();
    }
  
  
    private getAllPermissionGroup() {
      this.authService.getAllPermissionGroup().subscribe({
        next: (res: any) => {
          console.log(res);
          this.allPermissionGroup = res;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
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


}
