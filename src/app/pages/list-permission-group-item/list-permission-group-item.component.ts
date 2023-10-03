import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
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
  

  //store data for search 
  filteredData
  groupId
  // Pagination
  page: number = 1;
  itemsPerPage = 5;
  totalItems: any;
  // Subscriptions

  dataSource
  displayedColumns = ['id', 'group', 'name', 'permission', 'weight', 'status', 'action'];
  states = [{ id: 0, value: 'Inactive' }, { id: 1, value: 'Active' }];

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;
  @ViewChild('input', { static: false }) input: ElementRef;
  selectedGroup;

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
    public http: HttpClient,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    // this.getAllPermissionGroupItem()
    // this.getAllPermissionGroup();
    this.loggedInUserRolePermission = this.userDataService.getLoggedInUserRolePermission();
    this.getAllPermissionGroupItemExtra(null)
  }

  getAllPermissionGroupItemExtra(page: any) {
    this.spinner.show();
    this.subDataOne = this.authService.getAllPermissionGroupItem1(page, this.itemsPerPage).subscribe({
      next: (res) => {
        if (res) {
          this.spinner.hide();
          console.log('allPermissionGroupItem', res);
          this.allPermissionGroupItem = res['data'];
          this.getAllPermissionGroup()
          this.totalItems = res['totalData'];
          this.updateDataSource(this.allPermissionGroupItem)

        } else {
          this.spinner.hide();
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err)
      }
    })
  }


  getAllPermissionGroup() {
    this.subDataFive = this.authService.getAllPermissionGroup().subscribe({
      next: (res) => {
        if (res) {
          this.allPermissionGroup = res
          console.log('allPermissionGroup', this.allPermissionGroup)
          this.allPermissionGroupItem.forEach((item1: any) => {
            this.allPermissionGroup.forEach((item) => {
              if (item.id === item1.permission_group_id) {
                item1.permission_group_name = item.name
              }
            });
          });
          // console.log(res)

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
    // this.updateDataSource(this.allPermissionGroupItem)

    this.groupId = e.id
    // console.log('this.groupId', this.groupId);
    // let x = this.dataSource.filter((item) => {
    //   return e.id === item?.permission_group_id
    // })
    // this.updateDataSource(x);

    // this.dataSource = x
    // console.log('this.dataSource', x);

  }


  updateDataSource(newData: any[]) {
    this.dataSource = newData;

    // Notify the MatTable that the data has changed
    this.changeDetectorRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = filterValue;
  }

  itemSearchStart() {
    this.updateDataSource(this.allPermissionGroupItem)

    let searchVal = [];
    if(this.filteredData && this.groupId){
      let x = this.dataSource.filter((item) => item.name.toLowerCase().includes(this.filteredData))
      let y = x.filter((item) => {
        return this.groupId === item?.permission_group_id
      })
      searchVal = [...y];
    }
    if( this.filteredData && !this.groupId ){
      let x = this.dataSource.filter((item) => item.name.toLowerCase().includes(this.filteredData))
      searchVal = [...x];
    }
    if(this.groupId && !this.filteredData ){
      let y = this.dataSource.filter((item) => {
        return this.groupId === item?.permission_group_id
      })
      searchVal = [...y];
    }
    

    console.log('searchVal', searchVal);
    
    this.updateDataSource(searchVal);

    // Clear the input field value after searching
    const inputElement: HTMLInputElement = this.input.nativeElement;
    inputElement.value = '';
    this.filteredData = ''; 
    this.groupId = '';
    this.selectedGroup = '';

  }

  onClearFilter() {
    this.groupId = '';
    this.filteredData = '';
    this.selectedGroup = '';

    this.updateDataSource(this.allPermissionGroupItem)
    console.log('filter data cleared')
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
