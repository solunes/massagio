import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, MenuController, AlertController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {
  Push,
  PushToken, IPushMessage
} from '@ionic/cloud-angular';

import { AuthService } from '../providers/auth-service';
import { LoginPage } from '../pages/login/login';
import { NotificationPage } from '../pages/notification/notification';
import { HomePage } from '../pages/home/home';
import { RecipePage } from '../pages/recipe/recipe';

import { AppRouter } from '../providers/app-router';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(public platform: Platform,
    private storage: Storage, 
    public push: Push,
    public app_router: AppRouter,
    public alertCtrl: AlertController,
    public menu: MenuController) {
    
    this.initPush();
    platform.ready().then(() => {
      Splashscreen.hide();
      this.storage.get(AuthService.login_key).then(value => {
        if(value) {
          this.rootPage = RecipePage;
          console.log('home');
        } else {
          this.rootPage = LoginPage;
          console.log('login');
        }
      });
      this.storage.get(AuthService.register_key).then((register:boolean) => {
        this.app_router.initRouter(register)
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      StatusBar.styleDefault();
    });
  }

  public initPush() {
    if (!this.platform.is('cordova')) {
        console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
        console.log("virtual");
        return;
    }
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      this.push.saveToken(t);
      console.log('Token saved:', t.token);
    });
 
    this.push.rx.notification().subscribe((data:IPushMessage) => {
      console.log('I received awesome push: ' + JSON.stringify(data));
      console.log('Foreground: ' +data['raw']);
      console.log('Foreground: ' +data['raw'].additionalData);
      if (data.raw.additionalData.foreground) {
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.raw.message,
          buttons: [{
            text: 'Ignorar',
            role: 'cancel'
          }, {
            text: 'Ver',
            handler: () => {
              //TODO: Your logic here
              this.nav.setRoot(NotificationPage, {message: data.raw.message});
            }
          }]
        });
        confirmAlert.present();
      } else {
        this.nav.setRoot(NotificationPage, {message: data.raw.message});
      }
    });
  }

  public openPage(page) {
    this.menu.close();
    // close the menu when clicking a link from the menu
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
