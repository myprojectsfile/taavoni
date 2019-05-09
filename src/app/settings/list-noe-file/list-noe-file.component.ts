import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { NoeFileType } from '../../shared/types/noeFile';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/catch';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { ConfirmService } from '../../shared/services/confirm.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-noe-file',
  templateUrl: './list-noe-file.component.html',
  styleUrls: ['./list-noe-file.component.css']
})
export class ListNoeFileComponent implements OnInit {
  noeFile: NoeFileType = {};
  listNoeFile: NoeFileType[];
  listNoeFileDataSource: any;
  @ViewChild('listNoeFileGrid') listNoeFileGrid: DxDataGridComponent;
  oldNoeFile: number;
  editingRowKey: string;
  editingMode: boolean;
  gridInstance: DxDataGridComponent['instance'];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private confirmService: ConfirmService
  ) {}
  ngOnInit() {
    this.getListNoeFile();
  }

  private getListNoeFile() {
    this.apiService.getListNoeFile().subscribe(
      data => {
        this.listNoeFile = data;
        this.listNoeFileDataSource = {
          store: {
            type: 'array',
            key: '_id',
            data: this.listNoeFile
          }
        };
      },
      error => {
        console.log(`error in getting list noe file, error: ${error}`);
        this.toastr.error(
          'دریافت لیست نوع فایل با خطا مواجه شد.با مدیر سیستم تماس بگیرید.',
          'خطا در فراخوانی وب سرویس'
        );
      }
    );
  }

  delete(d) {
    this.confirmService
      .confirm('اخطار', 'آیا از حذف این ردیف اطمینان دارید؟', ['Yes', 'No'])
      .subscribe(answer => {
        if (answer === 'Yes') {
          // delete row
          const rowKey = d.data._id;
          const rowIndex = this.listNoeFileGrid.instance.getRowIndexByKey(
            rowKey
          );
          this.apiService.hazfNoeFile(rowKey).subscribe(
            (response: Response) => {
              this.toastr.success('نوع سند با موفقیت حذف گردید');
              this.listNoeFileGrid.instance.deleteRow(rowIndex);
            },
            (error: HttpErrorResponse) => {
              if (error.status === 405) {
                this.toastr.error(
                  'این نوع سند قبلا مورد استفاده قرار کرفته است',
                  'این نوع سند قابل حذف نمی باشد'
                );
              } else {
                this.toastr.error('خطا در حذف نوع سند');
                console.log(error);
              }
            }
          );
        }
      });
  }
  editRow(d) {
    this.editingMode = true;
    const rowKey = d.data._id;
    this.editingRowKey = rowKey;
    const rowData: NoeFileType = d.data;
    const rowIndex = this.listNoeFileGrid.instance.getRowIndexByKey(d.data._id);
    this.oldNoeFile = this.listNoeFileGrid.instance.cellValue(
      rowIndex,
      'noeFile'
    );
    this.listNoeFileGrid.instance.editCell(rowIndex, 'noeFile');
  }

  keyDown(d) {}

  cancelEdit(d) {
    this.listNoeFileGrid.instance.cancelEditData();
    this.editingMode = false;
  }

  saveChange(d) {
    this.listNoeFileGrid.instance.saveEditData();
    this.editingMode = false;
  }

  sabtNoeFile() {
    this.apiService.sabtNoeFile(this.noeFile).subscribe(
      result => {
        this.toastr.info('نوع سند جدید با موفقیت ثبت شد.', 'نوع سند جدید');
        this.noeFile.noeFile = '';
        this.getListNoeFile();
      },
      error => {
        console.log(`خطا در ثبت نوع سند جدید :${error}`);
        this.toastr.error(`خطا در ثبت نوع سند جدید`, 'نوع سند جدید');
      }
    );
  }

  rowUpdating(e) {
    this.confirmService
      .confirm('اخطار', 'آیا از ثبت تغییرات اطمینان دارید؟', ['Yes', 'No'])
      .subscribe(answer => {
        if (answer === 'Yes') {
          const updatedNoeFile: NoeFileType = e.newData;
          this.apiService
            .updateNoeFile(updatedNoeFile, this.editingRowKey)
            .subscribe(
              () => {
                this.toastr.success('تغییرات با موفقیت ثبت شد');
                this.editingMode = false;
                this.listNoeFileGrid.instance.cancelEditData();
                e.cancel = true;
                this.getListNoeFile();
              },
              error => {
                this.toastr.error('خطا در ثبت تغییرات لیست نوع سند');
                e.cancel = true;
                this.listNoeFileGrid.instance.cancelEditData();
                console.log(error);
              }
            );
        } else {
          e.cancel = true;
          this.editingMode = false;
          this.listNoeFileGrid.instance.cancelEditData();
          this.getListNoeFile();
        }
      });
  }
}
