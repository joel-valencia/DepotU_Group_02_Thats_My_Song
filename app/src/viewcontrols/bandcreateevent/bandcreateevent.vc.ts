import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class BandCreateEventViewControl extends BaseViewControl {
    templateString: string = require('./bandcreateevent.vc.html');

    context: any = {};
}

register.viewControl('bandcreateevent-vc', BandCreateEventViewControl);
