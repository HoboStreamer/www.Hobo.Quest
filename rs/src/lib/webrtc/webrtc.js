__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   broadcastWebrtcRoom: () => (/* binding */ broadcastWebrtcRoom),
/* harmony export */   joinWebrtcRoom: () => (/* binding */ joinWebrtcRoom)
/* harmony export */ });
/* harmony import */ var _room__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./room */ "./src/lib/webrtc/room.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util.js */ "./src/util.js");
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../chat.js */ "./src/chat.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _control_communication_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../control_communication.js */ "./src/control_communication.js");







let webrtcVideoControls = '<div class="stream-video-info-controls" style="align-items: center;width: 100%;">\
                            <div class="info-controls-volume" id="info_controls_volume_inner">\
                              <img class="volume-mute" src="/images/volumeicon.svg" alt="volume-icon">\
                                \
                                <div id="volume-inner">\
                                  <input type="range" min="0" max="400" value="400" class="volume-slider rs-volume-slider">\
                                </div>\
                                \
                            </div>\
                          </div>';
let statsToggled = false;
let lastAutoReconnect = 0;
let audioCxt;

function joinWebrtcRoom(videoElement, robotId){




    const localRTCVideo = videoElement;
    const playButton = document.getElementById('video-play-button')
    const videoScreen = document.getElementById("video_container");
    let room = new _room__WEBPACK_IMPORTED_MODULE_0__["default"]();
    localRTCVideo.srcObject = new MediaStream();

    room.join(robotId, _global_js__WEBPACK_IMPORTED_MODULE_1__.pageLoadAPI.rtc_sfu, false, false, false);

    localRTCVideo.controls = false;
    localRTCVideo.autoplay = 'inline';



    //detect autoplay
    var promise = localRTCVideo.play();
    console.log("promise:", promise)
    if (promise !== undefined) {
        promise.then(_ => {
        console.log("Autoplay started")
        playButton.style.display = "none"
    }).catch(error => {
        console.log("Autoplay prevented")
        console.log("enabling video control")
        //localRTCVideo.controls = true;
        playButton.style.display = "block"
     });
    }

    //play button listener 
    playButton.addEventListener("click", clickPlay);
    function clickPlay(){
        console.log('user clicked play');         
        localRTCVideo.play();

    }




    //https://www.w3schools.com/tags/ref_av_dom.asp
    setTimeout(function(){
        localRTCVideo.innerHTML = '<source src="./" type="video/mp4">';
        localRTCVideo.playsInline = true
        localRTCVideo.play();
        console.log('safari hack'); 
    },3000)

    //setup and define fullscreen video player controls
    let webrtcContainer = document.getElementById("video_container");
    let vidControl = document.createElement('div');
    vidControl.innerHTML = webrtcVideoControls;
    vidControl.className = "video_controls";
    vidControl.id = "in_video_controls";
    webrtcContainer.appendChild(vidControl);   //put in video container
    
    //hover over to reveal controls
    let lastReveal = new Date().valueOf();
    let fadeTimer = setInterval(function() {
      if (lastReveal && lastReveal + 3000 < new Date().valueOf()) {
        vidControl.style.opacity = 0;
        lastReveal = null;
      }
    }, 1000);
    let vidControlHover = function(e) {
        if (typeof e === "object" && typeof e.type !== "undefined" && vidControl && videoScreen) {
          if (window.EmbedPage || document.fullscreenElement) {
            if (e.type === "mousemove") {
                vidControl.style.opacity = 1;
                lastReveal = new Date().valueOf();
            } else if (e.type === "click") {
                vidControl.style.opacity = 1;
                lastReveal = new Date().valueOf();
            }
          }
        }
    };
    
    let vidContainer = document.getElementById("video_container");
    //on-screen hover listeners
    vidContainer.addEventListener("mousemove", vidControlHover);
    vidContainer.addEventListener("click", vidControlHover);
    
    if (window.EmbedPage) {
      //embed page should always have inner volume slider accessible
      let innerVolControls = document.getElementById("info_controls_volume_inner");
      if (innerVolControls) {
        innerVolControls.style.display = "flex";
      }
      let vidControl = document.getElementById("in_video_controls");
      if (vidControl) {
        vidControl.style.bottom = "0px";
      }
    }

    //load volume if saved
    let volSlider = document.getElementById('volume-slider');
    if (localStorage.getItem("vid_volume") && volSlider) {
        console.log("loading saved volume from localStorage")
        var volumeConstraints = localStorage.getItem("vid_volume")/4;
        if (volumeConstraints > 1){volumeConstraints = 1}
        localRTCVideo.volume = volumeConstraints; 
        volSlider.value = volumeConstraints*400;
    }

    let webrtcVolumeFunction = function(vol) {
      if (vol !== undefined) {
        localRTCVideo.volume = vol;
      }
      return localRTCVideo.volume;
    }

    let volSliders = document.getElementsByClassName('rs-volume-slider');
    for (let i = 0; i < volSliders.length; i++) {
      let volSlider = volSliders[i];
      
      //load volume if saved
      _util_js__WEBPACK_IMPORTED_MODULE_2__.setupVolume(volSlider, webrtcVolumeFunction);
      
      //Listen to volume slider
      volSlider.addEventListener('input', function() {
        _util_js__WEBPACK_IMPORTED_MODULE_2__.volumeChangeListener(volSlider, webrtcVolumeFunction);
      });
    }

    _util_js__WEBPACK_IMPORTED_MODULE_2__.setupMuteButtons(webrtcVolumeFunction);

    localRTCVideo.onplay = function(){ 
        console.log("onplay : hide video controls - autoplay was allowed or a prevented user clicked")
        localRTCVideo.controls = false;
        playButton.style.display = "none"
    }
    //badidea for now
    localRTCVideo.onpause = function(){ 
        console.log("onpause > play : no pausing allowed")
        //localRTCVideo.play(); 
        localRTCVideo.controls = false;
        playButton.style.display = "block"
    }


    //quick volume control test.
    if (volSlider) {
      volSlider.addEventListener('input', volumeChange);
    }

    function volumeChange() {
        var volumeConstraints = this.value/400;
        if (volumeConstraints > 1){volumeConstraints = 1}
        localRTCVideo.volume = volumeConstraints; 
        localStorage.setItem("vid_volume", volumeConstraints * 4); 
      //because rick is going deaf and set the slider html range to 400%
        _util_js__WEBPACK_IMPORTED_MODULE_2__.muteState(false);
    }


    if (!window.EmbedPage) {
      videoScreen.addEventListener("fullscreenchange", function() {
        if (localRTCVideo) {
          let vidControl = document.getElementById("in_video_controls");
          let innerControls = document.getElementById("info_controls_volume_inner");
          if (document.fullscreenElement) {
            localRTCVideo.style.maxHeight = "100%";
            localRTCVideo.style.height = "100%";
            if (vidControl) {
              vidControl.style.bottom = "0px";
            }
            if (innerControls) {
              innerControls.style.display = "flex";
            }
          }
          else {
            localRTCVideo.style.maxHeight = "calc(100vh - 200px)";
            localRTCVideo.style.height = "";
            if (vidControl) {
              vidControl.style.bottom = "";
            }
            if (innerControls) {
              innerControls.style.display = "";
            }
          }
        }
      });
    }

    let fullscreenButton = document.getElementById('vid_fullscreen_re');
    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', RTCFullscreen);
    }

    function RTCFullscreen() {
        console.log('RTCFullscreen'); 

            if (videoScreen.requestFullscreen) {
              videoScreen.requestFullscreen();
            } else if (videoScreen.mozRequestFullScreen) { /* Firefox */
              videoScreen.mozRequestFullScreen();
            } else if (videoScreen.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
              videoScreen.webkitRequestFullscreen();
            } else if (videoScreen.msRequestFullscreen) { /* IE/Edge */
              videoScreen.msRequestFullscreen();
            }

    }


    //on peerClosed
    //remove all tracks
    room.on('@peerClosed', ({ peerId }) => {
        console.log(peerId);
        localRTCVideo.srcObject.getTracks().forEach(track => track.stop());
        localRTCVideo.srcObject = null;            
    });


    //on consumer
    //set peer id in the object
    //add the track, audio or video
    //play
    room.on('@consumer', async consumer => {
        const { appData: { peerId }, track, kind } = consumer;
        console.log('joinWebrtcRoom: receive consumer', kind);

        var capabilities = consumer.track.getSettings();
        console.log('localStream.getCapabilities()', capabilities)
        

        localRTCVideo.setAttribute('data-peer-id', peerId);
        localRTCVideo.srcObject.addTrack(consumer.track);

        await localRTCVideo.play().catch(console.error);

        console.log('joinWebrtcRoom: setting localVideo.srcObject');

     // }
    });

    //on consumerClosed
    //stream has ended 
    //prepare new mediastream for reconnect
    room.on('@consumerClosed', ({ data }) => {
        console.log('consumerClosed', data);
        localRTCVideo.srcObject = null;  
        localRTCVideo.srcObject = new MediaStream();          
    });


    room.once('@close', () => {
            //localRTCVideo.srcObject.getTracks().forEach(track => track.stop());
            //localRTCVideo.srcObject = null;

    });   
    
    
    localRTCVideo.doReconnect = function() {
      room.close();
      localRTCVideo.srcObject = null; 
      localRTCVideo.srcObject = new MediaStream();
      room.join(robotId, _global_js__WEBPACK_IMPORTED_MODULE_1__.pageLoadAPI.rtc_sfu, false, false, false);
      
      //detect autoplay
      var promise = localRTCVideo.play();
      console.log("promise:", promise)
      if (promise !== undefined) {
          promise.then(_ => {
          console.log("Autoplay started")
          playButton.style.display = "none"
      }).catch(error => {
          console.log("Autoplay prevented")
          console.log("enabling video control")
          //localRTCVideo.controls = true;
          playButton.style.display = "block"
       });
      }
    }


}



async function broadcastWebrtcRoom(videoElement, robotId, sourceStream = null){

    var isAndroid = /(android)/i.test(navigator.userAgent); //janky
    var localRTCVideo = videoElement;
    let lastBytesSent = 0;
    let currentIssues = {};
    console.log('isAndroid:', isAndroid)

    videoElement.setAttribute("playsinline", true);
    videoElement.removeAttribute("controls");

    //show hidden by default broadcaster controls
    document.getElementById("broadcaster_controls").style.display = "block"
    
    //hide stream related controls when not webrtc or explicitly tts only
    if (_global_js__WEBPACK_IMPORTED_MODULE_1__.pageLoadAPI.type != "webrtc" || window.ttsOnlyPage === true) {
      try {
        document.getElementById("toggle_stream").style.display = "none";
        document.getElementById("flip_camera").style.display = "none";
        document.getElementById("toggle_stats").style.display = "none";
        document.getElementById("broadcastLimit").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("broadcastBps").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("broadcastBpsMin").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("broadcastRes").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("forceCamera").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("forceAudio").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("autoGain").parentElement.parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("echoCancellation").parentElement.parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("noiseSuppression").parentElement.parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("manualGainEnabled").parentElement.parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("manualGain").parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("force48kSampleRate").parentElement.parentElement.parentElement.parentElement.style.display = "none";
        
        let videoToggle = document.createElement("span");
        videoToggle.style = "padding: 10px; color: #f7f7f7; background-color: #000000; cursor: pointer; position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);";
        videoToggle.innerText = "Enable video playback";
        document.getElementById("video_container").appendChild(videoToggle);
        videoToggle.addEventListener("click", function() {
          videoToggle.style.display = "none";
          document.getElementsByClassName("info-controls-volume")[0].style.display = "none";
          videoElement.style.display = "none";
          document.getElementById("video_container").insertAdjacentHTML('afterbegin', '<iframe style="z-index: 9999; max-height: calc(100vh - 200px); width: 100%; display: block; background-color: black; aspect-ratio: 1.668; border-width: 0px;" src="' + 'https://' + _config_js__WEBPACK_IMPORTED_MODULE_4__.domain + '/embed/' + robotId + '">');
        });
      }
      catch(err) {
        console.error(err);
      }
    }
    
    if (!isAndroid) {
      try {
        document.getElementById("manualGainEnabled").parentElement.parentElement.parentElement.parentElement.style.display = "none";
        document.getElementById("manualGain").parentElement.parentElement.parentElement.style.display = "none";
      }
      catch(err) {
        console.error(err);
      }
    }

    _global_js__WEBPACK_IMPORTED_MODULE_1__.isBroadcasting = true    //ew, global
    _global_js__WEBPACK_IMPORTED_MODULE_1__.isScreenShare = false    //ew, global
    var localStream                 //local video elem
    var room;                       //protoo room
    var codec = 'VP8';              //codec force for better compatability
    

    //default video contraints
    let videoConstraints = {
        height:     { ideal: 720},
        width :     { ideal: 1280},
        facingMode: { ideal: "environment" }
    }

    //default audio contraints
    let audioConstraintsDefault = {
        echoCancellation:   { ideal: false },
        autoGainControl: { ideal: false },
        noiseSuppression: { ideal: false },
        channelCount: { ideal:2 },
        volume: { ideal: 1.0 }
    }
    
    let audioConstraintsMobileDefault = {
        echoCancellation:   { ideal: false },
        autoGainControl: { ideal: false },
        noiseSuppression: { ideal: false },
        channelCount: { ideal:2 },
        volume: { ideal: 1.0 },
        sampleRate:{ ideal: 48000 }
    }
    
    let audioConstraints;
    if (isAndroid) {
      audioConstraints = structuredClone(audioConstraintsMobileDefault);
    }
    else {
      audioConstraints = structuredClone(audioConstraintsDefault);
    }
    
    //apply user settings to audio constraint
    let rtcSettings = localStorage.getItem("rtc_settings");
    if (rtcSettings) {
      try {
        rtcSettings = JSON.parse(rtcSettings);
        if ("autoGain" in rtcSettings) {
          audioConstraints["autoGainControl"] = {ideal: rtcSettings["autoGain"]};
        }
        if ("echoCancellation" in rtcSettings) {
          audioConstraints["echoCancellation"] = {ideal: rtcSettings["echoCancellation"]};
        }
        if ("noiseSuppression" in rtcSettings) {
          audioConstraints["noiseSuppression"] = {ideal: rtcSettings["noiseSuppression"]};
        }
        if ("force48kSampleRate" in rtcSettings) {
          if (rtcSettings["force48kSampleRate"] == "true") {
            audioConstraints["sampleRate"] = {ideal: 48000};
          }
        }
      }
      catch(err) {
        console.error(err);
      }
    }

    //safari testing
    //localStream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, 
    //                                                          audio: true,
    //                                                        }).catch(console.error);
    //localRTCVideo.muted = true;
    //localRTCVideo.srcObject = localStream;
    //await localRTCVideo.play().catch(console.error);
    //startStream();

    //dont start stream on pageload
    var currentlyStreaming = false; 
    document.getElementById("toggle_stream").innerHTML = "Start Stream";

    //broadcaster buttons
    document.getElementById("flip_camera").addEventListener("click", cameraSwitch);
    document.getElementById("toggle_stream").addEventListener("click", toggleStream);
    document.getElementById("tts_cancel").addEventListener("click", function(){
      (0,_chat_js__WEBPACK_IMPORTED_MODULE_3__.clearTTSQueue)();
    });
    document.getElementById("sound_cancel").addEventListener("click", function() {
      (0,_control_communication_js__WEBPACK_IMPORTED_MODULE_5__.stopAllSounds)();
    });
    document.getElementById("tts_test").addEventListener("click", function(){
      var message = "testing";
      var ttsVolume = document.getElementById("volume-slider-tts").value / 1000;
      var ttsPitch = document.getElementById("volume-slider-tts-pitch").value / 100;
      let ttsRate = document.getElementById("volume-slider-tts-rate").value / 10;
      var msg = new SpeechSynthesisUtterance(message);
      msg.rate = ttsRate;
      msg.pitch = ttsPitch;
      msg.volume = ttsVolume;
      msg.voiceURI = _global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices[document.getElementById("ttsVoice").value].voiceURI
      msg.lang = _global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices[document.getElementById("ttsVoice").value].lang 
      ;(0,_chat_js__WEBPACK_IMPORTED_MODULE_3__.addToTTSQueue)(msg);
    });
    document.getElementById("toggle_stats").addEventListener("click", function() {
      if (statsToggled) {
        document.getElementById("webrtc_stats_overlay").classList.remove("stats-enabled");
      }
      else {
        document.getElementById("webrtc_stats_overlay").classList.add("stats-enabled");
      }
      statsToggled = !statsToggled;
      localStorage.setItem("webrtc_stats_overlay", statsToggled);
    });
    statsToggled = localStorage.getItem("webrtc_stats_overlay") === "true";
    if (statsToggled) {
      document.getElementById("webrtc_stats_overlay").classList.add("stats-enabled");
    }
    //for some fkwitt reason using ideal for res on an unlocked deviceID will randomly change device


    //build voices dropdown
    //odd that its not just available to the browser on load and it does a second time
    window.onvoiceschangedDoOnce = true
    window.speechSynthesis.onvoiceschanged = function() {
        if(_global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices && _global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices.length > 0){
            console.log("already have voice list")
            return
        }
        else{
            _global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices = window.speechSynthesis.getVoices()
            //console.log(global.listVoices);
            var voicesHtml = '';
            var i, len;
            for (i = 0, len = _global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices.length; i < len; ++i) {
                console.log(_global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices[i]);
                voicesHtml = voicesHtml+'<option value="'+i+'">'+_global_js__WEBPACK_IMPORTED_MODULE_1__.listVoices[i].name+'</option>';
            }
            document.getElementById("ttsVoice").innerHTML = voicesHtml;
        }
    }
    //firefox doesnt trigger this properly
    //so...
    window.speechSynthesis.onvoiceschanged()


    //blow android. fix later
    if (!isAndroid){
        //build force camera/mic dropdowns
        //trigger firefox to ask for camera permissions
        let localStreamdummy = await navigator.mediaDevices.getUserMedia({ video: true, 
                                                                           audio: true,
                                                                }).catch(console.error);
    }


    var mediaDevices = await navigator.mediaDevices.enumerateDevices();
    console.log('mediaDevices', mediaDevices)

    //var supports = navigator.mediaDevices.getSupportedConstraints();
    //console.log('getSupportedConstraints', supports)
    //get video devices
    var mediaDevicesInputs = mediaDevices.filter(mediaDevice => mediaDevice.kind === 'videoinput')
    var mediaDeviceHtml;
    //loop filtered
    var i, len;
    for (i = 0, len = mediaDevicesInputs.length; i < len; ++i) {
        console.log(mediaDevicesInputs[i]);
        mediaDeviceHtml = mediaDeviceHtml+'<option value="'+mediaDevicesInputs[i].deviceId+'">'+mediaDevicesInputs[i].label+'</option>';
    }

    //insert screenshare option
    //android checks to be removed
    if (!isAndroid){
        mediaDeviceHtml = mediaDeviceHtml+'<option value="screen_share">Screen Share</option>';
    }

    document.getElementById("forceCamera").innerHTML = document.getElementById("forceCamera").innerHTML + mediaDeviceHtml;

    //get audio devices
    mediaDevicesInputs = mediaDevices.filter(mediaDevice => mediaDevice.kind === 'audioinput')
    mediaDeviceHtml = '';
    //loop filtered
    var i, len;
    for (i = 0, len = mediaDevicesInputs.length; i < len; ++i) {
        console.log(mediaDevicesInputs[i]);
        mediaDeviceHtml = mediaDeviceHtml+'<option value="'+mediaDevicesInputs[i].deviceId+'">'+mediaDevicesInputs[i].label+'</option>';
    }
    document.getElementById("forceAudio").innerHTML = document.getElementById("forceAudio").innerHTML + mediaDeviceHtml;

/*
    //hide broken features
    if (isAndroid){
        document.getElementById("android-hide1").style.display = 'none'
        document.getElementById("android-hide2").style.display = 'none'
        document.getElementById("android-hide3").style.display = 'none'
    }
*/

    //change camera deviceId.ideal
    document.getElementById("forceCamera").addEventListener("change", function(){

        var deviceID = document.getElementById("forceCamera").value
        if(deviceID !== 'default'){
            let deviceIDinsert = { deviceId:   { exact: deviceID} };
            Object.assign(videoConstraints, deviceIDinsert)
        }else{
            delete videoConstraints.deviceId
        }

        console.log("videoConstraints:", videoConstraints)

        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });


    //change audio deviceId.ideal
    document.getElementById("forceAudio").addEventListener("change", function(){

        var deviceID = document.getElementById("forceAudio").value
        if(deviceID !== 'default'){
            let deviceIDinsert = { deviceId:   { exact: deviceID} };
            Object.assign(audioConstraints, deviceIDinsert)
        }else{
            delete audioConstraints.deviceId
        }

        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });


    //on resolution change    
    document.getElementById("broadcastRes").addEventListener("change", function(){

        //var forcedCameraId = document.getElementById("forceCamera").value
        if(this.value === "480"){   videoConstraints.height.ideal = 480;
                                    videoConstraints.width.ideal = 848; }
        if(this.value === "720"){   videoConstraints.height.ideal = 720;
                                    videoConstraints.width.ideal = 1280; }

        console.log("resolution change:", videoConstraints)
        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });
    


    //on bitrate change    
    document.getElementById("broadcastBps").addEventListener("change", function(){
        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });
    
    //on minimum bitrate change    
    document.getElementById("broadcastBpsMin").addEventListener("change", function(){
        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });

    document.getElementById("autoGain").addEventListener("change", function() {
        audioConstraints["autoGainControl"] = {ideal: this.checked};
        if(currentlyStreaming){
            //localStream.getAudioTracks()[0].applyConstraints(audioConstraints);
            stopStream();
            startStream();
        }
    });
    
    document.getElementById("echoCancellation").addEventListener("change", function() {
        audioConstraints["echoCancellation"] = {ideal: this.checked};
        if(currentlyStreaming){
            //localStream.getAudioTracks()[0].applyConstraints(audioConstraints);
            stopStream();
            startStream();
        }
    });
    
    document.getElementById("noiseSuppression").addEventListener("change", function() {
        audioConstraints["noiseSuppression"] = {ideal: this.checked};
        if(currentlyStreaming){
            //localStream.getAudioTracks()[0].applyConstraints(audioConstraints);
            stopStream();
            startStream();
        }
    });
    
    document.getElementById("zoom-slider").addEventListener("input", function() {
        videoConstraints["advanced"] = [{zoom: parseInt(this.value)}];
        if (currentlyStreaming) {
            localStream.getVideoTracks()[0].applyConstraints({advanced: [{zoom: parseInt(this.value)}]});
        }
    });
    
    document.getElementById("manualGainEnabled").addEventListener("change", function() {
        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });

    document.getElementById("flashlight_toggle").addEventListener("click", function() {
      this.flashlightEnabled = !this.flashlightEnabled
      videoConstraints["advanced"] = [{torch: this.flashlightEnabled}];
      localStream.getVideoTracks()[0].applyConstraints({advanced: [{torch: this.flashlightEnabled}]});
      if (this.flashlightEnabled) {
        this.classList.add("flashlight-toggle-on");
      }
      else {
        this.classList.remove("flashlight-toggle-on");
      }
    });
    
    if (isAndroid) {
      document.getElementById("manualGain").value = 50;
    }
    document.getElementById("manualGain").addEventListener("input", function() {
        if (currentlyStreaming && localRTCVideo.gainControl) {
            localRTCVideo.gainControl.gain.value = parseInt(this.value);
        }
    });
    
    if (isAndroid) {
      document.getElementById("force48kSampleRate").checked = true;
    }
    document.getElementById("force48kSampleRate").addEventListener("change", function() {
        if (this.checked) {
          audioConstraints["sampleRate"] = {ideal: 48000};
        }
        else {
          delete audioConstraints.sampleRate;
        }
        if(currentlyStreaming){
            stopStream();
            startStream();
        }
    });
    

    async function toggleStream(){
        if(currentlyStreaming){
            stopStream();
        }
        else{
            startStream(true);
        }
    }

    async function filterStats() {
        if(currentlyStreaming){
            var stats = await room.getStatistics()
            stats.forEach(stat => {
                //console.log(stat);
                if (stat.mediaType == 'video'){
                    //console.log(stat);
                    console.log("qualityLimitationReason:", stat.qualityLimitationReason);
                    console.log("framesEncoded:", stat.framesEncoded);
                    console.log("bytesSent:", stat.bytesSent);
                    
                    if (typeof stat.qualityLimitationReason !== 'undefined' && stat.qualityLimitationReason !== 'none') {
                        let qualityIssue = stat.qualityLimitationReason;
                        currentIssues[qualityIssue] = new Date().valueOf();
                    }
                    
                    let skipReset = false;
                    if (typeof stat.qualityLimitationReason !== 'undefined' &&
                        typeof stat.framesEncoded !== 'undefined' &&
                        stat.qualityLimitationReason !== 'none' &&
                        document.getElementById("broadcastLimit").value == 'restart'){
                        console.log("stream quality issue detected");
                        
                        let currentTime = new Date();

                        //document.getElementById("stream-stats").innerHTML = "test:"+framesEncoded;
            
                        // if duration is too small, set it to skip reset
                        if (typeof(window.rsLastResetTime) != 'undefined') {
                          let millisDuration = currentTime - window.rsLastResetTime;
                          if (millisDuration < 4*60*1000) {
                            skipReset = true;
                          }
                        }

                        if (!skipReset) {
                          window.rsLastResetTime = currentTime;  
                          stopStream();
                          startStream();
                        }
                    }
                    if (stat.bytesSent !== undefined) {
                      let bitrate = (stat.bytesSent * 8) - (lastBytesSent * 8);
                      if (bitrate < 0) {
                        bitrate = 0;
                      }
                      document.getElementById("webrtc_stats_overlay_bitrate").innerText = (bitrate / 1000).toFixed(2) + " Kb/s";
                      lastBytesSent = stat.bytesSent;
                    }
                    
                    let issueCount = 0;
                    let issuesPrefix = "Connection issue:";
                    let issuesString = "";
                    let currentTime = new Date().valueOf();
                    for (let [issue, addTime] of Object.entries(currentIssues)) {
                      //5 second visibility
                      if (currentTime < 5000 + addTime) {
                        issuesString += issue + ", ";
                        issueCount++;
                      }
                    }
                    issuesString = issuesString.replace(/,\s$/, "");
                    if (issueCount > 1) {
                      issuesPrefix = "Connection issues:";
                    }
                    document.getElementById("webrtc_stats_overlay_quality_issue").innerText = (issueCount <= 0 ? "" : issuesPrefix + " " + issuesString);
                }
                else if (stat.type == 'transport') {
                  let streamerDot = document.getElementById("stream_dot");
                  let statusText = document.getElementById("webrtc_stats_overlay_status");
                  if (stat.iceState != "connected") {
                    statusText.style.display = "block";
                    statusText.innerText = "Disconnected";
                    streamerDot.style.backgroundColor = "#FFD56A";
                  }
                  else {
                    statusText.style.display = "";
                    statusText.innerText = "";
                    streamerDot.style.backgroundColor = "";
                  }
                  
                  if (stat.iceState == "failed") {
                    if (currentlyStreaming) {
                      let currentTime = new Date().valueOf();
                      if (currentTime > lastAutoReconnect + 10000) {
                        console.log("Reconnecting due to connection failure.");
                        lastAutoReconnect = currentTime;
                        stopStream();
                        startStream();
                      }
                    }
                  }
                } 
            })
        }

    }
    setInterval(filterStats, 1000);


    async function startStream(firstStart = false){

        room = new _room__WEBPACK_IMPORTED_MODULE_0__["default"]();
        console.log("startStream()")
        console.log("videoConstraints", videoConstraints)
        console.log("audioConstraints", audioConstraints)

        //is screenshare or not
        if(document.getElementById("forceCamera").value == 'screen_share'){
            _global_js__WEBPACK_IMPORTED_MODULE_1__.isScreenShare = true;
        }else{
            _global_js__WEBPACK_IMPORTED_MODULE_1__.isScreenShare = false;
        }
        console.log("isScreenShare:", _global_js__WEBPACK_IMPORTED_MODULE_1__.isScreenShare)
        
        //ensure conflicting settings don't get used at the same time
        let optimizedAudioConstraints = structuredClone(audioConstraints);
        if (document.getElementById("manualGainEnabled").checked) {
          optimizedAudioConstraints["autoGainControl"] = {ideal: false};
          optimizedAudioConstraints["echoCancellation"] = {ideal: false};
        }

        if(_global_js__WEBPACK_IMPORTED_MODULE_1__.isScreenShare){  
            
            //if (navigator.getDisplayMedia) {
                //request screenshare wait for user option
                var mediaDisplay = await navigator.mediaDevices.getDisplayMedia();
                console.log(mediaDisplay)

                //render local
                localRTCVideo.muted = true;
                localRTCVideo.srcObject = mediaDisplay;
                //only get audio for screenshare
                localStream = await navigator.mediaDevices.getUserMedia({ video: false, 
                                                                          audio: optimizedAudioConstraints,
                                                                        }).catch(console.error);
            //}
        }else{
            //if (navigator.getUserMedia) {

                localStream = null;
                localStream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, 
                                                                          audio: optimizedAudioConstraints,
                                                                        }).catch(console.error);
                //render local
                localRTCVideo.muted = true;
                localRTCVideo.srcObject = localStream;
                console.log('localRTCVideo.srcObject:', localRTCVideo.srcObject)
                
            //}               
        } 


        //play locally
        await localRTCVideo.play().catch(console.error);        
    
        if (firstStart) {
          _util_js__WEBPACK_IMPORTED_MODULE_2__.sendNotification(robotId, false);
        }
    
        currentlyStreaming = true
        //join as broadcaster
        room.join(robotId,
                  _global_js__WEBPACK_IMPORTED_MODULE_1__.pageLoadAPI.rtc_sfu,
                  codec, 
                  true, 
                  window.localStorage.getItem("robotstreamer_token"),
                  document.getElementById("broadcastBps").value,
                  document.getElementById("broadcastBpsMin").value);



        



        room.once('@open', ({ peers }) => {
            //console.log(`${peers.length} peers in this room.`);
            try {
              if (document.getElementById("manualGainEnabled").checked) {
                //setup audio gain stuff
                let currentAudio = localStream.getAudioTracks()[0];
                if (audioCxt) {
                  audioCxt.close();
                }
                audioCxt = new AudioContext();
                let gainSetting = audioCxt.createGain();
                let gainSlider = document.getElementById("manualGain");
                let gainSliderInt = parseInt(gainSlider.value);
                if (!isNaN(gainSliderInt)) {
                  gainSetting.gain.value = gainSliderInt;
                }
                else {
                  gainSetting.gain.value = 50;
                }
                
                let compressor = audioCxt.createDynamicsCompressor();
                compressor.threshold.value = -30;
                compressor.knee.value = 40;
                compressor.ratio.value = 4;
                compressor.attack.value = 0;
                compressor.release.value = 0.25;
                
                let audioInput = audioCxt.createMediaStreamSource(new MediaStream([currentAudio]));
                let audioOutput = audioCxt.createMediaStreamDestination();
                audioInput.connect(compressor);
                compressor.connect(gainSetting);
                gainSetting.connect(audioOutput);
                
                let newAudio = audioOutput.stream.getAudioTracks()[0];
                localStream.removeTrack(currentAudio);
                localStream.addTrack(newAudio);
                
                localRTCVideo.gainControl = gainSetting;
              }
              
              
              //if screen share use mediaDisplay
              if(_global_js__WEBPACK_IMPORTED_MODULE_1__.isScreenShare){
                  document.getElementById("zoom-slider").style.display = "none";
                  room.sendVideo(mediaDisplay.getVideoTracks()[0]);
                  room.sendAudio(localStream.getAudioTracks()[0]);

              }else{
                  let caps = {};
                  if (typeof localStream.getVideoTracks()[0].getCapabilities !== 'undefined') {
                    caps = localStream.getVideoTracks()[0].getCapabilities();
                  }
                  if ("zoom" in caps) {
                    document.getElementById("zoom-slider").style.display = "block";
                  }
                  else {
                    document.getElementById("zoom-slider").style.display = "none";
                  }
                  if ("torch" in caps) {
                    document.getElementById("flashlight_toggle").style.display = "block";
                  }
                  else {
                    document.getElementById("flashlight_toggle").style.display = "none";
                  }

                  if (typeof localStream.getAudioTracks()[0].getCapabilities !== 'undefined') {
                    console.log("getCapabilities Audio:",localStream.getAudioTracks()[0].getCapabilities())
                  }
                  console.log("localStream.getAudioTracks():",localStream.getAudioTracks())
                  console.log("localStream.getVideoTracks():",localStream.getVideoTracks())


                  room.sendVideo(localStream.getVideoTracks()[0]);
                  room.sendAudio(localStream.getAudioTracks()[0]);
              }
            }
            catch (err) {
              console.error(err);
            }

            document.getElementById("toggle_stream").innerHTML = "Stop Stream"
        });


        room.once('@close', () => {
            //fix
            document.getElementById("toggle_stream").innerHTML = "Start Stream"
            try {
              localStream.srcObject = null;
            }
            catch (err) {
              console.error(err);
            }
        });

    }


    //used in toggle or res change
    async function stopStream(){
        console.log("stopStream()")
        room.close();
        room = null;
        currentlyStreaming = false;
        document.getElementById("flashlight_toggle").style.display = "none";
    }


    //cameraswitch btn
    async function cameraSwitch(){
        if (videoConstraints.facingMode.ideal == "user"){
            videoConstraints.facingMode.ideal = "environment";
        }else{
            videoConstraints.facingMode.ideal = "user"
        }
        console.log("videoConstraints.facingMode.ideal:", videoConstraints.facingMode.ideal)

        stopStream();
        startStream();
    }


    async function redDotFlash(){

        var redDot = document.getElementById("stream_dot");
        if (currentlyStreaming){
            if(redDot.style.display == "block"){
                redDot.style.display = "none";
            }else{
                redDot.style.display = "block";
            }
        }else{
            redDot.style.display = "none";
        }

        setTimeout(redDotFlash, 500); //flash period
    }  
    redDotFlash();

    //prevent streamer from unintentionally clicking away while streaming
    window.addEventListener("beforeunload", function(e){
      if (currentlyStreaming) {
        e.preventDefault();
        e.returnValue = "You are still streaming. Are you sure you want to leave the page?";
      }
    });

    function sliderChange(slider) {
      let settings = localStorage.getItem("rtc_settings");
      if (!settings) {
        settings = {};
      }
      else {
        try {
          settings = JSON.parse(settings);
        }
        catch(err) {
          settings = {};
        }
      }
      settings[slider.id] = slider.value;
      localStorage.setItem("rtc_settings", JSON.stringify(settings));
    }
    
    function dropdownChange(dropper) {
      let settings = localStorage.getItem("rtc_settings");
      if (!settings) {
        settings = {};
      }
      else {
        try {
          settings = JSON.parse(settings);
        }
        catch(err) {
          settings = {};
        }
      }
      settings[dropper.id] = dropper.selectedIndex;
      localStorage.setItem("rtc_settings", JSON.stringify(settings));
    }
    
    function checkboxChange(checkbox) {
      let settings = localStorage.getItem("rtc_settings");
      if (!settings) {
        settings = {};
      }
      else {
        try {
          settings = JSON.parse(settings);
        }
        catch(err) {
          settings = {};
        }
      }
      settings[checkbox.id] = checkbox.checked;
      localStorage.setItem("rtc_settings", JSON.stringify(settings));
    }

    function enableSettingSave(eleId, toRun) {
      let element = document.getElementById(eleId);
      if (element) {
        element.addEventListener("change", function() {
          toRun(element);
        });
      }
    }

    function restoreRtcSetting(name, type, settings) {
      let element = document.getElementById(name);
      if (element && name in settings) {
        element[type] = settings[name];
        let changeEvent = new Event("change");
        element.dispatchEvent(changeEvent);
      }
    }

    //restore stream settings
    let settings = localStorage.getItem("rtc_settings");
    if (settings) {
      try {
        settings = JSON.parse(settings);
        restoreRtcSetting("volume-slider-tts", "value", settings);
        restoreRtcSetting("volume-slider-tts-pitch", "value", settings);
        restoreRtcSetting("volume-slider-tts-rate", "value", settings);
        restoreRtcSetting("ttsVoice", "selectedIndex", settings);
        restoreRtcSetting("ttsNames", "selectedIndex", settings);
        restoreRtcSetting("ttsQueue", "selectedIndex", settings);
        restoreRtcSetting("volume-slider-notifications", "value", settings);
        restoreRtcSetting("broadcastLimit", "selectedIndex", settings);
        restoreRtcSetting("broadcastBps", "selectedIndex", settings);
        restoreRtcSetting("broadcastBpsMin", "selectedIndex", settings);
        restoreRtcSetting("broadcastRes", "selectedIndex", settings);
        restoreRtcSetting("forceCamera", "selectedIndex", settings);
        restoreRtcSetting("forceAudio", "selectedIndex", settings);
        restoreRtcSetting("allowSounds", "selectedIndex", settings);
        restoreRtcSetting("ttsDuration", "selectedIndex", settings);
        restoreRtcSetting("volume-slider-sounds", "value", settings);
        restoreRtcSetting("autoGain", "checked", settings);
        restoreRtcSetting("echoCancellation", "checked", settings);
        restoreRtcSetting("noiseSuppression", "checked", settings);
        restoreRtcSetting("manualGainEnabled", "checked", settings);
        restoreRtcSetting("manualGain", "value", settings);
        restoreRtcSetting("force48kSampleRate", "checked", settings);
      }
      catch(err) {
        console.error(err);
      }
    }
    
    enableSettingSave("volume-slider-tts", sliderChange);
    enableSettingSave("volume-slider-tts-pitch", sliderChange);
    enableSettingSave("volume-slider-tts-rate", sliderChange);
    enableSettingSave("ttsVoice", dropdownChange);
    enableSettingSave("ttsNames", dropdownChange);
    enableSettingSave("ttsQueue", dropdownChange);
    enableSettingSave("volume-slider-notifications", sliderChange);
    enableSettingSave("broadcastLimit", dropdownChange);
    enableSettingSave("broadcastBps", dropdownChange);
    enableSettingSave("broadcastBpsMin", dropdownChange);
    enableSettingSave("broadcastRes", dropdownChange);
    enableSettingSave("forceCamera", dropdownChange);
    enableSettingSave("forceAudio", dropdownChange);
    enableSettingSave("allowSounds", dropdownChange);
    enableSettingSave("ttsDuration", dropdownChange);
    enableSettingSave("volume-slider-sounds", sliderChange);
    enableSettingSave("autoGain", checkboxChange);
    enableSettingSave("echoCancellation", checkboxChange);
    enableSettingSave("noiseSuppression", checkboxChange);
    enableSettingSave("manualGainEnabled", checkboxChange);
    enableSettingSave("manualGain", sliderChange);
    enableSettingSave("force48kSampleRate", checkboxChange);
    
    localRTCVideo.doReconnect = function() {
      if (currentlyStreaming) {
        stopStream();
        startStream();
      }
    }

}


//# sourceURL=webpack://rswebclient/./src/lib/webrtc/webrtc.js?