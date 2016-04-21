import {register} from 'platypus';
import FirebaseService from '../../services/firebase/firebase.svc';
import BaseViewControl from '../base/base.vc';

export default class BandCreateEventViewControl extends BaseViewControl {
    templateString: string = require('./bandcreateevent.vc.html');

    context: any = {
        addEventName:"",
        addEventDate:"",
        addEventLocation:""
    };
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    
    bandAddEvent() {
        var key = this.context.eventKey;
        var eventName = this.context.addEventName;
        var eventDate = this.context.addEventDate;
        var eventLocation = this.context.addEventLocation;

        
        this.firebaseSvc.bandAddEvent(key, eventName, eventDate, eventLocation).then((result:any) => {
            console.log("added event");
            
            this.context.addEvenetName = "";
            this.context.addEventDate = "";
            this.context.addEventLocation = "";
            this.context.addEventDescription ="";
            // this.eventList(this.context.eventKey);
        });
    }
}

register.viewControl('bandcreateevent-vc', BandCreateEventViewControl,[FirebaseService]);
