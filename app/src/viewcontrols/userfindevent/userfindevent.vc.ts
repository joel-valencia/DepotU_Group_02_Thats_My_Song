import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class UserFindEventViewControl extends BaseViewControl {
    templateString: string = require('./userfindevent.vc.html');

    context: any = {};
}

register.viewControl('userfindevent-vc', UserFindEventViewControl);
