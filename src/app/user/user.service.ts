import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PortfoType } from '../shared/types/portfo';
import { UserType } from '../shared/types/user';

@Injectable()
export class UserService {
  apiUri = environment.apiUri;

  constructor(private httpClient: HttpClient) { }

  // User methods
  getUserByUsername(username: string) {
    return this.httpClient.get<UserType>(this.apiUri + '/user/byUsername/' + username);
  }

  getUserById(id: string) {
    return this.httpClient.get<UserType>(this.apiUri + '/user/' + id);
  }

  updateUserById(user: UserType, id: string) {
    return this.httpClient.put<UserType>(this.apiUri + '/user/' + id, user);
  }

  // Profile methods
  getPortfohByUsername(username: string) {
    return this.httpClient.get<PortfoType>(this.apiUri + '/portfo/byUsername/' + username);
  }

  updatePortfoById(portfo: PortfoType, id: string) {
    return this.httpClient.put<PortfoType>(this.apiUri + '/portfo/' + id, portfo);
  }

  sabtPortfo(portfo: PortfoType) {
    return this.httpClient.post(this.apiUri + '/portfo', portfo);
  }
  
}
