import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class BandEditProfileViewControl extends BaseViewControl {
    templateString: string = require('./bandeditprofile.vc.html');

    context: any = {};
}

register.viewControl('bandeditprofile-vc', BandEditProfileViewControl);
