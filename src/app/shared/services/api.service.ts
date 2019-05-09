import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DarkhastType } from '../types/darkhast';
import { MoamelehType } from '../types/moameleh';
import { AuthService } from '../../auth/auth.service';
import { UserType } from '../types/user';
import { GheymatType } from '../types/gheymat';
import { ClaimType } from '../types/claim';
import { NoeFileType } from '../types/noeFile';
import { UserFileType } from '../types/userFile';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUri = environment.apiUri;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getSafeKharid() {
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeKharid');
  }

  getSafeForush() {
    return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeForush');
  }

  sabtDarkhastKharid(darkhast: DarkhastType) {
    const userId = this.authService.getUserId();
    return this.httpClient.post(this.apiUri + `/safeKharid/${userId}`, darkhast);
  }

  sabtDarkhastForush(darkhast: DarkhastType) {
    const userId = this.authService.getUserId();
    return this.httpClient.post(this.apiUri + `/safeForush/${userId}`, darkhast);
  }

  getListDarkhast(noeDarkhast: string) {
    if (noeDarkhast === 'kharid') {
      return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeKharid');
    } else {
      return this.httpClient.get<DarkhastType[]>(this.apiUri + '/safeForush');
    }
  }

  getTedadKolSahamForushUser() {
    const userId = this.authService.getUserId();
    return this.httpClient.get<any>(
      this.apiUri + '/safeForush/tedadKolSahamForushUser/' + userId
    );
  }

  updateDarkhastById(darkhast: DarkhastType, id: string) {
    return this.httpClient.put<DarkhastType>(
      this.apiUri + '/darkhast/' + id,
      darkhast
    );
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
    return this.httpClient.put<MoamelehType>(
      this.apiUri + '/moameleh/' + id,
      moameleh
    );
  }

  sabtMoameleh(moameleh: any) {
    return this.httpClient.post<any>(
      this.apiUri + '/moameleh',
      moameleh
    );
  }

  getListDarkhastUser() {
    const userId = this.authService.getUserId();
    return this.httpClient.get<DarkhastType[]>(
      this.apiUri + '/darkhast/byUserId/' + userId
    );
  }

  updateDarkhast(darkhast: DarkhastType, rowKey: string) {
    return this.httpClient.put(this.apiUri + '/darkhast/' + rowKey, darkhast);
  }


  getUserPortfoById() {
    const userId = this.authService.getUserId();
    return this.httpClient.get<UserType>(
      this.apiUri + '/portfo/byId/' + userId
    );
  }

  getTedadSahmUser() {
    const userId = this.authService.getUserId();
    return this.httpClient.get<any>(
      this.apiUri + '/user/getTedadSahm/' + userId
    );
  }

  // User methods
  getUserByUsername(username: string) {
    return this.httpClient.get<UserType[]>(
      this.apiUri + '/user/byUsername/' + username
    );
  }

  // User methods
  getUserByUserId(userId: string) {
    return this.httpClient.get<UserType>(
      this.apiUri + '/user/byUserId/' + userId
    );
  }

  async getUserByUsernameAsync(username: string) {
    const result = await this.httpClient
      .get<UserType>(this.apiUri + '/user/byUsername/' + username)
      .toPromise();
    return result;
  }

  getUserByCodeMelli(codeMelli: string) {
    return this.httpClient.get<UserType[]>(
      this.apiUri + '/user/byCodeMelli/' + codeMelli
    );
  }

  async getUserByCodeMelliAsync(codeMelli: string) {
    const result = await this.httpClient
      .get<UserType>(this.apiUri + '/user/byCodeMelli/' + codeMelli)
      .toPromise();
    return result;
  }

  getUserById(id: string) {
    return this.httpClient.get<UserType>(this.apiUri + '/user/' + id);
  }

  getUserFilesByUserId(userId: string) {
    return this.httpClient.get<UserFileType[]>(
      this.apiUri + '/user/getUserFiles/' + userId
    );
  }

  CheckUserExistByUsernameOrCodemelli(username, codeMelli) {
    return this.httpClient.get<UserType>(
      this.apiUri + `/user/byUsername/${username}/byCodeMelli/${codeMelli}`
    );
  }

  updateUserById(user: UserType, id: string) {
    return this.httpClient.put<UserType>(this.apiUri + '/user/' + id, user);
  }

  updateUserPassById(user: UserType, id: string, oldPassword: string) {
    return this.httpClient.put<UserType>(
      this.apiUri + '/user/updatePass/' + id + '/' + oldPassword,
      user
    );
  }

  addFileToUser(userId: string, noeFileId: string, userFile: UserFileType) {
    return this.httpClient.put<UserType>(
      this.apiUri + `/user/updateUserFiles/${userId}/noeFileId/${noeFileId}`,
      userFile
    );
  }


  checkUserHasNoActiveCrossRequest(noeDarkhast: number) {
    const userId = this.authService.getUserId();
    return this.httpClient.get(
      this.apiUri +
        `/darkhast/hasNoActiveRequest/noeDarkhast/${noeDarkhast}/byUserId/${userId}`
    );
  }

  // claim methods
  getClaimList() {
    return this.httpClient.get<ClaimType[]>(this.apiUri + '/claim');
  }
  // gheymatRoozSahm

  getAkharinGheymatSahm() {
    return this.httpClient.get<GheymatType>(
      this.apiUri + '/gheymatRoozSahm/akharinGheymat'
    );
  }

  sabtGheymatSahm(gheymat: GheymatType) {
    return this.httpClient.post(this.apiUri + '/gheymatRoozSahm', gheymat);
  }

  findUser(username: string, codeMelli: string) {}

  // noeFile routes
  getListNoeFile() {
    return this.httpClient.get<NoeFileType[]>(this.apiUri + '/noeFile');
  }

  sabtNoeFile(noeFile: NoeFileType) {
    return this.httpClient.post(this.apiUri + '/noeFile', noeFile);
  }

  updateNoeFile(noeFile: NoeFileType, id: string) {
    return this.httpClient.put(this.apiUri + '/noeFile/' + id, noeFile);
  }

  hazfNoeFile(id: string) {
    return this.httpClient.delete(this.apiUri + '/noeFile/' + id);
  }
}
