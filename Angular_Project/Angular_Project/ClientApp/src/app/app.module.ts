import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './component/home/home.component';
import { MatImportModule } from './modules/mat-import/mat-import.module';
import { CustomerService } from './services/data/customer.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { CustomerViewComponent } from './components/customer/customer-view/customer-view.component';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerCreateComponent } from './components/customer/customer-create/customer-create.component';
import { NotifyService } from './services/common/notify.service';
import { CustomerEditComponent } from './components/customer/customer-edit/customer-edit.component';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { WorkerViewComponent } from './components/worker/worker-view/worker-view.component';
import { WorkerCreateComponent } from './components/worker/worker-create/worker-create.component';
import { WorkerService } from './services/data/worker.service';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { PaymentService } from './services/data/payment.service';
import { PaymentViewComponent } from './components/payment/payment-view/payment-view.component';
import { PaymentCreateComponent } from './components/payment/payment-create/payment-create.component';
import { DatePipe } from '@angular/common';
import { PaymentDetailsComponent } from './components/payment/payment-details/payment-details.component';
import { WorkerEditComponent } from './components/worker/worker-edit/worker-edit.component';
import { PaymentEditComponent } from './components/payment/payment-edit/payment-edit.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomerViewComponent,
    NavBarComponent,
    CustomerCreateComponent,
    CustomerEditComponent,
    ConfirmDialogComponent,
    WorkerViewComponent,
    WorkerCreateComponent,
    PaymentViewComponent,
    PaymentCreateComponent,
    PaymentDetailsComponent,
    WorkerEditComponent,
    PaymentEditComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatImportModule,
    LayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialFileInputModule,
    DatePipe
  ],
  entryComponents:[ConfirmDialogComponent],
  providers: [HttpClient, CustomerService,WorkerService,PaymentService,NotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
