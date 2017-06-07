import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { LoadingClient } from '../../providers/loading-client';

import { HomePage } from '../../pages/home/home';
/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  register = {name: '', email: ''};

  constructor(public nav: NavController, 
    public loading: LoadingClient,
    public navParams: NavParams,
    public auth: AuthService,
    public storage: Storage) {}

  ionViewDidLoad() {}

  registro() {
    this.loading.showLoading()
    this.auth.newCustomer(this.register).subscribe(result => {
      this.loading.dismiss()
      this.storage.set(AuthService.register_key, true);
      this.storage.set(AuthService.login_key, true);
      this.storage.set('token', result['token']);
      this.storage.set('expirationDate', result['expirationDate']);
      //this.storage.set('tipo', result['tipo']);
      //this.storage.set('id_user', result['id_user']);
      
      this.nav.setRoot(HomePage)

    }, error => {
      console.log(error)
      this.loading.dismiss()
    })
  }
}
