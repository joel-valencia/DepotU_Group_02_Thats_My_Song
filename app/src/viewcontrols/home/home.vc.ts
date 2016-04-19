import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';

export default class HomeViewControl extends BaseViewControl {
    templateString: string = require('./home.vc.html');

    context: any = {
        registerUsername: "",
        loginUsername: ""
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    
    bandRegister() {
        this.firebaseSvc.bandRegister(this.context.registerUsername).then((result) => {
            console.log("added user to database with key", result)
        });
    }
    
    bandLogin() {
        this.firebaseSvc.bandLogin(this.context.loginUsername).then((result) => {
            console.log("user found with key", result);
        });
    }
}

register.viewControl('home-vc', HomeViewControl, [FirebaseService]);
