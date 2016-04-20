import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandEditProfileViewControl from '../bandeditprofile/bandeditprofile.vc'

export default class BandDashboardViewControl extends BaseViewControl {
    templateString: string = require('./banddashboard.vc.html');

    context: any = {
        bandKey: "",
        bandUsername: "",
<<<<<<< HEAD
<<<<<<< HEAD
        songList: [],
        addSongTitle: "",
        addSongArtist: ""
=======
        bandDescription: ""
>>>>>>> 17678bf0e4d5f0e6c85e168c9275805642d18429
=======
        bandDescription: ""
>>>>>>> d6a586e8e4e2e9f1617ef121da8380c472c47f98
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
    
    loaded() {
        
    }
    goToEdit() {
        this.navigator.navigate(BandEditProfileViewControl, {
            parameters: {
                key: this.context.bandKey
            }
        })
    }
    
    bandGetInfo(key:string) {
        console.log("looking up info for band with key", key);
        
        // get band info from database
        this.firebaseSvc.bandGetInfo(key).then((result:any) => {
            console.log("band info:", result);
            
            //put band info in context
            this.context.bandUsername = result.username;
            this.context.bandName = result.bandName;
<<<<<<< HEAD
<<<<<<< HEAD
            this.context.songList = result.songList;
            
            //put song list in context
            if ("songList" in result) {
                this.context.songList = result.songList;
            } else {
                console.log("song list doesn't exist yet");
            }
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
            this.bandGetInfo(this.context.bandKey);
=======
            this.context.bandDescription = result.bandDescription;
>>>>>>> 17678bf0e4d5f0e6c85e168c9275805642d18429
=======
            this.context.bandDescription = result.bandDescription;
>>>>>>> d6a586e8e4e2e9f1617ef121da8380c472c47f98
        });
    }
}

register.viewControl('banddashboard-vc', BandDashboardViewControl, [FirebaseService]);
