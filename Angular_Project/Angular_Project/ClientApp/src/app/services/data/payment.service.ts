import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/models/data/payment';
import { apiUrl } from 'src/app/models/shared/app-constants';
import { PaymentViewModel } from 'src/app/models/view-models/payment-view-model';
import { PaymentAndWorkViewModel } from 'src/app/models/view-payments/payment-and-work-view-model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http:HttpClient
  ) { }
  get():Observable<Payment[]>{
    return this.http.get<Payment[]>(`${apiUrl}/Payments`);
  }
  getVM():Observable<PaymentViewModel[]>{
    return this.http.get<PaymentViewModel[]>(`${apiUrl}/Payments/VM`);
  }
  getWithItems(id:number):Observable<PaymentAndWorkViewModel>{
    return this.http.get<PaymentAndWorkViewModel>(`${apiUrl}/Payments/${id}/OI`)
  }
  insert(data:Payment):Observable<Payment>{
    return this.http.post(`${apiUrl}/payments`, data)
  }
  update(data:Payment):Observable<any>{
    return this.http.put<any>(`${apiUrl}/PaymentsContext/VM/${data.paymentId}`, data)
  }
  delete(id:number):Observable<any>{
    return this.http.delete<any>(`${apiUrl}/Payments/${id}`)
  }
}
