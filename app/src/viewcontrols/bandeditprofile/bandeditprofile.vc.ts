import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboardViewControl from '../banddashboard/banddashboard.vc'



export default class BandEditProfileViewControl extends BaseViewControl {
    templateString: string = require('./bandeditprofile.vc.html');

    context: any = {
        bandUsername: '',
        bandName: '',
        bandDescription: '',
        bandKey: '',
        imgSrc: ''
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    navigatedTo(parameters:any) {
        // put the key of our band in the context
        this.context.bandKey = parameters.key;
        
        // get band info with this key
        this.bandGetInfo(this.context.bandKey);
    }
    
    bandGetInfo(key:string) {
        console.log("looking up info for band with key", key);
        
        // get band info from database
        this.firebaseSvc.bandGetInfo(key).then((result:any) => {
            console.log("band info:", result);
            
            //put band info in context
            this.context.bandUsername = result.username;
            this.context.bandName = result.bandName;
            this.context.bandDescription = result.bandDescription;
            this.context.bandImgUrl = result.bandImgUrl;
        });
    }
    updateInfo() {
        var newInfo = {
            bandName: this.context.bandName,
            bandDescription: this.context.bandDescription,
            bandImgUrl: this.context.imgSrc
        }
        
        this.firebaseSvc.updateInfo(this.context.bandKey, newInfo).then((success) => {
            console.log(success);
        }, (err) => {
            console.log(err);
        })
        
        this.navigator.navigate(BandDashboardViewControl, {
            parameters: {
                key: this.context.bandKey
            }
        })
    }
    showFile() {
      var preview = <HTMLImageElement>document.querySelector('img');
      let fileSelector = <HTMLInputElement>document.querySelector('input[type=file]');
      var file = fileSelector.files[0];
      var reader  = new FileReader();
      var context = this.context;
      
      
      reader.addEventListener("load", function () {
        preview.src = reader.result;
        // context.imgSrc = preview.src;
        console.log(context.imgSrc);
    
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    
    }
    test() {
        var img = <HTMLImageElement> document.getElementById('preview');
        
        var MAX_WIDTH = 200;
        var MAX_HEIGHT = 150;
        var width = img.width;
        var height = img.height;
        
        if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
        } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
        }
        var canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
        canvas.width = width;
        canvas.height = height;
      
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      this.context.imgSrc = canvas.toDataURL('img');
    }
}

register.viewControl('bandeditprofile-vc', BandEditProfileViewControl, [FirebaseService]);
