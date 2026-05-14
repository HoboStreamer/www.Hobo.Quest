__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeRobotPanel: () => (/* binding */ makeRobotPanel),
/* harmony export */   makeRobotPanelVideoOnly: () => (/* binding */ makeRobotPanelVideoOnly),
/* harmony export */   updateDescription: () => (/* binding */ updateDescription)
/* harmony export */ });
/* harmony import */ var _buttons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buttons.js */ "./src/buttons.js");
/* harmony import */ var _audio_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audio.js */ "./src/audio.js");
/* harmony import */ var _video_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./video.js */ "./src/video.js");
/* harmony import */ var _chat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chat.js */ "./src/chat.js");
/* harmony import */ var _follow_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./follow.js */ "./src/follow.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./global.js */ "./src/global.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_global_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _lib_webrtc_webrtc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/webrtc/webrtc */ "./src/lib/webrtc/webrtc.js");
/* harmony import */ var _lib_webrtc_room__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lib/webrtc/room */ "./src/lib/webrtc/room.js");
/* harmony import */ var video_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! video.js */ "./node_modules/video.js/dist/video.es.js");









 
//temp as i muck about


var videoControls = '<div class="stream-video-info-controls">\
                        <div class="info-controls-volume">\
                          <img class="volume-mute" src="/images/volumeicon.svg" alt="volume-icon">\
                            \
                            <div id="volume-inner">\
                              <input type="range" min="0" max="600" value="50" class="volume-slider">\
                            </div>\
                            \
                        </div>\
                        <div class="info-controls-fullscreen" style="margin: -10px 16px" ">\
                          <div id="vid_fullscreen_re-onscreen" class="fullscreen-icon">\
                            <a href="#"><img src="/images/fullscreen-on.svg" alt="fullscreen-icon"></a>\
                          </div>\
                        </div>\
                      </div>';

let hlsVideoControls = '<div class="stream-video-info-controls" style="align-items: center;width: 100%;">\
                          <div class="info-controls-volume" id="info_controls_volume_inner">\
                            <img class="volume-mute" src="/images/volumeicon.svg" alt="volume-icon">\
                              \
                              <div id="volume-inner">\
                                <input type="range" min="0" max="400" value="400" class="volume-slider rs-volume-slider">\
                              </div>\
                              \
                          </div>\
                          <div class="info-controls-video" id="info_controls_video_inner">\
                            <img id="video_cog" src="/images/settingsicon.svg" alt="Video Options">\
                            <div id="video_options_pane">\
                              <select name="quality_options" id="quality_options">\
                                <option class="quality-option" value="">Source&nbsp;</div>\
                                <option class="quality-option" value="720">720p</div>\
                                <option class="quality-option" value="480">480p</div>\
                                <option class="quality-option" value="360">360p</div>\
                              </select>\
                            </div>\
                          </div>\
                        </div>';

let lastHlsStartup = Date.now();




async function makePIP(robotID, vidContainer, canvas) {

    //get the camera id of the pip

    //let pipCameraIDResult = global.pageLoadAPI.pip
    let pipCameraIDResult = _global_js__WEBPACK_IMPORTED_MODULE_7__.pageLoadAPI.pip
    //let pipCameraIDResult = await axiosGET(rsConfig["api_host"] + '/v1/get_pip_camera_id/' + robotID);
    let pipCameraID = pipCameraIDResult;

    console.log("pip camera id result: ", pipCameraID);

    //check if pip
    if (pipCameraID === null) {
        console.log("pip camera id is null indicating this robot shows no pip");
        return;
    }

    //check if pip camera is online
    //todo: add the online/offline status to the /v1/get_pip_camera_id/
    //if(pipCameraIDResult.data.status == "offline"){
    //    console.log("pip camera is offline:", robotInfo);
    //    return;
    //}


    var pipContainer = document.createElement("div"),
        pipWidth = Math.round(vidContainer.clientWidth/3.1),
        pipHeight = Math.round(vidContainer.clientHeight/3.1),
        pipX = 10,
        pipY = 10;

    //console.log("canvas h: ", vidContainer.clientHeight);
    //console.log("canvas w: ", vidContainer.clientWidth);

    pipContainer.className = "pip_video_container";
    pipContainer.style.zIndex = 999; //tune this properly
    pipContainer.style.width = (pipWidth + "px");
    pipContainer.style.height = (pipHeight + "px");
    pipContainer.style.position = "absolute";
    pipContainer.style.left = (pipX + "px");
    pipContainer.style.top = (pipY + "px");
    // add pip video canvas to body
    vidContainer.appendChild(pipContainer);

    var pipCanvas = document.createElement('canvas');
    pipCanvas.className = "pip_video_canvas";
    pipCanvas.style.width = "100%";
    pipCanvas.style.height = "100%";
    pipCanvas.style.position = "absolute";
    pipContainer.appendChild(pipCanvas);

    // canvas video player controls
    var vidControl = document.createElement('div');
    vidControl.innerHTML = '<div class="video_volume"><a href="#" class="vol_mute"><i class="fas fa-volume-up"></i></a> <div class="vol_slider"><div class="vol_slider_fill"></div></div></div>';
    vidControl.className = "video_controls";

    pipContainer.appendChild(vidControl); // put in video container

    var pipResize = document.createElement('a');
    pipResize.className = "pip_video_resize";
    pipResize.style.width = "18px";
    pipResize.style.height = "18px";
    pipResize.style.position = "absolute";
    pipResize.style.zIndex = 999;
    pipContainer.appendChild(pipResize);

    var startX = false, startY = false, isResize = false;

    var pipResizing = function(e) {
        if (e.shiftKey) {
            // hold shift for free resize mode
            var offX = (e.pageX - startX), offY = (e.pageY - startY);
            pipContainer.style.width = ((pipWidth + offX) + "px");
            pipContainer.style.height = ((pipHeight + offY) + "px");
        } else {
            // the equation to maintain aspect ratio below needs improvement
            var offX = (e.pageX - startX), clampW = pipWidth, clampH = pipHeight;
            while(clampW > 420) {
                clampW = (clampW - (clampW/4));
                clampH = (clampH - (clampH/4));
            }
            pipContainer.style.width = ((pipWidth + (clampW * (offX/580))) + "px");
            pipContainer.style.height = ((pipHeight + (clampH * (offX/580))) + "px");
        }
    };

    var pipResized = function(e) {
        pipWidth = parseInt(pipContainer.style.width), pipHeight = parseInt(pipContainer.style.height), isResize = false;
        window.removeEventListener("mouseup", pipResized);
        window.removeEventListener("mousemove", pipResizing);
        e.preventDefault();
    };

    var pipDrag = function(e) {
        var offX = (e.pageX - startX), offY = (e.pageY - startY);
        pipContainer.style.left = ((pipX + offX) + "px");
        pipContainer.style.top = ((pipY + offY) + "px");
        if (-parseInt(pipContainer.style.left) > pipContainer.parentNode.getBoundingClientRect().left) {
            pipContainer.style.left = (-pipContainer.parentNode.getBoundingClientRect().left + "px");
        }
        if ( (parseInt(pipContainer.style.left) + pipContainer.parentNode.getBoundingClientRect().left + pipWidth) > document.body.clientWidth ) {
            pipContainer.style.left = ((document.body.clientWidth - pipContainer.parentNode.getBoundingClientRect().left - pipWidth) + "px");
        }
        var offsetNav = ((!window.screenTop && !window.screenY) ? 0 : 46);
        if ((-parseInt(pipContainer.style.top)+offsetNav) > pipContainer.parentNode.getBoundingClientRect().top) {
            pipContainer.style.top = ((-pipContainer.parentNode.getBoundingClientRect().top + offsetNav) + "px");
        }
        if ( (parseInt(pipContainer.style.top) + pipContainer.parentNode.getBoundingClientRect().top + pipHeight) > document.body.clientHeight ) {
            pipContainer.style.top = ((document.body.clientHeight - pipContainer.parentNode.getBoundingClientRect().top - pipHeight) + "px");
        }
    };

    var pipDrop = function(e) {
        pipX = parseInt(pipContainer.style.left), pipY = parseInt(pipContainer.style.top);
        window.removeEventListener("mouseup", pipDrop);
        window.removeEventListener("mousemove", pipDrag);
        e.preventDefault();
    };

    pipResize.addEventListener("mousedown", function(e) {
        window.removeEventListener("mouseup", pipDrop);
        window.removeEventListener("mousemove", pipDrag);

        startX = e.pageX, startY = e.pageY, isResize = true;
        window.addEventListener("mouseup", pipResized);
        window.addEventListener("mousemove", pipResizing);
        e.preventDefault();
    });

    pipContainer.addEventListener("mousedown", function(e) {
        if (!isResize && (!e.target || e.target.className.indexOf("vol_") === -1)) {
            startX = e.pageX, startY = e.pageY;
            window.addEventListener("mouseup", pipDrop);
            window.addEventListener("mousemove", pipDrag);
        }
        e.preventDefault();
    });

    // hover over to reveal controls (youtube style)
    var vidControlHover = function(e) {
        if (typeof e === "object" && typeof e.type !== "undefined" && vidControl) {
            if (e.type === "mouseover") {
                vidControl.style.opacity = 1;
            } else if (e.type === "mouseout" && vidControl.className.indexOf("hidden") === -1) {
                vidControl.style.opacity = 0;
            }
        }
    };
    //pip on-screen hover listener
    vidControl.addEventListener("mouseover", vidControlHover);
    vidControl.addEventListener("mouseout", vidControlHover);
    pipCanvas.addEventListener("mouseover", vidControlHover);
    pipCanvas.addEventListener("mouseout", vidControlHover);

    _video_js__WEBPACK_IMPORTED_MODULE_2__.initVideo(pipCanvas, pipCameraID, vidControl, true);
    _audio_js__WEBPACK_IMPORTED_MODULE_1__.initAudio(pipCanvas, pipCameraID, vidControl, true);

}




// returns a robot panel object
async function makeRobotPanel(robotID, useKeys, videoType = 'jsmpeg', broadcastPage = false, embedPage = false) {

    //todo: API sometimes spits out null needs looking at
    //if (robotID != null){
    console.log("Start makeRobotPanel for: ", robotID);

    var API = _global_js__WEBPACK_IMPORTED_MODULE_7__.pageLoadAPI
    var robot_owner_id = API.owner
    var nsfw_broadcaster = false
    var robot_followers = API.followers
    let user_name;
    var robot_name;
    let rtmpTranscoding = false;
    if (API.last_online !== undefined && API.last_online !== null) {
      _global_js__WEBPACK_IMPORTED_MODULE_7__.lastOnline = new Date(API.last_online);
    }
    if (API.last_startup !== undefined && API.last_startup !== null) {
      _global_js__WEBPACK_IMPORTED_MODULE_7__.lastStartup = new Date(API.last_startup);
    }
    

    //sift out useful information from the pageload call
    for (var i = API.robots.length - 1; i >= 0; i--) {
        //every user
    
        if (API.robots[i].user_id == robot_owner_id){
            //get broadcaster nsfw rating
            //console.log("nsfw_broadcaster: ",API.robots[i].nsfw_broadcaster);
            nsfw_broadcaster = API.robots[i].nsfw_broadcaster
            user_name = API.robots[i].user_name;
            rtmpTranscoding = API.robots[i].rtmp_transcoding;
        }

        for (var index = 0; index < API.robots[i].robots.length; ++index) {

            if (API.robots[i].robots[index].robot_id == robotID){
                //console.log("found name", API.robots[i].robots[index].robot_name);
                robot_name = _util_js__WEBPACK_IMPORTED_MODULE_5__.stripTagsAndQuotes(API.robots[i].robots[index].robot_name);
                var robot_status = API.robots[i].robots[index].status
                var robot_viewers = API.robots[i].robots[index].viewers
                var robot_camera_id = API.robots[i].robots[index].camera_id
            }
        }
    }

    if (robot_name === undefined) {
      if (API.title_data !== undefined && API.title_data['robot_name'] !== undefined) {
        robot_name = _util_js__WEBPACK_IMPORTED_MODULE_5__.stripTagsAndQuotes(API.title_data['robot_name']);
      }
      else {
        robot_name = "Room | " + robotID;
      }
    }
    if (user_name === undefined) {
      if (API.title_data !== undefined && API.title_data['owner_name'] !== undefined) {
        user_name = _util_js__WEBPACK_IMPORTED_MODULE_5__.stripTagsAndQuotes(API.title_data['owner_name']);
      }
      else {
        user_name = "";
      }
    }

    if (!embedPage) {
      //set title
      document.getElementById("title").innerHTML = robot_name + ' - ' + user_name + ' - ' + _util_js__WEBPACK_IMPORTED_MODULE_5__.capitalizeFirst(_config_js__WEBPACK_IMPORTED_MODULE_6__.domain);
      window.lastTitle = robot_name + ' - ' + user_name + ' - ' + _util_js__WEBPACK_IMPORTED_MODULE_5__.capitalizeFirst(_config_js__WEBPACK_IMPORTED_MODULE_6__.domain);


      if (API.mandatory_message && API.mandatory_message != "") {
        let mandatoryMessageWindow = document.createElement("div");
        mandatoryMessageWindow.id = "mandatory_message_window";
        mandatoryMessageWindow.innerHTML = '\
                                            <img src="/images/emotes/pSmile.png" id="mandatory_message_picture">\
                                            <div id="mandatory_message_title">Message from Admins</div>\
                                            <p id="mandatory_message_contents"></p>\
                                            <div style="text-align: center;"><div id="mandatory_message_dismiss_button">Dismiss</div></div>\
                                            ';
        try {
          document.getElementsByTagName("BODY")[0].appendChild(mandatoryMessageWindow);
          document.getElementById("mandatory_message_contents").innerText = API.mandatory_message;
          document.getElementById("mandatory_message_dismiss_button").addEventListener("click", function() {
            mandatoryMessageWindow.remove();
          });
        }
        catch (e) {
          console.error(e);
        }
      }


      // if user hasnt agreed and its not a broadcast page
      if (window.localStorage.getItem('nsfw_content_ok') !== "true" && !broadcastPage){
          //and is a nsfw stream
          if (nsfw_broadcaster){
              //show clunge
              _util_js__WEBPACK_IMPORTED_MODULE_5__.makeNSFWWarningBox();
              //dont load anything else
              return;
          }
      }
      

      //if owner on all video types
      if (robot_owner_id ==  window.localStorage.getItem("robotstreamer_user_id")){

          //show send_notification button
          var send_notification_button = document.getElementById("send_notification");
          send_notification_button.style.display = "block";
          
          //show reset funbit goal button
          var reset_funbit_goal_button = document.getElementById("reset_funbit_goal");
          reset_funbit_goal_button.style.display = "block";
          

          reset_funbit_goal_button.addEventListener("click", resetFunbitGoal);
          async function resetFunbitGoal(){
              console.log("resetFunbitGoal clicked");
              _util_js__WEBPACK_IMPORTED_MODULE_5__.resetFunbitGoal();
          }

          send_notification_button.addEventListener("click", sendNotification);
          async function sendNotification(){
              console.log("sendNotification clicked");
              _util_js__WEBPACK_IMPORTED_MODULE_5__.sendNotification(robotID, true);
          }
      }


      if (nsfw_broadcaster){

          var jsonfeign = {
              "message": "this broadcaster is marked nsfw", 
              "username": "Stream Info", 
              "color": "fff", 
              "tts": false}

          _chat_js__WEBPACK_IMPORTED_MODULE_3__.onMessageReceived(jsonfeign, false);
          _chat_js__WEBPACK_IMPORTED_MODULE_3__.expScrollChat();
      }
      if (robot_owner_id == window.localStorage.getItem("robotstreamer_user_id") && videoType == "rtmp" && !broadcastPage) {
        let ttsUrl = "https://" + _config_js__WEBPACK_IMPORTED_MODULE_6__.domain + "/robot/" + robotID + "/tts";
        var jsonfeign = {
            "message": "You can enable TTS and sounds on your stream by opening " + ttsUrl, 
            "username": "Streamer Info", 
            "color": "fff", 
            "tts": false}

        _chat_js__WEBPACK_IMPORTED_MODULE_3__.onMessageReceived(jsonfeign, false);
        _chat_js__WEBPACK_IMPORTED_MODULE_3__.expScrollChat();
      }


      //set streamname
      document.getElementById("stream_name").innerHTML = _util_js__WEBPACK_IMPORTED_MODULE_5__.stripTagsAndQuotes(robot_name);
      document.getElementById("stream_name").title = _util_js__WEBPACK_IMPORTED_MODULE_5__.restoreAmpersands(_util_js__WEBPACK_IMPORTED_MODULE_5__.restoreTagsAndQuotes(robot_name));
      // set viewcounter
      document.getElementById("stream_viewers").innerHTML = robot_viewers || '0';
      //set followcounter
      document.getElementById("stream_followers").innerHTML = robot_followers || '0';

      //set robot description for desktop and mobile
      if (API.description){
          updateDescription(API.description);
      }     

      //set red dot if online - default display:none
      if (robot_status == "online"){
          document.getElementById("stream_dot").style.display = "block"
          document.getElementById("stream_timer").innerText = _util_js__WEBPACK_IMPORTED_MODULE_5__.getTimeElapsedStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastStartup);
          let prettyDate = _util_js__WEBPACK_IMPORTED_MODULE_5__.getLocalizedDateTimeStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastStartup);
          if (prettyDate != "") {
            document.getElementById("stream_timer").title = prettyDate;
          }
          _global_js__WEBPACK_IMPORTED_MODULE_7__.streamOnline = true;
      }
      else {
          document.getElementById("stream_timer").innerText = _util_js__WEBPACK_IMPORTED_MODULE_5__.getGreatestUnitElapsedStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastOnline);
          let prettyDate = _util_js__WEBPACK_IMPORTED_MODULE_5__.getLocalizedDateTimeStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastOnline);
          if (prettyDate != "") {
            document.getElementById("stream_timer").title = prettyDate;
          }
          _global_js__WEBPACK_IMPORTED_MODULE_7__.streamOnline = false;
      }
      document.getElementById("stream_time_container").style.display = "flex";
      
      //stream timer setup         
      setInterval(function() {
        if (_global_js__WEBPACK_IMPORTED_MODULE_7__.streamOnline) {
          document.getElementById("stream_timer").innerText = _util_js__WEBPACK_IMPORTED_MODULE_5__.getTimeElapsedStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastStartup);
          let prettyDate = _util_js__WEBPACK_IMPORTED_MODULE_5__.getLocalizedDateTimeStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastStartup);
          if (prettyDate != "") {
            document.getElementById("stream_timer").title = prettyDate;
          }
        }
        else {
          document.getElementById("stream_timer").innerText = _util_js__WEBPACK_IMPORTED_MODULE_5__.getGreatestUnitElapsedStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastOnline);
          let prettyDate = _util_js__WEBPACK_IMPORTED_MODULE_5__.getLocalizedDateTimeStr(_global_js__WEBPACK_IMPORTED_MODULE_7__.lastOnline);
          if (prettyDate != "") {
            document.getElementById("stream_timer").title = prettyDate;
          }
        }
      }, 1000);
      
      let streamBar = document.getElementsByClassName("stream-video-info")[0];
      let streamTitle = document.getElementsByClassName("stream-video-info-title")[0];
      let streamControls = document.getElementById("stream_controls");
      let moreIcon = document.getElementById("more_icon");
      let moreMenu = document.getElementById("more_menu");
      let moreMenuActive = false;
      if (streamBar && streamTitle && streamControls && moreIcon && moreMenu) {
        moreIcon.addEventListener("click", function() {
          let hlsControls = document.getElementById("in_video_controls");
          moreMenuActive = !moreMenuActive;
          if (moreMenuActive) {
            streamBar.style.height = "100px";
            streamTitle.style.height = "50%";
            streamControls.style.height = "50%";
            moreMenu.style.display = "flex";
            if (hlsControls) {
              hlsControls.classList.add("more-menu-active");
            }
          }
          else {
            streamBar.style.height = "50px";
            streamTitle.style.height = "100%";
            streamControls.style.height = "100%";
            moreMenu.style.display = "none";
            if (hlsControls) {
              hlsControls.classList.remove("more-menu-active");
            }
          }
        });
        
        let dislikeButton = document.getElementById("dislike_button");
        if (dislikeButton) {
          if ("dislike_list" in API && API.dislike_list.includes(API.owner)) {
            dislikeButton.value = true;
            dislikeButton.className = "dislike-button";
          }
          
          if (dislikeButton.value === null) {
            dislikeButton.value = false;
          }
          dislikeButton.addEventListener("click", function() {
            console.log("dislikeUser clicked");
            _util_js__WEBPACK_IMPORTED_MODULE_5__.dislikeUser(!dislikeButton.value);
          });
        }

        let dislikeButtonContainer = document.getElementsByClassName("dislike-button-container")[0];
        if (dislikeButtonContainer) {
          dislikeButtonContainer.style.display = "flex";
        }
      }
      
      //prevent info jumble on small screens
      setTimeout(function() {
        if (streamControls) {
          streamControls.style.zIndex = 2;
        }
      }, 5000);

    }
    async function performClip(){
        console.log("performClip clicked");
        _util_js__WEBPACK_IMPORTED_MODULE_5__.performClip(robotID);
    }
    
    if(broadcastPage){
    //user indicated broadcast attempt    

        //do some ownership checking
        if(!_util_js__WEBPACK_IMPORTED_MODULE_5__.isUserLoggedIn()){
            console.error("User must be logged in to broadcast")
            alert("You must be logged in to broadcast");
            _util_js__WEBPACK_IMPORTED_MODULE_5__.redirectNonBroadcaster();
        }else if /*(videoType !== "webrtc")*/ (false) {}else if(_util_js__WEBPACK_IMPORTED_MODULE_5__.getUserID() !== robot_owner_id){
            console.error("You can only broadcast into rooms that you own")
            console.log("util.getUserID() :", _util_js__WEBPACK_IMPORTED_MODULE_5__.getUserID())
            console.log("robot_owner_id :", robot_owner_id)
            alert("You can only broadcast into rooms that you own");
            _util_js__WEBPACK_IMPORTED_MODULE_5__.redirectNonBroadcaster();
        }else{
            console.log("Broadcast mode start")
            //broadcast allowed

            //destroy jsmpeg canvas
            try{document.getElementById('video_canvas').remove();}
            catch(err) {console.error(err);}

            //show webrtc canvas
            try{document.getElementById('video_rtc').style.display = "block";}
            catch(err) {console.error(err);}

            //kill bottom links
            try{document.getElementById('bottom_links').remove();}
            catch(err) {console.error(err);}

            //kill stuff in mobile
            try{
                document.getElementById('bottom-links-mobile').remove();
                document.getElementById('stream-funbits-buttons-mobile').remove();
                document.getElementById('stream-controls-mobile').remove();

            }
            catch(err) {console.error(err);}

            //indicate no volume
            let volSlider = document.getElementById('volume-slider');
            if (volSlider) {
              volSlider.value = 0;
            }

            // video element
            let localRTCVideo = document.getElementById('video_rtc');
            // join as a broadcaster
            _lib_webrtc_webrtc__WEBPACK_IMPORTED_MODULE_8__.broadcastWebrtcRoom(localRTCVideo, robotID);
            
            //setup clip button
            let clipButton = document.getElementById('vid_clip');
            if (clipButton) {
              clipButton.addEventListener("click", performClip);
              clipButton.style.display = "block";
            }

        }

    }else{
        //viewer page
        if (!embedPage) {
          //create control buttons to controlDiv only viewer
          _buttons_js__WEBPACK_IMPORTED_MODULE_0__.makeButtons(document.getElementById("control-buttons-desktop"),
                              document.getElementById("control-buttons-mobile"), robotID, true);
        }


        //videotype option as viewer
        if(videoType == "webrtc"){

            //destroy jsmpeg canvas
            try{document.getElementById('video_canvas').remove();}
            catch(err) {console.error(err);}
            
            //destroy hls video
            try{document.getElementById('video_hls').remove();}
            catch(err) {console.error(err);}

            //show webrtc canvas
            try{document.getElementById('video_rtc').style.display = "inline";}
            catch(err) {console.error(err);}

            let localRTCVideo = document.getElementById('video_rtc');
            _lib_webrtc_webrtc__WEBPACK_IMPORTED_MODULE_8__.joinWebrtcRoom(localRTCVideo, robotID);
            
            //setup clip button
            let clipButton = document.getElementById('vid_clip');
            if (clipButton) {
              clipButton.addEventListener("click", performClip);
              clipButton.style.display = "block";
            }

            if (!embedPage) {
              let videoScreen = document.getElementById("video_container");
              _chat_js__WEBPACK_IMPORTED_MODULE_3__.setupFullscreenChat(videoScreen);
            }
        }
        else if (videoType == "rtmp") {
          //destroy jsmpeg canvas
          try{document.getElementById('video_canvas').remove();}
          catch(err) {console.error(err);}
          
          //destroy webrtc video container
          try{document.getElementById('video_rtc').remove();}
          catch(err) {console.error(err);}
          
          //show hls video
          try{document.getElementById('video_hls').style.display = "inline";}
          catch(err) {console.error(err);}
          
          if (!embedPage) {
            //destroy clip button
            try{document.getElementById('vid_clip').parentElement.remove();}
            catch(err) {console.error(err);}
          }
          
          let hlsOptions = {};
          
          let hlsPlayer = (0,video_js__WEBPACK_IMPORTED_MODULE_10__["default"])('video_hls', hlsOptions, function onPlayerReady() {
            this.on('error', function(e) {
              //console.log("ERR: ", e);
              setTimeout(function(){
                hlsPlayer.src({
                  src: 'https://' + API.hls.host + ':' + API.hls.port + '/tv/' + robotID + getStreamVariant() + '.m3u8',
                  type: 'application/x-mpegURL'
                });
                let playPromise = hlsPlayer.play();
                checkHLSAutoplay(hlsPlayer, playPromise);
              }, 10000);
            });
            
            let endStreamTimer = false;
            this.tech_.on('retryplaylist', function() {
              if (!endStreamTimer && lastHlsStartup + 15000 <= Date.now()) {
                console.log("HLS stream ended.");
                endStreamTimer = true;
                setTimeout(function() {
                  endStreamTimer = false;
                  console.log("Resetting HLS player.")
                  hlsPlayer.src({
                    src: 'https://' + API.hls.host + ':' + API.hls.port + '/tv/' + robotID + getStreamVariant() + '.m3u8',
                    type: 'application/x-mpegURL'
                  });
                  let playPromise = hlsPlayer.play();
                  checkHLSAutoplay(hlsPlayer, playPromise);
                }, 30000);
              }
            });

            let playPromise = this.play();
            checkHLSAutoplay(hlsPlayer, playPromise);
            
            let hlsContainer = document.getElementById("video_hls");
            if (hlsContainer && !embedPage) {
              hlsContainer.addEventListener('fullscreenchange', function() {
                let vid = document.getElementById("video_hls_html5_api");
                let vidControl = document.getElementById("in_video_controls");
                let innerControls = document.getElementById("info_controls_volume_inner");
                if (hlsPlayer.isFullscreen()) {
                  vid.style.maxHeight = "100%";
                  vid.style.height = "100%";
                  if (vidControl) {
                    vidControl.style.bottom = "0px";
                  }
                  if (innerControls) {
                    innerControls.style.display = "flex";
                  }
                }
                else {
                  vid.style.maxHeight = "calc(100vh - 200px)";
                  vid.style.height = "";
                  if (vidControl) {
                    vidControl.style.bottom = "";
                    if (!(rtmpTranscoding || embedPage)) {
                      vidControl.style.opacity = 0;
                    }
                  }
                  if (innerControls) {
                    innerControls.style.display = "";
                  }
                }
              });
            }
            
            if (!embedPage) {
              let videoScreen = document.getElementById("video_hls");
              _chat_js__WEBPACK_IMPORTED_MODULE_3__.setupFullscreenChat(videoScreen);
            }
            
            hlsPlayer.doReconnect = function(host, port) {
              API.hls.host = host;
              API.hls.port = port;
              if (!hlsPlayer.paused() && !endStreamTimer) {
                hlsPlayer.src({
                  src: 'https://' + API.hls.host + ':' + API.hls.port + '/tv/' + robotID + getStreamVariant() + '.m3u8',
                  type: 'application/x-mpegURL'
                });
                let playPromise = hlsPlayer.play();
                checkHLSAutoplay(hlsPlayer, playPromise);
              }
            }
          });
          
          hlsPlayer.src({
            src: 'https://' + API.hls.host + ':' + API.hls.port + '/tv/' + robotID + getStreamVariant() + '.m3u8',
            type: 'application/x-mpegURL'
          });
          
          let fullscreenButton = document.getElementById('vid_fullscreen_re');
          if (fullscreenButton) {
            fullscreenButton.addEventListener('click', function() {
              console.log('HLSFullscreen'); 
              hlsPlayer.requestFullscreen();
            });
          }
          
          //setup and define fullscreen video player controls
          let hlsContainer = document.getElementById("video_hls");
          let vidControl = document.createElement('div');
          vidControl.innerHTML = hlsVideoControls;
          vidControl.className = "video_controls";
          vidControl.id = "in_video_controls";
          hlsContainer.appendChild(vidControl);   //put in video container

          if (!(rtmpTranscoding || embedPage || hlsPlayer.isFullscreen())) {
            vidControl.style.opacity = 0;
          }

          //hover over to reveal controls
          let lastReveal = new Date().valueOf();
          let fadeTimer = setInterval(function() {
            if (lastReveal && lastReveal + 3000 < new Date().valueOf()) {
              vidControl.style.opacity = 0;
              lastReveal = null;
            }
          }, 1000);
          let vidControlHover = function(e) {
              if (typeof e === "object" && typeof e.type !== "undefined" && vidControl && hlsPlayer) {
                if (rtmpTranscoding || embedPage || hlsPlayer.isFullscreen()) {
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
          
          if (!rtmpTranscoding) {
            let vidControlsArea = document.getElementById("info_controls_video_inner");
            if (vidControlsArea) {
              vidControlsArea.style.display = "none";
            }
          }
          
          if (embedPage) {
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
          
          let vidOptionsPane = document.getElementById("video_options_pane");
          let videoCog = document.getElementById("video_cog");
          let qualityOptions = document.getElementById("quality_options");
          if (vidOptionsPane && videoCog && qualityOptions) {
            videoCog.addEventListener("click", function() {
              if (vidOptionsPane.style.display == "block") {
                vidOptionsPane.style.display = "none";
              }
              else {
                vidOptionsPane.style.display = "block";
              }
            });
            qualityOptions.value = localStorage.getItem("hls_variant") || "";
            qualityOptions.addEventListener("change", function() {
              localStorage.setItem("hls_variant", this.value);
              hlsPlayer.doReconnect(API.hls.host, API.hls.port);
            });
            if (robot_owner_id == "57230") {
              let sourceOption = qualityOptions.options[0];
              if (sourceOption) {
                sourceOption.innerHTML = "1080p&nbsp;";
              }
            }
          }
          
          let hlsVolumeFunction = function(vol) {
            if (vol !== undefined) {
              hlsPlayer.volume(vol);
            }
            return hlsPlayer.volume();
          }
          
          let volSliders = document.getElementsByClassName('rs-volume-slider');
          for (let i = 0; i < volSliders.length; i++) {
            let volSlider = volSliders[i];
            
            //load volume if saved
            _util_js__WEBPACK_IMPORTED_MODULE_5__.setupVolume(volSlider, hlsVolumeFunction);
            
            //Listen to volume slider
            volSlider.addEventListener('input', function() {
              _util_js__WEBPACK_IMPORTED_MODULE_5__.volumeChangeListener(volSlider, hlsVolumeFunction);
            });
          }
          
          _util_js__WEBPACK_IMPORTED_MODULE_5__.setupMuteButtons(hlsVolumeFunction);
        }
        else{//jsmpeg

            //destroy webrtc video container
            try{document.getElementById('video_rtc').remove();}
            catch(err) {console.error(err);}
            
            //destroy hls video
            try{document.getElementById('video_hls').remove();}
            catch(err) {console.error(err);}
            
            if (!embedPage) {
              //destroy clip button
              try{document.getElementById('vid_clip').parentElement.remove();}
              catch(err) {console.error(err);}
            }

            //define jsmpeg video div
            var vidContainer = document.getElementById("video_container");
            var canvas = document.getElementById("video_canvas");
            
            if (!embedPage) {
              //setup and define fullscreen video player controls
              var vidControl = document.createElement('div');
              vidControl.innerHTML = videoControls
              vidControl.style.display = "none"; //default off
              vidControl.className = "video_controls";
              vidContainer.appendChild(vidControl);   //put in video container

              //hover over to reveal controls
              var vidControlHover = function(e) {
                  if (typeof e === "object" && typeof e.type !== "undefined" && vidControl) {
                      if (e.type === "mouseover") {
                          vidControl.style.opacity = 1;
                      } else if (e.type === "mouseout" && vidControl.className.indexOf("hidden") === -1) {
                          vidControl.style.opacity = 0;
                      }
                  }
              };

              //on-screen hover listeners
              vidControl.addEventListener("mouseover", vidControlHover);
              vidControl.addEventListener("mouseout", vidControlHover);
              canvas.addEventListener("mouseover", vidControlHover);
              canvas.addEventListener("mouseout", vidControlHover);

              //create control buttons to controlDiv
              //buttons.makeButtons(document.getElementById("control_buttons"),
              //                    document.getElementById("control_buttons_fullscreen"), robotID, useKeys);
            }

            // dont init when offline
            if (robot_status === "online"){
                // initialize audio
                _audio_js__WEBPACK_IMPORTED_MODULE_1__.initAudio(canvas, robot_camera_id, vidControl);

                // initialize video
                _video_js__WEBPACK_IMPORTED_MODULE_2__.initVideo(canvas, robot_camera_id, vidControl);

                //init picture in picture
                if(_global_js__WEBPACK_IMPORTED_MODULE_7__.pageLoadAPI.pip && !embedPage){
                    //only if pip != null and not embedded
                    await makePIP(robotID, vidContainer, canvas, true);        
                }
            }
            if (!embedPage) {
              _chat_js__WEBPACK_IMPORTED_MODULE_3__.setupFullscreenChat(vidContainer);
            }
        }

    }
    
    if (!embedPage) {
      _follow_js__WEBPACK_IMPORTED_MODULE_4__.followInit();
      //follow button junk 
      
      let subButton = document.getElementById("subscribe_button");
      let subDialog = document.getElementById("subscribe_dialog");
      if (subButton && subDialog) {
        if (_util_js__WEBPACK_IMPORTED_MODULE_5__.isSubscribed(API.owner, API["subscribe_list"])) {
          subDialog.innerHTML = "You are<br>currently<br>subscribed!<br><a href='/settings.html#subscriptions' target='_blank'><div id='subscribe_action_button'>Modify</div></a>";
          subButton.innerText = "Subscribed";
          subButton.className = "subscribe-button";
        }
        else if (API.owner == window.localStorage.getItem("robotstreamer_user_id")) {
          subDialog.innerHTML = "You are<br>ready for<br>subscriptions!<br><a href='/subscribe/" + user_name + "' target='_blank'><div id='subscribe_action_button'>View</div></a>";
          subButton.innerText = "Subscribed";
          subButton.className = "subscribe-button";
        }
        else {
          subDialog.innerHTML = "Subscribe for<br>1 month for<br>$4.99<br><a href='/subscribe/" + user_name + "' target='_blank'><div id='subscribe_action_button'>Go</div></a>";
          subButton.innerText = "Subscribe";
          subButton.className = "subscribe-button-disable";
        }
        
        subButton.addEventListener("click", function() {
          let subPanel = document.getElementById("subscribe_dialog");
          if (subPanel) {
            subPanel.classList.toggle("menu-toggle-off");
          }
        });
        
        if (user_name == "") {
          //hide sub button if name is unknown
          subButton.style.display = "none";
        }
      }
    }
    
    function getStreamVariant() {
      if (rtmpTranscoding) {
        let variant = localStorage.getItem("hls_variant");
        if (variant && variant != "") {
          return "_" + variant;
        }
      }
      return "";
    }
}



async function makeRobotPanelVideoOnly(robotID, useKeys) {

    console.log("Start makeRobotPanelVideoOnly for: ",robotID);

    //define video div
    var vidContainer = document.getElementById("video_container");
    var canvas = document.getElementById("video_canvas");

    //robot_id to camera_id
    let cameraIDResult = await (0,_util_js__WEBPACK_IMPORTED_MODULE_5__.axiosGET)(_config_js__WEBPACK_IMPORTED_MODULE_6__.api_host + '/v1/get_camera_id/' + robotID);
    let cameraID = cameraIDResult.data.camera_id;

    //nope
    var vidControl = document.createElement('div');

    // initialize audio
    _audio_js__WEBPACK_IMPORTED_MODULE_1__.initAudio(canvas, cameraID, vidControl);

    // initialize video
    _video_js__WEBPACK_IMPORTED_MODULE_2__.initVideo(canvas, cameraID, vidControl);

}

let playButtonEnabled = false;
function checkHLSAutoplay(hlsPlayer, playPromise) {
  if (playPromise !== undefined) {
    const playButton = document.getElementById('video-play-button');
    lastHlsStartup = Date.now();
    playPromise.then(function() {
      lastHlsStartup = Date.now();
      playButton.style.display = "none";
      console.log("Autoplaying stream.")
    }).catch(function(error) {
      function clickPlay(){       
          lastHlsStartup = Date.now();
          hlsPlayer.play();
          playButton.style.display = "none";
      }
      if (!playButtonEnabled) {
        playButton.addEventListener("click", clickPlay);
        playButtonEnabled = true;
        playButton.style.display = "block";
      }
    });
  }
}

function updateDescription(newDescription) {
  let descArea = document.getElementsByClassName("robot-description")[0];
  if (descArea != null && descArea.currentContents != newDescription) {
      descArea.innerHTML = newDescription;
      descArea.currentContents = newDescription;
      //make all links open new tab
      setTimeout(function() {
        let anchors = descArea.getElementsByTagName("a");
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].setAttribute("target", "_blank");
        }
      }, 500);
  }
}


//# sourceURL=webpack://rswebclient/./src/robot_panel.js?