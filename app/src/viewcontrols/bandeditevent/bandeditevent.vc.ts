import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboardViewControl from '../banddashboard/banddashboard.vc'
import SessionService from '../../services/session/session.svc';


export default class BandEditEventViewControl extends BaseViewControl {
    templateString: string = require('./bandeditevent.vc.html');

    context: any = {
        eventName: '',
        eventDescription: '',
        eventKey: '',  
        eventDate: ''  
    };
    
     constructor(private firebaseSvc:FirebaseService, private sessionSvc:SessionService) {
        super();
    }
    navigatedTo(parameters:any) {
        // put the key of our band in the context
        this.context.bandKey = this.sessionSvc.checkLoggedInBand();
        this.context.eventKey = parameters.key;
        // get event info with this key
        this.eventGetInfo(this.context.eventKey);

    }
    
    eventGetInfo(key:string) {
        console.log("looking up info for event with key", key);
        
        // get event info from database
        this.firebaseSvc.getEventInfo(key).then((result:any) => {
            console.log("event info:", result);
            
            //put event info in context
            this.context.eventName= result.eventName;
            this.context.eventDescription = result.eventDescription;
            this.context.eventKey = result.eventKey;
            this.context.eventDate = result.eventDate;
            
        });
    }
    
     updateEventInfo() {
        
        var newEventInfo = {
            eventName: this.context.eventName,
            eventDescription: this.context.eventDescription,
            eventKey: this.context.eventKey,
            eventDate: this.context.eventDate
    }
    console.log(newEventInfo);
        
        this.firebaseSvc.updateEventInfo(this.context.eventKey, newEventInfo).then((success) => {
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
    
}

register.viewControl('bandeditevent-vc', BandEditEventViewControl,[FirebaseService, SessionService]);
