import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/catch';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { ToastrService } from 'ngx-toastr';
import { DarkhastType } from '../shared/types/darkhast';
import { ApiService } from '../shared/services/api.service';
import { ConfirmService } from '../shared/services/confirm.service';

declare var $: any;
@Component({
  selector: 'app-request-admin',
  templateUrl: './request-admin.component.html',
  styleUrls: ['./request-admin.component.css']
})
export class RequestAdminComponent implements OnInit {
  listDarkhast: DarkhastType[];
  listDarkhastDataSource: any;
  @ViewChild('listDarkhastGrid') listDarkhastGrid: DxDataGridComponent;
  oldTedadSahm: number;
  editingRowKey: string;
  editingMode: boolean;
  gridInstance: DxDataGridComponent['instance'];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.gridInstance = this.listDarkhastGrid.instance;
    this.getListDarkhast();
  }

  private getListDarkhast() {
    this.apiService.getListDarkhastUser().subscribe(data => {
      this.listDarkhast = data;
      this.listDarkhastDataSource = {
        store: {
          type: 'array',
          key: '_id',
          data: this.listDarkhast
        }
      };
    });
  }

  cancel(d) {
    console.log(d);
    this.confirmService
      .confirm('اخطار', 'آیا از لغو درخواست اطمینان دارید؟', ['Yes', 'No'])
      .subscribe(answer => {
        if (answer === 'Yes') {
          // cancel request
          const rowKey = d.data._id;
          const rowData: DarkhastType = d.data;
          const rowIndex = this.listDarkhastGrid.instance.getRowIndexByKey(
            d.data._id
          );
          rowData.vazeiat = 'لغو شده';
          this.apiService.updateDarkhast(rowData, rowKey).subscribe(
            () => {
              this.listDarkhastGrid.instance.cellValue(
                rowIndex,
                'vazeiat',
                'لغو شده'
              );
              this.toastr.success('درخواست با موفقیت لغو گردید');
              this.listDarkhastGrid.instance.cancelEditData();
            },
            error => {
              this.toastr.error('خطا در لغو درخواست');
              console.log(error);
            }
          );
        }
      });
  }

  editRow(d) {
    this.editingMode = true;
    const rowKey = d.data._id;
    this.editingRowKey = rowKey;
    const rowData: DarkhastType = d.data;
    const rowIndex = this.listDarkhastGrid.instance.getRowIndexByKey(
      d.data._id
    );
    this.oldTedadSahm = this.listDarkhastGrid.instance.cellValue(
      rowIndex,
      'tedadSahm'
    );
    this.listDarkhastGrid.instance.editCell(rowIndex, 'tedadSahm');
  }

  rowUpdating(e) {
    this.confirmService
      .confirm('اخطار', 'آیا ازثبت تغییرات درخواست اطمینان دارید؟', [
        'Yes',
        'No'
      ])
      .subscribe(answer => {
        if (answer === 'Yes') {
          const newTedadSahm = e.newData.tedadSahm;
          const oldTedadSahm = this.oldTedadSahm;
          if (newTedadSahm < oldTedadSahm) {
            console.log(e);
            const rowData = e.oldData;
            rowData.tedadSahm = newTedadSahm;
            this.apiService
              .updateDarkhast(rowData, this.editingRowKey)
              .subscribe(
                () => {
                  this.toastr.success('تعداد با موفقیت کاهش یافت');
                  this.editingMode = false;
                  this.listDarkhastGrid.instance.cancelEditData();
                  e.cancel = true;
                  this.getListDarkhast();
                },
                error => {
                  this.toastr.error('خطا در کاهش تعداد');
                  e.cancel = true;
                  this.listDarkhastGrid.instance.cancelEditData();
                  console.log(error);
                }
              );
          } else {
            this.toastr.error('شما تنها مجاز به کاهش تعداد هستید');
            e.cancel = true;
            this.editingMode = false;
            this.listDarkhastGrid.instance.cancelEditData();
          }
        } else {
          e.cancel = true;
          this.editingMode = false;
          this.listDarkhastGrid.instance.cancelEditData();
          this.getListDarkhast();
        }
      });
  }

  keyDown(e) {
    if (e.event.keyCode === 27) {
      this.confirmService
        .confirm('اخطار', 'آیا ازثبت تغییرات درخواست اطمینان دارید؟', [
          'Yes',
          'No'
        ])
        .subscribe(answer => {
          if (answer === 'Yes') {
            // save request
            this.listDarkhastGrid.instance.saveEditData();
            this.editingMode = false;
          } else {
            this.cancelEdit(e);
          }
        });
    }
  }

  cancelEdit(d) {
    this.listDarkhastGrid.instance.cancelEditData();
    this.editingMode = false;
  }

  saveChange(d) {
    this.listDarkhastGrid.instance.saveEditData();
    this.editingMode = false;
  }
}
