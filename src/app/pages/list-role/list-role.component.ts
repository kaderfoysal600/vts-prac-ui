import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoleDialogComponent } from 'src/app/dialog/role-dialog/role-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { UiService } from 'src/app/service/ui.service';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {
  allRole
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UiService,
    private router :Router,
  ) { }

  ngOnInit(): void {
    this.getAllRole()

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

  public openEditControllerDialog(data?: any) {
    console.log('data open to dialog', data)
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && dialogResult.data) {
        if (data) {
          console.log('edit data', data);

          this.updateRoleById(data.id, dialogResult.data);
        } else {
          this.addRole(dialogResult.data);
        }
      }
    });
  }


  addRole(data: any) {
    this.subDataOne = this.authService.addRole(data)
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('Role added successfully')
            this.uiService.success('Role added successfully');
            this.getAllRole()
          } else {
            console.log('Error! Please try again.')
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
  }



  public updateRoleById(id: string, data: any) {
    this.subDataTwo = this.authService.updateRoleById(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Role updated successfully');
        if (res) {
          this.getAllRole()
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  deleteRole(id: string) {
    this.subDataThree = this.authService.deleteRoleById(id).subscribe({
      next: (res) => {
        console.log('result', res);
        this.uiService.success('Role Deleted successfully');
        if (res) {
          this.getAllRole()
        }
      },
      error: (err) => {
        console.log('error', err);
        this.uiService.wrong('Role Delete failure');
      },
    });
  }

  addPermission(data) {
    this.router.navigate(["/edit-permission", data.id]);
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
