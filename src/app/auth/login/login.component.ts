import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      res => {
        this.authService.saveToken(res.token);
        this.authService.isAuthenticated();
      }
      , err => {
        console.log(err);
      }
    );
  }
  ngOnInit() {
  }

}
