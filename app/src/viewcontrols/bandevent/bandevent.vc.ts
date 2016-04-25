import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class BandEventViewControl extends BaseViewControl {
    templateString: string = require('./bandevent.vc.html');

    context: any = {};
}

register.viewControl('bandevent-vc', BandEventViewControl);
