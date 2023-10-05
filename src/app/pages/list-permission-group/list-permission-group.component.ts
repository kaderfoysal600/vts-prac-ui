import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

  statusSelected = false;
  filteredData
  allPermissionGroup
  buttonDisabled :Boolean = false;
  // displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  dataSource: MatTableDataSource<any>; 

  
   @ViewChild(MatPaginator) paginator: MatPaginator;
   


   columns = [
    {
      columnDef: 'id',
      header: 'Id.',
      cell: (element: any) => `${element.id}`,
      export: true,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: any) => `${element.name}`,
      export: true,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: any) => `${element.description}`,
      export: true,
    },
    {
      columnDef: 'status',
      header: 'status',
      cell: (element: any) => `${element.status === 0 ? 'Inactive': 'Active'}`,
      export: true,
    },
    {
      columnDef: 'created_by',
      header: 'Created by',
      cell: (element: any) => `${element.created_by}`,
      export: true,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      cell: (element: any) => '',
      export: false,
    }
  ];
  allStatus: any[] = [
    {value: 1, viewValue: 'Active'},
    {value: 0, viewValue: 'Inactive'}
  ];


  displayedColumns = this.columns.map(c => c.columnDef);

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private uiService: UiService,
    private changeDetectorRef: ChangeDetectorRef
   
  ) {
    this.dataSource = new MatTableDataSource([]);
   }

  ngOnInit(): void {
    this.getAllPermissionGroup()
  }

    // Example method to update the data source
  

  getAllPermissionGroup() {
  this.subDataOne = this.authService.getAllPermissionGroup().subscribe({
      next: (res) => {
        if (res) {
          this.allPermissionGroup = res
          console.log(res)
          // this.dataSource = new MatTableDataSource(this.allPermissionGroup);
          this.updateDataSource(this.allPermissionGroup)
          // this.dataSource.paginator = this.paginator;
          console.log('this.dataSource', this.dataSource);
        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  updateDataSource(newData: any[]) {
    this.dataSource.data = newData;
    this.dataSource.paginator = this.paginator;
    // Notify the MatTable that the data has changed
    this.changeDetectorRef.detectChanges();
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
    console.log('idsss', id);
    
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterData1(data){
    this.updateDataSource(this.allPermissionGroup)
    this.statusSelected = true;
    let newData = this.dataSource.filteredData.filter((v)=> v.status === data.value);
    this.filteredData = newData;
    this.updateDataSource(newData)
  }
  onClearFilter(){
    this.updateDataSource(this.allPermissionGroup)
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
