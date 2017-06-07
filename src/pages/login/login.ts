import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MenuController, NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AppRouter } from '../../providers/app-router';

import { RegisterPage } from '../../pages/register/register'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginStatus: boolean = false;
  loading: Loading;
  registerCredentials = {user: '', password: ''};

  constructor(private nav: NavController, 
    private auth: AuthService, 
    private app_router: AppRouter, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController, 
    private storage: Storage,
    private menu: MenuController,
    private http: Http) {

    this.menu.enable(false);
  }

  public checkLogin(){
    this.showLoading();
    this.auth.customer(this.registerCredentials.user).subscribe(allowed => {
      this.loading.dismiss()
      this.storage.set(AuthService.register_key, true);
      this.storage.set(AuthService.login_key, true);
      this.storage.set('token', allowed['token']);
      this.storage.set('expirationDate', allowed['expirationDate']);
      //this.storage.set('tipo', allowed['tipo']);
      //this.storage.set('id_user', allowed['id_user']);
      
      this.app_router.initRouter(true)
      this.nav.setRoot(this.app_router.getPage('home'));
    }, error => this.loading.dismiss())
  }

  public login(){
    this.registerCredentials.password = this.registerCredentials.user
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        this.loading.dismiss();
        this.storage.set(AuthService.register_key, true);
        this.storage.set(AuthService.login_key, true);
        this.storage.set('token', allowed['token']);
        this.storage.set('tipo', allowed['tipo']);
        this.storage.set('id_user', allowed['id_user']);
        this.storage.set('expirationDate', allowed['expirationDate']);
        
        this.app_router.initRouter(true)
        this.nav.setRoot(this.app_router.getPage('home'));
      } else {
        this.showError("Access Denied");
      }
    }, error => {
      this.showError(error);
    })
  }

  public invitado(){
    let confirmAlert = this.alertCtrl.create({
      title: 'Invitado',
      inputs: [
        {
          name: 'username',
          placeholder: 'Nombre Completo'
        },
        {
          name: 'email',
          placeholder: 'Email',
          type:'email'
        }
      ],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }, {
        text: 'Ingresar',
        handler: data => {
          if (data.username && data.email) {
            this.invitadoRequest()
          }
        }
      }]
    });
    confirmAlert.present();
  }

  invitadoRequest(){
    this.showLoading();
    this.registerCredentials.password = this.registerCredentials.user
    this.auth.newGuest(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        this.loading.dismiss();
        this.storage.set(AuthService.register_key, false);
        this.storage.set(AuthService.login_key, true);
        this.app_router.initRouter(false)
        this.nav.setRoot(this.app_router.getPage('home'));
        this.storage.set('token', allowed['token']);
        this.storage.set('expirationDate', allowed['expirationDate']);
        this.storage.set('tipo', allowed['tipo']);
        this.storage.set('id_user', allowed['id_user']);
      } else {
        this.showError("Access Denied");
      }
    }, error => {
      this.loading.dismiss()
      this.showError(error);
    })
  }

  public registro(){
    this.nav.push(RegisterPage)
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loading.present();
  }

  showError(text){
    setTimeout(() => {
      this.loading.dismiss();
    });
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  ionViewWillLeave(){
    this.menu.enable(true);
  }
}
