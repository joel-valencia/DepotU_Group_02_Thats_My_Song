import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboard from '../banddashboard/banddashboard.vc';

declare var google:any;

export default class HomeViewControl extends BaseViewControl {
    templateString: string = require('./home.vc.html');

    context: any = {
        registerUsername: "",
        registerBandName: "",
        loginUsername: "",
        lat: 0,
        lng: 0
    };
    
    constructor(private firebaseSvc:FirebaseService) {
        super();
        
    }
    
    loaded() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
        }
    }
    
    bandRegister() {
        var newUser = {
            username: this.context.registerUsername,
            bandName: this.context.registerBandName,
            bandDescription: 'Tell Us About Your Band'
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
    
    initMap() {
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
            center: {lat: this.context.lat, lng: this.context.lng},
            zoom: 13
            });
            var marker = new google.maps.Marker({
               position: {lat: this.context.lat, lng: this.context.lng},
               map: map,
               title: 'Hello World!' 
            });
    }
    setPosition(position: any) {
        this.context.lat = position.coords.latitude;
        this.context.lng = position.coords.longitude;
        console.log(this.context.lat);
        this.initMap();
        
    }
}

register.viewControl('home-vc', HomeViewControl, [FirebaseService]);
