import { Worker } from "./worker";
export interface Work {
    paymentId?:number;
    workerId?:number;
    totalWorkHour?:number;
    worker?:Worker;
    paymentDone?:boolean;
}
