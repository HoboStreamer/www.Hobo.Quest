__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   followInit: () => (/* binding */ followInit)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_2__);




// follow button logic

async function followInit(){

    console.log("followInit()");
    var API = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI;
    // keep disabled until load
    document.getElementsByClassName('follow-button-container')[0].style.display = "flex";

    var followButton = document.getElementById('follow_button');
    var followButtonEmail = document.getElementById('follow_button_email');
    var followButtonPush = document.getElementById('follow_button_push');

    //defaults
    followButton.value = false;
    followButtonEmail.value = false;
    followButtonPush.value = false;

    // get bool states of follow types
    followButton.value = API.follow_list.follow.includes(API.owner) || false;
    followButtonEmail.value = API.follow_list.follow_email.includes(API.owner) || false;
    followButtonPush.value = API.follow_list.follow_push.includes(API.owner) || false;

    _util_js__WEBPACK_IMPORTED_MODULE_0__.followModifyButtonStates(
                                followButton.value, 
                                followButtonEmail.value, 
                                followButtonPush.value);


    //follow toggle - enable all, on unfollow nerf all types
    followButton.addEventListener("click", followButtonToggle);
    async function followButtonToggle(){
        let followCountDisplay = document.getElementById('stream_followers');
        let followCount = parseInt(followCountDisplay.innerHTML);
        if(isNaN(followCount)) {
          followCount = 0;
        }

        if (followButton.value){
            let followResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.followModify(API.owner, false, false, false); 
            followButton.value = false;
            followButtonEmail.value = false;
            followButtonPush.value = false;              
            
            //decrease follower count
            followCount = followCount - 1;
            if (followCount < 0) {
              followCount = 0;
            }
            followCountDisplay.innerHTML = followCount.toString();
        }
        else{
            let followResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.followModify(API.owner, true, true, true); 
            followButton.value = true;
            followButtonEmail.value = true;
            followButtonPush.value = true;
            
            //increase follower count
            followCount = followCount + 1;
            followCountDisplay.innerHTML = followCount.toString();
        }

        _util_js__WEBPACK_IMPORTED_MODULE_0__.followModifyButtonStates(
                                    followButton.value, 
                                    followButtonEmail.value, 
                                    followButtonPush.value);

        //verified reminder
        if (!API.verified_email && followButton.value){
            //non blocking for visual fb
            setTimeout(function() { alert("A verified email is required to receive notifications"); }, 1);
        }        
    }


    followButtonEmail.addEventListener("click", followButtonEmailToggle);
    async function followButtonEmailToggle(){

        if(followButton.value){ //only if following
            followButtonEmail.value = !followButtonEmail.value; //invert only email

            let followResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.followModify(API.owner, followButton.value,
                                                                  followButtonEmail.value,
                                                                  followButtonPush.value); 
            _util_js__WEBPACK_IMPORTED_MODULE_0__.followModifyButtonStates(
                                        followButton.value, 
                                        followButtonEmail.value, 
                                        followButtonPush.value);
        }
    }


    followButtonPush.addEventListener("click", followButtonPushToggle);
    async function followButtonPushToggle(){

        if(followButton.value){ //only if following
            followButtonPush.value = !followButtonPush.value; //invert only push

            let followResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.followModify(API.owner, followButton.value,
                                                                  followButtonEmail.value,
                                                                  followButtonPush.value); 
            _util_js__WEBPACK_IMPORTED_MODULE_0__.followModifyButtonStates(
                                        followButton.value, 
                                        followButtonEmail.value, 
                                        followButtonPush.value);
        }
    }

    

}



//# sourceURL=webpack://rswebclient/./src/follow.js?