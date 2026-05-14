__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   axiosGET: () => (/* binding */ axiosGET),
/* harmony export */   axiosPOST: () => (/* binding */ axiosPOST),
/* harmony export */   axiosPOST2: () => (/* binding */ axiosPOST2),
/* harmony export */   axiosPOSTForm: () => (/* binding */ axiosPOSTForm),
/* harmony export */   axiosPOSTWithRetry: () => (/* binding */ axiosPOSTWithRetry),
/* harmony export */   blockingTimer: () => (/* binding */ blockingTimer),
/* harmony export */   cancelSubscription: () => (/* binding */ cancelSubscription),
/* harmony export */   capitalizeFirst: () => (/* binding */ capitalizeFirst),
/* harmony export */   deleteFile: () => (/* binding */ deleteFile),
/* harmony export */   deleteVideo: () => (/* binding */ deleteVideo),
/* harmony export */   dislikeUser: () => (/* binding */ dislikeUser),
/* harmony export */   element: () => (/* binding */ element),
/* harmony export */   englishToBool: () => (/* binding */ englishToBool),
/* harmony export */   extractRobotInfo: () => (/* binding */ extractRobotInfo),
/* harmony export */   followModify: () => (/* binding */ followModify),
/* harmony export */   followModifyButtonStates: () => (/* binding */ followModifyButtonStates),
/* harmony export */   getAPIprefix: () => (/* binding */ getAPIprefix),
/* harmony export */   getEndpoint: () => (/* binding */ getEndpoint),
/* harmony export */   getGreatestUnitElapsedStr: () => (/* binding */ getGreatestUnitElapsedStr),
/* harmony export */   getHeader: () => (/* binding */ getHeader),
/* harmony export */   getLocalizedDateTimeStr: () => (/* binding */ getLocalizedDateTimeStr),
/* harmony export */   getPrivateSelf: () => (/* binding */ getPrivateSelf),
/* harmony export */   getProtocol: () => (/* binding */ getProtocol),
/* harmony export */   getRandomEndpoint: () => (/* binding */ getRandomEndpoint),
/* harmony export */   getService: () => (/* binding */ getService),
/* harmony export */   getTimeElapsedStr: () => (/* binding */ getTimeElapsedStr),
/* harmony export */   getUserID: () => (/* binding */ getUserID),
/* harmony export */   getUserName: () => (/* binding */ getUserName),
/* harmony export */   isSubscribed: () => (/* binding */ isSubscribed),
/* harmony export */   isUserLoggedIn: () => (/* binding */ isUserLoggedIn),
/* harmony export */   makeNSFWWarningBox: () => (/* binding */ makeNSFWWarningBox),
/* harmony export */   muteState: () => (/* binding */ muteState),
/* harmony export */   performClip: () => (/* binding */ performClip),
/* harmony export */   printToChat: () => (/* binding */ printToChat),
/* harmony export */   publicizeVideo: () => (/* binding */ publicizeVideo),
/* harmony export */   redirectNonBroadcaster: () => (/* binding */ redirectNonBroadcaster),
/* harmony export */   resetFunbitGoal: () => (/* binding */ resetFunbitGoal),
/* harmony export */   restoreAmpersands: () => (/* binding */ restoreAmpersands),
/* harmony export */   restoreHtmlTags: () => (/* binding */ restoreHtmlTags),
/* harmony export */   restoreQuotes: () => (/* binding */ restoreQuotes),
/* harmony export */   restoreTagsAndQuotes: () => (/* binding */ restoreTagsAndQuotes),
/* harmony export */   sendNotification: () => (/* binding */ sendNotification),
/* harmony export */   sendTokenToAudioRelay: () => (/* binding */ sendTokenToAudioRelay),
/* harmony export */   sendTokenToVideoRelay: () => (/* binding */ sendTokenToVideoRelay),
/* harmony export */   setupMuteButtons: () => (/* binding */ setupMuteButtons),
/* harmony export */   setupVolume: () => (/* binding */ setupVolume),
/* harmony export */   stripAmpersands: () => (/* binding */ stripAmpersands),
/* harmony export */   stripHtmlTags: () => (/* binding */ stripHtmlTags),
/* harmony export */   stripQuotes: () => (/* binding */ stripQuotes),
/* harmony export */   stripTagsAndAmpersands: () => (/* binding */ stripTagsAndAmpersands),
/* harmony export */   stripTagsAndAmpersandsAndQuotes: () => (/* binding */ stripTagsAndAmpersandsAndQuotes),
/* harmony export */   stripTagsAndQuotes: () => (/* binding */ stripTagsAndQuotes),
/* harmony export */   volumeChangeListener: () => (/* binding */ volumeChangeListener)
/* harmony export */ });
/* harmony import */ var _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/axios.js */ "./src/lib/axios.js");
/* harmony import */ var _lib_axios_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_axios_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chat.js */ "./src/chat.js");





var lastClipTime = 0;
let volBeforeMute = false;

function element(id) {
    return document.getElementById(id);
}


function axiosGET(url) {
    return new Promise(resolve => {
    _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__.get(url).then(function (response) {
        resolve(response);
    }).catch(function (error) {
        console.error("axios GET call error", error);
    })})}


function axiosPOST(url, data) {
    return new Promise(resolve => {
    _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__.post(url, data).then(function (response) {
        resolve(response);
    }).catch(function (error) {
        console.error("axios POST call error", error);
    })})}


function axiosPOST2(url, data) {
    return new Promise(resolve => {
    _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__.post(url, data).then(function (response) {
        resolve(response);
    }).catch(function (error) {
        console.error("axios POST call error", error);
        resolve(undefined);
    })})}


async function axiosPOSTWithRetry(url, data) {
  let completed = false;
  let tries = 0;
  while (tries < 100) {
    let result = await axiosPOST2(url, data);
    tries++;
    if (result !== undefined) {
      return result;
    }
    await blockingTimer(1000);
  }
  return undefined;
}


function axiosPOSTForm(url, data) {
  let form = new FormData();
  for (let [formKey, formValue] of Object.entries(data)) {
    form.append(formKey, formValue);
  }
  return new Promise(resolve => {
  _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__.post(url, form).then(function (response) {
      resolve(response);
  }).catch(function (error) {
      console.error("axios POSTForm call error", error);
      resolve(undefined);
  })})}


function getEndpoint(category, identifier) {
    return new Promise(async function (resolve) {
        let urlPrefix = getAPIprefix();
        let url = urlPrefix + '/v1/get_endpoint/' +
                  category + '/' + identifier
        console.log("endpoint url", url);
        let response = await axiosGET(url);

        if (response.data === null) {
            console.error("ERROR: there is no data " +
                        "available, so cannot get endpoint", url);
            resolve(null);
        } else {
            resolve(response.data);
        }
    });

}

function getService(category) {
    return new Promise(async function (resolve) {
        let urlPrefix = getAPIprefix();
        let url = urlPrefix + '/v1/get_service/'+category;
        //console.log("service url", url);
        let response = await axiosGET(url);

        if (response.data === null) {
            console.error("ERROR: there is no data " +
                        "available, so cannot get service", url);
            resolve(null);
        } else {
            resolve(response.data);
        }
    });

}


function getRandomEndpoint(category, identifier) {
    return new Promise(async function (resolve) {
        let urlPrefix = getAPIprefix();
        let url = urlPrefix + '/v1/get_random_endpoint/' +
                  category + '/' + identifier
        console.log("endpoint url", url);
        let response = await axiosGET(url);

        if (response.data === null) {
        console.error("ERROR: there is no data " +
                        "available, so cannot get random endpoint", url);
        resolve(null);
        } else {
            resolve(response.data);
        }
    });
}


function getProtocol(type = 'http') {

    let protocol = location.protocol;
    if (type == 'websocket'){
        if (protocol == 'https:'){return 'wss:';}
        else{return 'ws:';}
    }
    else{
        return protocol; 
    }
}


function getAPIprefix() {

    let apiProtocol = getProtocol(); 
    let apiPort = _config_js__WEBPACK_IMPORTED_MODULE_1__.api_port; //default
    if (apiProtocol == 'https:'){apiPort = _config_js__WEBPACK_IMPORTED_MODULE_1__.api_tls_port;}

    let urlPrefix = apiProtocol+'//'+_config_js__WEBPACK_IMPORTED_MODULE_1__.api_host+':'+apiPort;
    //console.log("API PREFIX:", urlPrefix);
    return urlPrefix;

}


//get private information on self using token
//GetUserPrivate
async function getPrivateSelf() {

    let urlPrefix = getAPIprefix();
    //api call not pushed yet
    if(window.localStorage.getItem("robotstreamer_token") && 
       window.localStorage.getItem("robotstreamer_token").length > 1){

        let token = window.localStorage.getItem("robotstreamer_token");
        let url = urlPrefix + '/v1/get_user_private';
        let sendData = {token: token}
        let result = await axiosPOST(url, sendData);
        //console.warn("getPrivateSelf: ", result.data);
        //todo make a localstore handling fn
        return result.data
    }else{
        console.error("getPrivateSelf: not logged in");
    }

}


function getHeader(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}


function isUserLoggedIn(){

    if( window.localStorage.getItem("robotstreamer_token") && 
        window.localStorage.getItem("robotstreamer_token").length > 1){
        return true;
    }
    else{
        return false;
    }
}

function getUserName(){

    if( isUserLoggedIn() &&
        window.localStorage.getItem("robotstreamer_username") && 
        window.localStorage.getItem("robotstreamer_username").length > 1){
        return window.localStorage.getItem("robotstreamer_username");
    }else{
        return false
    }
}

function getUserID(){

    if( isUserLoggedIn() &&
        window.localStorage.getItem("robotstreamer_user_id") && 
        window.localStorage.getItem("robotstreamer_user_id").length > 1){
        return window.localStorage.getItem("robotstreamer_user_id");
    }else{
        return false
    }
}

function capitalizeFirst(string = ''){

    return string.charAt(0).toUpperCase() + string.slice(1);
}

function makeNSFWWarningBox() {

    // if this is not an nsfw stream, skip the message
    // need to make this work
    //if (!global.pageLoadAPI.nsfw_broadcaster)
    // return;

    var API = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI
    var first_sfw_robotid = false

    for (var i = API.robots.length - 1; i >= 0; i--) {
        //every user
        for (var index = 0; index < API.robots[i].robots.length; ++index) {
            //every robot

            if (!first_sfw_robotid && API.robots[i].nsfw_broadcaster == false && API.robots[i].robots[index].status == 'online'){
                first_sfw_robotid = API.robots[i].robots[index].robot_id 
                console.log("found first online safe broadcaster:", first_sfw_robotid)
            }
        }
    }

    
    let body = document.getElementsByTagName("BODY")[0];
    let nsfwMessage = document.createElement("DIV");
    let nsfwPicture = document.createElement("IMG");
    let nsfwTitle = document.createElement("DIV");
    let buttonContainer = document.createElement("DIV");
    let over18 = document.createElement("DIV");
    let under18 = document.createElement("DIV");
    let nsfwText = document.createElement("P");
    nsfwMessage.id = "nsfw-window";
    nsfwPicture.src="/images/emotes/pNSFW.png";
    nsfwPicture.id = "nsfw-picture";
    nsfwTitle.innerText = "This stream is NSFW"
    nsfwTitle.style.textAlign="center";
    nsfwTitle.style.fontSize="1.2em";
    nsfwTitle.style.fontWeight="bold";
    nsfwTitle.style.marginBottom="20px";
    buttonContainer.style.textAlign="center";
    nsfwText.id = "nsfw-agreement";
    nsfwText.innerText = "This stream may contain information, links, images and videos of sexually explicit material (collectively, the “Sexually Explicit Material”). Do NOT continue if: (i) you are not at least 18 years of age or the age of majority in each and every jurisdiction in which you will or may view the Sexually Explicit Material, whichever is higher (the “Age of Majority”), (ii) such material offends you, or (iii) viewing the Sexually Explicit Material is not legal in each and every community where you choose to view it. By choosing to enter this stream you are affirming under oath and penalties of perjury pursuant to Title 28 U.S.C. § 1746 and other applicable statutes and laws that all of the following statements are true and correct: I have attained the Age of Majority in my jurisdiction; The sexually explicit material I am viewing is for my own personal use and I will not expose any minors to the material; I desire to receive/view sexually explicit material; I believe that as an adult it is my inalienable constitutional right to receive/view sexually explicit material; I believe that sexual acts between consenting adults are neither offensive nor obscene; The viewing, reading and downloading of sexually explicit materials does not violate the standards of any community, town, city, state or country where I will be viewing, reading and/or downloading the Sexually Explicit Materials; I am solely responsible for any false disclosures or legal ramifications of viewing, reading or downloading any material appearing on this site. I further agree that neither this stream nor its affiliates will be held responsible for any legal ramifications arising from any fraudulent entry into or use of this stream; I understand that my use of this stream is governed by the stream’s Terms which I have reviewed and accepted, and I agree to be bound by such Terms. I agree that by entering this stream, I am subjecting myself, and any business entity in which I have any legal or equitable interest, to the personal jurisdiction of the State of Florida, Miami-Dade County, should any dispute arise at any time between this stream, myself and/or such business entity; This warning page constitutes a legally binding agreement between me, this stream and/or any business in which I have any legal or equitable interest. If any provision of this Agreement is found to be unenforceable, the remainder shall be enforced as fully as possible and the unenforceable provision shall be deemed modified to the limited extent required to permit its enforcement in a manner most closely representing the intentions as expressed herein; All performers on this site are over the age of 18, have consented being photographed and/or filmed, believe it is their right to engage in consensual sexual acts for the entertainment and education of other adults and I believe it is my right as an adult to watch them doing what adults do; The videos and images in this site are intended to be used by responsible adults as sexual aids, to provide sexual education and to provide sexual entertainment; I understand that providing a false declaration under the penalties of perjury is a criminal offense; and I agree that this agreement is governed by the Electronic Signatures in Global and National Commerce Act (commonly known as the “E-Sign Act”), 15 U.S.C. § 7000, et seq., and by choosing to click on “I am over 18 and agree to conditions” and indicating my agreement to be bound by the terms of this agreement, I affirmatively adopt the signature line below as my signature and the manifestation of my consent to be bound by the terms of this agreement.";
    over18.innerHTML = 'I am over 18 and agree to conditions';
    under18.innerHTML = 'I am not in agreement, take me to a safe stream';
    over18.classList.add("nsfw-button");
    over18.id = "nsfw-button-accept";
    under18.id = "nsfw-button-decline";
    under18.classList.add("nsfw-button");
    body.appendChild(nsfwMessage);
    nsfwMessage.appendChild(nsfwPicture);
    nsfwMessage.appendChild(nsfwTitle);
    nsfwMessage.appendChild(nsfwText);
    nsfwMessage.appendChild(buttonContainer);
    buttonContainer.appendChild(under18);
    buttonContainer.appendChild(over18);

    over18.onclick = function(){
        nsfwMessage.style.display = "none";
        window.localStorage.setItem('nsfw_content_ok', "true");
        window.location.reload(true);
    };

    under18.onclick = function(){
        //document.location.href = "http://google.com";
        document.location.href = "https://"+_config_js__WEBPACK_IMPORTED_MODULE_1__.domain+"/robot/"+first_sfw_robotid;
    };

    
}


async function followModify(follow_id, fAction, eAction, pAction){     

    let urlPrefix = getAPIprefix();

    if(isUserLoggedIn()){

        let token = window.localStorage.getItem("robotstreamer_token");
        let url = urlPrefix + '/v1/modify_follow_streamer';
        let sendData = {token: token,
                        follow_user_id: follow_id,
                        action_follow : fAction,
                        action_email : eAction,
                        action_push : pAction}
        console.log('followModify sendData:', sendData);  

        let result = await axiosPOST(url, sendData);
        console.log("followModify: ", result.data);
        if (result.data.status){
            return sendData  
        }
        else{
            console.log("followModify API error: ", result.data);
        }
        
    }else{
        console.error("followModify: not logged in");
        openModal(1);

    }

}


async function followModifyButtonStates(followState, emailState, pushState){

    var followButton = document.getElementById('follow_button');
    var followButtonEmail = document.getElementById('follow_button_email');
    var followButtonPush = document.getElementById('follow_button_push');

    if (!followState){
        followButton.className = "follow-button-disable"
        followButton.innerHTML = "Follow"
    }else{
        followButton.className = "follow-button"
        followButton.innerHTML = "Following"
    }

    if (!emailState){
        followButtonEmail.className = "follow-button-disable"
    }else{
        followButtonEmail.className = "follow-button"
    }

    if (!pushState){
        followButtonPush.className = "follow-button-disable"
    }else{
        followButtonPush.className = "follow-button"
    }

}



async function sendNotification(robotId, manual = true){

    let urlPrefix = getAPIprefix();

    if(isUserLoggedIn()){

        let token = window.localStorage.getItem("robotstreamer_token");
        let url = urlPrefix + '/v1/manual_send_notification';
        let sendData = {token: token,
                        robot_id: robotId,
                        manual: manual}

        console.log('sendNotification sendData:', sendData);  

        let result = await axiosPOST(url, sendData);
        console.log("sendNotification: ", result.data);
        if (result.data.status){
            if (manual) {
              if (result.data.status == true){
                  window.alert("Notifications sent");
              }
              else{
                  window.alert(result.data.status);
              }
            }
        }
        else{
            console.log("sendNotification API error: ", result.data);
        }
        
    }else{
        console.error("sendNotification: not logged in");
    }

    
}



async function resetFunbitGoal(){

    let urlPrefix = getAPIprefix();

    if(isUserLoggedIn()){

        let token = window.localStorage.getItem("robotstreamer_token");
        let url = urlPrefix + '/v1/set_goal_funbits';
        let sendData = {token: token,
                        value: 0.0}

        console.log('resetFunbitGoal sendData:', sendData);  

        let result = await axiosPOST(url, sendData);
        console.log("resetFunbitGoal result: ", result.data);
        if (result.data.status){
            if (result.data.status == false){
                console.log("resetFunbitGoal API error: ", result.data);
            }
        }

    }else{
        console.error("resetFunbitGoal: not logged in");
    }

}



async function deleteVideo(fileName){

    let urlPrefix = getAPIprefix();
    let token = window.localStorage.getItem("robotstreamer_token");
    let url = urlPrefix + '/storage/delete_file_owner';
    let sendData = {token: token,
                    file_name: fileName}

    let result = await axiosPOST(url, sendData);
    console.log("deleteVideo result: ", result.data);

}


async function deleteFile(fileName){

  let urlPrefix = getAPIprefix();
  let token = window.localStorage.getItem("robotstreamer_token");
  let url = urlPrefix + '/storage/delete_file_owner';
  let sendData = {token: token,
                  file_name: fileName}

  let result = await axiosPOST2(url, sendData);
  console.log("deleteVideo result: ", (result ? result.data : "Error"));
  return result;
}


async function publicizeVideo(fileName, publicizeState){
  let urlPrefix = getAPIprefix();
  let token = window.localStorage.getItem("robotstreamer_token");
  let url = urlPrefix + '/storage/publicize_file';
  let sendData = {token: token,
                  file_name: fileName,
                  publicize: publicizeState}

  let result = await axiosPOST2(url, sendData);
  console.log("publicizeVideo result: ", (result ? result.data : "Error"));
  return result;
}


function extractRobotInfo(apiPageLoad, robotId) {

    var r = {}

    r.id = robotId;
    r.hasPip = apiPageLoad.pip || false;
    r.description = apiPageLoad.description;
    r.name = undefined;
    r.ownerName = undefined;
    r.lastOnline = apiPageLoad.last_online;
    r.lastStartup = apiPageLoad.last_startup;

    // sift out useful information from the pageload call
    for (var i = apiPageLoad.robots.length - 1; i >= 0; i--) {
        //every user
    
        if (apiPageLoad.robots[i].user_id == apiPageLoad.owner){
            // get broadcaster info
            r.nsfw = apiPageLoad.robots[i].nsfw_broadcaster;
            r.ownerName = apiPageLoad.robots[i].user_name;
            r.ownerId = apiPageLoad.owner;
            r.ownerFollowers = apiPageLoad.followers || 0;
        }

        for (var index = 0; index < apiPageLoad.robots[i].robots.length; ++index) {

            if (apiPageLoad.robots[i].robots[index].robot_id == robotId){
                // get robot info
                r.name = stripTagsAndQuotes(apiPageLoad.robots[i].robots[index].robot_name);
                r.status = apiPageLoad.robots[i].robots[index].status;
                r.viewers = apiPageLoad.robots[i].robots[index].viewers || 0;
                r.videoType = apiPageLoad.robots[i].robots[index].video_type || "jsmpeg";
                if (r.videoType !== "jsmpeg"){
                    r.cameraId = robotId;
                }
                r.cameraId = apiPageLoad.robots[i].robots[index].camera_id;
            }
        }
    }

    if (r.name === undefined) {
      if (apiPageLoad.title_data !== undefined && apiPageLoad.title_data['robot_name'] !== undefined) {
        r.name = stripTagsAndQuotes(apiPageLoad.title_data['robot_name']);
      }
      else {
        r.name = "Room | " + robotId;
      }
    }
    if (r.ownerName === undefined) {
      if (apiPageLoad.title_data !== undefined && apiPageLoad.title_data['owner_name'] !== undefined) {
        r.ownerName = apiPageLoad.title_data['owner_name'];
      }
      else {
        r.ownerName = "";
      }
    }

    return r;
}

async function performClip(robotId) {
  let urlPrefix = getAPIprefix();
  if (isUserLoggedIn()) {
    //20 seconds between each clip
    if (lastClipTime + 20000 < new Date().valueOf()) {
      let token = window.localStorage.getItem("robotstreamer_token");
      let url = urlPrefix + '/v1/request_clip_create';
      let time = new Date()
      let sendData = {token: token,
                      robot_id: robotId}

      let result = await axiosPOST(url, sendData);
      console.log("performClip result: ", result.data);
      if (result.data.status === true) {
        lastClipTime = new Date().valueOf();
        var jsonfeign = {
            "message": "Clip successfully queued.", 
            "username": "[RS BOT]", 
            "color": "fff", 
            "tts": false}

        _chat_js__WEBPACK_IMPORTED_MODULE_3__.onMessageReceived(jsonfeign, false);
        _chat_js__WEBPACK_IMPORTED_MODULE_3__.expScrollChat();
      }
      else if (result.data.status === 'err 7') {
        lastClipTime = new Date().valueOf();
        var jsonfeign = {
            "message": "This streamer has disabled clips.", 
            "username": "[RS BOT]", 
            "color": "fff", 
            "tts": false}

        _chat_js__WEBPACK_IMPORTED_MODULE_3__.onMessageReceived(jsonfeign, false);
        _chat_js__WEBPACK_IMPORTED_MODULE_3__.expScrollChat();
      }
    }
  }
  else {
    console.log("performClip: not logged in");
  }
}

async function dislikeUser(state) {
  let urlPrefix = getAPIprefix();
  if (isUserLoggedIn()) {
    let token = window.localStorage.getItem("robotstreamer_token");
    let url = urlPrefix + '/v1/dislike_user';
    let sendData = {token: token,
                    target_user_id: _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.owner,
                    disliking: state}
    let result = await axiosPOST(url, sendData);
    let dislikeButton = document.getElementById("dislike_button");
    if (dislikeButton && result.data.status === true) {
      dislikeButton.value = !dislikeButton.value;
      if (dislikeButton.value) {
        dislikeButton.className = "dislike-button"
      }
      else {
        dislikeButton.className = "dislike-button-disable"
      }
    }
    console.log("dislikeStream result: ", result.data);
  }
  else {
    console.log("dislikeStream: not logged in");
  }
}

function isSubscribed(userid, subList) {
  for (let i = 0; i < subList.length; i++) {
    if (userid == subList[i]) {
      return true;
    }
  }
  return false;
}

async function cancelSubscription(robotId) {
  let urlPrefix = getAPIprefix();
  let token = window.localStorage.getItem("robotstreamer_token");
  let url = urlPrefix + '/v1/cancel_user_subscription';
  let sendData = {token: token,
                  target_user_id: robotId};
  let result = await axiosPOST(url, sendData);
  return result.data && result.data.status == true;
}

function setupMuteButtons(volFunc) {
  let volMutes = document.getElementsByClassName('volume-mute');
  for (let mIndex = 0; mIndex < volMutes.length; mIndex++) {
    let volMute = volMutes[mIndex];
    volMute.addEventListener('click', function() {
      console.log("mute toggle", volBeforeMute); 

      let volSliders = document.getElementsByClassName("rs-volume-slider");
      if (volBeforeMute == false) {
          volBeforeMute = volFunc();
          volFunc(0);
          for (let i = 0; i < volSliders.length; i++) {
            volSliders[i].value = 0;
          }
      }
      else {
          volFunc(volBeforeMute);
          for (let i = 0; i < volSliders.length; i++) {
            volSliders[i].value = volBeforeMute * 400;
          }
          volBeforeMute = false;
      }
    });
  }
}

function muteState(state) {
  if (state !== undefined) {
    volBeforeMute = state;
  }
  return volBeforeMute;
}

function setupVolume(volEnt, volFunc) {
  if (localStorage.getItem("vid_volume")) {
      console.log("loading saved volume from localStorage")
      let volumeConstraints = localStorage.getItem("vid_volume") / 4;
      if (volumeConstraints > 1) {
        volumeConstraints = 1;
      }
      else if (volumeConstraints < 0) {
        volumeConstraints = 0;
      }
      volFunc(volumeConstraints); 
      volEnt.value = volumeConstraints * 400;
  }
}

function volumeChangeListener(volEnt, volFunc) {
  let volumeConstraints = volEnt.value / 400;
  if (volumeConstraints > 1) {
    volumeConstraints = 1;
  }
  else if (volumeConstraints < 0) {
    volumeConstraints = 0;
  }
  volFunc(volumeConstraints);
  let volSliders = document.getElementsByClassName("rs-volume-slider");
  for (let i = 0; i < volSliders.length; i++) {
    if (volEnt.id == volSliders[i].id) {
      continue;
    }
    volSliders[i].value = volumeConstraints * 400;
  }
  localStorage.setItem("vid_volume", volumeConstraints * 4);
  muteState(false);
}

function getTimeElapsedStr(lastDate) {
  if (lastDate === undefined || lastDate === null) {
    return "0:00:00";
  }
  let nowTime = new Date();
  let elapsedSeconds = Math.floor((nowTime - lastDate) / 1000);
  let hours = Math.floor(elapsedSeconds / 3600);
  elapsedSeconds = elapsedSeconds - (hours * 3600);
  let minutes = Math.floor(elapsedSeconds / 60);
  elapsedSeconds = elapsedSeconds - (minutes * 60);
  let seconds = elapsedSeconds;
  return hours + ":" + intToDoubleDigitStr(minutes) + ":" + intToDoubleDigitStr(seconds);
}

function getGreatestUnitElapsedStr(lastDate) {
  if (lastDate === undefined || lastDate === null) {
    return "Last online unknown.";
  }
  if (lastDate.getFullYear() <= 0) {
    return "Last online never.";
  }
  let nowTime = new Date();
  let elapsedSeconds = Math.floor((nowTime - lastDate) / 1000);
  let days = Math.floor(elapsedSeconds / 86400);
  if (days > 0) {
    let plural = days == 1 ? "" : "s";
    return "Last online " + days + " day" + plural + " ago.";
  }
  let hours = Math.floor(elapsedSeconds / 3600);
  if (hours > 0) {
    let plural = hours == 1 ? "" : "s";
    return "Last online " + hours + " hour" + plural + " ago.";
  }
  let minutes = Math.floor(elapsedSeconds / 60);
  if (minutes > 0) {
    let plural = minutes == 1 ? "" : "s";
    return "Last online " + minutes + " minute" + plural + " ago.";
  }
  let plural = elapsedSeconds == 1 ? "" : "s";
  return "Last online " + elapsedSeconds + " second" + plural + " ago.";
}

function getLocalizedDateTimeStr(theDate) {
  if (theDate === undefined || theDate === null) {
    return "";
  }
  if (typeof theDate == "string") {
    theDate = new Date(theDate);
  }
  if (theDate.getFullYear() <= 0) {
    return "";
  }
  return theDate.toLocaleDateString(undefined, {month: 'short'}) + ' ' + theDate.getDate() + ', ' + theDate.getFullYear() + ' ' + theDate.toLocaleTimeString();
}

function intToDoubleDigitStr(num) {
  let numStr = num.toString();
  if (numStr.length == 1) {
    numStr = "0" + numStr;
  }
  return numStr;
}

function redirectNonBroadcaster() {
  if (window.location.href.includes("robot/")) {
    let splitURL = window.location.href.split("/");
    if (splitURL[3] === "robot") {
      // use robot id from url
      let robotId = splitURL[4].replace(/(?:)#\w*/gi,"");
      window.location.href = 'https://' + _config_js__WEBPACK_IMPORTED_MODULE_1__.domain + '/robot/' + robotId;
    }
  }
}

async function blockingTimer(timeMs) {
  return new Promise((resolve) => {
    setTimeout(function() {
      resolve();
    }, timeMs);
  });
}

function englishToBool(phrase) {
  if (phrase == "1" || phrase == "true" || phrase == "on") {
    return true;
  }
  if (phrase == "0" || phrase == "false" || phrase == "off") {
    return false;
  }
  return false;
}

function stripHtmlTags(text) {
  return new String(text).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function restoreHtmlTags(text) {
  return new String(text).replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

function stripAmpersands(text) {
  return new String(text).replaceAll("&", "&amp;");
}

function restoreAmpersands(text) {
  return new String(text).replaceAll("&amp;", "&");
}

function stripQuotes(text) {
  return new String(text).replaceAll("\"", "&#34;").replaceAll("\'", "&#39;");
}

function restoreQuotes(text) {
  return new String(text).replaceAll("&#34;", "\"").replaceAll("&#39;", "\'");
}

function stripTagsAndQuotes(text) {
  text = stripHtmlTags(text);
  text = stripQuotes(text);
  return text;
}

function stripTagsAndAmpersands(text) {
  text = stripHtmlTags(text);
  text = stripAmpersands(text);
  return text;
}

function stripTagsAndAmpersandsAndQuotes(text) {
  text = stripHtmlTags(text);
  text = stripAmpersands(text);
  text = stripQuotes(text);
  return text;
}

function restoreTagsAndQuotes(text) {
  text = restoreHtmlTags(text);
  text = restoreQuotes(text);
  return text;
}

function printToChat(msg, userName = "[RS BOT]", color = "fff", tts = false) {
  let jsonfeign = {
    "message": msg, 
    "username": userName, 
    "color": color, 
    "tts": tts}
  _chat_js__WEBPACK_IMPORTED_MODULE_3__.onMessageReceived(jsonfeign, false);
  _chat_js__WEBPACK_IMPORTED_MODULE_3__.expScrollChat();
}


function sendTokenToRelay(source, label) {
    // note: waits a fixed delay for socket to be ready, which may or may not be needed
    setTimeout(() => {
        if (source.socket.readyState === WebSocket.OPEN) {
            console.log(label, "send message to relay, websocket ready state is open");
        } else {
            console.log(label, "send message to relay, error: websocket ready state is not open");
        }
        //console.log('connection established');
        let token = window.localStorage.getItem("robotstreamer_token");
        //source.socket.send(JSON.stringify({ type: 'auth', token: token }));
        try {
            source.socket.send(JSON.stringify({ type: 'auth', token: token }));
        } catch (error) {
            console.error(label, "send message to relay, webSocket send error:", error);
        }
    }, 500)
}


function sendTokenToAudioRelay(source) {
    sendTokenToRelay(source, 'audio')
}


function sendTokenToVideoRelay(source) {
    sendTokenToRelay(source, 'video')
}




//# sourceURL=webpack://rswebclient/./src/util.js?