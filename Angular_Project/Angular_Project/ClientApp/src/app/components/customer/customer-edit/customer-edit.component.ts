import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { Customer } from 'src/app/models/data/customer';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CustomerService } from 'src/app/services/data/customer.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent implements OnInit {
  customer:Customer = null!;
  customerForm:FormGroup = new FormGroup({
    customerName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    address:new FormControl('', Validators.required),
    email:new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)])
  });
  constructor(
    private customerService:CustomerService,
    private notifyService:NotifyService,
    private activatedRoute:ActivatedRoute
  ) { }
save(){
  if(this.customerForm.invalid) return;
      Object.assign(this.customer, this.customerForm.value);
      //console.log(this.customer);
      this.customerService.update(this.customer)
      .subscribe({
        next:r=>{
          this.notifyService.message('Data saved', 'DISMISS');
        },
        error:err=> {
          this.notifyService.message('Failed to save data', 'DISMISS');
          throwError(()=>err);
        }
      })
}
  ngOnInit(): void {
    let id:number=this.activatedRoute.snapshot.params['id'];
    this.customerService.getById(id)
    .subscribe({
      next: r=> {
        this.customer=r;
        //console.log(this.customer);
        this.customerForm.patchValue(this.customer);
      },
      error: err=>{
        this.notifyService.message('Failed to load customer data', 'DISMISS');
        throwError(()=>err);
      }
    })
  }

}
