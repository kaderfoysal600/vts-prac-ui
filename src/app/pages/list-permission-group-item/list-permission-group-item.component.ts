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

  allStatus: any[] = [
    {value: 1, viewValue: 'Active'},
    {value: 0, viewValue: 'Inactive'}
  ];

  allPermissionGroupItem: any = null;
  allPermissionGroup: any = null;
  loggedInUserRolePermission: any;
  

  //store data for search 
  filteredData
  groupId
  filterStatus
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
    console.log('event', event);
    
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    console.log('prevIndex', prevIndex);
    
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    console.log('event.currentIndex', event.currentIndex);

    this.dataSource.map((d, index) =>  {
      if (d === event.item.data) {
        d.weight = event.currentIndex + 1; // Set the weight based on the new position
      } else if (index >= event.currentIndex) {
        // Update the weight of elements after the dragged item
        d.weight = index + 1; // Adjust the weight accordingly
      }
    });
           console.log('UpdatedData', this.dataSource);
    
    
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
    if(this.filteredData ){
      let x = this.dataSource.filter((item) => item.name.toLowerCase().includes(this.filteredData));
        searchVal = [...x];
      if(this.groupId){
        let y = searchVal.filter((item1) =>  this.groupId === item1?.permission_group_id)
         searchVal = [...y];
         console.log('this.filterStatus', this.filterStatus);
         
         if(this.filterStatus === 0 || this.filterStatus === 1){
          let z = searchVal.filter((v)=> v.status === this.filterStatus);
          console.log('z', z);
          searchVal = [...z];
         }
      }
      
    }

    if(this.groupId &&  this.filterStatus === 0 || this.filterStatus === 1 && !this.filteredData ){
      let y = this.dataSource.filter((item) => {
        
        return this.groupId === item?.permission_group_id
      })
      console.log('y', y);
      searchVal = [...y];

      if(this.filterStatus === 0 || this.filterStatus === 1){
        let z = searchVal.filter((v)=> v.status === this.filterStatus);
        console.log('z', z);
        searchVal = [...z];
       }
    }


    if( (this.filterStatus === 0 || this.filterStatus === 1 ) && !this.groupId && !this.filteredData ){
      let z = this.dataSource.filter((v)=> v.status === this.filterStatus);
      console.log('z', z);
      searchVal = [...z];
     }


     if( (this.filterStatus === 0 || this.filterStatus === 1 ) && this.filteredData && !this.groupId ){
      let x = this.dataSource.filter((item) => item.name.toLowerCase().includes(this.filteredData));
      searchVal = [...x];
      let z = searchVal.filter((v)=> v.status === this.filterStatus);
      console.log('z', z);
      searchVal = [...z];
     }
    console.log('searchVal', searchVal);
    
    this.updateDataSource(searchVal);

    // Clear the input field value after searching
    const inputElement: HTMLInputElement = this.input.nativeElement;
    inputElement.value = '';
    this.filteredData = ''; 
    this.groupId = '';
    this.selectedGroup = '';
    this.filterStatus = '';
  }

  onClearFilter() {
    this.groupId = '';
    this.filteredData = '';
    this.selectedGroup = '';
    this.filterStatus = '';

    this.updateDataSource(this.allPermissionGroupItem)
    console.log('filter data cleared')
  }


  filterData1(data){
    this.filterStatus = data.value;
    // this.updateDataSource(this.allPermissionGroupItem);
    //   let newData = this.dataSource.filter((v)=> v.status === data.value);
    //   this.filteredData = newData;
    //   this.updateDataSource(newData)
  
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
