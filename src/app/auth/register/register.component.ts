import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService) { }

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
        },
        error => {
          console.log(`register error: ${error}`);
        }
      );
  }
}
