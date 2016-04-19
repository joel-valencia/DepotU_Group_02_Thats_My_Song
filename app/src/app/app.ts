import {App, events, register, routing, web} from 'platypus';
import HomeViewControl from '../viewcontrols/home/home.vc';
import BandCreateEventViewControl from '../viewcontrols/bandcreateevent/bandcreateevent.vc';
import BandDashboard from '../viewcontrols/banddashboard/banddashboard.vc';
import BandEditProfileViewControl from '../viewcontrols/bandeditprofile/bandeditprofile.vc';
import BandRequestedSongsViewControl from '../viewcontrols/bandrequestedsongs/bandrequestedsongs.vc'
import UserFindEventViewControl from '../viewcontrols/userfindevent/userfindevent.vc';
import UserRequestSongViewControl from '../viewcontrols/userrequestsong/userrequestsong.vc';

export default class MyApp extends App {
    constructor(router: routing.Router, config: web.IBrowserConfig) {
        super();

		config.routingType = config.STATE;

        router.configure([
            { pattern: '', view: HomeViewControl },
            { pattern: 'createevent', view: BandCreateEventViewControl },
            { pattern: 'dashboard/:key', view: BandDashboard },
            { pattern: 'editprofile', view: BandEditProfileViewControl },
            { pattern: 'requestedsongs', view: BandRequestedSongsViewControl },
            { pattern: 'findevent', view: UserFindEventViewControl },
            { pattern: 'requestsong', view: UserRequestSongViewControl },
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
