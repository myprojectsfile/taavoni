import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../shared/services/api.service';
import { UserType } from '../../shared/types/user';
import { AuthService } from '../../auth/auth.service';
import { PasswordType } from '../../shared/types/password';
import { FileManagerComponent } from '../../shared/components/file-manager/file-manager.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private toastr: ToastrService, private apiService: ApiService, private authService: AuthService) { }

  user: UserType = {};
  passwordObject: PasswordType = {};
  errorMessage: string = null;
  @ViewChild('filemanager') fileManagerComponent: FileManagerComponent;

  ngOnInit() {
    const username = this.authService.getUsername();
    this.apiService.getUserByUsername(username)
      .subscribe(
        (userData) => {
          this.user = userData[0];
          this.fileManagerComponent.getUserFile(this.user.username);
        },
        (error) => {
          console.log(error);
          this.toastr.error('خطا در بازیابی مشخصات کاربر');
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
    const userUpdate: UserType = {};
    userUpdate.password = this.passwordObject.newPassword;
    this.apiService.updateUserPassById(userUpdate, this.user._id, this.passwordObject.oldPassword)
      .subscribe((data) => {
        this.toastr.success('کلمه عبور با موفقیت تغییر یافت');
      },
        (err) => {
          console.log(err);
          this.toastr.error(err.error);
        });
  }

  userChanged(newUser: UserType) {
    this.user = newUser;
  }
}
