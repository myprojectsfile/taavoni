import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MoamelehType } from '../shared/types/moameleh';
import { PortfoType } from '../shared/types/portfo';

@Injectable()
export class MoamelatService {
  apiUri = environment.apiUri;

  constructor(private httpClient: HttpClient) { }

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
    return this.httpClient.post(this.apiUri + '/moameleh', moameleh);
  }

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
