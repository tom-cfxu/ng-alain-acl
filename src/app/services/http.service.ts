import { Injectable } from '@angular/core';
import { Api } from '../api/api'
import { _HttpClient } from '@delon/theme';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http: _HttpClient) {
    this.initApi();
  }
  public api: any = {};
  private initApi() {
    const api = {};
    Api.forEach((item: any) => {
      api[item['api']] = (data = null) => {
        if (item['type'] == 'get') {
          return this.http.get(item['url'], data, { headers: item['header'] })
        } else {
          return this.http.post(item['url'], data, null, { headers: item['header'] })
        }
      }
    });
    this.api = api;
  }
}
