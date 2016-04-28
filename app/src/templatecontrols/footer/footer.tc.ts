import {register, ui} from 'platypus';

export default class FooterTemplateControl extends ui.TemplateControl {
    templateString: string = require('./footer.tc.html');
}

register.control('footer', FooterTemplateControl);
