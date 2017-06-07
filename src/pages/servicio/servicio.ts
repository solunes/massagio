import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HttpClient } from '../../providers/http-client';
import { LoadingClient } from '../../providers/loading-client';
import { CalendarPage } from '../../pages/calendar/calendar';

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
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
export class ServicioPage {
  title_page = 'Servicio';
  notificationsCount: number;
  key_page: string = '/services'
  services: Array<JSON> = new Array();

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
        this.services = data
        last_id = this.http.getLastId(this.services)
      }
      this.http.getRequest(this.key_page, this.loading.loading_page, last_id).subscribe(result => {
        console.log(JSON.stringify(result))
        for (var i = 0; i < result['services'].length; i++) {
          this.services.push(result['services'][i])
        }
        this.loading.dismiss()
        this.storage.set(this.key_page, this.services)
      }, error => this.loading.showError(error))
    })
  }

  calendar(servicio){
    console.log(servicio)
    this.navCtrl.push(CalendarPage, servicio)
  }
}
