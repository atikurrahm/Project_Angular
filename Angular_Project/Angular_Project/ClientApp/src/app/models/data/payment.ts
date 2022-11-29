import { Work } from "./work";
export interface Payment {
    paymentId?:number;
    startDate?:Date;
    endDate?:Date;
    payrate?:number;
    pymentDone?:boolean;
    customerID?:number;
    works?:Work[];
}
