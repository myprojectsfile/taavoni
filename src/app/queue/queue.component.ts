import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { QueueService, QueueType } from './queue.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  @ViewChild("safeKharidGrid") dataGrid: DxDataGridComponent
  safeKharid: QueueType[];
  username: string;
  tedadSahm: number;
  arzeshSahm: number;

  ngOnInit(): void {
    this.dataGrid.rtlEnabled = true;
    this.dataGrid.showBorders = true;
    this.getSafeKharid();
  }

  constructor(private queuService: QueueService) { }

  getSafeKharid() {
    this.queuService.getSafeKharid().subscribe((data) => {
      this.safeKharid = data;
    });
  }

  sabtDarkhast() {
    let darkhast: QueueType = {
      username: this.username,
      tedadSahm: this.tedadSahm,
      arzeshSahm: this.arzeshSahm
    }

    this.queuService.sabtDarkhast(darkhast).subscribe((result) => {
      this.getSafeKharid();
    }, (error) => {
      console.log(error);
    })
  }
}
