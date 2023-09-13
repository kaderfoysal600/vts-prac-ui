import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
interface LoginResponse {
  message: string;
  status: string;
  data: {
    id: number;
    email: string;
    accessToken: string;
    // You can include other properties if they are present in the actual response
  };
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoggedIn:Boolean = false;
  myAuthToken =sessionStorage.getItem('token');
 
  // Reactive Form
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  constructor(private authService :AuthService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password:this.password
    });
    console.log('this.myAuthToken,',  this.myAuthToken)
  }


  onLogin() {
    if (this.loginForm.invalid) {
     console.log('Invalid Input field!');
      return;
    }
    // Form Data..
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const data = {email,password};


    this.authService.onLogin(data ).subscribe({
      next: (res:LoginResponse) => {
        if (res ) {
          console.log('res',res);
          console.log('login successfully')
          sessionStorage.setItem('token', res?.data?.accessToken)
          // this.getProtectedDtata()
             
        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  // getProtectedDtata(){
  //   this.authService.getProtectedData().subscribe({
  //     next: (res:any) => {
  //       console.log(res)
  //       if(res){
  //         this.isLoggedIn = true;
  //         console.log('this.isLoggedIn', this.isLoggedIn);
  //         sessionStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
          
  //       }
  //     },
  //     error: (err) => {}
  //   })
  // }


}
