import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import 'rxjs/add/operator/catch';
import { QueueType } from '../shared/types/queue';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  @ViewChild("safeKharidGrid") gridSafeKharid: DxDataGridComponent
  @ViewChild("safeForushGrid") gridSafeForush: DxDataGridComponent
  @ViewChild("noeDarkhastSelect") noeDarkhastSelect: any

  safeKharid: QueueType[];
  safeForush: QueueType[];

  tedadSahm: number;
  arzeshSahm: number;

  ngOnInit(): void {
    this.gridSafeKharid.rtlEnabled = true;
    this.gridSafeKharid.showBorders = true;

    this.gridSafeForush.rtlEnabled = true;
    this.gridSafeForush.showBorders = true;

    this.getSafeKharid();
    this.getSafeForush();
  }

  constructor(private apiService: ApiService) { }

  getSafeKharid() {
    this.apiService.getSafeKharid().subscribe((data) => {
      this.safeKharid = data;
    });
  }

  getSafeForush() {
    this.apiService.getSafeForush().subscribe((data) => {
      this.safeForush = data;
    });
  }

  sabtDarkhast() {
    let darkhast: QueueType = {
      tedadSahm: this.tedadSahm,
      arzeshSahm: this.arzeshSahm
    }

    let noeDarkhast = this.noeDarkhastSelect.nativeElement.selectedIndex;
    // kharid sahm
    if (noeDarkhast == 0) {
      this.apiService.sabtDarkhastKharid(darkhast).subscribe((result) => {
        this.getSafeKharid();
      }, (error) => {
        console.log(error);
      })
    }
    //forush sahm
    else if (noeDarkhast == 1) {
      this.apiService.sabtDarkhastForush(darkhast).subscribe((result) => {
        this.getSafeForush();
      }, (error) => {
        console.log(error);
      })
    }


  }
}
