import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { ToolbarComponent } from './toolbar.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PendingPaymentPage } from '../pages/pending-payment/pending-payment';
import { NotificationPage } from '../pages/notification/notification';
import { RegisterPaymentPage } from '../pages/register-payment/register-payment';
import { RecipePage } from '../pages/recipe/recipe';
import { RegisterPage } from '../pages/register/register';
import { EventPage } from '../pages/event/event';
import { ProfilePage } from '../pages/profile/profile';
import { ReservePage } from '../pages/reserve/reserve';
import { PackagePage } from '../pages/package/package';
import { CalendarPage } from '../pages/calendar/calendar';

import { AppRouter } from '../providers/app-router';
import { AppSettings } from '../providers/app-settings';
import { AuthService } from '../providers/auth-service';
import { HttpClient } from '../providers/http-client';
import { LoadingClient } from '../providers/loading-client';

import { Currency } from '../app/pipes/currency';
import { Hightlight } from '../components/hightlight/hightlight';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '6e039abd'
  },
  'push': {
    'sender_id': '1086122766674',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#ff0000'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    ToolbarComponent,
    HomePage,
    LoginPage,
    PendingPaymentPage,
    NotificationPage,
    RegisterPaymentPage,
    RecipePage,
    EventPage,
    ProfilePage,
    RegisterPage,
    ReservePage,
    PackagePage,
    CalendarPage,
    Currency,
    Hightlight
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ToolbarComponent,
    HomePage,
    LoginPage,
    PendingPaymentPage,
    NotificationPage,
    RegisterPaymentPage,
    RecipePage,
    EventPage,
    ProfilePage,
    RegisterPage,
    ReservePage,
    PackagePage,
    CalendarPage
  ],
  providers: [
    AuthService,
    AppRouter,
    AppSettings, 
    HttpClient, 
    LoadingClient, 
    {provide: LOCALE_ID, useValue: 'es-ES'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ] 
})
export class AppModule {}
