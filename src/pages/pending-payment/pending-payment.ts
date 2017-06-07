import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';

import { HttpClient } from '../../providers/http-client';
import { LoadingClient } from '../../providers/loading-client';
/*
  Generated class for the PendingPayment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pending-payment',
  templateUrl: 'pending-payment.html',
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
export class PendingPaymentPage {
	title_page = 'Pagos Pendientes';
  pendingPayments: Array<JSON> = new Array();
  notificationsCount: number;
  key_page: string = '/payment-details/detail/me/pending/all/all';

  constructor(public navCtrl: NavController, 
        public http: HttpClient, 
        private loading: LoadingClient,
        private storage: Storage) {

    storage.get(this.key_page).then(data => {
      let last_id;
      if (data) {
        this.pendingPayments = data;
        last_id = http.getLastId(this.pendingPayments);
      }
      loading.showLoading(last_id)
      http.getRequest(this.key_page, this.loading.loading_page, last_id).subscribe(result => {
        console.log(result)
        for (var i = 0; i < result['detail_payments'].length; i++) {
          this.pendingPayments.unshift(result['detail_payments'][i]);
        }
        storage.set(this.key_page, this.pendingPayments)
        loading.dismiss()
      }, error => loading.showError(error))
    })
    storage.get('notificationsCount').then(value => {
      this.notificationsCount = value;
    });
  }
}
