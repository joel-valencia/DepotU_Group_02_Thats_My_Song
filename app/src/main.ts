import 'platypus';
import 'platypusui';

import './app/app';


// open or close menu
document.getElementById('menu-button').addEventListener('click', function() {
    if (document.getElementById('menu').style.display =="none") {
        document.getElementById('menu').style.display = "block";
    } else {
        document.getElementById('menu').style.display = "none";
    }
});