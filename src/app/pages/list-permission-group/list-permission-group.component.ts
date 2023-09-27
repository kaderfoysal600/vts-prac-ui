import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PermissionGroupDialogComponent } from 'src/app/dialog/permission-group-dialog/permission-group-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { UiService } from 'src/app/service/ui.service';

@Component({
  selector: 'app-list-permission-group',
  templateUrl: './list-permission-group.component.html',
  styleUrls: ['./list-permission-group.component.scss']
})
export class ListPermissionGroupComponent implements OnInit{

  allPermissionGroup
  buttonDisabled :Boolean = false;
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  dataSource: MatTableDataSource<any>; 
   @ViewChild(MatPaginator) paginator: MatPaginator;
  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UiService,
   
  ) {

   }

  ngOnInit(): void {
    this.getAllPermissionGroup()
  }

  getAllPermissionGroup() {
  this.subDataOne = this.authService.getAllPermissionGroup().subscribe({
      next: (res) => {
        if (res) {
          this.allPermissionGroup = res
          console.log(res)
          this.dataSource = new MatTableDataSource(this.allPermissionGroup);
          this.dataSource.paginator = this.paginator;
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
    console.log('dialogResult.data', data)
    const dialogRef = this.dialog.open(PermissionGroupDialogComponent, {
      
      maxWidth: '600px',
      width: '95%',
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && dialogResult.data) {
        if (data) {
          this.updatePermissionGroupById(data.id, dialogResult.data);
          
        } else {
          this.addPermissionGroup(dialogResult.data);
        }
      }
    });
  }


  addPermissionGroup(data: any) {
    this.subDataTwo = this.authService.addPermissionGroup(data)
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('Permission Group added successfully')
            this.uiService.success('Permission Group added successfully');
            
            this.getAllPermissionGroup()
          } else {
            console.log('Error! Please try again.')
            
          }
        },
        error: (err) => {
          console.log(err)
          this.uiService.wrong('Error! Please try again.');
        }
      })
  }

  public updatePermissionGroupById(id: string, data: any) {
    this.subDataThree = this.authService.updatePermissionGroupById(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Permission Group Updated successfully');
        if (res) {
          this.getAllPermissionGroup()
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePermissionGroup(id: string) {
    this.subDataFour = this.authService.deletePermissionGroup(id).subscribe({
      next: (res) => {
        console.log('result', res);
          this.uiService.success('Permission Group deleted successfully');
        if (res) {
          this.getAllPermissionGroup()
        }
      },
      error: (err) => {
        console.log(err);
        this.uiService.wrong('Permission Group delete failure');
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
