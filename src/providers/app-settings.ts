import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const CONFIG = {
	apiUrl: 'http://spazio.solunes.com/api'
};

@Injectable()
export class AppSettings {

  constructor() {}

  static getApiUrl(){
  	return CONFIG.apiUrl;
  }
}
