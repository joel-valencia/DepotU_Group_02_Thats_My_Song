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
    
    bandGetInfo(key:string) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandsFirebase = requestsFirebase.child("bands");

                bandsFirebase.once("value", (snapshot: any) => {
                    var allBands = snapshot.val();
                    
                    fulfill(allBands[key]);

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
