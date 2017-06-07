import { Component, trigger, style, state, transition, animate } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '../../providers/http-client';
import { LoadingClient } from '../../providers/loading-client';

/*
  Generated class for the Event page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
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
export class EventPage {
  title_page = 'Eventos';
  notificationsCount: number;
  events: Array<any> = new Array();
  key_page: string = '/events'

  constructor(public navCtrl: NavController, 
    public loading: LoadingClient,
    public storage: Storage,
    public http: HttpClient,
    public navParams: NavParams) {}

  ionViewDidLoad() {
    this.storage.get(this.key_page).then(data => {
      this.loading.showLoading(data)
      let last_id
      if (data) {
        this.events = data;
        last_id = this.http.getLastId(this.events)
      }
      this.http.getRequest(this.key_page, this.loading.loading_page, last_id).subscribe(result => {
        console.log(result)
        for (var i = 0; i < result['events'].length; i++) {
          this.events.push(result['events'][i])
        }
        this.loading.dismiss()
        this.storage.set(this.key_page, this.events)
      }, error => this.loading.showError(error))
    })
  }

}
