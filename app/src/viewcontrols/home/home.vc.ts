import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboard from '../banddashboard/banddashboard.vc';

export default class HomeViewControl extends BaseViewControl {
    templateString: string = require('./home.vc.html');

    context: any = {
        registerUsername: "",
        registerBandName: "",
        loginUsername: ""
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    
    bandRegister() {
        var newUser = {
            username: this.context.registerUsername,
            bandName: this.context.registerBandName
        }
        
        this.firebaseSvc.bandRegister(newUser).then((result) => {
            console.log("added user to database with key", result)
        }, (err) => {
            console.log(err);
        });
    }
    
    bandLogin() {
        this.firebaseSvc.bandLogin(this.context.loginUsername).then((result) => {
            console.log("user found with key", result);
            
            this.navigator.navigate(BandDashboard, {
                parameters: {
                    key: result
                }
            }); 
        }, (err) => {
            console.log(err);
        });
    }
}

register.viewControl('home-vc', HomeViewControl, [FirebaseService]);
