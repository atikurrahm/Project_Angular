import { Customer } from "../data/customer";
import { Work } from "../data/work";

export interface PaymentAndWorkViewModel {
    paymentId?:number;
    startDate?:Date;
    endDate?:Date;
    payrate?:number;
    pymentDone?:boolean;
    customerID?:number;
    works?:Work[];
    customer?:Customer;
}
