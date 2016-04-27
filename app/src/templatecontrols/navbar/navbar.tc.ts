import {register, ui} from 'platypus';
import FirebaseService from '../../services/firebase/firebase.svc';
import SessionService from '../../services/session/session.svc';
import BandDashboardViewControl from '../../viewcontrols/banddashboard/banddashboard.vc';
import HomeViewControl from '../../viewcontrols/home/home.vc';

export default class NavbarTemplateControl extends ui.TemplateControl {
    templateString: string = require('./navbar.tc.html');
     context: any = {
        registerUsername: "",
        registerBandName: "",
        loginUsername: "",
        loggedIn: false,
        loggedInBandKey: "",
        showLogin: false,
        showRegister: false
    };
    
    constructor(private firebaseSvc:FirebaseService, private sessionSvc:SessionService, private homeVC:HomeViewControl) {
        super();
    }
    
    loaded() {
        // open or close menu
        document.getElementById('menu-button').addEventListener('click', function() {
            if (document.getElementById('menu').style.display =="none") {
                document.getElementById('menu').style.display = "block";
            } else {
                document.getElementById('menu').style.display = "none";
            }
        });
        
        // get band key from local storage
        this.context.loggedInBandKey = this.sessionSvc.checkLoggedInBand();
        console.log("logged in user key:", this.context.loggedInBandKey);
        
        // if logged in set logged in variable to true
        if (this.context.loggedInBandKey !== "null") {
            this.context.loggedIn = true;
        }
    }
    
    bandLogin(loginUsername:string) {
        this.firebaseSvc.bandLogin(loginUsername).then((result:string) => {
            console.log("user found with key", result);
            
            this.sessionSvc.logInBand(result);
            
            this.context.loggedIn = true;
            
            this.goToDashboard();
        }, (err) => {
            console.log(err);
        });
    }
    
    bandLogout() {
        this.sessionSvc.logOutBand();
        this.context.loggedIn = false;
        console.log("logged out");
        // console.log("path", window.location.pathname);
        window.location.href = "/";
    }
    
    bandRegister() {
        var newUser = {
            username: this.context.registerUsername,
            bandName: this.context.registerBandName,
            bandDescription: 'Tell Us About Your Band',
            bandImgUrl: 'default'
        }
        
        this.firebaseSvc.bandRegister(newUser).then((result) => {
            console.log("added user to database with key", result)
            
            // user created.  now to login.
            this.bandLogin(this.context.registerUsername);
        }, (err) => {
            console.log(err);
        });
    }
    
    goToDashboard() {
        // this is probably bad but we can't access platypus navigator from a template control
        window.location.href = "/dashboard";
    };
    
    toggleShowLogin() {
        this.context.showLogin = !(this.context.showLogin);
        console.log("toggle");
    }
    
    toggleShowRegister() {
        this.context.showRegister = !(this.context.showRegister);
        console.log("toggle");
    }
}

register.control('navbar', NavbarTemplateControl, [FirebaseService, SessionService, HomeViewControl]);
