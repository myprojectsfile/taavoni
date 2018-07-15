import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DarkhastType } from '../shared/types/darkhast';

@Injectable()
export class DarkhastService {

  apiUri = environment.apiUri;

  constructor(private httpClient: HttpClient) {
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
}
