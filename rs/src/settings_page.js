__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);




function init() {

    console.log("settings  page initialization");
    let tokenInput = (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.element)('token_id');
    tokenInput.value = localStorage.getItem("robotstreamer_token");

    let url = _config_js__WEBPACK_IMPORTED_MODULE_1__.api_host + 'v1/get_broadcaster/26/get_robots';
    console.log("broadcaster robots url:", url);
    //let response = await axiosGET(url);    
    
}



//# sourceURL=webpack://rswebclient/./src/settings_page.js?