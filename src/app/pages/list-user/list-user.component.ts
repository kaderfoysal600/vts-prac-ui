import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserEditDialogComponent } from 'src/app/dialog/user-edit-dialog/user-edit-dialog.component';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  allUser:any;
  allRole:any;
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router :Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllRole();
    this.getAllUser();
  }


  getAllUser() {
  this.subDataOne = this.authService.getAllUser().subscribe({
      next: (res) => {
        if (res) {
          this.allUser = res
          console.log('res', res)
          this.getAllUserWithRoleName()

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getAllRole() {
    this.subDataFour = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRole = res
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

  getAllUserWithRoleName(){
    this.allUser.map((user) => {
      this.allRole.map(role => {
        if(user.role_id === role.id){
          user["role_name"] = role.name;
        }
      });
    })
  }

  public openEditControllerDialog(data?: any) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && dialogResult.data) {
        if (data) {
          this.updateUserById(data.id, dialogResult.data);
        } else {
          this.addUser(dialogResult.data);
        }
      }
    });
  }


  addUser(data: any) {
    this.subDataTwo = this.authService.addUser(data)
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('res from api ss', res);
            this._snackBar.open('User Added Successfully', '', {
              duration: 3000
            })
            console.log('User added successfully')
            this.getAllUser()
          } else {
            console.log('Error! Please try again.')
    
          }
        },
        error: (err) => {
          console.log(err)
          this._snackBar.open('Error! Please try again.', '', {
            duration: 3000
          })
        }
      })
  }

  editUser(data) {
    this.router.navigate(["/updateUser", data.id]);
  }

  public updateUserById(id: string, data: any) {
    this.subDataThree  = this.authService.updateUserById(id, data).subscribe({
      next: (res) => {

        console.log(res);
        if (res) {
          this.getAllUser()
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  deleteUser(id: string) {
    this.subDataFour = this.authService.deleteUserById(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          // this._snackBar.open('User Deleted Successfully','Undo');  
           this._snackBar.open('User Deleted Successfully', '', {
            duration: 1000
          })
          this.getAllUser()
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
  }

}
