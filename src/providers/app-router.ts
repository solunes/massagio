import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthService } from '../providers/auth-service';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { PendingPaymentPage } from '../pages/pending-payment/pending-payment';
import { RegisterPaymentPage } from '../pages/register-payment/register-payment';
import { PackagePage } from '../pages/package/package';
import { RegisterPage } from '../pages/register/register';
import { EventPage } from '../pages/event/event';
import { ProfilePage } from '../pages/profile/profile';
import { ServicioPage } from '../pages/servicio/servicio';

/*
  Generated class for the AppRouter provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class Router {
    path: string
    component: any
    data:{
      title:string
    }

    constructor() {}
}

@Injectable()
export class AppRouter {
  registrado: boolean
  appRoutes: Array<Router>

  constructor(public storage: Storage) {
    this.appRoutes = this.getAppRouter()
  }
  
  getPage(path) : any{
    return this.appRoutes.find(x => x.path == path).component;
  }

  initRouter(registrado:boolean){
    if (registrado) {
      this.appRoutes = this.getAppRouter()
    } else {
      this.appRoutes = this.getAppRouterInvitado()
    }
  }

  getAppRouter() : Array<Router>{
    return [
          {
            path: 'home', component: HomePage, 
            data: { title: 'Inicio' }
          },
          {
            path: 'event', component: EventPage,
            data: { title: 'Eventos' }
          },
          {
            path: 'package', component: ServicioPage,
            data: { title: 'Paquetes' }
          },
          {
            path: 'servicio', component: ServicioPage,
            data: { title: 'Servicios' }
          },
          {
            path: 'profile', component: ProfilePage,
            data: { title: 'Mi Perfil' }
          },
        ]
  }

  getAppRouterInvitado() : Array<Router>{
    return [
        {
          path: 'home', component: HomePage, 
          data: { title: 'Inicio' }
        },
        {
          path: 'event', component: EventPage,
          data: { title: 'Eventos' }
        },
        {
          path: 'login', component: LoginPage,
          data: {title: 'Iniciar Sesión'}
        }, 
        {
          path: 'register', component: RegisterPage,
          data: {title: 'Regístrate'}
        }
      ]
  }
}
