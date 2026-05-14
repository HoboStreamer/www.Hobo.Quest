__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeButtons: () => (/* binding */ makeButtons)
/* harmony export */ });
/* harmony import */ var _control_communication_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./control_communication.js */ "./src/control_communication.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _funbits_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./funbits.js */ "./src/funbits.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_4__);






var actions = {}
window.rsKeyState = {}
let videoClicked = false;

let vidContainer = document.getElementById("video_container");
if (vidContainer) {
	vidContainer.addEventListener("click", function() {
		videoClicked = true;
	});
}

function setupHotkey(keyCode, onmousedownCallback, onmouseupCallback) {
	document.addEventListener('keydown', (event) => {
		if (document.querySelector(":focus")) return true
		if (window.rsKeyState[event.keyCode] != 'down') {
			if (event.keyCode == keyCode) {
				onmousedownCallback()
				window.rsKeyState[event.keyCode] = 'down'
			}
		}
		if (videoClicked) {
			if ((event.keyCode >= 37 && event.keyCode <= 40) || event.keyCode == 32) {
				//prevent arrows scrolling
				event.preventDefault();
			}
		}
	});
	document.addEventListener('keyup', (event) => {
		if (document.querySelector(":focus")) return true
		if (event.keyCode == keyCode) {
			onmouseupCallback()
			window.rsKeyState[event.keyCode] = 'up'
		}
		if (videoClicked) {
			if ((event.keyCode >= 37 && event.keyCode <= 40) || event.keyCode == 32) {
				//prevent arrows scrolling
				event.preventDefault();
			}
		}
	});
}

function getButtonDataFromSettingsLoad(robotList, robotId) {
	for (let i = 0; i < robotList.length; i++) {
		let robotObj = JSON.parse(robotList[i]);
		if (robotObj.robot_id == robotId) {
			return robotObj.panels;
		}
	}
}

function makeButton(parent, text, onmousedownCallback, onmouseupCallback, keyCode, funbits, style, altKeycodes) {
	var btn = document.createElement("div");
	var t = document.createTextNode(text);
	btn.setAttribute('class', 'stream-controls-mvmt-button');

	if (style) {
		if (style.bg)		btn.style.backgroundColor = "#" + style.bg
		if (style.text)	btn.style.color = "#" + style.text
	}
	btn.appendChild(t);
	
	if (funbits){
		let funbitsLabel = document.createElement('span')
		funbitsLabel.innerHTML = funbits
		funbitsLabel.style.backgroundColor = "#1DD1A1"
		funbitsLabel.style.color = "#222222"
		funbitsLabel.style.padding = "1px 5px"
		funbitsLabel.style.borderRadius = "8px"
		funbitsLabel.style.marginLeft = "4px"
		funbitsLabel.style.boxShadow = "0px 0px 4px rgba(0,0,0,0.5)"
		btn.appendChild(funbitsLabel)
	}
	
	parent.appendChild(btn);

	if (document.location.pathname != "/settings.html") {
		btn.addEventListener("mousedown", onmousedownCallback, false);
		btn.addEventListener("mouseup", onmouseupCallback, false);
		btn.addEventListener("touchstart", onmousedownCallback, false);
		btn.addEventListener("touchend", onmouseupCallback, false);
		if (keyCode) {
			setupHotkey(keyCode, onmousedownCallback, onmouseupCallback);
		}
		if (altKeycodes && Array.isArray(altKeycodes) && funbits <= 0) {
			for (let i = 0; i < altKeycodes.length; i++) {
				setupHotkey(altKeycodes[i], onmousedownCallback, onmouseupCallback);
			}
		}
	}
}

async function makeButtons(parent, parentFullscreen, robotID, useKeys, rawData, rawDataShouldFind) {
	try {
		console.log("Start makeButtons: ", robotID)

		if (document.location.pathname != "/settings.html") {
			// just end here if controls are disabled
			if (_global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.control_enabled === "false") {
				return;
			}
			_control_communication_js__WEBPACK_IMPORTED_MODULE_0__.init(robotID);
		}
		
		//let getRobotResult = await axiosGET(rsConfig['api_host'] + '/v1/get_robot/' + robotID);
		let panels;
		if (document.location.pathname == "/settings.html") {
			if (rawDataShouldFind) {
				panels = getButtonDataFromSettingsLoad(rawData, robotID);
			}
			else {
				try {
					panels = JSON.parse(rawData);
				}
				catch (e) {
					parent.innerHTML = '<div style="color:#FF0000; width:100%; height:100%; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:16px;"><span>Invalid JSON</span></div>';
					return;
				}
			}
		}
		else {
			panels = _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.panels.panels;
		}
		
		console.log("panels: ", panels)
		//const panels = getRobotResult.data[0].panels;
		
		if (panels) {

			panels.forEach(p => {

				const buttonPanels = p.button_panels;
				buttonPanels.forEach(bp => {

					var panel = document.createElement('div')
					panel.className = "stream-controls-buttons"
					parent.appendChild(panel)

					var panelFullscreen = document.createElement('div')
					panelFullscreen.className = "stream-controls-buttons"
					if (parentFullscreen) {
						parentFullscreen.appendChild(panelFullscreen);
					}


					if (bp.label || document.location.pathname == "/settings.html"){
						if (bp.label === 'default buttons panel') {
							bp.label = 'Use the buttons below or use the arrow keys:'
						}
						let label = document.createElement('div')
						if (!bp.label) {
							bp.label = "Unlabeled Panel";
							label.style.fontStyle = "italic";
						}
						label.className = "stream-controls-title"
						label.style.width = "100%"
						label.style.lineHeight = "20px"
						label.appendChild(document.createTextNode(bp.label));
						panel.appendChild(label)

						let mobile_label = document.createElement('div')
						mobile_label.className = "stream-controls-mobiletitle"
						mobile_label.style.width = "100%"
						mobile_label.style.lineHeight = "20px"
						mobile_label.style.color = "rgba(143,143,143,0.7)"
						mobile_label.appendChild(document.createTextNode(bp.label));
						panelFullscreen.appendChild(mobile_label)

						let fs_label = document.createElement('div')
						fs_label.className = "stream-controls-title"
						fs_label.style.width = "100%"
						fs_label.style.lineHeight = "20px"
						fs_label.appendChild(document.createTextNode(bp.label));
						panelFullscreen.appendChild(fs_label)
					}



					const buttons = bp.buttons;
					buttons.forEach(b => {
						const mouseDown = () => {
							_control_communication_js__WEBPACK_IMPORTED_MODULE_0__.sendCommand(robotID, b.command, 'down');
						};
						const mouseUp = () => {
							_control_communication_js__WEBPACK_IMPORTED_MODULE_0__.sendCommand(robotID, b.command, 'up');
							if (b.price){
								(0,_funbits_js__WEBPACK_IMPORTED_MODULE_3__.refreshSpendableFunbitsDisplay)();
							}
						};
						makeButton(panel, b.label, mouseDown, mouseUp, b.keycode, parseInt(b.price), b.style, b.alt_keycodes);
						makeButton(panelFullscreen, b.label, mouseDown, mouseUp, false, parseInt(b.price), b.style, false);
					});
				});
			});

		} 
	}
	catch(e) {
		if (document.location.pathname == "/settings.html") {
			parent.innerHTML = '<div style="color:#FF0000; width:100%; height:100%; display:flex; justify-content:center; align-items:center; font-weight:bold; font-size:16px;"><span>Invalid structure</span></div>';
		}
		return;
	}
}


//# sourceURL=webpack://rswebclient/./src/buttons.js?