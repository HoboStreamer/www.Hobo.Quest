__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Room)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mediasoup_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mediasoup-client */ "./node_modules/mediasoup-client/lib/index.js");
/* harmony import */ var protoo_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! protoo-client */ "./node_modules/protoo-client/lib/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/lib/webrtc/utils.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../config.js */ "./config.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_config_js__WEBPACK_IMPORTED_MODULE_4__);





//import * as util from '../../util.js';




class Room extends events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor() {

        super();

        //id is sent in the clear, dont use sensitive information
        this.id = 'p:' + (0,_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(6);
        //init protoo peer
        this.peer = null;
        //init transports
        this.sendTransport = null;
        this.recvTransport = null;
        this.broadcaster = false;
        this.videoProducer = null;
        this.audioProducer = null;
        this.maxbitrate = null;
        this.minbitrate = null;
    }



    //join and broadcast merged
    join(roomId, rtc_sfu, codec = false, isBroadcaster = false, streamKey = null, maxBitrate = 500, minBitrate = 50) {
        try {
          this.maxVideoBitrate = maxBitrate
          this.minbitrate = minBitrate; 
          //prevents a pointless transport creation
          this.broadcaster = isBroadcaster

          var sfuString = "wss://"+rtc_sfu.host+":"+rtc_sfu.port

          console.log(`Connecting to SFU: ${sfuString} for robot ${roomId}`);

          const wsTransport = new protoo_client__WEBPACK_IMPORTED_MODULE_2__.WebSocketTransport(
              //`${rsConfig["webrtc_sfu"]}/?roomId=${roomId}&peerId=${this.id}&forceH264=${codec === 'h264'}`,
              `${sfuString}/?roomId=${roomId}&peerId=${this.id}`,
          );

          //testing
          if (streamKey){
              //console.warn('-- broadcasting with streamkey:', streamKey);
              console.warn('-- this.broadcaster:', this.broadcaster);
              this.streamKey = streamKey
          }

          this.peer = new protoo_client__WEBPACK_IMPORTED_MODULE_2__.Peer(wsTransport);
          this.peer.on('open', this.onPeerOpen.bind(this));
          this.peer.on('request', this.onPeerRequest.bind(this));
          this.peer.on('notification', this.onPeerNotification.bind(this));
          this.peer.on('failed', console.error);
          this.peer.on('disconnected', console.error);
          this.peer.on('close', console.error);
          //this.peer.on('testing', this.onPeerOpen.bind(this));

        if (!isBroadcaster) {
          // idle timeout
          this.idleDetect(this.peer, wsTransport, 4*(60*60*1000));

        	// more aggressive idle timeout applies to toilet stream only
        	/*if (roomId == "1208" || roomId == "617") {
        	    this.timedStop(this.peer, wsTransport, 90*60*1000);
        	}*/
        }
      }
      catch (err) {
        console.error(err);
      }
    }


    // idle detecting stop
    idleDetect(peer, wsTransport, idleDuration=60*60*1000) {
        var t;
        window.onload = resetTimer;
        window.onmousemove = resetTimer;
        window.onmousedown = resetTimer;     
        window.ontouchstart = resetTimer; 
        window.onclick = resetTimer;      
        window.onkeypress = resetTimer;   
        window.addEventListener('scroll', resetTimer, true); 

        function onIdleAction() {
            console.log("IDLE detect: onIdleAction()")
            peer.close();
            wsTransport.close();
            window.alert("Video stopped: You have been idle for too long")
        }

        function resetTimer() {
            clearTimeout(t);
            t = setTimeout(onIdleAction, idleDuration);  // 1 hr
        }
    }

    // direct stop
    timedStop(peer, wsTransport, idleDuration=60*60*1000) {

        function onIdleAction() {
            console.log("IDLE detect: timedStop()")
            peer.close();
            wsTransport.close();
            window.alert("Video stopped: You have been idle for too long")
        }


	setTimeout(onIdleAction, idleDuration);
    }
    


    async getStatistics(){

        return await this.sendTransport.getStats()

    }



    //applicible only on broadcaster
    async sendAudio(track) {
        console.warn('room.sendAudio()');

        this.audioProducer = await this.sendTransport.produce({
            track       : track,
            codecOptions :{ opusMaxPlaybackRate : 500,
                            opusStereo: true}

        });



        this.audioProducer.on('transportclose', console.error);
        this.audioProducer.on('trackended', console.error);
    }


    async sendVideo(track) {
        console.warn('room.sendVideo()',this.maxVideoBitrate);
        this.videoProducer = await this.sendTransport.produce({
            track       : track,
            codecOptions :{ videoGoogleStartBitrate : this.maxVideoBitrate,
                            videoGoogleMaxBitrate : this.maxVideoBitrate, //bits per second
                            videoGoogleMinBitrate : this.minVideoBitrate
                        }
        });
        this.videoProducer.on('transportclose', console.error);
        this.videoProducer.on('trackended', console.error);
    }


/*
    async replaceTrackAudio(newtrack) {
        console.warn('room.replaceTrackAudio()');
        this.audioProducer = await this.sendTransport.produce({
            track       : newtrack,
            codecOptions :{ opusMaxPlaybackRate : 500,
                            opusStereo: true}
        });

    }


    async replaceTrackVideo(newtrack) {
        console.warn('room.replaceTrackVideo()');
        //this.videoProducer.replaceTrack({ track: newtrack });
        this.videoProducer = await this.sendTransport.produce({
            track       : newtrack,
            //https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
            codecOptions :{ videoGoogleStartBitrate : 500,
                            videoGoogleMaxBitrate : this.maxVideoBitrate, //bits per second
                            //videoGoogleMinBitrate : 500
                        }
        });

    }
*/






    close() {
        console.warn('room.close()');
        this.peer.close();

        //not always sending
        if (this.sendTransport){
            this.sendTransport.close();            
        }

        //not always recieving
        if (this.recvTransport){
            this.recvTransport.close();            
        }

        this.emit('@close');
    }


    //Broadcast and view
    async onPeerOpen() {
        console.warn('room.peer:open');
        const device = new mediasoup_client__WEBPACK_IMPORTED_MODULE_1__.Device();

        const routerRtpCapabilities = await this.peer
            .request('getRouterRtpCapabilities')
            .catch(console.error);
        await device.load({ routerRtpCapabilities });

        //Send without valid key does?..
        if (this.broadcaster){
            await this._prepareSendTransport(device).catch(console.error);
        }else{
            await this._prepareRecvTransport(device).catch(console.error);    
        }
        

        const res = await this.peer.request('join', {
            device,
            rtpCapabilities: device.rtpCapabilities,
            token: window.localStorage.getItem("robotstreamer_token")
        });

        this.emit('@open', res);
    }

    //only on broadcaster
    async _prepareSendTransport(device) {
        const transportInfo = await this.peer
            .request('createWebRtcTransport', {
                producing: true,
                streamkey: this.streamKey,
                consuming: false,
            })
            .catch(console.error);

        // transportInfo.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
        this.sendTransport = device.createSendTransport(transportInfo);
        //this.sendTransport.enableStats(1000); V2
        this.sendTransport.on('connect', (
            { dtlsParameters },
            callback,
            errback,
        ) => {
            console.warn('room.sendTransport:connect');
            this.peer
                .request('connectWebRtcTransport', {
                    transportId: this.sendTransport.id,
                    dtlsParameters,
                })
                .then(callback)
                .catch(errback);
        });
        this.sendTransport.on(
            'produce',
            async ({ kind, rtpParameters, appData }, callback, errback) => {
                console.warn('room.sendTransport:produce');
                try {
                    const { id } = await this.peer.request('produce', {
                        transportId: this.sendTransport.id,
                        kind,
                        rtpParameters,
                        appData
                    });

                    callback({ id });
                } catch (error) {
                    errback(error);
                }
            }
        );
    }


    //todo: test only one send transport per router
    //only on viewer
    async _prepareRecvTransport(device) {
        const transportInfo = await this.peer
            .request('createWebRtcTransport', {
                producing: false,
                consuming: true,
            })
            .catch(console.error);

        // transportInfo.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
        this.recvTransport = device.createRecvTransport(transportInfo);
        this.recvTransport.on('connect', (
            { dtlsParameters },
            callback,
            errback,
        ) => {
            console.warn('room.recvTransport:connect');
            this.peer
                .request('connectWebRtcTransport', {
                    transportId: this.recvTransport.id,
                    dtlsParameters,
                })
                .then(callback)
                .catch(errback);
        });
    }

    onPeerRequest(req, resolve, _reject) {
        console.warn('room.peer:request', req.method);
        switch (req.method) {
            case 'newConsumer': {
                this.recvTransport.consume(req.data).then(consumer => {
                    this.emit('@consumer', consumer);
                    consumer.on('transportclose', console.error);
                    resolve();
                }).catch(console.error);
                break;
            }
            default:
                resolve();
        }
    }

    //todo: hush the notification traffic to severe events
    onPeerNotification(notification) {
        switch (notification.method) {
            case 'activeSpeaker': //N/A
            case 'producerScore': //can show connection difficulty icon
            case 'consumerScore': //can show connection difficulty icon
                // too many logs...
                break;
            //case 'newPeer':
            case 'peerClosed':
            default:
                console.warn('room.peer:notification', notification);
                this.emit('@' + notification.method, notification.data);
        }
    }
}


//# sourceURL=webpack://rswebclient/./src/lib/webrtc/room.js?