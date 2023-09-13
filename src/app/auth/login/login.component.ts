import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { UiService } from 'src/app/service/ui.service';
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
  isLoggedIn = false;
  myAuthToken = sessionStorage.getItem('token');

  // Reactive Form
  loginForm: FormGroup;
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  // Subscriptions
  private subDataOne: Subscription;
  constructor(
    private authService: AuthService,
    public router: Router,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
    // this.getProtectedDtata()
    console.log('isLoggedIn', this.isLoggedIn)
  }


  onLogin() {
    if (this.loginForm.invalid) {
      console.log('Invalid Input field!');
      return;
    }
    // Form Data..
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const data = { email, password };


    this.subDataOne = this.authService.onLogin(data).subscribe({
      next: (res: LoginResponse) => {
        if (res) {
          console.log('res', res);
          console.log('login successfully')
          sessionStorage.setItem('token', res?.data?.accessToken)
          sessionStorage.setItem('email', res?.data?.email)
          // this.getPDtata()
          this.uiService.success('You are successfully logged in');
          this.router.navigate(['/', 'list-user']);

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
        this.uiService.wrong(err?.error?.error);
      }
    })
  }

  // getProtectedDtata(){
  //   this.authService.getProtectedData().subscribe({
  //     next: (res:any) => {
  //       console.log(res)
  //       if(res){
  //         this.isLoggedIn = true;
  //         console.log('this.isActivate', this.isLoggedIn);

  //       }
  //     },
  //     error: (err) => {}
  //   })
  // }
  /**
  * ON DESTROY
  */
  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
