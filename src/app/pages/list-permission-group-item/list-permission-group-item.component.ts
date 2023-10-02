import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
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

  allPermissionGroupItem: any = null;
  allPermissionGroup: any = null;
  loggedInUserRolePermission: any;
  // Pagination
  page: number = 1;
  itemsPerPage = 5;
  totalItems : any; 
  // Subscriptions

  dataSource
  displayedColumns = ['id', 'group', 'name', 'permission', 'weight', 'status', 'action'];
  states = [{ id: 0, value: 'Inactive' }, { id: 1, value: 'Active' }];

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;

  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UiService,
    private userDataService: UserDataService,
    private changeDetectorRef: ChangeDetectorRef,
    public http: HttpClient

  ) { }

  ngOnInit(): void {
    // this.getAllPermissionGroupItem()
    // this.getAllPermissionGroup();
    this.loggedInUserRolePermission = this.userDataService.getLoggedInUserRolePermission();
    console.log(' this.loggedInUserRolePermission', this.loggedInUserRolePermission);
    this.getAllPermissionGroupItemExtra(null)
  }


  // getAllPermissionGroupItem() {
  //   this.subDataOne = this.authService.getAllPermissionGroupItem().subscribe({
  //     next: (res) => {
  //       if (res) {
  //         this.allPermissionGroupItem = res
  //         this.getAllPermissionGroup()
  //         this.page =  0;
  //         this.totalItems = this.allPermissionGroupItem.length;
  //         // this.dataSource = res

  //         this.updateDataSource(this.allPermissionGroupItem)
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




  getAllPermissionGroupItemExtra(page:any) {
    console.log('page', page);
    
    this.subDataOne = this.authService.getAllPermissionGroupItem1(page, this.itemsPerPage).subscribe({
      next: (res) => {
        if (res) {
          console.log('ressss', res);
          
          this.allPermissionGroupItem = res['data'];
          this.getAllPermissionGroup()
          // this.page =  0;
          this.totalItems = res['totalData'];
          console.log('this.allPermissionGroupItem', this.allPermissionGroupItem);
          this.updateDataSource(this.allPermissionGroupItem)

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
            // this.getAllPermissionGroupItem()
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
    this.subDataThree = this.authService.updatePermissionGroupItem(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Permission Group Item Updated successfully');
        if (res) {
          this.getAllPermissionGroupItemExtra(null)
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
          this.getAllPermissionGroupItemExtra(null)
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  dropTable(event: CdkDragDrop<any[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  onSelectGroup(e) {
    this.updateDataSource(this.allPermissionGroupItem)
    console.log('eeeee', e);
    let x = this.dataSource.filter((item) => {
      return e.id === item?.permission_group_id
    })
    this.updateDataSource(x)

    // this.dataSource = x
    // console.log('this.dataSource', x);

  }


  updateDataSource(newData: any[]) {
    this.dataSource = newData;

    // Notify the MatTable that the data has changed
    this.changeDetectorRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.updateDataSource(this.allPermissionGroupItem)
    console.log('eeeee', event);
    let x = this.dataSource.filter((item) => item.name.toLowerCase().includes(filterValue))
    this.updateDataSource(x)
  }

  onClearFilter() {
    this.updateDataSource(this.allPermissionGroupItem)
    console.log('asaaaa')
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
