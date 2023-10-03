import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
export interface Select {
  value: any;
  viewValue?: any;
}



@Component({
  selector: 'app-permission-group-item-dialog',
  templateUrl: './permission-group-item-dialog.component.html',
  styleUrls: ['./permission-group-item-dialog.component.scss']
})
export class PermissionGroupItemDialogComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

    // Static Data
    allStatus: any[] = [
      {value: 1, viewValue: 'Active'},
      {value: 0, viewValue: 'Inactive'}
    ];
    // selectedFood = this.allStatus[1].value;

  // Store Data+
  userdata: any;
  allPermissionGroup: any;
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
  }


    /**
 * INIT FORM & Submit
 * initDataForm()
 * setFormValue()
 * onSubmit()
 */
    private initDataForm() {
      this.dataForm = this.fb.group({
        name: [null, Validators.required],
        permission: [null, Validators.required],
        weight: [null],
        status: [null, Validators.required],
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

}
