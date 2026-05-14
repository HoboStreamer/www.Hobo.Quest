#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="${SCRIPT_DIR}/.rs-native-publisher-work"
ENV_FILE="${SCRIPT_DIR}/.env"

TARGET_URL=""
ROBOT_ID=""

WIDTH="${WIDTH:-640}"
HEIGHT="${HEIGHT:-480}"
FPS="${FPS:-30}"
VIDEO_KBPS="${VIDEO_KBPS:-1500}"
MIN_VIDEO_KBPS="${MIN_VIDEO_KBPS:-700}"
NO_AUDIO="${NO_AUDIO:-0}"
CAPTURE_X="${CAPTURE_X:-0}"
CAPTURE_Y="${CAPTURE_Y:-0}"
TARGET_DISPLAY="${TARGET_DISPLAY:-:99}"
USE_EXISTING_TARGET_DISPLAY="${USE_EXISTING_TARGET_DISPLAY:-0}"
AUDIO_SINK_NAME="${AUDIO_SINK_NAME:-rs_browser_sink}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url) TARGET_URL="${2:-}"; shift 2 ;;
    --robot|--robot-id) ROBOT_ID="${2:-}"; shift 2 ;;
    --width) WIDTH="${2:-}"; shift 2 ;;
    --height) HEIGHT="${2:-}"; shift 2 ;;
    --fps) FPS="${2:-}"; shift 2 ;;
    --video-kbps) VIDEO_KBPS="${2:-}"; shift 2 ;;
    --min-video-kbps) MIN_VIDEO_KBPS="${2:-}"; shift 2 ;;
    --no-audio) NO_AUDIO=1; shift ;;
    --capture-x) CAPTURE_X="${2:-}"; shift 2 ;;
    --capture-y) CAPTURE_Y="${2:-}"; shift 2 ;;
    --target-display) TARGET_DISPLAY="${2:-}"; USE_EXISTING_TARGET_DISPLAY=1; shift 2 ;;
    --use-existing-target-display) USE_EXISTING_TARGET_DISPLAY=1; shift ;;
    -h|--help)
      echo "Usage: $0 --robot 3341 --url 'http://10.0.0.100:8000/#spectate' --width 640 --height 480 --fps 30"
      exit 0
      ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

: "${RS_TOKEN:?Missing RS_TOKEN in .env}"
: "${STREAM_KEY:?Missing STREAM_KEY in .env}"

PUBLISH_SECRET="${PUBLISH_SECRET:-$RS_TOKEN}"

[[ -n "$ROBOT_ID" ]] || { echo "Missing robot id. Use --robot 3341"; exit 1; }
[[ -n "$TARGET_URL" ]] || { echo "Missing URL. Use --url ..."; exit 1; }

find_chromium() {
  command -v chromium >/dev/null 2>&1 && { command -v chromium; return; }
  command -v chromium-browser >/dev/null 2>&1 && { command -v chromium-browser; return; }
  command -v google-chrome >/dev/null 2>&1 && { command -v google-chrome; return; }
  command -v google-chrome-stable >/dev/null 2>&1 && { command -v google-chrome-stable; return; }
  return 1
}

install_deps() {
  local missing=()

  command -v node >/dev/null 2>&1 || missing+=(nodejs)
  command -v npm >/dev/null 2>&1 || missing+=(npm)
  command -v ffmpeg >/dev/null 2>&1 || missing+=(ffmpeg)
  command -v Xvfb >/dev/null 2>&1 || missing+=(xvfb)
  command -v pactl >/dev/null 2>&1 || missing+=(pulseaudio-utils)
  command -v curl >/dev/null 2>&1 || missing+=(curl)
  command -v fuser >/dev/null 2>&1 || missing+=(psmisc)
  find_chromium >/dev/null 2>&1 || missing+=(chromium)

  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "Installing missing apt packages: ${missing[*]}"
    sudo apt update
    sudo apt install -y "${missing[@]}"
  fi
}

cleanup() {
  set +e
  echo
  echo "Cleaning up..."
  [[ -n "${NODE_PID:-}" ]] && kill "$NODE_PID" 2>/dev/null || true
  [[ -n "${TARGET_CHROME_PID:-}" ]] && kill "$TARGET_CHROME_PID" 2>/dev/null || true
  [[ -n "${XVFB_TARGET_PID:-}" ]] && kill "$XVFB_TARGET_PID" 2>/dev/null || true
  rm -rf "${RUN_PROFILE_DIR:-}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

renice_pid() {
  local pid="$1"
  local name="$2"
  renice -n -10 -p "$pid" >/dev/null 2>&1 || sudo renice -n -10 -p "$pid" >/dev/null 2>&1 || true
  sudo chrt -r -p 20 "$pid" >/dev/null 2>&1 || true
  echo "Priority tuned for $name pid=$pid"
}

install_deps

echo "Killing stale native publisher runtime..."
pkill -KILL -f "${WORK_DIR}/publisher.cjs" 2>/dev/null || true
pkill -KILL -f '/tmp/rs-native-browser' 2>/dev/null || true
pkill -KILL -f '/tmp/rs-browser-feed' 2>/dev/null || true

mkdir -p "$WORK_DIR"

CHROMIUM_BIN="$(find_chromium)"
RUN_PROFILE_DIR="$(mktemp -d /tmp/rs-native-browser.XXXXXX)"
TARGET_HOME_DIR="$RUN_PROFILE_DIR/target-home"
TARGET_PROFILE_DIR="$RUN_PROFILE_DIR/target-profile"
mkdir -p "$TARGET_HOME_DIR" "$TARGET_PROFILE_DIR"

echo "Using Chromium: $CHROMIUM_BIN"
echo "Target URL: $TARGET_URL"
echo "Robot ID: $ROBOT_ID"
echo "Video: ${WIDTH}x${HEIGHT}@${FPS}"
echo "Video bitrate: ${VIDEO_KBPS} kbps"
echo "Mode: target Chromium -> ffmpeg raw I420 -> native node-webrtc -> RobotStreamer"

echo "Starting PulseAudio/PipeWire pulse compatibility..."
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
export PULSE_SERVER="${PULSE_SERVER:-unix:${XDG_RUNTIME_DIR}/pulse/native}"

systemctl --user start pipewire pipewire-pulse wireplumber >/dev/null 2>&1 || true
pulseaudio --start >/dev/null 2>&1 || true
sleep 1

pactl info >/dev/null 2>&1 || { echo "PulseAudio/PipeWire pulse server is not reachable."; exit 1; }

if ! pactl list short sinks | awk '{print $2}' | grep -qx "$AUDIO_SINK_NAME"; then
  pactl load-module module-null-sink sink_name="$AUDIO_SINK_NAME" sink_properties=device.description=RS_Browser_Audio >/dev/null
  echo "Loaded target browser audio sink"
else
  echo "Reusing target browser audio sink"
fi

cat > "$WORK_DIR/package.json" <<'JSON'
{
  "private": true,
  "type": "commonjs",
  "dependencies": {
    "@roamhq/wrtc": "latest",
    "mediasoup-client": "^3.15.7",
    "ws": "^8.18.0"
  }
}
JSON

cat > "$WORK_DIR/publisher.cjs" <<'JS'
'use strict';

const https = require('node:https');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const WebSocket = require('ws');
const wrtc = require('@roamhq/wrtc');
const { Device } = require('mediasoup-client');

global.RTCPeerConnection = wrtc.RTCPeerConnection;
global.RTCSessionDescription = wrtc.RTCSessionDescription;
global.RTCIceCandidate = wrtc.RTCIceCandidate;
global.MediaStreamTrack = wrtc.MediaStreamTrack;
global.MediaStream = wrtc.MediaStream;
global.RTCRtpSender = wrtc.RTCRtpSender;
global.RTCRtpReceiver = wrtc.RTCRtpReceiver;
global.RTCRtpTransceiver = wrtc.RTCRtpTransceiver;

// mediasoup-client browser handlers expect browser-ish globals.
// @roamhq/wrtc normally provides MediaStream, but keep a minimal fallback so
// the handler does not hard-crash on stripped builds.
if (!global.MediaStream) {
  global.MediaStream = class MediaStream {
    constructor(tracks = []) {
      this._tracks = Array.from(tracks);
      this.id = `stream-${Math.random().toString(16).slice(2)}`;
    }

    addTrack(track) {
      if (!this._tracks.includes(track)) this._tracks.push(track);
    }

    removeTrack(track) {
      this._tracks = this._tracks.filter(t => t !== track);
    }

    getTracks() {
      return this._tracks.slice();
    }

    getAudioTracks() {
      return this._tracks.filter(t => t.kind === 'audio');
    }

    getVideoTracks() {
      return this._tracks.filter(t => t.kind === 'video');
    }
  };
}

global.navigator = {
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
  mediaDevices: {}
};

const {
  RS_TOKEN,
  STREAM_KEY,
  PUBLISH_SECRET,
  ROBOT_ID,
  TARGET_DISPLAY,
  WIDTH,
  HEIGHT,
  FPS,
  VIDEO_KBPS,
  MIN_VIDEO_KBPS,
  NO_AUDIO,
  CAPTURE_X,
  CAPTURE_Y,
  AUDIO_SOURCE
} = process.env;

if (!RS_TOKEN) throw new Error('Missing RS_TOKEN');
if (!STREAM_KEY) throw new Error('Missing STREAM_KEY');
if (!ROBOT_ID) throw new Error('Missing ROBOT_ID');

const publishSecret = PUBLISH_SECRET || RS_TOKEN;

const width = Number(WIDTH || 640);
const height = Number(HEIGHT || 480);
const fps = Number(FPS || 30);
const videoKbps = Number(VIDEO_KBPS || 1500);
const minVideoKbps = Number(MIN_VIDEO_KBPS || 700);
const noAudio = String(NO_AUDIO || '0') === '1';
const captureX = Number(CAPTURE_X || 0);
const captureY = Number(CAPTURE_Y || 0);
const frameSize = Math.floor(width * height * 3 / 2);
const audioSourceName = AUDIO_SOURCE || 'rs_browser_sink.monitor';

let shuttingDown = false;

const status = {
  videoFramesIn: 0,
  videoFramesPushed: 0,
  videoFramesDropped: 0,
  videoPartialBytes: 0,
  audioFramesPushed: 0,
  connected: false,
  producedVideo: false,
  producedAudio: false
};

function log(...args) {
  console.log(new Date().toISOString(), ...args);
}

function postJson(hostname, path, body) {
  const payload = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Origin': 'https://robotstreamer.com',
        'Referer': 'https://robotstreamer.com/'
      },
      timeout: 15000
    }, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 500)}`));
          return;
        }
        try { resolve(JSON.parse(raw)); }
        catch (err) { reject(new Error(`JSON parse failed: ${err.message}: ${raw.slice(0, 500)}`)); }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('API timeout')));
    req.write(payload);
    req.end();
  });
}

class ProtooPeer {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.nextId = Math.floor(Math.random() * 9000000) + 100000;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url, ['protoo'], {
        headers: {
          Origin: 'https://robotstreamer.com',
          Referer: `https://robotstreamer.com/robot/${ROBOT_ID}`,
          'User-Agent': global.navigator.userAgent
        },
        rejectUnauthorized: false,
        handshakeTimeout: 15000,
        perMessageDeflate: false
      });

      const timer = setTimeout(() => reject(new Error('SFU websocket timeout')), 15000);

      this.ws.on('open', () => {
        clearTimeout(timer);
        log('[proxy] upstream open');
        resolve();
      });

      this.ws.on('message', data => this._onMessage(data.toString()));
      this.ws.on('error', err => {
        log('[proxy] websocket error:', err.message);
        reject(err);
      });
      this.ws.on('close', (code, reason) => {
        log('[proxy] websocket closed:', code, reason.toString());
        for (const { reject } of this.pending.values()) reject(new Error(`websocket closed ${code}`));
        this.pending.clear();
      });
    });
  }

  _onMessage(raw) {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.response && this.pending.has(msg.id)) {
      const pending = this.pending.get(msg.id);
      this.pending.delete(msg.id);

      if (msg.ok) pending.resolve(msg.data);
      else pending.reject(new Error(msg.errorReason || msg.errorCode || `protoo request ${msg.id} failed`));
      return;
    }

    if (msg.request) {
      log('[proxy] SFU request:', msg.method, msg.id);
      this.ws.send(JSON.stringify({ response: true, id: msg.id, ok: true, data: {} }));
      return;
    }

    if (msg.notification) {
      log('[proxy] SFU notification:', msg.method);
    }
  }

  request(method, data = {}) {
    const id = this.nextId++;

    const msg = {
      request: true,
      id,
      method,
      data
    };

    log('[proxy] request:', method, id);

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(msg));

      setTimeout(() => {
        if (!this.pending.has(id)) return;
        this.pending.delete(id);
        reject(new Error(`protoo request timeout: ${method}`));
      }, 15000);
    });
  }
}

function createDevice(routerRtpCapabilities) {
  const names = ['Chrome111', 'Chrome74', undefined];

  let lastErr;

  for (const handlerName of names) {
    try {
      const device = handlerName ? new Device({ handlerName }) : new Device();
      return device;
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr;
}

function spawnFfmpegVideo(videoSource) {
  const args = [
    '-hide_banner',
    '-loglevel', 'warning',
    '-nostdin',

    // Low-latency capture.
    '-fflags', '+genpts+nobuffer',
    '-avioflags', 'direct',
    '-use_wallclock_as_timestamps', '1',
    '-flags', 'low_delay',
    '-probesize', '32',
    '-analyzeduration', '0',
    '-thread_queue_size', '4',

    '-f', 'x11grab',
    '-draw_mouse', '0',
    '-video_size', `${width}x${height}`,
    '-framerate', String(fps),
    '-i', `${TARGET_DISPLAY}.0+${captureX},${captureY}`,

    // Emit exact raw I420 frames. No CFR filter, no timer pump, no extra fps filter.
    '-vf', 'format=yuv420p',
    '-pix_fmt', 'yuv420p',
    '-f', 'rawvideo',
    'pipe:1'
  ];

  log('[video] starting ffmpeg:', 'ffmpeg', args.join(' '));

  const ff = spawn('ffmpeg', args, {
    stdio: ['ignore', 'pipe', 'inherit']
  });

  let frameBuf = Buffer.allocUnsafe(frameSize);
  let frameOffset = 0;
  let pushedThisTick = 0;
  let lastSecond = Date.now();

  ff.stdout.on('data', chunk => {
    let pos = 0;

    while (pos < chunk.length) {
      const need = frameSize - frameOffset;
      const take = Math.min(need, chunk.length - pos);

      chunk.copy(frameBuf, frameOffset, pos, pos + take);

      frameOffset += take;
      pos += take;

      if (frameOffset === frameSize) {
        status.videoFramesIn++;

        const now = Date.now();

        // Hard guard only prevents pathological stdout bursts from pushing
        // hundreds of frames in one event-loop turn. It does NOT throttle normal 30 FPS.
        if (now - lastSecond >= 1000) {
          pushedThisTick = 0;
          lastSecond = now;
        }

        if (pushedThisTick <= fps + 2) {
          try {
            videoSource.onFrame({
              width,
              height,
              data: frameBuf
            });
            status.videoFramesPushed++;
            pushedThisTick++;
          } catch (err) {
            log('[video] onFrame failed:', err.message);
          }
        } else {
          status.videoFramesDropped++;
        }

        frameBuf = Buffer.allocUnsafe(frameSize);
        frameOffset = 0;
      }
    }

    status.videoPartialBytes = frameOffset;
  });

  ff.on('exit', (code, signal) => {
    log('[video] ffmpeg exited:', { code, signal });
    if (!shuttingDown && code !== 0) process.exitCode = 1;
  });

  return ff;
}

function spawnFfmpegAudio(audioSource) {
  const args = [
    '-hide_banner',
    '-loglevel', 'warning',
    '-nostdin',
    '-fflags', 'nobuffer',
    '-flags', 'low_delay',
    '-f', 'pulse',
    '-i', audioSourceName,
    '-vn',
    '-af', 'aresample=async=1:first_pts=0:min_hard_comp=0.100,asetnsamples=n=960:p=1',
    '-ac', '2',
    '-ar', '48000',
    '-f', 's16le',
    'pipe:1'
  ];

  log('[audio] starting ffmpeg:', 'ffmpeg', args.join(' '));

  const ff = spawn('ffmpeg', args, {
    stdio: ['ignore', 'pipe', 'inherit']
  });

  const bytesPer10ms = 480 * 2 * 2;
  let accum = Buffer.alloc(0);

  ff.stdout.on('data', chunk => {
    accum = Buffer.concat([accum, chunk]);

    // Hard audio latency cap: if backed up over 80ms, keep the newest 20ms.
    const maxBytes = bytesPer10ms * 8;
    if (accum.length > maxBytes) {
      accum = accum.subarray(accum.length - bytesPer10ms * 2);
    }

    while (accum.length >= bytesPer10ms) {
      const block = accum.subarray(0, bytesPer10ms);
      accum = accum.subarray(bytesPer10ms);

      const samples = new Int16Array(480 * 2);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = block.readInt16LE(i * 2);
      }

      try {
        audioSource.onData({
          samples,
          sampleRate: 48000,
          bitsPerSample: 16,
          channelCount: 2,
          numberOfFrames: 480
        });
        status.audioFramesPushed++;
      } catch (err) {
        log('[audio] onData failed:', err.message);
      }
    }
  });

  ff.on('exit', (code, signal) => {
    log('[audio] ffmpeg exited:', { code, signal });
  });

  return ff;
}


function waitForVideoFrames(minFrames = 5, timeoutMs = 5000) {
  const start = Date.now();

  return new Promise(resolve => {
    const timer = setInterval(() => {
      if (status.videoFramesIn >= minFrames || Date.now() - start >= timeoutMs) {
        clearInterval(timer);
        log('[video] warmup complete:', {
          videoFramesIn: status.videoFramesIn,
          waitedMs: Date.now() - start
        });
        resolve();
      }
    }, 50);
  });
}



async function applySenderParams(sender, kind) {
  if (!sender || typeof sender.getParameters !== 'function') {
    log(`[${kind}] WARN: no RTCRtpSender`);
    return;
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const params = sender.getParameters();

      params.degradationPreference = 'maintain-framerate';
      params.priority = 'high';

      if (!params.encodings || !params.encodings.length) {
        params.encodings = [{}];
      }

      for (const enc of params.encodings) {
        enc.active = true;
        enc.priority = 'high';
        enc.networkPriority = 'high';

        if (kind === 'video') {
          enc.maxBitrate = videoKbps * 1000;
          enc.minBitrate = minVideoKbps * 1000;
          enc.maxFramerate = fps;
          enc.scaleResolutionDownBy = 1;
        }
      }

      await sender.setParameters(params);

      const after = sender.getParameters();
      log(`[${kind}] sender params applied`, {
        degradationPreference: after.degradationPreference,
        priority: after.priority,
        encodings: after.encodings
      });

      return;
    } catch (err) {
      log(`[${kind}] setParameters attempt ${attempt} failed:`, err && (err.stack || err.message || String(err)));
      await new Promise(r => setTimeout(r, 250));
    }
  }
}

async function main() {
  log('RobotStreamer page load...');
  const pageData = await postJson('api.robotstreamer.com', '/v1/robot_page_load', {
    token: RS_TOKEN,
    robot_id: ROBOT_ID,
    referrer: `https://robotstreamer.com/robot/${ROBOT_ID}`
  });

  if (!pageData?.rtc_sfu?.host || !pageData?.rtc_sfu?.port) {
    console.error(JSON.stringify(pageData, null, 2));
    throw new Error('page_load missing rtc_sfu');
  }

  const peerId = `p:${crypto.randomBytes(3).toString('hex')}`;
  const sfuUrl = `wss://${pageData.rtc_sfu.host}:${pageData.rtc_sfu.port}/?roomId=${encodeURIComponent(ROBOT_ID)}&peerId=${encodeURIComponent(peerId)}`;

  log('Connecting SFU:', sfuUrl);

  const peer = new ProtooPeer(sfuUrl);
  await peer.connect();

  const routerRtpCapabilities = await peer.request('getRouterRtpCapabilities');

  const device = createDevice(routerRtpCapabilities);
  await device.load({ routerRtpCapabilities });

  log('mediasoup device loaded');

  const transportInfo = await peer.request('createWebRtcTransport', {
    producing: true,
    consuming: false,
    streamkey: publishSecret
  });

  const sendTransport = device.createSendTransport(transportInfo);

  sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
    peer.request('connectWebRtcTransport', {
      transportId: sendTransport.id,
      dtlsParameters
    }).then(callback).catch(errback);
  });

  sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
    try {
      const data = await peer.request('produce', {
        transportId: sendTransport.id,
        kind,
        rtpParameters,
        appData
      });

      callback({ id: data.id });
    } catch (err) {
      errback(err);
    }
  });

  await peer.request('join', {
    device,
    rtpCapabilities: device.rtpCapabilities,
    token: RS_TOKEN
  });

  log('Joined RobotStreamer room');

  const videoSource = new wrtc.nonstandard.RTCVideoSource();
  const audioSource = new wrtc.nonstandard.RTCAudioSource();

  const videoTrack = videoSource.createTrack();
  const audioTrack = audioSource.createTrack();

  videoTrack.contentHint = 'motion';

  // Start capture BEFORE producing to RobotStreamer so the SFU/viewer never
  // sees a dead/frozen first frame.
  const ffVideo = spawnFfmpegVideo(videoSource);
  const ffAudio = noAudio ? null : spawnFfmpegAudio(audioSource);
  await waitForVideoFrames(5, 5000);

  let videoSender = null;
  const videoProducer = await sendTransport.produce({
    track: videoTrack,
    stopTracks: false,
    disableTrackOnPause: false,
    zeroRtpOnPause: false,
    encodings: [{
      active: true,
      maxBitrate: videoKbps * 1000,
      minBitrate: minVideoKbps * 1000,
      maxFramerate: fps,
      scaleResolutionDownBy: 1,
      priority: 'high',
      networkPriority: 'high'
    }],
    codecOptions: {
      videoGoogleStartBitrate: videoKbps,
      videoGoogleMinBitrate: minVideoKbps,
      videoGoogleMaxBitrate: videoKbps
    },
    onRtpSender: sender => {
      videoSender = sender;
      log('[video] onRtpSender captured');
    },
    appData: { source: 'native-x11-i420' }
  });
  await applySenderParams(videoSender, 'video');status.producedVideo = true;
  await forceSenderParams(videoProducer, 'video');
  log('Video producer created:', videoProducer.id);

  const audioProducer = await sendTransport.produce({
    track: audioTrack,
    codecOptions: {
      opusStereo: true,
      opusDtx: false,
      opusFec: false,
      opusMaxPlaybackRate: 48000
    },
    appData: {
      source: 'native-node-wrtc-pcm',
      lowLatency: true
    }
  });

  status.producedAudio = true;
  status.connected = true;
  log('Audio producer created:', audioProducer.id);

  const pc = sendTransport?._handler?._pc;

  setInterval(async () => {
    const inputCount = status.videoFramesIn;
    const pushCount = status.videoFramesPushed;

    const line = {
      ...status,
      approxInputFps: Number((inputCount / 5).toFixed(1)),
      approxPushFps: Number((pushCount / 5).toFixed(1))
    };

    status.videoFramesIn = 0;
    status.videoFramesPushed = 0;

    if (pc?.getStats) {
      try {
        const stats = await pc.getStats();
        for (const report of stats.values()) {
          if (report.type === 'outbound-rtp' && report.kind === 'video') {
            line.outboundVideo = {
              framesEncoded: report.framesEncoded,
              framesPerSecond: report.framesPerSecond,
              bytesSent: report.bytesSent,
              qualityLimitationReason: report.qualityLimitationReason
            };
          }
        }
      } catch {}
    }

    log('[stats]', JSON.stringify(line));
  }, 5000).unref?.();

  log('LIVE: native feed is publishing to RobotStreamer');

  const shutdown = () => {
    shuttingDown = true;
    try { ffVideo.kill('SIGTERM'); } catch {}
    try { ffAudio?.kill?.('SIGTERM'); } catch {}
    try { videoTrack.stop(); } catch {}
    try { audioTrack.stop(); } catch {}
    try { sendTransport.close(); } catch {}
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
JS

hash="$(cat "$WORK_DIR/package.json" "$WORK_DIR/publisher.cjs" | sha256sum | awk '{print $1}')"
oldhash="$(cat "$WORK_DIR/.build-hash" 2>/dev/null || true)"

if [[ ! -d "$WORK_DIR/node_modules" || "$hash" != "$oldhash" ]]; then
  echo "Installing native publisher npm dependencies..."
  cd "$WORK_DIR"
  npm install
  echo "$hash" > "$WORK_DIR/.build-hash"
else
  echo "Reusing cached native publisher dependencies"
fi

if [[ "$USE_EXISTING_TARGET_DISPLAY" == "1" ]]; then
  echo "Using existing target display: $TARGET_DISPLAY"
else
  echo "Starting Xvfb target display $TARGET_DISPLAY"
  echo "WARNING: Xvfb is software-rendered. Real :0 display will be lower latency."
  Xvfb "$TARGET_DISPLAY" -screen 0 "${WIDTH}x${HEIGHT}x24" -ac +extension RANDR +extension GLX +render -nolisten tcp &
  XVFB_TARGET_PID=$!
fi

sleep 1

echo "Starting target browser..."
env -u CHROMIUM_FLAGS -u CHROMIUM_USER_FLAGS -u CHROME_USER_DATA_DIR -u CHROMIUM_USER_DATA_DIR \
DISPLAY="$TARGET_DISPLAY" \
HOME="$TARGET_HOME_DIR" \
XDG_CONFIG_HOME="$TARGET_HOME_DIR/.config" \
XDG_CACHE_HOME="$TARGET_HOME_DIR/.cache" \
XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" \
PULSE_SERVER="$PULSE_SERVER" \
PULSE_SINK="$AUDIO_SINK_NAME" \
"$CHROMIUM_BIN" \
  --test-type \
  --disable-infobars \
  --ignore-gpu-blocklist \
  --enable-gpu-rasterization \
  --enable-zero-copy \
  --enable-accelerated-2d-canvas \
  --enable-webgl \
  --num-raster-threads=4 \
  --disable-dev-shm-usage \
  --no-first-run \
  --no-default-browser-check \
  --disable-background-networking \
  --disable-sync \
  --disable-default-apps \
  --disable-component-update \
  --disable-client-side-phishing-detection \
  --disable-domain-reliability \
  --disable-breakpad \
  --disable-crash-reporter \
  --disable-gpu-vsync \
  --disable-frame-rate-limit \
  --autoplay-policy=no-user-gesture-required \
  --disable-background-timer-throttling \
  --disable-renderer-backgrounding \
  --disable-backgrounding-occluded-windows \
  --disable-features=TranslateUI,MediaRouter,OptimizationHints,AutofillServerCommunication,CalculateNativeWinOcclusion,OnDeviceModel,SegmentationPlatform \
  --window-size="${WIDTH},${HEIGHT}" \
  --window-position=0,0 \
  --force-device-scale-factor=1 \
  --class=RSBrowserFeed \
  --force-device-scale-factor=1 \
  --user-data-dir="$TARGET_PROFILE_DIR" \
  --new-window \
  --app="$TARGET_URL" \
  >"$WORK_DIR/target-chromium.log" 2>&1 &
TARGET_CHROME_PID=$!
renice_pid "$TARGET_CHROME_PID" "target Chromium"

sleep 2

echo "Forcing target Chromium over capture rectangle..."
if command -v xdotool >/dev/null 2>&1; then
  WIN_ID=""

  # Wait until a NEW script-owned browser window exists.
  for _ in $(seq 1 80); do
    best_area=0
    for id in $(DISPLAY="$TARGET_DISPLAY" xdotool search --onlyvisible --class RSBrowserFeed 2>/dev/null || true); do
      geom="$(DISPLAY="$TARGET_DISPLAY" xwininfo -id "$id" 2>/dev/null || true)"
      w="$(printf '%s\n' "$geom" | awk '/Width:/ {print $2; exit}')"
      h="$(printf '%s\n' "$geom" | awk '/Height:/ {print $2; exit}')"
      area=$(( ${w:-0} * ${h:-0} ))
      if (( area > best_area )); then
        best_area="$area"
        WIN_ID="$id"
      fi
    done

    [[ -n "$WIN_ID" ]] && break
    sleep 0.25
  done

  if [[ -z "$WIN_ID" ]]; then
    echo "WARN: no RSBrowserFeed window found. Dumping visible windows:"
    DISPLAY="$TARGET_DISPLAY" wmctrl -lx || true
  else
    # Remove decorations/fullscreen weirdness, then move/resize.
    DISPLAY="$TARGET_DISPLAY" wmctrl -i -r "$WIN_ID" -b remove,fullscreen,maximized_vert,maximized_horz,above 2>/dev/null || true
    sleep 0.2
    DISPLAY="$TARGET_DISPLAY" xdotool windowactivate "$WIN_ID" 2>/dev/null || true
    DISPLAY="$TARGET_DISPLAY" wmctrl -i -r "$WIN_ID" -e "0,0,0,$WIDTH,$HEIGHT" 2>/dev/null || true
    DISPLAY="$TARGET_DISPLAY" xdotool windowmove "$WIN_ID" 0 0 2>/dev/null || true
    DISPLAY="$TARGET_DISPLAY" xdotool windowsize "$WIN_ID" "$WIDTH" "$HEIGHT" 2>/dev/null || true
    DISPLAY="$TARGET_DISPLAY" wmctrl -i -r "$WIN_ID" -b add,above 2>/dev/null || true
    sleep 0.5
    DISPLAY="$TARGET_DISPLAY" xdotool windowactivate "$WIN_ID" 2>/dev/null || true

    echo "Target Chromium window forced: $WIN_ID"
    DISPLAY="$TARGET_DISPLAY" xwininfo -id "$WIN_ID" | grep -E 'Absolute upper-left|Relative upper-left|Width|Height' || true

    # Close Chrome warning/info banner if Chromium still shows one.
    # Clicks near the top-right X inside the content area; harmless if no banner exists.
    DISPLAY="$TARGET_DISPLAY" xdotool mousemove $((WIDTH - 24)) 30 click 1 2>/dev/null || true
    sleep 0.3
  fi
fi

# Capture probe. This is what RobotStreamer will see.
if command -v ffmpeg >/dev/null 2>&1; then
  ffmpeg -y -hide_banner -loglevel error \
    -f x11grab \
    -video_size "${WIDTH}x${HEIGHT}" \
    -i "${TARGET_DISPLAY}.0+${CAPTURE_X},${CAPTURE_Y}" \
    -frames:v 1 "$WORK_DIR/capture-probe.png" 2>/dev/null || true
  echo "Capture probe: $WORK_DIR/capture-probe.png"
fi

sleep 1

echo "Starting native RobotStreamer publisher..."
cd "$WORK_DIR"

RS_TOKEN="$RS_TOKEN" \
STREAM_KEY="$STREAM_KEY" \
PUBLISH_SECRET="$PUBLISH_SECRET" \
ROBOT_ID="$ROBOT_ID" \
TARGET_DISPLAY="$TARGET_DISPLAY" \
WIDTH="$WIDTH" \
HEIGHT="$HEIGHT" \
FPS="$FPS" \
VIDEO_KBPS="$VIDEO_KBPS" \
MIN_VIDEO_KBPS="$MIN_VIDEO_KBPS" \
NO_AUDIO="$NO_AUDIO" \
CAPTURE_X="$CAPTURE_X" \
CAPTURE_Y="$CAPTURE_Y" \
AUDIO_SOURCE="${AUDIO_SINK_NAME}.monitor" \
node publisher.cjs &
NODE_PID=$!
renice_pid "$NODE_PID" "native Node WebRTC publisher"

echo
echo "Running native publisher."
echo "Target display:     $TARGET_DISPLAY"
echo "Video:              I420 ${WIDTH}x${HEIGHT}@${FPS}"
echo "Audio source:       ${AUDIO_SINK_NAME}.monitor"
echo "RobotStreamer page: https://robotstreamer.com/robot/${ROBOT_ID}"
echo
echo "Expected:"
echo "  mediasoup device loaded"
echo "  Video producer created"
echo "  Audio producer created"
echo "  LIVE: native feed is publishing to RobotStreamer"
echo "  [stats] ... approxInputFps / approxPushFps"
echo
echo "Press Ctrl+C to stop."

wait "$NODE_PID"
