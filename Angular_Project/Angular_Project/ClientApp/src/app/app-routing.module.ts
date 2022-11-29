import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { CustomerCreateComponent } from './components/customer/customer-create/customer-create.component';
import { CustomerEditComponent } from './components/customer/customer-edit/customer-edit.component';
import { CustomerViewComponent } from './components/customer/customer-view/customer-view.component';
import { PaymentCreateComponent } from './components/payment/payment-create/payment-create.component';
import { PaymentDetailsComponent } from './components/payment/payment-details/payment-details.component';
import { PaymentEditComponent } from './components/payment/payment-edit/payment-edit.component';
import { PaymentViewComponent } from './components/payment/payment-view/payment-view.component';
import { WorkerCreateComponent } from './components/worker/worker-create/worker-create.component';
import { WorkerEditComponent } from './components/worker/worker-edit/worker-edit.component';
import { WorkerViewComponent } from './components/worker/worker-view/worker-view.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'home',component:HomeComponent},
  {path:'customers',component:CustomerViewComponent},
  {path:'customer-create',component:CustomerCreateComponent},
  {path:'customer-edit/:id', component:CustomerEditComponent},
  {path:'workers', component:WorkerViewComponent},
  {path:'worker-create', component:WorkerCreateComponent},
  {path:'worker-edit/:id', component:WorkerEditComponent},
  {path:'payments',component:PaymentViewComponent},
  {path:'payment-create',component:PaymentCreateComponent},
  {path:'payment-edit/:id', component:PaymentEditComponent},
  {path:'payment-details/:id',component:PaymentDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
