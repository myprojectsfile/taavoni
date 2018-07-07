import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RequestService {

  apiUri = environment.apiUri;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getListDarkhastUser() {
    const username = this.authService.getUsername();
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/darkhast/' + username);
  }

  updateDarkhast(darkhast: DarkhastType, rowKey: string) {
    return this.httpClient.put(this.apiUri + '/darkhast/' + rowKey, darkhast);
  }

}


export interface DarkhastType {
  _id?: string;
  username?: string;
  fullName?: string;
  tedadSahm: number;
  tedadMoamelehShodeh: number;
  tedadBaghiMandeh: number;
  arzeshSahm: number;
  tarikhDarkhast?: Date;
  vazeiat: string;
  tozihat: string;
  noeDarkhst: string;
}