import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const CONFIG = {
	apiUrl: 'http://massaggio.solunes.com/api'
};

@Injectable()
export class AppSettings {

  constructor() {}

  static getApiUrl(){
  	return CONFIG.apiUrl;
  }
}
