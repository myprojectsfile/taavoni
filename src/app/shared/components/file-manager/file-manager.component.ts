import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileManagerService } from './file-manager.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { NoeFileType } from '../../types/noeFile';
import { UserFileType } from '../../types/userFile';
import { UserType } from '../../types/user';

@Component({
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  constructor(private fimeMangerService: FileManagerService, private apiService: ApiService, private toastr: ToastrService) { }

  @HostBinding('attr.username')
  @Input()
  username: string;

  @Output() userChanged = new EventEmitter<UserType>();


  selectedFile?: File;
  listNoeFile: NoeFileType[] = [];
  noeFile: string = '';
  progress: number = 0;
  userFiles: UserFileType[] = [] as UserFileType[];
  uploadedFile: UserFileType = {} as UserFileType;

  ngOnInit() {
    this.apiService.getListNoeFile()
      .subscribe(
        (listNoeFileResponse) => {
          this.listNoeFile = listNoeFileResponse;
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
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            // ثبت مشخصات فایل بارگذاری شده در پروفایل کاربر

            let file: any = event.body.file;

            this.uploadedFile.filename = file.filename;
            this.uploadedFile.mimetype = file.mimetype;
            this.uploadedFile.noeFile = this.noeFile;
            this.uploadedFile.uploadDate = file.uploadDate;
            this.uploadedFile.encoding = file.encoding;
            this.uploadedFile.md5 = file.md5;
            this.uploadedFile.originalname = file.originalname;
            this.uploadedFile.size = file.size;


            this.apiService.addFileToUser(this.username, this.uploadedFile)
              .subscribe(
                (updatedUser) => {
                  this.userFiles = updatedUser.userFiles;
                  this.userChanged.emit(updatedUser);
                  this.toastr.success('تصویر مورد نظر با موفقیت بارگذاری شد');
                  this.selectedFile = null;
                  this.noeFile = '';
                  setTimeout(() => {
                    this.progress = 0;
                  }, 2000);
                },
                (error) => {

                }
              );
          }
        },
        (err) => {
          this.toastr.error('خطا در بارگذاری تصویر')
          console.log("Upload Error:", err);
          this.selectedFile = null;
          this.noeFile = '';
          this.progress = 0;

        }, () => {
          // console.log("Upload done");
        }
      );
  }
}