import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BaseService from '../../services/base/base.svc';

declare var Firebase:any;

export default class BandEventViewControl extends BaseViewControl {
    templateString: string = require('./bandevent.vc.html');

    context: any = {
        eventKey: "",
        eventData: {},
        songRequests: [],
        counter: 0
    };
    
    constructor(private firebaseSvc:FirebaseService, private baseSvc:BaseService) {
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
        var requestsFirebase = new Firebase(this.baseSvc.host);
        var songRequestsFirebase = requestsFirebase.child("events/" + this.context.eventKey + "/songRequests");

        songRequestsFirebase.on("value", (snapshot: any) => {  
            var songRequestsObject = snapshot.val();
            var songRequestsArray:any = [];
            
            for (var key in songRequestsObject) {
                songRequestsArray.push(songRequestsObject[key]);
            }
            
            console.log("song requests: ", songRequestsArray);
            this.context.songRequests = songRequestsArray.reverse();
            
            // don't flash on first load
            if (this.context.counter !== 0) {
                // wait so the elements can load
                setTimeout(function() {
                    var firstItem = document.getElementById("index-0");
                    // hack to make it animate on subsequent loads
                    firstItem.classList.remove("flashOnce");
                    firstItem.offsetWidth;
                    firstItem.classList.add("flashOnce");
                }, 250);
            }
            
            this.context.counter++;
        });
    }
}

register.viewControl('bandevent-vc', BandEventViewControl, [FirebaseService, BaseService]);
