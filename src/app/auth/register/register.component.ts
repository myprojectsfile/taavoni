import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService,private toastr:ToastrService,private location:Location) { }

  username: string;
  password: string;
  name: string;
  family: string;
  mobile: string;

  register() {
    this.authService.register(this.username, this.password, this.name, this.family, this.mobile)
      .subscribe(
        res => {
          this.authService.saveToken(res.token);
          this.toastr.success('به سامانه تعاونی کارکنان بندر بوشهر خوش آمدید','ثبت نام در سامانه');
          this.location.back();
        },
        error => {
          console.log(`register error: ${error}`);
        }
      );
  }
}
