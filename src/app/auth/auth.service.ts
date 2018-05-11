import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  apiUri = environment.apiUri;

  login(username, password) {
    let body = {
      username: username,
      password: password
    }

    return this.httpClient.post<any>(this.apiUri + '/login', body);

  }

  register(username, password, name, family, mobile) {
    let body = {
      username: username,
      password: password,
      name: name,
      family: family,
      mobile: mobile
    }

    return this.httpClient.post<any>(this.apiUri + '/register', body);

  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated();
  }

  saveToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
