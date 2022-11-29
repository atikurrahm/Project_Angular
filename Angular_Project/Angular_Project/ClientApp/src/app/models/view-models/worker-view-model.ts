import { Gender } from "../shared/app-constants";

export interface WorkerViewModel {
    workerId?:number;
    workerName?:string;
    phone?:string;
    picture?:string;
    gender?:Gender;
    canDelete?:boolean;
}
