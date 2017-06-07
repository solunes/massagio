import { Component, trigger, state, style, transition, animate } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';

import { HttpClient } from '../../providers/http-client';
import { NavController, Platform, ActionSheetController, ToastController, } from 'ionic-angular';
import { Camera, File, Transfer } from 'ionic-native';
import { AppSettings } from '../../providers/app-settings';
import { LoadingClient } from '../../providers/loading-client';

/*
  Generated class for the RegisterPayment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var cordova: any;
let FilePath: any;// = window["IonicNative"].FilePath;
//console.log(window);

@Component({
  selector: 'page-register-payment',
  templateUrl: 'register-payment.html',
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
export class RegisterPaymentPage{
	title_page = 'Registar Pago';
  lastImage: string = null;
  params = {
    type: 'income',
    amount: 0,
    currency: 'bob',
    payment_array: []
  }
  payment_array: Array<JSON> = new Array();
  token: string;
  saldo: number = 0;
  total: number = 0;
  actor_id: number;
  notificationsCount: number;
  key_page: string = '/payment-details/detail/me/pending/all/all';

  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private loading: LoadingClient,
    private storage: Storage,
    public http: HttpClient) {
    
    platform.ready().then(() => {
    //I made a plugin for testing...
      console.log("window['pluginTest']: "+ (window['pluginTest'] ? true: false));
      console.log("window['FilePath']: "+ (window['FilePath'] ? true: false));
      FilePath = window['FilePath'];
      storage.get('actor_id').then(value => {
        this.actor_id = value;
      })

      storage.get(this.key_page).then(data => {
        if (data) {
          this.payment_array = data
        }
        http.getRequest(this.key_page, false).subscribe(result => {
          this.payment_array = result['detail_payments']
          storage.set(this.key_page, this.payment_array)
        }, error => loading.showError(error))
      })
      storage.get('notificationsCount').then(value => {
        this.notificationsCount = value;
      });
    });
  }

  public presentActionSheet(){
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select image",
      buttons: [
      {
        text:"Loading from library", 
        handler: ()=>{
          this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text:"Use camera", 
        handler:()=>{
          this.takePicture(Camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: "Cancel", 
        role: "cancel"
      }
    ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType){
    let options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    Camera.getPicture(options).then(imagePath =>{
    //special handling for android library
      if(this.platform.is('android') && sourceType===Camera.PictureSourceType.PHOTOLIBRARY){
      //console.log("FROM PHOTOLIBRARY");
        FilePath.resolveNativePath(imagePath, filePath=>{
        let correctPath = filePath.substr(0, filePath.lastIndexOf('/')+1);
        let currentName = imagePath.substring(imagePath.lastIndexOf('/')+1, imagePath.lastIndexOf('?'));
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
        }, error=>{
          this.presentToast("Error on resolveNativePath()");
          console.log(JSON.stringify(error));
        });
      } else {
        //console.log("FROM CAMERA");
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/')+1);
        let currentName = imagePath.substr(imagePath.lastIndexOf('/')+1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
      }
    }, (err)=> {
      this.presentToast("Error while selecting image");
      console.log(JSON.stringify(err));
    });
  }

  private createFileName(currentName){
    let d = new Date(),
    n = d.getTime();

    return n+currentName.substr(currentName.lastIndexOf('.'));
  }

  private copyFileToLocalDir(namePath, currentName, newFileName){
    File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
    .then(success =>{
      this.lastImage = newFileName;
    }, error =>{
      this.presentToast("Error while storing file");
    });
  }

  private presentToast(text){
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public pathForImage(img){
    if(img == null){
      return '';
    }
    else{
      return cordova.file.dataDirectory + img;
    }
  }

  logText;
  public uploadImage(){
    let url = AppSettings.getApiUrl() + "/create-account";

    let targetPath = this.pathForImage(this.lastImage);

    let fileName = this.lastImage;

    let payment_array_check = [];
    for (var i = 0; i < this.payment_array.length; i++) {
      var obj = this.payment_array[i];
      if (obj['checked'] == true) {
        payment_array_check.push(obj);
      }
    }

    let options = {
      fileKey: 'deposit_image',
      fileName: fileName,
      chunkedMode: false,
      params : {
        'actor_id': this.actor_id,
        'type': this.params.type,
        'amount': this.params.amount,
        'currency': this.params.currency,
        'payment_array': payment_array_check,
      },
      headers: {Authorization: 'Bearer '+ this.token}
    };

    const fileTransfer = new Transfer();

    this.loading.showLoadingText('uploading...');
    fileTransfer.upload(targetPath, url, options)
    .then(data => {
      console.log(JSON.stringify(data));
      this.loading.dismiss();
      this.presentToast("Image successfull uploaded");
      this.lastImage = null;
    }, error => {
      console.log(JSON.stringify(error));
      this.loading.dismiss();
      this.logText = JSON.stringify(error);
      /*this.presentToast(JSON.stringify(error));*/
    });
  }

  itemKey: number = null;

  public AddRemoveSelect(item){
    if (item['checked']) {
      this.total = Number(this.total) + Number(item['amount']);
    } else {
      this.total = Number(this.total) - Number(item['amount']);
      this.mostrar();
    }
    this.ajustarSaldo();
  }

  public changeAmount() {
    if (this.params.amount < 0) {
      this.params.amount = 0;
    }
    this.ajustarSaldo();
  }

  public ajustarSaldo(){
    this.saldo = this.params.amount - this.total;
    if (this.itemKey == null) {
      for (var i = 0; i < this.payment_array.length; i++) {
        if (this.payment_array[i]['checked']) {
          this.itemKey = i;
        }
      }
    }
    if (this.itemKey != null) {
      if (this.saldo <= 0) {
        // calular item saldo 
          var itemsAmount = Number(this.payment_array[this.itemKey]['amount']);
          if ((this.saldo + itemsAmount) <= 0 || this.saldo == 0) {
            this.payment_array[this.itemKey]['saldo'] = 0;
            if (this.saldo != 0) {
              this.payment_array[this.itemKey]['checked'] = false;
              this.mostrar();
            } else {
              this.ocultar();
            }
            this.itemKey = null;
          } else {
            this.payment_array[this.itemKey]['saldo'] = itemsAmount + this.saldo;
            // console.log(this.payment_array[this.itemKey]['saldo']);
            this.ocultar();
          }
      } else {
        this.payment_array[this.itemKey]['saldo'] = 0;
        this.itemKey = null;
        this.mostrar();
      }
    }
  }

  public ocultar(){
    for (var i = 0; i < this.payment_array.length; i++) {
      var obj = this.payment_array[i];
      if (obj['checked']) {
        obj['disabled'] = false;
      } else {
        obj['disabled'] = true;
      }
    }
  }

  public mostrar(){
    for (var i = 0; i < this.payment_array.length; i++) {
      this.payment_array[i]['disabled'] = false;
    }
  }
}