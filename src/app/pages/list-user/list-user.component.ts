import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { UserEditDialogComponent } from 'src/app/dialog/user-edit-dialog/user-edit-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { TableUtil } from 'src/app/shared/pdfxl/tableUtl';
import { TableXl } from 'src/app/shared/pdfxl/tableXl';
import * as XLSX from 'xlsx-js-style';
export interface Pagination {
  pageSize: string | number;
  currentPage: string | number;
}

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  allUser: any;
  allRole: any;
  loggedInUserRolePermission: any;
  // Pagination
  p: number = 1;

  //permission

  addUserPermission: Boolean = false;
  editUserPermission: Boolean = false;
  deleteUserPermission: Boolean = false;
  exportUserPermission: Boolean = false;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  LoggedInUserRoleId: any;



  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getAllRole();
    // this.getAllUser();
    this.getLoggedInUserRoleId();
    this.getLogedInUserPermission();

  }
  getLoggedInUserRoleId() {
    this.LoggedInUserRoleId = sessionStorage.getItem('role');
    console.log(' this.LoggedInUserRoleId', this.LoggedInUserRoleId);
  }
  getAllRole() {
    this.spinner.show();
    this.subDataFour = this.authService.getAllrole().subscribe({
      next: (res) => {
        if (res) {
          this.allRole = res
          console.log(res)
          this.spinner.hide();
          this.getAllUser();

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        console.log(err)
        this.spinner.hide();
      }
    })
  }

  getAllUser() {
    this.spinner.show();
    this.subDataOne =
      this.authService.getAllUser().subscribe({
        next: (res) => {
          if (res) {
            this.spinner.hide();
            // this.allUser = res
            console.log('res', res)
              this.getAllUserWithRoleName(res)
          } else {
            console.log('Error! Please try again.')
          }
        },
        error: (err) => {
          console.log(err)
          this.spinner.hide();
        }
      })
  }



  getLogedInUserPermission() {
    this.spinner.show();
    this.subDataFive = this.authService.getAllRolePermission(this.LoggedInUserRoleId).subscribe({
      next: (res) => {
        if (res) {
          this.loggedInUserRolePermission = res['data']
          console.log('res12', res['data'])
          this.spinner.hide();
          this.updateloggedInUserRolePermission()

        } else {
          console.log('Error! Please try again.')
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err)
      }
    })
  }


  updateloggedInUserRolePermission() {
    this.loggedInUserRolePermission.forEach((item: any) => {
    switch (item.permission) {
      case 'user_add':
        this.addUserPermission = true;
        break;
      case 'user_edit':
        this.editUserPermission = true;
        break;
      case 'user_delete':
        this.deleteUserPermission = true;
        break;
      case 'user_export':
        this.exportUserPermission = true;
        break;
      // Add more cases for other permissions if needed
      default:
        break;
    }
    })

  }

  // getAllUserWithRoleName(totalUser) {
  // totalUser.map((user) => {
  //     this.allRole.map(role => {
  //       if (user.role_id === role.id) {
  //         user["role_name"] = role.name;
  //       }
  //     });
  //   })
  //   this.allUser = totalUser;
  // }


  getAllUserWithRoleName(totalUser) {
    this.spinner.show();
    const usersWithRoleName = totalUser.map((user) => {
   
        const matchingRole = this.allRole?.find((role) => user.role_id === role.id);
        if (matchingRole) {
          this.spinner.hide();
          return { ...user, role_name: matchingRole.name };
        } else {
          return user;
        }
      
  
    });
  
    this.allUser = usersWithRoleName;
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
    this.spinner.show();
    this.subDataTwo = this.authService.addUser(data)
      .subscribe({
        next: (res) => {
          if (res) {
            console.log('res from api ss', res);
            this.spinner.hide();
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
          this.spinner.hide();
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
    this.spinner.show();
    this.subDataThree = this.authService.updateUserById(id, data).subscribe({
      next: (res) => {

        console.log(res);
        if (res) {
          this.spinner.hide();
          this.getAllUser()
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      },
    });
  }


  deleteUser(id: string) {
    this.spinner.show();
    this.subDataFour = this.authService.deleteUserById(id).subscribe({
      next: (res) => {
        console.log(res);
        if (res) {
          this.spinner.hide();
          // this._snackBar.open('User Deleted Successfully','Undo');  
          this._snackBar.open('User Deleted Successfully', '', {
            duration: 1000
          })
          this.getAllUser()
        }
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
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

  exportTable() {
    const tableClone = document.getElementById('ExampleTable').cloneNode(true) as Element;
    const actionCells = tableClone.querySelectorAll('.td-action');
    actionCells.forEach(cell => cell.parentNode.removeChild(cell));


    const actionCells1 = tableClone.querySelectorAll('.td-first-name');
    actionCells1.forEach(cell => cell.parentNode.removeChild(cell));

    const actionCells2 = tableClone.querySelectorAll('.td-last-name');
    actionCells2.forEach(cell => cell.parentNode.removeChild(cell));
    // Filter columns that should be included in the export
    // const exportableColumns = this.columns.filter(column => column.export);

    // Remove header cells for non-exportable columns
    const headerCells = tableClone.querySelectorAll('th');
    console.log('headerCells', headerCells)
    headerCells.forEach((cell, index) => {
      if (cell.innerText === 'Actions') {
        cell.parentNode.removeChild(cell);
      }
      else if (cell.innerText === 'First Name') {
        cell.parentNode.removeChild(cell);
      }
      else if (cell.innerText === 'Last Name') {
        cell.parentNode.removeChild(cell);
      }
    });
    TableUtil.exportToPdf(tableClone.outerHTML, 'All User');
  }

  exportXlTable() {
    const tableClone = document.getElementById('ExampleTable').cloneNode(true) as Element;
    console.log('tableClone', tableClone)
    const actionCells = tableClone.querySelectorAll('.td-action');
    actionCells.forEach(cell => cell.parentNode.removeChild(cell));
    const headerCells = tableClone.querySelectorAll('th');
    console.log('headerCells', headerCells)
    headerCells.forEach((cell, index) => {
      if (cell.innerText === 'Actions') {
        cell.parentNode.removeChild(cell);
      }
    });
    TableXl.exportTableToExcel(tableClone, 'exported_table');
  }

  exportXlTable2() {
    const mData = this.allUser.map((m) => {
      console.log('mxl', m);
      // Format the created_time field
      const createdTime = m.created_time ? new Date(m.created_time) : null;
      const formattedCreatedTime = createdTime ? createdTime.toLocaleString() : 'n/a';

      return {
        Name: m.name,
        RoleName: m.role_name,
        Email: m.email ? m.email : 'n/a',
        Gender: m.gender,
        Mobile: m.mobile ? m.mobile : 'n/a',
        Address: m.address,
        Created_time: formattedCreatedTime
      };
    })

    // Define column widths
    const columnWidths = [
      { wch: 22 },  // Width of the 'name' column
      { wch: 10 },  // Width of the 'roleName' column
      { wch: 20 },  // Width of the 'email' column
      { wch: 8 },  // Width of the 'gender' column
      { wch: 15 },  // Width of the 'mobile' column
      { wch: 15 },  // Width of the 'address' column
      { wch: 21 },  // Width of the 'created_time' column
    ];


    console.log('mData', mData);

    // EXPORT XLSX with specified column widths
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
    ws['!cols'] = columnWidths; // Set column widths

    // Define styles for bold headers
    const headerStyle = {
      font: {
        name: 'arial',
        sz: "13"
      },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
        wrapText: '1', // any truthy value here
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
    ws['F1'].s = headerStyle;
    ws['G1'].s = headerStyle;

    ws['!rows'] = [{ hpx: 20 }];

    const rowCount = mData.length;
    for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
      ws['!rows'][rowIndex] = { hpx: 18 }; // Set the height of each row (excluding the header) to 20 pixels
    }
    // Add more header styles for additional columns as needed

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `user_Reports.xlsx`);
  }

}
