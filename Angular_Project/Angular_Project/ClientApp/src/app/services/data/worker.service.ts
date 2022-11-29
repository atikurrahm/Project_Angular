import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Worker } from 'src/app/models/data/worker';
import { apiUrl } from 'src/app/models/shared/app-constants';
import { ImagePathResponse } from 'src/app/models/shared/image-path-response';
import { WorkerInputModel } from 'src/app/models/view-models/input/worker-input-model';
import { WorkerViewModel } from 'src/app/models/view-models/worker-view-model';


@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(
    private http:HttpClient
  ) { }
   get():Observable<Worker[]>{
    return this.http.get<Worker[]>(`${apiUrl}/Workers`);
  } 
  getVM():Observable<WorkerViewModel[]>{
    return this.http.get<WorkerViewModel[]>(`${apiUrl}/Workers/VM`);
  } 
  getById(id:number):Observable<Worker>{
    return this.http.get<Worker>(`${apiUrl}/Workers/${id}`);
  } 
  insert(data:WorkerInputModel):Observable<Worker>{
    return this.http.post<Worker>(`${apiUrl}/Workers/VM`, data);
  }
  update(data:WorkerInputModel):Observable<any>{
    return this.http.put<any>(`${apiUrl}/Workers/${data.workerId}/VM`, data);
  }
  uploadImage(id: number, f: File): Observable<ImagePathResponse> {
    const formData = new FormData();

    formData.append('picture', f);
    //console.log(f);
    return this.http.post<ImagePathResponse>(`${apiUrl}/Workers/Upload/${id}`, formData);
  }
  delete(data:WorkerViewModel):Observable<any>{
    return this.http.delete<any>(`${apiUrl}/Workers/${data.workerId}`);
  }
}
