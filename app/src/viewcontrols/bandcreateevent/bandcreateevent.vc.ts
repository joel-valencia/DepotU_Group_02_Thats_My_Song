import {register} from 'platypus';
import FirebaseService from '../../services/firebase/firebase.svc';
import BaseViewControl from '../base/base.vc';
import SessionService from '../../services/session/session.svc';
import BandDashboard from '../banddashboard/banddashboard.vc';

declare var google: any;

export default class BandCreateEventViewControl extends BaseViewControl {
    templateString: string = require('./bandcreateevent.vc.html');

    context: any = {
        addEventName:"",
        addEventDate:"",
        addEventDescription:"",
        eventAddress:"",
        bandKey: "",
        eventCoords: '',
        addEventLocation: ''
    };
    constructor(private firebaseSvc:FirebaseService, private sessionSvc:SessionService) {
        super();
    }
    
    navigatedTo() {
        this.context.bandKey = this.sessionSvc.checkLoggedInBand();
    }
    
    bandAddEvent() {
        var newEvent={
        bandKey: this.context.bandKey,
        eventName: this.context.addEventName,
        eventDate: this.context.addEventDate,
        eventLocation: this.context.addEventLocation,
        eventDescription: this.context.addEventDescription,
        eventActive: false
        };
        
        this.firebaseSvc.bandAddEvent(newEvent).then((result:any) => {
            console.log("added event",result)
        }, (err:any) =>{
            console.log("err");
            // this.eventList(this.context.eventKey);
        });
        
        this.navigator.navigate(BandDashboard, {
            parameters: {
                key: this.context.bandKey
            }
        })
    }
    
    getEventCoords() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setEventCoords.bind(this));
        }
    }
    
    setEventCoords(position: any) {
       this.context.addEventLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
       console.log(this.context.addEventLocation);
    }
    
    geocodeAddress(){
        var geocoder = new google.maps.Geocoder();
        var address = this.context.eventAddress;
        var context = this.context;
        
        geocoder.geocode( {address: address}, function(results: any, status: any) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            context.addEventLocation = {lat: latitude, lng: longitude};
            console.log(context.addEventLocation);
            } 
        });
       var hideElements = document.getElementsByClassName('hide');
       for (let i = 0; i < hideElements.length; i++) {
           let element = <HTMLElement> hideElements[i];
           element.style.display = 'none';
       }
       document.getElementById('confirm').style.display = 'inline-block';
     ;
    }
}



register.viewControl('bandcreateevent-vc', BandCreateEventViewControl,[FirebaseService, SessionService]);
