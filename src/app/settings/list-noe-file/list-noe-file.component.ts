import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { NoeFileType } from '../../shared/types/noeFile';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/catch';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { ConfirmService } from '../../shared/services/confirm.service';

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
            () => {
              this.toastr.success('نوع سند با موفقیت حذف گردید');
              this.listNoeFileGrid.instance.deleteRow(rowIndex);
            },
            error => {
              this.toastr.error('خطا در حذف نوع سند');
              console.log(error);
            }
          );
        }
      });
  }
  editRow(d) {}
  rowUpdating(d) {}
  keyDown(d) {}
  cancelEdit(d) {}
  saveChanges(d) {}
  sabtNoeFile(d) {}

  onRowPrepared(e) {}
}
