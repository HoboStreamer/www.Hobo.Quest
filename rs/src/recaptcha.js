__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_0__);


var greID = false;
var greCallback = false;

// Executed when user submits a successful response providing g-recaptcha-response token in the callback
window.greCallhook = function(token) {
	console.log("received recaptcha token: ", token);
	
	// Run stored callback function
	var callback = (typeof callback === "function" ? callback : greCallback);
	if (typeof callback !== "function") {
		console.log("ERROR! recaptcha callback function went missing?");
	} else {
		callback(token);
	}
	
	greCallback = false;
};

// Executed when the recaptcha response expires and the user needs to re-verify
window.greExpired = function() {
	console.log("recaptcha response has expired!");
	
	// Attempt to reset recaptcha
	window.greLoad();
};

// Executed when recaptcha encounters an error (usually network connectivity) and can't continue until connectivity is restored
window.greError = function() {
	console.error("recaptcha encountered an error! some things to check: is the private key correct, is the public key correct, is the domain validated in recaptcha settings, and is network connectivity ok");
	
	// Failsafe
	//window.refresh(true);
};

// Executed when recaptcha has fully loaded
window.greInit = function() {
	if (typeof _config_js__WEBPACK_IMPORTED_MODULE_0__ !== "object" || typeof _config_js__WEBPACK_IMPORTED_MODULE_0__.invisible_recaptcha_site_key !== "string") {
		console.log("ERROR! could not render recaptcha because sitekey is not defined in config.js");
		return;
	}
	
	console.log("rendering recaptcha...");
	
	// Make sure recaptcha stays hidden
	let greDiv = document.getElementById("gre_div");
	greDiv.style["display"] = "none";
	
	if (greID !== false) {
		try {
			// Reset existing recaptcha challenge
			grecaptcha.reset(greID);
		} catch(e) {
			// Failsafe
			window.refresh(true);
		}
	} else {
		// Setup and render recaptcha base element
		greID = grecaptcha.render("gre_div", {
			"sitekey": _config_js__WEBPACK_IMPORTED_MODULE_0__.invisible_recaptcha_site_key,
			"badge": "inline",
			"size": "invisible",
			"callback": "greCallhook",
			"expired-callback": "greExpired",
			"error-callback": "greError",
			"isolated": true
		});
	}
	
	// Execute recaptcha request
	grecaptcha.execute(greID);
};

window.greLoad = function(callback) {
	// Store callback function to run after load
	greCallback = callback;
	
	if (typeof grecaptcha !== "undefined") {
		// Recaptcha has already been loaded, run callback manually
		window.greInit();
	} else {
		// Load recaptcha JS API dynamically
		let greScript = document.createElement('script');
		greScript.setAttribute('type', 'text/javascript');
		greScript.setAttribute('async', '');
		greScript.setAttribute('defer', '');
		greScript.id = 'gre_script';
		greScript.src = 'https://www.google.com/recaptcha/api.js?onload=greInit&render=explicit';
		document.getElementsByTagName('head')[0].appendChild(greScript);
	}
};


//# sourceURL=webpack://rswebclient/./src/recaptcha.js?