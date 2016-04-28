import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import SessionService from '../../services/session/session.svc';

export default class FanViewBandProfileViewControl extends BaseViewControl {
    templateString: string = require('./fanviewbandprofile.vc.html');

    context: any = {
        bandKey: ''
    };
    
    constructor(private firebaseSvc: FirebaseService, private sessionSvc:SessionService) {
        super();
    }
    
    navigatedTo(parameters:any) {
        console.log('here');
        
        this.context.bandKey = this.sessionSvc.checkLoggedInBand();
        
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
}

register.viewControl('fanviewbandprofile-vc', FanViewBandProfileViewControl, [FirebaseService, SessionService]);
