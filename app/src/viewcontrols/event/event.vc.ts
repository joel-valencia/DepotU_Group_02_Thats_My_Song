import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class EventViewControl extends BaseViewControl {
    templateString: string = require('./event.vc.html');

    context: any = {};
    
    constructor() {
        super();
    }
    
    navigatedTo(params:any) {
        console.log(params.key);
        
    }
}

register.viewControl('event-vc', EventViewControl);
