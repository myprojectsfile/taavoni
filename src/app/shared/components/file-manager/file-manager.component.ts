import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileManagerService } from './file-manager.service';
import { NoeFileType } from '../../types/noeFile';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor(private fimeMangerService: FileManagerService, private apiService: ApiService, private toastr: ToastrService) { }

  selectedFile?: File;
  listNoeFile: NoeFileType[] = [];
  noeFile: string = '';

  ngOnInit() {
    this.apiService.getListNoeFile()
      .subscribe(
        (listNoeFileResponse) => {
          this.listNoeFile = listNoeFileResponse;
          console.log(this.listNoeFile);

        },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در بازیابی لیست نوع فایل');
        }
      );
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  uploadFile() {

    this.fimeMangerService.uploadFile(this.selectedFile)
      .subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          console.log("Upload Error:", err);
        }, () => {
          console.log("Upload done");
        }
      );
  }
}