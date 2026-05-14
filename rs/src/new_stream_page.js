__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);



function init() {

    console.log("new stream page initialization");
    let tokenInput = document.getElementById('token_id');
    tokenInput.value = localStorage.getItem("robotstreamer_token");
 
    let url = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix() + '/v1/create_robot';
    let elt = document.getElementById("create_form");
    console.log("element", elt, "elt.action", elt.action, "elt.method", elt.method);
    elt.action = url;


}



//# sourceURL=webpack://rswebclient/./src/new_stream_page.js?