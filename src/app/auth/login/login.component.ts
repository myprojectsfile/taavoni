import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService, private location: Location, private toastr: ToastrService) {
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      res => {
        this.authService.saveToken(res.token);
        this.authService.isAuthenticated();
        this.toastr.success('به سامانه تعاونی کارکنان بندر بوشهر خوش آمدید','ورود به سامانه');
        this.location.back();
      }
      , err => {
        console.log(err);
      }
    );
  }
  ngOnInit() {
  }

}
