import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { QueueType } from '../types/queue';
import { DarkhastType } from '../types/darkhast';
import { MoamelehType } from '../types/moameleh';
import { AuthService } from '../../auth/auth.service';
import { PortfoType } from '../types/portfo';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  apiUri = environment.apiUri;
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getSafeKharid() {
    return this.httpClient.get<QueueType[]>(this.apiUri + '/safeKharid');
  }

  getSafeForush() {
    return this.httpClient.get<QueueType[]>(this.apiUri + '/safeForush');
  }

  sabtDarkhastKharid(darkhast: QueueType) {
    return this.httpClient.post(this.apiUri + '/safeKharid', darkhast);
  }

  sabtDarkhastForush(darkhast: QueueType) {
    return this.httpClient.post(this.apiUri + '/safeForush', darkhast);
  }

  getListDarkhast(noeDarkhast: string) {
    if (noeDarkhast == 'kharid') {
      return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeKharid');
    }
    else return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeForush');
  }

  updateDarkhastById(darkhast: DarkhastType, id: string) {
    return this.httpClient.put<DarkhastType>(this.apiUri + '/darkhast/' + id, darkhast);
  }

  getMoameleh() {
    return this.httpClient.get<MoamelehType[]>(this.apiUri + '/moameleh');
  }

  getMoamelehById(id: string) {
    return this.httpClient.get<MoamelehType[]>(this.apiUri + '/moameleh/' + id);
  }

  deleteMoamehById(id: string) {
    return this.httpClient.delete(this.apiUri + '/moameleh/' + id);
  }

  updateMoamelehById(moameleh: MoamelehType, id: string) {
    return this.httpClient.put<MoamelehType>(this.apiUri + '/moameleh/' + id, moameleh);
  }

  sabtMoameleh(moameleh: MoamelehType) {
    return this.httpClient.post<MoamelehType>(this.apiUri + '/moameleh', moameleh);
  }

  getListDarkhastUser() {
    const username = this.authService.getUsername();
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/darkhast/byUsername/' + username);
  }

  updateDarkhast(darkhast: DarkhastType, rowKey: string) {
    return this.httpClient.put(this.apiUri + '/darkhast/' + rowKey, darkhast);
  }

  getUserPortfo() {
    const username = this.authService.getUsername();
    return this.httpClient.get<PortfoType>(this.apiUri + '/portfo/byUsername/' + username);
  }
}
