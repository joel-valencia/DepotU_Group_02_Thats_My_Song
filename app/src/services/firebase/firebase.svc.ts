import {async, register} from 'platypus';
import BaseService from '../base/base.svc';

declare var Firebase: any;

export default class FirebaseService extends BaseService {
    
    bandRegister(newUser:{username:string, bandName:string}) {
        return new this.Promise((fulfill, reject) => {
            try {
                
                // check to see if username already exists
                this.bandLogin(newUser.username).then((result) => {
                    // username exists.  reject promise.
                    reject("user already exists");
                }, (err) => {
                    // username doesn't exist.  add user to firebase and fulfill promise.
                    console.log(err);
                    if (err == "user not found") {
                        var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                        var bandsFirebase = requestsFirebase.child("bands");
                        
                        var newUserRef = bandsFirebase.push(newUser);
                        
                        var newUserKey = newUserRef.key();
                        
                        fulfill(newUserKey);
                    }
                });

            } catch (err) {
                reject(err);
            }
        });

    }

    bandLogin(username:string) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandsFirebase = requestsFirebase.child("bands");

                bandsFirebase.once("value", (snapshot: any) => {
                    var allBands = snapshot.val();
                    
                    for (var key in allBands) {
                        if (allBands[key].username == username) {
                            fulfill(key);
                        }
                    }
                    
                    reject("user not found");

                }, (errorObject: any) => {
                    console.log("The read failed: " + errorObject.code);
                });

            } catch (err) {
                reject(err);
            }
        });
    }
    
    bandGetInfo(key: string) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandFirebase = requestsFirebase.child("bands/" + key);

                bandFirebase.once("value", (snapshot: any) => {                 
                    fulfill(snapshot.val());

                }, (errorObject: any) => {
                    console.log("The read failed: " + errorObject.code);
                });

            } catch (err) {
                reject(err);
            }
        });
    }
    
    bandGetSongList(key:string) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandFirebase = requestsFirebase.child("bands/" + key);

                bandFirebase.once("value", (snapshot: any) => {
                    var bandInfo = snapshot.val();
                    
                    // if song list exists, convert it to an array
                    if ("songList" in bandInfo) {
                        var songListObject = bandInfo.songList;
                        var songListArray:Array<{}> = []
                        
                        for (var i = 0; i < Object.keys(songListObject).length; i++ ) {
                            var temp = songListObject[Object.keys(songListObject)[i]];
                            temp.originalKey = Object.keys(songListObject)[i];
                            songListArray.push(temp);
                        }
                        
                        console.log("song list array: ", songListArray);
                        var modified = bandInfo;
                        modified.songList = songListArray;
                        
                        fulfill(modified);
                    } else {
                        fulfill([]);
                    }
                    
                    

                }, (errorObject: any) => {
                    console.log("The read failed: " + errorObject.code);
                });

            } catch (err) {
                reject(err);
            }
        });
    }
    
    bandAddSong(key:string, title:string, artist:string) {
        return new this.Promise((fulfill, reject) => {
            try {

                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandFirebase = requestsFirebase.child("bands/" + key);
                var songListFirebase = bandFirebase.child("songList");
                
                var newSong = {
                    title: title,
                    artist: artist
                }
                songListFirebase.push(newSong);
                
                fulfill();


            } catch (err) {
                reject(err);
            }
        });
    }
    
    bandRemoveSong(bandKey:string, songKey:string) {
        return new this.Promise((fulfill, reject) => {
            try {

                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var songRef = requestsFirebase.child("bands/" + bandKey + "/songList/" + songKey);
                
                songRef.set(null);
                
                console.log("removed song at key", songKey);
                
                fulfill();


            } catch (err) {
                reject(err);
            }
        });
    }

    updateInfo(key: string, newInfo: {bandName: string}) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase('https://song-requests.firebaseio.com');
                var bandFirebase = requestsFirebase.child('bands/' + key);
                
                bandFirebase.update(newInfo);
                
                fulfill("updated info");
                
            } catch (err) {
                reject(err);
            }
        })
    }

    bandAddEvent(newEvent:any) {
        return new this.Promise((fulfill, reject) => {
            try {
                console.log(newEvent);
                
                // add to events section of database
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var eventsFirebase = requestsFirebase.child("events");
                var newEventRef = eventsFirebase.push(newEvent);
                var newEventKey = newEventRef.key();
                
                
                // add key of event to bandEventKeys section of the band
                var bandEventKeys = requestsFirebase.child("bands/" + newEvent.bandKey + "/bandEventKeys");
                bandEventKeys.push(newEventKey);
                
                fulfill(newEventKey);
            
            } catch (err) {
                reject(err);
            }
        });

    }
    
    bandGetAllEvents(bandKey:string) {
        return new this.Promise((fulfill, reject) => {
            try {
                
                // get list of event keys for band
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandEventKeysFirebase = requestsFirebase.child("bands/" + bandKey + "/bandEventKeys");

                bandEventKeysFirebase.once("value", (snapshot: any) => {
                    var bandEventKeysObject = snapshot.val();
                    var eventObjectKeysArray = Object.keys(bandEventKeysObject);
                    var eventKeys:any = [];
                    
                    for (var index = 0; index < eventObjectKeysArray.length; index++) {
                        eventKeys.push(bandEventKeysObject[eventObjectKeysArray[index]]);
                    }
                    
                    var lastEventKey = eventKeys[eventKeys.length - 1];
                    
                    var bandAllEvents:any = [];
                    
                    for (var i in eventKeys) {
                        console.log("loop", eventKeys[i]);
                        
                        var currentKey = eventKeys[i];
                        
                        this.getEventInfo(currentKey).then((result:any) => {
                            bandAllEvents.push(result);
                            
                            if (result.eventKey == lastEventKey) {
                                fulfill(bandAllEvents);
                            }
                        });
                    }
                    
                    

                }, (errorObject: any) => {
                    console.log("The read failed: " + errorObject.code);
                });

            } catch (err) {
                reject(err);
            }
        });
    }
    
    getEventInfo(eventKey:string) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var eventFirebase = requestsFirebase.child("events/" + eventKey);
                
                // console.log("retrieveing event info for", eventKey);

                eventFirebase.once("value", (snapshot: any) => {  
                    // console.log("snapshot", snapshot.val());
                    var temp = snapshot.val();
                    temp.eventKey = eventKey;              
                    fulfill(temp);

                }, (errorObject: any) => {
                    console.log("The read failed: " + errorObject.code);
                });


            } catch (err) {
                reject(err);
            }
        });
    }
}

register.injectable('firebase-svc', FirebaseService);
