__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSeenUser: () => (/* binding */ addSeenUser),
/* harmony export */   addToTTSQueue: () => (/* binding */ addToTTSQueue),
/* harmony export */   clearTTSQueue: () => (/* binding */ clearTTSQueue),
/* harmony export */   espeak: () => (/* binding */ espeak),
/* harmony export */   expScrollChat: () => (/* binding */ expScrollChat),
/* harmony export */   initChatBox: () => (/* binding */ initChatBox),
/* harmony export */   onMessageReceived: () => (/* binding */ onMessageReceived),
/* harmony export */   openChatUserOptions: () => (/* binding */ openChatUserOptions),
/* harmony export */   setupFullscreenChat: () => (/* binding */ setupFullscreenChat),
/* harmony export */   wsSendChat: () => (/* binding */ wsSendChat)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _funbits_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./funbits.js */ "./src/funbits.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _control_communication_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./control_communication.js */ "./src/control_communication.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_4__);






//var chatSocket
var chatWS
var host;
var port;
//window.chatWS = chatWS
var robots;
var messageBox = document.getElementById('user_message');
var whitelistchat = document.getElementById('whitelistchat');
var whitelistRequests = []
var lastRandomId;
var lastUserName = false;
var lastStreamId = false;
let usedStreamNames = {};
var colourStore = [];
var scrollChat
var shouldAutoScroll = true
var colourCycle = 0
let ttsQueue = [];
let ttsTimer;
let espeakTimer;
let chatOptionsOpen = false;
let ttsMaxDuration = 5;
let safeIgnores = {};
let chatExtraOptions = {}
let userPrivileges = {};
let userPrivilegesSet = false;
let gmodMessages = [];
let seenUsers = {};
let mentionInterval;
let mentionDisplayState = false;
let joinName;

//chat history related
let historyReceived = false;
let historyExecuted = false;
let firstMessageReceived = false;
let feignChatPauseQueue = [];
let chatPauseQueue = [];

//time of last sent message
var lastEnter = 0;

// Theoretically just setting an initial default value on this should allow cached IPs to bypass recaptcha
var greToken = "check-if-cached";
function wsSendChat(message) {
	console.log("sending", message);

	// route xcontrol to control server bypassing chat
	if(message.startsWith("!xcontrol")){
		_control_communication_js__WEBPACK_IMPORTED_MODULE_3__.sendCommand(window.robot_id, message, 'test')
		return
	}

	if (greToken && greToken.length > 1) {
		// Send message to websocket with stored recaptcha token
		if (localStorage.getItem("robotstreamer_token") === null) {
			sendWithConnect(JSON.stringify({
				'message': message,
				'robot_id': window.robot_id.toString(),
				'owner_id': window.owner_id.toString(),
				'gre_token': greToken,
				'tts_price': _global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad
			}));
		} else {
			sendWithConnect(JSON.stringify({
				'message': message,
				'token': localStorage.getItem("robotstreamer_token"),
				'robot_id': window.robot_id.toString(),
				'owner_id': window.owner_id.toString(),
				'gre_token': greToken,
				'tts_price': _global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad
			}));
		}
	} else {
		// Fetch token from invisible recaptcha challenge
		window.greLoad(function(token) {
			greToken = token; // Store the token
			wsSendChat(message); // Resend original request now that we have a token
		});
	}
	scrollChat(true)
}

function addSeenUser(userName, userId) {
	seenUsers[userName] = userId;
}

// on return key
function onMessageBoxKeyDown(event) {
	if (event.key === "Enter") {
		onChatSubmit();
	}
}

function onChatSubmit() {
	var curTime = (new Date()).getTime();
	if (messageBox.value && messageBox.value.length > 0 && (curTime - lastEnter) > 1000) {
		
		let commandInput = messageBox.value.split(" ")[0];
		let commandAlert;
		let protectedCommands = {"/unbanall": "Are you sure you want to unban all banned users?"};
		for (let [command, alertMsg] of Object.entries(protectedCommands)) {
			if (commandInput == command) {
				commandAlert = command;
			}
		}
		if (commandAlert) {
			let alertAnswer = window.confirm(protectedCommands[commandAlert]);
			if (!alertAnswer) {
				messageBox.value = "";
				return;
			}
		}
		
		lastEnter = curTime;

		//look at the tts checkbox and prefix a period
		var isTTS = document.getElementById("checkbox_tts").checked;

		if (isTTS === false) {
			var buildMessage = "." + messageBox.value;
		} else {
			var buildMessage = messageBox.value;
		}

		//iOS 'smart' punctuations fix
		buildMessage = buildMessage.replace(/[\u2018\u2019\u201C\u201D]/g,
			(c) => '\'\'""'.substr('\u2018\u2019\u201C\u201D'.indexOf(c), 1));

		//send message
		wsSendChat(buildMessage);

		//reset input box
		messageBox.value = "";

		let ttsTextIndicator = document.getElementById("checkbox_tts").parentElement.querySelector(".slider");
		ttsTextIndicator.innerText = "TTS";
		ttsTextIndicator.style.color = "";
	}
}

function ClearActivity() {
	var myNode = document.getElementById("Activity_sidenav");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

async function hideIfEmpty(hide, empty){
	if (document.getElementById(empty)){
		let hideElm = document.getElementById(hide);
		if (document.getElementById(empty).innerHTML === ""){
			
			hideElm.style.opacity = 0;
			setTimeout(function(){ 
				hideElm.style.visibility = 'hidden';
			}, 1000); //transition time

		}else{
			hideElm.style.visibility = 'visible';
			hideElm.style.opacity = 1;
		}
	}
}

/**
 * Speak text using eSpeak
 * 
 * @param {text}             Sentence to speak
 * @param {volume}           Volume from 0-100 (default 100)
 * @param {pitch}            Pitch from 0-100 (default 50)
 */
var espeak_last_message_id = false;
function espeak(text, volume = 100, pitch = 50, rate = 175, callback = function(){ } ) {
	if (!window.espeak_loaded) {
		var script = document.createElement('script');
		script.onload = function () {
			window.meSpeak.loadVoice('voices/en/en-us.json');
			return espeak(text, volume, pitch, rate, callback);
		};
		script.src = '/lib/espeak/mespeak.js';
		document.head.appendChild(script);
		window.espeak_loaded = true;
	} else {
		window.meSpeak.stop(espeak_last_message_id);
		espeak_last_message_id = window.meSpeak.speak(text, { 'amplitude': volume, 'pitch': pitch, 'speed': rate, 'nostop': true, 'callback': callback });
		return espeak_last_message_id;
	}
}

function addToTTSQueue(msg) {
	msg.onend = function(event) {
		console.log('utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
		ttsQueue.shift();
		clearTimeout(ttsTimer);
		if (ttsQueue.length > 0) {
			window.speechSynthesis.speak(ttsQueue[0]);
			if (ttsMaxDuration > 0) {
				ttsTimer = setTimeout(function(){
					window.speechSynthesis.cancel();
				}, ttsMaxDuration * 1000);
			}
		}
	}

	msg.onerror = function(event) {
		console.error(event.error);
		clearTTSQueue();
	}

	console.log(msg);
	if (ttsQueue.length < 1) {
		ttsQueue.push(msg);
		window.speechSynthesis.speak(msg);
		if (ttsMaxDuration > 0) {
			ttsTimer = setTimeout(function() {
				window.speechSynthesis.cancel();
			}, ttsMaxDuration * 1000);
		}
	}
	else {
		ttsQueue.push(msg);
	}
}

function clearTTSQueue() {
	window.speechSynthesis.cancel();
	ttsQueue = [];
	espeak('');
	clearTimeout(espeakTimer);
}

function makeTimestamp(historyTime) {
	let timestampMode = localStorage.getItem("timestamp_mode");
	if (!timestampMode) {
		timestampMode = 0;
	}

	let timestampStr = "";
	if (timestampMode > 0) {
		let rightNow;
		if (historyTime) {
			rightNow = new Date(historyTime);
		}
		else {
			rightNow = new Date();
		}
		let hoursNow = rightNow.getHours();
		let minutesNow = rightNow.getMinutes();
		let secondsNow = rightNow.getSeconds();
		
		//format for 12 hr time
		if (timestampMode == 1) {
			timestampStr = " AM";
			if (hoursNow == 0) {
				hoursNow = 12;
			}
			else if (hoursNow == 12) {
				timestampStr = " PM";
			}
			else if (hoursNow > 12) {
				timestampStr = " PM";
				hoursNow = hoursNow - 12;
			}
		}
		timestampStr = toTimeDigits(hoursNow) + ":" + toTimeDigits(minutesNow) + ":" + toTimeDigits(secondsNow) + timestampStr;
	}
	return timestampStr;
}

async function onMessageReceived(data, parseJson = true, isHistory = false) {

	//catch feigned messages to replay after history
	if (!historyExecuted && !parseJson) {
		feignChatPauseQueue.push(data);
	}

	var timestamp = addZero(new Date().getHours()) + ":" + addZero(new Date().getMinutes());
	var API = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI;
	var json = data;


	//if (Array.isArray(json.message)) {
	//}

	if (parseJson) {
		var json = JSON.parse(data);
	}

	console.log(json)

	if (typeof json === "undefined" || !json) {
		console.log("failed to parse received websocket message");
		return;
	}

	//console.log("message:", json)

	if (typeof json === "object" && json.type === "gre_retry") {
		var messageResend = (typeof json.resend !== "undefined" ? (" " + json.resend).slice(1) : false);
		window.greLoad(function(token) {
			// Store the new token
			greToken = token;
			// Check for a valid message to resend
			if (messageResend) {
				// Resend original message now that we have a token
				wsSendChat(messageResend);
			}
		});
		return;
	}


	//set character length
	// route xcontrol to control server bypassing chat
	if(json.chat_limit){
		console.log("CHATLIMIT RECEIVED:", json.chat_limit)
		let chatBoxs = document.getElementsByClassName("chat-input-chatbox-input")

		for(var i = 0; i < chatBoxs.length; i++) {
		    chatBoxs[i].maxLength = json.chat_limit || 140;
		}

	}





	//if message type/non display message
	if (json.type) {
		console.log("json.type", json.type);
		//tts charge higher than expected
		if (json.type == "tss_price_change") {
			//update price
			_global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad = json.new;
			var answer = window.confirm('TTS price has changed from ' + (json.old || '0') + ' to ' + json.new + ', continue sending last message?');
			if (answer) {
				console.log("resending last message");
				wsSendChat(json.last_message);
			}

		}


        if (json.type == "delete") {

            let elm = document.querySelectorAll("div.message");
            for (let i = 0; i < elm.length; ++i) {
                if(elm[i].getAttribute('username') == json.username){
                    // remove globally or only specified room
                    if(json.owner_id == "0" || elm[i].getAttribute('roomid') == json.owner_id){
                        elm[i].remove();
                    }
                }
            }
        }


		if (json.type == "whitelist_resolve") {
			//delete request elem
			if(document.getElementById("whitelist_request_"+json.whitelist_request[0].username)){
				document.getElementById("whitelist_request_"+json.whitelist_request[0].username).remove();
			}
			let wlMessage = json.username+" "+json.whitelist_request[0].action+" "+json.whitelist_request[0].username;
            var jsonfeign = {
                "message": wlMessage,
                "username": "Whitelist Resolve", 
                "color": "fff", 
                "tts": false};

            hideIfEmpty("lower_left_popup", "whitelistchat")
            onMessageReceived(jsonfeign, false)
			return
		}


		if (json.type == "whitelist_request") {
			//pending requests are received on join as array, single too

			for (var i = json.whitelist_request.length - 1; i >= 0; i--) {
				console.log("whitelist_request:", json.whitelist_request[i].username);

				json.username = json.whitelist_request[i].username // temp hack

				let requestId = "whitelist_request_"+json.username;
				//prevent duplicates

				if (!document.getElementById(requestId)){

					var whitelist_elm = document.createElement("div");
					whitelist_elm.innerHTML = json.username+" request to join &nbsp;"
					whitelist_elm.id = requestId
					
					let buttonAccept = document.createElement("button")
					buttonAccept.innerHTML = "accept"
					buttonAccept.id = "whitelist_accept"
					buttonAccept.value = json.username

					let buttonDeny = document.createElement("button")
					buttonDeny.innerHTML = "deny"
					buttonDeny.id = "whitelist_deny"
					buttonDeny.value = json.username

					let buttonIgnore = document.createElement("button")
					buttonIgnore.innerHTML = "ignore"
					buttonIgnore.id = "whitelist_ignore"
					buttonIgnore.value = json.username


					whitelist_elm.appendChild(buttonAccept)
					whitelist_elm.appendChild(buttonDeny)
					whitelist_elm.appendChild(buttonIgnore)

					//insert above to stop append/remove misclicks
					whitelistchat.insertBefore(whitelist_elm, whitelistchat.firstChild);
					//whitelistchat.appendChild(whitelist_elm)
					hideIfEmpty("lower_left_popup", "whitelistchat")

					//stay scrolled to bottom
					var objDiv = document.getElementById("lower_left_popup");
					objDiv.scrollTop = objDiv.scrollHeight;

				    buttonAccept.onclick = function(e) {
				    	let username = e.target.getAttribute('value')
				        whitelistAction(username, true)
				    }

				    buttonDeny.onclick = function(e) {
				    	let username = e.target.getAttribute('value')
				        whitelistAction(username, false)
				    }

				    buttonIgnore.onclick = function(e) {
				        //delete request from users list only
				        document.getElementById("whitelist_request_"+e.target.getAttribute('value')).remove();
				        hideIfEmpty("lower_left_popup", "whitelistchat")
				    }

				    function whitelistAction(username, action){
				    	console.log("whitelistAction", username, action)
				    	if (action){
				    		wsSendChat('/whitelist '+username)
				    	}else{
				    		wsSendChat('/blacklist '+username)
				    	}
				    }
				}

			}

		}
		
		if (json.type == "hlsreroll" && API.type == "rtmp") {
			hlsReroll();
		}
		
		if (json.type == "webrtcmigrate" && API.type == "webrtc") {
			webrtcMigrate();
		}
		
		if (json.type == "history" && json.message && !historyReceived) {
			historyReceived = true;
			clearChat();
			let pastChats = JSON.parse(json.message);
			if (!(typeof pastChats === "undefined" || !pastChats)) {
				for (let i = 0; i < pastChats.length; i++) {
					onMessageReceived(pastChats[i], true, true);
				}
			}
			historyExecuted = true;
			for (let i = 0; i < feignChatPauseQueue.length; i++) {
				onMessageReceived(feignChatPauseQueue[i], false);
			}
			for (let i = 0; i < chatPauseQueue.length; i++) {
				onMessageReceived(chatPauseQueue[i]);
			}
		}

		if (json.type == "your_info" && 'message' in json) {
			let infoData = JSON.parse(json.message)
			if ('user_name' in infoData) {
				joinName = infoData.user_name;
			}
		}

		if (json.type == "privileges") {
			for (let [priv, state] of Object.entries(JSON.parse(json.message))) {
				userPrivileges[priv] = state;
				userPrivilegesSet = true;
			}
			
			let previewerOptions = document.getElementById("chat-options-previewers");
			if ((userPrivileges['previewer'] || userPrivileges['observer']) && previewerOptions) {
				if (userPrivileges['observer']) {
					document.getElementById("chat_options_previewers_title").innerText = "Observer";
				}
				if (userPrivileges['previewer']) {
					document.getElementById("chat_options_previewers_title").innerText = "Previewer";
				}
				previewerOptions.style.display = "block";
			}
			
			let poweruserOptions = document.getElementById("chat_options_poweruser");
			if (userPrivileges['power_user'] && poweruserOptions) {
				poweruserOptions.style.display = "block";
			}
		}

		if (json.type == "gmod_messages" && json.message) {
			let msgList = JSON.parse(json.message);
			for (let i = 0; i < msgList.length; i++) {
				gmodMessages.push(msgList[i]);
			}
			if (!(document.getElementById("gmod_message_window")) && gmodMessages.length > 0) {
				displayGmodMessage(gmodMessages[0]);
				gmodMessages.shift();
			}
		}

		//non displayable message
		return;
	}


	//if current client sent this message dig out the tts charge and modify elements
	if (!isHistory && json.user_id == localStorage.getItem("robotstreamer_user_id") &&
		json.owner_id != localStorage.getItem("robotstreamer_user_id") && json.tts) {
		//console.log("user was charged", json.tts_price);
		_global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.spendable_funbits = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.spendable_funbits - json.tts_price;
		_funbits_js__WEBPACK_IMPORTED_MODULE_1__.refreshSpendableFunbitsDisplay();
	}


	//hide undesired chats
	if (!API.follow_list.follow.includes(json.owner_id) && json.not_recommended === true) {
		if (localStorage.getItem("chat_global_show_unrecommended") != "true") {
			return;
		}
	}


	if (chatExtraOptions['hide_first_welcome'] === true && json.username == "[RS BOT]" && (json.message.startsWith("Welcome. Use /help for help.") || json.message == "Please log in to chat.")) {
		return;
	}


	let robot_id = json.robot_id
	let ownerID = json.owner_id
	let username = _util_js__WEBPACK_IMPORTED_MODULE_0__.stripTagsAndQuotes(json.username)
		.replaceAll("I", '<span style="font-family:monospace; font-weight: bold;">I</span>')
		.replaceAll("0", '<span style="font-family:monospace; font-weight: bold;">0</span>');
	//let message = new String(json.message).replace("<", "&lt;").replace(">", "");
	let message = new String(json.message).replace(/(<([^>]+)>)/ig,"");
	let botName;


	// fetch robot name from latest api page load
	for (var i = API.robots.length - 1; i >= 0; i--) {
		if (robot_id === undefined) {
			if (json.owner_name !== undefined) {
				botName = "<i>" + _util_js__WEBPACK_IMPORTED_MODULE_0__.stripHtmlTags(json.owner_name) + "</i>";
				break;
			}
			if (API.robots[i].user_id == ownerID) {
				botName = "<i>" + _util_js__WEBPACK_IMPORTED_MODULE_0__.stripHtmlTags(API.robots[i].user_name) + "</i>";
				break;
			}
		}
		else {
			for (var index = 0; index < API.robots[i].robots.length; ++index) {
				if(API.robots[i].robots[index].robot_id == json.robot_id){
					botName = _util_js__WEBPACK_IMPORTED_MODULE_0__.stripHtmlTags(API.robots[i].robots[index].robot_name);
				}
			}
		}
	}


	if (botName === undefined) {
		if (json.stream_name === undefined) {
			botName = "Room | " + robot_id;
		}
		else {
			botName = _util_js__WEBPACK_IMPORTED_MODULE_0__.stripHtmlTags(json.stream_name);
		}
	}


	let emoteObj = {
		pHappy: "<img width='21' src='/images/emotes/pSmile.png'/>",
		pDead: "<img width='21' src='/images/emotes/pDead.png'/>",
		pSilly: "<img width='21' src='/images/emotes/pSilly.png'/>",
		pLewd: "<img width='21' src='/images/emotes/pLewd.png'/>",
		pSob: "<img width='21' src='/images/emotes/pSob.png'/>",
		pLaugh: "<img width='21' src='/images/emotes/pLaugh.png'/>",
		pEvil: "<img width='21' src='/images/emotes/pEvil.png'/>",
		pNSFW: "<img width='21' src='/images/emotes/pNSFW.png'/>",
		pPog: "<img width='21' src='/images/emotes/pPog.png'/>",
		pDerp: "<img width='21' src='/images/emotes/pDerp.png'/>",
		pHonk: "<img width='21' src='/images/emotes/pHonk.png'/>",
		pGay: "<img width='21' src='/images/emotes/pGay.png'/>",
		pHeart: "<img width='21' src='/images/emotes/pHeart.png'/>",
		eWorm: "<img width='21' src='/images/emotes/eWorm.png'/>",
		hydraYikes: "<img width='21' src='/images/emotes/hydraYikes.png'/>",
		boredRob: "<img width='21' src='/images/emotes/boredRob.png'/>",
		dewReese: "<img width='21' src='/images/emotes/dewReese.png'/>",
		meffKaren: "<img width='21' src='/images/emotes/meffKaren.png'/>"
	};

	if (localStorage.getItem("chat_emotes") != "false") {
		let re = new RegExp(Object.keys(emoteObj).join("|"), "g");
		message = message.replace(re, function(matched) {
			return emoteObj[matched];
		});
	}

	let ttsPrefix = "";
	if (_global_js__WEBPACK_IMPORTED_MODULE_2__.isBroadcasting && document.getElementById("ttsNames").value == "on") {
		ttsPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.stripHtmlTags(json.username) + ": ";
	}

	//espeak if starts with [
	//TODO incorporate this into the normal TTS queue
	if (/\[[^[]+/i.test(message)) {
		// if (message.charAt(0) == '[') {
		// 	message = message.substr(1); //Move first character which is [
		// }
		console.log('espeak');
		//Only speak for streamer
		if (!isHistory && _global_js__WEBPACK_IMPORTED_MODULE_2__.isBroadcasting && json.tts && localStorage.getItem("robotstreamer_user_id") == json.owner_id && json.robot_id == window.robot_id) {
			json.tts = false; //Disable TTS
			if (ttsMaxDuration > 0) {
				espeakTimer = setTimeout(function(){
					espeak('');
				}, ttsMaxDuration * 1000);
			}
			let eMessage = message;
			let bracketMatch = eMessage.match(/^\[+/i);
			let ttsPrefixIndex = 0;
			if (bracketMatch) {
				ttsPrefixIndex = bracketMatch[0].length;
			}
			eMessage = eMessage.slice(0, ttsPrefixIndex) + ttsPrefix + eMessage.slice(ttsPrefixIndex);
			if (eMessage.indexOf("[[") >= 0) {
				//for stability
				eMessage = eMessage.substr(0, 142);
			}
			espeak(eMessage, 
				document.getElementById("volume-slider-tts").value / 10, 
				document.getElementById("volume-slider-tts-pitch").value / 2,
				Math.round(document.getElementById("volume-slider-tts-rate").value * 17.5),
				function (espeakTimer) { clearTimeout(espeakTimer) }
			);
		}
		//Oldskool format
		if (json.user_id != "") {
			message = `<span class="espeak">${message}</span>`;
		}
	}

	
	//make links clickable if applicable
	if (!message.match(/https?:\/\/(?:www\.)?101soundboards\.com[^\s]*/gi)) {
		message = message.replace(/https?:\/\/[^\s]+/gi, "<a href=\"$&\" target=\"_blank\" onclick=\"return chatLinkClick(this)\" onauxclick=\"return chatLinkClick(this)\" oncontextmenu=\"return chatLinkClick(this, \'right\')\">$&</a>");
	}


	let globalChatMode = JSON.parse(localStorage.getItem("robotstreamer_globalChatMode"));

	//bypass if internal msg
	if (!parseJson) {
		globalChatMode = true;
		botName = "";
	}

	//bypass globalchat if robot_id = 0/announce
	if (robot_id == 0) {
		globalChatMode = true;
		botName = "";
		_global_js__WEBPACK_IMPORTED_MODULE_2__.forcePageLoadRefresh = true;
	}
	
	if (json.chat_bot && getPowerUserOption("chat_bots_global") !== "true") {
		globalChatMode = false;
	}

	let admin_badge = '';

	//this is really the localmod icon, global phased out
	if (json.global_mod) {
		admin_badge += '<img src=\"/images/modicon.svg\" style="width:12px;">';
	}
	//rsbot star icon
	if (username == "[RS BOT]") {
		admin_badge += '<img src=\"/images/staricon.svg\"/>';
	}
	//give a star to subscribers
	if (json.subscribed) {
		if (json.subscription_icon && json.subscription_icon != "") {
			admin_badge += '<img src=\"' + json.subscription_icon + '\"/>';
		}
		else {
			admin_badge += '<img src=\"/images/staricon.svg\"/>';
		}
	}
	//only show broadcaster badge on ownerchat
	if (json.owner_id == json.user_id) {
		admin_badge += '<img src=\"/images/streamicon.svg\"/>';
	}
	//if(json.broadcaster){admin_badge += '<img src=\"/images/streamicon.svg\"/>';}

	let div_type = "message ";
	if (json.tts == true) {
		div_type = "message tts";
	}

	if (!isHistory && json.highlighted) {
		addToPreviewPanel(json);
	}
	
	if (json.highlighted) {
		if (localStorage.getItem("chat_show_unapproved") == "false") {
			return;
		}
		if (localStorage.getItem("chat_show_unsafe") != "true" && json.highlighted_no_ui === true) {
			return;
		}
		if (localStorage.getItem("chat_show_ignored_unapproved") == "false" && safeIgnores[json.user_id]) {
			return
		}
	}


	let allowMessage = true; //default true
	if (!globalChatMode) {
		//bypass local only for parseJson. internal messages
		if (_global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.owner !== ownerID) {
			allowMessage = false;
			return; //append fix
		}
	}
	else {
		if (_global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.owner !== ownerID && _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.dislike_list.includes(ownerID)) {
			if (localStorage.getItem("chat_global_show_disliked") != "true") {
				allowMessage = false;
				return;
			}
		}
	}

	//colour crap
	let signedInColors = [
		"#E92A63",
		"#FFD56A",
		"#1DD1A1",
		"#49A8FF",
		"#9E7FF5",
		"#FE8B4A",
		"#7AE868",
		"#6884E8",
		"#EA83C7",
		"#9955DC"
	];

	let randColor
	//no colour if anon
	if (json.user_id == "0") {
		randColor = 'rgba(210, 210, 210, 0.8);';
	} else {
		//use stored colour if already exists
		if (username in colourStore) {
			randColor = colourStore[username];
		} else {
			//var randColor = signedInColors[Math.floor(Math.random() * signedInColors.length)];
			randColor = signedInColors[colourCycle]
			colourStore[username] = randColor; //store for future

			//loop over colours
			if (colourCycle >= (signedInColors.length - 1)) { //inc
				colourCycle = 0
			} else {
				colourCycle = colourCycle + 1
			}

		}
	}


	//highlight if message contains username
	let mentionName = joinName;
	if (localStorage.getItem("robotstreamer_username")) {
		mentionName = localStorage.getItem("robotstreamer_username");
	}
	if (mentionName) {
		let mentionPattern = new RegExp("@" + mentionName + "(?![-\\w])", "i");
		if (mentionPattern.test(message)) {
			//message = '<mark>'+message+'</mark>'
			message = '<span style="color: #000000; background-color:#1DD1A1; padding: 2px; font-weight: 500;" class="mention-highlight">' + message + '</span>';
			if (localStorage.getItem("chat_mention_notify") != "false" && !isHistory) {
				blinkMentionNotification();
			}
		}
	}
	//append hack element ID
	let RandomId = Math.floor(Math.random() * 999999) + 1;
	
	let messageColor = '';
	if (json.highlighted) {
		messageColor = 'style=\"color:#FF0000;\" ';
	}

	let avatarHtml = "";
	if (chatExtraOptions['avatars_enabled'] === true || localStorage.getItem("chat_avatars") == "true") {
		if (json.avatar) {
			avatarHtml = '<span class=\"message-info-avatar\"><img src=\"' + json.avatar + '\" alt=\"' + json.username + '\'s Avatar\" title=\"' + json.username + '\'s Avatar\" class=\"chat-avatar\" onerror=\"this.onerror=null;this.src=\'/images/noimage.png\';\"> </span>';
		}
		else {
			avatarHtml = '<span class=\"message-info-avatar\"><img src=\"/images/emotes/pSmile.png\" alt=\"' + json.username + '\'s Avatar\" title=\"' + json.username + '\'s Avatar\" class=\"chat-avatar\"> </span>';
		}
	}

	let historyTime;
	if (isHistory && json.timestamp) {
		historyTime = json.timestamp;
	}
	let timestampStr = makeTimestamp(historyTime);
	let parent = document.getElementById("message_" + lastRandomId);
	//append message if last name and bot
	if (chatExtraOptions['compact_disabled'] !== true && (json.robot_id !== undefined && lastUserName === username && lastStreamId === json.robot_id && parent)) {
		if (allowMessage) {
			parent.insertAdjacentHTML('beforeend', "<br><span title=\"" + timestampStr + "\">" + message + "</span>");
			if (parent.parentElement) {
				let lastTimestamp = parent.parentElement.getElementsByClassName("message-info-time")[0];
				if (lastTimestamp) {
					lastTimestamp.innerText = " [" + timestampStr + "]";
				}
			}
		}
	} else {
		let timestampHtml = "";
		if (timestampStr != "") {
			timestampHtml = "<span class=\"message-info-time\"> [" + timestampStr + "]</span>";
		}

		if (botName.length > 18) {
			botName = botName.slice(0, 17);
			if (botName[botName.length - 1] != ";") {
				botName = botName.replaceAll(/&[^\s\&]*$/g, "");
			}
			botName += "…";
		}

		//<span class=\"message-info-channel">' + botName + ' ['+timestamp+']</span> \
		parent = document.getElementById('messages-container');
		let styleOverride = '';
		if (chatExtraOptions['background_color']) {
			styleOverride = 'style="background-color: ' + chatExtraOptions['background_color'] + ';" ';
		}
		
		let userOptionsStr = '';
		if (!(!parseJson || json.username == "[RS BOT]" || json.username == "[Private]mods")) {
			if (userPrivileges['gmod'] || userPrivileges['previewer'] || (userPrivileges['owner'] && json.owner_id == _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.owner) || (userPrivileges['mod'] && json.owner_id == _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.owner)) {
				userOptionsStr = '<img class=\"user-options\" src=\"/images/more_options.svg\" username=\"'+ json.username + '\" userid=\"'+ json.user_id + '\">';
			}
		}
		
		var newChild = '\
            <div ' + styleOverride + 'class=\"'+div_type+'\" username=\"'+json.username+'\" userid=\"'+json.user_id+'\" roomid=\"'+json.owner_id+'\"> \
                <div class=\"message-info\"> \
										' + avatarHtml + ' \
                    <span class=\"message-info-name' + (json.highlighted_no_ui === true ? ' username-strikethrough' : '') + '\" style="color: ' + randColor + ';">' + username + ' </span> \
										' + userOptionsStr + ' \
										' + timestampHtml + ' \
                    <div class=\"message-icons\">' + admin_badge + '</div> \
                    <span ' + (chatExtraOptions['titles_disabled'] === true ? 'style="display:none;" ' : '') +'class=\"message-info-channel">' + botName + getStreamSuffix(botName, json.robot_id) + '</span> \
                </div> \
                <div ' + messageColor + 'class=\"message-content\" id=\"message_' + RandomId + '\">' + '<span title=\"' + timestampStr + '\">' + message + '</span>' + '</div> \
            </div>';
		lastRandomId = RandomId;
		if (allowMessage) {
			parent.insertAdjacentHTML('beforeend', newChild);
			let userOptionsList = document.getElementsByClassName("user-options");
			for (let i = 0; i < userOptionsList.length; i++) {
				if (!userOptionsList[i].userOptioned) {
					userOptionsList[i].userOptioned = true;
					userOptionsList[i].addEventListener("click", function() {
						openChatUserOptions(this.getAttribute("username"), this.getAttribute("userid"));
					});
				}
			}
			if (!(botName in usedStreamNames)) {
				usedStreamNames[botName] = json.robot_id;
			}
		}
	}

	reduceMessages()
	scrollChat()

	lastUserName = username;
	lastStreamId = json.robot_id;

	if (!(json.username.startsWith("[") || !parseJson)) {
		seenUsers[json.username] = json.user_id;
	}

	//speak message if broadcasting
	if (!isHistory && _global_js__WEBPACK_IMPORTED_MODULE_2__.isBroadcasting && json.username == '[RS BOT]' && message.includes('░☼‿☼░') &&
		localStorage.getItem("robotstreamer_user_id") == json.owner_id) { //silly mistake tts was playing all

		let giveThreshold = _config_js__WEBPACK_IMPORTED_MODULE_4__.give_alert_threshold || 10;

		if (parseFloat(message.split(' ')[2]) >= giveThreshold){

			console.log(parseFloat(message.split(' ')[2]))
			var audio = new Audio('../../../alert.wav');
			audio.volume = document.getElementById("volume-slider-notifications").value / 1000;
			audio.play();
		}
	}
	else if (!isHistory && _global_js__WEBPACK_IMPORTED_MODULE_2__.isBroadcasting && localStorage.getItem("robotstreamer_user_id") == json.owner_id && json.notification_type == "subscription") {
		let alertSound = new Audio('../../../alert.wav');
		alertSound.volume = document.getElementById("volume-slider-notifications").value / 1000;
		alertSound.play();
	}

	// removing eMotes from message in a funny way
	message = message.replace(/(<([^>]+)>)/ig, "");

	if (!isHistory && _global_js__WEBPACK_IMPORTED_MODULE_2__.isBroadcasting &&
		json.tts &&
		localStorage.getItem("robotstreamer_user_id") == json.owner_id &&
		json.robot_id == window.robot_id &&
		message !== "" && 
		!/\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/i.test(message)) {
		
		var ttsVolume = document.getElementById("volume-slider-tts").value / 1000;
		var ttsPitch = document.getElementById("volume-slider-tts-pitch").value / 100;
		let ttsRate = document.getElementById("volume-slider-tts-rate").value / 10;
		var msg = new SpeechSynthesisUtterance(ttsPrefix + message);
		msg.rate = ttsRate;
		msg.pitch = ttsPitch;
		msg.volume = ttsVolume;
		if (document.getElementById("ttsVoice").value) {
			//msg.voice = global.listVoices[document.getElementById("ttsVoice").value]
			msg.voiceURI = _global_js__WEBPACK_IMPORTED_MODULE_2__.listVoices[document.getElementById("ttsVoice").value].voiceURI
			msg.lang = _global_js__WEBPACK_IMPORTED_MODULE_2__.listVoices[document.getElementById("ttsVoice").value].lang

			console.log(_global_js__WEBPACK_IMPORTED_MODULE_2__.listVoices[document.getElementById("ttsVoice").value])
		}

		let ttsQueueLength = document.getElementById("ttsQueue").value;
		ttsQueueLength = parseInt(ttsQueueLength);
		if (ttsQueueLength > 0 && ttsQueue.length >= ttsQueueLength && json.tts_price == 0) {
			// do nothing
		} else {
			addToTTSQueue(msg);
		}

	}

}


async function speechEngine(message, voice, volume, pitch, voiceURI, voiceLang) {

	//var msg = new SpeechSynthesisUtterance(message);
	var msg = window.speechSynthesis;

	msg.rate = 1;
	msg.pitch = pitch;
	msg.volume = volume;


	msg.voiceURI = voiceURI;
	msg.lang = voiceLang;

	var utterance = new SpeechSynthesisUtterance(message)

	msg.speak(utterance)

	//msg.onstart
	//var voiceTimer = 0;
	//const maxVoiceTimer = 5;
	//function cancelVoice() {
	//  msg.cancel();
	//}
	//setTimeout(cancelVoice, maxVoiceTimer*1000);

}


function reduceMessages() {
	if (shouldAutoScroll) {
		var maxMessages = 100
		if (_config_js__WEBPACK_IMPORTED_MODULE_4__.chat_max_messages) {
			maxMessages = _config_js__WEBPACK_IMPORTED_MODULE_4__.chat_max_messages;
		}
		var items = document.getElementsByClassName('message')
		var itemsCount = items.length
		var itemsCutAway = itemsCount > maxMessages ? itemsCount - maxMessages : 0
		for (var i = 0; i < itemsCutAway - 1; i++) {
			items[i].remove()
		}
	}
}


function clearChat() {
	lastUserName = false;
	lastStreamId = false;
	let chats = document.querySelectorAll('div.message');
	for (let i = 0; i < chats.length; i++) {
		chats[i].remove();
	}
}


function onWSMessageReceived(data) {
	var timestamp = addZero(new Date().getHours()) + ":" + addZero(new Date().getMinutes());

	var json = data
	//console.log(json);
	var chatbox = element("chatbox");


	var z = document.createElement('li');
	z.style = (!json.color ? "color:#fff;" : "color:#" + json.color + ";");
	var username = new String(json.username).replace("<", "&lt;")
	var message = new String(json.message).replace("<", "&lt;")
	z.innerHTML = admin_badge + " [" + timestamp + "] " + username + ": " + message;
	chatbox.appendChild(z);

	scrollChat()
}


function sendWithConnect(message) {

	if (window.chatWS.readyState == 1) {
		window.chatWS.send(message)
	} else {
		chatConnect()
		// allow 5 seconds for connection, then send message
		setTimeout(function() {
			console.log("send message");
			window.chatWS.send(message);
		}, 5000);
	}
}


function give5() {
	console.log("test")
	wsSendChat("!give 5")
	_funbits_js__WEBPACK_IMPORTED_MODULE_1__.refreshSpendableFunbitsDisplay();
}

function give50() {
	wsSendChat("!give 50")
	_funbits_js__WEBPACK_IMPORTED_MODULE_1__.refreshSpendableFunbitsDisplay();
}

function give100() {
	wsSendChat("!give 100")

	_funbits_js__WEBPACK_IMPORTED_MODULE_1__.refreshSpendableFunbitsDisplay();
}

function give1000() {
	wsSendChat("!give 500")
	_funbits_js__WEBPACK_IMPORTED_MODULE_1__.refreshSpendableFunbitsDisplay();
}

function xcontrol50() {
	wsSendChat("!xcontrol 50")
	_funbits_js__WEBPACK_IMPORTED_MODULE_1__.refreshSpendableFunbitsDisplay();
}


function popoutChat() {

	_global_js__WEBPACK_IMPORTED_MODULE_2__.popoutChat = true;
	// Opens a new window
	let popoutChatWindow = window.open("/chat.html?c="+window.robot_id, "popoutChatWindow", "menubar=0,width=300,height=600");
	//hide chat div
	document.getElementById("col-right").style.display = "none";
	//stretch out video
	let savedcss = document.getElementById("col-left").style.width;
	document.getElementById("col-left").style.width = "calc((100% - 230px) - 0%)";
	//disconnect the websocket
	window.chatWS.close();

	let popupCloseChecker = setInterval(function() {
		if (popoutChatWindow.closed) {
			_global_js__WEBPACK_IMPORTED_MODULE_2__.popoutChat = false;
			console.log("popout chat was closed");
			//recreate the div 
			document.getElementById("col-right").style.display = "block";
			document.getElementById("col-left").style.width = savedcss;
			//reconnect main page chat
			clearInterval(popupCloseChecker);
		}
	}, 100);
}

function expScrollChat() {
	scrollChat();
}

async function getChatEndpoint(refresh = false) {

	let endpoint = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.chat_service;

	if(refresh){
		endpoint = await _util_js__WEBPACK_IMPORTED_MODULE_0__.getService("rschat");
		console.log("getService rschat:", endpoint)
	}

	if (endpoint == null){
		// default to old chat endpoint without get random
		endpoint = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.chat_ssl;
	}

	// override stuff
	if (_config_js__WEBPACK_IMPORTED_MODULE_4__.chat_endpoint_override !== undefined ) {
		console.log("chat override setting:", _config_js__WEBPACK_IMPORTED_MODULE_4__.chat_endpoint_override);
		endpoint = _config_js__WEBPACK_IMPORTED_MODULE_4__.chat_endpoint_override;
	}

    let urlProtocol = _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol('websocket');
    window.chatUrl = urlProtocol+"//"+endpoint.host+":"+endpoint.port+"/";
    return window.chatUrl;
}


async function chatReconnect() {
	// dont retry if connected
    if (!window.chatWS || window.chatWS.readyState != 1) {
    	await getChatEndpoint(true) //true for refresh
        chatConnect()
    }
}


function chatConnect() {
	if (window.chatWS) {
		try {
			window.chatWS.close();
		}
		catch (err) {
			console.error(err);
		}
	}

	console.log("Chat starting connect to: ", window.chatUrl);
	//if (window.chatWS) window.chatWS.close() // already has checks
	window.chatWS = new WebSocket(window.chatUrl);

	window.chatWS.onopen = function(event) {
		// robot ownerid and robotid is required to send when globalchat disabled
		window.chatWS.send(JSON.stringify({
			type: 'connect',
			message: 'joined',
			token: window.localStorage.getItem("robotstreamer_token"),	//only required on connect
			robot_id: window.robot_id.toString(),						//only required on connect
			owner_id: window.owner_id.toString() 						//only required on connect
		}));
	};
    window.chatWS.onerror = function(err) {
        window.chatWS.close();
    };
    window.chatWS.onclose = function(err) {
        console.warn('Chat ws closed:', err);
    };
	window.chatWS.onmessage = function(event) {
		if (!firstMessageReceived) {
			firstMessageReceived = true;
			//failsafe
			setTimeout(function() {
				if (!historyReceived) {
					//proceed as normal if history is missing
					historyReceived = true;
					clearChat();
					historyExecuted = true;
					for (let i = 0; i < feignChatPauseQueue.length; i++) {
						onMessageReceived(feignChatPauseQueue[i], false);
					}
					for (let i = 0; i < chatPauseQueue.length; i++) {
						onMessageReceived(chatPauseQueue[i]);
					}
				}
			}, 3000);
		}
		
		if (!historyExecuted) {
			let json = JSON.parse(event.data);
			try {
				//only queue actual messages
				if (json.type === undefined) {
					chatPauseQueue.push(event.data);
				}
				else {
					onMessageReceived(event.data);
				}
			}
			catch (err) {
				console.error(err);
			}
		}
		else {
			onMessageReceived(event.data);
		}
	}

}


async function initChatBox(userID, initOptions) {

	var API = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI
	_global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad = API.tts_price
	window.owner_id = API.owner //set owner for chat join
	if (initOptions) {
		chatExtraOptions = initOptions;
		setTimeout(function() {
			scrollChat(true);
		}, 5000);
	}

	if (chatExtraOptions['controls_disabled']) {
		let controlsTop = document.getElementById("chat-titlebar");
		let controlsBottom = document.getElementById("chat-input");
		let msgContainer = document.getElementById("messages-container");
		let mainPopout = document.getElementsByClassName("popout-chat-main")[0];
		let colRight = document.getElementById("col-right");
		if (controlsTop) {
			controlsTop.style.display = "none";
		}
		if (controlsBottom) {
			controlsBottom.style.display = "none";
		}
		if (msgContainer) {
			msgContainer.classList.add("noscrollbar");
			msgContainer.style.setProperty("height", "100%", "important");
		}
		if (mainPopout) {
			mainPopout.style.width = "100vw";
		}
		if (colRight) {
			colRight.style.backgroundColor = chatExtraOptions['background_color'] || "transparent";
		}
	}
	if (chatExtraOptions['size']) {
		document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?&family=Source+Sans+Pro&display=swap">');
		document.head.insertAdjacentHTML("beforeend", "<style>\
		.message-info-name, .message-info-channel, .message-content {font-size:" + chatExtraOptions['size'] + "px !important; font-weight: bold !important; font-family: 'Source Sans Pro' !important; text-shadow: 1px 1px black !important;}\
		.message-content {color: #f7f7f7 !important;}\
		.chat-avatar {width:" + chatExtraOptions['size'] + "px !important;height:" + chatExtraOptions['size'] + "px !important;}\
		.message-icons img {width:" + chatExtraOptions['size'] + "px !important;}\
		</style>");
	}
	if (chatExtraOptions['background_color']) {
		document.head.insertAdjacentHTML("beforeend", "<style>html, body {background-color: " + chatExtraOptions['background_color'] + " !important;}</style>");
	}
	if (chatExtraOptions['tts_bar_disabled']) {
		document.head.insertAdjacentHTML("beforeend", "<style>.tts {border-left: initial !important;}</style>");
	}

	// chat autoscrolling + indicator
	var chatMessagesIndicator = document.getElementById("messages-container-scroll-indicator")
	var chatMessagesBox = document.getElementById("messages-container")
	let chatOptionsIcon = document.getElementById("chat-options-icon");
	let timestampOption = document.getElementById("chat-option-timestamps");
	let fullscreenOption = document.getElementById("chat-option-fullscreen");
	let avatarsOption = document.getElementById("chat-option-avatars");
	let emotesOption = document.getElementById("chat-option-emotes");
	addChatOption("chat-option-previewer-show-unapproved", "chat_show_unapproved", "change");
	addChatOption("chat-option-previewer-show-unsafe", "chat_show_unsafe", "change");
	addChatOption("chat-option-previewer-show-ignored-unapproved", "chat_show_ignored_unapproved", "change");
	addChatOption("chat-option-global-chat-unrecommended-streams", "chat_global_show_unrecommended", "change");
	addChatOption("chat-option-global-chat-disliked-streams", "chat_global_show_disliked", "change");
	addChatOption("chat-option-mention-notify", "chat_mention_notify", "change");
	addChatOption("chat_option_poweruser_link_protection_disabled", "link_protection_disabled", "change");
	addChatOption("chat_option_global_chat_show_bots", "chat_bots_global", "change");

	chatMessagesIndicator.style.display = 'none'

	chatMessagesIndicator.onclick = function(e) {
		chatMessagesIndicator.style.display = 'none'
		shouldAutoScroll = true
		scrollChat()
	}
	scrollChat = function(enableAutoscroll) {
		if (enableAutoscroll) shouldAutoScroll = true
		if (shouldAutoScroll) {
			chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
			chatMessagesIndicator.style.display = 'none'
			//scroll again in case 3rd party tools are editing font size
			setTimeout(function() {
				chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
			}, 0);
		} else {
			chatMessagesIndicator.style.display = 'block'
		}
	}
	chatMessagesBox.onscroll = function(e) {
		var max = chatMessagesBox.scrollTopMax || chatMessagesBox.scrollHeight - chatMessagesBox.getBoundingClientRect().height
		if (chatMessagesBox.scrollTop + 5 > max) {
			shouldAutoScroll = true
			chatMessagesIndicator.style.display = 'none'
		} else {
			shouldAutoScroll = false
			chatMessagesIndicator.style.display = 'block'
		}
	}
	
	//setup chat options icon
	if (chatOptionsIcon) {
		chatOptionsIcon.addEventListener("click", function() {
			let optionsMenu = document.getElementById("chat-options-window");
			if (optionsMenu) {
				chatOptionsOpen = !chatOptionsOpen;
				if (chatOptionsOpen) {
					optionsMenu.style.display = "block";
				}
				else {
					optionsMenu.style.display = "none";
				}
			}
		});
	}
	
	//setup timestamp selector and events
	if (timestampOption) {
		let timestampMode = parseInt(localStorage.getItem("timestamp_mode"));
		if (!timestampMode) {
			timestampMode = 0;
		}
		timestampOption.selectedIndex = timestampMode;
		
		timestampOption.addEventListener("change", function() {
			localStorage.setItem("timestamp_mode", timestampOption.selectedIndex);
		});
	}
	
	if (fullscreenOption) {
		if (localStorage.getItem("fullscreen_chat")) {
			fullscreenOption.value = localStorage.getItem("fullscreen_chat");
		}
		
		fullscreenOption.addEventListener("change", function() {
			localStorage.setItem("fullscreen_chat", fullscreenOption.value);
			//move chat pane back if already fullscreened
			if (document.fullscreenElement && fullscreenOption.value == "false") {
				let chatArea = document.getElementById("col-right");
				let hlsControls = document.getElementById("in_video_controls");
				if (chatArea) {
					chatArea.classList.remove("fullscreen-chat");
					if (hlsControls) {
						hlsControls.classList.remove("fullscreen-chat");
					}
					let mainEle = document.getElementsByTagName("main")[0];
					if (mainEle) {
						setTimeout(function() {
							mainEle.appendChild(chatArea);
							let chatScroll = document.getElementById("messages-container");
							if (chatScroll) {
								//scroll chat down
								chatScroll.scrollTop = chatScroll.scrollHeight
							}
						}, 0);
					}
				}
			}
		});
	}
	
	if (avatarsOption) {
		if (localStorage.getItem("chat_avatars")) {
			avatarsOption.value = localStorage.getItem("chat_avatars");
		}
		
		avatarsOption.addEventListener("change", function() {
			localStorage.setItem("chat_avatars", avatarsOption.value);
		});
	}
	
	if (emotesOption) {
		if (localStorage.getItem("chat_emotes")) {
			emotesOption.value = localStorage.getItem("chat_emotes");
		}
		
		emotesOption.addEventListener("change", function() {
			localStorage.setItem("chat_emotes", emotesOption.value);
		});
	}

	//set window.chatUrl. false for api endpoints
	//					  true for new endpoints
	await getChatEndpoint(false)
	chatConnect(chatUrl);

	setInterval(async function() {
		// stop reconnect if popout as popout closes the connection
		if (!_global_js__WEBPACK_IMPORTED_MODULE_2__.popoutChat) {
			// only connects if disconnected
			await chatReconnect();
		}
	}, 5000);

	try {
		document.getElementById("popout_chat").addEventListener("click", popoutChat);
	} catch (err) {
		console.error(err);
	}

	// initialize buttons for giving tips
	try {
		//holy mess
		let g5 = document.getElementById("give_5")
		//let g50 = element("give_50")
		let xcontrol50element = document.getElementById("xcontrol_50")
		let g100 = document.getElementById("give_100")
		let g1000 = document.getElementById("give_1000")
		g5.addEventListener("click", give5)
		//g50.addEventListener("click", give50)
		xcontrol50element.addEventListener("click", xcontrol50)
		g100.addEventListener("click", give100)
		g1000.addEventListener("click", give1000)

		// initialize buttons for giving tips mobile

		let g5a = document.getElementById("give_5a")
		g5a.addEventListener("click", give5)

		//let g50a = element("give_50a")
		let xcontrol50aelement = document.getElementById("xcontrol_50a")
		let g100a = document.getElementById("give_100a")
		let g1000a = document.getElementById("give_1000a")

		//g50a.addEventListener("click", give50)
		xcontrol50aelement.addEventListener("click", xcontrol50)
		g100a.addEventListener("click", give100)
		g1000a.addEventListener("click", give1000)

		// initialize buttons for giving tips because lazy
		let g5b = document.getElementById("give_5b")
		g5b.addEventListener("click", give5)


	} catch (err) {
		console.error("mobile ignore:", err);
	}

	// chrome finally went with the standard of autocomplete but rand it up for now
	var randomIdMsgBox = 'user_message' + Math.floor(Math.random() * 999999) + 1;
	messageBox.id = randomIdMsgBox
	messageBox = document.getElementById(randomIdMsgBox);

	// enter key listen
	messageBox.addEventListener("keydown", onMessageBoxKeyDown, false);
	
	//chat submit button setup
	let chatSubmitButton = document.getElementById("chat_input_submit");
	if (chatSubmitButton) {
		chatSubmitButton.addEventListener("click", onChatSubmit);
	}
	
	//TTS Price Notify
	messageBox.addEventListener("focus", function() {
		if (window.TtsPriceNotified !== true && _global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad && _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.spendable_funbits && document.getElementById("checkbox_tts").checked && _global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad > 0 && _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.spendable_funbits >= _global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad) {
			window.TtsPriceNotified = true;
			let notifyBubble = document.createElement("span");
			notifyBubble.className = "tts-notify-bubble";
			notifyBubble.innerText = "TTS costs " + _global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad.toString() + " funbit" + (_global_js__WEBPACK_IMPORTED_MODULE_2__.ttsPriceOnLoad == 1 ? "" : "s");
			document.getElementsByClassName("chat-input-top")[0].appendChild(notifyBubble);
			let bubbleFader = setInterval(function() {
				notifyBubble.style.opacity = "0";
			}, 1000);
			let bubbleKiller = setInterval(function() {
				notifyBubble.remove();
			}, 5000);
			notifyBubble.addEventListener("click", function() {
				clearTimeout(bubbleKiller);
				clearTimeout(bubbleFader);
				notifyBubble.remove();
			});
		}
	});
	
	//visual indicator that a command is being typed
	let ttsTextCheckbox = document.getElementById("checkbox_tts");
	if (ttsTextCheckbox) {
		let ttsTextIndicator = ttsTextCheckbox.parentElement.querySelector(".slider");
		messageBox.addEventListener("input", function() {
			if (this.value.startsWith("/") && ttsTextCheckbox.checked) {
				ttsTextIndicator.innerText = "/";
				ttsTextIndicator.style.color = "#FFD56A"
			}
			else {
				ttsTextIndicator.innerText = "TTS";
				ttsTextIndicator.style.color = "";
			}
		});
		ttsTextCheckbox.addEventListener("change", function() {
			if (this.checked && messageBox.value.startsWith("/")) {
				ttsTextIndicator.innerText = "/";
				ttsTextIndicator.style.color = "#FFD56A"
			}
			else {
				ttsTextIndicator.innerText = "TTS";
				ttsTextIndicator.style.color = "";
			}
		});
	}

	//tell user if login expired
	if (_global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.bad_login) {
		let jsonfeign = {
				"message": "Your login has expired. Please login again.", 
				"username": "[RS BOT]", 
				"color": "fff", 
				"tts": false}
		onMessageReceived(jsonfeign, false);
		scrollChat();
	}
	
	let previewPanelTitle = document.getElementById("preview_panel_title");
	if (previewPanelTitle) {
		previewPanelTitle.onclick = function(e) {
			let panelContents = document.getElementById("preview_panel_contents");
			if (panelContents) {
				if (panelContents.style.display == "none" || panelContents.style.display == "") {
					panelContents.style.display = "block";
				}
				else {
					panelContents.style.display = "none";
					if (panelContents.childElementCount < 1) {
						let previewPanel = document.getElementById("preview_panel");
						if (previewPanel) {
							previewPanel.style.display = "none";
						}
					}
				}
			}
		}
	}
	
	//setup emote menu
	let globalEmotes = {
		pHappy:			"/images/emotes/pSmile.png",
		pDead:			"/images/emotes/pDead.png",
		pSilly:			"/images/emotes/pSilly.png",
		pLewd:			"/images/emotes/pLewd.png",
		pSob:				"/images/emotes/pSob.png",
		pLaugh:			"/images/emotes/pLaugh.png",
		pEvil:			"/images/emotes/pEvil.png",
		pNSFW:			"/images/emotes/pNSFW.png",
		pPog:				"/images/emotes/pPog.png",
		pDerp:			"/images/emotes/pDerp.png",
		pHonk:			"/images/emotes/pHonk.png",
		pGay:				"/images/emotes/pGay.png",
		pHeart:			"/images/emotes/pHeart.png",
		eWorm:			"/images/emotes/eWorm.png",
		hydraYikes:	"/images/emotes/hydraYikes.png",
		boredRob: 	"/images/emotes/boredRob.png",
		dewReese: 	"/images/emotes/dewReese.png",
		meffKaren: 	"/images/emotes/meffKaren.png"
	};
	let emotesPane = document.getElementById("emote-menu");
	if (emotesPane) {
		for (let [emote, emoteUrl] of Object.entries(globalEmotes)) {
			let newEmote = document.createElement("img");
			newEmote.src = emoteUrl;
			newEmote.className = "emote-menu-icon";
			newEmote.title = emote;
			newEmote.alt = emote;
			newEmote.addEventListener("click", function() {
				if (messageBox) {
					let chatText = messageBox.value;
					let emoteText = "";
					if (chatText == "" || chatText.endsWith(" ")) {
						emoteText = emote;
					}
					else {
						emoteText = " " + emote;
					}
					messageBox.value = messageBox.value + emoteText;
					messageBox.focus();
				}
			});
			emotesPane.appendChild(newEmote);
		}
	}
}

function addToPreviewPanel(json) {
	if (json.unsafe === true) {
		return;
	}
	if (json.highlighted_no_ui === true) {
		return;
	}
	if (safeIgnores[json.user_id]) {
		return;
	}

	let previewPanel = document.getElementById("preview_panel");
	if (previewPanel) {
		previewPanel.style.display = "block";
	}
	
	let panelContents = document.getElementById("preview_panel_contents");
	if (panelContents) {
		let existingPreview = document.getElementById("previewuser" + json.user_id);
		if (existingPreview) {
			existingPreview.previewName.innerText = json.username;
			let lastMsg = document.createElement("div");
			lastMsg.innerText = "“" + json.message + "” - Room " + json.robot_id;
			existingPreview.msgsContainer.appendChild(lastMsg);
		}
		else {
			let newPreview = document.createElement("div");
			newPreview.id = "previewuser" + json.user_id;
			newPreview.classList.add("preview_panel_object");
			let name = document.createElement("div");
			let msgsContainer = document.createElement("div");
			msgsContainer.classList.add("preview_panel_messages");
			let lastMsg = document.createElement("div");
			let buttonContainer = document.createElement("div");
			let buttonAccept = document.createElement("button");
			let buttonReject = document.createElement("button");
			let buttonIgnore = document.createElement("button");
			buttonAccept.innerText = "Safe";
			buttonReject.innerText = "Unsafe";
			buttonIgnore.innerText = "Ignore";
			
			buttonAccept.onclick = function(e) {
				wsSendChat("/marksafe " + json.username);
				finishPreviewElement(panelContents, newPreview);
			}
			buttonReject.onclick = function(e) {
				wsSendChat("/markunsafe " + json.username);
				finishPreviewElement(panelContents, newPreview);
			}
			buttonIgnore.onclick = function(e) {
				safeIgnores[json.user_id] = true;
				finishPreviewElement(panelContents, newPreview);
			}
			
			name.innerText = json.username;
			lastMsg.innerText = "“" + json.message + "” - Room " + json.robot_id;
			
			buttonContainer.appendChild(buttonAccept);
			buttonContainer.appendChild(buttonReject);
			buttonContainer.appendChild(buttonIgnore);
			newPreview.appendChild(name);
			newPreview.appendChild(msgsContainer);
			msgsContainer.appendChild(lastMsg);
			newPreview.appendChild(buttonContainer);
			newPreview.previewName = name;
			newPreview.msgsContainer = msgsContainer;
			panelContents.appendChild(newPreview);
		}
		flashPreviewPanel();
	}
}

function flashPreviewPanel() {
	let previewPanelTitle = document.getElementById("preview_panel_title");
	if (previewPanelTitle && !(previewPanelTitle.classList.contains("newmsg"))) {
		previewPanelTitle.classList.add("newmsg");
		setTimeout(function() {
			previewPanelTitle.classList.remove("newmsg");
		}, 500);
	}
}

function finishPreviewElement(panelContents, item) {
	panelContents.removeChild(item);
	if (panelContents.childElementCount < 1) {
		panelContents.style.display = "none";
		let previewPanel = document.getElementById("preview_panel");
		if (previewPanel) {
			previewPanel.style.display = "none";
		}
	}
}

function toTimeDigits(timeNum) {
	if (timeNum < 10) {
		return "0" + String(timeNum);
	}
	else {
		return String(timeNum);
	}
}

function setupFullscreenChat(videoScreen) {
	if (videoScreen) {
		videoScreen.addEventListener("fullscreenchange", function(event) {
			let fullscreenChatEnabled = localStorage.getItem("fullscreen_chat");
			if (fullscreenChatEnabled != "false") {
				let chatArea = document.getElementById("col-right");
				let hlsControls = document.getElementById("in_video_controls");
				if (chatArea) {
					//remove existing unsafe link message if exists
					let oldUnsafeLinkMessage = document.getElementById("link-click-window");
	        if (oldUnsafeLinkMessage) {
	          oldUnsafeLinkMessage.remove();
	        }
					
					if (document.fullscreenElement) {
						chatArea.classList.add("fullscreen-chat");
						if (hlsControls) {
							hlsControls.classList.add("fullscreen-chat");
						}
						//firefox needs time between class change and element moving
						setTimeout(function() {
							videoScreen.appendChild(chatArea);
							let chatScroll = document.getElementById("messages-container");
							if (chatScroll) {
								//scroll chat down
								chatScroll.scrollTop = chatScroll.scrollHeight
							}
						}, 0);
					}
					else {
						chatArea.classList.remove("fullscreen-chat");
						if (hlsControls) {
							hlsControls.classList.remove("fullscreen-chat");
						}
						let mainEle = document.getElementsByTagName("main")[0];
						if (mainEle) {
							setTimeout(function() {
								mainEle.appendChild(chatArea);
								let chatScroll = document.getElementById("messages-container");
								if (chatScroll) {
									//scroll chat down
									chatScroll.scrollTop = chatScroll.scrollHeight
								}
							}, 0);
						}
					}
				}
			}
		});
	}
}

let ttsDurationElement = document.getElementById("ttsDuration");
if (ttsDurationElement) {
	ttsDurationElement.addEventListener("change", function() {
		if (parseInt(ttsDurationElement.value) != NaN) {
			ttsMaxDuration = parseInt(ttsDurationElement.value);
		}
	});
}

function hlsReroll() {
  let randTime = Math.random() * 5000;
  setTimeout(async function() {
    let endpoint = await _util_js__WEBPACK_IMPORTED_MODULE_0__.getRandomEndpoint("rshls", "100");
    if (endpoint) {
      let player = document.getElementById("video_hls");
			if (player && player.player && player.player.doReconnect) {
				player.player.doReconnect(endpoint.host, endpoint.port);
			}
    }
  }, randTime);
}

function webrtcMigrate() {
	let randTime = Math.random() * 5000;
  setTimeout(async function() {
    let endpoint = await _util_js__WEBPACK_IMPORTED_MODULE_0__.getRandomEndpoint("webrtc_sfu", "100");
    if (endpoint) {
			_global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.rtc_sfu = endpoint;
    }
  }, randTime);
	
	setTimeout(function() {
		let localRTCVideo = document.getElementById('video_rtc');
		if (localRTCVideo && localRTCVideo.doReconnect) {
			localRTCVideo.doReconnect();
		}
	}, 6000 + (Math.random() * 1000));
}

function getStreamSuffix(botName, robot_id) {
	let suffix = '';
	if (robot_id === undefined || robot_id == '0') {
		return suffix;
	}
	if (botName in usedStreamNames && usedStreamNames[botName] != robot_id) {
		suffix = '<sup>' + _util_js__WEBPACK_IMPORTED_MODULE_0__.stripTagsAndQuotes(robot_id) + '</sup>';
	}
	return suffix;
}

function openChatUserOptions(userName, userId) {
	if (!userPrivilegesSet) {
		return;
	}

	let oldUserOptions = document.getElementById("user_options_window");
	if (oldUserOptions) {
		oldUserOptions.remove();
	}
	let userOptions = document.createElement("DIV");
	userOptions.id = "user_options_window";
	
	let menus = [];
	menus[0] = '<div class="user-options-menus" menutype="0"><label for="user_options_window_field_reason">Reason</label><input type="text" id="user_options_window_field_reason"></div>';
	menus[1] = '<div class="user-options-menus" menutype="1"><label for="user_options_window_field_duration">Duration:</label><div><input type="number" placeholder="5" id="user_options_window_field_duration"><select id="user_options_window_field_duration_units"><option value="1">Seconds</option><option value="60">Minutes</option><option value="3600">Hours</option><option value="86400">Days</option></select></div><label for="user_options_window_field_reason">Reason</label><input type="text" id="user_options_window_field_reason"></div>';
	menus[2] = '<div class="user-options-menus" menutype="2"><label for="user_options_window_field_remove">Remove</label><label class="checkbox"><input type="checkbox" id="user_options_window_field_remove"><span class="checkbox-slider"></span></label><label for="user_options_window_field_reason">Reason</label><input type="text" id="user_options_window_field_reason"></div>';
	menus[3] = '<div class="user-options-menus" menutype="3"><div id="user_options_window_tags_display">Loading...</div><span id="user_options_menu_tag_add_button"><img title="Add New Tag" alt="Add New Tag" src="/images/icon-addrobot.svg"></span><label id="user_options_window_field_tag_edit_mode_label" for="user_options_window_field_tag_edit_mode">Add/Edit</label><label class="checkbox"><input type="checkbox" id="user_options_window_field_tag_edit_mode"><span class="checkbox-slider checkbox-slider-negative"></span></label><label for="user_options_window_field_tag_name">Tag Name</label><input disabled type="text" id="user_options_window_field_tag_name"><div class="slider-label-container"><span class="slider-label" id="user_options_window_field_tag_slider_label">&nbsp;</span></div><div class="tag-slider-container"><input disabled type="range" min="-1" max="1" step="1" class="streamer-tag-slider" id="user_options_window_field_tag_slider"></div></div>';
	menus[4] = '<div class="user-options-menus" menutype="4"><label for="user_options_window_field_gmod_message">Message</label><textarea id="user_options_window_field_gmod_message" wrap="soft" maxlength="10000"></textarea></div>';
	menus[5] = '<div class="user-options-menus" menutype="5"><label id="user_options_window_field_enabled_text" for="user_options_window_field_enabled">Loading...</label><label class="checkbox"><input type="checkbox" id="user_options_window_field_enabled"><span class="checkbox-slider"></span></label></div>';

	let sliderColorMap = [];
	sliderColorMap[-1] = "rgb(252, 92, 101)"; 
	sliderColorMap[0] = "rgb(73, 168, 255)";
	sliderColorMap[1] = "rgb(29, 209, 161)";
	let sliderTextMap = [];
	sliderTextMap[-1] = "Anti"; 
	sliderTextMap[0] = "Neutral";
	sliderTextMap[1] = "Pro";

	let apiFuncs = {}
	apiFuncs['EditStreamerTags'] = {}
	apiFuncs['EditStreamerTags']['OnOpen'] = async function() {
		streamerTagsOnOpen(false, "EditStreamerTags");
	}
	apiFuncs['EditStreamerTags']['OnSubmit'] = async function(isDeleting) {
		return streamerTagsOnSubmit(false, isDeleting);
	}
	apiFuncs['EditStreamerTags']['OnSubmitResponse'] = function(result, wasDeletion) {
		streamerTagsOnSubmitResponse(false, result, wasDeletion);
	}
	apiFuncs['EditStreamerTags']['OnDeleteToggle'] = function(deleteMode) {
		streamerTagsOnDeleteToggle(false, deleteMode);
	}
	apiFuncs['EditStreamerTags']['CreateTag'] = function(tagName = "", tagValue = 0) {
		return streamerTagsCreateTag(false, tagName, tagValue);
	}
	apiFuncs['EditAdminStreamerTags'] = {}
	apiFuncs['EditAdminStreamerTags']['OnOpen'] = async function() {
		streamerTagsOnOpen(true, "EditAdminStreamerTags");
	}
	apiFuncs['EditAdminStreamerTags']['OnSubmit'] = async function(isDeleting) {
		return streamerTagsOnSubmit(true, isDeleting);
	}
	apiFuncs['EditAdminStreamerTags']['OnSubmitResponse'] = function(result, wasDeletion) {
		streamerTagsOnSubmitResponse(true, result, wasDeletion);
	}
	apiFuncs['EditAdminStreamerTags']['OnDeleteToggle'] = function(deleteMode) {
		streamerTagsOnDeleteToggle(true, deleteMode);
	}
	apiFuncs['EditAdminStreamerTags']['CreateTag'] = function(tagName = "", tagValue = 0) {
		return streamerTagsCreateTag(true, tagName, tagValue);
	}

	apiFuncs['GmodMessage'] = {};
	apiFuncs['GmodMessage']['OnSubmit'] = async function() {
		let gmodMsg = document.getElementById("user_options_window_field_gmod_message").value;
		let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST2(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + "/v1/send_gmod_message", {moderator_token: localStorage.getItem("robotstreamer_token"), target_user_id: userId, message: gmodMsg});
		if (result?.data === undefined) {
			_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat("Something went wrong. Please try again later.")
		}
		else if (result.data.msg) {
			_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat(result.data.msg);
		}
		return result;
	}

	apiFuncs['MediaTimeout'] = {};
	apiFuncs['MediaTimeout']['OnOpen'] = async function() {
		let mediaTimeoutCheckbox = document.getElementById("user_options_window_field_enabled");
		let mediaTimeoutCheckboxText = document.getElementById("user_options_window_field_enabled_text");
		mediaTimeoutCheckbox.addEventListener("change", function(){
			this.UserEdited = true;
			mediaTimeoutCheckboxText.innerText = (this.checked ? "Enabled" : "Disabled")
		});
		let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST2(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + "/v1/get_media_timeout", {moderator_token: localStorage.getItem("robotstreamer_token"), target_user_id: userId});
		if (result?.data === undefined) {
			_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat("Something went wrong. Please try again later.")
		}
		else {
			if (result.data.status && !mediaTimeoutCheckbox.UserEdited) {
				mediaTimeoutCheckbox.checked = result.data.data;
				mediaTimeoutCheckboxText.innerText = (result.data.data ? "Enabled" : "Disabled");
			}
			else {
				_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat(result.data.msg);
			}
		}
	}
	apiFuncs['MediaTimeout']['OnSubmit'] = async function() {
		let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST2(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + "/v1/set_media_timeout", {moderator_token: localStorage.getItem("robotstreamer_token"), target_user_id: userId, data: document.getElementById("user_options_window_field_enabled").checked});
		if (result?.data === undefined) {
			_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat("Something went wrong. Please try again later.")
		}
		else if (result.data.msg) {
			_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat(result.data.msg);
		}
	}


	async function streamerTagsOnOpen(isAdminTags, buttonCmdName) {
		let tagUrl = "/v1/get_streamer_tags";
		if (isAdminTags) {
			tagUrl = "/v1/get_admin_streamer_tags";
		}
		let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST2(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + tagUrl, {token: localStorage.getItem("robotstreamer_token"), target_user_id: userId});
		let tagBox = document.getElementById("user_options_window_tags_display");
		let menuContainer = document.getElementById("user_options_menu");
		//proceed if user hasn't navgated away while loading
		if (buttonCmdName == menuContainer.activeMenuName) {
			if (result?.data.status === true) {
				tagBox.innerHTML = "";
				for (let i = 0; i < result.data.data.length; i++) {
					if (isAdminTags) {
						apiFuncs['EditAdminStreamerTags']['CreateTag'](result.data.data[i].name, result.data.data[i].value);
					}
					else {
						apiFuncs['EditStreamerTags']['CreateTag'](result.data.data[i].name, result.data.data[i].value);
					}
				}
				if (tagBox.getElementsByClassName("user-options-window-tag-icon").length <= 0) {
					tagBox.innerText = "No tags."
				}
			}
			else {
				tagBox.innerText = "N/A";
			}
		}
	  }
	  
	  async function streamerTagsOnSubmit(isAdminTags, isDeleting) {
		let tagUrl;
		let data = [];
		let tagDivs = userOptions.getElementsByClassName("user-options-window-tag-icon");
		if (isDeleting) {
			tagUrl = '/v1/delete_streamer_tags';
			if (isAdminTags) {
				tagUrl = '/v1/delete_admin_streamer_tags';
			}
			for (let i = 0; i < tagDivs.length; i++) {
				if (tagDivs[i].markedDeleted) {
					data.push(tagDivs[i].innerText);
				}
			}
		}
		else {
			tagUrl = '/v1/modify_streamer_tags';
			if (isAdminTags) {
				tagUrl = '/v1/modify_admin_streamer_tags';
			}
			for (let i = 0; i < tagDivs.length; i++) {
				let tagObj = {}
				tagObj['name'] = tagDivs[i].innerText;
				tagObj['value'] = parseInt(tagDivs[i].tagValue);
				if (tagDivs[i].initialName != "" && tagDivs[i].initialName != tagDivs[i].innerText) {
					tagObj['old_name'] = tagDivs[i].initialName;
				}
				data.push(tagObj);
			}
		}
		let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST2(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + tagUrl, {token: localStorage.getItem("robotstreamer_token"), target_user_id: userId, tags: data});
		if (result?.data === undefined) {
			_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat("Something went wrong. Please try again later.")
		}
		else {
			if (result.data.err_list) {
				try {
					for (let i = 0; i < result.data.err_list.length; i++) {
						_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat(result.data.err_list[i]);
					}
				}
				catch (err) {
					console.error(err);
				}
			}
			if (result.data.msg) {
				_util_js__WEBPACK_IMPORTED_MODULE_0__.printToChat(result.data.msg);
			}
		}
		return result;
	  }
	  
	  function streamerTagsOnSubmitResponse(isAdminTags, result, wasDeletion) {
		let success = result?.data.status;
		if (success) {
			let tagDivs = document.querySelectorAll('#user_options_window .user-options-window-tag-icon');
			if (wasDeletion) {
				for (let i = 0; i < tagDivs.length; i++) {
					if (tagDivs[i].markedDeleted) {
						tagDivs[i].remove();
					}
				}
				let tagBox = document.getElementById("user_options_window_tags_display");
				if (tagBox.getElementsByClassName("user-options-window-tag-icon").length <= 0) {
					tagBox.innerText = "No tags."
				}
			}
			else {
				let successfulRenames = result?.data.successful_renames
				try {
					for (let i = 0; i < successfulRenames.length; i++) {
						for (let tagI = 0; tagI < tagDivs.length; tagI++) {
							if (successfulRenames[i] == tagDivs[tagI].initialName) {
								tagDivs[tagI].initialName = tagDivs[tagI].innerText;
							}
						}
					}
				}
				catch (err) {
					console.error(err);
				}
				//tags with empty initial state are brand new
				for (let i = 0; i < tagDivs.length; i++) {
					if (tagDivs[i].initialName == "") {
						tagDivs[i].initialName = tagDivs[i].innerText;
					}
				}
			}
		}
	  }
	  
	  function streamerTagsOnDeleteToggle(isAdminTags, deleteMode) {
		let tagNameField = document.getElementById("user_options_window_field_tag_name");		
		let tagValueLabel = document.getElementById("user_options_window_field_tag_slider_label");
		let tagValueSlider = document.getElementById("user_options_window_field_tag_slider");
		let tagAddButton = document.getElementById("user_options_menu_tag_add_button");
		tagNameField.value = "";
		tagNameField.selectedTag = undefined;
		tagNameField.disabled = true;
		tagNameField.placeholder = "";
		tagValueLabel.innerHTML = "&nbsp;";
		tagValueLabel.selectedTag = undefined;
		tagValueLabel.disabled = true;
		tagValueLabel.style.color = "";
		tagValueSlider.value = 0;
		tagValueSlider.selectedTag = undefined;
		tagValueSlider.disabled = true;
		tagValueSlider.style.backgroundColor = "";
		let tagEditModeLabel = document.getElementById("user_options_window_field_tag_edit_mode_label");
		if (deleteMode) {
			tagEditModeLabel.innerText = "Delete";
			tagEditModeLabel.style.color = "#FF0000";
			tagAddButton.classList.add("user-options-menu-tag-add-button-disabled");
			tagAddButton.disabled = true;
		}
		else {
			tagEditModeLabel.innerText = "Add/Edit";
			tagEditModeLabel.style.color = "";
			tagAddButton.classList.remove("user-options-menu-tag-add-button-disabled");
			let tagDivs = userOptions.getElementsByClassName("user-options-window-tag-icon");
			tagAddButton.disabled = false;
			for (let i = 0; i < tagDivs.length; i++) {
				tagDivs[i].markedDeleted = false;
				tagDivs[i].classList.remove("user-options-window-tag-icon-marked-delete");
			}
		}
	  }
	  
	  function streamerTagsCreateTag(isAdminTags, tagName, tagValue) {
		let newTag = document.createElement("div");
		newTag.classList.add("user-options-window-tag-icon");
		newTag.classList.add("noselect");
		newTag.innerText = tagName;
		newTag.initialName = tagName;
		newTag.style.backgroundColor = sliderColorMap[tagValue];
		newTag.tagValue = tagValue;
		newTag.addEventListener("click", function() {
			if (document.getElementById("user_options_window_field_tag_edit_mode").checked) {
				this.markedDeleted = !this.markedDeleted
				if (this.markedDeleted) {
					this.classList.add("user-options-window-tag-icon-marked-delete");
				}
				else {
					this.classList.remove("user-options-window-tag-icon-marked-delete");
				}
			}
			else {
				let tagNameField = document.getElementById("user_options_window_field_tag_name");
				tagNameField.value = this.innerText;
				tagNameField.selectedTag = this;
				tagNameField.disabled = false;
				tagNameField.placeholder = "Tag Name";
				let tagValueSlider = document.getElementById("user_options_window_field_tag_slider");
				let tagValueLabel = document.getElementById("user_options_window_field_tag_slider_label");
				tagValueSlider.disabled = false;
				tagValueSlider.value = this.tagValue;
				tagValueSlider.selectedTag = this;
				tagValueSlider.style.backgroundColor = sliderColorMap[this.tagValue];
				tagValueLabel.style.color = sliderColorMap[this.tagValue];
				tagValueLabel.innerText = sliderTextMap[this.tagValue];
			}
		});
		let tagBox = document.getElementById("user_options_window_tags_display");
		if (tagBox.getElementsByClassName("user-options-window-tag-icon").length <= 0) {
			tagBox.innerHTML = "";
		}
		tagBox.appendChild(newTag);
		return newTag;
	  }

	
	let userOptionsContent = '<div id="user_options_title_bar"><div id="user_options_user_dropdown"></div><div id="user_options_selected_user_container"><div id="user_options_selected_user">' + userName + '</div><img id="user_options_selected_user_arrow" src="/images/streamarrow.svg"></div><span id="user_options_close"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span></div><div class="user-options-vertical-spacer"></div>';
	userOptionsContent += '<div id="user_options_selections">';
	if (userPrivileges['gmod']) {
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="gban" menutype="2">Global Ban</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="ungban" menutype="0">Un-Global Ban</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="gto" menutype="1">Global Timeout</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="gr" menutype="-1">Global Remove</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="streamerban" menutype="0">Streamer Ban</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="streamerunban" menutype="0">Un-Streamer Ban</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="EditStreamerTags" apicmd="EditStreamerTags" menutype="3">Edit Streamer Tags</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="EditAdminStreamerTags" apicmd="EditAdminStreamerTags" menutype="3">Edit Admin Streamer Tags</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="GmodMessage" apicmd="GmodMessage" menutype="4" submittext="Send Gmod Message">Global Mod Message</div>';
	}
	if (userPrivileges['previewer']) {
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="marksafe" menutype="-1">Mark Safe</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="markunsafe" menutype="-1">Mark Unsafe</div>';
	}
	if (userPrivileges['owner'] || userPrivileges['mod']) {
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="ban" menutype="2">Ban</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="unban" menutype="0">Unban</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="to" menutype="1">Timeout</div>';
	}
	if (userPrivileges['owner']) {
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="mod" menutype="-1">Mod</div>';
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="unmod" menutype="-1">Un-Mod</div>';
	}
	if (userPrivileges['dev']) {
		userOptionsContent += '<div class="user-options-selection-button user-options-selection-button-disable" cmd="MediaTimeout" apicmd="MediaTimeout" menutype="5" submittext="Set Media Timeout">Media Timeout</div>';
	}
	userOptionsContent += '</div><div id="user_options_menu"></div><div id="user_options_action_container"><div id="user_options_action_button">Action</div></div>';
	userOptions.innerHTML = userOptionsContent;
	
	if (document.fullscreenElement) {
		document.fullscreenElement.appendChild(userOptions);
	}
	else {
		let body = document.getElementsByTagName("BODY")[0];
		body.appendChild(userOptions);
	}
	//TODO manage when change fullscreen
	
	//Build user dropdown
	let userList = [];
	for (let seenUserName of Object.keys(seenUsers)) {
		userList.push(seenUserName);
	}
	userList.sort(function(a, b) {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	let userDropdown = document.getElementById("user_options_user_dropdown");
	let selectedUserContainer = document.getElementById("user_options_selected_user_container");
	let userDropdownArrow = document.getElementById("user_options_selected_user_arrow");
	for (let i = 0; i < userList.length; i++) {
		let newDropdownEntry = document.createElement("div");
		newDropdownEntry.className = "user-options-user-dropdown-item";
		newDropdownEntry.innerText = userList[i];
		newDropdownEntry.UserId = seenUsers[userList[i]];
		newDropdownEntry.addEventListener("click", function() {
			userName = this.innerText;
			userId = this.UserId;
			document.getElementById("user_options_selected_user").innerText = this.innerText;
			userDropdown.style.display = "";
			selectedUserContainer.style.width = "";
			selectButton(document.getElementById("user_options_menu").activeMenuButton);
		});
		userDropdown.appendChild(newDropdownEntry);
	}

	userDropdown.RsOnClose = function() {
		userDropdown.style.display = "";
		selectedUserContainer.style.width = "";
		userDropdownArrow.style.transform = "";
	}

	selectedUserContainer.addEventListener("click", function() {
		if (userDropdown.style.display == "block") {
			userDropdown.RsOnClose();
		}
		else {
			userDropdown.style.display = "block";
			selectedUserContainer.style.width = userDropdown.getBoundingClientRect().width + "px";
			userDropdownArrow.style.transform = "rotate(180deg)";
		}
	});

	let actionButton = document.getElementById("user_options_action_button");
	let allMenuButtons = userOptions.getElementsByClassName("user-options-selection-button");
	let closeButton = document.getElementById("user_options_close");
	
	function selectButton(button) {
		localStorage.setItem("useroptions_last_command_selected", button.getAttribute("cmd"));
		
		let menuContainer = document.getElementById("user_options_menu");
		let menuNum = parseInt(button.getAttribute('menutype'));
		if (menuNum >= 0) {
			menuContainer.innerHTML = menus[menuNum];
		}
		else {
			menuContainer.innerHTML = '&nbsp;';
		}

		menuContainer.activeMenuName = button.getAttribute('cmd');
		menuContainer.activeMenuButton = button;
		
		let reasonField = document.getElementById("user_options_window_field_reason");
		let durationField = document.getElementById("user_options_window_field_duration");
		let durationUnitsField = document.getElementById("user_options_window_field_duration_units");
		let removeField = document.getElementById("user_options_window_field_remove");
		let tagNameField = document.getElementById("user_options_window_field_tag_name");
		let tagValueSlider = document.getElementById("user_options_window_field_tag_slider");
		let tagEditModeSwitch = document.getElementById("user_options_window_field_tag_edit_mode");
		let tagAddButton = document.getElementById("user_options_menu_tag_add_button");
		if (reasonField) {
			reasonField.value = (localStorage.getItem("useroptions_last_reason") || "");
			reasonField.addEventListener("input", function() {
				localStorage.setItem("useroptions_last_reason", reasonField.value);
			});
		}
		if (durationField) {
			durationField.value = (localStorage.getItem("useroptions_last_duration") || "");
			durationField.addEventListener("input", function() {
				localStorage.setItem("useroptions_last_duration", durationField.value);
			});
		}
		if (durationUnitsField) {
			durationUnitsField.value = localStorage.getItem("useroptions_last_duration_units") || "60";
			durationUnitsField.addEventListener("change", function() {
				localStorage.setItem("useroptions_last_duration_units", durationUnitsField.value);
			});
		}
		if (removeField) {
			removeField.checked = localStorage.getItem("useroptions_last_remove") === "true";
			removeField.addEventListener("change", function() {
				localStorage.setItem("useroptions_last_remove", removeField.checked);
			});
		}
		if (tagNameField) {
			function tagNameInputCheck(e) {
				let inputText = "";
				if (e.type == "keypress") {
					inputText = e.key;
				}
				else if (e.type == "paste") {
					inputText = e.clipboardData.getData("text");
				}
				let disallowedPattern = new RegExp("[^a-zA-Z0-9]");
				if (disallowedPattern.test(inputText)) {
					e.preventDefault();
				}
			}
			tagNameField.addEventListener("keypress", tagNameInputCheck);
			tagNameField.addEventListener("paste", tagNameInputCheck);
			tagNameField.addEventListener("input", function(e) {
				if (this.selectedTag) {
					tagNameField.selectedTag.innerText = tagNameField.value;
				}
			});
		}
		if (tagValueSlider) {
			tagValueSlider.addEventListener("input", function() {
				if (this.selectedTag) {
					this.selectedTag.tagValue = this.value;
					this.style.backgroundColor = sliderColorMap[this.value];
					this.selectedTag.style.backgroundColor = sliderColorMap[this.value];
					let tagValueLabel = document.getElementById("user_options_window_field_tag_slider_label");
					tagValueLabel.style.color = sliderColorMap[this.value];
					tagValueLabel.innerText = sliderTextMap[this.value];
				}
			});
		}
		if (tagEditModeSwitch) {
			tagEditModeSwitch.checked = localStorage.getItem("useroptions_last_tag_edit_mode_delete") === "true";
			tagEditModeSwitch.addEventListener("change", function() {
				localStorage.setItem("useroptions_last_tag_edit_mode_delete", tagEditModeSwitch.checked);
				if (button.getAttribute('apicmd')) {
					apiFuncs[button.getAttribute('apicmd')]["OnDeleteToggle"](tagEditModeSwitch.checked);
				}
			});
			if (button.getAttribute('apicmd')) {
				apiFuncs[button.getAttribute('apicmd')]["OnDeleteToggle"](tagEditModeSwitch.checked);
			}
		}
		if (tagAddButton) {
			tagAddButton.addEventListener("click", function() {
				if (!this.disabled) {
					let newTag = apiFuncs[button.getAttribute('apicmd')]["CreateTag"]();
					newTag.dispatchEvent(new Event("click"));
					if (tagNameField) {
						tagNameField.placeholder = "Tag Name";
					}
				}
			});
		}
		
		for (let i = 0; i < allMenuButtons.length; i++) {
			if (allMenuButtons[i].getAttribute("cmd") == button.getAttribute("cmd")) {
				allMenuButtons[i].classList.remove("user-options-selection-button-disable");
			}
			else {
				allMenuButtons[i].classList.add("user-options-selection-button-disable");
			}
		}
		//modify action button
		if (button.getAttribute("submittext") !== null) {
			actionButton.innerText = button.getAttribute("submittext");
		}
		else {
			actionButton.innerText = button.innerText;
		}
		actionButton.setAttribute("cmd", button.getAttribute('cmd'));
		if (button.getAttribute('apicmd')) {
			actionButton.setAttribute("apicmd", button.getAttribute('apicmd'));
		}
		else {
			actionButton.removeAttribute("apicmd");
		}
		actionButton.setAttribute("menutype", button.getAttribute('menutype'));
		
		if (button.getAttribute('apicmd') && apiFuncs[button.getAttribute('apicmd')] && apiFuncs[button.getAttribute('apicmd')]['OnOpen']) {
			apiFuncs[button.getAttribute('apicmd')]['OnOpen']();
		}
	}
	let lastCommand = localStorage.getItem("useroptions_last_command_selected");
	let lastButtonSelected;
	for (let i = 0; i < allMenuButtons.length; i++) {
		if (allMenuButtons[i].getAttribute("cmd") == lastCommand) {
			lastButtonSelected = allMenuButtons[i];
			break;
		}
	}
	if (lastButtonSelected) {
		selectButton(lastButtonSelected);
	}
	else {
		selectButton(allMenuButtons[0]);
	}
	
	for (let i = 0; i < allMenuButtons.length; i++) {
		allMenuButtons[i].addEventListener("click", function() {
			selectButton(this);
		});
	}
	if (actionButton) {
		actionButton.addEventListener("click", async function() {
			if (this.getAttribute("apicmd")) {
				if (this.getAttribute("menutype") == 3) {
					let isDeleting = document.getElementById("user_options_window_field_tag_edit_mode").checked;
					let result = await apiFuncs[this.getAttribute("apicmd")]['OnSubmit'](isDeleting);
					apiFuncs[this.getAttribute("apicmd")]['OnSubmitResponse'](result, isDeleting);
				}
				else {
					let result = await apiFuncs[this.getAttribute("apicmd")]['OnSubmit']();
				}
			}
			else {
				let sendCmd = "/" + this.getAttribute("cmd") + " " + userName;
				if (this.getAttribute("menutype") == 0) {
					sendCmd += " " + document.getElementById("user_options_window_field_reason").value;
				}
				else if (this.getAttribute("menutype") == 1) {
					let durationValue = parseInt(document.getElementById("user_options_window_field_duration").value);
					if (isNaN(durationValue)) {
						durationValue = 5;
					}
					let durationSeconds = durationValue * parseInt(document.getElementById("user_options_window_field_duration_units").value);
					sendCmd += " " + durationSeconds.toString();
					if (document.getElementById("user_options_window_field_reason").value != "") {
						sendCmd += " " + document.getElementById("user_options_window_field_reason").value;
					}
				}
				else if (this.getAttribute("menutype") == 2) {
					if (document.getElementById("user_options_window_field_remove").checked) {
						sendCmd = "/" + this.getAttribute("cmd") + "r " + userName;
					}
					if (document.getElementById("user_options_window_field_reason").value != "") {
						sendCmd += " " + document.getElementById("user_options_window_field_reason").value;
					}
				}
				wsSendChat(sendCmd);
			}
		})
	}
	if (closeButton) {
		closeButton.addEventListener("click", function() {
			userOptions.remove();
		});
	}
}

function addChatOption(objectId, localstorageName, changeEvent) {
	let opt = document.getElementById(objectId);
	if (opt) {
		if (localStorage.getItem(localstorageName)) {
			opt.value = localStorage.getItem(localstorageName);
		}
		
		opt.addEventListener(changeEvent, function() {
			localStorage.setItem(localstorageName, opt.value);
		});
	}
}

function getPowerUserOption(localstorageName) {
	if (userPrivileges['power_user']) {
		return localStorage.getItem(localstorageName);
	}
	return null;
}

function displayGmodMessage(gmodMsgObj) {
	let gmodMessageWindow = document.createElement("div");
	gmodMessageWindow.id = "gmod_message_window";
	gmodMessageWindow.classList.add("rs-modal-window");
	gmodMessageWindow.innerHTML = '\
									<span class="rs-modal-close-button" id="gmod_message_close_button"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>\
									<img src="/images/emotes/pSmile.png" class="rs-modal-primary-icon">\
									<div id class="rs-modal-title">Message from Global Mods</div>\
									<p id="gmod_message_contents" class="rs-modal-contents"></p>\
									<div style="text-align: center;"><div id="gmod_message_acknowledged_button" class="rs-modal-button-acknowledge">Acknowledged</div></div>\
									';
	try {
		document.getElementsByTagName("BODY")[0].appendChild(gmodMessageWindow);
		document.getElementById("gmod_message_contents").innerText = gmodMsgObj.message;
		document.getElementById("gmod_message_acknowledged_button").addEventListener("click", async function() {
			gmodMessageWindow.remove();

			if (gmodMessages.length > 0) {
				displayGmodMessage(gmodMessages[0]);
				gmodMessages.shift();
			}

			let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOSTWithRetry(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + "/v1/acknowledge_gmod_message", {token: localStorage.getItem("robotstreamer_token"), message_id: gmodMsgObj.message_id});
			if (result?.data === undefined) {
				console.log("Could not send acknowledgement to message", gmodMsgObj.mesage_id);
			}
			else if (result.data.msg) {
				console.log(result.data.msg, gmodMsgObj.message_id);
			}
		});
		document.getElementById("gmod_message_close_button").addEventListener("click", function() {
			gmodMessageWindow.remove();

			if (gmodMessages.length > 0) {
				displayGmodMessage(gmodMessages[0]);
				gmodMessages.shift();
			}
		});
	}
	catch (e) {
		console.error(e);
	}
}

function blinkMentionNotification() {
	if (document.visibilityState !== "visible" && !mentionInterval) {
		document.getElementById("title").innerHTML = "*" + "New Mention" + "*" + " - " + window.lastTitle;
		mentionInterval = setInterval(function() {
			mentionDisplayState = !mentionDisplayState;
			let mentionStars = (mentionDisplayState ? "**" : "*");
			document.getElementById("title").innerHTML = mentionStars + "New Mention" + mentionStars + " - " + window.lastTitle;
		}, 1000);
	}
}

document.addEventListener("visibilitychange", function() {
	if (!document.hidden) {
		if (mentionInterval) {
			clearInterval(mentionInterval);
			mentionInterval = null;
		}
		mentionDisplayState = false;
		if (window.lastTitle) {
			document.getElementById("title").innerHTML = window.lastTitle;
		}
	}
});

if (typeof window.visualViewport !== 'undefined') {
	window.visualViewport.addEventListener('resize', function(e) {
		if (document.fullscreenElement) {
			if (e.target.height <= 400 && screen.orientation.type.startsWith("landscape")) {
				document.getElementById("col-right").style.height = e.target.height + "px";
				document.getElementById("col-right").classList.add("keyboarded");
				document.getElementById("col-right").style.top = "0px";
				setTimeout(function() {
					scrollChat(true);
				}, 250);
			}
			else {
				document.getElementById("col-right").style.height = "";
				document.getElementById("col-right").classList.remove("keyboarded");
				document.getElementById("col-right").style.top = "";
			}
		}
		else {
			if (e.target.height <= 400 && screen.orientation.type.startsWith("portrait")) {
				document.getElementById("col-right").style.height = "120px";
				document.getElementById("col-right").classList.add("keyboarded");
				document.getElementById("col-right").style.top = "calc(" + e.target.height + "px - 120px)";
				setTimeout(function() {
					scrollChat(true);
				}, 250);
			}
			else {
				document.getElementById("col-right").style.height = "";
				document.getElementById("col-right").classList.remove("keyboarded");
				document.getElementById("col-right").style.top = "";
			}
		}
	});
}


//# sourceURL=webpack://rswebclient/./src/chat.js?