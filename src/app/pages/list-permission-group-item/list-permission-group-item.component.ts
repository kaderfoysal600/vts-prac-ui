import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { log } from 'console';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { PermissionGroupItemDialogComponent } from 'src/app/dialog/permission-group-item-dialog/permission-group-item-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { UiService } from 'src/app/service/ui.service';
import { UserDataService } from 'src/app/shared/service/user-data.service';
import { TableUtil } from 'src/app/shared/pdfxl/tableUtl';
import { TableXl } from 'src/app/shared/pdfxl/tableXl';
import * as XLSX from 'xlsx-js-style';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-permission-group-item',
  templateUrl: './list-permission-group-item.component.html',
  styleUrls: ['./list-permission-group-item.component.scss']
})
export class ListPermissionGroupItemComponent implements OnInit {

  clearFilter = true;
  searchClicked = true;

  allPermissionGroupItem: any = null;
  allPermissionGroup: any = null;
  loggedInUserRolePermission: any;


  //store data for search 
  filteredData: any;
  groupId: any;
  filterStatus: any;
  showFilterStatus: any;

  //show search data 


  // Pagination
  page: number = 1;
  itemsPerPage = 5;
  totalItems: any;
  currPage: number = 1;
  showPegination = true;

  dataSource
  displayedColumns = ['id','group', 'name', 'permission', 'weight', 'status', 'action'];
  allStatus: any[] = [
    { value: 1, viewValue: 'Active' },
    { value: 0, viewValue: 'Inactive' }
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;
  @ViewChild('input', { static: false }) input: ElementRef;
  selectedGroup: any;
  selectedStatus: any;


  //dragable
  dragPossible = false;
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
    private userDataService: UserDataService,
    private changeDetectorRef: ChangeDetectorRef,
    public http: HttpClient,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.loggedInUserRolePermission = this.userDataService.getLoggedInUserRolePermission();
    this.itemSearchStart(null)
  }

  //CURD of All Permission group item

  // getAllPermissionGroupItemExtra(page: any) {
  //   this.currPage = page;
  //   this.spinner.show();
  //   this.subDataOne = this.authService.getAllPermissionGroupItem1(page, this.itemsPerPage).subscribe({
  //     next: (res) => {
  //       if (res) {
  //         this.spinner.hide();
  //         console.log('allPermissionGroupItem', res);
  //         this.allPermissionGroupItem = res['data'];
  //         this.getAllPermissionGroup()
  //         this.totalItems = res['totalData'];
  //         this.updateDataSource(this.allPermissionGroupItem)

  //       } else {
  //         this.spinner.hide();
  //         console.log('Error! Please try again.')
  //       }
  //     },
  //     error: (err) => {
  //       this.spinner.hide();
  //       console.log(err)
  //     }
  //   })
  // }

  getAllPermissionGroup() {
    this.subDataFive =
      this.authService.getAllPermissionGroup().subscribe({
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
    this.subDataTwo =
      this.authService.addPermissionGroupItem(data)
        .subscribe({
          next: (res) => {
            console.log('res', res)
            if (res) {
              console.log('Permission Group Item added successfully', res)
              this.uiService.success('Permission Group Item added successfully');
              this.itemSearchStart(this.currPage)
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
    this.subDataThree = 
    this.authService.updatePermissionGroupItem(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.uiService.success('Permission Group Item Updated successfully');
        if (res) {
          this.itemSearchStart(this.currPage)
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePermissionGroupItem(id: string) {
    console.log('id', id)
    this.subDataFour = this.authService.deletePermissionGroupItem(id).subscribe({
      next: (res) => {
        console.log('res', res);
        this.uiService.success('Permission Group Item deleted successfully');
        if (res) {
          this.itemSearchStart(this.currPage)
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  dragDropTable(event: CdkDragDrop<any[]>) {
    console.log('event', event);

    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    console.log('prevIndex', prevIndex);

    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    console.log('event.currentIndex', event.currentIndex);

    this.dataSource.map((d, index) => {
      if (d === event.item.data) {
        d.weight = event.currentIndex + 1; 
        this.authService.updatePermissionGroupItem(d.id, d).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
        
        // Set the weight based on the new position
      } else if (index >= event.currentIndex) {
        // Update the weight of elements after the dragged item
        d.weight = d.weight + 1; // Adjust the weight accordingly
        this.authService.updatePermissionGroupItem(d.id, d).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });

    console.log('UpdatedData', this.dataSource);


    this.table.renderRows();
  }


  //select search field

  onSelectGroup(e) {
    console.log('data', e);
    
    this.groupId = e.id
    if (this.groupId) {
      this.searchClicked = false;
    }
    else {
      this.searchClicked = true;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = filterValue;
    if (this.filteredData) {
      this.searchClicked = false;
    }
    else {
      this.searchClicked = true;
    }

  }
  filterWithStatus(data: any) {
    this.filterStatus = data.value;
    if (this.filterStatus === 0 || this.filterStatus === 1) {
      this.searchClicked = false;
    }
    else {
      this.searchClicked = true;
    }
  }



  //search button clicked

  itemSearch(p) {
    let x = p
    if (p > 1) {
      x = 1;
    }
    console.log('p', p);

    this.itemSearchStart(x);
    this.page = 1
  }
  itemSearchStart(page) {
    this.searchClicked = true;
    this.updateDataSource(this.allPermissionGroupItem)
    let x = {
      filteredData: this.filteredData,
      groupId: this.groupId,
      filterStatus: this.filterStatus
    }

    this.authService.getAllPermissionGroupItemSearch(page, this.itemsPerPage, x).subscribe({
      next: (res) => {
        if (res) {
          console.log('allPermissionGroupItemSearch', res);
          this.allPermissionGroupItem = res['data']
          this.dragPossible = res['isDrag']
          this.getAllPermissionGroup()
          if (res['totalData'] !== 0) {
            this.totalItems = res['totalData'];
          } else if (res['totalData'] === 0) {
            this.showPegination = false;
            console.log('this.showPegination ', this.showPegination)
          }


          this.updateDataSource(this.allPermissionGroupItem)
          this.clearFilter = false;

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })

    console.log('x', x);
  }

  onClearFilter() {
    this.groupId = '';
    this.filteredData = '';
    this.selectedGroup = '';
    this.selectedStatus = '';
    this.filterStatus = '';
    const inputElement: HTMLInputElement = this.input.nativeElement;
    inputElement.value = '';

    console.log('this.allPermissionGroupItem', this.allPermissionGroupItem)
    this.itemSearchStart(null);
    this.currPage = 1;
    this.page = 1;
    this.showPegination = true;

    console.log('filter data cleared')
    this.clearFilter = true;
  }

  updateDataSource(newData: any[]) {
    // this.dataSource.paginator = this.page;
    this.dataSource = newData;
    console.log('this.dataSource ', this.dataSource)
    // Notify the MatTable that the data has changed
    this.changeDetectorRef.detectChanges();
  }





  // export pdf xl 


  exportAsPdf() {
    const tableClone = document.getElementById('ExampleTable').cloneNode(true) as Element;
    const actionCells = tableClone.querySelectorAll('.edit-delete');
    actionCells.forEach(cell => cell.parentNode.removeChild(cell));

    // Remove header cells for non-exportable columns
    const headerCells = tableClone.querySelectorAll('th');
    console.log('headerCells', headerCells)
    headerCells.forEach((cell, index) => {
      if (cell.innerText === 'Actions') {
        cell.parentNode.removeChild(cell);
      }
    });
    TableUtil.exportToPdf(tableClone.outerHTML, 'Permission Group Item');
  }


  exportAsXl() {
    const mData = this.allPermissionGroupItem.map((m) => {

      return {
        Id: m.id,
        Group: m.permission_group_name,
        Name: m.name,
        permission: m.permission ? m.permission : 'n/a',
        weight: m.weight,
        // Mobile: m.mobile ? m.mobile : 'n/a',
      };
    })

    // Define column widths
    const columnWidths = [
      { wch: 7 },  // Width of the 'name' column
      { wch: 14 },  // Width of the 'roleName' column
      { wch: 20 },  // Width of the 'email' column
      { wch: 18 },  // Width of the 'gender' column
      { wch: 5 },  // Width of the 'mobile' column
    ];


    console.log('mData', mData);

    // EXPORT XLSX with specified column widths
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
    ws['!cols'] = columnWidths; // Set column widths

    // Define styles for bold headers
    const headerStyle = {
      alignment: {
        vertical: 'left',
        horizontal: 'left',
        wrapText: false,
      },
      font: {
        name: 'arial',
        sz: "13",
      },

      border: {
        right: {
          style: 'thin',
          color: '000000',
        },
        left: {
          style: 'thin',
          color: '000000',
        },
        bottom: {
          style: 'thin',
          color: '000000',
        },
      },
      fill: {
        patternType: 'solid',
        fgColor: { rgb: 'b2b2b2' },
        bgColor: { rgb: 'b2b2b2' },
      }


    };

    // Apply styles to the header row
    ws['A1'].s = headerStyle;
    ws['B1'].s = headerStyle;
    ws['C1'].s = headerStyle;
    ws['D1'].s = headerStyle;
    ws['E1'].s = headerStyle;

    ws['!rows'] = [{ hpx: 20 }];

    const rowCount = mData.length;
    for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
      ws['!rows'][rowIndex] = { hpx: 18 }; // Set the height of each row (excluding the header) to 20 pixels
    }
    // Add more header styles for additional columns as needed

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `permission_group_items.xlsx`);
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
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
  }

}
