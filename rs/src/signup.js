__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat.js */ "./src/chat.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_2__);







function init() {
    initSignupBox();
}



async function onSignup() {
    console.log("signup");


    let recaptchaRes = "";
    for(var i of document.getElementById("registerCaptcha").firstChild.children){if(i.localName == "textarea"){recaptchaRes = i.value}}
    if(recaptchaRes.length < 5){
        document.getElementById("signup_notification").innerHTML = "You must check the recaptcha"
        return;
    }


    //let signupBox = element("register_box");
    //let spinner = element("signup_spinner");
    //spinner.style.display = "block";
    
    let name = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.element)("signup_name").value;
    let password = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.element)("signup_password").value;
    var email = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.element)("signup_email")

    //allow missing elem
    if (email){email = email.value;}
    else{email = ""}

    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
    let url = urlPrefix + '/v1/create_user';
    let data = {user_name: name,
                password: password,
                user_email: email,
                recaptcha: recaptchaRes
               }
    let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);

    //spinner.style.display = "none";
    
    console.log("login result", result);

    if ('status' in result.data && result.data.status === "ok" && 'token' in result.data) {

        window.localStorage.setItem('robotstreamer_token', result.data.token);
        window.localStorage.setItem('robotstreamer_username', result.data.user_name);
        window.localStorage.setItem('robotstreamer_user_id', result.data.user_id);
        document.location.reload(); //relaod the page
        location.hash = '';

    } else {

        console.log("signup did not work");
        //now reports reason for fail
        document.getElementById("signup_notification").innerHTML = result.data.status;
        //reload captcha
        grecaptcha.reset();
    }


}

function initSignupBox() {

        //on load callback for recap. because site key in config
        var rsSignuprecaptchaonload = function() {
            grecaptcha.render('registerCaptcha', {
              'sitekey' : _config_js__WEBPACK_IMPORTED_MODULE_2__.visible_recaptcha_site_key,
              'theme': 'dark'
            });
        }
        window.rsSignuprecaptchaonload = rsSignuprecaptchaonload

        document.getElementById('signup_button').addEventListener("click", onSignup, false);
}







//# sourceURL=webpack://rswebclient/./src/signup.js?