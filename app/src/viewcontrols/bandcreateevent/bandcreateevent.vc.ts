import {register} from 'platypus';
import FirebaseService from '../../services/firebase/firebase.svc';
import BaseViewControl from '../base/base.vc';
import SessionService from '../../services/session/session.svc';

export default class BandCreateEventViewControl extends BaseViewControl {
    templateString: string = require('./bandcreateevent.vc.html');

    context: any = {
        addEventName:"",
        addEventDate:"",
        addEventDescription:"",
        addEventLocation:"",
        bandKey: ""
    };
    constructor(private firebaseSvc:FirebaseService, private sessionSvc:SessionService) {
        super();
    }
    
    navigatedTo() {
        this.context.bandKey = this.sessionSvc.checkLoggedInBand();
    }
    
    bandAddEvent() {
        var newEvent={
            bandKey: this.context.bandKey,
         eventName: this.context.addEventName,
        eventDate: this.context.addEventDate,
        eventLocation: this.context.addEventLocation,
        eventDescription: this.context.addEventDescription
        };
        
        this.firebaseSvc.bandAddEvent(newEvent).then((result:any) => {
            console.log("added event",result)
        }, (err:any) =>{
            console.log("err");
            // this.eventList(this.context.eventKey);
        });
    }
}

register.viewControl('bandcreateevent-vc', BandCreateEventViewControl,[FirebaseService, SessionService]);
