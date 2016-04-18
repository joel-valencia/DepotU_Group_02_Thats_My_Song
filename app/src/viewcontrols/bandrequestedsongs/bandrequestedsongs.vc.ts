import {register} from 'platypus';
import BaseViewControl from '../base/base.vc';

export default class BandRequestedSongsViewControl extends BaseViewControl {
    templateString: string = require('./bandrequestedsongs.vc.html');

    context: any = {};
}

register.viewControl('bandrequestedsongs-vc', BandRequestedSongsViewControl);
