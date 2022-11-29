import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkerInputModel } from 'src/app/models/view-models/input/worker-input-model';
import { Gender } from 'src/app/models/shared/app-constants';
import { NotifyService } from 'src/app/services/common/notify.service';
import { WorkerService } from 'src/app/services/data/worker.service';


@Component({
  selector: 'app-worker-create',
  templateUrl: './worker-create.component.html',
  styleUrls: ['./worker-create.component.css']
})
export class WorkerCreateComponent implements OnInit {
  worker: WorkerInputModel = { workerName: undefined, phone: undefined, payrate: undefined, gender: undefined };
  genderOptions:{label:string, value:number}[] =[];
  workerForm: FormGroup = new FormGroup({
    workerName: new FormControl('', Validators.required),
    phone: new FormControl(undefined, Validators.required),
    payrate: new FormControl(undefined, Validators.required),
    gender: new FormControl(undefined, Validators.required),
    picture: new FormControl(undefined, Validators.required)
  });
  save() {
    if (this.workerForm.invalid) return;
    Object.assign(this.worker, this.workerForm.value)
    //console.log(this.product);
    var _self = this;
    
    this.workerService.insert(this.worker)
      .subscribe({
        next: r => {
          _self.notifyService.message('Data saved', 'DISMISS');
          var file = this.workerForm.controls['picture'].value.files[0];
          var reader = new FileReader();
          
          reader.onload = function (e: any) {
            console.log(e);
            _self.workerService.uploadImage(<number>r.workerId, file)
              .subscribe({
                next: r => {
                  _self.notifyService.message('Picture uploaded', 'DISMISS');
                },
                error: err => {
                  _self.notifyService.message('Picture upload failed', 'DISMISS');
                }
              });
          }
          reader.readAsArrayBuffer(file);
        },
        error: err => {
        _self.notifyService.message('Failed to save worker', 'DISMISS')
        }
      });
      
  }

  constructor(
    private workerService: WorkerService,
    private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    Object.keys(Gender).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.genderOptions.push({label: v, value:<any> Gender[v]});
    });
    //console.log(this.genderOptions)

  }

}
