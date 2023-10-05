import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; 
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(public http: HttpClient,public router: Router) { }

  
  //role
  getAllrole() {
    return this.http.get('http://localhost:3000/api/listRole');
  }
  addRole(data: any) {
    return this.http.post('http://localhost:3000/api/addRole', data)
  }

  updateRoleById(id: string, data: any) {
    return this.http.put('http://localhost:3000/api/updateRole/' + id, data);
  }
  
  deleteRoleById(id: string) {
    return this.http.delete('http://localhost:3000/api/deleteRole/' + id);
  }



  //permission-group

  addPermissionGroup(data: any) {
    return this.http.post('http://localhost:3000/api/addPermissionGroup', data)
  }
  getAllPermissionGroup() {
    return this.http.get('http://localhost:3000/api/getPermissionGroups');
  }
  updatePermissionGroupById(id: string, data: any) {
    return this.http.put('http://localhost:3000/api/updatePermissionGroup/' + id, data);
  }

  deletePermissionGroup(id: string) {
    return this.http.delete('http://localhost:3000/api/deletePermissionGroup/' + id);
  }
  //permission-group-item

  addPermissionGroupItem(data: any) {
    return this.http.post('http://localhost:3000/api/addPermissionGroupItem', data)
  }
  getAllPermissionGroupItem() {
    return this.http.get('http://localhost:3000/api/getPermissionGroupItems');
  }

  
  getAllPermissionGroupItemSearch(page, size, filterData: any) {
    return this.http.post(`http://localhost:3000/api/getPermissionGroupItemsSearch?page=${page}&size=${size}`, filterData);
  }

  getAllPermissionGroupItem1(page, size) {
    return this.http.get(`http://localhost:3000/api/getPermissionGroupItems1?page=${page}&size=${size}`);
  }
  deletePermissionGroupItem(id: string) {
    return this.http.delete('http://localhost:3000/api/deletePermissionGroupItem/' + id);
  }
  updatePermissionGroupItem(id: string, data: any) {
    return this.http.put('http://localhost:3000/api/updatePermissionGroupItem/' + id, data);
  }
  //user

  addUser(data: any) {
    return this.http.post('http://localhost:3000/api/addUser', data)
  }
  onLogin(data: any,) {
    return this.http.post('http://localhost:3000/api/login', data)
  }
  getAllUser() {
    return this.http.get('http://localhost:3000/api/listUser');
  }

  getProtectedData(): Observable<any> {
    const token = sessionStorage.getItem('token'); // Get token from session storage

    if (!token) {
      console.error('No token found');
      this.router.navigate(['/auth/login']);
      return new Observable();
      
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get('http://localhost:3000/api/protected-route', { headers });
  }









  deleteUserById(id: string) {
    return this.http.delete('http://localhost:3000/api/deleteuser/' + id);
  }

  updateUserById(id: string, data: any) {
    return this.http.put('http://localhost:3000/api/editUser/' + id, data);
  }

  //add role permission

  addRolePermission(data: any) {
    return this.http.post('http://localhost:3000/api/addRolePermission', data)
  }

  getAllRolePermission(id) {
    return this.http.get(`http://localhost:3000/api/getRolePermissions/${id}`);
  }
  deleteRolePermission(id: string) {
    return this.http.delete('http://localhost:3000/api/deleteRolePermission/' + id);
  }
  updateRolePermission(id: string, data: any) {
    return this.http.put('http://localhost:3000/api/updateRolePermission/' + id, data);
  }



  // getLoggedinUser(token: string | null) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   });
  //   return this.http.get('http://localhost:3000/api/auth/getSigninUser', {
  //     headers: headers,
  //   });
  // }


  // loginUser(data: any) {
  //   return this.http.post('http://localhost:3000/api/addUser', data)
  // }
}
