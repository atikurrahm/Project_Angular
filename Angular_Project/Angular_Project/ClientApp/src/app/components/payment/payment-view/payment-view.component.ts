import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { PaymentViewModel } from 'src/app/models/view-models/payment-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { PaymentService } from 'src/app/services/data/payment.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent implements OnInit {
  payments:PaymentViewModel[] = [];
  dataSource:MatTableDataSource<PaymentViewModel> = new MatTableDataSource(this.payments);
  columns:string[] = [ 'customerName', 'startDate','endDate','paymentDone', 'totalPayment','details', 'actions'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private paymentService:PaymentService,
    private notifyService:NotifyService,
    private matDialog:MatDialog
  ) { }
  confirmDelete(data:PaymentViewModel){
    this.matDialog.open(ConfirmDialogComponent, {
      width: '450px',
      enterAnimationDuration: '500ms'
    }).afterClosed()
    .subscribe(result=>{
        if(result){
          this.paymentService.delete(<number>data.paymentId)
          .subscribe({
            next:r=>{
              this.notifyService.message("Data deleted", "DISMISS");
              this.dataSource.data = this.dataSource.data.filter(x=> x.paymentId != data.paymentId);
            },
            error: err=>{
              this.notifyService.message("Data delete failed", "DISMISS");
              throwError(()=>err);
            }
          });
        }
    });
   }
  ngOnInit(): void {
    this.paymentService.getVM()
    .subscribe({
      next: r=> {
        this.payments = r;
        this.dataSource.data = this.payments;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifyService.message('Failed to load orders', 'DISMISS');
        throwError(()=> err);
      }
    })
  }

}
