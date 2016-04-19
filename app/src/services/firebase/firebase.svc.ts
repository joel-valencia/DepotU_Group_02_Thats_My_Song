import {async, register} from 'platypus';
import BaseService from '../base/base.svc';

declare var Firebase: any;

export default class FirebaseService extends BaseService {
    
    bandRegister(username:string) {
        return new this.Promise((fulfill, reject) => {
            try {
                var requestsFirebase = new Firebase("https://song-requests.firebaseio.com");
                var bandsFirebase = requestsFirebase.child("bands");
                
                var newUserRef = bandsFirebase.push({
                    username: username
                });
                
                var newUserKey = newUserRef.key();
                
                fulfill(newUserKey);

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
                var requestsFirebase = new Firebase("https://songrequests.firebaseio.com");
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
