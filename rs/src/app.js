__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildSidebar: () => (/* binding */ buildSidebar)
/* harmony export */ });
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat.js */ "./src/chat.js");
/* harmony import */ var _robot_panel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./robot_panel */ "./src/robot_panel.js");
/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login */ "./src/login.js");
/* harmony import */ var _signup__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./signup */ "./src/signup.js");
/* harmony import */ var _funbits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./funbits */ "./src/funbits.js");
/* harmony import */ var _pay_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pay_page */ "./src/pay_page.js");
/* harmony import */ var _subscribe_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./subscribe_page */ "./src/subscribe_page.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./settings */ "./src/settings.js");
/* harmony import */ var _settings_page__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./settings_page */ "./src/settings_page.js");
/* harmony import */ var _new_stream_page__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./new_stream_page */ "./src/new_stream_page.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _recaptcha_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./recaptcha.js */ "./src/recaptcha.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _buttons_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./buttons.js */ "./src/buttons.js");
/* harmony import */ var _control_communication_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./control_communication.js */ "./src/control_communication.js");











 //blerugh



//import Room from './lib/webrtc/room';




console.log("starting rswebclient");


let deletedMedia = {};
let tagBubbleActive = false;
let lastUserSearchResults = [];
let firstLoadCompleted = false;


function rsAppMain(){

    let workingurl = _config_js__WEBPACK_IMPORTED_MODULE_12__.domain

    // if user lands on www. subdomain
    if (window.location.hostname == "www."+workingurl ) {
        if (window.location.href.match('http:')) {
        window.location.href = 'https://'+ workingurl + window.location.pathname;
        }
    }

    if(_config_js__WEBPACK_IMPORTED_MODULE_12__.force_ssl){
        //janky redirect this is temp!
        if (window.location.href.match('http:')) {
                window.location.href = 'https://'+ workingurl + window.location.pathname
        }
    }

/*
    //janky redirect this is temp!
    if (window.location.href.match('http:')) {
      // read cookie data
      var rs_token = encodeURIComponent(window.localStorage.getItem('robotstreamer_token'));
      var rs_username = encodeURIComponent(window.localStorage.getItem('robotstreamer_username'));
      var rs_user_id = encodeURIComponent(window.localStorage.getItem('robotstreamer_user_id'));

      if (rs_token && rs_username && rs_user_id) {
        rs_token = btoa(rs_token)
        window.location.href = 'https://'+ workingurl + window.location.pathname + '?rs_username=' + rs_username + '&rs_user_id=' + rs_user_id + '&rs_token=' + rs_token;
      } else {
        window.location.href = 'https://'+ workingurl + window.location.pathname;
      }
    }
*/
    // legacy login redirected cookie create
    var page_url_string = window.location.href
    var page_url = new URL(page_url_string)
    var rs_username = page_url.searchParams.get('rs_username')
    var rs_user_id = page_url.searchParams.get('rs_user_id')
    var rs_token = page_url.searchParams.get('rs_token')
    if (rs_username && rs_user_id && rs_token) {

      //some users reporting null as username and overwriting
      if(window.localStorage.getItem('robotstreamer_token') &&
         window.localStorage.getItem('robotstreamer_token') > 1){
        console.log("token already exists on https")
      }else{
        rs_token = atob(rs_token)
        window.localStorage.setItem('robotstreamer_username', decodeURIComponent(rs_username))
        window.localStorage.setItem('robotstreamer_user_id',  decodeURIComponent(rs_user_id))
        window.localStorage.setItem('robotstreamer_token',    decodeURIComponent(rs_token))
      }

      window.location.href = 'https://'+ workingurl + window.location.pathname.split('?')[0]

    }

    if (localStorage.getItem("robotstreamer_token") !== null && localStorage.getItem("robotstreamer_token") != "") {
        _login__WEBPACK_IMPORTED_MODULE_2__.setCookieToken();
    }

    setInterval(function () {
      if (localStorage.getItem("robotstreamer_token") !== null && localStorage.getItem("robotstreamer_token") != "") {
        _login__WEBPACK_IMPORTED_MODULE_2__.setCookieToken();
      }
    }, 3600000)

    if (window.location.href.toLowerCase().includes("robot/")) {
        rsTitleBar();
        getUserConfig();
        rsRobotPage();

    } else if (window.location.href.toLowerCase().includes("embed/")) {
        rsEmbedPage();
        
    } else if (window.location.href.toLowerCase().includes("u/")) {
        rsTitleBar();
        getUserConfig();
        rsUserPage();
        
    } else if (window.location.href.toLowerCase().includes("robot_video/")) {
        rsRobotVideo();
        //need to fix in nginx config

    } else if (window.location.href.toLowerCase().includes("subscribe/") || window.location.href.toLowerCase().includes("/subscribe.html")) {
        rsSubscribePage();

    } else if (window.location.href.toLowerCase().includes("video/") || window.location.href.toLowerCase().includes("/video.html")) {
        rsVideoPage();

    } else if (window.location.href.toLowerCase().includes("/pay.html")) {
        rsPayPage();

    } else if (window.location.href.toLowerCase().includes("/settings.html")) {
        rsTitleBar();
        rsSettings();

    } else if (window.location.href.toLowerCase().includes("/resetpassword.html")) {
        rsResetPassword();

     } else if (window.location.href.toLowerCase().includes("/verify.html")) {
        rsVerifyEmail();

    } else if (window.location.href.toLowerCase().includes("new_stream.html")) {
        rsNewStream();

    } else if (window.location.href.toLowerCase().includes("simple_settings.html")) {
        rsSimpleSettingsPage();

    } else if (window.location.href.toLowerCase().includes("chat.html")) {
        rsChatonly();
        getUserConfig();



    } else if (window.location.href.toLowerCase().includes("delete_account.html")) {
      rsDeleteAccountPage();
    } else {
        // default (robot page)
        rsTitleBar();
        getUserConfig();
        rsRobotPage();
    }



    //close elements that expand when not clicked on
    document.addEventListener("click", function(e){
      if (e.target) {
        if (e.target.id != "profile-name") {
          let ele = document.getElementById("profile-dropdown");
          if (ele) {
            ele.classList.remove("profile-dropdown-toggle");
          }
        }
        
        if (e.target.id != "subscribe_button" && e.target.id != "subscribe_dialog") {
          let ele = document.getElementById("subscribe_dialog");
          if (ele) {
            ele.classList.add("menu-toggle-off");
          }
        }
        
        if (!(e.target.id == "video_options_pane" || e.target.id == "video_cog" || e.target.id == "quality_options")) {
          let ele = document.getElementById("video_options_pane");
          if (ele) {
            ele.style.display = "none";
          }
        }

        if (!(e.target.id == "user_options_selected_user_container" || e.target.id == "user_options_selected_user" || e.target.id == "user_options_selected_user_arrow")) {
          document.getElementById("user_options_user_dropdown")?.RsOnClose();
        }

        let tagBubbles = document.querySelectorAll(".tag-bubble");
        let tbsExist = tagBubbles.length;
        let tbsRemoved = 0;
        for (let i = 0; i < tagBubbles.length; i++) {
          let streamDiv = tagBubbles[i].parentElement;
          let streamDivTop = streamDiv.getElementsByClassName("stream-top")[0];
          if ((streamDivTop.contains(e.target) && tagBubbles[i].birth == e.timeStamp) || tagBubbles[i] === e.target) {
            continue;
          }
          tagBubbles[i].parentElement.tagBubbleActive = false;
          tagBubbles[i].remove();
          tbsRemoved += 1;
        }
        if (tbsExist - tbsRemoved < 1) {
          tagBubbleActive = false;
        }
      }
    });
}



function getUserConfig(){

    //todo: set with robot_id so users can choose seperately between windows
    console.log("Start getUserConfig:");

    //add listeners
    //let globalChatMode =
    (0,_util_js__WEBPACK_IMPORTED_MODULE_10__.element)("globalChatMode").addEventListener("click", UIListener)
    ;(0,_util_js__WEBPACK_IMPORTED_MODULE_10__.element)("checkbox_tts").addEventListener("click", UIListener)
    //let updateTTSUserConfig = element("checkbox_tts")


    //set the globalChatMode checkbox and title from localstorage on page load
    var globalChatModeChecked = JSON.parse(localStorage.getItem("robotstreamer_globalChatMode"));
    document.getElementById("globalChatMode").checked = globalChatModeChecked
    if(!globalChatModeChecked){document.getElementById("globalChatModeTitle").innerHTML = "STREAM CHAT"}
    else{document.getElementById("globalChatModeTitle").innerHTML = "GLOBAL CHAT"}

    //set tts checkbox on load
    if (localStorage.getItem("robotstreamer_checkbox_tts")){
        var checkbox_tts = JSON.parse(localStorage.getItem("robotstreamer_checkbox_tts"));
        document.getElementById("checkbox_tts").checked = checkbox_tts
    }else{
        //default to tts on
        document.getElementById("checkbox_tts").checked = true
    }
}


function UIListener() {

    //define elements
    let checkbox_tts = document.getElementById("checkbox_tts").checked
    let globalChatMode = document.getElementById("globalChatMode").checked

    //console.log("setting checkbox_tts option to: ", checkbox_tts);
    //console.log("setting chatbox option to: ", globalChatMode);

    //save elements
    window.localStorage.setItem('robotstreamer_checkbox_tts', checkbox_tts);
    window.localStorage.setItem('robotstreamer_globalChatMode', globalChatMode);

    //change elements
    if(!globalChatMode){document.getElementById("globalChatModeTitle").innerHTML = "STREAM CHAT"}
    else{document.getElementById("globalChatModeTitle").innerHTML = "GLOBAL CHAT"}
}


function rsTitleBar() { //first on almost every page load

    console.log("Start rsTitleBar:")

    var navigationBar = document.getElementById("nav-links");
    var profileHeader = document.getElementById("profile-container");

    //see post bundle
    //var navigationData ='{{NAVBARLINKS}}';
    var navigationData = _config_js__WEBPACK_IMPORTED_MODULE_12__.navbar_links;

    navigationBar.innerHTML = navigationData;
    console.log("written navigation bar")

    if (_util_js__WEBPACK_IMPORTED_MODULE_10__.isUserLoggedIn()){
        var userName = window.localStorage.getItem("robotstreamer_username")

        profileHeader.innerHTML = '\
            <div class="profile-outer" id="profile-outer">'

            profileHeader.innerHTML = profileHeader.innerHTML + '\
              <span id="profile-name" class="profile-name" onclick="openProfileMenu();">'+ userName +'</span>';

            if (_config_js__WEBPACK_IMPORTED_MODULE_12__.webrtc_stream_button){
                profileHeader.innerHTML = profileHeader.innerHTML + 
                 '<span id="btn-makestream" class="profile-broadcast">STREAM</span>'
            }

            profileHeader.innerHTML = profileHeader.innerHTML + '\
              <div class="profile-dropdown" id="profile-dropdown">\
                <a href="/settings.html">Settings</a>\
                <span id="logout_button">Logout</span>\
              </div>\
            </div>';
    }
    else{
        profileHeader.innerHTML = '\
                <div class="login-outer" id="login-outer">\
                    <span class="profile-name" onclick="openModal(1);">Login&nbsp;&nbsp;&nbsp;&nbsp;</span>\
                    <span class="profile-name" onclick="openModal(2);">Register&nbsp;&nbsp;&nbsp;</span>\
                </div>';
    }

    //titlebar contains
    _signup__WEBPACK_IMPORTED_MODULE_3__.init();
    _login__WEBPACK_IMPORTED_MODULE_2__.init();

    //stream button
    if (_config_js__WEBPACK_IMPORTED_MODULE_12__.webrtc_stream_button){
        let btnMakeStream = document.getElementById("btn-makestream")
        if (btnMakeStream) {
            btnMakeStream.addEventListener("click", makeRtcStream)
        }
    }
    //move this to better location



    async function makeRtcStream(){

        let data = {token: localStorage.getItem("robotstreamer_token")}
        let url = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix() + '/v1/create_stream';
        let result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST(url, data); 

        console.log("makeRtcStream:", result.data)
        if (!result.data.status){
            console.error("makeRtcStream error:", result.data.message)
        }else{
            window.location.href = 'https://'+_config_js__WEBPACK_IMPORTED_MODULE_12__.domain+'/robot/'+result.data.robot_id+'/broadcast'
        }        
    }


}






function isUserBroadcaster(){

    if(window.localStorage.getItem("robotstreamer_public_user_info")){

        let pubUserInfo = JSON.parse(localStorage.getItem("robotstreamer_public_user_info"))
        //console.log("pubUserInfo", pubUserInfo);
        if (pubUserInfo){
            if (pubUserInfo.broadcaster){
                //console.log("user is a broadcaster");
                return true;
            }
            else{
                //console.log("user is not a broadcaster");
                return false;
            }
        }
        //todo: advise the user to re-login
        return false;
    }
}



function rsNewStream() {
    console.log("new stream");
    _new_stream_page__WEBPACK_IMPORTED_MODULE_9__.init();
}

//merge and move
function rsSimpleSettingsPage() {
    console.log("simple settings");
    _settings_page__WEBPACK_IMPORTED_MODULE_8__.init();
}

//merge and move
function rsSettings() {
    console.log("rsSettings:");
    _settings__WEBPACK_IMPORTED_MODULE_7__.rsSettings(_util_js__WEBPACK_IMPORTED_MODULE_10__.isUserLoggedIn());
}




//verify
async function rsVerifyEmail() {

    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();

    console.log("rsVerifyEmail:");
    var code = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('c')

    let result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosGET(urlPrefix + '/v1/validate_email/' + code)
    console.log(result);

    var errorDiv = document.getElementById("settings_error");
    errorDiv.style.color="#1dd1a1";
    errorDiv.style.display = "block"
    errorDiv.innerHTML = result.data

    var seconds = 5;
    function countdown() {
        seconds = seconds - 1;
        if (seconds < 0) {
            document.location.href="/";
        } else {
            // Update remaining seconds
            errorDiv.innerHTML = result.data+" <br>redirecting to homepage in " + seconds + " seconds";
            setTimeout(countdown, 1000);
        }
    }
    countdown();

}


//password management
function rsResetPassword() {
    console.log("rsResetVerify:");

    //on load callback for recap. because site key in config
    var rsResetPasswordrecaptchaonload = function() {
        grecaptcha.render('captcha-container', {
          'sitekey' : _config_js__WEBPACK_IMPORTED_MODULE_12__.visible_recaptcha_site_key,
          'theme': 'dark'
        });
    }
    window.rsResetPasswordrecaptchaonload = rsResetPasswordrecaptchaonload;


    //submit buttons
    document.getElementById('settings-main_btn').addEventListener
        ("click", function(){ rsResetVerifySave(); }, true);

    document.getElementById('request-reset_btn').addEventListener
        ("click", function(){ rsRequestPasswordReset(); }, true);


    var errorDiv = document.getElementById("info-div");
    //pages
    var requestReset  = document.getElementById("request-reset");
    var resetPassword = document.getElementById("settings-main");

    //action code
    var code = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('c');

    if (code){
        console.log("code:", code);
        if(code == "reset"){
            console.log("requested reset page:");
            //show request password reset form
            resetPassword.style.display = "block";

        }else{
            //show password reset form
            requestReset.style.display = "block";
        }
    }else{
        //redirect if no code
        document.location.href="/";
    }


        async function rsRequestPasswordReset(){
            console.log("rsRequestPasswordReset:");

            //recur hunt captcha value
            let recaptchaRes = "";
            for(var i of document.getElementById("captcha-container").firstChild.children){if(i.localName == "textarea"){recaptchaRes = i.value}}
            if(recaptchaRes.length < 5){
                errorDiv.style.color="red";
                errorDiv.style.display = "block";
                errorDiv.innerHTML = "You must check the recaptcha";
                return;
            }

            //email input field
            var requestEmail = document.getElementById('request_email').value;

            //build request
            let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();
            var url = urlPrefix + '/v1/reset_password';
            var data = {user_email: requestEmail,
                        recaptcha: recaptchaRes};
            //send request
            var result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST(url, data);
            console.log("rsRequestPasswordReset:", result);

            let userMessage
            if (result.data && result.data.status) {

                //set response text
                errorDiv.style.color="#1dd1a1";
                errorDiv.style.display = "block";
                errorDiv.innerHTML = result.data.status;

                //reset captcha
                grecaptcha.reset();
            }

        }



        async function rsResetVerifySave(){
            console.log("rsResetVerifySave:");

            var newpassword1 = document.getElementById('newpassword1').value;
            var newpassword2 = document.getElementById('newpassword2').value;


            if (newpassword1 == '' || newpassword2 == '' ){
                errorDiv.style.color="red";
                errorDiv.style.display = "block";
                errorDiv.innerHTML = "password empty";
                return
            }

            if(newpassword1 !== newpassword2){
                errorDiv.style.color="red";
                errorDiv.style.display = "block";
                errorDiv.innerHTML = "passwords do not match";
                return
            }
            let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();
            var url = urlPrefix + '/v1/password_reset';
            var data = {password1: newpassword1,
                        password2: newpassword1,
                        code: code,
                       };

            //console.log(data);
            var result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST(url, data);
            let userMessage

            if (result.data && result.data.status === "ok") {
                window.localStorage.setItem('robotstreamer_token', result.data.token);
                window.localStorage.setItem('robotstreamer_username', result.data.user_name);
                window.localStorage.setItem('robotstreamer_user_id', result.data.user_id);

                let pubUserInfo = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosGET(_util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix() + '/v1/get_public_user_info/' + result.data.user_id)
                window.localStorage.setItem('robotstreamer_public_user_info', JSON.stringify(pubUserInfo.data));

                //set ok text
                errorDiv.style.color="#1dd1a1";
                errorDiv.style.display = "block";
                userMessage = "Password reset complete. You are now logged in as "+result.data.user_name;

            }else{
                //set error text
                errorDiv.style.color="red";
                errorDiv.style.display = "block";
                userMessage = result.data.status;

            }

            //always redirect after api call
            var seconds = 5;
            function countdown() {
                seconds = seconds - 1;
                if (seconds < 0) {
                    document.location.href="/";
                } else {
                    // Update remaining seconds
                    errorDiv.innerHTML = userMessage+" <br>redirecting to hompage in " + seconds + " seconds";
                    setTimeout(countdown, 1000);
                }
            }
            countdown();

        }


}


async function apiFetchPageLoad(robotID, embedPage = false) {
    //do the one fat barstard api grab
    let url = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix()+'/v1/robot_page_load';
    let data = {token: window.localStorage.getItem('robotstreamer_token'),
                robot_id: robotID
               }

    if (!firstLoadCompleted) {
      let referrer = document.referrer;
      if (localStorage.getItem("forced_reload_referrer") !== null) {
        referrer = localStorage.getItem("forced_reload_referrer");
        localStorage.removeItem("forced_reload_referrer");
      }
      if (referrer && referrer != "") {
        data['referrer'] = referrer;
      }
    }

    let result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST2(url, data);
    if (result) {
      _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI = result.data;

      if (!embedPage) {
        if (!_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.follow_list){
            console.log("Creating default follow structure")
            _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.follow_list = []
            _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.follow_list.follow = []
            _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.follow_list.follow_email = []
            _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.follow_list.follow_push = []
        }

        //reverse video lists for easier access
        if (typeof _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.videos !== 'undefined') {
          _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.videos = _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.videos.reverse();
        }
        if (typeof _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.clips !== 'undefined') {
          _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.clips = _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.clips.reverse();
        }

        _funbits__WEBPACK_IMPORTED_MODULE_4__.refreshSpendableFunbitsDisplay();
      }
    }
    firstLoadCompleted = true;
}


async function rsUserPage() {

    console.log("Start rsUserPage");
    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();
    let broadcastPage = false;

    let splitURL = window.location.href.split("/");
    //console.log("splitURL", splitURL);

    if (splitURL[4]) {

        var broadcaster_u = splitURL[4].replace(/(?:)#\w*/gi,"");
        //gets a list of online robots for /u/
        let url = urlPrefix+'/v1/choose_robot_from_user/'+broadcaster_u;
        let response = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosGET(url);

        if(response.data == false){
            //homepage
            document.location.href="/";
        }

        //just do random robot for now
        var robots = response.data;
        var random = robots[robots.length * Math.random() | 0];
        var robotID = random.robot_id;
        console.log("random robot:", robotID);
        window.robot_id = robotID;
        
    } else {
        //homepage
        document.location.href="/";
    }

    await apiFetchPageLoad(robotID);
    buildRobotPage(robotID, broadcastPage);
    setupAds();
}



async function rsRobotPage() {

    console.log("Start rsRobotPage");

    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();
    let broadcastPage = false;

    let splitURL = window.location.href.split("/");
    if (splitURL[3] === "robot") {
        // use robot id from url
        console.log("Start rsRobotPage user specified robot");
        var robotID = splitURL[4].replace(/(?:)#\w*/gi,"");
        window.robot_id = robotID;

        if (splitURL[5] === "broadcast") {
            console.log("User attempting broadcast");
            broadcastPage = true;
        }
        else if (splitURL[5] === "tts") {
          console.log("User attempting broadcast-less tts page");
          broadcastPage = true;
          window.ttsOnlyPage = true;
        }

    } else {
        // pick robot id (todo: move this to client after one fetch)
        let url = urlPrefix+'/v1/choose_robot';
        let data = {token: window.localStorage.getItem('robotstreamer_token')};
        console.log("PICKING ROBOT starting axios call for url", url);
        let response = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST(url, data);
        var robotID = response.data.robot_id;
        console.log("finished axios call, picked robot", robotID);
        window.robot_id = robotID;
    }

    await apiFetchPageLoad(robotID);
    buildRobotPage(robotID, broadcastPage);
    setupAds();
}


async function rsEmbedPage() {

    console.log("Start rsEmbedPage");

    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();
    let splitURL = window.location.href.split("/");
    // use robot id from url
    console.log("Start rsEmbedPage user specified robot");
    let robotID = splitURL[4].replace(/(?:)#\w*/gi,"");
    window.robot_id = robotID;
    window.EmbedPage = true;
    
    let canonicalHeader = document.createElement("link");
    canonicalHeader.rel = "canonical";
    canonicalHeader.href = "https://" + _config_js__WEBPACK_IMPORTED_MODULE_12__.domain + "/robot/" + robotID;
    document.head.appendChild(canonicalHeader);

    await apiFetchPageLoad(robotID, true);
    buildEmbedPage(robotID);
}


async function buildEmbedPage(robotID) {
  
  console.log("Start buildEmbedPage for:", robotID);
  console.log("Pageload API response: ", _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI);
  
  //default video type
  let video_type = 'jsmpeg';
  
  //checks for type undefined would = null if api updated
  if (typeof _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.type === "undefined") {
      video_type = 'jsmpeg';
      console.warn("API update reqired, defaulting to jsmpeg viewer");
  }

  if(_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.type == "webrtc"){
      video_type = "webrtc";
  }
  else if (_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.type == "rtmp") {
    video_type = "rtmp";
  }

  console.log("Starting video viewer type: ", video_type);
  
  await _robot_panel__WEBPACK_IMPORTED_MODULE_1__.makeRobotPanel(robotID, true, video_type, false, true);
}


async function buildRobotPage(robotID, broadcastPage = false) {

    console.log("Start buildRobotPage for:", robotID);
    console.log("Pageload API response: ", _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI);
    
    //correct login area if login is bad
    if (_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.bad_login) {
      _login__WEBPACK_IMPORTED_MODULE_2__.onLogout(false);
      let profileHeader = document.getElementById("profile-container");
      if (profileHeader) {
        profileHeader.innerHTML = '\
                        <div class="login-outer" id="login-outer">\
                            <span class="profile-name" onclick="openModal(1);">Login&nbsp;&nbsp;&nbsp;&nbsp;</span>\
                            <span class="profile-name" onclick="openModal(2);">Register&nbsp;&nbsp;&nbsp;</span>\
                        </div>';
      }
    }

    //start chat
    _chat_js__WEBPACK_IMPORTED_MODULE_0__.initChatBox('100');
    //default video type
    let video_type = 'jsmpeg';


    if (broadcastPage) {
      let videoContainer = document.getElementById('stream-funbits-buttons-mobile');
      videoContainer.style.display = "none";

      (0,_control_communication_js__WEBPACK_IMPORTED_MODULE_15__.init)(robotID);
    }

    //checks for type undefined would = null if api updated
    if (typeof _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.type === "undefined") {
        video_type = 'jsmpeg';
        console.warn("API update reqired, defaulting to jsmpeg viewer");
    }

    if(_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.type == "webrtc"){
        video_type = "webrtc";
    }
    else if (_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.type == "rtmp") {
      video_type = "rtmp";
    }

    console.log("Starting video viewer type: ", video_type);


    //start loading video
    let robotPanel = await _robot_panel__WEBPACK_IMPORTED_MODULE_1__.makeRobotPanel(robotID, true, video_type, broadcastPage);

    
    let sidebarPane = document.getElementById("stream-robotlist");
    if (sidebarPane) {
      sidebarPane.addEventListener("scroll", function() {
        adjustTagPosition();
      });
    }
    if (typeof window.visualViewport !== 'undefined') {
      window.visualViewport.addEventListener('resize', function(e) {
        adjustTagPosition(true, e.target);
      });
    }


    //always
    //make sidebar
    buildSidebar();
    //init funbits
    _funbits__WEBPACK_IMPORTED_MODULE_4__.init();
    
    let userSearchField = document.getElementById('search-streams');
    let userSearchClear = document.getElementById('search-streams-clear');
    let searchResultPane = document.getElementById('search-streams-results');
    let autoSearchTimer = null;
    let lastUserSearch = 0;
    
    async function searchUsers() {
      let searchRateMs = 500;
      if (lastUserSearch + searchRateMs < Date.now()) {
        lastUserSearch = Date.now();
        let url = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix()+'/v1/search_users';
        let data = {token: window.localStorage.getItem('robotstreamer_token'),
                    username: userSearchField.value
                   }
        let result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST(url, data);
        lastUserSearchResults = result.data;
        buildSearchResults(result.data);
      }
    }
    
    if (userSearchField) {
      userSearchField.addEventListener("keyup", function(e) {
        clearTimeout(autoSearchTimer);
        
        if (e.key === "Enter") {
          if (userSearchField.value.length > 0) {
            searchUsers();
          }
        }
        else if (e.key == "Escape") {
          userSearchField.value = "";
          if (searchResultPane) {
            searchResultPane.innerHTML = "";
          }
          if (userSearchClear) {
            userSearchClear.style.display = "none";
          }
        }
        else {
          if (userSearchClear) {
            if (userSearchField.value == "") {
              userSearchClear.style.display = "none";
            }
            else {
              userSearchClear.style.display = "inline";
              if (userSearchField.value.length >= 3) {
                autoSearchTimer = setTimeout(function() {
                  searchUsers();
                }, 1000);
              }
            }
          }
        }
      });
      
      if (userSearchClear) {
        userSearchClear.addEventListener("click", function(e) {
          userSearchField.value = "";
          userSearchClear.style.display = "none";
          if (searchResultPane) {
            searchResultPane.innerHTML = "";
          }
        });
      }
    }

    //sidebar refresh
    var refreshIntervalCounter = Math.floor((Math.random() * 30000) + 30000);
    var refreshInterval = async function(){ 

        if (_global_js__WEBPACK_IMPORTED_MODULE_13__.forcePageLoadRefresh || document.visibilityState != "hidden") {
            console.log("Refreshing ui"); 
            _global_js__WEBPACK_IMPORTED_MODULE_13__.forcePageLoadRefresh = false;
            await apiFetchPageLoad(window.robot_id);
            // taken from new ui
            let rInfo = _util_js__WEBPACK_IMPORTED_MODULE_10__.extractRobotInfo(_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI, window.robot_id)
            // refresh items
            buildSidebar();
            document.getElementById("stream_followers").innerHTML = rInfo.ownerFollowers || '0';
            document.getElementById("stream_viewers").innerHTML = rInfo.viewers || '0';
            document.getElementById("stream_name").innerHTML = _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(rInfo.name);
            document.getElementById("stream_name").title = _util_js__WEBPACK_IMPORTED_MODULE_10__.restoreAmpersands(_util_js__WEBPACK_IMPORTED_MODULE_10__.restoreTagsAndQuotes(rInfo.name));
            document.getElementById("title").innerHTML = _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(rInfo.name) + ' - ' + _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(rInfo.ownerName) + ' - ' + _util_js__WEBPACK_IMPORTED_MODULE_10__.capitalizeFirst(_config_js__WEBPACK_IMPORTED_MODULE_12__.domain);
            window.lastTitle = _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(rInfo.name) + ' - ' + _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(rInfo.ownerName) + ' - ' + _util_js__WEBPACK_IMPORTED_MODULE_10__.capitalizeFirst(_config_js__WEBPACK_IMPORTED_MODULE_12__.domain);
            if (rInfo.lastOnline !== undefined && rInfo.lastOnline !== null) {
              _global_js__WEBPACK_IMPORTED_MODULE_13__.lastOnline = new Date(rInfo.lastOnline);
            }
            if (rInfo.lastStartup !== undefined && rInfo.lastStartup !== null) {
              _global_js__WEBPACK_IMPORTED_MODULE_13__.lastStartup = new Date(rInfo.lastStartup);
            }
            if (!broadcastPage) {
              if (rInfo.status == "online") {
                document.getElementById("stream_dot").style.display = "block";
              }
              else {
                document.getElementById("stream_dot").style.display = "none";
              }
            }
            _global_js__WEBPACK_IMPORTED_MODULE_13__.streamOnline = rInfo.status == "online";
            if (rInfo.description) {
              _robot_panel__WEBPACK_IMPORTED_MODULE_1__.updateDescription(rInfo.description);
            }
            
            //new time every time
            refreshIntervalCounter = Math.floor((Math.random() * 30000) + 30000);
            console.log("next sidebar refresh attempt in: ", refreshIntervalCounter);
            setTimeout(refreshInterval, refreshIntervalCounter);
        }
        else {
          //shorter timeout if missed last refresh
          refreshIntervalCounter = Math.floor((Math.random() * 5000) + 1000);
          console.log("next sidebar refresh attempt in: ", refreshIntervalCounter);
          setTimeout(refreshInterval, refreshIntervalCounter);
        }
    } 
    setTimeout(refreshInterval, refreshIntervalCounter);
    
    let mediaPresent = false;
    let videosPresent = false;
    let clipsPresent = false;
    let vodsContainer = document.getElementById("video_links");
    let clipsContainer = document.getElementById("clip_links");
    if (vodsContainer) {
      videosPresent = DisplayUserMedia(vodsContainer, _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.videos, 1);
    }
    if (clipsContainer) {
      clipsPresent = DisplayUserMedia(clipsContainer, _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.clips, 1);
    }
    mediaPresent = videosPresent || clipsPresent;
    
    //media selector buttons
    if (mediaPresent) {
      document.getElementById("media_selector_videos").addEventListener("click", function() {
        document.getElementById("video_links").style.display = "block";
        document.getElementById("clip_links").style.display = "none";
        document.getElementById("media_selector_videos").classList.add("media_selector_selected");
        document.getElementById("media_selector_clips").classList.remove("media_selector_selected");
      });
      
      document.getElementById("media_selector_clips").addEventListener("click", function() {
        document.getElementById("video_links").style.display = "none";
        document.getElementById("clip_links").style.display = "block";
        document.getElementById("media_selector_videos").classList.remove("media_selector_selected");
        document.getElementById("media_selector_clips").classList.add("media_selector_selected");
      });
    }
    else {
      document.getElementById("media_selectors").style.display = "none";
    }

}


function buildSidebar(){

    console.log("buildSidebar()");
    //list of broadcasters from pageload
    let broadcasters = _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.robots;
    let API = _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI;

    //sidebar divs
    let robotFollowingSidebar = document.getElementById('online-followed-streams');
    let robotOnlineSidebar = document.getElementById('online-streams');
    let robotDislikedSidebar = document.getElementById('online-disliked-streams');
    let robotOfflineSidebar = document.getElementById('offline-streams');
    let dislikedStreamTitle = document.getElementById('disliked_stream_title');
    let dislikedStreamContents = document.getElementById('disliked_stream_contents');
    let dislikesArrow = document.getElementById('dislikes_arrow');

    //default state
    robotOfflineSidebar.style.display = 'block';
    
    //clear to allow refresh
    robotFollowingSidebar.innerHTML = '';
    robotOnlineSidebar.innerHTML = '';
    dislikedStreamContents.innerHTML = '';
    robotOfflineSidebar.innerHTML = '<span class="offline-streams-title">Recently Online</span>';



    //janky just for an optional string
    let dislikeListUsed = false;
    for (let i=0; i<broadcasters.length; i++) { //for every broadcaster
        let robots = broadcasters[i]['robots'];
        var anyOnline = false;
        for(let i=0; i<robots.length; i++) {//are any online?
            if(robots[i].status == "online"){
                anyOnline = true;
            }
        }
        if (API.follow_list.follow.includes(broadcasters[i].user_id) && anyOnline){
            robotFollowingSidebar.innerHTML = '<span class="offline-streams-title">Following</span>';
            robotOnlineSidebar.innerHTML = '<span class="offline-streams-title">Recommended</span>';
        }
        if ((API.dislike_list.includes(broadcasters[i].user_id) || broadcasters[i].not_recommended) && !API.follow_list.follow.includes(broadcasters[i].user_id) && anyOnline) {
          dislikeListUsed = true;
        }
    }
    
    if (dislikeListUsed) {
      robotDislikedSidebar.style.display = "block";
      if (dislikedStreamTitle.ready === undefined) {
        dislikedStreamTitle.ready = true;
        dislikedStreamTitle.addEventListener("click", function() {
          _global_js__WEBPACK_IMPORTED_MODULE_13__.dislikedStreamsVisible = !_global_js__WEBPACK_IMPORTED_MODULE_13__.dislikedStreamsVisible
          if (_global_js__WEBPACK_IMPORTED_MODULE_13__.dislikedStreamsVisible) {
            dislikedStreamContents.style.display = "block";
            dislikesArrow.style.transform = 'rotate(180deg)';
          }
          else {
            dislikedStreamContents.style.display = "none";
            dislikesArrow.style.transform = 'rotate(0deg)';
          }
        });
      }
    }
    else {
      robotDislikedSidebar.style.display = "none";
    }



    //build the sidebar
    let offlineStreamCount = 0;
    for (let i=0; i<broadcasters.length; i++) { //for every broadcaster
        //add user to user menu
        _chat_js__WEBPACK_IMPORTED_MODULE_0__.addSeenUser(broadcasters[i].user_name, broadcasters[i].user_id);

        let robots = broadcasters[i]['robots'];
        
        let userColor = "";
        if (broadcasters[i].highlighted) {
          userColor = " style=\"color:#FF0000;\" " + (broadcasters[i].highlighted_no_ui ? "class=\"username-strikethrough\" " : "");
        }

        var anyOnline = false
        for(let i=0; i<robots.length; i++) {//are any online?
            if(robots[i].status == "online"){
                anyOnline = true;
            }
        }

        var anyOffline = false
        for(let i=0; i<robots.length; i++) {//are any offline?
            if(robots[i].status == "offline"){
                anyOffline = true;
                offlineStreamCount++;
            }
        }

        var streamerHeader = "\
           <div class=\"stream" + (broadcasters[i].nsfw_broadcaster === true ? " nsfw-stream" : "") + "\" streamername=\"" + _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndAmpersandsAndQuotes(broadcasters[i].user_name) + "\" streamerid=\"" + _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndAmpersandsAndQuotes(broadcasters[i].user_id) + "\">\
            <div class=\"stream-top\" onclick=\"toggleStreamEntry(this)\" >\
             <span" + userColor + ">"+broadcasters[i].user_name+"</span>\
             " + (anyOffline ? "<img class=\"stream-tags\" src=\"/images/tagicon.svg\" alt=\"tags\"><img class=\"stream-top-arrow\" src=\"/images/streamarrow.svg\" alt=\"arrow\"/>" : "<img class=\"stream-tags stream-tags-no-arrow\" src=\"/images/tagicon.svg\" alt=\"tags\">") + "\
            </div>\
            <div class=\"stream-bottom\">";

        if (anyOnline == true){
            //remove this display block to return spacing to normal
            streamerHeader += "<div class=\"stream-bottom-streamlist-online\" style=\"display :block\">";
            for(let i=0; i<robots.length; i++){

                //for every online robot of broadcaster

                if(robots[i].status == "online"){
                    let robotHref = "/robot/" + robots[i].robot_id;
                    let robotName = _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(robots[i].robot_name);
                    let robotViewers = robots[i].viewers ? robots[i].viewers : "&nbsp;";
                    streamerHeader += "<span class=\"stream-bottom-stream\"><a href=\""+robotHref+"\" title=\""+robotName+"\">"+robotName + "<span class=\"stream-bottom-viewers\">" + robotViewers + "</span></a></span>";
                }
            }//end for every online robot
            streamerHeader += "</div>"; //close the online robots div
        }

        if (anyOffline == true){
            streamerHeader += "<div class=\"stream-bottom-streamlist-offline\" style=\"display :none\">";
            for(let i=0; i<robots.length; i++){
                //for every robot of broadcaster

                if(robots[i].status == "offline"){
                    let robotHref = "/robot/" + robots[i].robot_id;
                    let robotName = _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(robots[i].robot_name);
                    streamerHeader += "<span class=\"stream-bottom-stream\"><a href=\""+robotHref+"\">"+robotName+"</a></span>";
                }
            }//end for every offline robot
            streamerHeader += "</div>"; //close the offline robots div
        }

        streamerHeader += "</div>"; //close the stream-bottom div
        streamerHeader += "</div>"; //close the stream div
        //append to correct div
        if (anyOnline == true) {
            
            //if following broadcaster add to follow div
            if (API.follow_list.follow.includes(broadcasters[i].user_id)){
                console.log("following: ", broadcasters[i].user_id);
                robotFollowingSidebar.insertAdjacentHTML('beforeend', streamerHeader);   
            }
            else if (API.dislike_list.includes(broadcasters[i].user_id) || broadcasters[i].not_recommended) {
                dislikedStreamContents.insertAdjacentHTML('beforeend', streamerHeader);
            }
            else {
                robotOnlineSidebar.insertAdjacentHTML('beforeend', streamerHeader);
            }



        } else {
            robotOfflineSidebar.insertAdjacentHTML('beforeend', streamerHeader);
        }
    }//end for every broadcaster
    if (offlineStreamCount < 1) {
      robotOfflineSidebar.innerHTML = "";
    }
    let nsfwPanes = document.getElementsByClassName("nsfw-stream");
    for (let i = 0; i < nsfwPanes.length; i++) {
      if (nsfwPanes[i].nsfwd || nsfwPanes[i].buttoned) {
        continue;
      }
      let newNsfw = document.createElement("span");
      newNsfw.innerText = "NSFW";
      newNsfw.className = "nsfw-label";
      newNsfw.title = "Not Safe For Work";
      nsfwPanes[i].appendChild(newNsfw);
      nsfwPanes[i].nsfwd = true;
      if (API.global_moderator === true || API.privileges?.previewer === true) {
        newNsfw.title += ". Click to open menu.";
        newNsfw.style.cursor = "pointer";
        newNsfw.addEventListener("click", function() {
          _chat_js__WEBPACK_IMPORTED_MODULE_0__.openChatUserOptions(nsfwPanes[i].getAttribute("streamername"), nsfwPanes[i].getAttribute("streamerid"));
        });
      }
    }

    if (API.global_moderator === true || API.privileges?.previewer === true) {
      let streamPanes = document.getElementsByClassName("stream");
      for (let i = 0; i < streamPanes.length; i++) {
        if (streamPanes[i].nsfwd || streamPanes[i].buttoned) {
          continue;
        }
        let paneMenuButton = document.createElement("img");
        paneMenuButton.src = "/images/more_options.svg";
        paneMenuButton.className = "sidebar-menu-button";
        paneMenuButton.title = "Click to open menu.";
        streamPanes[i].appendChild(paneMenuButton);
        streamPanes[i].buttoned = true;
        paneMenuButton.addEventListener("click", function() {
          _chat_js__WEBPACK_IMPORTED_MODULE_0__.openChatUserOptions(streamPanes[i].getAttribute("streamername"), streamPanes[i].getAttribute("streamerid"));
        });
      }
    }

    adjustTagPosition();
    applyTags();
}




function rsSubscribePage() {

    console.log("subscribe page");
    let ppScript = document.createElement("script");
    ppScript.onload = function () {
		    _subscribe_page__WEBPACK_IMPORTED_MODULE_6__.init();
		};
  	ppScript.src = "https://www.paypal.com/sdk/js?client-id=" + _config_js__WEBPACK_IMPORTED_MODULE_12__.paypal_client_id + "&vault=true&intent=subscription";
  	document.head.appendChild(ppScript);
}





function rsVideoPage() {
    console.log("Video Page");
    const vidReg = /\/video\/([^?#]+)/i;
    let vidMatch = window.location.href.match(vidReg);
    const charReg = /^[a-zA-Z\d\-\.]+$/;
    if (vidMatch && vidMatch[1] && vidMatch[1].match(charReg)) {
      let vidBox = document.getElementById("video_playback");
      if (vidBox) {
        vidBox.src = _config_js__WEBPACK_IMPORTED_MODULE_12__.b2Prefix + vidMatch[1];
      }
    }
}




function rsPayPage() {

    console.log("pay page");
    _pay_page__WEBPACK_IMPORTED_MODULE_5__.init();
}




async function rsChatonly() {

    console.log("Start rsChatonly");

    let robotID;
    let code = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('c');
    if (robotID == 0){
        //if 0 cludge global chat if allowed
        window.localStorage.setItem('robotstreamer_globalChatMode', true);
        robotID = 101;
    }    
    
    if (code){robotID = code}

    await apiFetchPageLoad(code);
    console.log("Pageload API response: ", _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI)
    window.robot_id = code
    
    let chatOptions = {};
    let preset = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('preset');
    if (preset) {
      if (preset == "1") {
        chatOptions['background_color'] = "transparent";
        chatOptions['controls_disabled'] = true;
        chatOptions['compact_disabled'] = true;
        chatOptions['titles_disabled'] = true;
        chatOptions['avatars_enabled'] = true;
        chatOptions['size'] = "20";
        chatOptions['hide_first_welcome'] = true;
        chatOptions['tts_bar_disabled'] = true;
      }
    }
    let customBgColor = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('bgcolor');
    if (customBgColor) {
      let colorCheck = new RegExp("^[a-zA-Z]+$", "i");
      if (colorCheck.test(customBgColor)) {
        chatOptions['background_color'] = customBgColor;
      }
    }
    let chatControls = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('controls');
    if (chatControls) {
      chatOptions['controls_disabled'] = !_util_js__WEBPACK_IMPORTED_MODULE_10__.englishToBool(chatControls);
    }
    let fontSize = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('size');
    if (fontSize) {
      let sizeCheck = new RegExp("^[0-9]+$", "i");
      if (sizeCheck.test(fontSize)) {
        chatOptions['size'] = fontSize;
      }
    }
    let compact = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('compact');
    if (compact) {
      chatOptions['compact_disabled'] = !_util_js__WEBPACK_IMPORTED_MODULE_10__.englishToBool(compact);
    }
    let titles = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('titles');
    if (titles) {
      chatOptions['titles_disabled'] = !_util_js__WEBPACK_IMPORTED_MODULE_10__.englishToBool(titles);
    }
    let avatars = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('avatars');
    if (avatars) {
      chatOptions['avatars_enabled'] = _util_js__WEBPACK_IMPORTED_MODULE_10__.englishToBool(avatars);
    }
    let welcome = _util_js__WEBPACK_IMPORTED_MODULE_10__.getHeader('welcome');
    if (welcome) {
      chatOptions['hide_first_welcome'] = !_util_js__WEBPACK_IMPORTED_MODULE_10__.englishToBool(welcome);
    }
    
    _chat_js__WEBPACK_IMPORTED_MODULE_0__.initChatBox(code, chatOptions);

}


async function rsRobotVideo() {

    console.log("robot video only/ffmpeg only needs nginx config");

    let splitURL = window.location.href.split("/");
    if (splitURL[3] === "robot_video") {
        // use robot id in url
        var robotID = splitURL[4].replace(/(?:)#\w*/gi,"");
        window.robot_id = robotID
    }
    //await makePageVideoOnly([robotID]);


    await _robot_panel__WEBPACK_IMPORTED_MODULE_1__.makeRobotPanelVideoOnly(robotID);
}


function rsDeleteAccountPage() {
    console.log("Start rsDeleteAccountPage");
    if (!_util_js__WEBPACK_IMPORTED_MODULE_10__.isUserLoggedIn()) {
      let bottomArea = document.getElementById("delete_account_container").getElementsByClassName("modal-bottom")[0];
      bottomArea.innerText = "Please log into the account you want to delete, then return to this page.";
      bottomArea.style.color = "#F7F7F7";
      return;
    }
    let usernameBox = document.getElementById("delete_account_username");
    if (usernameBox) {
      usernameBox.innerText = localStorage.getItem("robotstreamer_username");
    }
    let deleteButton = document.getElementById("delete_account_button");
    if (deleteButton) {
      deleteButton.addEventListener("click", async function() {
        if (!deleteButton.disabled) {
          deleteButton.disabled = true;
          if (document.getElementById("delete_account_confirmation").value == "DELETE") {
            document.getElementById("delete_account_notification").innerText = "Deleting...";
            let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_10__.getAPIprefix();
            let url = urlPrefix + '/v1/delete_user';
            let data = {token: localStorage.getItem('robotstreamer_token'),
                        password: document.getElementById("delete_account_password").value};
            let deleteResult = await _util_js__WEBPACK_IMPORTED_MODULE_10__.axiosPOST(url, data);
            if (deleteResult.data.status === true) {
              document.getElementById("delete_account_notification").innerText = "Your account has been successfully deleted. Returning to homepage in 5 seconds...";
              _login__WEBPACK_IMPORTED_MODULE_2__.onLogout(false);
              setTimeout(function() {
                document.location.href = "/";
              }, 5000);
            }
            else {
              document.getElementById("delete_account_notification").innerText = deleteResult.data.msg;
              deleteButton.disabled = false;
            }
          }
          else {
            deleteButton.disabled = false;
            document.getElementById("delete_account_notification").innerText = "Please type DELETE into the appropriate field. (Case sensitive)";
          }
        }
      });
    }
}


function ClearMediaList(container) {
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function ClearVideosAndClips() {
  let video = document.getElementById("video_links");
  while (video.firstChild) {
    video.removeChild(video.lastChild);
  }
  let clip = document.getElementById("clip_links");
  while (clip.firstChild) {
    clip.removeChild(clip.lastChild);
  }
}

function DisplayVisibilityWarning(btn) {
  let oldVisibilityWarningWindow = document.getElementById("visibility_warning_window");
  if (oldVisibilityWarningWindow) {
    oldVisibilityWarningWindow.remove();
  }
  let visibilityWarningWindow = document.createElement("div");
  visibilityWarningWindow.id = "visibility_warning_window";
  visibilityWarningWindow.classList.add("rs-modal-window");
  visibilityWarningWindow.innerHTML = '\
                                      <span class="rs-modal-close-button" id="visibility_warning_close_button"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>\
                                      <img src="/images/clip_icon.svg" class="rs-modal-primary-icon">\
                                      <div class="rs-modal-title">Making Video Public</div>\
                                      <p class="rs-modal-contents">\
                                        Double check before making your video public:\
                                        <ul>\
                                          <li>Does not violate copyright</li>\
                                          <li>Nothing illegal</li>\
                                          <li>Nothing extremely shady</li>\
                                          <li>If explicit, you must have age validation on file (see <a class="general-link" href="/settings.html#broadcaster" target="_blank">settings page</a>)</li>\
                                        </ul>\
                                      </p>\
                                      <br>\
                                      <div style="text-align: center;"><div class="rs-modal-button-acknowledge" id="visibility_warning_acknowledge_button">I Understand</div></div>\
                                      ';
  try {
    document.getElementsByTagName("BODY")[0].appendChild(visibilityWarningWindow);
    document.getElementById("visibility_warning_acknowledge_button").addEventListener("click", function() {
      localStorage.setItem("visibility_warning_last_acknowledged", new Date().valueOf());
      visibilityWarningWindow.remove();
      btn.dispatchEvent(new Event("click"));
    });
    document.getElementById("visibility_warning_close_button").addEventListener("click", function() {
      visibilityWarningWindow.remove();
    });
  }
  catch (e) {
    console.error(e);
  }
}

//according to current state of file
function setPublicizeButtonState(btn, publicized) {
  let privateIcon = btn?.parentElement?.parentElement.getElementsByClassName("private-media-icon")[0];
  if (privateIcon) {
    if (publicized) {
      privateIcon.style.display = "none";
    }
    else {
      privateIcon.style.display = "";
    }
  }
  if (publicized) {
    btn.innerHTML = "Make Private";
    btn.classList.add("control-button-important-warning");
  }
  else {
    btn.innerHTML = "Make Public";
    btn.classList.remove("control-button-important-warning");
  }
}

function DisplayUserMedia(container, mediaList, page) {
  let maxVideoPageLimit = 20;
  let videoStartPageLimit = 5;
  
  let videoPageLimit = maxVideoPageLimit;
  let offset = videoPageLimit - videoStartPageLimit;
  if (page == 1) {
    videoPageLimit = videoStartPageLimit;
    offset = 0;
  }
  let pageIndex = page - 1;
  let mediaPresent = false;
  if (typeof mediaList !== 'undefined' && typeof _config_js__WEBPACK_IMPORTED_MODULE_12__.b2Prefix !== 'undefined'){
      for (let i = (videoPageLimit * pageIndex) - offset; i < (videoPageLimit * pageIndex) - offset + videoPageLimit && i < mediaList.length; i++) {
          let video = mediaList[i];
          mediaPresent = true;

          let mediaContainer = document.createElement("div");
          mediaContainer.className = "media-item-container";
          let a = document.createElement('a');
          
          let vidThumb = document.createElement('img');
          vidThumb.alt = _config_js__WEBPACK_IMPORTED_MODULE_12__.b2Prefix+video.file_name;
          vidThumb.style="width:110px;margin-right:10px;"
          vidThumb.onerror=function(){this.onerror=null;this.src='/images/noimage.png';}
          vidThumb.src = _config_js__WEBPACK_IMPORTED_MODULE_12__.b2Prefix + video.file_name + ".jpg";
          a.appendChild(vidThumb);

          
          let privateIcon = document.createElement("img");
          privateIcon.className = "private-media-icon";
          privateIcon.src = "/images/private_icon.svg";
          privateIcon.alt = "Private";
          privateIcon.title = "Private";
          if (video.public === true) {
            privateIcon.style.display = "none";
          }
          a.appendChild(privateIcon);
          
          let vidTimestamp = video.created_str + "Z";
          let vidDate = new Date(vidTimestamp);
          vidTimestamp = vidDate.toLocaleDateString(undefined, {month: 'short'}) + ' ' + vidDate.getDate() + ', ' + vidDate.getFullYear() + ' ' + vidDate.toLocaleTimeString();

          let expirationStr = '';
          if (video.expiration) {
            let expirationDate = new Date(video.expiration + "Z");
            expirationStr = ' (Expires: ' + expirationDate.toLocaleDateString(undefined, {month: 'short'}) + ' ' + expirationDate.getDate() + ', ' + expirationDate.getFullYear() + ' ' + expirationDate.toLocaleTimeString() + ')';
          }
          
          a.appendChild(document.createTextNode("video: " + vidTimestamp + " stream: " + _util_js__WEBPACK_IMPORTED_MODULE_10__.restoreAmpersands(_util_js__WEBPACK_IMPORTED_MODULE_10__.restoreHtmlTags(video.title)) + expirationStr));
          a.title = "Created on: " + vidTimestamp + " Length seconds: " + video.length;
          a.href = "/video/" + video.file_name;
          a.target = "_blank";

          mediaContainer.appendChild(a);
          container.appendChild(mediaContainer);

          let mediaButtonContainer = document.createElement("div");
          mediaButtonContainer.classList.add("media-button-container");
          mediaContainer.appendChild(mediaButtonContainer);

          //visibility change buttons
          if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner || _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.global_moderator === true) {
            let visButton = document.createElement('div');
            visButton.value = video.file_name;
            visButton.classList.add("video-visibility");
            visButton.classList.add("control-button-important");
            if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner) {
              setPublicizeButtonState(visButton, video.public);
            }
            else {
              setPublicizeButtonState(visButton, video.public);
              if (!video.public) {
                visButton.innerHTML = "Private";
                visButton.classList.add("control-button-important-disabled");
                visButton.classList.remove("control-button-important-warning");
                visButton.disabled = true;
                visButton.style.display = "none";
              }
            }
            mediaButtonContainer.appendChild(visButton);
          }

          //add delete button if owner
          if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner) {
            let delete_elm = document.createElement('div');
            delete_elm.value = video.file_name;
            delete_elm.classList.add("video-delete");
            delete_elm.classList.add("control-button-important");
            delete_elm.classList.add("control-button-important-negative");
            delete_elm.innerHTML = "Delete";
            if (deletedMedia[video.file_name]) {
              delete_elm.innerHTML = "Deleted";
              delete_elm.disabled = true;
              delete_elm.classList.add("control-button-important-disabled");
              delete_elm.classList.remove("control-button-important-negative");
            }
            mediaButtonContainer.appendChild(delete_elm);
          }
      }
      
      
      //setup page controls
      let pageControls = document.createElement('div');
      let pageLeft = document.createElement('div');
      let pageRight = document.createElement('div');
      let pageInput = document.createElement('input');
      let pageMax = document.createElement('div');
      
      pageLeft.innerText = "←";
      pageRight.innerText = "→";
      pageInput.value = page;
      let maxPages = 0;
      let videoCount = mediaList.length;
      if (mediaList.length > videoStartPageLimit) {
        maxPages = 1;
        videoCount -= videoStartPageLimit;
      }
      maxPages += Math.ceil(videoCount / maxVideoPageLimit);
      pageMax.innerHTML = "&nbsp;/ " + maxPages.toString();
      pageInput.style.marginLeft = "5px";
      pageMax.style.marginRight = "5px";
      if (!mediaPresent) {
        pageControls.style.display = "none";
      }
      
      pageControls.appendChild(pageLeft);
      pageControls.appendChild(pageInput);
      pageControls.appendChild(pageMax);
      pageControls.appendChild(pageRight);
      
      pageControls.className = "video-page-controls";
      pageLeft.className = "video-page-controls-arrow";
      pageRight.className = "video-page-controls-arrow";
      
      container.appendChild(pageControls);
      pageLeft.addEventListener("click", function() {
        let newPage = parseInt(pageInput.value);
        if (newPage) {
          newPage -= 1;
        }
        else {
          newPage = page - 1;
        }
        if (newPage > 0 && newPage <= maxPages) {
          ClearMediaList(container);
          DisplayUserMedia(container, mediaList, newPage);
        }
      });
      pageRight.addEventListener("click", function() {
        let newPage = parseInt(pageInput.value);
        if (newPage) {
          newPage += 1;
        }
        else {
          newPage = page + 1;
        }
        if (newPage > 0 && newPage <= maxPages) {
          ClearMediaList(container);
          DisplayUserMedia(container, mediaList, newPage);
        }
      });
      pageInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
          let newPage = parseInt(pageInput.value);
          if (newPage && newPage > 0 && newPage <= maxPages) {
            ClearMediaList(container);
            DisplayUserMedia(container, mediaList, newPage);
          }
        }
      });
      

      //delete button eventListener when owner
      if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner) {
          let videoDeleteButton = document.getElementsByClassName('video-delete');
          for (let i = 0; i < videoDeleteButton.length; i++) {
              if (videoDeleteButton[i].setupDone != true) {
                videoDeleteButton[i].setupDone = true;
                videoDeleteButton[i].addEventListener("click", function() {
                    if (this.disabled) {
                      return;
                    }

                    console.log(this.value)
                    let r = confirm("Delete file "+this.value+" ?");
                    if (r == true) {
                        //requires owners token
                        _util_js__WEBPACK_IMPORTED_MODULE_10__.deleteVideo(this.value);
                        this.innerHTML = "Deleted";
                        this.disabled = true;
                        deletedMedia[this.value] = true;
                        this.classList.add("control-button-important-disabled");
                        this.classList.remove("control-button-important-negative");
                    }
                });
              }
          }
      }

      //visibility button setup
      if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner || _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.global_moderator === true) {
          let videoVisibilityButton = document.getElementsByClassName('video-visibility');
          for (let i = 0; i < videoVisibilityButton.length; i++) {
              if (videoVisibilityButton[i].setupDone != true) {
                videoVisibilityButton[i].setupDone = true;
                videoVisibilityButton[i].addEventListener("click", async function() {
                    if (this.disabled) {
                      return;
                    }
                    
                    console.log(this.value)
                    let shouldPublicize = this.innerHTML == "Make Public";
                    let lastAcknowledge = parseInt(localStorage.getItem("visibility_warning_last_acknowledged"));
                    if ((!isNaN(lastAcknowledge) && (lastAcknowledge + 86400000 > new Date().valueOf())) || _util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() != _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner || !shouldPublicize) {
                        this.disabled = true;
                        
                        setPublicizeButtonState(this, shouldPublicize);
                        if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() != _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner && _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.global_moderator === true && !shouldPublicize) {
                          this.innerHTML = "Private";
                          this.classList.add("control-button-important-disabled");
                        }

                        let failedRequest = false;
                        let result = await _util_js__WEBPACK_IMPORTED_MODULE_10__.publicizeVideo(this.value, shouldPublicize);
                        if (!(result && result.data && result.data.status === true)) {
                          //request failed, set button back to pre-click state
                          setPublicizeButtonState(this, !shouldPublicize);
                          failedRequest = true;
                        }
                        if (_util_js__WEBPACK_IMPORTED_MODULE_10__.getUserID() == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner || failedRequest) {
                          this.disabled = false;
                          this.classList.remove("control-button-important-disabled");
                        }
                    }
                    else {
                        DisplayVisibilityWarning(this);
                    }
                });
              }
          }
      }
  }
  return mediaPresent;
}

function buildSearchResults(broadcasters) {
  let searchResultPane = document.getElementById('search-streams-results');
  if (searchResultPane) {
    searchResultPane.innerHTML = '<span class=\"offline-streams-title\">Search Results</span>';
    
    //build the sidebar
    for (let i = 0; i < broadcasters.length; i++) { //for every broadcaster
        let robots = broadcasters[i]['robots'];
        
        let userColor = "";
        if (broadcasters[i].highlighted) {
          userColor = " style=\"color:#FF0000;\" " + (broadcasters[i].highlighted_no_ui ? "class=\"username-strikethrough\" " : "");
        }

        var streamerHeader = "\
            <div class=\"stream" + (broadcasters[i].nsfw_broadcaster === true ? " nsfw-stream" : "") + "\" streamername=\"" + _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndAmpersandsAndQuotes(broadcasters[i].user_name) + "\" streamerid=\"" + _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndAmpersandsAndQuotes(broadcasters[i].user_id) + "\">\
            <div class=\"stream-top\" onclick=\"toggleStreamEntry(this, true)\" >\
             <span" + userColor + ">"+broadcasters[i].user_name+"</span>\
             <img class=\"stream-tags\" src=\"/images/tagicon.svg\" alt=\"tags\">\
             <img class=\"stream-top-arrow\" src=\"/images/streamarrow.svg\" alt=\"arrow\"/>\
            </div>\
            <div class=\"stream-bottom\">";

        //remove this display block to return spacing to normal
        streamerHeader += "<div class=\"stream-bottom-streamlist-online open\" style=\"display:block;\">";
        for (let i = 0; i < robots.length; i++) {
          let robotHref = "/robot/" + robots[i].robot_id;
          let robotName = _util_js__WEBPACK_IMPORTED_MODULE_10__.stripTagsAndQuotes(robots[i].robot_name);
          let robotViewers = robots[i].viewers ? robots[i].viewers : "&nbsp;";
          if (robots[i].status == "online") {
            streamerHeader += "<span class=\"stream-bottom-stream\"><a href=\""+robotHref+"\">"+robotName + "<span class=\"stream-bottom-viewers\">" + robotViewers + "</span></a></span>";
          }
          else {
            streamerHeader += "<span class=\"stream-bottom-stream\"><a class=\"search-offline\" href=\""+robotHref+"\">"+robotName+"</a></span>";
          }
        }//end for every online robot
        streamerHeader += "</div>"; //close the online robots div
        streamerHeader += "</div>"; //close the stream-bottom div
        streamerHeader += "</div>"; //close the stream div
        
        searchResultPane.insertAdjacentHTML('beforeend', streamerHeader);
    }//end for every broadcaster

    let nsfwPanes = document.getElementsByClassName("nsfw-stream");
    for (let i = 0; i < nsfwPanes.length; i++) {
      if (nsfwPanes[i].nsfwd || nsfwPanes[i].buttoned) {
        continue;
      }
      let newNsfw = document.createElement("span");
      newNsfw.innerText = "NSFW";
      newNsfw.className = "nsfw-label";
      newNsfw.title = "Not Safe For Work";
      nsfwPanes[i].appendChild(newNsfw);
      nsfwPanes[i].nsfwd = true;
      if (_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.global_moderator === true || _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.privileges?.previewer === true) {
        newNsfw.title += ". Click to open menu.";
        newNsfw.style.cursor = "pointer";
        newNsfw.addEventListener("click", function() {
          _chat_js__WEBPACK_IMPORTED_MODULE_0__.openChatUserOptions(nsfwPanes[i].getAttribute("streamername"), nsfwPanes[i].getAttribute("streamerid"));
        });
      }
    }

    if (_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.global_moderator === true || _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.privileges?.previewer === true) {
      let streamPanes = document.getElementsByClassName("stream");
      for (let i = 0; i < streamPanes.length; i++) {
        if (streamPanes[i].nsfwd || streamPanes[i].buttoned) {
          continue;
        }
        let paneMenuButton = document.createElement("img");
        paneMenuButton.src = "/images/more_options.svg";
        paneMenuButton.className = "sidebar-menu-button";
        paneMenuButton.title = "Click to open menu.";
        streamPanes[i].appendChild(paneMenuButton);
        streamPanes[i].buttoned = true;
        paneMenuButton.addEventListener("click", function() {
          _chat_js__WEBPACK_IMPORTED_MODULE_0__.openChatUserOptions(streamPanes[i].getAttribute("streamername"), streamPanes[i].getAttribute("streamerid"));
        });
      }
    }

    adjustTagPosition();
    applyTags(true);
  }
}

function applyTags(isSearch) {
  let streamTops = document.getElementsByClassName("stream-top");
  for (let i = 0; i < streamTops.length; i++) {
    if (streamTops[i].tagged) {
      continue;
    }
    streamTops[i].tagged = true;
    if (isSearch) {
      streamTops[i].parentElement.isSearchStreamDiv = true;
    }
    streamTops[i].addEventListener("click", function(e) {
      createTagBubble(this.parentElement, e, "click");
    });
  }
  
  let streamTags = document.getElementsByClassName("stream-tags");
  for (let i = 0; i < streamTags.length; i++) {
    streamTags[i].addEventListener("mouseover", function(e) {
      killTagBubblesFromHover(this);
      createTagBubble(this.parentElement.parentElement, e, "hover");
    });
    streamTags[i].addEventListener("mouseout", function(e) {
      killTagBubblesFromHover(this);
    });
  }
}

function createTagBubble(streamDiv, e, activatedBy) {
  if (streamDiv && streamDiv.classList.contains("stream")) {
    if (streamDiv.tagBubbleActive !== true) {
      let broadcasters = _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.robots;
      if (streamDiv.isSearchStreamDiv) {
        broadcasters = lastUserSearchResults;
      }
      let streamDivOwner = streamDiv.getAttribute("streamername");
      let bubbleStr = "";
      for (let i = 0; i < broadcasters.length; i++) {
        if (streamDivOwner == broadcasters[i].user_name) {
          for (let j = 0; j < broadcasters[i].tag_list.length; j++) {
            if (j >= 5) {
              //limit amount of text in bubble
              break;
            }
            bubbleStr += "#" + broadcasters[i].tag_list[j] + " ";
          }
          bubbleStr = bubbleStr.trimEnd();
          break;
        }
      }
      let streamDivPos = streamDiv.getBoundingClientRect();
      let tagBubble = document.createElement("span");
      tagBubble.birth = e.timeStamp;
      tagBubble.activatedBy = activatedBy;
      tagBubble.className = "tag-bubble";
      if (bubbleStr == "") {
        tagBubble.innerText = "No tags";
        tagBubble.style.fontStyle = "italic";
      }
      else {
        tagBubble.innerText = bubbleStr;
      }
      tagBubble.style.top = streamDivPos.top + "px";
      tagBubble.style.left = streamDivPos.right + "px";
      if (typeof window.visualViewport !== 'undefined') {
        tagBubble.style.maxWidth = String(window.visualViewport.width - streamDivPos.right) + "px";
      }
      streamDiv.appendChild(tagBubble);
      tagBubbleActive = true;
      streamDiv.tagBubbleActive = true;
    }
    else {
      let tagBubble = streamDiv.getElementsByClassName("tag-bubble")[0];
      if (tagBubble.activatedBy != "click") {
        tagBubble.birth = e.timeStamp;
        tagBubble.activatedBy = activatedBy;
      }
    }
  }
}

function killTagBubblesFromHover(tagIcon) {
  let tagBubbles = document.querySelectorAll(".tag-bubble");
  let tbsExist = tagBubbles.length;
  let tbsRemoved = 0;
  for (let i = 0; i < tagBubbles.length; i++) {
    if (tagBubbles[i].activatedBy != "hover" && (tagIcon && tagIcon.parentElement.parentElement === tagBubbles[i].parentElement)) {
      continue;
    }
    tagBubbles[i].parentElement.tagBubbleActive = false;
    tagBubbles[i].remove();
    tbsRemoved += 1;
  }
  if (tbsExist - tbsRemoved < 1) {
    tagBubbleActive = false;
  }
}

function adjustTagPosition(viewportChange, viewData) {
  if (tagBubbleActive) {
    let tagBubbles = document.querySelectorAll(".tag-bubble");
    if (viewportChange) {
      let streamList = document.getElementById("col-stream-list");
      if ((!(streamList.classList.contains("stream-list-open")) && viewData.width <= 1030) || (streamList.classList.contains("stream-list-desktop-closed") && viewData.width > 1030)) {
        for (let i = 0; i < tagBubbles.length; i++) {
          tagBubbles[i].parentElement.tagBubbleActive = false;
          tagBubbles[i].remove();
        }
        tagBubbleActive = false;
        return;
      }
    }
    
    for (let i = 0; i < tagBubbles.length; i++) {
      let streamDivPos = tagBubbles[i].parentElement.getBoundingClientRect();
      tagBubbles[i].style.top = streamDivPos.top + "px";
      tagBubbles[i].style.left = streamDivPos.right + "px";
      if (viewportChange) {
        tagBubbles[i].style.maxWidth = String(viewData.width - streamDivPos.right) + "px";
      }
    }
    if (tagBubbles.length < 1) {
      tagBubbleActive = false;
    }
  }
}

function setupAds() {
  let ads = false;
  for (let i = 0; i < _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.robots.length; i++) {
    if (_global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.robots[i].user_id == _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.owner) {
      ads = _global_js__WEBPACK_IMPORTED_MODULE_13__.pageLoadAPI.robots[i].ads;
      break;
    }
  }
  if (ads) {
    (function(d,z,s){s.src='//'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('osspalkiaom.com',4630057,document.createElement('script'))
  }
}



//start
rsAppMain();


//# sourceURL=webpack://rswebclient/./src/app.js?