import { Gender } from "../../shared/app-constants";

export interface WorkerInputModel {
    workerId?:number;
    workerName?:string;
    phone?:string;
    payrate?:number;
    gender?:Gender;
}
