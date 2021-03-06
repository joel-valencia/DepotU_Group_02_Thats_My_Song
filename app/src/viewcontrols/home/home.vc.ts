import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboardViewControl from '../banddashboard/banddashboard.vc';
import SessionService from '../../services/session/session.svc';
import EventViewControl from '../event/event.vc';
import NavbarTemplateControl from '../../templatecontrols/navbar/navbar.tc';

declare var google:any;

export default class HomeViewControl extends BaseViewControl {
    templateString: string = require('./home.vc.html');

    context: any = {
        lat: 0,
        lng: 0,
        allActiveEvents: [],
        loggedIn: false
    };
    
    constructor(private firebaseSvc:FirebaseService, private sessionSvc:SessionService) {
        super();
        
    }
    
    navigatedTo() {
        // get all active events
        this.firebaseSvc.getAllActiveEvents().then((result) => {
            console.log("all active events", result);
            this.context.allActiveEvents = result;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
            }
        });
        
        // get band key from local storage
        this.context.loggedInBandKey = this.sessionSvc.checkLoggedInBand();
        // console.log("logged in user key:", this.context.loggedInBandKey);
        
        // if logged in set logged in variable to true
        if (this.context.loggedInBandKey !== "null") {
            this.context.loggedIn = true;
        }

    }
    
    initMap() {
            var mapDiv = document.getElementById('map');
            var map = new google.maps.Map(mapDiv, {
            center: {lat: this.context.lat, lng: this.context.lng},
            zoom: 13
            });
        
            var marker = new google.maps.Marker({
               position: <Object> {lat: this.context.lat, lng: this.context.lng},
               map: map,
               title: 'This is me!',
               icon: 'http://earth.google.com/images/kml-icons/track-directional/track-8.png'
     
            });
            
            var infowindow = new google.maps.InfoWindow({
                content: marker.title
            })
            
            marker.addListener('click', function(){
                infowindow.open(map, marker);
            });
            var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var labelIndex = 0;
            var eventNames: any = [];
            var eventKeys: any = [];
            for (var i=0; i < this.context.allActiveEvents.length; i++) {
                
                var latitude = this.context.allActiveEvents[i].eventLocation.lat;
                var longitude = this.context.allActiveEvents[i].eventLocation.lng;
                
                var eventMarkers = new google.maps.Marker({
                    position: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
                    map: map,
                    title: this.context.allActiveEvents[i].eventName,
                    animation: google.maps.Animation.DROP,
                    label: labels[labelIndex++ % labels.length]
                });
                eventNames.push(this.context.allActiveEvents[i].eventName);
                eventKeys.push(this.context.allActiveEvents[i].eventKey)
                this.createInfoWindow(eventMarkers, eventNames[i], eventKeys[i]);
            }
    }
    createInfoWindow(eventMarkers: any, eventNames: any, eventKeys: any) {
        var contentString = '<a id="windowLink" href="/#!/event/'+eventKeys+'">'+eventNames+'</a>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        eventMarkers.addListener('click', function() {
            infowindow.open(eventMarkers.get('map'), eventMarkers);
        });

    }
    
    setPosition(position: any) {
        this.context.lat = position.coords.latitude;
        this.context.lng = position.coords.longitude;
        this.initMap();
        
    }
    
    goToEvent(key:string) {
        this.navigator.navigate(EventViewControl, {
            parameters: {
                key: key
            }
        }); 
    }
    
    openRegister() {
        document.getElementById('menu').style.display = "block";
        var e = <HTMLElement>document.getElementsByClassName('bandRegister')[0];
        e.style.display = "block";
        
        var first = <HTMLElement>e.firstElementChild;
        first.focus();
    }
    
    openLogin() {
        document.getElementById('menu').style.display = "block";
        var e = <HTMLElement>document.getElementsByClassName('bandLogin')[0];
        e.style.display = "block";
        
        var first = <HTMLElement>e.firstElementChild;
        first.focus();
    }
}

register.viewControl('home-vc', HomeViewControl, [FirebaseService, SessionService]);
