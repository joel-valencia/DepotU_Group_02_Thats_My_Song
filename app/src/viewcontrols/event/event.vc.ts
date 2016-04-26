import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';

export default class EventViewControl extends BaseViewControl {
    templateString: string = require('./event.vc.html');

    context: any = {
        eventKey: "",
        eventData: {},
        bandData: {},
        songList: [],
        modal: false,
        comment: '',
        songInfo: {}
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
        
            // get band info using bandKey from event
            this.firebaseSvc.bandGetInfo(this.context.eventData.bandKey).then((result) => {
                this.context.bandData = result;
                console.log("band data: ", this.context.bandData);
            });
            
            // get song list of band in array format
            this.firebaseSvc.bandGetSongList(this.context.eventData.bandKey).then((result:any) => {
                this.context.songList = result.songList;
                console.log("song list: ", this.context.songList);
            });
        });
    }
    
    requestSong() {
        var eventKey = this.context.eventData.eventKey;
        var comment = this.context.comment;
        var songTitle = this.context.songInfo.title;
        var songArtist = this.context.songInfo.artist;
        var songKey = this.context.songInfo.key;
        
        this.firebaseSvc.requestSong(songTitle, songArtist, songKey, eventKey, comment).then((result) => {
            console.log("requested a song");
        });
    }
    
    modalOn(songTitle:string, songArtist:string, songKey:string) {
        this.context.modal = true;
        
        this.context.songInfo = {
            title: songTitle,
            artist: songArtist,
            key: songKey
        }
    }
    modalOff() {
        this.context.modal = false;
        this.requestSong();
    }
    cancel() {
        this.context.modal = false;
    }
}

register.viewControl('event-vc', EventViewControl, [FirebaseService]);
