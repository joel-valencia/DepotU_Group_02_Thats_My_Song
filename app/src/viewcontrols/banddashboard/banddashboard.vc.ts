import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';

export default class BandDashboardViewControl extends BaseViewControl {
    templateString: string = require('./banddashboard.vc.html');

    context: any = {
        bandKey: "",
        bandUsername: ""
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    
    navigatedTo(parameters:any) {
        this.context.bandKey = parameters.key;
        this.bandGetInfo(this.context.bandKey);
    }
    
    loaded() {
        
    }
    
    bandGetInfo(key:string) {
        console.log("looking up info for band with key", key);
        
        this.firebaseSvc.bandGetInfo(key).then((result:any) => {
            console.log("band info:", result);
            this.context.bandUsername = result.username;
            this.context.bandName = result.bandName;
        });
    }
}

register.viewControl('banddashboard-vc', BandDashboardViewControl, [FirebaseService]);
