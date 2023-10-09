import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../shared/service/user-data.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  loggedInEmail: any;

  loggedInUserRolePermission: any;


  private subDataOne: Subscription;

  LoggedInUserRoleId: any;
  constructor(
    public router: Router,
    private userDataService: UserDataService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.LoggedInUserRoleId = sessionStorage.getItem('role');
    this.loggedInEmail = sessionStorage.getItem('email');
    // Retrieve the data from the shared service when the component initializes.
    this.loggedInUserRolePermission = this.userDataService.getLoggedInUserRolePermission();
    // If it's not already set, fetch it from your API.
    if (!this.loggedInUserRolePermission) {
      this.getLogedInUserPermissionformApi();
    }
  }




  getLogedInUserPermissionformApi() {
    // this.spinner.show();
    this.subDataOne = this.authService.getAllRolePermission(this.LoggedInUserRoleId).subscribe({
      next: (res) => {
        if (res) {
          this.loggedInUserRolePermission = res['data']
          console.log('res1223', res['data'])

          this.userDataService.setLoggedInUserRolePermission(this.loggedInUserRolePermission);
          // this.spinner.hide();
          // this.updateloggedInUserRolePermission()

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        // this.spinner.hide();
        console.log(err)
      }
    })
  }



  onLogOut() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email')
    this.router.navigate(['/auth/login']);
  }

}



