import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Router, RouterLinkWithHref } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ClaimType } from '../shared/types/claim';
import { UserType } from '../shared/types/user';

@Injectable()

export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router, private jwt: JwtHelperService) { }

  apiUri = environment.apiUri;


  login(username, password) {
    const body = {
      username: username,
      password: password
    };

    return this.httpClient.post<any>(this.apiUri + '/login', body);
  }

  register(username, password, name, family, codeMelli, mobile) {
    const body = {
      username: username,
      password: password,
      name: name,
      family: family,
      codeMelli: codeMelli,
      mobile: mobile
    };

    return this.httpClient.post<any>(this.apiUri + '/register', body);

  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated();
    this.router.navigate(['']);
  }

  saveToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getToken();

    if (token) {
      const tokenDecoded = this.jwt.decodeToken(token);
      const isExpired = this.jwt.isTokenExpired(token);
      if (isExpired) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  userHasClaim(claim: string) {
    const token = this.getToken();
    if (token) {
      const tokenPayload: any = this.tokenPayload();
      const userClaims: ClaimType[] = tokenPayload.user.claimha;
      if (!userClaims) { return false; } else {
        const claimItem = userClaims.find((userClaimItem) => {
          return userClaimItem._id === claim;
        });
        if (claimItem) { return true; }
      }
    }
    return false;
  }

  tokenPayload() {
    const tokenPayload = this.jwt.decodeToken(this.getToken());
    return tokenPayload;
  }

  getUsername() {
    const tokenPayload = this.jwt.decodeToken(this.getToken());
    if (tokenPayload) { return tokenPayload.user.username; }
    return null;
  }
  getUserId() {
    const tokenPayload = this.jwt.decodeToken(this.getToken());
    if (tokenPayload) { return tokenPayload.user._id; }
    return null;
  }

  getUserFullname() {
    const tokenPayload = this.jwt.decodeToken(this.getToken());
    if (tokenPayload) { return tokenPayload.user.fullName; }
    return null;
  }

  userHasConfiremed(): boolean {
    const token = this.getToken();
    let userHasConfiremed: boolean = false;

    if (token) {
      const tokenPayload: any = this.tokenPayload();
      const user: UserType = tokenPayload.user;
      userHasConfiremed = user.confirmed;
    }

    return userHasConfiremed
  }
}
