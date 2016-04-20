import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';

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
        });
    }
}

register.viewControl('bandeditprofile-vc', BandEditProfileViewControl, [FirebaseService]);
