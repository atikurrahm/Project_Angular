import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { Customer } from 'src/app/models/data/customer';
import { Payment } from 'src/app/models/data/payment';
import { Work } from 'src/app/models/data/work';
import { Worker } from 'src/app/models/data/worker';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CustomerService } from 'src/app/services/data/customer.service';
import { PaymentService } from 'src/app/services/data/payment.service';
import { WorkerService } from 'src/app/services/data/worker.service';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent implements OnInit {
  payment:Payment={customerID:undefined, startDate:undefined, endDate:undefined,pymentDone:undefined}
  customers:Customer[] = [];
  workers:Worker[] =[];
  paymentForm:FormGroup= new FormGroup({
    customerID: new FormControl(undefined, Validators.required),
    startDate: new FormControl(undefined, Validators.required),
    endDate: new FormControl(undefined),
    paymentDone: new FormControl(undefined),
    works: new FormArray([])
  })
  constructor(
    private paymentService: PaymentService,
    private workerService:WorkerService,
    private customerService:CustomerService,
    private notifyService:NotifyService,
    private activatedRout:ActivatedRoute
  ) { }
  get worksFormArray(){
    return this.paymentForm.controls["works"] as FormArray;
  }
  addItem(oi?:Work): void {
    if(oi){
      this.worksFormArray.push(new FormGroup({
        workerId: new FormControl(oi.workerId, Validators.required),
        totalWorkHour:new FormControl(oi.totalWorkHour, Validators.required)
      }))
    }
    else
    {
      this.worksFormArray.push(new FormGroup({
        workerId: new FormControl(undefined, Validators.required),
        totalWorkHour:new FormControl(undefined, Validators.required)
      }));
    }
  }
  removeItem(index:number){
    if(this.worksFormArray.controls.length> 1)
      this.worksFormArray.removeAt(index);
  }
  save(){
    if(this.paymentForm.invalid) return;
    //console.log(this.orderForm.value);
    Object.assign(this.payment, this.paymentForm.value);
    console.log(this.payment);
    this.paymentService.update(this.payment)
    .subscribe({
      next:r=>{
        this.notifyService.message("Data saved", 'DISMISS');
      },
      error:err=>{
        this.notifyService.message("Failed to load worker", 'DISMISS');
        throwError(()=>err);
      }
    })
  }
  ngOnInit(): void {
    let id:number = this.activatedRout.snapshot.params['id'];
    this.paymentService.getWithItems(id)
    .subscribe({
      next:r=>{
        this.payment = r;
        console.log(this.payment);
        this.paymentForm.patchValue(this.payment);
        this.payment.works?.forEach(oi=>{
          this.addItem(oi);
        });
        console.log(this.paymentForm.value)
      },
      error:err=>{
        this.notifyService.message("Falied to load payment", "DISMISS");
        throwError(()=>err);
      }
    });
    this.customerService.get()
    .subscribe({
      next: r=>{
        this.customers = r;
      },
      error: err=>{
        this.notifyService.message("Failed to load customers", 'DISMISS');
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
