import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
// import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  errorMessage: string = null;

  constructor(
    private authService: AuthService,
    // private location: Location,
    private toastr: ToastrService,
    private jwt: JwtHelperService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      res => {
        this.authService.saveToken(res.token);
        const isAuthenticted = this.authService.isAuthenticated();
        const tokenPayload: any = this.authService.tokenPayload();
        this.toastr.success('به سامانه تعاونی کارکنان بندر بوشهر خوش آمدید');
        this.router.navigate(['']);
        // this.location.back();
      },
      errRes => {
        console.log(errRes);
        this.errorMessage = errRes.error.message;
      }
    );
  }
  ngOnInit() {}
}
