import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';
import FirebaseService from '../../services/firebase/firebase.svc';
import BandDashboardViewControl from '../banddashboard/banddashboard.vc';
import SessionService from '../../services/session/session.svc';
import EventViewControl from '../event/event.vc';

declare var google:any;

export default class HomeViewControl extends BaseViewControl {
    templateString: string = require('./home.vc.html');

    context: any = {
        lat: 0,
        lng: 0,
        allActiveEvents: []
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
                
                var eventMarkers = new google.maps.Marker({
                    position: this.context.allActiveEvents[i].eventLocation,
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
        var contentString = '<a id="windowLink" href="/event/'+eventKeys+'">'+eventNames+'</a>';
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
    
    test() {
        console.log("test");
    }
}

register.viewControl('home-vc', HomeViewControl, [FirebaseService, SessionService]);
