import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
interface Status1 {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss']
})
export class RoleDialogComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  // Store Data+
  roleData: any;
  allRoles: any;
  allStatus: Status1[] = [
    {value: 1, viewValue: 'Active'},
    {value: 2, viewValue: 'Inactive'}
  ];
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
   console.log( 'this.data.status', this.data.status, )
    if (this.data) {
      this.roleData = this.data;
      this.setFormValue();
    }
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
      name: [null, Validators.required],
      description: [null, Validators.required],
      status: [null, [Validators.required]],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.roleData);
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


  private getAllRole() {
    this.authService.getAllrole().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allRoles = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
