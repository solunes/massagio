import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppSettings } from './app-settings'

export class User {
    name: string; 
    email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}

@Injectable()
export class AuthService {
    public static login_key: string = 'login'
    public static register_key: string = 'registrado'
    timeout_page: number = 10000

    constructor(private http: Http) {}

    
    public customer(codigo){
      let body = new FormData();
      body.append('customer_code', codigo);
      return this.http.post(AppSettings.getApiUrl()+'/login-customer', body)
          .timeout(this.timeout_page).map(res => res.json());
    }

    public login(credentials) {
        if (credentials.user === null || credentials.email === null) {
            return Observable.throw("please insert credentials");
        } else {
            let body = new FormData();
            body.append('name', credentials.user);
            body.append('email', credentials.email);
            return this.http.post(AppSettings.getApiUrl()+'-auth/authenticate', body)
                .timeout(this.timeout_page).map(res => res.json());
        }
    }

    public newGuest(credentials) {
        if (credentials.user === null || credentials.email === null) {
            return Observable.throw("please insert credentials");
        } else {
            let body = new FormData();
            body.append('name', credentials.user);
            body.append('email', credentials.email);
            console.log(body)
            return this.http.post(AppSettings.getApiUrl()+'/new-guest', body)
                .timeout(this.timeout_page).map(res => res.json());
        }
    }

    public newCustomer(credentials) {
        if (credentials.name === null || credentials.email === null) {
            return Observable.throw("please insert credentials");
        } else {
            let body = new FormData();
            body.append('name', credentials.name);
            body.append('email', credentials.email);
            console.log(body)
            return this.http.post(AppSettings.getApiUrl()+'/new-customer', body)
                .timeout(this.timeout_page).map(res => res.json());
        }
    }

    public logout() {
        return Observable.create(observer => {
            observer.next(true);
            observer.complete();
        });
    }
}
