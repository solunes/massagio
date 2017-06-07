import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HttpClient } from '../../providers/http-client';
import { LoadingClient } from '../../providers/loading-client';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
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
export class RecipePage {
  title_page = 'Recetas';
  notificationsCount: number;
  key_page: string = '/my-recipe'
  recipe_name: string
  recipe_items: Array<JSON> = new Array();

  constructor(public navCtrl: NavController, 
    public loading: LoadingClient,
    public storage: Storage,
    public http: HttpClient,
    public navParams: NavParams) {}

  ionViewDidLoad() {
    this.storage.get(this.key_page).then(data => {
      this.loading.showLoading(data)
      if (data) {
        this.recipe_name = data['name']
        this.recipe_items = data['recipe_items']
      }
      this.http.getRequest(this.key_page, this.loading.loading_page).subscribe(result => {
        let recipe = result['recipe']
        this.recipe_name = recipe['name']
        this.recipe_items = recipe['recipe_items']

        this.loading.dismiss()
        this.storage.set(this.key_page, result['recipe'])
      }, error => this.loading.showError(error))
    })
  }

}
