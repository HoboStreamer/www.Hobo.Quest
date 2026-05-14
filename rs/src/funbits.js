__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   refreshSpendableFunbitsDisplay: () => (/* binding */ refreshSpendableFunbitsDisplay)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_2__);




function init() {

    let listenerUIfunbits_buy = document.getElementById("funbits_buy");
    let listenerUIfunbits_buy_bottom = document.getElementById("funbits_buy_bottom");
    listenerUIfunbits_buy.addEventListener("click", onFunbits);
    listenerUIfunbits_buy_bottom.addEventListener("click", onFunbits);

    refreshSpendableFunbitsDisplay();
    refreshNonspendableFunbitsDisplay();
}

//todo: add a removed amount because updates faster than chatserver
async function refreshSpendableFunbitsDisplay() {
    //let url = rsConfig["api_host"] + '/v1/get_spendable_funbits';
    //let data = {token: window.localStorage.getItem("robotstreamer_token")};
    //let result = await axiosPOST(url, data);
    let result = _global_js__WEBPACK_IMPORTED_MODULE_1__.pageLoadAPI.spendable_funbits;

    if (result) {

        document.getElementById("spendable_funbits").innerHTML     = "you have " + Math.round(1000*result)/1000 + " funbits";
        document.getElementById("modal-profile-funbits").innerHTML = "you have " + Math.round(1000*result)/1000 + " funbits";

    } else {
        console.log("get spendable funbits result invalid");
    }
}



async function refreshNonspendableFunbitsDisplay() {
    //let url = rsConfig["api_host"] + '/v1/get_nonspendable_funbits';
    //let data = {token: window.localStorage.getItem("robotstreamer_token")};
    //let result = await axiosPOST(url, data);
    let result = _global_js__WEBPACK_IMPORTED_MODULE_1__.pageLoadAPI.nonspendable_funbits;

    if (result) {
        //let f = result.data.nonspendable_funbits;
        console.log("nonspendable funbits: ", result);
        if (result > 0) {

                document.getElementById("nonspendable_funbits").innerHTML =
                "you have $" + Math.round(result)/100.0 + " in earnings";
        }
    } else {
        console.log("get nonspendable funbits result invalid");
    }
}



function onFunbits() {
    console.log("funbits button pressed");
    console.log("check if logged in");
    if(_util_js__WEBPACK_IMPORTED_MODULE_0__.isUserLoggedIn()){
        console.log("user is logged in");
        window.location.href = "/pay.html";
    }
    else{
        //show login/register prompt
        console.log("user is not logged in");
        openModal(1);
    }

}


//# sourceURL=webpack://rswebclient/./src/funbits.js?