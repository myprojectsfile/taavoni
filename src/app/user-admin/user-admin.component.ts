import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../shared/services/api.service';
import { UserType } from '../shared/types/user';
import { PasswordType } from '../shared/types/password';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  constructor(private toastr: ToastrService, private apiService: ApiService) { }

  user: UserType = {};
  response: [];
  passwordObject: PasswordType = {};
  errorMessage: string = null;

  username: string;
  codeMelli: string;

  ngOnInit() {

  }

  saveChanges() {
    this.apiService.updateUserById(this.user, this.user._id)
      .subscribe((data) => {
        this.toastr.success('تغییرات با موفقیت ثبت گردید');
      },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در ثبت تغییرات پروفایل کاربر');
        });
  }

  changePass() {
    let userUpdate: UserType = {};
    userUpdate.password = this.passwordObject.newPassword;
    this.apiService.updateUserPassById(userUpdate, this.user._id)
      .subscribe((data) => {
        this.toastr.success('کلمه عبور با موفقیت تغییر یافت');
      },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در تغییر کلمه عبور');
        });
  }

  findUser() {
    if (this.username) {
      this.apiService.getUserByUsername(this.username)
        .subscribe(
          (user) => {
            if (user.length > 0)
              this.user = user[0];
            else {
              this.user = {};
              this.toastr.info('کاربری با این مشخصات پیدا نشد');
            }
          },
          (error) => {
            console.log(error);
            this.user = {};
            this.toastr.error('خطا در بازیابی کاربر');
          }
        );
    } else if (this.codeMelli) {
      this.apiService.getUserByCodeMelli(this.codeMelli)
        .subscribe(
          (user) => {
            if (user.length > 0)
              this.user = user[0];
            else {
              this.user = {};
              this.toastr.info('کاربری با این مشخصات پیدا نشد');
            }
          },
          (error) => {
            console.log(error);
            this.user = {};
            this.toastr.error('خطا در بازیابی کاربر');
          }
        );
    }
  }

  usernameChange() {
    this.codeMelli = '';
  }
  
  codeMelliChange() {
    this.username = '';
  }
}
