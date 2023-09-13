import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  selectedValue: string;
  allRoles
  selectedFile: any = null;


  favoriteSeason: string;
  allGender: string[] = ['Male', 'Female', 'Others',];

  images: any;
  imgurl: string = null
  // Reactive Form
  loginForm: FormGroup;


    // Subscriptions
    private subDataOne: Subscription;
    private subDataTwo: Subscription;
    
  constructor(private authService: AuthService, public router: Router, private fb: FormBuilder,private _snackBar: MatSnackBar) { }
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
      photo: ['']
    });
    this.getRoleData()

  }
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      const image = event.target.files[0]
      this.selectedFile = event.target.files[0]
      this.images = image

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgurl = event.target.result;


      };
      reader.readAsDataURL(this.images);
    }
  }


  getRoleData() {
   this.subDataOne = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRoles = res
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

  /**
 * Login
 */
  onLogin() {
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
    formData.append('photo', this.images);
    console.log('log from data from frontend', formData);

   this.subDataTwo =  this.authService.addUser(formData).subscribe({
      next: (res) => {
        if (res) {
          console.log('res from api', res)
          console.log('user created successfully')
          this._snackBar.open('User Created Successfully', '', {
            duration: 2000,
            panelClass: ['green-snackbar']
          })
          this.router.navigate(['/', 'list-user']);

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
        this._snackBar.open(err.error.error, '', {
          duration: 2000,
          panelClass: ['red-snackbar']
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
}

}
