import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { Customer } from 'src/app/models/data/customer';
import { Payment } from 'src/app/models/data/payment';
import { Worker } from 'src/app/models/data/worker';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CustomerService } from 'src/app/services/data/customer.service';
import { PaymentService } from 'src/app/services/data/payment.service';
import { WorkerService } from 'src/app/services/data/worker.service';

@Component({
  selector: 'app-payment-create',
  templateUrl: './payment-create.component.html',
  styleUrls: ['./payment-create.component.css']
})
export class PaymentCreateComponent implements OnInit {
  payment:Payment={customerID:undefined, startDate:undefined, endDate:undefined,pymentDone:undefined}
  customers:Customer[]=[];
  workers:Worker[]=[];

  paymentForm:FormGroup=new FormGroup({
    customerID:new FormControl(undefined,Validators.required),
    startDate: new FormControl(undefined, Validators.required),
    endDate: new FormControl(undefined, Validators.required),
  
    paymentDone: new FormControl(undefined),
    works:new FormArray([])
  })
  constructor(
    private workerService:WorkerService,
    private paymentService:PaymentService,
    private customerService:CustomerService,
    private notifyService:NotifyService

  ) { }
  save(){
    if(this.paymentForm.invalid) return;
  //console.log(this.orderForm.value);
  Object.assign(this.payment, this.paymentForm.value);
  //console.log(this.order);
  this.paymentService.insert(this.payment)
  .subscribe({
    next:r=>{
      this.notifyService.message("Data saved", 'DISMISS');
    },
    error:err=>{
      this.notifyService.message("Failed to load workers", 'DISMISS');
      throwError(()=>err);
    }
  })
  }
  get worksFormArray(){
    return this.paymentForm.controls["works"] as FormArray;
  }
  addItem(){
    this.worksFormArray.push(new FormGroup({
      workerId: new FormControl(undefined, Validators.required),
      totalWorkHour:new FormControl(undefined, Validators.required)
    }))
  }
  removeItem(index:number){
    if(this.worksFormArray.controls.length> 1)
      this.worksFormArray.removeAt(index);
  }
  ngOnInit(): void {
    this.customerService.get()
    .subscribe({
      next:r=>{
        this.customers=r;
      },
      error:err=>{
        this.notifyService.message("Failed to load customers",'DISMISS');
      }
    });
    this.workerService.get()
    .subscribe({
      next: r=>{
        this.workers = r;
      },
      error: err=>{
        this.notifyService.message("Failed to load workers", 'DISMISS');
      }
    });
  }

}
