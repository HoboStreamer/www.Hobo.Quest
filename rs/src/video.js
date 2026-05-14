__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initVideo: () => (/* binding */ initVideo)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/screenfull.js */ "./src/lib/screenfull.js");
/* harmony import */ var _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/jsmpeg_rs_version.js */ "./src/lib/jsmpeg_rs_version.js");
/* harmony import */ var _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_4__);



//import * as JSMpeg from './lib/jsmpeg.min.2022.js';




var lastFullscreen = false;
var lastTime = 0;

//screenfull.on breaks ios safari


async function getVideoURL(cameraID) {
    let endpointIdentifier =
        _config_js__WEBPACK_IMPORTED_MODULE_3__.video_endpoint_prefix +
        "jsmpeg_video_broadcast";
    let endpoint = await (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getEndpoint)(endpointIdentifier, cameraID);
    if (endpoint != null) {
        let videoURL =
            "wss://" + endpoint.host + ":" + endpoint.port + "/";
        return videoURL
    } else {
        return null
    }
}


var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
console.log("if iOS: ", iOS);
if (iOS == false) {
    _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.on("change", function () {
        console.log("screenfull.on change");
        var player =
            _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.isFullscreen && _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.element
                ? _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.element
                : lastFullscreen;

        if (
            player &&
            _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.type !== "webrtc" &&
            _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.type !== "rtmp" &&
            !window.EmbedPage
        ) {
            if (_lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.isFullscreen) {
                //show video controls in fullscreen only
                player.getElementsByClassName(
                    "video_controls",
                )[0].style.display = "block";

                lastFullscreen = _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.element;
                var aspectRatio = 1920 / 1080;
                var canvas = document.getElementById("video_canvas");

                if (player.getElementsByClassName("video_canvas")) {
                    aspectRatio = canvas.offsetWidth / canvas.offsetHeight;
                } else {
                    aspectRatio = player.offsetWidth / player.offsetHeight;
                }

                player.style.height = window.screen
                    ? window.screen.height + "px"
                    : "100%";
                player.style.width = window.screen
                    ? window.screen.height * aspectRatio + "px"
                    : "100%";
                // player.style.maxWidth = "900px";
                player.style.position = "fixed";
                player.style.zIndex = 99;

                //show fullscreen video controls
                if (player.getElementsByClassName("video_controls")) {
                    player.getElementsByClassName(
                        "video_controls",
                    )[0].style.position = "fixed";
                }

                //show fullscreen robot controls
                document.getElementById(
                    "control-buttons-fullscreen",
                ).style.display = "block";
            } else {
                //reset not fullscreen
                player.style.width = "";
                player.style.height = "";
                player.style.zIndex = "";
                player.style.position = "relative";

                //hide fullscreen video controls
                player.getElementsByClassName(
                    "video_controls",
                )[0].style.display = "none";
                //hide fullscreen robot controls
                document.getElementById(
                    "control-buttons-fullscreen",
                ).style.display = "none";

                lastFullscreen = false;
            }

            setTimeout(function () {
                if (player && player.focus) {
                    player.focus();
                }
            }, 200);
        }
    });
}
/**/

async function initVideo(canvas, cameraID, vidControl, pip = false) {
    if (pip) {
        console.log("init pip video", cameraID);
    } else {
        console.log("init video", cameraID);
    }

    //canvas.style.color = "#fff";
    //canvas.style.background = "#fff";
    //needs more error checking !!!

    if (pip) {
        console.log("page load api", _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI);
        var videoURL =
            _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol("websocket") +
            "//" +
            _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.pip_video.host +
            ":" +
            _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.pip_video.port +
            "/";
    } else {
        var videoURL =
            _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol("websocket") +
            "//" +
            _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.get_video_endpoint.host +
            ":" +
            _global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.get_video_endpoint.port +
            "/";
    }

    if (_global_js__WEBPACK_IMPORTED_MODULE_4__.pageLoadAPI.get_video_endpoint.host != null) {
        console.log("video broadcast url", videoURL);
        var videoPlayer = new _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_2__.Player(videoURL, { canvas: canvas });
        _util_js__WEBPACK_IMPORTED_MODULE_0__.sendTokenToVideoRelay(videoPlayer.source);
    } else {
        console.error("could not get video endpoint");
    }

    if (pip == false) {
        async function checkBrokenStream() {
            console.log("check for broken video stream");
            if (!videoPlayer) console.log("missing videoPlayer");
            if (videoPlayer && !videoPlayer.currentTime)
                console.log("missing currentTime");
            if (
                videoPlayer &&
                videoPlayer.currentTime &&
                videoPlayer.currentTime <= lastTime
            )
                console.log("current time is not up to date");
            if (videoPlayer) {
                console.log(
                    "video current time:",
                    videoPlayer.currentTime,
                    "video last time:",
                    lastTime,
                );
            }
            // if player is missing or currentTime is missing or
            // current time is not up to date or missing, recreate
            if (
                !videoPlayer ||
                !videoPlayer.currentTime ||
                videoPlayer.currentTime <= lastTime
            ) {
                //recreate stream
                videoURL = await getVideoURL(cameraID);
                console.log("recreate videoPlayer stream");
                if (videoPlayer) videoPlayer.destroy();
                videoPlayer = new _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_2__.Player(videoURL, { canvas: canvas });
                _util_js__WEBPACK_IMPORTED_MODULE_0__.sendTokenToVideoRelay(videoPlayer.source);
                //window.vptest = videoPlayer;
                lastTime = 0;
            }
            lastTime = videoPlayer.currentTime;
            setTimeout(checkBrokenStream, 3000); //check period
        }
        setTimeout(checkBrokenStream, 1000);

        //temp here to get stream dimention
        function gettime() {
            if (videoPlayer.currentTime > 0) {
                console.log("getCurrentTime:", videoPlayer.currentTime);
                var getClientWidth = canvas.clientWidth;
                var getClientHeight = canvas.clientHeight;
                var getStreamWidth = canvas.width;
                var getStreamHeight = canvas.height;
                console.log("getClientWidth:", getClientWidth);
                console.log("getClientHeight:", getClientHeight);
                console.log("getStreamWidth:", getStreamWidth);
                console.log("getStreamHeight:", getStreamHeight);
            } else {
                setTimeout(gettime, 10); //check
            }
        }
        gettime();
    }

    if (pip == false) {
        //not in vidControl - include the window element
        var fullscreenButtons =
            document.getElementsByClassName("fullscreen-icon");

        for (var i = 0; i < fullscreenButtons.length; i++) {
            //for every fullscreen button
            //fullscreenButtons[i].addEventListener('click',FullscreenAction,false);

            fullscreenButtons[i].addEventListener("click", function (e) {
                console.log("fullscreen toggle", vidControl.parentNode);
                //prevents error needs work for pip
                if (
                    typeof vidControl === "object" &&
                    typeof vidControl.nodeType !== "undefined"
                ) {
                    var iOS =
                        !!navigator.platform &&
                        /iPad|iPhone|iPod/.test(navigator.platform);
                    console.log("if iOS: ", iOS);
                    if (iOS == false) {
                        _lib_screenfull_js__WEBPACK_IMPORTED_MODULE_1__.toggle(vidControl.parentNode);
                    }

                    console.log("screenfull.toggle 1");
                }
                e.preventDefault();
            });
        }
    }

    //trying to prevent minimised users from pulling data pointlessly
    //will not change much since the audio already nerfs on hidden
    async function handleVisibilityChange() {
        if (document.hidden) {
            if (videoPlayer != null) {
                console.log(
                    "document hidden: destroying video feed:",
                    cameraID,
                );
                videoPlayer.destroy();
                videoPlayer = null;
            }
        } else {
            if (videoPlayer == null) {
                let videoURL = await getVideoURL(cameraID);
                if (videoURL != null) {
                    console.log("refetch video broadcast url", videoURL);
                    videoPlayer = new _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_2__.Player(videoURL, {
                        canvas: canvas,
                    });
                    _util_js__WEBPACK_IMPORTED_MODULE_0__.sendTokenToVideoRelay(videoPlayer.source);
                    //window.vptest = videoPlayer;
                } else {
                    console.error(
                        "could not get video url on visibility change",
                    );
                }
            }
        }
    }
    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange,
        false,
    );
}


//# sourceURL=webpack://rswebclient/./src/video.js?