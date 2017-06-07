import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadingClient } from './loading-client';
import { AppSettings } from './app-settings';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpClient provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class HttpClient {
  token: string;
  timeout_value: number = 5000;

  constructor(public http: Http,
      private storage: Storage,
      private loading: LoadingClient,) {}

  getApiToken() : Observable<any> {
    return Observable.fromPromise(this.storage.get('token'))
  }

  createAuthorizationHeader(token) : Headers{
    let headers = new Headers();
    return headers;
  }

  getRequest(endpoint: string, loading:boolean, last_id:number = 0): Observable<any> {
    console.log(AppSettings.getApiUrl() + endpoint)
    return this.getApiToken().flatMap(token => {
      let headers: Headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);
      console.log('get')
      return this.http.get(AppSettings.getApiUrl() + endpoint + '?last_id='+last_id, {headers: headers})
        .timeout(this.timeout_value)
        .map(res =>  res.json())
    });
  }

  postRequest(endpoint: string, data) : Observable<any>{
    return this.getApiToken().flatMap(token => {

      let headers: Headers = new Headers();
      headers.append('Authorization', 'Bearer ' + token);

      return this.http.post(AppSettings.getApiUrl() + endpoint, data, {headers:headers})
        .timeout(this.timeout_value).map(res =>  res.json())
    });
  }

  //<>

  public getLastId(data): number{
    if (data) {
      return data[0]['id']
    }
    return 0
  }
}
