import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { DarkhastType } from '../shared/types/darkhast';

@Injectable()
export class RequestService {

  apiUri = environment.apiUri;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getListDarkhastUser() {
    const username = this.authService.getUsername();
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/darkhast/byUsername/' + username);
  }

  updateDarkhast(darkhast: DarkhastType, rowKey: string) {
    return this.httpClient.put(this.apiUri + '/darkhast/' + rowKey, darkhast);
  }

}


