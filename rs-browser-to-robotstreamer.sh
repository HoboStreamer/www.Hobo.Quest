#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="${SCRIPT_DIR}/.rs-browser-feed-work"
ENV_FILE="${SCRIPT_DIR}/.env"

TARGET_URL=""
ROBOT_ID=""

WIDTH="${WIDTH:-1280}"
HEIGHT="${HEIGHT:-720}"
FPS="${FPS:-30}"
VIDEO_KBPS="${VIDEO_KBPS:-3500}"
MIN_VIDEO_KBPS="${MIN_VIDEO_KBPS:-1500}"

TARGET_DISPLAY="${TARGET_DISPLAY:-:99}"
PUBLISH_DISPLAY="${PUBLISH_DISPLAY:-:100}"
LOCAL_PORT="${LOCAL_PORT:-8787}"

AUDIO_SINK_NAME="${AUDIO_SINK_NAME:-rs_browser_sink}"
PUBLISHER_SINK_NAME="${PUBLISHER_SINK_NAME:-rs_publisher_sink}"
USE_EXISTING_TARGET_DISPLAY="${USE_EXISTING_TARGET_DISPLAY:-0}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url) TARGET_URL="${2:-}"; shift 2 ;;
    --robot|--robot-id) ROBOT_ID="${2:-}"; shift 2 ;;
    --width) WIDTH="${2:-}"; shift 2 ;;
    --height) HEIGHT="${2:-}"; shift 2 ;;
    --fps) FPS="${2:-}"; shift 2 ;;
    --video-kbps) VIDEO_KBPS="${2:-}"; shift 2 ;;
    --min-video-kbps) MIN_VIDEO_KBPS="${2:-}"; shift 2 ;;
    --target-display) TARGET_DISPLAY="${2:-}"; USE_EXISTING_TARGET_DISPLAY=1; shift 2 ;;
    --use-existing-target-display) USE_EXISTING_TARGET_DISPLAY=1; shift ;;
    --video-nr) shift 2 ;; # ignored in raw-frame mode
    -h|--help)
      echo "Usage: $0 --robot 3341 --url 'http://10.0.0.100:8000/#spectate' --width 1280 --height 720 --fps 30 --video-kbps 3500"
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

ROBOT_ID="${ROBOT_ID:-${ROBOT_ID_FROM_ENV:-}}"
TARGET_URL="${TARGET_URL:-${TARGET_URL_FROM_ENV:-}}"
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

install_deps_if_needed() {
  local missing=()

  command -v node >/dev/null 2>&1 || missing+=(nodejs)
  command -v npm >/dev/null 2>&1 || missing+=(npm)
  command -v Xvfb >/dev/null 2>&1 || missing+=(xvfb)
  command -v ffmpeg >/dev/null 2>&1 || missing+=(ffmpeg)
  command -v pactl >/dev/null 2>&1 || missing+=(pulseaudio-utils)
  command -v curl >/dev/null 2>&1 || missing+=(curl)
  command -v fuser >/dev/null 2>&1 || missing+=(psmisc)
  command -v xrandr >/dev/null 2>&1 || missing+=(x11-xserver-utils)

  find_chromium >/dev/null 2>&1 || missing+=(chromium)

  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "Installing missing packages: ${missing[*]}"
    sudo apt update
    sudo apt install -y "${missing[@]}"
  fi
}

cleanup() {
  set +e
  echo
  echo "Cleaning up..."

  [[ -n "${FFMPEG_VIDEO_PID:-}" ]] && kill "$FFMPEG_VIDEO_PID" 2>/dev/null || true
  [[ -n "${FFMPEG_AUDIO_PID:-}" ]] && kill "$FFMPEG_AUDIO_PID" 2>/dev/null || true
  [[ -n "${TARGET_CHROME_PID:-}" ]] && kill "$TARGET_CHROME_PID" 2>/dev/null || true
  [[ -n "${PUBLISH_CHROME_PID:-}" ]] && kill "$PUBLISH_CHROME_PID" 2>/dev/null || true
  [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true
  [[ -n "${XVFB_TARGET_PID:-}" ]] && kill "$XVFB_TARGET_PID" 2>/dev/null || true
  [[ -n "${XVFB_PUBLISH_PID:-}" ]] && kill "$XVFB_PUBLISH_PID" 2>/dev/null || true
  rm -rf "${RUN_PROFILE_DIR:-}" 2>/dev/null || true
  rm -rf "${TARGET_PROFILE_DIR:-}" "${PUBLISHER_PROFILE_DIR:-}" 2>/dev/null || true
  rm -rf "$TARGET_PROFILE_DIR" "$PUBLISHER_PROFILE_DIR" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

kill_stale_runtime() {
  echo "Killing stale local publisher/runtime processes..."

  pkill -f "${WORK_DIR}/server.js" 2>/dev/null || true
  pkill -f "${WORK_DIR}/chrome-publisher" 2>/dev/null || true
  pkill -f "${WORK_DIR}/chrome-target" 2>/dev/null || true
  pkill -f "${WORK_DIR}/chrome-target." 2>/dev/null || true
  pkill -f "${WORK_DIR}/chrome-publisher." 2>/dev/null || true
  rm -rf "${WORK_DIR}"/chrome-target "${WORK_DIR}"/chrome-publisher "${WORK_DIR}"/chrome-target-* "${WORK_DIR}"/chrome-publisher-* "${WORK_DIR}"/chrome-target.* "${WORK_DIR}"/chrome-publisher.* 2>/dev/null || true
  pkill -f "${WORK_DIR}/chrome-publisher-" 2>/dev/null || true
  pkill -f "${WORK_DIR}/chrome-target-" 2>/dev/null || true
  rm -f "${WORK_DIR}"/chrome-target*/Singleton* "${WORK_DIR}"/chrome-publisher*/Singleton* 2>/dev/null || true
  pkill -f "ingest-video.bgra" 2>/dev/null || true
  pkill -f "ingest-audio.pcm" 2>/dev/null || true

  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${LOCAL_PORT}/tcp" >/dev/null 2>&1 || true
  fi

  sleep 1
}

wait_for_http() {
  local url="$1"
  local label="$2"
  local timeout="${3:-45}"
  local start
  local code
  local body_file="/tmp/rs-browser-feed-ready.$$"

  start="$(date +%s)"

  echo "Waiting for $label: $url"

  while true; do
    code="$(curl -sS --connect-timeout 1 --max-time 2 -o "$body_file" -w '%{http_code}' "$url" 2>/dev/null || true)"

    # curl failure can become "", "000", or even "000000" if older broken patches appended fallback text.
    # Treat only real HTTP status codes as server-ready.
    if [[ "$code" =~ ^[1-5][0-9][0-9]$ ]]; then
      echo "$label is ready HTTP=$code"

      if [[ "$code" != "200" ]]; then
        echo "Readiness body/debug:"
        cat "$body_file" 2>/dev/null || true
        echo
      fi

      rm -f "$body_file" 2>/dev/null || true
      return 0
    fi

    if [[ -n "${SERVER_PID:-}" ]] && ! kill -0 "$SERVER_PID" 2>/dev/null; then
      echo "$label server process exited before readiness"
      echo
      echo "Node server log tail:"
      tail -n 160 "$WORK_DIR/server.log" 2>/dev/null || true
      rm -f "$body_file" 2>/dev/null || true
      return 1
    fi

    if (( "$(date +%s)" - start >= timeout )); then
      echo "Timed out waiting for $label"
      echo "Last curl code: ${code:-empty}"
      echo
      echo "Port/debug:"
      ss -ltnp 2>/dev/null | grep ":${LOCAL_PORT}" || true
      echo
      echo "Node server log tail:"
      tail -n 160 "$WORK_DIR/server.log" 2>/dev/null || true
      rm -f "$body_file" 2>/dev/null || true
      return 1
    fi

    sleep 0.2
  done
}

assert_alive() {
  local pid="$1"
  local name="$2"

  if ! kill -0 "$pid" 2>/dev/null; then
    echo "$name exited early"
    return 1
  fi
}

renice_pid() {
  local pid="$1"
  local name="$2"

  renice -n -10 -p "$pid" >/dev/null 2>&1 || sudo renice -n -10 -p "$pid" >/dev/null 2>&1 || true

  if command -v chrt >/dev/null 2>&1; then
    sudo chrt -r -p 20 "$pid" >/dev/null 2>&1 || true
  fi

  echo "Priority tuned for $name pid=$pid"
}

try_performance_mode() {
  echo "Applying low-latency runtime tuning where permitted..."
  sudo sh -c 'for gov in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo performance > "$gov" 2>/dev/null || true; done' 2>/dev/null || true
}

configure_existing_display_resolution() {
  [[ "$USE_EXISTING_TARGET_DISPLAY" == "1" ]] || return 0

  echo "Checking target display size on $TARGET_DISPLAY..."
  local xr
  xr="$(DISPLAY="$TARGET_DISPLAY" xrandr 2>/dev/null || true)"
  echo "$xr" | sed -n '1,30p'

  local current_size
  current_size="$(echo "$xr" | awk '/\*/ {print $1; exit}')"

  if [[ "$current_size" == "${WIDTH}x${HEIGHT}" ]]; then
    echo "Target display already matches ${WIDTH}x${HEIGHT}"
    return 0
  fi

  echo "Display is ${current_size:-unknown}; requested ${WIDTH}x${HEIGHT}."
  echo "Use Xvfb or configure :0 to ${WIDTH}x${HEIGHT}."
  return 1
}

install_deps_if_needed
kill_stale_runtime
try_performance_mode

CHROMIUM_BIN="$(find_chromium)"

mkdir -p "$WORK_DIR/public" "$WORK_DIR/src"

RUN_PROFILE_DIR="$(mktemp -d /tmp/rs-browser-feed.XXXXXX)"
TARGET_HOME_DIR="$RUN_PROFILE_DIR/target-home"
PUBLISHER_HOME_DIR="$RUN_PROFILE_DIR/publisher-home"
TARGET_PROFILE_DIR="$RUN_PROFILE_DIR/target-profile"
PUBLISHER_PROFILE_DIR="$RUN_PROFILE_DIR/publisher-profile"

mkdir -p "$TARGET_HOME_DIR" "$PUBLISHER_HOME_DIR" "$TARGET_PROFILE_DIR" "$PUBLISHER_PROFILE_DIR"

echo "Run profile root:          $RUN_PROFILE_DIR"
echo "Target Chromium profile:  $TARGET_PROFILE_DIR"
echo "Publisher Chromium profile:$PUBLISHER_PROFILE_DIR"



echo "Using Chromium: $CHROMIUM_BIN"
echo "Target URL: $TARGET_URL"
echo "Robot ID: $ROBOT_ID"
echo "Video: ${WIDTH}x${HEIGHT}@${FPS}"
echo "Video bitrate: ${VIDEO_KBPS} kbps"
echo "Mode: X11 -> raw I420 localhost stream -> MediaStreamTrackGenerator -> RobotStreamer WebRTC"

echo "Starting PulseAudio/PipeWire pulse compatibility..."

export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
export PULSE_SERVER="${PULSE_SERVER:-unix:${XDG_RUNTIME_DIR}/pulse/native}"

mkdir -p "$XDG_RUNTIME_DIR" 2>/dev/null || true
chmod 700 "$XDG_RUNTIME_DIR" 2>/dev/null || true

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

if ! pactl list short sinks | awk '{print $2}' | grep -qx "$PUBLISHER_SINK_NAME"; then
  pactl load-module module-null-sink sink_name="$PUBLISHER_SINK_NAME" sink_properties=device.description=RS_Publisher_Silent_Audio >/dev/null
  echo "Loaded publisher silent sink"
else
  echo "Reusing publisher silent sink"
fi

cat > "$WORK_DIR/package.json" <<'JSON'
{
  "type": "module",
  "private": true,
  "scripts": {
    "build": "esbuild src/client.js --bundle --format=iife --platform=browser --target=chrome100 --outfile=public/client.bundle.js",
    "server": "node server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.7",
    "esbuild": "^0.25.0",
    "express": "^4.18.3",
    "mediasoup-client": "^3.15.7",
    "protoo-client": "^4.0.6",
    "ws": "^8.18.0"
  }
}
JSON

cat > "$WORK_DIR/server.js" <<'JS'
import 'dotenv/config';
import express from 'express';
import https from 'node:https';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {
  RS_TOKEN,
  STREAM_KEY,
  PUBLISH_SECRET,
  ROBOT_ID,
  TARGET_URL,
  WIDTH = '1280',
  HEIGHT = '720',
  FPS = '30',
  VIDEO_KBPS = '3500',
  MIN_VIDEO_KBPS = '1500',
  LOCAL_PORT = '8787'
} = process.env;

if (!RS_TOKEN) throw new Error('Missing RS_TOKEN');
if (!STREAM_KEY) throw new Error('Missing STREAM_KEY');
if (!ROBOT_ID) throw new Error('Missing ROBOT_ID');

const publishSecret = PUBLISH_SECRET || RS_TOKEN;

const status = {
  startedAt: new Date().toISOString(),
  videoIngestActive: false,
  audioIngestActive: false,
  videoClients: 0,
  audioClients: 0,
  proxyClients: 0,
  upstreamOpen: false,
  lastEvents: []
};

function event(...args) {
  const line = args.map(x => {
    if (typeof x === 'string') return x;
    try { return JSON.stringify(x); } catch { return String(x); }
  }).join(' ');

  console.log(line);
  status.lastEvents.push(`${new Date().toISOString()} ${line}`);
  while (status.lastEvents.length > 180) status.lastEvents.shift();
}

function postJson(hostname, requestPath, body) {
  const payload = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname,
      port: 443,
      path: requestPath,
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
          reject(new Error(`RobotStreamer API HTTP ${res.statusCode}: ${raw.slice(0, 500)}`));
          return;
        }

        try { resolve(JSON.parse(raw)); }
        catch (err) { reject(new Error(`RobotStreamer JSON parse failed: ${err.message}: ${raw.slice(0, 500)}`)); }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('RobotStreamer API timeout')));
    req.write(payload);
    req.end();
  });
}

const pageData = await postJson('api.robotstreamer.com', '/v1/robot_page_load', {
  token: RS_TOKEN,
  robot_id: ROBOT_ID,
  referrer: `https://robotstreamer.com/robot/${ROBOT_ID}`
});

if (!pageData?.rtc_sfu?.host || !pageData?.rtc_sfu?.port) {
  console.error(JSON.stringify(pageData, null, 2).slice(0, 4000));
  throw new Error('RobotStreamer page_load did not return rtc_sfu.host / rtc_sfu.port');
}

const app = express();

// Hard readiness/config routes. Keep these before all stream/proxy/static routes.
app.get('/status', (_req, res) => {
  res.status(200).json(status);
});

app.get('/config.json', (_req, res) => {
  res.status(200).json({
    robotId: String(ROBOT_ID),
    rtcSfu: {
      host: pageData.rtc_sfu.host,
      port: pageData.rtc_sfu.port
    },
    joinToken: RS_TOKEN,
    streamKey: publishSecret,
    targetUrl: TARGET_URL,
    width: Number(WIDTH),
    height: Number(HEIGHT),
    fps: Number(FPS),
    videoKbps: Number(VIDEO_KBPS),
    minVideoKbps: Number(MIN_VIDEO_KBPS)
  });
});


app.get('/status', (_req, res) => {
  res.status(200).json(status);
});

app.get('/config.json', (_req, res) => {
  res.status(200).json({
    robotId: String(ROBOT_ID),
    rtcSfu: {
      host: pageData.rtc_sfu.host,
      port: pageData.rtc_sfu.port
    },
    joinToken: RS_TOKEN,
    streamKey: publishSecret,
    targetUrl: TARGET_URL,
    width: Number(WIDTH),
    height: Number(HEIGHT),
    fps: Number(FPS),
    videoKbps: Number(VIDEO_KBPS),
    minVideoKbps: Number(MIN_VIDEO_KBPS)
  });
});


const videoClients = new Set();
const audioClients = new Set();

const videoWidth = Number(WIDTH);
const videoHeight = Number(HEIGHT);
const videoFps = Number(FPS);
const videoFrameSize = Math.floor(videoWidth * videoHeight * 3 / 2);

let videoAccum = Buffer.alloc(0);
let latestVideoFrameSeq = 0;

status.videoFrameSize = videoFrameSize;
status.videoFramesIn = 0;
status.videoFramesOut = 0;
status.videoFramesDropped = 0;
status.videoBackpressureDrops = 0;
status.videoPartialBytes = 0;
status.audioBackpressureDrops = 0;

function sendLatestFrame(frame) {
  if (!frame || videoClients.size === 0) return;

  for (const ws of videoClients) {
    if (ws.readyState !== WebSocket.OPEN) continue;

    // Hard low-latency rule: never queue old frames.
    // If the browser/WebRTC side is behind, drop this frame.
    if (ws.bufferedAmount > videoFrameSize) {
      status.videoBackpressureDrops++;
      continue;
    }

    try {
      ws.send(frame, { binary: true, compress: false });
      status.videoFramesOut++;
    } catch {}
  }
}

app.post('/ingest-video.i420', (req, res) => {
  req.socket?.setNoDelay?.(true);
  res.socket?.setNoDelay?.(true);

  event('[video] ffmpeg raw I420 ingest connected');
  status.videoIngestActive = true;

  req.on('data', chunk => {
    videoAccum = Buffer.concat([videoAccum, chunk]);

    const fullFrames = Math.floor(videoAccum.length / videoFrameSize);
    if (fullFrames <= 0) {
      status.videoPartialBytes = videoAccum.length;
      return;
    }

    // Keep newest COMPLETE frame only. Never slice at random byte offset.
    const newestFrameStart = (fullFrames - 1) * videoFrameSize;
    const newestFrameEnd = newestFrameStart + videoFrameSize;
    const newestFrame = Buffer.from(videoAccum.subarray(newestFrameStart, newestFrameEnd));

    latestVideoFrameSeq++;
    status.videoFramesIn += fullFrames;

    if (fullFrames > 1) {
      status.videoFramesDropped += fullFrames - 1;
    }

    videoAccum = videoAccum.subarray(fullFrames * videoFrameSize);
    status.videoPartialBytes = videoAccum.length;

    sendLatestFrame(newestFrame);
  });

  req.on('end', () => {
    event('[video] ffmpeg raw I420 ingest ended');
    status.videoIngestActive = false;
    res.end('ok');
  });

  req.on('close', () => {
    event('[video] ffmpeg raw I420 ingest closed');
    status.videoIngestActive = false;
  });

  req.on('error', err => {
    event('[video] ffmpeg raw I420 ingest error:', err.message);
    status.videoIngestActive = false;
  });
});

app.get('/audio.pcm', (req, res) => {
  req.socket?.setNoDelay?.(true);
  res.socket?.setNoDelay?.(true);

  event('[audio] PCM client connected');

  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Connection': 'keep-alive',
    'Transfer-Encoding': 'chunked',
    'Access-Control-Allow-Origin': '*'
  });

  audioClients.add(res);
  status.audioClients = audioClients.size;

  req.on('close', () => {
    audioClients.delete(res);
    status.audioClients = audioClients.size;
    event('[audio] PCM client disconnected');
  });
});

app.post('/ingest-audio.pcm', (req, res) => {
  req.socket?.setNoDelay?.(true);
  res.socket?.setNoDelay?.(true);

  event('[audio] ffmpeg PCM ingest connected');
  status.audioIngestActive = true;

  req.on('data', chunk => {
    for (const client of audioClients) {
      const sock = client.socket;

      if (!sock || sock.destroyed) continue;

      // ~60ms of float32 stereo 48k audio. Past that, drop instead of buffering lag.
      if (sock.writableLength > 48000 * 2 * 4 * 0.06) {
        status.audioBackpressureDrops++;
        continue;
      }

      try { client.write(chunk); } catch {}
    }
  });

  req.on('end', () => {
    event('[audio] ffmpeg PCM ingest ended');
    status.audioIngestActive = false;
    res.end('ok');
  });

  req.on('close', () => {
    event('[audio] ffmpeg PCM ingest closed');
    status.audioIngestActive = false;
  });

  req.on('error', err => {
    event('[audio] ffmpeg PCM ingest error:', err.message);
    status.audioIngestActive = false;
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(Number(LOCAL_PORT), '127.0.0.1', () => {
  event(`Publisher app: http://127.0.0.1:${LOCAL_PORT}/`);
  event(`Status: http://127.0.0.1:${LOCAL_PORT}/status`);
  event(`RobotStreamer SFU: wss://${pageData.rtc_sfu.host}:${pageData.rtc_sfu.port}/`);
  event(`Local protoo proxy: ws://127.0.0.1:${LOCAL_PORT}/rs-protoo`);
});

server.on('connection', socket => {
  socket.setNoDelay(true);
  socket.setKeepAlive(true, 1000);
});

const videoWss = new WebSocketServer({ noServer: true, perMessageDeflate: false });
const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false });

server.on('upgrade', (req, socket, head) => {
  socket.setNoDelay?.(true);

  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

  if (url.pathname === '/video-ws') {
    videoWss.handleUpgrade(req, socket, head, ws => {
      videoWss.emit('connection', ws, req);
    });
    return;
  }

  if (url.pathname === '/rs-protoo') {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
    return;
  }

  socket.destroy();
});

videoWss.on('connection', ws => {
  ws._socket?.setNoDelay?.(true);

  event('[video] raw I420 WS client connected');

  videoClients.add(ws);
  status.videoClients = videoClients.size;

  ws.on('close', () => {
    videoClients.delete(ws);
    status.videoClients = videoClients.size;
    event('[video] raw I420 WS client disconnected');
  });

  ws.on('error', err => {
    videoClients.delete(ws);
    status.videoClients = videoClients.size;
    event('[video] raw I420 WS client error:', err.message);
  });
});

function safeJsonParse(raw) {
  try { return JSON.parse(raw); }
  catch { return null; }
}

function rewriteClientMessage(raw) {
  const msg = safeJsonParse(raw);

  if (!msg || !msg.request || typeof msg.method !== 'string') return raw;

  if (msg.method === 'createWebRtcTransport') {
    msg.data = {
      producing: true,
      consuming: false,
      streamkey: publishSecret
    };
    event(`[proxy] client -> SFU createWebRtcTransport id=${msg.id}`);
    return JSON.stringify(msg);
  }

  if (msg.method === 'join') {
    msg.data = {
      ...(msg.data || {}),
      token: RS_TOKEN
    };
    event(`[proxy] client -> SFU join id=${msg.id}`);
    return JSON.stringify(msg);
  }

  event(`[proxy] client -> SFU ${msg.method} id=${msg.id}`);
  return JSON.stringify(msg);
}

wss.on('connection', clientWs => {
  status.proxyClients++;

  const peerId = `p:${crypto.randomBytes(3).toString('hex')}`;
  const upstreamUrl = `wss://${pageData.rtc_sfu.host}:${pageData.rtc_sfu.port}/?roomId=${encodeURIComponent(ROBOT_ID)}&peerId=${encodeURIComponent(peerId)}`;

  event('[proxy] browser connected');
  event('[proxy] connecting upstream:', upstreamUrl);

  const upstream = new WebSocket(upstreamUrl, ['protoo'], {
    headers: {
      Origin: 'https://robotstreamer.com',
      Referer: `https://robotstreamer.com/robot/${ROBOT_ID}`,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36'
    },
    rejectUnauthorized: false,
    handshakeTimeout: 15000,
    maxPayload: 1024 * 1024
  });

  const queue = [];

  upstream.on('open', () => {
    status.upstreamOpen = true;
    event('[proxy] upstream open');
    while (queue.length) upstream.send(queue.shift());
  });

  upstream.on('message', data => {
    const raw = data.toString();
    const msg = safeJsonParse(raw);

    if (msg?.response) {
      event(`[proxy] SFU -> client response id=${msg.id} ok=${msg.ok}`, msg.ok === false ? msg : '');
    } else if (msg?.request) {
      event(`[proxy] SFU -> client request ${msg.method} id=${msg.id}`);
    } else if (msg?.notification) {
      event(`[proxy] SFU -> client notification ${msg.method}`);
    }

    if (clientWs.readyState === WebSocket.OPEN) clientWs.send(raw);
  });

  upstream.on('error', err => {
    event('[proxy] upstream error:', err.message);
    status.upstreamOpen = false;
    try { clientWs.close(1011, err.message); } catch {}
  });

  upstream.on('close', (code, reason) => {
    event('[proxy] upstream close:', code, reason.toString());
    status.upstreamOpen = false;
    try { clientWs.close(code || 1000, reason.toString()); } catch {}
  });

  clientWs.on('message', data => {
    const raw = rewriteClientMessage(data.toString());
    if (upstream.readyState === WebSocket.OPEN) upstream.send(raw);
    else queue.push(raw);
  });

  clientWs.on('close', () => {
    status.proxyClients = Math.max(0, status.proxyClients - 1);
    event('[proxy] browser closed');
    try { upstream.close(1000); } catch {}
  });

  clientWs.on('error', err => {
    event('[proxy] browser error:', err.message);
    try { upstream.close(1011); } catch {}
  });
});
JS

cat > "$WORK_DIR/public/audio-worklet.js" <<'JS'
class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = [];
    this.offset = 0;
    this.maxSamples = sampleRate * 2 * 0.035;

    this.port.onmessage = event => {
      const data = new Float32Array(event.data);
      if (data.length) this.queue.push(data);

      let total = this._queuedSamples();
      while (total > this.maxSamples && this.queue.length > 1) {
        total -= this.queue[0].length - this.offset;
        this.queue.shift();
        this.offset = 0;
      }
    };
  }

  _queuedSamples() {
    let total = -this.offset;
    for (const q of this.queue) total += q.length;
    return Math.max(0, total);
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    const left = output[0];
    const right = output[1] || output[0];

    for (let i = 0; i < left.length; i++) {
      if (!this.queue.length) {
        left[i] = 0;
        right[i] = 0;
        continue;
      }

      let chunk = this.queue[0];

      if (this.offset + 1 >= chunk.length) {
        this.queue.shift();
        this.offset = 0;

        if (!this.queue.length) {
          left[i] = 0;
          right[i] = 0;
          continue;
        }

        chunk = this.queue[0];
      }

      left[i] = chunk[this.offset++] || 0;
      right[i] = chunk[this.offset++] || 0;
    }

    return true;
  }
}

registerProcessor('pcm-player', PCMPlayerProcessor);
JS

cat > "$WORK_DIR/src/client.js" <<'JS'
import { Device } from 'mediasoup-client';
import * as protooClient from 'protoo-client';

const logEl = document.getElementById('log');

function log(...args) {
  console.log(...args);
  const line = args.map(v => {
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v); } catch { return String(v); }
  }).join(' ');
  logEl.textContent += line + '\n';
  logEl.scrollTop = logEl.scrollHeight;
}

window.addEventListener('error', event => {
  log('WINDOW ERROR:', event.message || event.error?.stack || event.error);
});

window.addEventListener('unhandledrejection', event => {
  log('UNHANDLED PROMISE:', event.reason?.stack || event.reason?.message || event.reason);
});

function randomId(len = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function createSilentAudioTrack() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const actx = new AudioContextClass({ sampleRate: 48000, latencyHint: 'interactive' });
  const osc = actx.createOscillator();
  const gain = actx.createGain();
  const dest = actx.createMediaStreamDestination();

  gain.gain.value = 0;
  osc.frequency.value = 440;
  osc.connect(gain);
  gain.connect(dest);
  osc.start();

  const track = dest.stream.getAudioTracks()[0];
  track.__ctx = actx;
  track.contentHint = 'music';
  return track;
}

async function createLowLatencyPcmAudioTrack() {
  try {
    log('Starting low-latency PCM audio worklet');

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const actx = new AudioContextClass({
      sampleRate: 48000,
      latencyHint: 'interactive'
    });

    await actx.audioWorklet.addModule('/audio-worklet.js');

    const worklet = new AudioWorkletNode(actx, 'pcm-player', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    });

    const dest = actx.createMediaStreamDestination();

    worklet.connect(dest);
    await actx.resume();

    const track = dest.stream.getAudioTracks()[0];
    if (!track) throw new Error('AudioWorklet destination produced no audio track');

    track.contentHint = 'music';

    fetch(`/audio.pcm?ts=${Date.now()}`, { cache: 'no-store' })
      .then(async response => {
        if (!response.ok || !response.body) throw new Error(`audio.pcm HTTP ${response.status}`);

        log('PCM audio stream connected');

        const reader = response.body.getReader();
        let leftover = new Uint8Array(0);

        while (true) {
          const { value, done } = await reader.read();

          if (done) break;
          if (!value || value.byteLength === 0) continue;

          let combined;

          if (leftover.byteLength) {
            combined = new Uint8Array(leftover.byteLength + value.byteLength);
            combined.set(leftover, 0);
            combined.set(value, leftover.byteLength);
          } else {
            combined = value;
          }

          const usable = combined.byteLength - (combined.byteLength % 4);

          if (usable > 0) {
            const payload = combined.slice(0, usable);
            worklet.port.postMessage(payload.buffer, [payload.buffer]);
          }

          leftover = usable < combined.byteLength ? combined.slice(usable) : new Uint8Array(0);
        }

        log('PCM audio stream ended');
      })
      .catch(err => log('PCM audio fetch warning:', err.message || err));

    log('Audio track ready:', track.label, track.readyState);
    return track;
  } catch (err) {
    log('PCM audio worklet failed; using silent fallback:', err.message || err);
    return createSilentAudioTrack();
  }
}

function makeVideoTrackFromI420(cfg) {
  if (typeof MediaStreamTrackGenerator === 'undefined') {
    throw new Error('MediaStreamTrackGenerator is not available in this Chromium build');
  }

  if (typeof VideoFrame === 'undefined') {
    throw new Error('WebCodecs VideoFrame is not available in this Chromium build');
  }

  const generator = new MediaStreamTrackGenerator({ kind: 'video' });
  const writer = generator.writable.getWriter();

  generator.contentHint = 'motion';

  const width = cfg.width;
  const height = cfg.height;
  const fps = cfg.fps || 30;

  if (width % 2 || height % 2) {
    throw new Error(`I420 requires even dimensions, got ${width}x${height}`);
  }

  const ySize = width * height;
  const uvWidth = width >> 1;
  const uvSize = uvWidth * (height >> 1);
  const frameSize = ySize + uvSize + uvSize;

  let pending = new Uint8Array(0);
  let latestFrame = null;
  let writing = false;
  let frameIndex = 0;
  let droppedFrames = 0;
  let badSizedMessages = 0;
  let lastTimestamp = 0;

  async function writeLatestFrame(frameBytes) {
    const nowUs = Math.round(performance.now() * 1000);
    const timestamp = Math.max(nowUs, lastTimestamp + 1000);
    lastTimestamp = timestamp;

    const frame = new VideoFrame(frameBytes, {
      format: 'I420',
      codedWidth: width,
      codedHeight: height,
      displayWidth: width,
      displayHeight: height,
      timestamp,
      layout: [
        { offset: 0, stride: width },
        { offset: ySize, stride: uvWidth },
        { offset: ySize + uvSize, stride: uvWidth }
      ]
    });

    // If WebRTC/encoder is backed up, drop immediately.
    if (typeof writer.desiredSize === 'number' && writer.desiredSize <= 0) {
      frame.close();
      droppedFrames++;
      return;
    }

    await writer.write(frame);
    frame.close();

    frameIndex++;

    if (frameIndex === 1 || frameIndex % Math.max(1, fps * 5) === 0) {
      log('Raw I420 video frame pushed:', {
        frameIndex,
        droppedFrames,
        badSizedMessages,
        desiredSize: writer.desiredSize
      });
    }
  }

  async function drainLatest() {
    if (writing) return;
    writing = true;

    try {
      while (latestFrame) {
        const frame = latestFrame;
        latestFrame = null;
        await writeLatestFrame(frame);
      }
    } finally {
      writing = false;
    }
  }

  function acceptBytes(bytes) {
    if (bytes.byteLength === frameSize) {
      latestFrame = new Uint8Array(bytes);
      drainLatest().catch(err => log('Video drain warning:', err.message || err));
      return;
    }

    // Fallback boundary recovery if any transport chunk arrives split/merged.
    badSizedMessages++;

    const combined = new Uint8Array(pending.byteLength + bytes.byteLength);
    combined.set(pending, 0);
    combined.set(bytes, pending.byteLength);

    const fullFrames = Math.floor(combined.byteLength / frameSize);

    if (fullFrames > 0) {
      const newestStart = (fullFrames - 1) * frameSize;
      latestFrame = combined.slice(newestStart, newestStart + frameSize);

      if (fullFrames > 1) droppedFrames += fullFrames - 1;

      pending = combined.slice(fullFrames * frameSize);

      drainLatest().catch(err => log('Video drain warning:', err.message || err));
    } else {
      pending = combined;
    }

    if (pending.byteLength > frameSize) {
      pending = pending.slice(pending.byteLength % frameSize);
    }
  }

  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${proto}//${location.host}/video-ws?ts=${Date.now()}`);
  ws.binaryType = 'arraybuffer';

  ws.onopen = () => {
    log('Raw I420 video WS connected', { width, height, fps, frameSize });
  };

  ws.onmessage = event => {
    acceptBytes(new Uint8Array(event.data));
  };

  ws.onerror = event => {
    log('Raw I420 video WS error:', event.message || 'websocket error');
  };

  ws.onclose = event => {
    log('Raw I420 video WS closed:', event.code, event.reason || '');
  };

  log('Video track generator ready:', generator.label, generator.readyState);
  return generator;
}
class RobotStreamerPublisher {
  constructor(cfg) {
    this.cfg = cfg;
    this.peerId = `p:${randomId(6)}`;
    this.peer = null;
    this.device = null;
    this.sendTransport = null;
  }

  async connect() {
    const sfuUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/rs-protoo`;

    log('Connecting local protoo proxy:', sfuUrl);

    const wsTransport = new protooClient.WebSocketTransport(sfuUrl);
    this.peer = new protooClient.Peer(wsTransport);

    this.peer.on('failed', err => log('Peer failed:', err?.message || err));
    this.peer.on('disconnected', () => log('Peer disconnected'));
    this.peer.on('close', () => log('Peer closed'));
    this.peer.on('notification', n => log('SFU notification:', n.method));

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timed out waiting for protoo open')), 15000);

      this.peer.on('open', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.peer.on('failed', reject);
    });

    log('SFU WebSocket open');

    this.device = new Device();

    const routerRtpCapabilities = await this.peer.request('getRouterRtpCapabilities');
    await this.device.load({ routerRtpCapabilities });

    log('mediasoup device loaded');

    const transportInfo = await this.peer.request('createWebRtcTransport', {
      producing: true,
      consuming: false,
      streamkey: this.cfg.streamKey
    });

    this.sendTransport = this.device.createSendTransport(transportInfo);

    this.sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      log('sendTransport connect');

      this.peer.request('connectWebRtcTransport', {
        transportId: this.sendTransport.id,
        dtlsParameters
      }).then(callback).catch(errback);
    });

    this.sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
      try {
        log('sendTransport produce:', kind);

        const { id } = await this.peer.request('produce', {
          transportId: this.sendTransport.id,
          kind,
          rtpParameters,
          appData
        });

        callback({ id });
      } catch (err) {
        log('produce failed:', err.message || err);
        errback(err);
      }
    });

    await this.peer.request('join', {
      device: this.device,
      rtpCapabilities: this.device.rtpCapabilities,
      token: this.cfg.joinToken
    });

    log('Joined RobotStreamer room as producer');
  }

  async publish(stream) {
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    if (!videoTrack) throw new Error('Stream has no video track');

    log('Publishing video track:', videoTrack.label, videoTrack.readyState);

    await this.sendTransport.produce({
      track: videoTrack,
      encodings: [
        {
          maxBitrate: this.cfg.videoKbps * 1000,
          maxFramerate: this.cfg.fps,
          scaleResolutionDownBy: 1
        }
      ],
      codecOptions: {
        videoGoogleStartBitrate: this.cfg.videoKbps,
        videoGoogleMaxBitrate: this.cfg.videoKbps,
        videoGoogleMinBitrate: this.cfg.minVideoKbps
      },
      appData: {
        source: 'raw-i420-track-generator',
        lowLatency: true
      }
    });

    if (audioTrack) {
      log('Publishing audio track:', audioTrack.label, audioTrack.readyState);

      await this.sendTransport.produce({
        track: audioTrack,
        codecOptions: {
          opusStereo: true,
          opusDtx: false,
          opusFec: false,
          opusMaxPlaybackRate: 48000
        },
        appData: {
          source: 'pcm-audioworklet',
          lowLatency: true
        }
      });
    }

    log('LIVE: browser feed is publishing to RobotStreamer');
  }
}

async function main() {
  const cfg = await fetch('/config.json').then(r => {
    if (!r.ok) throw new Error(`config HTTP ${r.status}`);
    return r.json();
  });

  document.getElementById('target').textContent = cfg.targetUrl;
  document.getElementById('robot').textContent = cfg.robotId;

  const videoTrack = makeVideoTrackFromI420(cfg);
  const audioTrack = await createLowLatencyPcmAudioTrack();
  const stream = new MediaStream([videoTrack, audioTrack]);

  log('Generated MediaStream ready:', {
    video: stream.getVideoTracks().map(t => `${t.label}:${t.readyState}`),
    audio: stream.getAudioTracks().map(t => `${t.label}:${t.readyState}`)
  });

  const publisher = new RobotStreamerPublisher(cfg);

  await publisher.connect();
  await publisher.publish(stream);
}

main().catch(err => {
  console.error(err);
  log('FATAL:', err.stack || err.message || err);
});
JS

cat > "$WORK_DIR/public/index.html" <<'HTML'
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>RobotStreamer Raw I420 Publisher</title>
  <style>
    body {
      background: #111;
      color: #eee;
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 16px;
    }

    pre {
      background: #000;
      color: #9f9;
      padding: 12px;
      height: 520px;
      overflow: auto;
      white-space: pre-wrap;
      border: 1px solid #333;
    }
  </style>
</head>
<body>
  <h2>RobotStreamer Raw I420 Publisher</h2>
  <div>Target: <span id="target"></span></div>
  <div>Robot: <span id="robot"></span></div>
  <p>X11 → raw I420 frames → MediaStreamTrackGenerator → WebRTC publish.</p>
  <pre id="log"></pre>
  <script src="/client.bundle.js"></script>
</body>
</html>
HTML

current_hash="$(
  cat "$WORK_DIR/package.json" "$WORK_DIR/src/client.js" "$WORK_DIR/server.js" "$WORK_DIR/public/audio-worklet.js" "$WORK_DIR/public/index.html" | sha256sum | awk '{print $1}'
)"

cached_hash="$(cat "$WORK_DIR/.build-hash" 2>/dev/null || true)"

if [[ ! -d "$WORK_DIR/node_modules" || "$current_hash" != "$cached_hash" ]]; then
  echo "Installing/building local publisher dependencies..."
  cd "$WORK_DIR"
  npm install --silent
  npm run build --silent
  echo "$current_hash" > "$WORK_DIR/.build-hash"
else
  echo "Reusing cached publisher dependencies/build"
fi

if [[ "$USE_EXISTING_TARGET_DISPLAY" == "1" ]]; then
  echo "Using existing target display: $TARGET_DISPLAY"
  configure_existing_display_resolution
else
  echo "Starting Xvfb target display $TARGET_DISPLAY"
  echo "WARNING: Xvfb is software-rendered. For real 720p60 browser games, use DISPLAY=:0 with a 1280x720 HDMI/dummy display."
  Xvfb "$TARGET_DISPLAY" -screen 0 "${WIDTH}x${HEIGHT}x24" -ac +extension RANDR +extension GLX +render -nolisten tcp &
  XVFB_TARGET_PID=$!
fi

echo "Starting publisher Xvfb display $PUBLISH_DISPLAY"
Xvfb "$PUBLISH_DISPLAY" -screen 0 "1280x720x24" -ac +extension RANDR -nolisten tcp &
XVFB_PUBLISH_PID=$!

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
  --no-sandbox \
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
  --disable-features=TranslateUI,MediaRouter,OptimizationHints,AutofillServerCommunication,CalculateNativeWinOcclusion,OnDeviceModel,SegmentationPlatform \
  --metrics-recording-only \
  --autoplay-policy=no-user-gesture-required \
  --disable-background-timer-throttling \
  --disable-renderer-backgrounding \
  --disable-backgrounding-occluded-windows \
  --window-size="${WIDTH},${HEIGHT}" \
  --window-position=0,0 \
  --user-data-dir="$TARGET_PROFILE_DIR" \
  --kiosk \
  "$TARGET_URL" \
  >"$WORK_DIR/target-chromium.log" 2>&1 &
TARGET_CHROME_PID=$!
renice_pid "$TARGET_CHROME_PID" "target Chromium"

sleep 2
assert_alive "$TARGET_CHROME_PID" "target Chromium"

echo "Starting local publisher server..."
cd "$WORK_DIR"
RS_TOKEN="$RS_TOKEN" \
STREAM_KEY="$STREAM_KEY" \
PUBLISH_SECRET="$PUBLISH_SECRET" \
ROBOT_ID="$ROBOT_ID" \
TARGET_URL="$TARGET_URL" \
WIDTH="$WIDTH" \
HEIGHT="$HEIGHT" \
FPS="$FPS" \
VIDEO_KBPS="$VIDEO_KBPS" \
MIN_VIDEO_KBPS="$MIN_VIDEO_KBPS" \
LOCAL_PORT="$LOCAL_PORT" \
npm run server 2>&1 | tee "$WORK_DIR/server.log" &
SERVER_PID=$!
renice_pid "$SERVER_PID" "Node publisher server"

wait_for_http "http://127.0.0.1:${LOCAL_PORT}/status" "local publisher server" 60

echo "Starting ffmpeg raw I420 video capture -> HTTP ingest..."
ffmpeg \
  -y \
  -hide_banner \
  -loglevel warning \
  -nostdin \
  -fflags +genpts+nobuffer \
  -avioflags direct \
  -use_wallclock_as_timestamps 1 \
  -flags low_delay \
  -probesize 32 \
  -analyzeduration 0 \
  -thread_queue_size 32 \
  -f x11grab \
  -draw_mouse 0 \
  -video_size "${WIDTH}x${HEIGHT}" \
  -framerate "$FPS" \
  -i "${TARGET_DISPLAY}.0" \
  -vf "fps=${FPS},format=yuv420p" \
  -fps_mode cfr \
  -r "$FPS" \
  -pix_fmt yuv420p \
  -f rawvideo \
  -flush_packets 1 \
  -method POST \
  -content_type "application/octet-stream" \
  "http://127.0.0.1:${LOCAL_PORT}/ingest-video.i420" &
FFMPEG_VIDEO_PID=$!
renice_pid "$FFMPEG_VIDEO_PID" "ffmpeg raw I420 video"

sleep 1
assert_alive "$FFMPEG_VIDEO_PID" "ffmpeg raw I420 video"

echo "Starting ffmpeg audio capture -> raw PCM HTTP ingest..."
ffmpeg \
  -y \
  -hide_banner \
  -loglevel warning \
  -nostdin \
  -fflags nobuffer \
  -flags low_delay \
  -thread_queue_size 128 \
  -f pulse \
  -i "${AUDIO_SINK_NAME}.monitor" \
  -vn \
  -af "aresample=async=1:first_pts=0:min_hard_comp=0.100" \
  -ac 2 \
  -ar 48000 \
  -f f32le \
  -flush_packets 1 \
  -method POST \
  -content_type "application/octet-stream" \
  "http://127.0.0.1:${LOCAL_PORT}/ingest-audio.pcm" &
FFMPEG_AUDIO_PID=$!
renice_pid "$FFMPEG_AUDIO_PID" "ffmpeg PCM audio"

sleep 1
assert_alive "$FFMPEG_AUDIO_PID" "ffmpeg PCM audio"

echo "Starting publisher browser..."
env -u CHROMIUM_FLAGS -u CHROMIUM_USER_FLAGS -u CHROME_USER_DATA_DIR -u CHROMIUM_USER_DATA_DIR \
DISPLAY="$PUBLISH_DISPLAY" \
HOME="$PUBLISHER_HOME_DIR" \
XDG_CONFIG_HOME="$PUBLISHER_HOME_DIR/.config" \
XDG_CACHE_HOME="$PUBLISHER_HOME_DIR/.cache" \
XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" \
PULSE_SERVER="$PULSE_SERVER" \
PULSE_SINK="$PUBLISHER_SINK_NAME" \
"$CHROMIUM_BIN" \
  --enable-logging=stderr \
  --no-sandbox \
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
  --ignore-gpu-blocklist \
  --enable-gpu-rasterization \
  --enable-zero-copy \
  --enable-blink-features=WebCodecs,MediaStreamTrackInsertableStreams \
  --disable-background-timer-throttling \
  --disable-renderer-backgrounding \
  --disable-backgrounding-occluded-windows \
  --disable-features=TranslateUI,MediaRouter,OptimizationHints,AutofillServerCommunication,CalculateNativeWinOcclusion,OnDeviceModel,SegmentationPlatform \
  --window-size=1280,720 \
  --window-position=0,0 \
  --user-data-dir="$PUBLISHER_PROFILE_DIR" \
  "http://127.0.0.1:${LOCAL_PORT}/" \
  >"$WORK_DIR/publisher-chromium.log" 2>&1 &
PUBLISH_CHROME_PID=$!
renice_pid "$PUBLISH_CHROME_PID" "publisher Chromium"

sleep 2
assert_alive "$PUBLISH_CHROME_PID" "publisher Chromium"

echo
echo "Running."
echo "Target display:       $TARGET_DISPLAY"
echo "Publisher display:    $PUBLISH_DISPLAY"
echo "Raw video feed:       I420 ${WIDTH}x${HEIGHT}@${FPS}"
echo "Local status:         http://127.0.0.1:${LOCAL_PORT}/status"
echo "RobotStreamer page:   https://robotstreamer.com/robot/${ROBOT_ID}"
echo
echo "Expected:"
echo "  [video] ffmpeg raw I420 ingest connected"
echo "  [video] raw I420 WS client connected"
echo "  Raw I420 video WS connected"
echo "  Raw I420 video frame pushed"
echo "  PCM audio stream connected"
echo "  [proxy] browser connected"
echo "  [proxy] upstream open"
echo "  LIVE: browser feed is publishing to RobotStreamer"
echo
echo "Press Ctrl+C to stop."

wait "$PUBLISH_CHROME_PID"
