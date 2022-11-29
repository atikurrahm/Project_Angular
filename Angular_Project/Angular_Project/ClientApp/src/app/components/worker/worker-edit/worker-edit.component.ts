import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { Worker } from 'src/app/models/data/worker';
import { baseUrl, Gender } from 'src/app/models/shared/app-constants';
import { NotifyService } from 'src/app/services/common/notify.service';
import { WorkerService } from 'src/app/services/data/worker.service';
import { WorkerInputModel } from 'src/app/models/view-models/input/worker-input-model';
@Component({
  selector: 'app-worker-edit',
  templateUrl: './worker-edit.component.html',
  styleUrls: ['./worker-edit.component.css']
})
export class WorkerEditComponent implements OnInit {
  genderOptions:{label:string, value:number}[] =[];
  worker:Worker= null!;
  imgPath:string= baseUrl;
  workerForm: FormGroup = new FormGroup({
    workerName: new FormControl('', Validators.required),
    phone: new FormControl(undefined, [Validators.required]),
    gender: new FormControl(undefined, Validators.required),
    payrate: new FormControl(undefined, Validators.required),
    picture: new FormControl(undefined, Validators.required)
  });
  file: File = null!;
  constructor(
    private workerService: WorkerService,
      private notifyService: NotifyService,
      private activatedRoute:ActivatedRoute
  ) { }
  handleFileInputChange(event: any): void {
    if (event.target.files.length) {
      this.file = event.target.files[0];
      this.workerForm.controls['picture'].patchValue(this.file.name);
    }
    else {
      this.workerForm.controls['picture'].patchValue("");
    }
    
  }
  save(){
    if(this.workerForm.invalid) return;
    let _self = this;
     Object.assign(this.worker, this.workerForm.value);
     console.log(this.worker);
     let data:WorkerInputModel = {workerId:this.worker.workerId, workerName: this.worker.workerName, phone:this.worker.phone, payrate:this.worker.payrate, gender:this.worker.gender};
     this.workerService.update(data)
     .subscribe({
      next: r=>{
        this.notifyService.message("Worker  updated", "DISMISS");
        if(this.file){
         _self. updateImage();
        }
      }
     })
  }
  updateImage(){
    let _self = this;
    var reader = new FileReader();
        
        reader.onload = function (e: any) {
         _self.workerService.uploadImage(<number>_self.worker.workerId, _self.file)
         .subscribe({
          next:r=>{
            _self.notifyService.message("Picture updated", "DISMISS");
          },
          error: err=>{
            _self.notifyService.message("Picture update failed", "DISMISS");
            throwError(()=>err);
          }
         })
        }
        reader.readAsArrayBuffer(_self.file);
  }
  ngOnInit(): void {
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.workerService.getById(id)
    .subscribe({
      next: r=>{
        this.worker=r;
        this.workerForm.patchValue(this.worker)
        console.log(this.worker)
      },
      error: err=> {
        this.notifyService.message('Failed to load worker data', 'DISMISS')
        throwError(()=>err);
      } 
    });
    Object.keys(Gender).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.genderOptions.push({label: v, value:<any> Gender[v]});
    });
  }

}
