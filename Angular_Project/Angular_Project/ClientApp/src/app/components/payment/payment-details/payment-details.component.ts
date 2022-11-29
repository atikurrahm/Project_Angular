import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Work } from 'src/app/models/data/work';

import { PaymentAndWorkViewModel } from 'src/app/models/view-payments/payment-and-work-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { PaymentService } from 'src/app/services/data/payment.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  payment:PaymentAndWorkViewModel = {};
  dataSource= new MatTableDataSource(this.payment.works);
  columns:string[] = ['worker','payrate', 'totalWorkHours', 'totalPayment'];
  constructor(
    private paymentService:PaymentService,
      private notifyService:NotifyService,
      private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.payment.works=[];
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.paymentService.getWithItems(id)
    .subscribe({
      next: r=>{
        this.payment= r;
        console.log(this.payment)
        this.dataSource.data=this.payment.works as Work[];
        
      },
      error:err=>{
        this.notifyService.message('Failed to load payments', 'DISMISS');
        throwError(()=> err);
      }
    });
  }

}
