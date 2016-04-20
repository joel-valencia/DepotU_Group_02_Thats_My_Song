import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandEditProfileViewControl from '../bandeditprofile/bandeditprofile.vc'

export default class BandDashboardViewControl extends BaseViewControl {
    templateString: string = require('./banddashboard.vc.html');

    context: any = {
        bandKey: "",
        bandUsername: "",
        bandDescription: ""
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
    
    loaded() {
        
    }
    goToEdit() {
        this.navigator.navigate(BandEditProfileViewControl, {
            parameters: {
                key: this.context.bandKey
            }
        })
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
}

register.viewControl('banddashboard-vc', BandDashboardViewControl, [FirebaseService]);
