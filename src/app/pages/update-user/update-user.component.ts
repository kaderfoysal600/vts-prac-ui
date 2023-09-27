import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  allRoles
  allUser
  singleUser
  selectedFile: any = null;
  images: any;
  imgurl: string = null
  loginForm: FormGroup;
  allGender: string[] = ['Male', 'Female', 'Other',];
  Id: string;
  oldPhoto:any;
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private authService: AuthService,
    public router: Router,
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      mobile: [''],
      email: [''],
      address: [''],
      role_id: [''],
      gender: [''],
      password: [''],
      photo: [''],
    });
    this.getRoleData()
    this._route.paramMap.subscribe(params => {
      this.Id = params.get("id");
      console.log('Id', this.Id);

    });
    console.log('this.singleUser', this.singleUser);
    this.getUserById()

  }

  getUserById() {
    this.spinner.show();
    this.subDataOne = this.authService.getAllUser().subscribe({
      next: (res) => {
        if (res) {
          this.allUser = res
          this.singleUser = this.allUser.find(user => user.id == this.Id)
          console.log('singleUser', this.singleUser)
          this.setUser(this.singleUser);
          console.log('this.singleUser.photo', this.singleUser.photo);

          this.selectedFile = this.singleUser.photo
          this.spinner.hide();

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

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0]
      this.images = image
      this.selectedFile = event.target.files[0].name

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgurl = event.target.result;
      };
      reader.readAsDataURL(this.images);
    }

  }


  getRoleData() {
    this.spinner.show();
    this.subDataTwo = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRoles = res
          console.log(res)
          this.spinner.hide();

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

  setUser(data) {
    console.log('old data', data);
    this.oldPhoto = data?.photo
    //console.log(sim); //[0]  added
    this.loginForm.patchValue({
      first_name: data.first_name,
      last_name: data.last_name,
      mobile: data.mobile,
      email: data.email,
      address: data.address,
      role_id: data.role_id
      , gender: data.gender,
      photo: data?.photo,
      password: data.password,
    });
  }
  /**
* Login
*/
  onUpdate() {
    this.spinner.show();
    if (this.loginForm.invalid) {
      console.log('Invalid Input field!');
      return;
    }
    const formData = new FormData();
    formData.append('first_name', this.loginForm.get('first_name').value);
    formData.append('last_name', this.loginForm.get('last_name').value);
    // formData.append('name', this.loginForm.get('first_name').value);
    formData.append('mobile', this.loginForm.get('mobile').value);
    formData.append('email', this.loginForm.get('email').value);
    formData.append('address', this.loginForm.get('address').value);
    formData.append('role_id', this.loginForm.get('role_id').value);
    formData.append('gender', this.loginForm.get('gender').value);
    formData.append('password', this.loginForm.get('password').value);
    if (this.images == undefined) {
      formData.append('photo',this.oldPhoto);
      console.log("formData.append('photo',this.oldPhoto);", formData.append('photo',this.oldPhoto));
      
      console.log('eeeeeee')
    }
    else if(this.images){
      console.log('this.images', this.images)
      formData.append('photo', this.images);
    }
    console.log('this.images', this.images);

    console.log('log from data from frontend', formData);

    this.subDataThree = this.authService.updateUserById(this.Id, formData).subscribe({
      next: (res) => {
        if (res) {
          this.spinner.hide();
          console.log('res from api', res)
          console.log('login successfully');
          this._snackBar.open('User Updated Successfully', '', {
            duration: 1000
          })
          this.router.navigate(['/', 'list-user']);

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
        this.spinner.hide();
        this._snackBar.open('Something Went wrong', '', {
          duration: 1000
        })
      }
    })
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
  }


}
