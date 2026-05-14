__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);



function init() {

	console.log("pay page initialization");

	const executePayment = (data, actions) => {

		// Set up a url on your server to execute the payment
		var EXECUTE_URL = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/execute_paypal_payment';
		const tokenForAuthentication = localStorage.getItem('robotstreamer_token');

		// Set up the data you need to pass to your server
		var data = {
			token: tokenForAuthentication,
			paymentID: data.paymentID,
			payerID: data.payerID
		};

		// Make a call to your server to execute the payment
		return paypal.request.post(EXECUTE_URL, data)
			.then(function(res) {
				window.alert('Payment Complete!\r\n\r\nPlease give the chat ~20 seconds to update.');
			});
	}

	const makePayment = (amount) => {
		var CREATE_URL = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/make_paypal_payment';

		const tokenForAuthentication = localStorage.getItem('robotstreamer_token');;

		const data = {
			token: tokenForAuthentication
		};
		data.amount = amount;

		// Make a call to your server to set up the payment
		return paypal.request.post(CREATE_URL, data)
			.then(function(res) {
				return res.paymentID;
			});
	}

	// button generation
	var stripe_form_action = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + "/v1/make_stripe_payment"
	var stripe_form_method = "POST"
	var stripe_script_src = "https://checkout.stripe.com/checkout.js"
	var stripe_script_class = "stripe-button"
	var stripe_script_data_key = "pk_live_cb0s9ZvXcBXA7b0gH3MgvHRl"
	var stripe_script_data_name = "RobotStreamer"
	var stripe_script_data_description = "Widget"
	var stripe_script_data_image = "https://stripe.com/img/documentation/checkout/marketplace.png"
	var stripe_script_data_locale = "auto"
	var stripe_script_data_zip_code = "true"
	var priceDict = [{
			'funbits': 200,
			'price': 299,
			'discount': 0
		},
		{
			'funbits': 500,
			'price': 700,
			'discount': 0
		},
		{
			'funbits': 1500,
			'price': 1995,
			'discount': 5
		},
		{
			'funbits': 5000,
			'price': 6440,
			'discount': 8
		},
		{
			'funbits': 10000,
			'price': 12600,
			'discount': 10
		},
		{
			'funbits': 25000,
			'price': 30800,
			'discount': 12
		}
	]
	priceDict.forEach(function(item) {
		var payOption = document.createElement('div')
		payOption.setAttribute('class', 'payment-option')

		var payOptionDesc = document.createElement('div')
		payOptionDesc.setAttribute('class', 'payment-option-desc')

		var payOptionButtons = document.createElement('div')
		payOptionButtons.setAttribute('class', 'payment-option-buttons')

		payOption.appendChild(payOptionDesc)
		payOption.appendChild(payOptionButtons)

		var form = document.createElement('form')
		form.action = stripe_form_action
		form.method = stripe_form_method
		var s = document.createElement('script')
		s.setAttribute('src', stripe_script_src)
		s.setAttribute('class', stripe_script_class)
		s.setAttribute('data-key', stripe_script_data_key)
		s.setAttribute('data-amount', item.price)
		s.setAttribute('data-name', stripe_script_data_name)
		s.setAttribute('data-description', stripe_script_data_description)
		s.setAttribute('data-image', stripe_script_data_image)
		s.setAttribute('data-locale', stripe_script_data_locale)
		s.setAttribute('data-zip-code', stripe_script_data_zip_code)
		form.appendChild(s)

		var jwt_token_input = document.createElement('input')
		jwt_token_input.id = 'jwt_token_input' + item.funbits
		jwt_token_input.type = 'hidden'
		jwt_token_input.name = 'jwt_token_input'
		jwt_token_input.value = localStorage.getItem('robotstreamer_token');
		form.appendChild(jwt_token_input)

		var pay_level_input = document.createElement('input')
		pay_level_input.id = 'pay_level_input' + item.funbits
		pay_level_input.type = 'hidden'
		pay_level_input.name = 'pay_level_input'
		pay_level_input.value = item.funbits
		form.appendChild(pay_level_input)

		payOptionButtons.appendChild(form)

		var rs_paypal_button = document.createElement('div')
		rs_paypal_button.setAttribute('class', 'rs-paypal-button')
		rs_paypal_button.id = 'paypal-button-container-' + item.funbits
		payOptionButtons.appendChild(rs_paypal_button)

		var payment_funbits = document.createElement('div')
		payment_funbits.setAttribute('class', 'payment-option-funbit')
		payment_funbits.innerHTML = item.funbits + ' funbits '
		payOptionDesc.appendChild(payment_funbits)

		var payment_money = document.createElement('div')
		payment_money.setAttribute('class', 'payment-option-money')
		payment_money.innerHTML = '$' + (item.price / 100).toFixed(2)
		payOptionDesc.appendChild(payment_money)

		var payment_discount = document.createElement('div')
		payment_discount.setAttribute('class', 'payment-option-discount')
		var discount_text = item.discount ? ' (' + item.discount + '% discount)' : ''
		payment_discount.innerHTML = discount_text
		if (item.discount) {
			payOptionDesc.appendChild(payment_discount)
		}

		document.getElementById('forms').appendChild(payOption)

		paypal.Button.render({
			env: 'production', // sandbox | production
			// Show the buyer a 'Pay Now' button in the checkout flow
			commit: true,
			// payment() is called when the button is clicked
			payment: () => makePayment(item.funbits),
			// onAuthorize() is called when the buyer approves the payment
			onAuthorize: executePayment,
		}, '#paypal-button-container-' + item.funbits);
	})
}


//# sourceURL=webpack://rswebclient/./src/pay_page.js?