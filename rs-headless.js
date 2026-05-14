#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const puppeteer = require('puppeteer');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

const argv = {
  url: args.url,
  robotId: args['robot-id'],
  token: args.token || process.env.RS_TOKEN || '',
  selector: args.selector || '#game',
  viewportWidth: Number(args['viewport-width'] || 1920),
  viewportHeight: Number(args['viewport-height'] || 1080),
  duration: Number(args.duration || 0),
  headless: args.headless !== 'false',
};

if (!argv.url || !argv.robotId) {
  console.error('Usage: node rs-headless.js --url <pageUrl> --robot-id <robotId> [--token <RS_TOKEN>]');
  process.exit(1);
}

if (!argv.token) {
  console.error('ERROR: RobotStreamer token is required via --token or RS_TOKEN in .env');
  process.exit(1);
}

const publishScript = `
(async function startHeadlessRobotStreamer(params) {
  const canvas = document.querySelector(params.selector);
  if (!canvas) {
    throw new Error('Capture selector not found: ' + params.selector);
  }

  if (typeof canvas.captureStream !== 'function') {
    throw new Error('captureStream() is not supported on this canvas element');
  }

  const captureStream = canvas.captureStream(30);
  if (!captureStream || captureStream.getVideoTracks().length === 0) {
    throw new Error('Canvas captureStream returned no video tracks');
  }

  const pageLoadUrl = 'https://api.robotstreamer.com/v1/robot_page_load';
  const response = await fetch(pageLoadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://robotstreamer.com',
      Referer: 'https://robotstreamer.com/',
    },
    body: JSON.stringify({ token: params.token, robot_id: params.robotId, referrer: 'https://robotstreamer.com/' }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error('robot_page_load failed: ' + response.status + ' ' + response.statusText + ' ' + body);
  }

  const pageData = await response.json();
  if (!pageData?.rtc_sfu?.host || !pageData?.rtc_sfu?.port) {
    throw new Error('robot_page_load response did not contain rtc_sfu endpoint');
  }

  const rtc = pageData.rtc_sfu;
  const peerId = 'headless-' + Math.random().toString(16).slice(2, 12);
  const rtcUrl = new URL('wss://' + rtc.host + ':' + rtc.port + '/');
  rtcUrl.searchParams.set('roomId', params.robotId);
  rtcUrl.searchParams.set('peerId', peerId);

  const protooModule = await import('https://esm.sh/protoo-client@10.1.5');
  const mediasoupModule = await import('https://esm.sh/mediasoup-client@3.18.7');
  const Peer = protooModule.Peer || protooModule.default?.Peer;
  const WebSocketTransport = protooModule.WebSocketTransport || protooModule.default?.WebSocketTransport;
  const Device = mediasoupModule.Device || mediasoupModule.default;

  if (!Peer || !WebSocketTransport || !Device) {
    throw new Error('Failed to load mediasoup/protoo modules from CDN');
  }

  const wsTransport = new WebSocketTransport(rtcUrl.toString(), {
    headers: {
      Origin: 'https://robotstreamer.com',
      'User-Agent': navigator.userAgent,
    },
    maxPayload: 512 * 1024,
  });

  const peer = new Peer(wsTransport);
  peer.on('failed', (err) => console.warn('[RS HEADLESS] peer failed', err));
  peer.on('disconnected', () => console.warn('[RS HEADLESS] peer disconnected'));
  peer.on('close', () => console.warn('[RS HEADLESS] peer closed'));

  const log = (label, details) => {
    console.log('[RS HEADLESS]', label, details || '');
  };

  const device = new Device();

  const request = async (method, data) => {
    log('request', method);
    return peer.request(method, data);
  };

  const onPeerOpen = async () => {
    log('connected to SFU');
    const routerRtpCapabilities = await request('getRouterRtpCapabilities', {});
    if (!routerRtpCapabilities) {
      throw new Error('getRouterRtpCapabilities returned nothing');
    }
    await device.load({ routerRtpCapabilities });

    const transportInfo = await request('createWebRtcTransport', { producing: true, consuming: false });
    if (!transportInfo) {
      throw new Error('createWebRtcTransport returned no transport info');
    }

    const sendTransport = device.createSendTransport(transportInfo);
    sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await request('connectWebRtcTransport', { transportId: sendTransport.id, dtlsParameters });
        callback();
      } catch (error) {
        errback(error);
      }
    });
    sendTransport.on('produce', async ({ kind, rtpParameters, appData }, callback, errback) => {
      try {
        const { id } = await request('produce', { transportId: sendTransport.id, kind, rtpParameters, appData });
        callback({ id });
      } catch (error) {
        errback(error);
      }
    });

    const joinResponse = await request('join', {
      device: {
        _handlerName: device.handlerName,
        _loaded: device.loaded,
        _canProduceByKind: {
          audio: device.canProduce('audio'),
          video: device.canProduce('video'),
        },
        _sctpCapabilities: device.sctpCapabilities || { numStreams: { OS: 1024, MIS: 1024 } },
      },
      rtpCapabilities: device.rtpCapabilities,
      token: params.token,
    });
    log('joined room', joinResponse);

    const videoTrack = captureStream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track available from capture stream');
    }

    await sendTransport.produce({ track: videoTrack, stopTracks: false });
    log('video track produced');
  };

  peer.on('open', onPeerOpen);

  peer.on('request', (req, resolve) => {
    if (req.method === 'newConsumer') {
      console.log('[RS HEADLESS] ignoring newConsumer', req.data);
    }
    resolve();
  });

  peer.on('notification', (notification) => {
    log('notification', notification.method);
  });

  return {
    success: true,
    robotId: params.robotId,
    rtcUrl: rtcUrl.toString(),
    peerId,
  };
})(window.__HEADLESS_RS_PARAMS__);
`;

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: argv.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-experimental-web-platform-features',
        '--autoplay-policy=no-user-gesture-required',
      ],
      defaultViewport: {
        width: argv.viewportWidth,
        height: argv.viewportHeight,
      },
    });

    const page = await browser.newPage();
    page.on('console', (msg) => console.log('[PAGE]', msg.text()));
    page.on('pageerror', (err) => console.error('[PAGE ERROR]', err));

    console.log('Opening page:', argv.url);
    await page.goto(argv.url, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.evaluate((params) => {
      window.__HEADLESS_RS_PARAMS__ = params;
    }, { selector: argv.selector, token: argv.token, robotId: argv.robotId });

    await page.addScriptTag({ content: publishScript });

    if (argv.duration > 0) {
      console.log('Streaming for', argv.duration, 'seconds');
      await new Promise((resolve) => setTimeout(resolve, argv.duration * 1000));
      console.log('Duration complete, closing browser');
      await browser.close();
      process.exit(0);
    }

    console.log('Headless stream started. Press Ctrl+C to stop.');
  } catch (err) {
    console.error('ERROR:', err);
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    process.exit(1);
  }
})();
