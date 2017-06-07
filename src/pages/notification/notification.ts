import { Component, trigger, state, style, animate, transition } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '../../providers/http-client';
import { AppRouter } from '../../providers/app-router';
import { LoadingClient } from '../../providers/loading-client';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
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
export class NotificationPage {
  title_page = 'Notificaciones';
  notificationsCount: number;
  notifications: Array<JSON> = new Array();
  key_page: string = '/notifications';

  constructor(public navCtrl: NavController, 
    public storage: Storage,
    private http: HttpClient,
    private loading: LoadingClient,
    private router: AppRouter,
    public navParams: NavParams) {

      storage.set('notificationsCount','');
      storage.get(this.key_page).then(data => {
        let last_id
        if (data) {
          this.notifications = data
          last_id = http.getLastId(this.notifications)
        }
        if (!this.loading.loading_page) {
          this.loading.showLoading(last_id)
          http.getRequest(this.key_page, this.loading.loading_page, last_id).subscribe((result: Array<JSON>) => {
            for (var i = 0; i < result['notifications'].length; i++) {
              this.notifications.unshift(result['notifications'][i])
            }
            storage.set(this.key_page, this.notifications);
            this.loading.dismiss()
          }, error => this.loading.showError(error))
        }
      });
  }

  onClickItem(notifiItem){
    // /*path*/
    // link externo
    // nada
    let path = String(notifiItem.url);
    let split = path.split('://');
    if (split[0] == 'http' || split[0] == 'https') {
      console.log('link externo');
    } else if (split[0] == 'solunes') {
      console.log('link interno');
      this.navCtrl.setRoot(this.router.getPage(split[1]))
    } else {
      console.log('nada');
    }
  }
}
