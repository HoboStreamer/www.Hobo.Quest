__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   onLogout: () => (/* binding */ onLogout),
/* harmony export */   setCookieToken: () => (/* binding */ setCookieToken)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);
//import {element} from './util.js'; //rip
//import * as chat from './chat.js'; //was for annoying mandatory join msg




function init() {

    initLoginBox();
}
 

async function onLogin() {

    console.log("login");
    let loginBox = document.getElementById("login_box");

    //let spinner = element("login_spinner");
    //spinner.style.display = "block";

    let name = document.getElementById("login_name").value;
    let password = document.getElementById("login_password").value;

    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
    let url = urlPrefix + '/v1/login';
    let data = {user_name: name, password: password}
    let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);

    console.log("login result", result);

    if ('status' in result.data && result.data.status === "ok" &&
        'token' in result.data) {

        window.localStorage.setItem('robotstreamer_token', result.data.token);
        window.localStorage.setItem('robotstreamer_username', result.data.user_name);
        window.localStorage.setItem('robotstreamer_user_id', result.data.user_id);

        document.getElementById("login_notification").innerHTML = "Logging you in";

        let pubUserInfo = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosGET(urlPrefix + '/v1/get_public_user_info/' + result.data.user_id) 
        window.localStorage.setItem('robotstreamer_public_user_info', JSON.stringify(pubUserInfo.data));
 
        document.location.reload()
        location.hash = '';
    }else{
        console.log("login did not work");
        document.getElementById("login_notification").innerHTML = "Incorrect username or password<br>\
                                                                   to <a href='/resetpassword.html?c=reset'>Reset password</a>\
                                                                   You must have a verified email";
    }

}


function setCookieToken() {
    let expDate = new Date();
    //12 hour expiration
    expDate.setTime(expDate.getTime() + 12*60*60*1000)
    document.cookie = "robotstreamer-token=" + localStorage.getItem("robotstreamer_token") + "; domain=" + _config_js__WEBPACK_IMPORTED_MODULE_1__.domain + "; path=/; secure; expires=" + expDate.toUTCString();
}


function onLogout(shouldReload=true){

    window.localStorage.setItem('robotstreamer_token', "");
    window.localStorage.setItem('robotstreamer_username', "");
    window.localStorage.setItem('robotstreamer_user_id', "");
    window.localStorage.setItem('robotstreamer_public_user_info', "");
    
    document.cookie = "robotstreamer-token=; domain=" + _config_js__WEBPACK_IMPORTED_MODULE_1__.domain + "; path=/; secure; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    if (shouldReload) {
      location.hash = ''
      document.location.reload()
    }

}

function initLoginBox() {

    var logoutButton = document.getElementById('logout_button');
    if (logoutButton){logoutButton.addEventListener("click", onLogout, false);}

    var loginButton = document.getElementById('login_button');
    if (loginButton){loginButton.addEventListener("click", onLogin, false);}

    //listens for enter key on password field
    var input = document.getElementById("login_password");
    input.addEventListener("keyup", function(event) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Trigger the button element with a click
            onLogin();
        }
    });

}







//# sourceURL=webpack://rswebclient/./src/login.js?