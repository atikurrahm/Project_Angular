import { Gender } from "../shared/app-constants";

export interface Worker {
    workerId?:number;
    workerName?:string
    phone?:string
    payrate?:number;
    picture?:string;
    gender?:Gender;
    works?:string[];
}
