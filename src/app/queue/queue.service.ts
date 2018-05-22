import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class QueueService {
  apiUri = environment.apiUri;
  constructor(private httpClient: HttpClient) {
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

}

export interface QueueType {
  username?: string;
  fullName?: string;
  tedadSahm: number;
  arzeshSahm: number;
  tarikhDarkhast?: Date;
}
