import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
import { Customer } from 'src/app/models/data/customer';
import { NotifyService } from 'src/app/services/common/notify.service';
import { CustomerService } from 'src/app/services/data/customer.service';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {
  customer:Customer = {customerName:'', address:'', email:''};
  customerForm:FormGroup = new FormGroup({
    customerName: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    address:new FormControl('', Validators.required),
    email:new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)])
  });
  constructor(
    private customerService:CustomerService,
    private notifyService:NotifyService
  ) { }
    save():void{
      if(this.customerForm.invalid) return;
      Object.assign(this.customer, this.customerForm.value);
      //console.log(this.customer);
      this.customerService.insert(this.customer)
      .subscribe({
        next: r=>{
          this.notifyService.message('Data saved', 'DISMISS');
          this.customer = {customerName:'', address:'', email:''};
          this.customerForm.patchValue(this.customer);
          this.customerForm.markAsUntouched();
          this.customerForm.markAsPristine();
          
        },
        error:err=> {
          this.notifyService.message('Failed to save data', 'DISMISS');
          throwError(()=>err);
        }
      })
    }
  ngOnInit(): void {
  }

}
