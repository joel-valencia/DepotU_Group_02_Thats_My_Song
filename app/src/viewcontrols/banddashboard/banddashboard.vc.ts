import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class BandDashboardViewControl extends BaseViewControl {
    templateString: string = require('./banddashboard.vc.html');

    context: any = {};
}

register.viewControl('banddashboard-vc', BandDashboardViewControl);
