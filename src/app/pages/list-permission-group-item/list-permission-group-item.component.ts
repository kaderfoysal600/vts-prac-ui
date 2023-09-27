import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PermissionGroupItemDialogComponent } from 'src/app/dialog/permission-group-item-dialog/permission-group-item-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { UiService } from 'src/app/service/ui.service';
import { UserDataService } from 'src/app/shared/service/user-data.service';

@Component({
  selector: 'app-list-permission-group-item',
  templateUrl: './list-permission-group-item.component.html',
  styleUrls: ['./list-permission-group-item.component.scss']
})
export class ListPermissionGroupItemComponent implements OnInit {

  allPermissionGroupItem:any= null;
  allPermissionGroup:any= null;
  loggedInUserRolePermission: any;
    // Pagination
    p: number = 1;
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UiService,
    private userDataService: UserDataService
    
  ) { }

  ngOnInit(): void {
    this.getAllPermissionGroupItem()
    this.getAllPermissionGroup();
    this.loggedInUserRolePermission = this.userDataService.getLoggedInUserRolePermission();
    console.log(' this.loggedInUserRolePermission',  this.loggedInUserRolePermission);
    

  }


  getAllPermissionGroupItem() {
  this.subDataOne = this.authService.getAllPermissionGroupItem().subscribe({
      next: (res) => {
        if (res) {
          this.allPermissionGroupItem = res
          this.getAllPermissionGroup()
     
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


  getAllPermissionGroup() {
    this.subDataFive = this.authService.getAllPermissionGroup().subscribe({
        next: (res) => {
          if (res) {
            this.allPermissionGroup = res
            this.allPermissionGroupItem.forEach((item1: any) => {
              this.allPermissionGroup.forEach((item) => {
                if (item.id === item1.permission_group_id) {
                  item1.permission_group_name = item.name
                }
              });
            });
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



  public openEditControllerDialog(data?: any) {
    const dialogRef = this.dialog.open(PermissionGroupItemDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && dialogResult.data) {
        if (data) {
          this.updatePermissionGroupItem(data.id, dialogResult.data);
        } else {
          this.addPermissionGroupItem(dialogResult.data);
        }
      }
    });
  }


  addPermissionGroupItem(data: any) {
    this.subDataTwo = this.authService.addPermissionGroupItem(data)
      .subscribe({
        next: (res) => {
          console.log('res', res)
          if (res) {
            console.log('Permission Group Item added successfully', res)
            this.uiService.success('Permission Group Item added successfully');
            this.getAllPermissionGroupItem()
          } else {
            console.log('Error! Please try again.')
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
  }



  public updatePermissionGroupItem(id: string, data: any) {
    this.subDataThree =  this.authService.updatePermissionGroupItem(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Permission Group Item Updated successfully');
        if (res) {
          this.getAllPermissionGroupItem()
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  deletePermissionGroupItem(id: string) {
    this.subDataFour = this.authService.deletePermissionGroupItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Permission Group Item deleted successfully');
        if (res) {
          this.getAllPermissionGroupItem()
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
