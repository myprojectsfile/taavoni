import { Component, OnInit, HostBinding, Input, Output, EventEmitter, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileManagerService } from './file-manager.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { NoeFileType } from '../../types/noeFile';
import { UserFileType } from '../../types/userFile';
import { UserType } from '../../types/user';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})

export class FileManagerComponent implements OnInit {


  constructor(private fimeMangerService: FileManagerService, private apiService: ApiService, private toastr: ToastrService) { }

  @HostBinding('attr.user')
  @Input()
  user: UserType;

  @Output() userChanged = new EventEmitter<UserType>();

  @ViewChild('myModal') myModal;

  selectedFile?: File;
  listNoeFile: NoeFileType[] = [];
  noeFile = '';
  progress = 0;
  userFiles: UserFileType[] = [] as UserFileType[];
  uploadedFile: UserFileType = {} as UserFileType;
  imageUrl = '#';

  ngOnInit() {
    this.getListNoeFile();
  }

  private getListNoeFile() {
    this.apiService.getListNoeFile()
      .subscribe((listNoeFileResponse) => {
        this.listNoeFile = listNoeFileResponse;
      }, (error) => {
        console.log(error);
        this.toastr.error('خطا در بازیابی لیست نوع فایل');
      });
  }

  public getUserFile(username: string) {
    this.apiService.getUserFilesByUsername(username)
      .subscribe((userFiles) => {
        this.userFiles = userFiles;
      }, (error) => {
        console.log(error);
        this.toastr.error('خطا در بازیابی لیست فایل های کاربر');
      });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {

    this.fimeMangerService.uploadFile(this.selectedFile)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            // ثبت مشخصات فایل بارگذاری شده در پروفایل کاربر

            const file: any = event.body.file;

            this.uploadedFile.filename = file.filename;
            this.uploadedFile.mimetype = file.mimetype;
            this.uploadedFile.noeFile = this.noeFile;
            this.uploadedFile.uploadDate = file.uploadDate;
            this.uploadedFile.encoding = file.encoding;
            this.uploadedFile.md5 = file.md5;
            this.uploadedFile.originalname = file.originalname;
            this.uploadedFile.size = file.size;


            this.apiService.addFileToUser(this.user.username, this.uploadedFile)
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
          this.toastr.error('خطا در بارگذاری تصویر');
          console.log('Upload Error:', err);
          this.selectedFile = null;
          this.noeFile = '';
          this.progress = 0;

        }, () => {
          // console.log("Upload done");
        }
      );
  }

  previewFile(filename: string) {
    this.fimeMangerService.downloadFile(filename)
      .subscribe(
        (data) => {
          const blob = new Blob([data], { type: 'image/png' });
          const url = window.URL.createObjectURL(blob);
          const image = new Image();
          image.src = url;
          const imageContainer = document.getElementById('imageContainer').setAttribute('src', url);
          // console.log(imageContainer);
          // document.body.appendChild(image);
          // const pwa = window.open(url);
          this.openModal();
        },
        (error) => { }
      );
  }

  downloadFile(filename: string) {
    this.fimeMangerService.downloadFile(filename)
      .subscribe(
        (data) => {
          const blob = new Blob([data], { type: 'image/png;' });
          const dwldLink = document.createElement('a');
          const url = URL.createObjectURL(blob);
          const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
          if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
            dwldLink.setAttribute('target', '_blank');
          }
          dwldLink.setAttribute('href', url);
          dwldLink.setAttribute('download', 'preview.png');
          dwldLink.style.visibility = 'hidden';
          document.body.appendChild(dwldLink);
          dwldLink.click();
          document.body.removeChild(dwldLink);
        },
        (error) => { }
      );
  }


  openModal() {
    document.getElementById('previewModal').click();
  }

  // closeModel() {
  //    this.myModal.nativeElement.className = 'modal hide';
  // }
}
