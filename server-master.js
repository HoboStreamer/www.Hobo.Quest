const { spawn, fork } = require('node:child_process');
const path = require('path');

const express = require('express');
const app = express();

let httpServer = require('http').createServer(app);

let compilerFork = false,
	compilerReady = false;

function createCompiler() {
	compilerFork = fork(path.join(__dirname, '/compiler.js'));
	
	compilerFork.on('close', (code) => {
		console.log('Compiler child process closed [CODE:' + (code || '?') + ']');
		
		if (code !== 0) {
			setTimeout(createCompiler, 10);
		}
	});
	
	compilerFork.on('message', (msg) => {
		if (msg === 'Compiled') {
			if (compilerReady) {
				console.log('Restarting instances due to codebase being recompiled...');
				for (var i=0; i < gameServers.length; i++) {
					gameServers[i].DontReopen = true;
					try {
						gameServers[i].close();
					} catch(e) { }
				}
				
				let instanceKeys = Object.keys(gameServerInstances);
				for (var i=0; i < instanceKeys.length; i++) {
					try {
						gameServerInstances[instanceKeys[i]].kill('SIGTERM');
					} catch(e) { console.log(e); }
				}
			} else {
				console.log('Received compiled message from compiler, but compiler is not ready. Ignoring...');
			}
		} else if (msg === 'Ready') {
			console.log('Compiler is ready');
			compilerReady = true;
			for (var i=0; i < gameServerInstanceIDs.length; i++) {
				createInstance(gameServerInstanceIDs[i]);
			}
		}
	});
}



let gameServers = {},
	gameServerInstances = {},
	gameServerInstanceIDs = [	
		// The starting map for 2D World players.
		// PVP enabled. Player building enabled.
		undefined,
		// Central city map with vendors and activities.
		// PVP disabled. Player building disabled.
		1,
		// Farm island map for farming and resource gathering.
		// PVP enabled. Player building disabled.
		2,
		// Ship minigame. Currently unfun and needs a rework.
		// PVP disabled. Player building disabled.
		3
	],
	inCheck = [],
	inTotal = 0;
	
function createInstance(ID) {
	console.log('Attempting to spawn game server process... (INST_' + (typeof ID !== 'undefined' ? ID : '0') + ')');
	const gameServerInstance = spawn('node', ['server.js', typeof ID !== 'undefined' ? ('instance=' + ID) : '']);

	gameServerInstance.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	gameServerInstance.stderr.on('data', (data) => {
		console.error(data.toString());
	});

	gameServerInstance.on('close', (code) => {
		console.warn('Game server child process closed [CODE:' + (code || '?') + '] (INST_' + (typeof ID !== 'undefined' ? ID : '0') + ')');
		
		//if (code !== 0) {
			setTimeout(function() {
				createInstance(ID);
			}, 10);
		//}
	});
	
	gameServerInstances[ID] = gameServerInstance;
	
	if (typeof gameServers[ID] === 'object' && typeof gameServers[ID].close === 'function') {
		try {
			gameServers[ID].close();
		} catch(e) { }
	}
	
	let gameServerWS = connectServer(ID);
	gameServers[ID] = gameServerWS;
}

const WebSocket = require('isomorphic-ws');
let lastConnectLog = {};

function connectServer(ID) {
	if (typeof lastConnectLog[ID] === 'undefined') {
		lastConnectLog[ID] = 0;
	}
	
	if (Date.now() - lastConnectLog[ID] > 3000) {
		lastConnectLog[ID] = Date.now();
		console.log('Attempting connection to game server WS (INST_' + (typeof ID !== 'undefined' ? ID : '0') + ')');
	}
	
 	/*
	let gameServerWS = new WebSocket(process.platform !== 'win32' ? ('ws+unix:' + __dirname + '/server' + (typeof ID !== 'undefined' ? ID : '') + '.sock') : ('ws://localhost:' + (9000+(typeof ID !== 'undefined' ? ID : 0))), 'echo-protocol'),
		didOpen = false;
	*/
	let gameServerWS = new WebSocket(('ws://10.0.0.100:' + (9000+(typeof ID !== 'undefined' ? ID : 0))), 'echo-protocol'),
		didOpen = false;
		
	gameServerWS.onopen = function(e) {
		console.log('Connected to game server WS (INST_' + (typeof ID !== 'undefined' ? ID : '0') + ')');
		gameServerWS.send(JSON.stringify({is_master: '1337Password'}));
		didOpen = true;
	};

	gameServerWS.onerror = function(e) {

	};

	gameServerWS.ID = (ID ? ID : 0);

	gameServerWS.onclose = function(e) {
		if (this.DontReopen) {
			return;
		}
		
		if (didOpen) {
			console.log('Connection to game server WS closed (INST_' + (typeof ID !== 'undefined' ? ID : '0') + ')');
		}
		setTimeout(function() {
			gameServers[ID] = connectServer(ID);
		}, 50);
	};

	function safeSend(ws, data) {
  if (!ws) return false;
  if (ws.readyState === WebSocket.OPEN) {
    try { ws.send(data); return true; } catch (_) { /* ignore */ }
  }
  return false;
}

// Optional: queue messages to a CONNECTING socket and flush on open
function makeQueuedSender(ws) {
  const queue = [];
  const send = (data) => {
    if (!safeSend(ws, data)) queue.push(data);
  };
  ws.on('open', () => {
    while (queue.length) safeSend(ws, queue.shift());
  });
  return send;
}

	gameServerWS.onmessage = function(e) {
		//console.log(e);

		let info = false;
		try {
			info = JSON.parse(e.data);
		} catch(e) { info = false; }

		if (info.type === 'Instance') {
			Object.keys(gameServers).forEach(function(srvKey) {
				safeSend(gameServers[srvKey], e.data);
			});
		} else if (info.type === 'InstanceCheck') {
			console.log('checking');
			console.log(info);

			inTotal += 1;
			
			inCheck.push({
				count: gameServerInstanceIDs.length,
				cur: [],
				result: false,
				checkIndex: inTotal,
				from: this.ID
			});

			info.checkIndex = inTotal;
			info.from = this.ID;
			
			let sendJSON = JSON.stringify(info);

			Object.keys(gameServers).forEach(function(srvKey) {
				if (gameServers[srvKey].ID !== this.ID) {
					safeSend(gameServers[srvKey], sendJSON);
				}
			});

			setTimeout(function() {
				for (var i=0; i < inCheck.length; i++) {
					if (inCheck[i].checkIndex === info.checkIndex) {
						inCheck.splice(i, 1);
						break;
					}
				}
			}, 5000);
		} else if (info.type === 'InstanceResult') {
			console.log('instance result')
			console.log(info);
			
			for (var i=0; i < inCheck.length; i++) {
				//console.log(info.checkIndex + ' ' + inCheck[i].checkIndex)
				if (inCheck[i].checkIndex === info.checkIndex) {
					//console.log('found index')
					if (inCheck[i].cur.indexOf(info.result_from) === -1) {
						inCheck[i].cur.push(info.result_from);
					}

					if (info.result !== false) {
						inCheck[i].result = info.result;
					}

					console.log(inCheck[i])

					if (inCheck[i].cur.length >= inCheck[i].count) {
						console.log('trying to send info to instance ' + inCheck[i].from)
						info.result = inCheck[i].result;
						console.log(info.result);

						if (typeof info.from !== 'undefined') {
							Object.keys(gameServers).every(function(srvKey) {
								if (gameServers[srvKey].ID === inCheck[i].from) {
									try {
										safeSend(gameServers[srvKey], JSON.stringify(info));
									} catch(e) { }
									
									return false;
								}
								return true;
							});
						}

						inCheck.splice(i, 1);
					}

					break;
				}
			}
		} else if (info.type === 'StateCheck') {
			//console.log('checking state');
			//console.log(info);

			info.from = this.ID;
			
			let sendJSON = JSON.stringify(info);

			Object.keys(gameServers).forEach(function(srvKey) {
				if (gameServers[srvKey].ID !== this.ID) {
					safeSend(gameServers[srvKey], sendJSON);
				}
				
				return true;
			});
		} else if (info.type === 'StateResult') {
			//console.log('sending state');
			//console.log(info);

			Object.keys(gameServers).every(function(srvKey) {
				if (gameServers[srvKey].ID === info.from) {
					try {
						safeSend(gameServers[srvKey], e.data);
					} catch(e) { }
					
					return false;
				}
				
				return true;
			});
		} else if (info.type === 'AuthToken') {
			Object.keys(gameServers).forEach(function(srvKey) {
				safeSend(gameServers[srvKey], e.data);
			});
		}
	};

	return gameServerWS;
}

app.use(function(req, res, next) {
	let urlLow = req.url.toLowerCase().trim();
	if (urlLow === '/city' || urlLow === '/farmisland' || urlLow === '/ship') {
		req.url = '/index.html';
	}
	next();
 });
 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Start listening for requests
var server = httpServer.listen(8000, '10.0.0.100', function () {  
	var host = server.address().address  
	var port = server.address().port  
	console.log("Express HTTP server listening at http://%s:%s", host, port)
});


app.get('/findPlayer/:id', function(req, res) {  
	res.end(req.params.id);  
});

createCompiler();

/*
if (process.platform === 'win32') {

	let proxyList = {};
	function wsInstanceProxy(url, port) {
		console.log('Opening connection to http://localhost:' + port + '/ for reverse proxy URL: ' + url);
		let proxyWS = httpProxy.createProxyServer({ target: 'http://localhost:' + port + '/', ws: true }),
			isRestarting = false;
		
		proxyWS.on('error', (e) => {
			console.log('Proxy error to http://localhost:' + port + '/ for reverse proxy URL: ' + url);
			console.log(e);
			
		});

		proxyWS.on('open', (socket) => {
			console.log('Opened connection to http://localhost:' + port + '/ for reverse proxy URL: ' + url);
		});

		proxyWS.on('close', (res, sock, head) => {
			console.log('Connection to http://localhost:' + port + '/ closed for reverse proxy URL: ' + url);
			
		});

		if (typeof proxyList[url] === 'object' && typeof proxyList[url].close === 'function') {
			try {
				proxyList[url].close();
			} catch(e) { }
		}

		proxyList[url] = proxyWS;
		proxyList['/game-server' + url] = proxyWS;

	}

	wsInstanceProxy('/city', 9011);
	wsInstanceProxy('/farmisland', 9002);
	wsInstanceProxy('/ship', 9003);
	wsInstanceProxy('/', 9000);

	// Proxy GET requests
	app.get('/game-server/:instance', function(req, res) {
		req.params.instance = req.params.instance.toLowerCase().trim();
		if (typeof proxyList['/' + req.params.instance] !== 'undefined') {
			console.log("proxying GET request", req.url);
			proxyList['/' + req.params.instance].web(req, res, {});
			//res.end(req.params.instance);  
		}
	});
		
	// Proxy websockets
	server.on('upgrade', function (req, socket, head) {
		console.log('proxying upgrade request', req.url);
		if (proxyList[req.url]) {
			proxyList[req.url].ws(req, socket, head);
		}
	});
}
*/
