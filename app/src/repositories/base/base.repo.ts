import {Utils} from 'platypus';

export default class BaseRepository {
	protected static _inject: any = {
        utils: Utils
    };

	protected utils: Utils;
}
