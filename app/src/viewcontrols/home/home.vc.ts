import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboard from '../banddashboard/banddashboard.vc';

declare var google:any;

export default class HomeViewControl extends BaseViewControl {
    templateString: string = require('./home.vc.html');

    context: any = {
        registerUsername: "",
        loginUsername: ""
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
    }
    
    loaded() {
        this.initMap();
        navigator.geolocation.getCurrentPosition(console.log)
    }
    
    bandRegister() {
        this.firebaseSvc.bandRegister(this.context.registerUsername).then((result) => {
            console.log("added user to database with key", result)
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
        });
    }
    
    initMap() {
            // var dumData: Array<Object> = [{
            //     position1: {
            //         lat: 
            //     }
            // }]
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
            center: {lat: 33.511, lng: -86.812},
            zoom: 8
            });
    }
}

register.viewControl('home-vc', HomeViewControl, [FirebaseService]);
