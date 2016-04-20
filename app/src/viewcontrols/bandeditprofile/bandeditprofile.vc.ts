import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
<<<<<<< HEAD
=======
import BandDashboardViewControl from '../banddashboard/banddashboard.vc'
>>>>>>> d6a586e8e4e2e9f1617ef121da8380c472c47f98

export default class BandEditProfileViewControl extends BaseViewControl {
    templateString: string = require('./bandeditprofile.vc.html');

    context: any = {
        bandUsername: '',
        bandName: '',
        bandDescription: '',
        bandKey: ''
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
        });
    }
    updateInfo() {
        var newInfo = {
            bandName: this.context.bandName,
            bandDescription: this.context.bandDescription
        }
        
        this.firebaseSvc.updateInfo(this.context.bandKey, newInfo).then((success) => {
            console.log(success);
        }, (err) => {
            console.log(err);
        })
<<<<<<< HEAD
=======
        
        this.navigator.navigate(BandDashboardViewControl, {
            parameters: {
                key: this.context.bandKey
            }
        })
>>>>>>> d6a586e8e4e2e9f1617ef121da8380c472c47f98
    }
}

register.viewControl('bandeditprofile-vc', BandEditProfileViewControl, [FirebaseService]);
