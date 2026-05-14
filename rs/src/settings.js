__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   rsSettings: () => (/* binding */ rsSettings)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _login_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login.js */ "./src/login.js");
/* harmony import */ var _buttons_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./buttons.js */ "./src/buttons.js");









async function rsSettings(loggedIn, isBroadcaster) {

    //user must be logged in to progress
    if(loggedIn == false ){
        //user doesnt belong here
        console.log("not logged in - retuning to index");
        window.location.replace("index.html");
        return;
    }

    var userName = window.localStorage.getItem("robotstreamer_username")
    var userToken = window.localStorage.getItem("robotstreamer_token")
    let userIdToUserName = {};

    let streamerTagsModified = false;
    let viewerTagsModified = false;

    document.title = document.title.replaceAll(/username$/g, userName);
    document.getElementById("banner_profile_name").innerHTML = userName


    let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
    var url = urlPrefix + '/v1/get_user_settings';
    var data = {user_name: userName, token: userToken}
    var result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);

    
    let urlParts = window.location.href.split("#");
    let validPages = ["profile", "broadcaster", "myrobots", "subscriptions"];
    if (urlParts.length > 1 && validPages.includes(urlParts[1])) {
      rsSettingsChangePage(urlParts[1]);
    }
    else {
      rsSettingsChangePage("profile"); //default landing
    }


    if (result){
        // dont log this in production...
        if (_config_js__WEBPACK_IMPORTED_MODULE_1__.domain != 'robotstreamer.com') {
        }
        console.log(result.data);

        //catagory listeners
        document.getElementById('button_profile').addEventListener
            ("click", function(){ rsSettingsChangePage("profile"); }, true);
        document.getElementById('button_broadcaster').addEventListener
            ("click", function(){ rsSettingsChangePage("broadcaster"); }, true);
        document.getElementById('button_myrobots').addEventListener
            ("click", function(){ rsSettingsChangePage("myrobots"); }, true);
            document.getElementById('button_subscriptions').addEventListener
                ("click", function(){ rsSettingsChangePage("subscriptions"); }, true);

        //save button listener
        document.getElementById('save_settings').addEventListener
            ("click", function(){ rsSettingsSave(); }, true);

        //var isBroadcaster = result.data.broadcaster

        //set values
        //profile
        document.getElementById('user_name').value  = result.data.user_name
        document.getElementById('email').value      = result.data.email
        document.getElementById('avatar').value      = result.data.avatar
        //set visual of avatar
        if (result.data.avatar && result.data.avatar != "") {
          document.getElementById('settings_profile_picture').onerror = function(){this.onerror=null;this.src='/images/noimage.png';}
          document.getElementById('settings_profile_picture').src = result.data.avatar
        }

        if (result.data.spendable_funbits != null){
            document.getElementById('funbits').value= result.data.spendable_funbits
        }
        if (result.data.nonspendable_funbits != null){
            document.getElementById('earnings').innerHTML= "$" + Math.round(result.data.nonspendable_funbits)/100.0;
        }


        if (result.data.email_verified){
            //document.getElementById('email').disabled = true; 
            document.getElementById('email_information').innerHTML= "This email address is verified";
            
        }else{
            document.getElementById('email').disabled = false; 
            document.getElementById('email_information').innerHTML= "This email address is not verified";
            document.getElementById('request_email_validation').style.display= "block";
        }

        if (result.data.viewer_tags_enabled !== undefined && result.data.viewer_tags_enabled !== null) {
          document.getElementById("viewer_tags_enabled").checked = result.data.viewer_tags_enabled;
        }

        if (result.data.chat_limit){
            document.getElementById('chat_limit').value = result.data.chat_limit;
        }


        document.getElementById('filterTypeChat').value =  result.data.chat_filter_type


        document.getElementById('over18').checked   = result.data.over18

        //broadcaster
        document.getElementById('enable_filter').checked   = result.data.chat_filter_enabled
        document.getElementById('stream_key').value        = result.data.stream_key
        document.getElementById('nsfw_broadcaster').checked  = result.data.nsfw_broadcaster
        document.getElementById('enable_chat_throttle').checked   = result.data.chat_ip_throttling
        if ('vpn_filter' in result.data) {
          document.getElementById('vpn_filter').checked = result.data.vpn_filter;
          document.getElementById('vpn_filter').ApiEnabled = true;
          document.getElementById('vpn_filter').parentElement.parentElement.parentElement.parentElement.removeAttribute('style');
        }
        document.getElementById('recording_streams').checked   = result.data.record_streams
        document.getElementById('clipping_streams').checked   = result.data.clip_streams
        document.getElementById('subscription_icon').value        = result.data.subscription_icon

        if (result.data.chat_filter_words){
            document.getElementById('filter_text').value       = result.data.chat_filter_words.join("\r\n")
        }

        //show pp email inputs if enabled, config from api, all calls associated are blocked
        if (result.data.payout_email_enabled){
            console.log("payout_email_enabled")
            document.getElementById('email_paypal_enable').style.display = "flex"
        }


        document.getElementById('email_paypal').value   = result.data.email_paypal
        if (result.data.requested_payout){
          //need to make this nicer
          document.getElementById('earnings').innerHTML = 
          document.getElementById('earnings').innerHTML +  ' - requested payout';
        }
        
        //checkbox text and slider updates
        rsSettingsupdateFilter();
        rsSettingsupdateThrottle();
        rsSettingsupdateVpnFilter();
        rsSettingsupdateOver18();
        rsSettingsupdateNsfwBroadcaster();
        rsSettingsupdateAutoRecording();
        rsSettingsupdateClipping();

        document.getElementById("enable_filter").addEventListener("click", rsSettingsupdateFilter )
            function rsSettingsupdateFilter(){
                //console.log("updatingui")
                if(document.getElementById("enable_filter").checked){document.getElementById("enable_filter_text").innerHTML = "FILTER ENABLED"}
                else{document.getElementById("enable_filter_text").innerHTML = "FILTER DISABLED"}

            }
            
        document.getElementById("enable_chat_throttle").addEventListener("click", rsSettingsupdateThrottle )
            function rsSettingsupdateThrottle(){
                //console.log("updatingui")
                if(document.getElementById("enable_chat_throttle").checked){document.getElementById("enable_chat_throttle_text").innerHTML = "CHAT THROTTLING ENABLED"}
                else{document.getElementById("enable_chat_throttle_text").innerHTML = "CHAT THROTTLING DISABLED"}

            }
            
        document.getElementById("vpn_filter").addEventListener("click", rsSettingsupdateVpnFilter);
        function rsSettingsupdateVpnFilter() {
            if (document.getElementById("vpn_filter").checked) {
              document.getElementById("vpn_filter_text").innerHTML = "VPN Filter Enabled";
            }
            else {
              document.getElementById("vpn_filter_text").innerHTML = "VPN Filter Disabled";
            }
        }
        
        //default hidden
        document.getElementById("recording_streams").addEventListener("click", rsSettingsupdateAutoRecording )
            function rsSettingsupdateAutoRecording(){
                //console.log("updatingui")
                if(document.getElementById("recording_streams").checked){document.getElementById("recording_streams_text").innerHTML = "AUTOMATICALLY RECORDING RTC AND RTMP"}
                else{document.getElementById("recording_streams_text").innerHTML = "NOT AUTOMATICALLY RECORDING RTC AND RTMP"}

            }
        //show if feature enabled
        if (typeof _config_js__WEBPACK_IMPORTED_MODULE_1__.b2Prefix !== 'undefined'){
            document.getElementById("recording_streams_main").style.display = "flex";
        }
        
        //clipping - default hidden
        document.getElementById("clipping_streams").addEventListener("click", rsSettingsupdateClipping )
            function rsSettingsupdateClipping(){
                //console.log("updatingui")
                if(document.getElementById("clipping_streams").checked){document.getElementById("clipping_streams_text").innerHTML = "CLIPPING ALLOWED"}
                else{document.getElementById("clipping_streams_text").innerHTML = "CLIPPING NOT ALLOWED"}

            }
        //clipping - show if feature enabled
        if (typeof _config_js__WEBPACK_IMPORTED_MODULE_1__.b2Prefix !== 'undefined'){
            document.getElementById("clipping_streams_main").style.display = "flex";
        }

        document.getElementById("over18").addEventListener("click", rsSettingsupdateOver18)
            function rsSettingsupdateOver18(){
                //console.log("updatingui over18")
                if(document.getElementById("over18").checked){document.getElementById("over18_text").innerHTML = "Mature content enabled"}
                else{document.getElementById("over18_text").innerHTML = "Mature content disabled"}

            }

        document.getElementById("nsfw_broadcaster").addEventListener("click", rsSettingsupdateNsfwBroadcaster)
            function rsSettingsupdateNsfwBroadcaster(){
                //console.log("updatingui nsfw_broadcaster")
                if(document.getElementById("nsfw_broadcaster").checked){document.getElementById("nsfw_broadcaster_text").innerHTML = "My broadcasts are for mature audiences only"}
                else{document.getElementById("nsfw_broadcaster_text").innerHTML = "My broadcasts are for all ages"}

            }


        document.getElementById("request_payout").addEventListener("click", rsRequestPayout)
            async function rsRequestPayout(){
                console.log("rsRequestPayout")

                var payoutMessageDiv = document.getElementById("request_payout");
                var payoutPaypalEmail = document.getElementById("email_paypal").value;

                let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
                var url = urlPrefix + '/v1/request_payout';
                var data = {token: userToken,
                            email_paypal: payoutPaypalEmail}

                var requestPayoutResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);
                console.log(requestPayoutResult)
                
                payoutMessageDiv.innerHTML = "Request set"
                document.getElementById("email_paypal_information").innerHTML = requestPayoutResult.data.status
            }



        document.getElementById("request_email_validation").addEventListener("click", rsRequestEmailValidation)
            async function rsRequestEmailValidation(){
                console.log("rsRequestEmailValidation() is fueled by spite")

                var emailMessageDiv = document.getElementById("email_information");
                var requestEmail = document.getElementById("email").value;

                let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
                var url = urlPrefix + '/v1/request_email_validation';
                var data = {token: userToken,
                            email: requestEmail}

                var requestResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);
                console.log(requestResult)

                //set information wank message
                emailMessageDiv.innerHTML = requestResult.data.status
                //set button message
                if(requestResult.data.button_text){
                  document.getElementById("request_email_validation").innerHTML = requestResult.data.button_text
                }

            }
            
        
        let maxTags = 100;
        let possibleTags = ["politics", "nudity", "gaming"];
        let streamerTagsInnerHtml = "";
        let viewerTagsInnerHtml = "";
        for (let i = 0; i < possibleTags.length; i++) {
          streamerTagsInnerHtml += '\
          <div class="settings-bot-row">\
            <div class="settings-row-title">' + possibleTags[i] + '</div>\
            <div class="settings-row-content">\
              <div class="settings-row-display slider-label-container">\
                <span class="slider-label">Neutral</span>\
                <span class="tag-delete-button-spacer"></span>\
              </div>\
              <div class="settings-row-display tag-slider-container">\
                <input type="range" min="-1" max="1" step="1"' + (possibleTags[i] == 'nudity' && !(result.data.streamer_tags && result.data.streamer_tags.length > 0) ? ' value="-1"' : '') + ' class="streamer-tag-slider" streamertag="' + possibleTags[i] + '">\
                <span class="tag-delete-button-spacer"></span>\
              </div>\
            </div>\
          </div>\
          ';

          viewerTagsInnerHtml += '\
          <div class="settings-bot-row">\
            <div class="settings-row-title">' + possibleTags[i] + '</div>\
            <div class="settings-row-content">\
              <div class="settings-row-display slider-label-container">\
                <span class="slider-label">Neutral</span>\
                <span class="tag-delete-button-spacer"></span>\
              </div>\
              <div class="settings-row-display tag-slider-container">\
                <input type="range" min="-1" max="1" step="1" class="viewer-tag-slider" viewertag="' + possibleTags[i] + '">\
                <span class="tag-delete-button-spacer"></span>\
              </div>\
            </div>\
          </div>\
          ';
        }
        streamerTagsInnerHtml += '<div class="settings-bot-row settings-bot-row-footer"><div class="settings-row-display"><span id="streamer_tag_add"><img title="Add New Streamer Tag" alt="Add New Streamer Tag" src="/images/icon-addrobot.svg"></span></div></div>';
        streamerTagsInnerHtml += '<div class="settings-bot-row settings-bot-row-footer"><div class="settings-row-display" style="padding: 0px 50px; display: flex;"><img src="/images/iconquestionmark.svg" style="width: 20px; height: 20px; margin-right: 7px; user-select: none;" alt="Streamer Tags Info" title="Streamer Tags Info"><span>This system helps define recommended streams for viewers. A viewer\'s interest tag preferences will be compared to your stream tags to determine recommended streams for that viewer. For viewers with no preferences set yet, your negative stream tags will affect their recommended stream list while they view your page. Note that only your positive stream tags will show publicly with your stream title.</span></div></div>';
        viewerTagsInnerHtml += '<div class="settings-bot-row settings-bot-row-footer"><div class="settings-row-display"><span id="viewer_tag_add"><img title="Add New Tag" alt="Add New Tag" src="/images/icon-addrobot.svg"></span></div></div>';
        document.getElementById("streamer_tags_group").innerHTML = streamerTagsInnerHtml;
        document.getElementById("viewer_tags_group").innerHTML += viewerTagsInnerHtml;

        let customStreamerTags = [];
        if (result.data.streamer_tags && result.data.streamer_tags.length > 0) {
          streamerTagsModified = true;
          let streamerTagSliders = document.getElementsByClassName("streamer-tag-slider");
          for (let i = 0; i < result.data.streamer_tags.length; i++) {
            if (possibleTags.includes(result.data.streamer_tags[i]['name'])) {
              for (let j = 0; j < streamerTagSliders.length; j++) {
                if (streamerTagSliders[j].getAttribute("streamertag") == result.data.streamer_tags[i]['name']) {
                  streamerTagSliders[j].value = result.data.streamer_tags[i]['value']
                  break;
                }
              }
            }
            else {
              customStreamerTags.push(result.data.streamer_tags[i]);
            }
          }
        }

        let customViewerTags = [];
        if (result.data.viewer_tags && result.data.viewer_tags.length > 0) {
          viewerTagsModified = true;
          let viewerTagSliders = document.getElementsByClassName("viewer-tag-slider");
          for (let i = 0; i < result.data.viewer_tags.length; i++) {
            if (possibleTags.includes(result.data.viewer_tags[i]['name'])) {
              for (let j = 0; j < viewerTagSliders.length; j++) {
                if (viewerTagSliders[j].getAttribute("viewertag") == result.data.viewer_tags[i]['name']) {
                  viewerTagSliders[j].value = result.data.viewer_tags[i]['value']
                  break;
                }
              }
            }
            else {
              customViewerTags.push(result.data.viewer_tags[i]);
            }
          }
        }
        else {
          let viewerTagsDisclaimer = document.getElementById("viewer_tags_disclaimer");
          if (viewerTagsDisclaimer) {
            viewerTagsDisclaimer.style.display = "block";
          }
        }

        function setupTagSliders() {
          let tagTypes = ["streamer-tag-slider", "viewer-tag-slider"];
          for (let j = 0; j < tagTypes.length; j++) {
            let tagSliders = document.getElementsByClassName(tagTypes[j]);
            for (let i = 0; i < tagSliders.length; i++) {
              let currentSlider = tagSliders[i];
              if (currentSlider.tagSliderSetupDone == true) {
                continue;
              }
              currentSlider.tagSliderSetupDone = true;
              currentSlider.addEventListener("input", function() {
                let sliderColor = "#49A8FF";
                let labelValues = {};
                labelValues["streamer-tag-slider"] = {"-1": "Anti", "0": "Neutral", "1": "Pro"};
                labelValues["viewer-tag-slider"] = {"-1": "Dislike", "0": "Neutral", "1": "Like"};
                if (this.value == "1") {
                  sliderColor = "#1DD1A1";
                }
                else if (this.value == "-1") {
                  sliderColor = "#FC5C65";
                }
                this.style.backgroundColor = sliderColor;
                let sliderLabel = this.parentElement.parentElement.getElementsByClassName("slider-label")[0];
                let labelText = "";
                for (let k = 0; k < tagTypes.length; k++) {
                  if (this.classList.contains(tagTypes[k])) {
                    labelText = labelValues[tagTypes[k]][this.value];
                    break;
                  }
                }
                sliderLabel.innerText = labelText;
                sliderLabel.style.color = sliderColor;
              });
              let inputEvent = new Event("input");
              currentSlider.dispatchEvent(inputEvent);
              currentSlider.addEventListener("input", function() {
                if (this.classList.contains("streamer-tag-slider")) {
                  streamerTagsModified = true;
                }
                else if (this.classList.contains("viewer-tag-slider")) {
                  viewerTagsModified = true;
                  startViewerTagsDisclaimerExpiration();
                }
              });
            }
          }

          let tagDeleteButtons = document.getElementsByClassName("tag-delete-button");
          for (let i = 0; i < tagDeleteButtons.length; i++) {
            if (tagDeleteButtons[i].setupDone === true) {
              continue;
            }
            tagDeleteButtons[i].setupDone = true;
            tagDeleteButtons[i].addEventListener("click", function() {
              if (this.parentElement.parentElement.parentElement.parentElement.id == "viewer_tags_group") {
                if (document.getElementById("viewer_tags_enabled").disabled) {
                  return;
                }
                document.getElementById("viewer_tags_group").style.height = "";
              }
              let tagField = this.parentElement.parentElement.parentElement;
              if (tagField && tagField.classList.contains("settings-bot-row")) {
                tagField.remove();
              }
            });
          }
        }
        setupTagSliders();

        function addTagField(addTagButton, tagName, tagValue) {
          let classnamePrefix;
          let insertBeforeElement;
          let existingCustomFields = 0;
          if (addTagButton.id == "streamer_tag_add") {
            classnamePrefix = "streamer-tag";
            insertBeforeElement = document.getElementById("streamer_tag_add").parentElement.parentElement;
            existingCustomFields = document.getElementsByClassName("streamer-tag-custom-key");
          }
          else if (addTagButton.id == "viewer_tag_add") {
            classnamePrefix = "viewer-tag";
            insertBeforeElement = document.getElementById("viewer_tag_add").parentElement.parentElement;
            existingCustomFields = document.getElementsByClassName("viewer-tag-custom-key");
          }
          if (existingCustomFields.length + possibleTags.length >= maxTags) {
            return;
          }
          if (classnamePrefix && insertBeforeElement) {
            let newTagFieldHtml = '\
            <div class="settings-bot-row">\
              <div class="settings-row-title"><input type="text" placeholder="Tag Name" maxlength="25" class="' + classnamePrefix + '-custom-key"></div>\
              <div class="settings-row-content">\
                <div class="settings-row-display slider-label-container">\
                  <span class="slider-label">Neutral</span>\
                  <span class="tag-delete-button-spacer"></span>\
                </div>\
                <div class="settings-row-display tag-slider-container">\
                  <input type="range" min="-1" max="1" step="1" placeholder="Tag Name" class="' + classnamePrefix + '-slider ' + classnamePrefix + '-custom-value">\
                  <img class="tag-delete-button" src="/images/icon-delete.svg">\
                </div>\
              </div>\
            </div>\
            ';
            insertBeforeElement.insertAdjacentHTML("beforebegin", newTagFieldHtml);
            if (tagName !== undefined && tagValue !== undefined) {
              let newField = insertBeforeElement.previousElementSibling;
              try {
                let tagNameInput = newField.getElementsByClassName(classnamePrefix + "-custom-key")[0];
                tagNameInput.value = tagName;
                newField.getElementsByClassName(classnamePrefix + "-custom-value")[0].value = tagValue;
                function tagNameInputCheck(e) {
                  let inputText = "";
                  if (e.type == "keypress") {
                    inputText = e.key;
                  }
                  else if (e.type == "paste") {
                    inputText = e.clipboardData.getData("text");
                  }
                  let disallowedPattern = new RegExp("[^a-zA-z0-9]");
                  if (disallowedPattern.test(inputText)) {
                    e.preventDefault();
                  }
                }
                tagNameInput.addEventListener("keypress", tagNameInputCheck);
                tagNameInput.addEventListener("paste", tagNameInputCheck);
              }
              catch (err) {
                console.error(err);
              }
            }
            setupTagSliders();
          }
        }
        let streamerTagAdd = document.getElementById("streamer_tag_add");
        let viewerTagAdd = document.getElementById("viewer_tag_add");
        for (let i = 0; i < customStreamerTags.length; i++) {
          addTagField(streamerTagAdd, customStreamerTags[i]['name'], customStreamerTags[i]['value']);
        }
        for (let i = 0; i < customViewerTags.length; i++) {
          addTagField(viewerTagAdd, customViewerTags[i]['name'], customViewerTags[i]['value']);
        }

        if (streamerTagAdd) {
          streamerTagAdd.addEventListener("click", function() {
            addTagField(this);
            streamerTagsModified = true;
          });
        }
        if (viewerTagAdd) {
          viewerTagAdd.addEventListener("click", function() {
            if (document.getElementById("viewer_tags_enabled").disabled) {
              return;
            }
            document.getElementById("viewer_tags_group").style.height = "";
            addTagField(this);
            viewerTagsModified = true;
            startViewerTagsDisclaimerExpiration();
          });
        }
        

        let viewerTagsEnabled = document.getElementById("viewer_tags_enabled");
        viewerTagsEnabled.addEventListener("change", function() {
          let firstChangeOccuredPreTimer = this.FirstChangeOccured;
          if (this.FirstChangeOccured) {
            let tagFields = document.getElementById("viewer_tags_group").getElementsByClassName("settings-bot-row");
            let tagBoxHeight = 0;
            for (let i = 0; i < tagFields.length; i++) {
              tagBoxHeight += tagFields[i].offsetHeight;
            }
            document.getElementById("viewer_tags_group").style.height = tagBoxHeight + "px";
          }
          this.disabled = true;
          
          if (this.checked) {
            setTimeout(function() {
              document.getElementById("viewer_tags_group").classList.remove("viewer_tags_disabled");
              viewerTagsEnabled.disabled = false;
              if (!firstChangeOccuredPreTimer) {
                document.getElementById("viewer_tags_group").style.display = "revert";
              }
            }, 0);
          }
          else {
            setTimeout(function() {
              document.getElementById("viewer_tags_group").classList.add("viewer_tags_disabled");
              viewerTagsEnabled.disabled = false;
              if (!firstChangeOccuredPreTimer) {
                document.getElementById("viewer_tags_group").style.display = "revert";
              }
            }, 0);
          }
          this.FirstChangeOccured = true;
        });
        viewerTagsEnabled.dispatchEvent(new Event("change"));


        //Age Verification stuff

        function isValidIdUpload(file) {
          if (file.size > 10000000) {
            return "Image size is too big.";
          }
          if (file.type != "image/jpeg") {
            return "Please select a jpg image.";
          }
          return "";
        }

        function resetIdUploadInput(e, type, wasCancelled) {
          try {
            e.target.value = null;
            e.target.parentElement.getElementsByClassName("id-filename")[0].innerText = "";
            document.getElementById("upload_id_" + type).classList.add("control-button-important-disabled");
            document.getElementById("upload_id_" + type).disabled = true;
            if (wasCancelled) {
              e.target.parentElement.parentElement.getElementsByClassName("id-upload-message")[0].style.color = "";
              e.target.parentElement.parentElement.getElementsByClassName("id-upload-message")[0].innerText = "Click Select File to select your ID image.";
            }
          }
          catch(e) {
            console.error(e);
          }
        }

        function idFileChange(e, type) {
          if (e.target.files[0] === undefined) {
            resetIdUploadInput(e, type, true);
            return;
          }
          let fileCheck = isValidIdUpload(e.target.files[0]);
          let msgBox = e.target?.parentElement?.parentElement.getElementsByClassName("id-upload-message")[0];
          if (fileCheck == "") {
            document.getElementById("upload_id_" + type).classList.remove("control-button-important-disabled");
            document.getElementById("upload_id_" + type).disabled = false;
            e.target.parentElement.getElementsByClassName("id-filename")[0].innerText = e.target.files[0].name;
            if (msgBox) {
              msgBox.style.color = "";
              msgBox.innerText = "Click Upload File when ready.";
            }
          }
          else {
            if (msgBox) {
              msgBox.style.color = "rgb(252, 92, 101)";
              msgBox.innerText = fileCheck;
              resetIdUploadInput(e, type, false);
            }
          }
        }

        async function uploadIdFile(btn, submitType) {
          if (btn.disabled === true) {
            return;
          }
          btn.disabled = true;
          
          let msgBox = btn?.parentElement?.parentElement.getElementsByClassName("id-upload-message")[0];
          if (msgBox) {
            msgBox.style.color = "";
            msgBox.innerText = "Uploading ID...";
          }

          let idFile;
          try {
            if (btn.id == "upload_id_1") {
              idFile = document.getElementById("id_field_1").files[0];
            }
            else if (btn.id == "upload_id_2") {
              idFile = document.getElementById("id_field_2").files[0];
            }
          }
          catch (e) {
            console.error(e);
          }

          let url = urlPrefix + '/v1/id_verification_upload';
          let data = {token: userToken,
                      submit_type: submitType,
                      file: idFile}
          let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOSTForm(url, data);
          if (msgBox) {
            if (result?.data.status === true) {
              msgBox.innerText = "ID upload complete. Your ID will be reviewed shortly.";
              btn.classList.add("control-button-important-disabled");
              btn.disabled = true;
              return
            }
            else {
              msgBox.style.color = "rgb(252, 92, 101)";
              msgBox.innerText = result?.data.msg === undefined ? "Something went wrong. Please try again later." : result?.data.msg;
            }
          }
          btn.disabled = false;
        }

        try {
          document.getElementById("select_id_1").addEventListener("click", function() {
            document.getElementById("id_field_1").click();
          });
          document.getElementById("select_id_2").addEventListener("click", function() {
            document.getElementById("id_field_2").click();
          });

          document.getElementById("id_field_1").addEventListener("change", function(e) {
            idFileChange(e, "1");
          });
          document.getElementById("id_field_2").addEventListener("change", function(e) {
            idFileChange(e, "2");
          });

          document.getElementById("upload_id_1").disabled = true;
          document.getElementById("upload_id_1").addEventListener("click", async function() {
            await uploadIdFile(this, "1");
          });
          document.getElementById("upload_id_2").disabled = true;
          document.getElementById("upload_id_2").addEventListener("click", async function() {
            await uploadIdFile(this, "2");
          });
        }
        catch (e) {
          console.error(e);
        }

        let verifyIdTitle = document.getElementById("age_verification_title");
        if (verifyIdTitle && result.data.verified_18 === true) {
          verifyIdTitle.innerText = verifyIdTitle.innerText + " - Status: You have been verified as 18 or over.";
        }

        
        //buttons on settings page to trigger menus
        let modalOverlay = document.getElementById("modal-overlay");
        document.getElementById("change_password").addEventListener("click", function() {
          modalOverlay.openMenu(7);
        });

        document.getElementById("logout_all").addEventListener("click", function() {
          modalOverlay.openMenu(8);
        });


        //sets up buttons inside modal menus
        document.getElementById('changepassword_button').addEventListener("click", rsChangePasswordButton);
        async function rsChangePasswordButton(){
            console.log("rsChangePasswordButton");
            let notifyDiv = document.getElementById("changepassword_notification");
            notifyDiv.innerText = "Changing password...";
            
            let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
            let url = urlPrefix + '/v1/change_password';
            let data = {token: userToken,
                        current_password: document.getElementById("changepass_old").value,
                        new_password: document.getElementById("changepass_new1").value,
                        repeat_new_password: document.getElementById("changepass_new2").value};

            let changePasswordResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);
            if (changePasswordResult.data.status === true) {
              notifyDiv.innerText = "";
              modalOverlay.closeMenu();
              let okPanel = document.getElementById("settings_saved");
              okPanel.style.color = "#1dd1a1";
              okPanel.innerHTML = "Your password has been changed.";
              okPanel.style.display = "block";
              document.getElementById("changepass_old").value = "";
              document.getElementById("changepass_new1").value = "";
              document.getElementById("changepass_new2").value = "";
            }
            else {
              notifyDiv.innerText = changePasswordResult.data.msg;
            }
            console.log(changePasswordResult);
        }
        document.getElementById('logoutall_button').addEventListener("click", rsLogoutAll);
        async function rsLogoutAll(){
            console.log("rsLogoutAll")
            let notifyDiv = document.getElementById("logoutall_notification");
            notifyDiv.innerText = "Logging out...";
            
            let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
            let url = urlPrefix + '/v1/logout_all';
            let data = {token: userToken,
                               password: document.getElementById("logoutall_password").value};

            let logoutAllResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);
            if (logoutAllResult.data.status === true) {
              notifyDiv.innerText = "";
              modalOverlay.closeMenu();
              let okPanel = document.getElementById("settings_saved");
              okPanel.style.color = "#1dd1a1";
              okPanel.innerHTML = "All devices have been logged out. Returning to main page in 5 seconds...";
              okPanel.style.display = "block";
              document.getElementById("logoutall_password").value = "";
              
              (0,_login_js__WEBPACK_IMPORTED_MODULE_2__.onLogout)(false);
              setTimeout(function() {
                document.location.href = "/";
              }, 5000);
            }
            else {
              notifyDiv.innerText = logoutAllResult.data.msg;
            }
            console.log(logoutAllResult);
        }




        //get all referenced button sounds
        let referencedSounds = [];
        for (let i = 0; i < result.data.robots.length; i++) {
          let robotObj;
          try {
            robotObj = JSON.parse(result.data.robots[i]);
          }
          catch (e) {
            continue;
          }
          if (robotObj.panels) {
            for (let j = 0; j < robotObj.panels.length; j++) {
              if (robotObj.panels[j].button_panels) {
                for (let k = 0; k < robotObj.panels[j].button_panels.length; k++) {
                  if (robotObj.panels[j].button_panels[k].buttons) {
                    for (let l = 0; l < robotObj.panels[j].button_panels[k].buttons.length; l++) {
                      if (robotObj.panels[j].button_panels[k].buttons[l].sound && !referencedSounds.includes(robotObj.panels[j].button_panels[k].buttons[l].sound)) {
                        referencedSounds.push(robotObj.panels[j].button_panels[k].buttons[l].sound);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result.data.uploaded_sounds) {
          for (let i = 0 ; i < result.data.uploaded_sounds.length; i++) {
            let removeSpot = referencedSounds.indexOf(result.data.uploaded_sounds[i].display_name);
            if (removeSpot >= 0) {
              referencedSounds.splice(removeSpot, 1);
            }
          }
        }

        //create my robots page the ugly way
        var robotsDiv = document.getElementById("settings_myrobots");

        for (var i = result.data.robots.length - 1; i >= 0; i--) {

            var robot = JSON.parse(result.data.robots[i])
            //var robot = result.data.robots[i] //only for use with rsgoapi
            var robotID = robot.robot_id;

            if (robot.tts_price == null)      {robot.tts_price = 0;}
            if (robot.robot_desc == null)     {robot.robot_desc = '';}
            if (robot.pip_camera_id == null)  {robot.pip_camera_id = '';}
            if (robot.control_filter == null) {robot.control_filter = 'all';}
            if (robot.control_enabled == null) {robot.control_enabled = 'true';}
            if (robot.panels == null){
                robot.panels = [{"label":"panel1","button_panels":[{"label":"button_panel1","buttons":[{"label":"example","price":0,"command":"example","keycode":37}]}]}];
            }

            let robotSoundSelectionOptionsHtml = '';
            if (result.data.uploaded_sounds) {
              for (let i = 0 ; i < result.data.uploaded_sounds.length; i++) {
                robotSoundSelectionOptionsHtml += '<option value="' + result.data.uploaded_sounds[i].file_name + '">' + result.data.uploaded_sounds[i].display_name + '</option>';
              }
            }
            for (let i = 0; i < referencedSounds.length; i++) {
              robotSoundSelectionOptionsHtml += '<option value="">' + referencedSounds[i] + '</option>';
            }
            robotSoundSelectionOptionsHtml = '<option selected value="">None</option>' + robotSoundSelectionOptionsHtml;

            let pipHTML = '<div class="settings-bot-row">\
                        <div class="settings-row-title">PIP Robot ID:</div>\
                        <div class="settings-row-content">\
                          <input type="text" maxlength="100" id="robot_PIP_'+robotID+'" value="'+robot.pip_camera_id+'" placeholder="Place the Robot ID of another stream here to make it appear as a PIP">\
                        </div>\
                      </div>'

            let webrtcMessage = ''
            console.log(robot);
            if(robot.video_type == 'webrtc'){
                console.log('webrtc'); 
                webrtcMessage = 'This robot is not compatible with the old system. It is used for browser streaming'
                pipHTML = ''
            }
            else if(robot.video_type == 'rtmp'){
                console.log('rtmp'); 
                webrtcMessage = 'This robot is not compatible with the old system. It is used for RTMP streaming'
                pipHTML = ''
            }

          var whitelistHtml = '';
          if ("allow_control_whitelist" in _config_js__WEBPACK_IMPORTED_MODULE_1__ && _config_js__WEBPACK_IMPORTED_MODULE_1__.allow_control_whitelist){
            whitelistHtml = '<option value="whitelist">Only Whitelist can control - see /help in chat</option>';
          }
          
          let cameraIdSection = '';
          if (robot.video_type == 'rtmp'){
            cameraIdSection = '\
            <div class="settings-bot-row">\
                <div class="settings-row-title">OBS Server:</div>\
                <div class="settings-row-content">\
                    <div class="settings-row-display">rtmp://rtmp.robotstreamer.com/live</div>\
                </div>\
            </div>\
            <div class="settings-bot-row">\
                <div class="settings-row-title">OBS Stream Key:</div>\
                <div class="settings-row-content">\
                    <div class="settings-row-display">\
                      <input readonly value="' + robotID + '?key=' + result.data.stream_key + '" class="input-blurred" onfocus="uncoverInputField(this)" onblur="hideInputField(this)">\
                    </div>\
                </div>\
            </div>';
          }
          else {
            cameraIdSection = '\
            <div class="settings-bot-row">\
                <div class="settings-row-title">Camera ID:</div>\
                <div class="settings-row-content">\
                    <div class="settings-row-display">'+robot.camera_id+'</div>\
                </div>\
            </div>';
          }



            var robotHTML = '\
              <div class="settings-bot" id="divRobot_'+robotID+'">\
                  <div class="settings-bot-top">\
                      <div class="settings-bot-title">' + _util_js__WEBPACK_IMPORTED_MODULE_0__.stripTagsAndQuotes(robot.robot_name) + '</div>\
                      <div class="settings-field-delete" id="rsSettingsDeleteRobot_'+robotID+'">\
                      </div>\
                  </div>\
                  <div class="settings-bot-main">\
                      <div class="settings-bot-row">\
                          <div class="settings-row-title">Robot ID:</div>\
                          <div class="settings-row-content">\
                              <div class="settings-row-display">'+robotID+' '+webrtcMessage+'</div>\
                          </div>\
                      </div>\
                      '+cameraIdSection+'\
                      <div class="settings-bot-row">\
                          <div class="settings-row-title">Name:</div>\
                          <div class="settings-row-content">\
                              <input type="text" maxlength="140" id="robot_name_'+robotID+'" value="' + _util_js__WEBPACK_IMPORTED_MODULE_0__.stripQuotes(robot.robot_name) + '">\
                          </div>\
                      </div>\
                      <div class="settings-bot-row">\
                          <div class="settings-row-title">Description:</div>\
                          <div class="settings-row-content">\
                              <input type="text" maxlength="7000" id="robot_desc_'+robotID+'" value="'+robot.robot_desc+'">\
                          </div>\
                      </div>\
                      <div class="settings-bot-row">\
                          <div class="settings-row-title">TTS Price (in funbits):</div>\
                          <div class="settings-row-content">\
                              <input type="text" maxlength="100" id="robot_TTS_'+robotID+'" value="'+robot.tts_price+'">\
                          </div>\
                      </div>\
                      '+pipHTML+'\
                      <div class="settings-bot-row">\
                        <div class="settings-row-title">Controls Enabled:</div>\
                        <div class="settings-row-content">\
                          <select name="filterType" id="controlEnabled_'+robotID+'">\
                            <option ' + (robot.control_enabled === "true" ? "selected" : "") + ' value="true">Yes</option>\
                            <option ' + (robot.control_enabled === "false" ? "selected" : "") + ' value="false">No</option>\
                          </select>\
                        </div>\
                      </div>\
                      <div class="settings-bot-row">\
                          <div class="settings-row-title">Control Settings:</div>\
                          <div class="settings-row-content">\
                            <select name="filterType" id="filterTypeControl_'+robotID+'">\
                              <option value="all">Everyone can control</option>\
                              <option value="logged">Only Logged in can control</option>\
                              '+whitelistHtml+'\
                              <option value="owner">Owner only control - no xcontrol</option>\
                            </select>\
                          </div>\
                      </div>\
                      <div class="settings-bot-row">\
                          <div class="settings-row-title-wide">Button Panels:</div>\
                      </div>\
                      <div class="settings-bot-row">\
                          <div class="settings-row-content button-panels-gui-container" style="width:100%;display:flex;" robotid='+robotID+'>\
                              <div class="settings-row-display" style="width:70%;display:none;" id="button_panels_json_entry_'+robotID+'">\
                                <textarea id="robot_panels_'+robotID+'" name="robot-panels-'+robotID+'" wrap="soft" rows="13" cols="30" style="z-index:1; position:relative;">'+JSON.stringify(robot.panels, null, 4)+'</textarea>\
                              </div>\
                              <div class="settings-row-display" style="width:70%;" class="button_panels_gui_display" id="button_panels_gui_display_'+robotID+'" robotid="'+robotID+'">\
                              </div>\
                              <div class="settings-row-display" style="width:30%; margin-left:10px;" class="button_panels_gui_controls" id="button_panels_gui_controls_'+robotID+'" robotid="'+robotID+'">\
                                <div style="display:flex; height:40px; justify-content:flex-end;">\
                                  <label class="checkbox">\
                                    <input type="checkbox" id="button_editor_mode_'+robotID+'" checked>\
                                    <span class="checkbox-slider"></span>\
                                  </label>\
                                  <div class="settings-checkbox-text button-panels-gui-mode-toggle-text" id="button_editor_mode_text_'+robotID+'">Editor</div>\
                                </div>\
                                <span id="button_panels_gui_field_title_label_'+robotID+'" class="button-panels-gui-field-title">Label:</span><input id="button_panels_gui_field_label_'+robotID+'">\
                                <span id="button_panels_gui_field_title_price_'+robotID+'" class="button-panels-gui-field-title">Price:</span><input placeholder="0" id="button_panels_gui_field_price_'+robotID+'">\
                                <span id="button_panels_gui_field_title_command_'+robotID+'" class="button-panels-gui-field-title">Command:</span><input id="button_panels_gui_field_command_'+robotID+'">\
                                <span id="button_panels_gui_field_title_keycode_'+robotID+'" class="button-panels-gui-field-title">Keycode:</span><input id="button_panels_gui_field_keycode_'+robotID+'">\
                                <span id="button_panels_gui_field_title_label_color_'+robotID+'" class="button-panels-gui-field-title">Label Color:</span><input placeholder="Eg: F7F7F7" id="button_panels_gui_field_label_color_'+robotID+'">\
                                <span id="button_panels_gui_field_title_bg_color_'+robotID+'" class="button-panels-gui-field-title">Background Color:</span><input placeholder="Eg: F7F7F7" id="button_panels_gui_field_bg_color_'+robotID+'">\
                                <span id="button_panels_gui_field_title_sound_'+robotID+'" class="button-panels-gui-field-title">Sound:</span>\
                                <div class="button-panels-gui-sound-group">\
                                  <select id="button_panels_gui_field_sound_'+robotID+'" class="button-panels-gui-field-sound-dropdown">'+robotSoundSelectionOptionsHtml+'</select>\
                                  <img src="/images/icon-addrobot.svg" alt="Upload New Sound" title="Upload New Sound" id="button_panels_gui_button_add_sound_'+robotID+'">\
                                  <img src="/images/icon-delete.svg" alt="Delete Sound" title="Delete Sound" id="button_panels_gui_button_delete_sound_'+robotID+'">\
                                </div>\
                                <div class="button_panels_gui_button_grouping">\
                                  <div class="control-button-important control-button-important-disabled" id="button_panels_gui_button_add_button_'+robotID+'">Add Button</div>\
                                  <div class="control-button-important" id="button_panels_gui_button_add_row_'+robotID+'">Add Row</div>\
                                </div>\
                                <div class="button_panels_gui_button_grouping">\
                                  <div class="control-button-important control-button-important-disabled" id="button_panels_gui_button_move_back_'+robotID+'">Move Left</div>\
                                  <div class="control-button-important control-button-important-disabled" id="button_panels_gui_button_move_forward_'+robotID+'">Move Right</div>\
                                </div>\
                                <div class="button_panels_gui_button_grouping" style="justify-content:center;">\
                                  <div class="control-button-important control-button-important-disabled" id="button_panels_gui_button_delete_'+robotID+'">Delete Button</div>\
                                </div>\
                              </div>\
                          </div>\
                      </div>\
                  </div>\
              </div>';

              robotHTML = robotHTML.replace('<option value="'+robot.control_filter+'">', '<option selected value="'+robot.control_filter+'">')
              robotsDiv.innerHTML += robotHTML; //append

        }//for every robot

        var robotHTML ='\
              <div class="settings-addrobot">\
              <a href="new_stream.html">\
              <img  width="30" height="30" src="/images/icon-addrobot.svg" alt="Add New Stream (Robot or Desktop)" style="cursor: pointer;" /> ADD NEW STREAM (ROBOT OR DESKTOP)\
              </a>\
              </div><br>'

        robotsDiv.innerHTML += robotHTML; //append add robot button


        //event listeners for every robot delete
        var deleteElem = document.getElementsByClassName("settings-field-delete");

        for(var i=0; i < deleteElem.length; i+=1){
            var delElemId = deleteElem[i].id;
            deleteElem[i].addEventListener("click", rsSettingsDeleteRobot.bind(this, delElemId), false);
        }

        //setup button gui
        let buttonGuiContainers = document.getElementsByClassName("button-panels-gui-container");
        for (let i = 0; i < buttonGuiContainers.length; i++) {
          let robotId = buttonGuiContainers[i].getAttribute("robotid");
          let guiDisplay = document.getElementById("button_panels_gui_display_" + robotId);
          let guiControls = document.getElementById("button_panels_gui_controls_" + robotId);
          _buttons_js__WEBPACK_IMPORTED_MODULE_3__.makeButtons(guiDisplay, null, robotId, true, result.data.robots, true);
          setupButtonPanelsGui(guiDisplay, robotId);
          setButtonPanelsGuiInputFieldsState(robotId, false);
          let guiControlsLabel = document.getElementById("button_panels_gui_field_label_" + robotId);
          let guiControlsPrice = document.getElementById("button_panels_gui_field_price_" + robotId);
          let guiControlsCommand = document.getElementById("button_panels_gui_field_command_" + robotId);
          let guiControlsKeycode = document.getElementById("button_panels_gui_field_keycode_" + robotId);
          let guiControlsColor = document.getElementById("button_panels_gui_field_label_color_" + robotId);
          let guiControlsBgColor = document.getElementById("button_panels_gui_field_bg_color_" + robotId);
          let guiControlsButtonAddButton = document.getElementById("button_panels_gui_button_add_button_" + robotId);
          let guiControlsButtonAddRow = document.getElementById("button_panels_gui_button_add_row_" + robotId);
          let guiControlsButtonDelete = document.getElementById("button_panels_gui_button_delete_" + robotId);
          let guiControlsButtonBack = document.getElementById("button_panels_gui_button_move_back_" + robotId);
          let guiControlsButtonForward = document.getElementById("button_panels_gui_button_move_forward_" + robotId);
          let guiControlsSound = document.getElementById("button_panels_gui_field_sound_" + robotId);
          let guiControlsAddSound = document.getElementById("button_panels_gui_button_add_sound_" + robotId);
          let guiControlsDeleteSound = document.getElementById("button_panels_gui_button_delete_sound_" + robotId);
          setupControlField(guiControlsLabel, robotId, null, function(panelsObj, rowNum, buttonNum, value) {
            if (buttonNum !== undefined) {
              panelsObj[0].button_panels[rowNum].buttons[buttonNum].label = value;
            }
            else {
              panelsObj[0].button_panels[rowNum].label = value;
            }
            return panelsObj;
          });
          setupControlField(guiControlsPrice, robotId, new RegExp("[^0-9]"), function(panelsObj, rowNum, buttonNum, value) {
            if (value == "") {
              delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].price;
            }
            else {
              panelsObj[0].button_panels[rowNum].buttons[buttonNum].price = parseInt(value);
            }
            return panelsObj;
          });
          setupControlField(guiControlsCommand, robotId, null, function(panelsObj, rowNum, buttonNum, value) {
            panelsObj[0].button_panels[rowNum].buttons[buttonNum].command = value;
            return panelsObj;
          });
          setupControlField(guiControlsKeycode, robotId, new RegExp("[^0-9]"), function(panelsObj, rowNum, buttonNum, value) {
            if (value == "") {
              delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].keycode;
            }
            else {
              panelsObj[0].button_panels[rowNum].buttons[buttonNum].keycode = parseInt(value);
            }
            return panelsObj;
          });
          setupControlField(guiControlsColor, robotId, new RegExp("[^a-fA-F0-9]"), function(panelsObj, rowNum, buttonNum, value) {
            if (value == "") {
              if ('style' in panelsObj[0].button_panels[rowNum].buttons[buttonNum]) {
                delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].style.text;
              }
              if (Object.keys(panelsObj[0].button_panels[rowNum].buttons[buttonNum].style).length < 1) {
                delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].style;
              }
            }
            else {
              if (!('style' in panelsObj[0].button_panels[rowNum].buttons[buttonNum])) {
                panelsObj[0].button_panels[rowNum].buttons[buttonNum].style = {};
              }
              panelsObj[0].button_panels[rowNum].buttons[buttonNum].style.text = value;
            }
            return panelsObj;
          });
          setupControlField(guiControlsBgColor, robotId, new RegExp("[^a-fA-F0-9]"), function(panelsObj, rowNum, buttonNum, value) {
            if (value == "") {
              if ('style' in panelsObj[0].button_panels[rowNum].buttons[buttonNum]) {
                delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].style.bg;
              }
              if (Object.keys(panelsObj[0].button_panels[rowNum].buttons[buttonNum].style).length < 1) {
                delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].style;
              }
            }
            else {
              if (!('style' in panelsObj[0].button_panels[rowNum].buttons[buttonNum])) {
                panelsObj[0].button_panels[rowNum].buttons[buttonNum].style = {};
              }
              panelsObj[0].button_panels[rowNum].buttons[buttonNum].style.bg = value;
            }
            return panelsObj;
          });
          setupControlButton(guiControlsButtonAddButton, robotId, function(panelsObj, rowNum, buttonNum) {
            panelsObj[0].button_panels[rowNum].buttons.push({label: 'New Button', command: new Date().valueOf().toString()});
            return panelsObj;
          }, function() {
            let guiTitles = guiDisplay.getElementsByClassName("stream-controls-title");
            let guiButtons = guiTitles[guiControls.ButtonGuiSelectedRow].parentElement.getElementsByClassName("stream-controls-mvmt-button");
            populateButtonGuiControls(guiDisplay, robotId, guiButtons[guiButtons.length - 1], true);
          });
          setupControlButton(guiControlsButtonAddRow, robotId, function(panelsObj, rowNum, buttonNum) {
            panelsObj[0].button_panels.push({label: 'New Row', buttons: []});
            return panelsObj;
          }, function() {
            let guiTitles = guiDisplay.getElementsByClassName("stream-controls-title");
            populateButtonGuiControls(guiDisplay, robotId, guiTitles[guiTitles.length - 1], false);
          });
          setupControlButton(guiControlsButtonDelete, robotId, function(panelsObj, rowNum, buttonNum) {
            if (buttonNum === undefined) {
              panelsObj[0].button_panels.splice(rowNum, 1);
            }
            else {
              panelsObj[0].button_panels[rowNum].buttons.splice(buttonNum, 1);
            }
            return panelsObj;
          }, function() {
            guiControls.ButtonGuiSelectedRow = undefined;
            guiControls.ButtonGuiSelectedButton = undefined;
            setButtonPanelsGuiInputFieldsState(robotId, false);
          });
          setupControlButton(guiControlsButtonBack, robotId, function(panelsObj, rowNum, buttonNum) {
            if (buttonNum === undefined) {
              if (rowNum > 0) {
                let temp = panelsObj[0].button_panels[rowNum - 1];
                panelsObj[0].button_panels[rowNum - 1] = panelsObj[0].button_panels[rowNum];
                panelsObj[0].button_panels[rowNum] = temp;
                guiControls.ButtonGuiSelectedRow = guiControls.ButtonGuiSelectedRow - 1;
              }
            }
            else {
              if (buttonNum > 0) {
                let temp = panelsObj[0].button_panels[rowNum].buttons[buttonNum - 1];
                panelsObj[0].button_panels[rowNum].buttons[buttonNum - 1] = panelsObj[0].button_panels[rowNum].buttons[buttonNum]
                panelsObj[0].button_panels[rowNum].buttons[buttonNum] = temp;
                guiControls.ButtonGuiSelectedButton = guiControls.ButtonGuiSelectedButton - 1;
              }
            }
            return panelsObj;
          });
          setupControlButton(guiControlsButtonForward, robotId, function(panelsObj, rowNum, buttonNum) {
            if (buttonNum === undefined) {
              if (rowNum < panelsObj[0].button_panels.length - 1) {
                let temp = panelsObj[0].button_panels[rowNum + 1];
                panelsObj[0].button_panels[rowNum + 1] = panelsObj[0].button_panels[rowNum];
                panelsObj[0].button_panels[rowNum] = temp;
                guiControls.ButtonGuiSelectedRow = guiControls.ButtonGuiSelectedRow + 1;
              }
            }
            else {
              if (buttonNum < panelsObj[0].button_panels[rowNum].buttons.length - 1) {
                let temp = panelsObj[0].button_panels[rowNum].buttons[buttonNum + 1];
                panelsObj[0].button_panels[rowNum].buttons[buttonNum + 1] = panelsObj[0].button_panels[rowNum].buttons[buttonNum]
                panelsObj[0].button_panels[rowNum].buttons[buttonNum] = temp;
                guiControls.ButtonGuiSelectedButton = guiControls.ButtonGuiSelectedButton + 1;
              }
            }
            return panelsObj;
          });
          setupControlSelect(guiControlsSound, robotId, function(panelsObj, rowNum, buttonNum, selectObj) {
            if (selectObj.selectedIndex == 0) {
              delete panelsObj[0].button_panels[rowNum].buttons[buttonNum].sound;
            }
            else {
              panelsObj[0].button_panels[rowNum].buttons[buttonNum].sound = selectObj.options[selectObj.selectedIndex].text;
            }
            return panelsObj;
          });

          function updateButtonSounds(soundName, isAdding, soundFilename) {
            let dropdownList = document.getElementsByClassName("button-panels-gui-field-sound-dropdown");
            for (let i = 0; i < dropdownList.length; i++) {
              let foundOption = false;
              for (let j = 0; j < dropdownList[i].options.length; j++) {
                if (j == 0) {
                  continue;
                }
                if (dropdownList[i].options[j].text == soundName) {
                  if (isAdding) {
                    foundOption = true;
                    dropdownList[i].options[j].value = soundFilename;
                  }
                  else {
                    dropdownList[i].options[j].value = "";
                  }
                  break;
                }
              }
              if (!foundOption && isAdding) {
                let newSoundOption = new Option(soundName, soundFilename);
                dropdownList[i].add(newSoundOption);
              }
            }
          }

          function resetButtonSoundUploadInput(e, wasCancelled) {
            try {
              e.target.value = null;
              document.getElementById("button_panels_gui_window_add_sound_select_file_name").innerText = "";
              document.getElementById("button_panels_gui_window_add_sound_acknowledged_button").classList.add("rs-modal-button-disabled");
              document.getElementById("button_panels_gui_window_add_sound_acknowledged_button").disabled = true;
              if (wasCancelled) {
                document.getElementById("button_panels_gui_window_add_sound_message_contents").style.color = "";
                document.getElementById("button_panels_gui_window_add_sound_message_contents").innerText = "Select an mp3 file to upload.";
              }
            }
            catch(e) {
              console.error(e);
            }
          }
          
          function isValidButtonSoundUpload(file) {
            let maxSizeMB = 5;
            if ("button_sound_max_size_megabytes" in _config_js__WEBPACK_IMPORTED_MODULE_1__) {
              maxSizeMB = _config_js__WEBPACK_IMPORTED_MODULE_1__.button_sound_max_size_megabytes;
            }
            let maxSize = maxSizeMB * 1000000;
            if (file.size > maxSize) {
              return "Sound size must be " + String(maxSizeMB) + " MB or less.";
            }
            if (file.type != "audio/mpeg") {
              return "Please select an mp3 file.";
            }
            return "";
          }

          function buttonSoundFileChange(e) {
            if (e.target.files[0] === undefined) {
              resetButtonSoundUploadInput(e, true);
              return;
            }
            let fileCheck = isValidButtonSoundUpload(e.target.files[0]);
            let msgBox = document.getElementById("button_panels_gui_window_add_sound_message_contents");
            if (fileCheck == "") {
              document.getElementById("button_panels_gui_window_add_sound_acknowledged_button").classList.remove("rs-modal-button-disabled");
              document.getElementById("button_panels_gui_window_add_sound_acknowledged_button").disabled = false;
              document.getElementById("button_panels_gui_window_add_sound_select_file_name").innerText = e.target.files[0].name;
              let soundNameMatch = e.target.files[0].name.match(/(.*)\.mp3$/);
              let soundName = "";
              if (soundNameMatch && soundNameMatch[1]) {
                soundName = soundNameMatch[1];
              }
              else {
                soundName = e.target.files[0].name;
              }
              document.getElementById("button_panels_gui_window_add_sound_name").value = soundName.replace(/[^A-Za-z0-9_-]/g, "");
              msgBox.style.color = "";
              msgBox.innerText = "Click Upload when ready.";
            }
            else {
              msgBox.style.color = "rgb(252, 92, 101)";
              msgBox.innerText = fileCheck;
              resetButtonSoundUploadInput(e, false);
            }
          }

          async function uploadButtonSoundFile(btn) {
            btn.disabled = true;
            
            let msgBox = document.getElementById("button_panels_gui_window_add_sound_message_contents");
            msgBox.style.color = "";
            msgBox.innerText = "Uploading sound...";
  
            let soundFile = document.getElementById("button_panels_gui_window_add_sound_file_input").files[0];
            let soundName = document.getElementById("button_panels_gui_window_add_sound_name").value;
  
            let url = urlPrefix + '/v1/upload_button_sound';
            let data = {token: userToken,
                        filename: soundName,
                        file: soundFile};
            let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOSTForm(url, data);
            if (msgBox) {
              if (result?.data.status === true) {
                msgBox.innerText = "Sound upload complete! You must select your new sound from the drop down menu in order to assign it to a button. You can select another mp3 file to upload or close this menu.";
                btn.classList.add("rs-modal-button-disabled");
                btn.disabled = true;
                updateButtonSounds(soundName, true, result.data.data?.file_name || "");
                return
              }
              else {
                msgBox.style.color = "rgb(252, 92, 101)";
                msgBox.innerText = result?.data.msg === undefined ? "Something went wrong. Please try again later." : result?.data.msg;
              }
            }
            btn.disabled = false;
          }

          guiControlsAddSound.addEventListener("click", function() {
            let oldAddSoundWindow = document.getElementById("button_panels_gui_window_add_sound_window");
            if (oldAddSoundWindow) {
              oldAddSoundWindow.remove();
            }
            let addSoundWindow = document.createElement("div");
            addSoundWindow.id = "button_panels_gui_window_add_sound_window";
            addSoundWindow.classList.add("rs-modal-window");
            addSoundWindow.innerHTML = '\
                            <span class="rs-modal-close-button" id="button_panels_gui_window_add_sound_close_button"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>\
                            <img src="/images/icon-addrobot.svg" class="rs-modal-primary-icon">\
                            <div id class="rs-modal-title">Add New Sound</div>\
                            <p id="button_panels_gui_window_add_sound_message_contents" class="rs-modal-contents" style="text-align: center;">Select an mp3 file to upload.</p>\
                            <div style="display: flex; margin-bottom: 20px;">\
                              <div id="button_panels_gui_window_add_sound_select_file_name" style="flex: 1; line-height: 40px; text-align: right; margin-right: 10px; background-color: #333338;border-radius: 2px;padding: 0px 10px;overflow: auto;"></div>\
                              <div id="button_panels_gui_window_add_sound_select_file_button" class="control-button-important">Select File</div>\
                              <input id="button_panels_gui_window_add_sound_file_input" type="file" accept=".mp3" style="display: none;">\
                            </div>\
                            <div style="text-align: center;line-height: 40px;">Name your sound</div>\
                            <input id="button_panels_gui_window_add_sound_name" maxlength="32" style="margin-bottom: 20px;line-height: 40px; text-align: center;background-color: #333338;border: 0;border-radius: 2px;width: 100%;padding: 0px 10px;">\
                            <div style="text-align: center;"><div id="button_panels_gui_window_add_sound_acknowledged_button" class="rs-modal-button-acknowledge rs-modal-button-disabled">Upload</div></div>\
                            ';
            document.getElementsByTagName("BODY")[0].appendChild(addSoundWindow);
            document.getElementById("button_panels_gui_window_add_sound_acknowledged_button").disabled = true;

            function soundNameInputCheck(e) {
              let inputText = "";
              if (e.type == "keypress") {
                inputText = e.key;
              }
              else if (e.type == "paste") {
                inputText = e.clipboardData.getData("text");
              }
              let disallowedPattern = new RegExp("[^A-Za-z0-9_-]");
              if (disallowedPattern.test(inputText)) {
                e.preventDefault();
              }
            }
            let soundNameField = document.getElementById("button_panels_gui_window_add_sound_name");
            soundNameField.addEventListener("keypress", soundNameInputCheck);
            soundNameField.addEventListener("paste", soundNameInputCheck);

            document.getElementById("button_panels_gui_window_add_sound_acknowledged_button").addEventListener("click", async function() {
              if (!this.disabled) {
                await uploadButtonSoundFile(this);
              }
            });
            document.getElementById("button_panels_gui_window_add_sound_select_file_button").addEventListener("click", function() {
              document.getElementById("button_panels_gui_window_add_sound_file_input").click();
            });
            document.getElementById("button_panels_gui_window_add_sound_file_input").addEventListener("change", function(e) {
              buttonSoundFileChange(e);
            });
            document.getElementById("button_panels_gui_window_add_sound_close_button").addEventListener("click", function() {
              addSoundWindow.remove();
            });
          });
          
          guiControlsDeleteSound.addEventListener("click", function() {
            let fileToDelete = document.getElementById("button_panels_gui_field_sound_" + robotId).value;
            let fileToDeleteName = document.getElementById("button_panels_gui_field_sound_" + robotId).options[document.getElementById("button_panels_gui_field_sound_" + robotId).selectedIndex].text;

            if (fileToDelete == "") {
              return
            }

            let oldDeleteSoundWindow = document.getElementById("button_panels_gui_window_delete_sound_window");
            if (oldDeleteSoundWindow) {
              oldDeleteSoundWindow.remove();
            }
            let deleteSoundWindow = document.createElement("div");
            deleteSoundWindow.id = "button_panels_gui_window_delete_sound_window";
            deleteSoundWindow.classList.add("rs-modal-window");
            deleteSoundWindow.innerHTML = '\
                            <span class="rs-modal-close-button" id="button_panels_gui_window_delete_sound_close_button"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></span>\
                            <img src="/images/icon-delete.svg" class="rs-modal-primary-icon">\
                            <div id class="rs-modal-title">Delete Sound</div>\
                            <p id="button_panels_gui_window_delete_sound_message_contents" class="rs-modal-contents" style="text-align: center;">Confirm sound delete.</p>\
                            <div style="display: flex; margin-bottom: 20px;">\
                              <div id="button_panels_gui_window_add_sound_select_file_name" style="flex: 1; line-height: 40px; text-align: center; margin-right: 10px; background-color: #333338;">' + fileToDeleteName + '</div>\
                            </div>\
                            <div style="text-align: center;"><div id="button_panels_gui_window_delete_sound_acknowledged_button" class="rs-modal-button-acknowledge">Delete</div></div>\
                            ';
            document.getElementsByTagName("BODY")[0].appendChild(deleteSoundWindow);
            
            document.getElementById("button_panels_gui_window_delete_sound_acknowledged_button").addEventListener("click", async function() {
              if (!this.disabled) {
                if (this.deletionComplete) {
                  deleteSoundWindow.remove();
                }
                this.disabled = true;
                let msgBox = document.getElementById("button_panels_gui_window_delete_sound_message_contents");
                msgBox.style.color = "";
                msgBox.innerText = "Deleting sound...";
                let result = await _util_js__WEBPACK_IMPORTED_MODULE_0__.deleteFile(fileToDelete);
                if (result?.data.status === true) {
                  msgBox.innerText = "Sound deletion complete! Your button configurations have not been changed. Select an existing sound using the sound dropdowns to use another sound for your buttons. Then press Save Changes.";
                  this.deletionComplete = true;
                  this.innerText = "Close";
                  updateButtonSounds(fileToDeleteName, false);
                }
                else {
                  msgBox.style.color = "rgb(252, 92, 101)";
                  msgBox.innerText = result?.data.msg === undefined ? "Something went wrong. Please try again later." : result?.data.msg;
                }
                this.disabled = false;
              }
            });
            document.getElementById("button_panels_gui_window_delete_sound_close_button").addEventListener("click", function() {
              deleteSoundWindow.remove();
            });
          });

          function getReferencedSoundsFromJson(buttonJsonStr) {
            let robotObj;
            try {
              robotObj = JSON.parse(buttonJsonStr);
            }
            catch (e) {
              return [];
            }
            let includedSounds = [];
            if (robotObj) {
              for (let j = 0; j < robotObj.length; j++) {
                if (robotObj[j].button_panels) {
                  for (let k = 0; k < robotObj[j].button_panels.length; k++) {
                    if (robotObj[j].button_panels[k].buttons) {
                      for (let l = 0; l < robotObj[j].button_panels[k].buttons.length; l++) {
                        if (robotObj[j].button_panels[k].buttons[l].sound && !includedSounds.includes(robotObj[j].button_panels[k].buttons[l].sound)) {
                          includedSounds.push(robotObj[j].button_panels[k].buttons[l].sound);
                        }
                      }
                    }
                  }
                }
              }
            }
            return includedSounds;
          }

          document.getElementById("button_editor_mode_" + robotId).addEventListener("change", function() {
            if (this.checked) {
              document.getElementById("button_editor_mode_text_" + robotId).innerText = "Editor";
              document.getElementById("button_panels_json_entry_" + robotId).style.display = "none";
              document.getElementById("button_panels_gui_display_" + robotId).style.display = "block";
              guiDisplay.innerHTML = "";
              _buttons_js__WEBPACK_IMPORTED_MODULE_3__.makeButtons(guiDisplay, null, robotId, true, document.getElementById("robot_panels_" + robotId).value, false);
              setupButtonPanelsGui(guiDisplay, robotId);
              document.getElementById("button_panels_gui_button_add_row_" + robotId).classList.remove("control-button-important-disabled");
              document.getElementById("button_panels_gui_button_add_row_" + robotId).disabled = false;
              let foundSounds = getReferencedSoundsFromJson(document.getElementById("robot_panels_" + robotId).value)
              for (let i = 0; i < foundSounds.length; i++) {
                updateButtonSounds(foundSounds[i], true);
              }
            }
            else {
              document.getElementById("button_editor_mode_text_" + robotId).innerText = "JSON";
              document.getElementById("button_panels_gui_display_" + robotId).style.display = "none";
              document.getElementById("button_panels_json_entry_" + robotId).style.display = "block";
              guiControls.ButtonGuiSelectedRow = undefined;
              guiControls.ButtonGuiSelectedButton = undefined;
              setButtonPanelsGuiInputFieldsState(robotId, false);
              document.getElementById("button_panels_gui_button_add_row_" + robotId).classList.add("control-button-important-disabled");
              document.getElementById("button_panels_gui_button_add_row_" + robotId).disabled = true;
            }
          });
        }
        
        
        //subscriptions pane
        let subscriptionsDiv = document.getElementById("settings_subscriptions");
        let subHtml = '';
        if (result.data.subscriptions.length > 0) {
          for (let i = 0; i < result.data.subscriptions.length; i++) {
            userIdToUserName[result.data.subscriptions[i].sub_user_id] = result.data.subscriptions[i].sub_user_name;
            let renewPrefix = 'Renews: ';
            let endDate = new Date(result.data.subscriptions[i].end_time);
            let nowDate = new Date();
            let renewArea = endDate.toLocaleDateString(undefined, {month: 'short'}) + ' ' + endDate.getDate() + ', ' + endDate.getFullYear();
            let cancelArea = '<button class="sub-cancel-button" type="button" value="' + result.data.subscriptions[i].sub_user_id + '">Cancel Subscription</button></div>';
            if (result.data.subscriptions[i].cancelled) {
              renewPrefix = 'Expires: ';
              cancelArea = '<button class="sub-cancel-button-disabled" type="button" disabled value="' + result.data.subscriptions[i].sub_user_id + '">Cancelled</button></div>';
            }
            if (nowDate >= endDate) {
              renewPrefix = 'Expired: ';
              if (!result.data.subscriptions[i].cancelled) {
                cancelArea = '<button class="sub-cancel-button-disabled" type="button" disabled value="' + result.data.subscriptions[i].sub_user_id + '">Expired</button></div>';
              }
            }
            renewArea = '<div class="settings-row-display">' + renewPrefix + renewArea + '</div>';
            subHtml += '\
                              <div class="settings-bot-main">\
                                <div class="settings-bot-row">\
                                  <div class="settings-row-title">' + result.data.subscriptions[i].sub_user_name + '</div>\
                                  <div class="settings-row-content" style="text-align:right;">' + renewArea + cancelArea + '</div>\
                              </div>\
                              ';
          }
        }
        else {
          subHtml = '\
                          <div style="background-color:#333338;color:#f7f7f7;width:100%;height:auto;margin-bottom:30px;text-align:center;padding:5px 20px;line-height:40px;">\
                            You have no active subscriptions\
                          </div>\
                          ';
        }
        subscriptionsDiv.innerHTML = subHtml;
        
        //setup unsub buttons
        setTimeout(function() {
          let subCancelButtons = document.getElementsByClassName("sub-cancel-button");
          for (let i = 0; i < subCancelButtons.length; i++) {
            subCancelButtons[i].addEventListener("click", async function() {
              let subCancelConfirm = confirm("Are you sure you want to end your subscription to "+ userIdToUserName[this.value] + " ?");
              if (subCancelConfirm == true) {
                  let cancelSubStatus = await _util_js__WEBPACK_IMPORTED_MODULE_0__.cancelSubscription(this.value);
                  
                  let errorArea = document.getElementById("settings_error");
                  let okArea = document.getElementById("settings_saved");
                  errorArea.innerHTML = "";
                  errorArea.style.color="red";
                  errorArea.style.display = "none";
                  okArea.innerHTML = "";
                  okArea.style.color="#1dd1a1";
                  okArea.style.display = "none";
                  
                  if (cancelSubStatus) {
                    okArea.innerHTML = "Your subscription to <b>" + userIdToUserName[this.value] + "</b> has been cancelled.";
                    okArea.style.display = "block";
                    try {
                      let subRow = this.parentElement.parentElement.parentElement;
                      if (subRow.classList.contains("settings-bot-main")) {
                        subRow.remove();
                      }
                    }
                    catch (err) {
                      console.error(err);
                    }
                  }
                  else {
                    errorArea.innerHTML = "We were unable to cancel your subscription to <b>" + userIdToUserName[this.value] + "</b>. Please contact staff if the problem continues.";
                    errorArea.style.display = "block";
                  }
              }
            })
          }
        }, 100);
        
    }//if result
    else{
        console.log("rsSettings API error");
    }

    //robot delete confirmation and div removal
    async function rsSettingsDeleteRobot(robotID){

        console.log("rsSettingsDeleteRobot", robotID);

        var r = confirm("Confirm delete of robot?\nIt'll only be applied when you save changes");
        console.log("rsSettingsDeleteRobot Confirm", r);
        if (r == true) {
            var split = robotID.split("_");

            //hacky flag element to delete on save changes
            var elementToDelete = "deleteRobot_"+split[1];
            document.getElementById(elementToDelete).value = "true";

            //hide the div
            var divRobot = "divRobot_"+split[1];
            document.getElementById(divRobot).style.display = "none";
        }

    }

    //todo:finish unused! - for navigate away alert
    async function rsSettingsUnsavedCheck(){
        //check if unsaved settings
        var unsaved = false
        if(document.getElementById('email').value != result.data.email){unsaved = true;}
        if(document.getElementById('avatar').value != result.data.avatar){unsaved = true;}
        if(document.getElementById('over18').checked != result.data.over18){unsaved = true;}
        if(document.getElementById('enable_filter').checked != result.data.chat_filter_enabled){unsaved = true;}
        if(document.getElementById('stream_key').value != result.data.stream_key){unsaved = true;}
        if(document.getElementById('enable_chat_throttle').checked != result.data.chat_ip_throttling){unsaved = true;}
        if(document.getElementById('recording_streams').checked != result.data.record_streams){unsaved = true;}
        if(document.getElementById('clipping_streams').checked != result.data.clip_streams){unsaved = true;}
        if(document.getElementById('subscription_icon').value != result.data.subscription_icon){unsaved = true;}
        console.log("unsaved changes:",unsaved);

    }


    //save changes
    async function rsSettingsSave(){

        console.log("start save changes");

        var sendRobots = []
        //save for every robot
        for (var i = result.data.robots.length - 1; i >= 0; i--) {

            var robot = JSON.parse(result.data.robots[i])
            //var robot = result.data.robots[i] //only for use with rsgoapi
            //mash string to bool
            var deleteThisRobot = false
            if (document.getElementById("deleteRobot_"+robot.robot_id)&&
                document.getElementById("deleteRobot_"+robot.robot_id).value == "true"){
                deleteThisRobot = true
            }

            try{
                var newpanels = JSON.parse(document.getElementById("robot_panels_"+robot.robot_id).value)
            }catch(e){
                alert("invalid json")
                var newpanels = robot.panels
            }

            let pipValue = ''
            if (document.getElementById("robot_PIP_"+robot.robot_id)){
                pipValue = document.getElementById("robot_PIP_"+robot.robot_id).value
            }



            sendRobots[i] = {
                            robot_id: robot.robot_id,
                            robot_name: document.getElementById("robot_name_"+robot.robot_id).value,
                            robot_desc: document.getElementById("robot_desc_"+robot.robot_id).value,
                            tts_price: document.getElementById("robot_TTS_"+robot.robot_id).value,
                            pip_camera_id: pipValue,
                            control_filter: document.getElementById("filterTypeControl_"+robot.robot_id).value,
                            control_enabled: document.getElementById("controlEnabled_"+robot.robot_id).value,
                            panels: newpanels,
                            robot_delete: deleteThisRobot,
                            }
        }


        var wordFilterArea = document.getElementById("filter_text");
        var wordFilterLines = wordFilterArea.value.replace(/\r\n/g,"\n").split("\n");
        var wordFilterLinesSet = new Set();
        //insert to set to remove duplicates
        wordFilterLines.forEach(function(entry) {
            wordFilterLinesSet.add(entry)
        });

        //set into array
        wordFilterLines = [...wordFilterLinesSet];
        console.log(wordFilterLines);

        let urlPrefix = _util_js__WEBPACK_IMPORTED_MODULE_0__.getAPIprefix();
        var url = urlPrefix + '/v2/set_user_settings';
        var data = {
                    user_name: userName,
                    token: userToken,
                    email: document.getElementById('email').value,
                    avatar: document.getElementById('avatar').value,
                    over18: document.getElementById('over18').checked,

                    nsfw_broadcaster: document.getElementById('nsfw_broadcaster').checked,
                    stream_key: document.getElementById('stream_key').value,
                    filter_type_chat: document.getElementById('filterTypeChat').value,
                    filter_enable: document.getElementById('enable_filter').checked,
                    chat_ip_throttling: document.getElementById('enable_chat_throttle').checked,
                    record_streams: document.getElementById('recording_streams').checked,
                    clip_streams: document.getElementById('clipping_streams').checked,
                    chat_filter_words: wordFilterLines,
                    chat_limit: document.getElementById('chat_limit').value,
                    subscription_icon: document.getElementById('subscription_icon').value,
                    viewer_tags_enabled: document.getElementById('viewer_tags_enabled').checked,
                    robots: sendRobots
                   }

        //allow none
        if (document.getElementById('email_paypal').value){
          Object.assign(data, {email_paypal: document.getElementById('email_paypal').value})
        }
        
        if (streamerTagsModified) {
          let streamerTagSliders = document.getElementsByClassName("streamer-tag-slider");
          let settingStreamerTags = [];
          for (let i = 0; i < streamerTagSliders.length; i++) {
            let newTag = {};
            let defaultTagName = streamerTagSliders[i].getAttribute("streamertag");
            if (defaultTagName === null) {
              newTag['name'] = streamerTagSliders[i].parentElement.parentElement.parentElement.getElementsByClassName("streamer-tag-custom-key")[0].value;
            }
            else {
              newTag['name'] = defaultTagName;
            }
            newTag['value'] = parseInt(streamerTagSliders[i].value);
            settingStreamerTags.push(newTag);
          }
          data['streamer_tags'] = settingStreamerTags;
        }
        
        if (viewerTagsModified) {
          let viewerTagSliders = document.getElementsByClassName("viewer-tag-slider");
          let settingViewerTags = [];
          for (let i = 0; i < viewerTagSliders.length; i++) {
            let newTag = {};
            let defaultTagName = viewerTagSliders[i].getAttribute("viewertag");
            if (defaultTagName === null) {
              newTag['name'] = viewerTagSliders[i].parentElement.parentElement.parentElement.getElementsByClassName("viewer-tag-custom-key")[0].value;
            }
            else {
              newTag['name'] = defaultTagName;
            }
            newTag['value'] = parseInt(viewerTagSliders[i].value);
            settingViewerTags.push(newTag);
          }
          data['viewer_tags'] = settingViewerTags;
        }

        if (document.getElementById("vpn_filter").ApiEnabled) {
          data['vpn_filter'] = document.getElementById("vpn_filter").checked;
        }

        // dont log this in production...
        if (_config_js__WEBPACK_IMPORTED_MODULE_1__.domain != 'robotstreamer.com') {
          console.log(data);
        }

        var saveResult = await _util_js__WEBPACK_IMPORTED_MODULE_0__.axiosPOST(url, data);
        var errorDiv = document.getElementById("settings_error");
        var okDiv = document.getElementById("settings_saved");
        errorDiv.innerHTML = ""
        errorDiv.style.color="red";
        errorDiv.style.display = "none" 
        okDiv.style.color="#1dd1a1";
        okDiv.style.display = "none" 

        console.log(saveResult.data);
        
        let errorFields = {};

        if(saveResult.data.error.length > 0){
          console.log("error detected");
          
          errorDiv.style.display = "block";
          let errorDivContents = "";
          //list errors          
          saveResult.data.error.forEach(function(element) {
            console.log(element);
            errorDivContents = errorDivContents + element.error + "\n";
            if ('field' in element) {
              errorFields[element.field] = true;
            }
          });
          errorDiv.innerText = errorDivContents;
        }

        if (saveResult.data.status){
          okDiv.style.display = "block"
          okDiv.innerHTML = saveResult.data.status_readable
        }
        
        if (!('avatar' in errorFields)) {
          if (document.getElementById('avatar').value == "") {
            document.getElementById('settings_profile_picture').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gEaFAIdRBLJgwAAAAtJREFUCNdjYAACAAAFAAHiJgWbAAAAAElFTkSuQmCC";
          }
          else {
            document.getElementById('settings_profile_picture').onerror = function(){this.onerror=null;this.src='/images/noimage.png';}
            document.getElementById('settings_profile_picture').src = document.getElementById('avatar').value;
          }
        }

    }


    //for cycling between pseudo pages
    function rsSettingsChangePage(page){

        var profileButton = document.getElementById('button_profile');
        var broadcasterButton = document.getElementById('button_broadcaster');
        var myrobotsButton = document.getElementById('button_myrobots');
        var subscriptionsButton = document.getElementById('button_subscriptions');

        var profileDiv = document.getElementById('settings_profile');
        var broadcasterDiv = document.getElementById('settings_broadcaster');
        var myrobotsDiv = document.getElementById('settings_myrobots');
        var subscriptionsDiv = document.getElementById('settings_subscriptions');

        profileButton.className = "settings-nav"
        broadcasterButton.className = "settings-nav"
        myrobotsButton.className = "settings-nav"
        subscriptionsButton.className = "settings-nav"

        profileDiv.style.display = "none"
        broadcasterDiv.style.display = "none"
        myrobotsDiv.style.display = "none"
        subscriptionsDiv.style.display = "none"

        //hide the broadcaster panel
        //if (isBroadcaster){broadcasterButton.style.display = "block" }
        //else{broadcasterButton.style.display = "none" }
        broadcasterButton.style.display = "block"

        if(page == "profile"){
            profileButton.className = "settings-nav active"
            profileDiv.style.display = "block"
        }
        else if(page == "broadcaster"){
            broadcasterButton.className = "settings-nav active"
            broadcasterDiv.style.display = "block"
        }
        else if(page == "myrobots"){
            myrobotsButton.className = "settings-nav active"
            myrobotsDiv.style.display = "block"
        }
        else if(page == "subscriptions"){
            subscriptionsButton.className = "settings-nav active"
            subscriptionsDiv.style.display = "block"
        }

        console.log(page);
    }

    function startViewerTagsDisclaimerExpiration() {
      let disclaimerBox = document.getElementById("viewer_tags_disclaimer_text");
      if (!disclaimerBox.disclaimered) {
        disclaimerBox.disclaimered = true;
        disclaimerBox.classList.add("viewer-tags-disclaimer-text-fadeout")
        setTimeout(function() {
          disclaimerBox.innerText = "Settings changed. Save to commit your changes.";
          disclaimerBox.classList.remove("viewer-tags-disclaimer-text-fadeout");
        }, 500);
      }
    }

    function setButtonPanelsGuiInputFieldsState(robotId, enabled) {
      if (enabled) {
        document.getElementById("button_panels_gui_field_label_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_price_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_command_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_keycode_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_label_color_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_bg_color_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_sound_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_field_title_label_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_field_title_price_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_field_title_command_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_field_title_sound_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_field_title_keycode_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_field_title_label_color_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_field_title_bg_color_" + robotId).style.color = "";
        document.getElementById("button_panels_gui_button_add_button_" + robotId).classList.remove("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_delete_" + robotId).classList.add("control-button-important-negative");
        document.getElementById("button_panels_gui_button_delete_" + robotId).classList.remove("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_move_back_" + robotId).classList.remove("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_move_forward_" + robotId).classList.remove("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_add_button_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_button_delete_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_button_move_back_" + robotId).disabled = false;
        document.getElementById("button_panels_gui_button_move_forward_" + robotId).disabled = false;
      }
      else {
        document.getElementById("button_panels_gui_field_label_" + robotId).value = "";
        document.getElementById("button_panels_gui_field_price_" + robotId).value = "";
        document.getElementById("button_panels_gui_field_command_" + robotId).value = "";
        document.getElementById("button_panels_gui_field_keycode_" + robotId).value = "";
        document.getElementById("button_panels_gui_field_label_color_" + robotId).value = "";
        document.getElementById("button_panels_gui_field_bg_color_" + robotId).value = "";
        document.getElementById("button_panels_gui_field_sound_" + robotId).selectedIndex = 0;
        document.getElementById("button_panels_gui_field_label_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_price_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_command_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_keycode_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_label_color_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_bg_color_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_sound_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_field_title_label_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_field_title_price_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_field_title_command_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_field_title_keycode_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_field_title_label_color_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_field_title_bg_color_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_field_title_sound_" + robotId).style.color = "rgba(247, 247, 247, 0.3)";
        document.getElementById("button_panels_gui_button_add_button_" + robotId).classList.add("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_delete_" + robotId).classList.remove("control-button-important-negative");
        document.getElementById("button_panels_gui_button_delete_" + robotId).classList.add("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_move_back_" + robotId).classList.add("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_move_forward_" + robotId).classList.add("control-button-important-disabled");
        document.getElementById("button_panels_gui_button_add_button_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_button_delete_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_button_move_back_" + robotId).disabled = true;
        document.getElementById("button_panels_gui_button_move_forward_" + robotId).disabled = true;
      }
    }

    function setupButtonPanelsGui(guiDisplay, robotId) {
      let guiTitles = guiDisplay.getElementsByClassName("stream-controls-title");
      let guiButtons = guiDisplay.getElementsByClassName("stream-controls-mvmt-button");
      for (let i = 0; i < guiTitles.length; i++) {
        guiTitles[i].addEventListener("click", function() {
          populateButtonGuiControls(guiDisplay, robotId, this, false);
        });
      }
      for (let i = 0; i < guiButtons.length; i++) {
        guiButtons[i].addEventListener("click", function() {
          populateButtonGuiControls(guiDisplay, robotId, this, true);
        });
      }
    }

    function populateButtonGuiControls(guiDisplay, robotId, selectedObject, isButton) {
      let panelsObject = JSON.parse(document.getElementById("robot_panels_"+robotId).value);
      let rows = guiDisplay.getElementsByClassName("stream-controls-buttons");
      let rowPosition;
      let rowObj;
      let guiControls = document.getElementById("button_panels_gui_controls_" + robotId);
      guiControls.ButtonGuiSelectedRow = undefined;
      guiControls.ButtonGuiSelectedButton = undefined;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i] === selectedObject.parentElement) {
          rowPosition = i;
          guiControls.ButtonGuiSelectedRow = i;
          rowObj = rows[i];
          break;
        }
      }
      if (rowPosition !== undefined) {
        if (isButton) {
          let btns = rowObj.getElementsByClassName("stream-controls-mvmt-button");
          for (let i = 0; i < btns.length; i++) {
            if (btns[i] === selectedObject) {
              let foundObj = panelsObject[0].button_panels[rowPosition].buttons[i];
              let soundSelector = document.getElementById("button_panels_gui_field_sound_" + robotId);
              let soundSelectorIndex = 0;
              guiControls.ButtonGuiSelectedButton = i;
              setButtonPanelsGuiInputFieldsState(robotId, true);
              document.getElementById("button_panels_gui_field_label_" + robotId).value = (foundObj.label === undefined ? "" : foundObj.label);
              document.getElementById("button_panels_gui_field_price_" + robotId).value = (foundObj.price === undefined ? "0" : foundObj.price);
              document.getElementById("button_panels_gui_field_command_" + robotId).value = (foundObj.command === undefined ? "" : foundObj.command);
              document.getElementById("button_panels_gui_field_keycode_" + robotId).value = (foundObj.keycode === undefined ? "" : foundObj.keycode);
              document.getElementById("button_panels_gui_field_label_color_" + robotId).value = (foundObj.style?.text === undefined ? "" : foundObj.style?.text);
              document.getElementById("button_panels_gui_field_bg_color_" + robotId).value = (foundObj.style?.bg === undefined ? "" : foundObj.style?.bg);
              for (let i = 1; i < soundSelector.options.length; i++) {
                if (soundSelector.options[i].text == foundObj.sound) {
                  soundSelectorIndex = i;
                  break;
                }
              }
              document.getElementById("button_panels_gui_field_sound_" + robotId).selectedIndex = soundSelectorIndex;
              document.getElementById("button_panels_gui_button_delete_" + robotId).innerText = "Delete Button";
              document.getElementById("button_panels_gui_button_move_back_" + robotId).innerText = "Move Left";
              document.getElementById("button_panels_gui_button_move_forward_" + robotId).innerText = "Move Right";
              break;
            }
          }
        }
        else {
          setButtonPanelsGuiInputFieldsState(robotId, false);
          document.getElementById("button_panels_gui_field_label_" + robotId).value = (panelsObject[0].button_panels[rowPosition].label === undefined ? "" : panelsObject[0].button_panels[rowPosition].label);
          document.getElementById("button_panels_gui_field_label_" + robotId).disabled = false;
          document.getElementById("button_panels_gui_field_title_label_" + robotId).style.color = "";
          document.getElementById("button_panels_gui_button_delete_" + robotId).innerText = "Delete Row";
          document.getElementById("button_panels_gui_button_move_back_" + robotId).innerText = "Move Up";
          document.getElementById("button_panels_gui_button_move_forward_" + robotId).innerText = "Move Down";
          document.getElementById("button_panels_gui_button_add_button_" + robotId).classList.remove("control-button-important-disabled");
          document.getElementById("button_panels_gui_button_delete_" + robotId).classList.add("control-button-important-negative");
          document.getElementById("button_panels_gui_button_delete_" + robotId).classList.remove("control-button-important-disabled");
          document.getElementById("button_panels_gui_button_move_back_" + robotId).classList.remove("control-button-important-disabled");
          document.getElementById("button_panels_gui_button_move_forward_" + robotId).classList.remove("control-button-important-disabled");
          document.getElementById("button_panels_gui_button_add_button_" + robotId).disabled = false;
          document.getElementById("button_panels_gui_button_delete_" + robotId).disabled = false;
          document.getElementById("button_panels_gui_button_move_back_" + robotId).disabled = false;
          document.getElementById("button_panels_gui_button_move_forward_" + robotId).disabled = false;
        }
      }
    }

    function setupControlField(inputField, robotId, disallowedPattern, jsonEditor) {
      function changeFunction(e) {
        if (disallowedPattern) {
          let inputText = "";
          if (e.type == "keypress") {
            inputText = e.key;
          }
          else if (e.type == "paste") {
            inputText = e.clipboardData.getData("text");
          }
          if (disallowedPattern.test(inputText)) {
            e.preventDefault();
          }
        }
      }

      inputField.addEventListener("keypress", changeFunction);
      inputField.addEventListener("paste", changeFunction);
      inputField.addEventListener("input", function() {
        if (inputField.parentElement.ButtonGuiSelectedRow !== undefined) {
          let panelsObj = JSON.parse(document.getElementById("robot_panels_" + robotId).value);
          panelsObj = jsonEditor(panelsObj, inputField.parentElement.ButtonGuiSelectedRow, inputField.parentElement.ButtonGuiSelectedButton, inputField.value);
          document.getElementById("robot_panels_" + robotId).value = JSON.stringify(panelsObj, null, 4);
          let guiDisplay = document.getElementById("button_panels_gui_display_" + robotId);
          guiDisplay.innerHTML = "";
          _buttons_js__WEBPACK_IMPORTED_MODULE_3__.makeButtons(guiDisplay, null, robotId, true, document.getElementById("robot_panels_" + robotId).value, false);
          setupButtonPanelsGui(guiDisplay, robotId);
        }
      });
    }

    function setupControlButton(inputButton, robotId, jsonEditor, postAction) {
      inputButton.addEventListener("click", function() {
        if (!this.disabled) {
          let guiControls = document.getElementById("button_panels_gui_controls_" + robotId);
          let panelsObj = JSON.parse(document.getElementById("robot_panels_" + robotId).value);
          panelsObj = jsonEditor(panelsObj, guiControls.ButtonGuiSelectedRow, guiControls.ButtonGuiSelectedButton);
          document.getElementById("robot_panels_" + robotId).value = JSON.stringify(panelsObj, null, 4);
          let guiDisplay = document.getElementById("button_panels_gui_display_" + robotId);
          guiDisplay.innerHTML = "";
          _buttons_js__WEBPACK_IMPORTED_MODULE_3__.makeButtons(guiDisplay, null, robotId, true, document.getElementById("robot_panels_" + robotId).value, false);
          setupButtonPanelsGui(guiDisplay, robotId);
          if (postAction) {
            postAction();
          }
        }
      });
    }

    function setupControlSelect(inputSelect, robotId, jsonEditor) {
      inputSelect.addEventListener("change", function() {
        let guiControls = document.getElementById("button_panels_gui_controls_" + robotId);
        let panelsObj = JSON.parse(document.getElementById("robot_panels_" + robotId).value);
        panelsObj = jsonEditor(panelsObj, guiControls.ButtonGuiSelectedRow, guiControls.ButtonGuiSelectedButton, inputSelect);
        document.getElementById("robot_panels_" + robotId).value = JSON.stringify(panelsObj, null, 4);
        let guiDisplay = document.getElementById("button_panels_gui_display_" + robotId);
        guiDisplay.innerHTML = "";
        _buttons_js__WEBPACK_IMPORTED_MODULE_3__.makeButtons(guiDisplay, null, robotId, true, document.getElementById("robot_panels_" + robotId).value, false);
        setupButtonPanelsGui(guiDisplay, robotId);
      });
    }
}


//# sourceURL=webpack://rswebclient/./src/settings.js?