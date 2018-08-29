import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../shared/services/api.service';
import { UserType } from '../shared/types/user';
import { PasswordType } from '../shared/types/password';
import { ClaimType } from '../shared/types/claim';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {

  constructor(private toastr: ToastrService, private apiService: ApiService) { }

  user: UserType = {};
  passwordObject: PasswordType = {};
  errorMessage: string = null;

  username: string;
  codeMelli: string;
  claimList: ClaimType[];

  ngOnInit() {
    this.apiService.getClaimList()
      .subscribe(
        (data) => {
          this.claimList = data;
        },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در بازیابی لیست دسترسی های کاربر');
        }
      );
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

  addClaimToUser(id) {
    // add to user claims
    let claimItem = this.claimList.find((claimObject) => { return claimObject._id === id; });
    this.user.claims.push(claimItem);
    // remove from claimList
    this.claimList = this.claimList.filter(function (claimItem) {
      return claimItem._id !== id;
    });
  }

  removeClaimFromUser(id) {
    // add to claimLIst
    let claimItem = this.user.claims.find((claimObject) => { return claimObject._id === id; });
    this.claimList.push(claimItem);
    // remove from user claims
    this.user.claims = this.user.claims.filter(function (claimItem) {
      return claimItem._id !== id;
    });
  }
}
