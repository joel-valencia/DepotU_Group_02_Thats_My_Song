import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandEditProfileViewControl from '../bandeditprofile/bandeditprofile.vc';
import BandCreateEventViewControl from '../bandcreateevent/bandcreateevent.vc';
import SessionService from '../../services/session/session.svc';
import BandEventViewControl from '../bandevent/bandevent.vc';
import BandEditEventViewControl from '../bandeditevent/bandeditevent.vc';
export default class BandDashboardViewControl extends BaseViewControl {
    templateString: string = require('./banddashboard.vc.html');

    context: any = {
        bandKey: "",
        bandUsername: "",
        bandDescription: "",
        songList: [],
        addSongTitle: "",
        addSongArtist: "",
        bandImgUrl: '',
        bandAllEvents: [],
        bandActiveEvents: [],
        bandInactiveEvents: []
    };
    
    constructor(private firebaseSvc:FirebaseService, private sessionSvc:SessionService) {
        super();
    }
    
    navigatedTo(parameters:any) {
        // put the key of our band in the context
        this.context.bandKey = this.sessionSvc.checkLoggedInBand();
        
        // get band info with this key
        this.bandGetInfo(this.context.bandKey);
        
        // get song list
        this.bandGetSongList(this.context.bandKey);
        
        // get events created by band
        this.bandGetAllEvents(this.context.bandKey);
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
    
     goToCreateEvent() {
        this.navigator.navigate(BandCreateEventViewControl, {
            parameters: {
                key: this.context.bandKey
            }
        })
    }
    
    bandGetSongList(key:string) {
        this.firebaseSvc.bandGetSongList(key).then((result:any) => {
            this.context.songList = result.songList;
            // console.log("songs:", this.context.songList.length);
        });
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
    
    bandAddSong() {
        var key = this.context.bandKey;
        var title = this.context.addSongTitle;
        var artist = this.context.addSongArtist;
        
        this.firebaseSvc.bandAddSong(key, title, artist).then((result:any) => {
            console.log("added song");
            this.context.addSongTitle = "";
            this.context.addSongArtist = "";
            this.bandGetSongList(this.context.bandKey);
        });
    }
    
       
    
    bandRemoveSong(key:string) {
        var bandKey = this.context.bandKey;
        var songKey = key;
        
        this.firebaseSvc.bandRemoveSong(bandKey, songKey).then((result:any) => {
            this.bandGetSongList(this.context.bandKey);
        });
    }
    
    bandGetAllEvents(bandKey:string) {
         this.firebaseSvc.bandGetAllEvents(bandKey).then((result:any) => {
             console.log("band events array", result);
            //  console.log("events: ", result.length);
             
             this.context.bandAllEvents = result;
             
             var bandActiveEvents:any = [];
             var bandInactiveEvents:any = [];
             
             for (var index = 0; index < this.context.bandAllEvents.length; index++) {                 
                 if (this.context.bandAllEvents[index].eventActive == true) {
                     bandActiveEvents.push(this.context.bandAllEvents[index]);
                 } else {
                     bandInactiveEvents.push(this.context.bandAllEvents[index]);
                 }
             }
             
             this.context.bandActiveEvents = bandActiveEvents;
             this.context.bandInactiveEvents = bandInactiveEvents;
         });
     }
     
      editEvent(eventKey:string) {
        this.navigator.navigate(BandEditEventViewControl, {
            parameters: {
                key: eventKey
            }
        })
    }
     
     eventActivate(eventKey:string) {
         this.firebaseSvc.eventActivate(eventKey).then((result) => {
             console.log("activated event", eventKey);
             this.bandGetAllEvents(this.context.bandKey);
         });
     }
     
     eventDeactivate(eventKey:string) {
         this.firebaseSvc.eventDeactivate(eventKey).then((result) => {
             console.log("deactivated event", eventKey);
             this.bandGetAllEvents(this.context.bandKey);
         });
     }
     
     goToEvent(eventKey:string) {
         this.navigator.navigate(BandEventViewControl, {
            parameters: {
                key: eventKey
            }
        })
     }
}

register.viewControl('banddashboard-vc', BandDashboardViewControl, [FirebaseService, SessionService]);
