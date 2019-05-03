import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    $(window).scroll(() => {
      const position = $(window).scrollTop();
      if (position >= 200) {
        $('.navbar').addClass('navbar-change');
      } else {
        $('.navbar').removeClass('navbar-change');
      }
    });
  }
  constructor(public authService: AuthService) {}

  userHasClaim(claim: string) {
    return this.authService.userHasClaim(claim);
  }

  userHasConfiremd() {
    return this.authService.userHasConfiremed();
  }

  userIsAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
