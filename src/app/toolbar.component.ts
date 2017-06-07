import { Component, Input } from '@angular/core';
import { AuthService } from '../providers/auth-service';
import { Storage } from '@ionic/storage';
import { NavController} from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { NotificationPage } from '../pages/notification/notification';

@Component({
  selector: 'toolbar',
  template: `
  <ion-header class="header header-md">
      <ion-navbar class="toolbar toolbar-md statusbar-padding">
        <button ion-button menuToggle>
            <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>
            {{ title_page }}
        </ion-title>

        <ion-buttons end>
          <button ion-button *ngIf="loading"><ion-spinner icon="android"></ion-spinner></button>
          <button ion-button (click)="showNotifi()"><ion-icon name="notifications"></ion-icon><ion-badge item-right>{{ notificationsCount }}</ion-badge></button>
          <button ion-button (click)="logout()"><ion-icon name="log-out"></ion-icon></button>
        </ion-buttons>
      </ion-navbar>
  </ion-header>
`
})
export class ToolbarComponent{
  @Input() title_page: string = 'Toolbar';
  @Input() loading: boolean = false;
  @Input() notificationsCount: number;
  constructor(private navCtrl: NavController, 
      private auth: AuthService, 
      private storage: Storage){
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.storage.remove('login');
      this.navCtrl.setRoot(LoginPage);
    });
  }

  public showNotifi(){
    this.navCtrl.setRoot(NotificationPage);
  }
}