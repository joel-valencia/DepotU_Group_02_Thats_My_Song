import {App, events, register, routing, web} from 'platypus';
import HomeViewControl from '../viewcontrols/home/home.vc';
import BandCreateEventViewControl from '../viewcontrols/bandcreateevent/bandcreateevent.vc';
import BandDashboard from '../viewcontrols/banddashboard/banddashboard.vc';
import BandEditProfileViewControl from '../viewcontrols/bandeditprofile/bandeditprofile.vc';
import BandRequestedSongsViewControl from '../viewcontrols/bandrequestedsongs/bandrequestedsongs.vc'
import UserFindEventViewControl from '../viewcontrols/userfindevent/userfindevent.vc';
import UserRequestSongViewControl from '../viewcontrols/userrequestsong/userrequestsong.vc';
import EventViewControl from '../viewcontrols/event/event.vc';
import BandEventViewControl from '../viewcontrols/bandevent/bandevent.vc';
import AboutViewControl from '../viewcontrols/about/about.vc';

export default class MyApp extends App {
    constructor(router: routing.Router, config: web.IBrowserConfig) {
        super();

		config.routingType = config.STATE;

        router.configure([
            { pattern: '', view: HomeViewControl },
            { pattern: 'createevent', view: BandCreateEventViewControl },
            { pattern: 'dashboard', view: BandDashboard },
            { pattern: 'editprofile', view: BandEditProfileViewControl },
            { pattern: 'requestedsongs', view: BandRequestedSongsViewControl },
            { pattern: 'findevent', view: UserFindEventViewControl },
            { pattern: 'requestsong', view: UserRequestSongViewControl },
            { pattern: 'event/:key', view: EventViewControl },
            { pattern: 'bandevent/:key', view: BandEventViewControl },
            { pattern: 'about', view: AboutViewControl }
        ]);
    }

    error(ev: events.ErrorEvent<Error>): void {
        console.log(ev.error);
    }
}

register.app('app', MyApp, [
    routing.Router,
    web.IBrowserConfig
]);
