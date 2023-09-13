import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  favoriteSeason: string;
  allGender: string[] = ['Male', 'Female', 'Other'];

  // Store Data+
  userdata: any;
  allRoles: any;
  images: any;
  imgurl: string = null
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
    this.getAllRole()
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0]
      this.images = image
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgurl = event.target.result;
        console.log( this.images)
        this.dataForm.patchValue({ photo: this.images });
      };
      reader.readAsDataURL(this.images);
    }
  }

  /**
 * INIT FORM & Submit
 * initDataForm()
 * setFormValue()
 * onSubmit()
 */
  private initDataForm() {
    this.dataForm = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      mobile: [null],
      address: [null],
      gender: [null],
      password: [null],
      role_id: [null],
      photo: [null]
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
