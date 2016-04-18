import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class UserRequestSongViewControl extends BaseViewControl {
    templateString: string = require('./userrequestsong.vc.html');

    context: any = {};
}

register.viewControl('userrequestsong-vc', UserRequestSongViewControl);
