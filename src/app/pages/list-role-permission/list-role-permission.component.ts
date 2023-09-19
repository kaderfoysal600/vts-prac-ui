import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RolePermissionDialogComponent } from 'src/app/dialog/role-permission-dialog/role-permission-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { UiService } from 'src/app/service/ui.service';

@Component({
  selector: 'app-list-role-permission',
  templateUrl: './list-role-permission.component.html',
  styleUrls: ['./list-role-permission.component.scss']
})
export class ListRolePermissionComponent implements OnInit {

  allRolePermissions


  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;

  
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
    // this.getAllRolePermission()

  }


  // getAllRolePermission() {
  //  this.subDataOne = this.authService.getAllRolePermission().subscribe({
  //     next: (res) => {
  //       if (res) {
  //         this.allRolePermissions = res
  //         console.log(res)

  //       } else {
  //         console.log('Error! Please try again.')
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err)
  //     }
  //   })
  // }

  public openEditControllerDialog(data?: any) {
    const dialogRef = this.dialog.open(RolePermissionDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && dialogResult.data) {
        if (data) {
          this.updateRolePermission(data.id, dialogResult.data);
        } else {
          this.addRolePermission(dialogResult.data);
        }
      }
    });
  }


  addRolePermission(data: any) {
    this.subDataTwo = this.authService.addRolePermission(data)
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('Role Permission added successfully')
            this.uiService.success('Role Permission added successfully');
            // this.getAllRolePermission()
          } else {
            console.log('Error! Please try again.')
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
  }



  public updateRolePermission(id: string, data: any) {
   this.subDataThree = this.authService.updateRolePermission(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Role Permission updated successfully');
        if (res) {
          // this.getAllRolePermission()
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  deleteRolePermission(id: string) {
    this.subDataFour = this.authService.deleteRolePermission(id).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Role Permission deleted successfully');
        if (res) {
          // this.getAllRolePermission()
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
