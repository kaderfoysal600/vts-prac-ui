import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }


  private loggedInUserRolePermission: any;

  setLoggedInUserRolePermission(data: any) {
    this.loggedInUserRolePermission = data;
  }

  getLoggedInUserRolePermission() {
    return this.loggedInUserRolePermission;
  }
}
