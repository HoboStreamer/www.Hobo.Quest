__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initAudio: () => (/* binding */ initAudio)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/jsmpeg_rs_version.js */ "./src/lib/jsmpeg_rs_version.js");
/* harmony import */ var _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_3__);


//import * as JSMpeg from './lib/jsmpeg.min.2022.js';




var lastTime = 0;


async function getAudioURL(cameraID) {
    let endpointIdentifier =
        _config_js__WEBPACK_IMPORTED_MODULE_3__.video_endpoint_prefix +
        "jsmpeg_audio_broadcast";
    let endpoint = await (0,_util_js__WEBPACK_IMPORTED_MODULE_0__.getEndpoint)(endpointIdentifier, cameraID);
    if (endpoint != null) {
        let audioURL =
            "wss://" + endpoint.host + ":" + endpoint.port + "/";
        return audioURL;
    } else {
        return null;
    }
}


async function initAudio(canvas, cameraID, vidControl, pip = false) {
    //kludge for pip
    //needs more error checking

    if (pip && _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.pip_audio) {
        var audioURL =
            _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol("websocket") +
            "//" +
            _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.pip_audio.host +
            ":" +
            _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.pip_audio.port +
            "/";
        var endpointHost = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.pip_audio.host;
        console.log(
            "init audio main creating player audio broadcast url",
            audioURL,
        );
    } else {
        if (_global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.get_audio_endpoint) {
            var audioURL =
                _util_js__WEBPACK_IMPORTED_MODULE_0__.getProtocol("websocket") +
                "//" +
                _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.get_audio_endpoint.host +
                ":" +
                _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.get_audio_endpoint.port +
                "/";
            var endpointHost = _global_js__WEBPACK_IMPORTED_MODULE_2__.pageLoadAPI.get_audio_endpoint.host;
            console.log(
                "init audio pip creating player audio broadcast url",
                audioURL,
            );
        } else {
            console.error(
                "global.pageLoadAPI.get_audio_endpoint missing in db",
            );
        }
    }

    if (endpointHost != null) {
        var audioPlayer = new _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_1__.Player(audioURL, { canvas: canvas });
        _util_js__WEBPACK_IMPORTED_MODULE_0__.sendTokenToAudioRelay(audioPlayer.source);
        //var player = new JSMpeg.Player(url)
        function onUnlocked() {
            // console.log('unlock video audio: ' + url)
            audioPlayer.volume = 1;
            document.removeEventListener("touchstart", onTouchStart);
        }
        function onTouchStart() {
            audioPlayer.audioOut.unlock(onUnlocked);
            document.removeEventListener("touchstart", onTouchStart);
        }
        // try to unlock immediately
        audioPlayer.audioOut.unlock(onUnlocked);
        // try to unlock by touchstart event
        document.addEventListener("touchstart", onTouchStart, false);

        if (pip == false) {
            async function recreateAudioPlayerStream() {
                //recreate stream
                console.log("recreate audioPlayer stream");
                audioURL = await getAudioURL(cameraID);
                if (audioPlayer) audioPlayer.destroy();
                audioPlayer = new _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_1__.Player(audioURL, { canvas: canvas });
                _util_js__WEBPACK_IMPORTED_MODULE_0__.sendTokenToAudioRelay(audioPlayer.source);

                if (localStorage.getItem("vid_volume")) {
                    var frac = parseFloat(localStorage.getItem("vid_volume"));
                    if (frac > 2) {
                        frac = 2;
                    } else if (frac < 0) {
                        frac = 0;
                    } //bounds

                    if (volBeforeMute) {
                        //prevent overwriting muted state
                        console.log("restoring from a muted state:");
                        audioPlayer.volume = 0;
                    } else {
                        console.log("audio player volume", frac);
                        audioPlayer.volume = frac;
                    }
                }
            }

            async function restartSuspendedAudioStream() {
                try {
                    console.log("checking if restart suspended audio stream is needed");
                    if (
                        audioPlayer.audio.destination.context.state == "suspended"
                    ) {
                        await recreateAudioPlayerStream();
                    }
                } catch (err) {
                    console.error("Error restarting suspended audio stream:", err);
                }
            }

            // Audio player keeps recording to buffer while in
            // suspended mode and then plays from the beginning when
            // it comes out of suspension. If a mousedown event is
            // bringing the audio player out of suspension, this will
            // clear the audio buffer so the audio is synced up with
            // realtime again.
            window.addEventListener("mousedown", restartSuspendedAudioStream, {
                once: true,
            });

            // define check broken stream function and set it to run with setTimeout
            async function checkBrokenStream() {
                console.log("check for broken audio stream");
                if (!audioPlayer) console.log("missing audioPlayer");
                if (audioPlayer && !audioPlayer.currentTime)
                    console.log("missing audio currentTime");
                if (
                    audioPlayer &&
                    audioPlayer.currentTime &&
                    audioPlayer.currentTime <= lastTime
                )
                    console.log("audio current time is not up to date");
                if (audioPlayer) {
                    console.log(
                        "audio current time:",
                        audioPlayer.currentTime,
                        "audio last time:",
                        lastTime,
                    );
                }
                // if player is missing or currentTime is missing or
                // current time is not up to date or missing, recreate
                if (
                    !audioPlayer ||
                    !audioPlayer.currentTime ||
                    audioPlayer.currentTime <= lastTime
                ) {
                    //recreate stream
                    await recreateAudioPlayerStream();
                    lastTime = 0;
                }
                lastTime = audioPlayer.currentTime;
                setTimeout(checkBrokenStream, 3000); //check period
            }
            setTimeout(checkBrokenStream, 1000);

            var volBeforeMute = false;

            //elements
            var volumeSliders =
                document.getElementsByClassName("volume-slider");
            var volumeMutes = document.getElementsByClassName("volume-mute");

            //cheat lazy listeners
            for (var i = 0; i < volumeSliders.length; i++) {
                //for every slider
                volumeSliders[i].addEventListener(
                    "input",
                    volumeSliderAction,
                    false,
                );
            }

            for (var i = 0; i < volumeMutes.length; i++) {
                //for every mute button
                volumeMutes[i].addEventListener(
                    "click",
                    volumeMuteAction,
                    false,
                );
            }

            function volumeSliderAction() {
                //console.log("slider value", this.value);
                var svalue = this.value / 100;
                if (svalue > 4) {
                    svalue = 4;
                } else if (svalue < 0) {
                    svalue = 0;
                } //bounds
                //console.log("svalue", svalue);
                volumeSetAllSliders(String(svalue));
                localStorage.setItem("vid_volume", svalue); //save the value
                volBeforeMute = false; //reset mute flag
            }

            function volumeMuteAction() {
                console.log("mute toggle", volBeforeMute);

                if (volBeforeMute == false) {
                    volBeforeMute = audioPlayer.volume;
                    volumeSetAllSliders(0);
                } else {
                    volumeSetAllSliders(volBeforeMute);
                    volBeforeMute = false;
                }
            }

            async function volumeSetAllSliders(volume) {
                //console.log("volume set all sliders", volume);
                audioPlayer.volume = volume;
                for (var i = 0; i < volumeSliders.length; i++) {
                    //for every slider
                    volumeSliders[i].value = String(volume * 100); //set window slider
                }
            }

            //load defaults or saved volume
            if (localStorage.getItem("vid_volume")) {
                var frac = parseFloat(localStorage.getItem("vid_volume"));
                if (frac > 2) {
                    frac = 2;
                } else if (frac < 0) {
                    frac = 0;
                } //bounds
                volumeSetAllSliders(frac);
            } else {
                //default volume
                volumeSetAllSliders(1);
            }
        } else {
            //this is just here for pip volume

            if (
                typeof vidControl === "object" &&
                typeof vidControl.nodeType !== "undefined"
            ) {
                var volSlider = vidControl.getElementsByClassName("vol_slider")
                    ? vidControl.getElementsByClassName("vol_slider")[0]
                    : false;

                var volMove = function (e) {
                    var volFill =
                        vidControl &&
                        vidControl.getElementsByClassName("vol_slider_fill")
                            ? vidControl.getElementsByClassName(
                                  "vol_slider_fill",
                              )[0]
                            : false;
                    if (volFill) {
                        var volW = 160;
                        if (volSlider && volSlider.clientWidth) {
                            volW = volSlider.clientWidth;
                        }
                        var frac =
                            (e.pageX - volFill.getBoundingClientRect().left) /
                            volW;
                        if (frac > 1) {
                            frac = 1;
                        } else if (frac < 0) {
                            frac = 0;
                        } //bounds

                        //stops the pip controls from moving the windowed volume slider
                        //console.log("onscreen:", frac);
                        //console.log("audio player volume", frac)
                        audioPlayer.volume = frac;
                        updateVolume(vidControl, frac);
                    }
                };

                var volMouseUp = function (e) {
                    window.removeEventListener("mouseup", volMouseUp);
                    window.removeEventListener("mousemove", volMove);
                    e.preventDefault();
                };

                if (volSlider) {
                    volSlider.addEventListener("mousedown", function (e) {
                        volMove(e);
                        window.addEventListener("mouseup", volMouseUp);
                        window.addEventListener("mousemove", volMove);
                        e.preventDefault();
                    });
                }

                //onscreen controls
                var volMute =
                    vidControl && vidControl.getElementsByClassName("vol_mute")
                        ? vidControl.getElementsByClassName("vol_mute")[0]
                        : false;
                if (volMute) {
                    var volBeforeMute = false;
                    volMute.addEventListener("click", function (e) {
                        var muteBtn = volMute || e.target;
                        if (muteBtn.innerHTML.indexOf("fa-volume-up") > -1) {
                            volBeforeMute = audioPlayer.volume;
                            audioPlayer.volume = 0;
                            updateVolume(vidControl, 0);

                            muteBtn.innerHTML =
                                '<i class="fas fa-volume-off"></i>';
                        } else {
                            if (volBeforeMute && !isNaN(volBeforeMute)) {
                                console.log(
                                    "audio player before mute",
                                    volBeforeMute,
                                );
                                audioPlayer.volume = volBeforeMute;
                                updateVolume(vidControl, volBeforeMute);
                            }
                            volBeforeMute = false;
                            muteBtn.innerHTML =
                                '<i class="fas fa-volume-up"></i>';
                        }
                        e.preventDefault();
                        return false;
                    });
                }

                if (localStorage.getItem("vid_volume")) {
                    var frac = parseFloat(localStorage.getItem("vid_volume"));
                    if (frac > 1) {
                        frac = 1;
                    } else if (frac < 0) {
                        frac = 0;
                    } //bounds
                    console.log("pip player volume", frac);
                    audioPlayer.volume = frac;
                    updateVolume(vidControl, frac);
                } else {
                    //default volume
                    audioPlayer.volume = 1;
                    updateVolume(vidControl, 1);
                }
            } //typeof vidControl === "object"

            async function updateVolume(vidControl, frac) {
                if (
                    typeof vidControl !== "object" ||
                    typeof vidControl.nodeType === "undefined"
                ) {
                    return false;
                }

                var volMute = vidControl.getElementsByClassName("vol_mute")
                    ? vidControl.getElementsByClassName("vol_mute")[0]
                    : false;
                if (
                    volMute &&
                    volMute.innerHTML.indexOf("fa-volume-off") > -1 &&
                    frac > 0
                ) {
                    volMute.innerHTML = '<i class="fas fa-volume-up"></i>';
                } else if (
                    volMute &&
                    volMute.innerHTML.indexOf("fa-volume-up") > -1 &&
                    frac <= 0
                ) {
                    volMute.innerHTML = '<i class="fas fa-volume-off"></i>';
                }

                var volFill = vidControl.getElementsByClassName(
                    "vol_slider_fill",
                )
                    ? vidControl.getElementsByClassName("vol_slider_fill")[0]
                    : false;
                if (volFill) {
                    var percent = frac * 100;
                    if (percent < 3.8) {
                        percent = 3.8;
                    }
                    percent = percent.toFixed(2);
                    volFill.style.right = 100 - percent + "%";
                }
            }
        }
    } else {
        console.error("could not get audio endpoint");
    }

    //trying to prevent minimised users from pulling data pointlessly
    //will not change much since the audio already nerfs on hidden
    async function handleVisibilityChangeAudio() {
        if (document.hidden) {
            if (audioPlayer != null) {
                console.log(
                    "document hidden: destroying audio feed:",
                    cameraID,
                );
                audioPlayer.destroy();
                audioPlayer = null;
            }
        } else {
            //prevents re-creation if wasnt destoyed
            if (audioPlayer == null) {
                //refetch endpoint
                let audioURL = await getAudioURL(cameraID);
                if (audioURL != null) {
                    console.log("audio url:", audioURL);
                    audioPlayer = new _lib_jsmpeg_rs_version_js__WEBPACK_IMPORTED_MODULE_1__.Player(audioURL, {
                        canvas: canvas,
                    });
                    _util_js__WEBPACK_IMPORTED_MODULE_0__.sendTokenToAudioRelay(audioPlayer.source);
                    if (audioPlayer != null) {
                        //load defaults or saved volume
                        if (localStorage.getItem("vid_volume")) {
                            var frac = parseFloat(
                                localStorage.getItem("vid_volume"),
                            );
                            if (frac > 2) {
                                frac = 2;
                            } else if (frac < 0) {
                                frac = 0;
                            } //bounds

                            if (volBeforeMute) {
                                //prevent overwriting muted state
                                console.log("restoring from a muted state:");
                                audioPlayer.volume = 0;
                            } else {
                                console.log("2audio player volume", frac);
                                audioPlayer.volume = frac;
                            }
                        }
                    } else {
                        console.error(
                            "could not get audio url on visibility change",
                        );
                    }
                }
            }
        }
    }
    document.addEventListener(
        "visibilitychange",
        handleVisibilityChangeAudio,
        true,
    );
}


//# sourceURL=webpack://rswebclient/./src/audio.js?