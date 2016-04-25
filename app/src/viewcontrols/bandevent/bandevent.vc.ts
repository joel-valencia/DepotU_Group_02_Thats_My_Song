import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';

declare var Firebase:any;

export default class BandEventViewControl extends BaseViewControl {
    templateString: string = require('./bandevent.vc.html');

    context: any = {
        eventKey: "",
        eventData: {},
        songRequests: []
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    
    navigatedTo(params:any) {
        // put event key in context
        this.context.eventKey = params.key;
        
        // get event info
        this.firebaseSvc.getEventInfo(this.context.eventKey).then((result) => {
            this.context.eventData = result;
            console.log("event data: ", this.context.eventData);
        });
        
        // retrieve event requests every time they're added
        var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
        var songRequestsFirebase = requestsFirebase.child("events/" + this.context.eventKey + "/songRequests");

        songRequestsFirebase.on("value", (snapshot: any) => {  
            var songRequestsObject = snapshot.val();
            var songRequestsArray:any = [];
            
            for (var key in songRequestsObject) {
                songRequestsArray.push(songRequestsObject[key]);
            }
            
            console.log("song requests: ", songRequestsArray);
            this.context.songRequests = songRequestsArray;
        });
    }
}

register.viewControl('bandevent-vc', BandEventViewControl, [FirebaseService]);
