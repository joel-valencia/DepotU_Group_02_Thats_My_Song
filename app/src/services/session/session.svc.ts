import {async, register, storage} from 'platypus';
import BaseService from '../base/base.svc';

export default class SessionService extends BaseService {
    
    constructor(private storage:storage.LocalStorage) {
        super();
    }
    
    checkLoggedInBand() {
        return this.storage.getItem("loggedInBandKey");
    }
    
    logInBand(key:string) {
        console.log("saving", key);
        this.storage.setItem("loggedInBandKey", key);
    }
    
    logOutBand() {
        this.storage.setItem("loggedInBandKey", null);
    }

}

register.injectable('session-svc', SessionService, [storage.LocalStorage]);
