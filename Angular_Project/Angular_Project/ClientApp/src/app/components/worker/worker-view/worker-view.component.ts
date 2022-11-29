import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { apiUrl, baseUrl, Gender } from 'src/app/models/shared/app-constants';
import { WorkerViewModel } from 'src/app/models/view-models/worker-view-model';
import { NotifyService } from 'src/app/services/common/notify.service';
import { WorkerService } from 'src/app/services/data/worker.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-worker-view',
  templateUrl: './worker-view.component.html',
  styleUrls: ['./worker-view.component.css']
})
export class WorkerViewComponent implements OnInit {

  picPath:string = `${baseUrl}/Pictures`
  workers:WorkerViewModel[] =[];
  dataSource:MatTableDataSource<WorkerViewModel> = new MatTableDataSource(this.workers)
  columns:string[] =['picture','workerName', 'phone','payrate', 'gender', 'actions'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private workerService:WorkerService,
    private notifyService:NotifyService,
    private matDialog:MatDialog
  ) { }
  getGenderName(v:number):string {
    return Gender[v];
  }
  confirmDelete(data:WorkerViewModel){
    this.matDialog.open(ConfirmDialogComponent, {
      width: '450px',
      enterAnimationDuration: '500ms'
    }).afterClosed()
    .subscribe(result=>{
      //console.log(result);
      if(result){
        this.workerService.delete(data)
        .subscribe({
          next: r=>{
            this.notifyService.message('Worker removed', 'DISMISS');
            this.dataSource.data = this.dataSource.data.filter(c => c.workerId != data.workerId);
          },
          error:err=>{
            this.notifyService.message('Failed to delete data', 'DISMISS');
            throwError(()=>err);
          }
        })
      }
    })
  }
  ngOnInit(): void {
    this.workerService.getVM()
    .subscribe({
      next:r=>{
        this.workers = r;
        this.dataSource.data = this.workers;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

}
