__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   controlSockets: () => (/* binding */ controlSockets),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   sendCommand: () => (/* binding */ sendCommand),
/* harmony export */   stopAllSounds: () => (/* binding */ stopAllSounds)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chat.js */ "./src/chat.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_3__);






var controlSockets = {}

var controlSocketsWS = {}
let soundList = {};

var premiumCommandCount = 0

function handleControlMessage(event) {
    
    let j = JSON.parse(event.data);
    console.log("received control message:", j);

    // ignore pings
    if(j.type == 'RS_PING'){
        console.log("control ping recv");
        return;
    }


    if ("control_messages_to_chat" in _config_js__WEBPACK_IMPORTED_MODULE_2__ && _config_js__WEBPACK_IMPORTED_MODULE_2__.control_messages_to_chat){


        // relay type message
        if(j.type == 'message'){

            var jsonfeign = {
                "message": j.message, 
                "username": "Control Server", 
                "color": "fff", 
                "tts": false};

            _chat_js__WEBPACK_IMPORTED_MODULE_1__.onMessageReceived(jsonfeign, false)
            _chat_js__WEBPACK_IMPORTED_MODULE_1__.expScrollChat();
            return;
        }

    }


    if (j.sound_filename) {
        let elapsedSeconds = Infinity;
        if (window.lastSoundPlayTime) {
            elapsedSeconds = ((new Date()).getTime() - window.lastSoundPlayTime.getTime()) / 1000;
        }
        let coolTime = parseInt(document.getElementById("allowSounds").value);
        if (document.getElementById("allowSounds").value !== "false" && elapsedSeconds > coolTime) {
            window.lastSoundPlayTime = new Date();
            let soundId = crypto.randomUUID();
            let buttonSound = new Audio(_config_js__WEBPACK_IMPORTED_MODULE_2__.b2Prefix + j.sound_filename);
            buttonSound.volume = document.getElementById("volume-slider-sounds").value / 1000;
            buttonSound.play();
            buttonSound.addEventListener("ended", function() {
                delete soundList[soundId];
            });
            soundList[soundId] = buttonSound;
        }
    }


    if (j.ok) {
        //chat.wsSendChat("premium_command" + premiumCommandCount + " " + j.command);
        premiumCommandCount++;
    }
    
    if (j.code === "premium_command_failed") {
        if (localStorage.getItem('robotstreamer_token') === null ||
            localStorage.getItem('robotstreamer_token') === '') {
            // show login window
            //location.hash = "#login";
            alert("You need to be logged and have funbits for premium.");
        } else {
            location.href = "/pay.html";
        }
    }
}



function controlConnect(){

    console.log("Control starting connect to: ", window.controlUrl);
    controlSocketsWS[window.robot_id] = new WebSocket(window.controlUrl);


    controlSocketsWS[window.robot_id].onopen = function(event) {
        let controlConnectData = {
            type: 'connect',
            token: window.localStorage.getItem("robotstreamer_token"),  //only required on connect
            robot_id: window.robot_id.toString(),                       //only required on connect
            owner_id: window.owner_id.toString()                        //only required on connect
        }
        if ((location.href.split("/")[5] === "broadcast" || location.href.split("/")[5] === "tts") && _global_js__WEBPACK_IMPORTED_MODULE_3__.pageLoadAPI.owner == localStorage.getItem("robotstreamer_user_id")) {
            controlConnectData['sub_type'] = "connect-broadcasting";
        }

        // send connect
        controlSocketsWS[window.robot_id].send(JSON.stringify(controlConnectData));
        console.log('Control connected:');
    };

    
    controlSocketsWS[window.robot_id].onerror = function(err) {
        // close on error for reconnect
        //console.warn('Control ws error: ', err);
        controlSocketsWS[window.robot_id].close();
    };

    controlSocketsWS[window.robot_id].onclose = function(err) {
        console.warn('Control ws closed', err);
    };

    controlSocketsWS[window.robot_id].onmessage = handleControlMessage;

}


async function controlReconnect() {

    if (!controlSocketsWS[window.robot_id] || controlSocketsWS[window.robot_id].readyState != 1) {

        let endpoint = await _util_js__WEBPACK_IMPORTED_MODULE_0__.getService("rscontrol");
        if (endpoint === null){
            // default to old control
            endpoint = _global_js__WEBPACK_IMPORTED_MODULE_3__.pageLoadAPI.control  
        }

        let urlProtocol = _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol('websocket');
        window.controlUrl = urlProtocol+"//"+endpoint.host+":"+endpoint.port+"/echo"
        controlConnect()
    }
}


async function init() {

    let endpoint = _global_js__WEBPACK_IMPORTED_MODULE_3__.pageLoadAPI.control_service

    if (endpoint == null){
        // default to old control
        endpoint = _global_js__WEBPACK_IMPORTED_MODULE_3__.pageLoadAPI.control  
    }

    if (endpoint != null) {

        let urlProtocol = _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol('websocket');
        let controlUrl = urlProtocol+"//"+endpoint.host+":"+endpoint.port+"/echo"
        window.controlUrl = controlUrl

        controlConnect()

        setInterval(await async function() {
            await controlReconnect();
        }, 5000);

    } else {
        console.error("could not get any control endpoint, no retry");
    }

}

function sendCommand(robotID, cmdRaw, keyPosition) {

    let token = localStorage.getItem('robotstreamer_token');
    if (token == null) {
        token = "";
    }

    var cmd = {type:'command',
               command:cmdRaw,
               key_position:keyPosition,
               token: token,  //only required on connect after update
              } 

    controlSocketsWS[window.robot_id].send(JSON.stringify(cmd));
    //console.log("sending ws control command:", cmd);

}

function stopAllSounds() {
	for (let soundId of Object.keys(soundList)) {
		soundList[soundId].pause();
		soundList[soundId].currentTime = 0;
		delete soundList[soundId];
	}
}






//# sourceURL=webpack://rswebclient/./src/control_communication.js?