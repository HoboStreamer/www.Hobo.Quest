__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);



async function init() {

	console.log("subscribe page initialization");
	
	if (window.location.href.endsWith(".html")) {
		window.location.href = "/";
		return;
	}

	const executePayment = async (data, actions) => {

		// Set up a url on your server to execute the payment
		let EXECUTE_URL = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/execute_paypal_subscription';
		const tokenForAuthentication = localStorage.getItem('robotstreamer_token');

		// Set up the data you need to pass to your server
		let jsonData = {
			token: tokenForAuthentication,
			subscriptionID: data.subscriptionID
		};

		// Make a call to your server to execute the payment
		let res = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOSTWithRetry(EXECUTE_URL, jsonData);
		let subscribeMessage = document.getElementById("subscribe_message");
		if (subscribeMessage) {
			subscribeMessage.innerText = "Payment Complete! Please give the chat ~20 seconds to update."
			subscribeMessage.style.display = "block";
		}
	}

	const makePayment = async (userId) => {
		if (userId == window.localStorage.getItem("robotstreamer_user_id")) {
			return;
		}
		
		let CREATE_URL = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/make_paypal_subscription';

		const tokenForAuthentication = localStorage.getItem('robotstreamer_token');

		const data = {
			token: tokenForAuthentication
		};
		data.sub_to_userid = userId;

		// Make a call to your server to set up the payment
		let res = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(CREATE_URL, data);
		return res.data['subscriptionID'];
	}

	let splitURL = window.location.href.split("/");
	if (splitURL.length < 5) {
		window.location.href = "/";
		return;
	}
	let subUsername = splitURL[4].replace(/(?:)#\w*/gi,"");
	if (subUsername == "") {
		window.location.href = "/";
		return;
	}

	let pubUserInfo = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosGET(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/get_public_user_info_by_name/' + subUsername);
	if (pubUserInfo.data == false) {
		window.location.href = "/";
		return;
	}
	
	let subAvatar = "/images/noimage.png";
	if (pubUserInfo.data['avatar']) {
		if (pubUserInfo.data['nsfw_broadcaster'] == true && window.localStorage.getItem('nsfw_content_ok') !== "true") {
			subAvatar = "/images/emotes/pNSFW.png";
		}
		else {
			subAvatar = pubUserInfo.data['avatar'];
		}
	}

	let payOption = document.createElement('div');
	payOption.setAttribute('class', 'payment-option');

	let payOptionDesc = document.createElement('div');
	payOptionDesc.setAttribute('class', 'payment-option-desc');

	let payOptionButtons = document.createElement('div');
	payOptionButtons.setAttribute('class', 'payment-option-buttons');

	payOption.appendChild(payOptionDesc);
	payOption.appendChild(payOptionButtons);
	
	let subCont = document.getElementById('subscribe_profile_container');
	let profileImg = document.createElement('img');
	profileImg.src = subAvatar;
	profileImg.id = "subscribe_profile_image";
	let profileName = document.createElement('div');
	profileName.id = "subscribe_profile_name";
	profileName.innerText = subUsername;
	subCont.appendChild(profileImg);
	subCont.appendChild(profileName);

	let rs_paypal_button = document.createElement('div');
	rs_paypal_button.setAttribute('class', 'rs-paypal-button');
	rs_paypal_button.id = 'paypal-subscribe-button-container';
	payOptionButtons.appendChild(rs_paypal_button);
	if (pubUserInfo.data['user_id'] == window.localStorage.getItem("robotstreamer_user_id")) {
		rs_paypal_button.style.display = "none";
	}
	
	let payment_funbits = document.createElement('div');
	payment_funbits.setAttribute('class', 'payment-option-subscription');
	payment_funbits.innerHTML = "Subscribe for 1 month";
	payOptionDesc.appendChild(payment_funbits);
	
	let payment_money = document.createElement('div');
	payment_money.setAttribute('class', 'payment-option-money');
	payment_money.innerHTML = '$4.99';
	payOptionDesc.appendChild(payment_money);

	let formContainer = document.getElementById('forms');
	formContainer.innerHTML = "";
	formContainer.appendChild(payOption);

	if (!_util_js__WEBPACK_IMPORTED_MODULE_0__.isUserLoggedIn()) {
		rs_paypal_button.innerText = "Log in to subscribe";
		rs_paypal_button.classList.add("paypal-button-replaced");
		return
	}
	else {
		let subList = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(_util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/get_active_user_subscriptions', {token: localStorage.getItem('robotstreamer_token')});
		if (subList.data['status'] === true && _util_js__WEBPACK_IMPORTED_MODULE_0__.isSubscribed(pubUserInfo.data['user_id'], subList.data['data'])) {
			rs_paypal_button.innerText = "Already subscribed!";
			rs_paypal_button.classList.add("paypal-button-replaced");
			return
		}
	}

	paypal.Buttons({
		env: _config_js__WEBPACK_IMPORTED_MODULE_1__.paypal_mode || 'production', // sandbox | production
		// Show the buyer a 'Pay Now' button in the checkout flow
		commit: true,
		// payment() is called when the button is clicked
		createSubscription: () => makePayment(pubUserInfo.data['user_id']),
		// onAuthorize() is called when the buyer approves the payment
		onApprove: executePayment,
	}).render('#paypal-subscribe-button-container');
}


//# sourceURL=webpack://rswebclient/./src/subscribe_page.js?