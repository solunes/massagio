import { Component, trigger, state, style, transition, animate} from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { HttpClient } from '../../providers/http-client';
import { AppSettings } from '../../providers/app-settings';

import { LoadingClient } from '../../providers/loading-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('itemState', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      //Enter
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-50%)'
        }),
        animate('400ms ease-in-out')
      ]),
    ])
  ]
})
export class HomePage {
	title_page = 'Inicio';
  articles: Array<any> = new Array();
  notificationsCount: number;
  key_page: string = '/articles';

  constructor(private navCtrl: NavController, 
    private auth: AuthService, 
    private http: HttpClient,
    private loading: LoadingClient,
    private app_settings: AppSettings,
    private storage: Storage) {

    storage.get(this.key_page).then(data => {
      loading.showLoading(data)
      let last_id
      if (data) {
        this.articles = data;
        last_id = http.getLastId(this.articles)
      }
      http.getRequest(this.key_page, this.loading.loading_page, last_id).subscribe(result => {
        for (var i = 0; i < result['articles'].length; i++) {
          this.articles.push(result['articles'][i])
        }
        loading.dismiss()
        storage.set(this.key_page, this.articles)
      }, error => loading.showError(error))
    });
  }
}
