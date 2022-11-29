import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { Customer } from 'src/app/models/data/customer';
import { CustomerViewModel } from 'src/app/models/view-models/customer-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CustomerService } from 'src/app/services/data/customer.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {

  customers:CustomerViewModel[] = [];
  columnList:string[] =['customerName', 'address', 'email', 'actions'];
  dataSource:MatTableDataSource<Customer> = new MatTableDataSource(this.customers);
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private customerService:CustomerService,
    private notifyService: NotifyService,
    private matDialog:MatDialog
  ) { }
  confirmDelete(data:CustomerViewModel){
    //console.log(data);
    this.matDialog.open(ConfirmDialogComponent, {
      width: '450px',
      enterAnimationDuration: '500ms'
    }).afterClosed()
    .subscribe(result=>{
      //console.log(result);
      if(result){
        this.customerService.delete(data)
        .subscribe({
          next: r=>{
            this.notifyService.message('Customer removed', 'DISMISS');
            this.dataSource.data = this.dataSource.data.filter(c => c.customerID != data.customerID);
          },
          error:err=>{
            this.notifyService.message('Failed to delete data', 'DISMISS');
            throwError(()=>err);
          }
        })
      }
    })
  }
  ngOnInit(): void {
    this.customerService.getVM().subscribe({
      next: r=>{
        this.customers = r;
        //console.log(this.customers);
        this.dataSource.data = this.customers;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: err=>{
        this.notifyService.message("Failed to load customers", "DISMISS");
        throwError(()=>err)
      }
    });
  }

}
