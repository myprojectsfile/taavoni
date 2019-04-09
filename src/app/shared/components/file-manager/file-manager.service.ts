import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  apiUri = environment.apiUri;
  fileUploadUri = this.apiUri + '/file/upload';
  fileDownloadUri = this.apiUri + '/file/';
  fileDeleteUri = this.apiUri + '/file/';

  constructor(private httpClient: HttpClient) { }

  uploadFile(file: File): Observable<HttpEvent<any>> {

    const formData = new FormData();
    formData.append('file', file, file.name);

    const params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', this.fileUploadUri, formData, options);
    return this.httpClient.request(req);
  }

  downloadFile(filename: string): Observable<any> {
    return this.httpClient.get(this.fileDownloadUri + filename, { responseType: 'arraybuffer' });
  }

  deleteFile(filename: string): Observable<any> {
    return this.httpClient.delete(this.fileDeleteUri+ filename);
  }

}
