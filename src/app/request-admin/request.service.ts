import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RequestService {
  apiUri = environment.apiUri;
  constructor(private httpClient: HttpClient) { }

  getListDarkhast() {
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeForush');
  }

  sabtDarkhastKharid(darkhast: DarkhastType) {
    return this.httpClient.post(this.apiUri + '/safeKharid', darkhast);
  }

  sabtDarkhastForush(darkhast: DarkhastType) {
    return this.httpClient.post(this.apiUri + '/safeForush', darkhast);
  }
}


export interface DarkhastType {
  username?: string;
  fullName?: string;
  tedadSahm: number;
  tedadMoamelehShodeh:number;
  tedadBaghiMandeh:number;
  arzeshSahm: number;
  tarikhDarkhast?: Date;
  vazeiat:string;
  tozihat:string;
  noeDarkhst:string;
}