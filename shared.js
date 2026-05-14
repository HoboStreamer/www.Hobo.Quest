(function() {

    
if (typeof window === 'undefined') {
    window = {
        addEventListener: function() { }
    };
}
if (typeof location === 'undefined') {
    location = {

    }
}
if (typeof document === 'undefined') {
    document = {
        location: 'server',
        addEventListener: function() { },
        getElementById: function() { }
    };
}

let foundInstance = '';

function RandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const _G = {
    ScratchCardUse: function(ply, item_class, type, cell_count) {
		let foundWS = false;
		for (var zz = 0; zz < wsClients.length; zz++) {
			if (wsClients[zz].authUser === ply.Owner) {
				foundWS = wsClients[zz];
				break;
			}
		}

		if (!foundWS) {
			if (!ply.LastWebNotify || _G.lastTick - ply.LastWebNotify > 10000) {
				ply.LastWebNotify = _G.lastTick;
				ply.ShowNotify('➨ Hobo.Quest to use scratcher', 2000);
				sendChat('@' + ply.Owner + ' You must play the game via website at https://Hobo.Quest/ in order to use scratchers.')
			}

			ply.AddItem(item_class, 1);
			return true;
		}

        if (typeof ply.ScratchCard === 'object') {
            ply.AddItem(item_class, 1);
            return true;
        }

        if (typeof _G.ScratchGameID !== 'number') {
            _G.ScratchGameID = 0;
        }
        _G.ScratchGameID += 1;

        let response = {
            type: 'ScratchCard',
            theme: type,
            id: 'start-' + _G.ScratchGameID,
            success: true,
            balance: '500.00',
            cell_count: cell_count,
            game_state: {
                name: _G.ScratchTypes[type].name + (' 3x' + Math.ceil(cell_count / 3)),
                game_id: _G.ScratchGameID + '',
                pay_in: '1.0',
                assigned_cells: {},
                opened_cells: [],
                ended: '0'
            }
        };

        ply.ScratchCard = response;
    },
    ScratchTypes: {
        'magic_lamp': {
            name: 'Magic Lamp',
			items: ['scratch_lamp', 'scratch_lamp3'],
            odds: [{
                    reels: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 0.2,
                    /*IF_END*/
                    pays: 30,
                    description: '3x Diamond Ring'
                },
                {
                    reels: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.4,
                    /*IF_END*/
                    pays: 25,
                    description: '3x Pearl Necklace'
                },
                {
                    reels: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 3,
                    /*IF_END*/
                    pays: 15,
                    description: '3x Gold Bars'
                },
                {
                    reels: [3, 3, 3],
                    /*IF_SERVER*/
                    chance: 8,
                    /*IF_END*/
                    pays: 8,
                    description: '3x Gold Cup'
                },
                {
                    reels: [
                        [1, 1, 1],
                        [6, 6, 6]
                    ],
                    /*IF_SERVER*/
                    chance: 33,
                    /*IF_END*/
                    pays: 2,
                    description: '3x Gold Coins'
                }
            ]
        },
        'pirates': {
            name: 'Pirate Scratcher',
			items: ['scratch_pirate', 'scratch_pirate3'],
            odds: [{
                    reels: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 0.2,
                    /*IF_END*/
                    pays: 30,
                    description: '3x Gold Chest'
                },
                {
                    reels: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 0.4,
                    /*IF_END*/
                    pays: 25,
                    description: '3x Skull'
                },
                {
                    reels: [3, 3, 3],
                    /*IF_SERVER*/
                    chance: 3,
                    /*IF_END*/
                    pays: 15,
                    description: '3x Treasure Map'
                },
                {
                    reels: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 8,
                    /*IF_END*/
                    pays: 8,
                    description: '3x Swords'
                },
                {
                    reels: [
                        [5, 5, 5],
                        [6, 6, 6]
                    ],
                    /*IF_SERVER*/
                    chance: 33,
                    /*IF_END*/
                    pays: 2,
                    description: '3x Anchor/3x Compass'
                }
            ]

        },
        'mine': {
            name: 'Crystal Mine',
			items: ['scratch_mine', 'scratch_mine3'],
            odds: [{
                    reels: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 0.2,
                    /*IF_END*/
                    pays: 30,
                    description: '3x Diamond'
                },
                {
                    reels: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 0.4,
                    /*IF_END*/
                    pays: 25,
                    description: '3x Red Ruby'
                },
                {
                    reels: [3, 3, 3],
                    /*IF_SERVER*/
                    chance: 3,
                    /*IF_END*/
                    pays: 15,
                    description: '3x Purple Ruby'
                },
                {
                    reels: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 8,
                    /*IF_END*/
                    pays: 8,
                    description: '3x Yellow Ruby'
                },
                {
                    reels: [
                        [5, 5, 5],
                        [6, 6, 6]
                    ],
                    /*IF_SERVER*/
                    chance: 33,
                    /*IF_END*/
                    pays: 2,
                    description: '3x Green/Blue Ruby'
                }
            ]
        },
        'slots': {
            name: 'Slots Scratcher', 
			items: ['scratch_slots'],
            odds: [{
                    reels: [6, 6, 6],
                    /*IF_SERVER*/
                    chance: 0.2,
                    /*IF_END*/
                    pays: 30,
                    description: '3x Big Win'
                },
                {
                    reels: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.4,
                    /*IF_END*/
                    pays: 25,
                    description: '3x BAR'
                },
                {
                    reels: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 3,
                    /*IF_END*/
                    pays: 15,
                    description: '3x Sevens'
                },
                {
                    reels: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 8,
                    /*IF_END*/
                    pays: 8,
                    description: '3x Cherry'
                },
                {
                    reels: [
                        [1, 1, 1],
                        [3, 3, 3]
                    ],
                    /*IF_SERVER*/
                    chance: 33,
                    /*IF_END*/
                    pays: 2,
                    description: '3x Banana/Watermelon'
                }
            ]
        }
    },
    ScratchSessions: {},
    ScratchCards: {},
    SlotMachines: {
        1: {
            reel: 'reelSet1',
            reelCount: 6,
            maxBet: 4,
            background: 'changeable_background_1',
            odds: [{
                    reels: [6, 6, 6],
                    reels_prize: [6, 6, 6],
                    /*IF_SERVER*/
                    chance: 0.05,
                    /*IF_END*/
                    pays: 40
                },
                {
                    reels: [4, 4, 4],
                    reels_prize: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.3,
                    /*IF_END*/
                    pays: 25
                },
                {
                    reels: [2, 2, 2],
                    reels_prize: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 0.6,
                    /*IF_END*/
                    pays: 20
                },
                {
                    reels: [
                        [3, 1],
                        [5, 2],
                        [4, 6]
                    ],
                    reels_prize: ['1slash3', '5slash2', '4slash6'],
                    /*IF_SERVER*/
                    chance: 1,
                    /*IF_END*/
                    pays: 10
                },
                {
                    reels: [5, 5, 5],
                    reels_prize: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 1.4,
                    /*IF_END*/
                    pays: 8
                },
                {
                    reels: [1, 1, 1],
                    reels_prize: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 2.4,
                    /*IF_END*/
                    pays: 6
                },
                {
                    reels: [3, 3, 3],
                    reels_prize: [3, 3, 3],
                    /*IF_SERVER*/
                    chance: 3.7,
                    /*IF_END*/
                    pays: 3
                },
                {
                    reels: [
                        [5, 3, 1],
                        [5, 3, 1],
                        [5, 3, 1]
                    ],
                    reels_prize: ['1slash3slash5', '1slash3slash5', '1slash3slash5'],
                    /*IF_SERVER*/
                    chance: 20,
                    /*IF_END*/
                    pays: 2
                }
            ]
        },
        2: {
            reel: 'reelSet2',
            reelCount: 6,
            maxBet: 10,
            background: 'changeable_background_2',
            odds: [{
                    reels: [4, 4, 4],
                    reels_prize: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [5, 5, 5],
                    reels_prize: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [2, 2, 2],
                    reels_prize: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [1, 1, 1],
                    reels_prize: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [3, 3, 3],
                    reels_prize: [3, 3, 3],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [
                        [2, 3],
                        [2, 3],
                        [2, 3]
                    ],
                    reels_prize: ['2slash3', '2slash3', '2slash3'],
                    /*IF_SERVER*/
                    chance: 28,
                    /*IF_END*/
                    pays: 2
                }
            ]
        },
        3: {
            reel: 'reelSet4',
            reelCount: 6,
            maxBet: 4,
            background: 'changeable_background_1',
            odds: [{
                    reels: [6, 6, 6],
                    reels_prize: [6, 6, 6],
                    /*IF_SERVER*/
                    chance: 0.05,
                    /*IF_END*/
                    pays: 30
                },
                {
                    reels: [4, 4, 4],
                    reels_prize: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.45,
                    /*IF_END*/
                    pays: 20
                },
                {
                    reels: [5, 5, 5],
                    reels_prize: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 15
                },
                {
                    reels: [5, 1, 5],
                    reels_prize: [5, 1, 5],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 15
                },
                {
                    reels: [
                        [3, 1],
                        [5, 2],
                        [4, 6]
                    ],
                    reels_prize: ['1slash3', '5slash2', '4slash6'],
                    /*IF_SERVER*/
                    chance: 1.8,
                    /*IF_END*/
                    pays: 10
                },
                {
                    reels: [2, 2, 2],
                    reels_prize: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 2.8,
                    /*IF_END*/
                    pays: 8
                },
                {
                    reels: [1, 1, 1],
                    reels_prize: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 4,
                    /*IF_END*/
                    pays: 6
                },
                {
                    reels: [
                        [2, 4, 6],
                        [2, 4, 6],
                        [2, 4, 6]
                    ],
                    reels_prize: ['2slash4slash6', '2slash4slash6', '2slash4slash6'],
                    /*IF_SERVER*/
                    chance: 22,
                    /*IF_END*/
                    pays: 2
                }
            ]
        },
        4: {
            reel: 'reelSet3',
            reelCount: 6,
            maxBet: 5,
            background: 'changeable_background_3',
            odds: [{
                    reels: [6, 6, 6],
                    reels_prize: [6, 6, 6],
                    /*IF_SERVER*/
                    chance: 0.1,
                    /*IF_END*/
                    pays: 10
                },
                {
                    reels: [4, 4, 4],
                    reels_prize: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.4,
                    /*IF_END*/
                    pays: 8
                },
                {
                    reels: [5, 5, 5],
                    reels_prize: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 0.6,
                    /*IF_END*/
                    pays: 6
                },
                {
                    reels: [5, 1, 5],
                    reels_prize: [5, 1, 5],
                    /*IF_SERVER*/
                    chance: 1,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [2, 2, 2],
                    reels_prize: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 1,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [1, 1, 1],
                    reels_prize: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 1,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [3, 3, 3],
                    reels_prize: [3, 3, 3],
                    /*IF_SERVER*/
                    chance: 1,
                    /*IF_END*/
                    pays: 4
                },
                {
                    reels: [
                        [2, 3],
                        [2, 3],
                        [2, 3]
                    ],
                    reels_prize: ['2slash3', '2slash3', '2slash3'],
                    /*IF_SERVER*/
                    chance: 25,
                    /*IF_END*/
                    pays: 2
                }
            ]
        },
        5: {
            reel: 'reelSet4',
            reelCount: 6,
            maxBet: 3,
            background: 'changeable_background_4',
            odds: [{
                    reels: [6, 6, 6],
                    reels_prize: [6, 6, 6],
                    /*IF_SERVER*/
                    chance: 0.05,
                    /*IF_END*/
                    pays: 30
                },
                {
                    reels: [4, 4, 4],
                    reels_prize: [4, 4, 4],
                    /*IF_SERVER*/
                    chance: 0.4,
                    /*IF_END*/
                    pays: 20
                },
                {
                    reels: [5, 5, 5],
                    reels_prize: [5, 5, 5],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 15
                },
                {
                    reels: [5, 1, 5],
                    reels_prize: [5, 1, 5],
                    /*IF_SERVER*/
                    chance: 0.9,
                    /*IF_END*/
                    pays: 15
                },
                {
                    reels: [
                        [3, 1],
                        [5, 2],
                        [4, 6]
                    ],
                    reels_prize: ['1slash3', '5slash2', '4slash6'],
                    /*IF_SERVER*/
                    chance: 1.5,
                    /*IF_END*/
                    pays: 10
                },
                {
                    reels: [2, 2, 2],
                    reels_prize: [2, 2, 2],
                    /*IF_SERVER*/
                    chance: 2,
                    /*IF_END*/
                    pays: 8
                },
                {
                    reels: [1, 1, 1],
                    reels_prize: [1, 1, 1],
                    /*IF_SERVER*/
                    chance: 3,
                    /*IF_END*/
                    pays: 6
                },
                {
                    reels: [
                        [2, 4, 6],
                        [2, 4, 6],
                        [2, 4, 6]
                    ],
                    reels_prize: ['2slash4slash6', '2slash4slash6', '2slash4slash6'],
                    /*IF_SERVER*/
                    chance: 16,
                    /*IF_END*/
                    pays: 3
                }
            ]
        }
    },
    YTVolume: 0,
    YTFull: false,
    XControl: false,
    viewport: {
        x: 0,
        y: 0,
        xTo: 0,
        yTo: 0,
        zoom: 1,
        zoomTo: 1,
    },
    Auths: {},
    wep: {},
    BoundaryX: 3464,
    BoundaryY: 3005,
    BoundaryMinX: -256,
    BoundaryMinY: 0,
    CamLock: false,
    InData: {},
    InChecking: {},
    StateInfo: {},
    SERVER: false,
    CLIENT: false,
    playerData: {},
    ChatCache: [],
    MouseDown: {},
    InstanceURL: {
        0: '/',
        1: '/City',
        2: '/FarmIsland',
        3: '/Ship'
    },
    hook: {
        List: {},
        Add: function(hook, name, func) {
            // Make sure this hook type exists
            if (typeof _G.hook.List[hook] !== 'object') {
                _G.hook.List[hook] = [];
            }

            // Remove hook by this name just incase it exists
            _G.hook.Remove(hook, name);

            // Add hook with this name
            _G.hook.List[hook].push({
                name: name,
                func: func
            });
        },
        Remove: function(hook, name) {
            // Find a hook by name and remove it
            if (typeof _G.hook.List[hook] === 'object') {
                for (var i = 0; i < _G.hook.List[hook].length; i++) {
                    if (_G.hook.List[hook][i].name === name) {
                        _G.hook.List[hook].splice(i, 1);
                        return true;
                    }
                }
            }

            return false;
        },
        Call: function(hook, ...args) {
            // Call all available functions for a hook
            let shouldReturn = undefined;
            if (typeof _G.hook.List[hook] === 'object') {
                for (var i = 0; i < _G.hook.List[hook].length; i++) {
                    shouldReturn = _G.hook.List[hook][i].func(...args)
                }
            }

            return shouldReturn;
        }
    }
};

_G.SlotMachineKeys = Object.keys(_G.SlotMachines);

/* ======================================================================================================== */
/*IF_SERVER*/

const WebSocket = require('isomorphic-ws');

let wsClients = [];
let wsMaster = false;

// Parse commandline arguments for instance ID
process.argv.forEach(function(val, index, array) {
    if (val.substring(0, 9) === 'instance=') {
        foundInstance = parseInt(val.substring(9));
    }
});

const {
    spawn
} = require('child_process');
const fs = require('fs');
//const MockBrowser = require('mock-browser').mocks.MockBrowser;
//const mock = new MockBrowser();
//const document = mock.getDocument();
//const window = mock.getWindow();
const {
    Collider2D
} = require(__dirname + '/lib/c2d.js');

const WebSocketServer = WebSocket.Server;
const {
    generateSlug
} = require('random-word-slugs');

if (process.platform !== 'win32') {
    // If using Unix sockets, remove any previous server socket files
    try {
        fs.unlinkSync(__dirname + '/server' + foundInstance + '.sock')
    } catch (e) {}
}

const http = require('http');
const server = http.createServer()
const wss = new WebSocketServer({
    server: server
});

/*
if (process.platform !== 'win32') {
    // Use Unix sockets if capable
    server.listen(__dirname + '/server' + foundInstance + '.sock');

    //fs.chown(__dirname + '/server' + foundInstance + '.sock', 1000, 33, console.log);
} else {
    server.listen(9000 + foundInstance, '10.0.0.100');
}
    */

server.listen(9000 + foundInstance, '10.0.0.100');

if (typeof foundInstance === 'number') {
    _G.Instance = foundInstance;
}
console.log('HoboQuest Instance: ' + foundInstance);

//const wss = new WebSocketServer({ port: 8080, host: '127.0.0.1' });
//const wss = new WebSocketServer({ port: 8085 });

const localStorage = {
    getItem: function(key) {
        let fileData = false;
        try {
            fileData = fs.readFileSync(__dirname + '/saves/' + key + '.txt');
        } catch (e) {
            fileData = false;
        }

        return fileData;
    },
    setItem: function(key, val) {
        fs.writeFileSync(__dirname + '/saves/' + key + '.txt', val);
    }
};

wss.on('error', function(er) {
    console.log(er);
});

const sendEnts = function(ws) {
    ws.send(JSON.stringify({
        type: 'ents',
        tick: _G.lastTick,
        data: _G.ents.All
    }, function(key, val) {
        if ((key === 'Owner' || key === 'parent' || key === 'ActiveWeapon' || key === 'Target' || key === 'Hammering' || key === 'Moving' || key === 'Mover' || key === 'Holstered' || key === 'IsOpen' || key === 'container' || key === 'Driver' || key === 'Driving' || key === 'Placing' || key === 'PlacingObj') && typeof val === 'object' && typeof val.class === 'string') {
            return 'ent_id:' + _G.ents.All.indexOf(val);
        } else if (key === 'colliding') {
            let colliding = [];
            for (var i = 0; i < val.length; i++) {
                colliding.push('ent_id:' + _G.ents.All.indexOf(val[i]))
            }
            return colliding;
        } else if (key === 'type' && val === 'drawImage') {
            return 'drawImg';
        } else if (key === '_idlePrev' || key === '_idleNext' || key === 'Timeout') {
            return null;
        }

        return val;
    }));

    if (_G.YTVideo) {
        ws.send(JSON.stringify({
            type: 'YTVideo',
            pos: _G.YTPos,
            id: _G.YTVideo,
            start: _G.lastTick - _G.YTTime
        }));
    }
};

const sendPlayerData = function(ws) {
    let playerData = {},
        playerKeys = Object.keys(_G.playerData);
    for (var z = 0; z < playerKeys.length; z++) {
        playerData[playerKeys[z]] = {}

        let dataKeys = Object.keys(_G.playerData[playerKeys[z]]);
        for (var zz = 0; zz < dataKeys.length; zz++) {
            if (dataKeys[zz] !== 'ent') {
                playerData[playerKeys[z]][dataKeys[zz]] = _G.playerData[playerKeys[z]][dataKeys[zz]];
            } else if (typeof _G.playerData[playerKeys[z]][dataKeys[zz]] === 'object') {
                playerData[playerKeys[z]][dataKeys[zz]] = 'ent_id:' + _G.ents.All.indexOf(_G.playerData[playerKeys[z]][dataKeys[zz]]);
            }
        }
    }

    ws.send(JSON.stringify({
        type: 'playerData',
        data: playerData
    }));
}

let StartedAt = Date.now();

wss.on('connection', function connection(ws) {
    let sendInt = false;
    console.log('Client connected (' + (wsClients.length + 1) + ')');

    ws.ConnectedAt = _G.lastTick;

    wsClients.push(ws);

    ws.sentEnts = [];

    ws.on('open', function() {
        console.log('opened');
    });

    ws.on('error', console.error);

    // Resync time to clients every 60 seconds
    setInterval(function() {
        for (var i = 0; i < wsClients.length; i++) {
            if (typeof wsClients[i] === 'object' && typeof wsClients[i].send === 'function') {
                try {
                    wsClients[i].send(JSON.stringify({
                        type: 'startTick',
                        start: _G.startTick,
                        last: _G.lastTick
                    }));
                } catch (e) {}
            }
        }
    }, 60000);

    let lastChat = {};
    ws.on('message', function message(data) {
        let info = false;
        try {
            info = JSON.parse(data);
        } catch (e) {
            info = false;
        }


        if (typeof info === 'object' && typeof info.is_master === 'string' && info.is_master === '1337Password' && wsClients.indexOf(this) !== -1) {
            wsClients.splice(wsClients.indexOf(ws), 1);
            wsMaster = ws;
            console.log('Found master server WS client (' + (_G.Instance ? _G.Instance : 0) + ')');
        }

        if (wsMaster === ws) {
            // This websocket signal is coming from the master server

            if (info.type === 'InstanceCheck' && parseInt(info.instance) !== _G.Instance) {
                let foundPly = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === info.username) {
                        foundPly = true;
                        break;
                    }
                }


                wsMaster.send(JSON.stringify({
                    type: 'InstanceResult',
                    username: info.username,
                    result: (foundPly ? (typeof _G.Instance !== 'undefined' ? _G.Instance : 0) : false),
                    instance: info.instance,
                    checkIndex: info.checkIndex,
                    from: info.from,
                    result_from: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0)
                }));
            } else if (typeof _G.Instance === 'undefined' && info.type === 'InstanceResult') {
                if (info.result === false) {
                    _G.playerData[info.username] = {
                        input: {},
                        unpress: {},
                        mouse: {},
                        lastDir: 'L'
                    };

                    let ply = false;
                    for (var i = 0; i < _G.ents.All.length; i++) {
                        if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === info.username) {
                            ply = _G.ents.All[i];
                        }
                    }

                    if (!ply) {
                        ply = _G.ents.Create('player:' + info.username);
                    }
                    ply.Owner = info.username;
                    ply.username = info.username;

                    _G.playerData[info.username].ent = ply;
                } else if (typeof info.result !== 'undefined') {
                    let urlByInstance = _G.InstanceURL;

                    let userAuth = RandomString(64);

                    try {
                        wsMaster.send(JSON.stringify({
                            type: 'AuthToken',
                            user: info.username,
                            auth: userAuth,
                            instance: parseInt(info.result)
                        }));
                    } catch (e) {}


                    for (var zz = 0; zz < wsClients.length; zz++) {
                        if (wsClients[zz].authUser === info.username) {
                            wsClients[zz].send(JSON.stringify({
                                type: 'LocationChange',
                                url: (typeof urlByInstance[parseInt(info.result)] !== 'undefined' ? urlByInstance[parseInt(info.result)] : '/') + ('?T=' + Date.now()) + '#Auth=' + userAuth
                            }))
                        }
                    }
                }
            } else if (info.type === 'Instance') {
                if ((!_G.Instance && parseInt(info.toInstance) === 0) || (_G.Instance && parseInt(info.toInstance) === _G.Instance)) {
                    // ── Anti-duplication: if a player entity already exists on this
                    // instance (e.g. race condition during transfer), despawn it first
                    // before creating the incoming copy.
                    for (let _dupI = _G.ents.All.length - 1; _dupI >= 0; _dupI--) {
                        let _dupE = _G.ents.All[_dupI];
                        if (!_dupE.ShouldRemove && _dupE.Owner === info.user && _dupE.class === 'player') {
                            // Save their items to info.data so nothing is lost
                            if (!info.data) info.data = {};
                            if (_dupE.Inventory && !info.data.Inventory) info.data.Inventory = _dupE.Inventory;
                            if (_dupE.HealthMax && !info.data.HealthMax) info.data.HealthMax = _dupE.HealthMax;
                            if (_dupE.Health && !info.data.Health) info.data.Health = _dupE.Health;
                            _dupE.Despawn ? _dupE.Despawn() : (_dupE.ShouldRemove = true);
                        }
                    }

                    let ply = _G.ents.Create('player:' + info.user),
                        infoKeys = Object.keys(info.data);
                    for (var i = 0; i < infoKeys.length; i++) {
                        ply[infoKeys[i]] = info.data[infoKeys[i]];

                        if (infoKeys[i] === 'parts') {
                            for (var z = 0; z < ply[infoKeys[i]].length; z++) {
                                if (typeof ply[infoKeys[i]][z].img === 'string') {
                                    ply[infoKeys[i]][z].img = _G.Material(ply[infoKeys[i]][z].img);
                                }
                            }
                        }

                    }

                    _G.Auths[info.auth] = info.user;

                    ply.pos = [200, 200];

                    ply.SpawnProtect = _G.lastTick + 20000;
                    sendChat('@' + ply.Owner + ' you have godmode for 20 seconds unless you attack');

                    //_G.InData[ply.Owner] = info.data;
                    if (typeof _G.InData[ply.Owner] !== 'undefined') {
                        _G.InData[ply.Owner] = undefined;
                        delete _G.InData[ply.Owner];
                    }

                    _G.playerData[ply.Owner] = {
                        input: {},
                        unpress: {},
                        mouse: {},
                        lastDir: 'L'
                    };
                    _G.playerData[ply.Owner].ent = ply;
					
					/*
					for (var i = 0; i < wsClients.length; i++) {
						if (wsClients[i].Hidden) {
							continue;
						}
						wsClients[i].send(JSON.stringify({
							type: 'playerUpdate',
							data: playerData
						}));
					}
					*/

                    if (info.holstered) {
                        let wep = _G.ents.Create(info.holstered);
                        _G.wep.BasicPickup(wep, ply, true);
                        ply.Holster(true);
                    }
                    setTimeout(function() {
                        if (info.wep) {
                            let wep = _G.ents.Create(info.wep);
                            _G.wep.BasicPickup(wep, ply, true);
                        }
                    }, 1000)

                    if (_G.Instance === 3) {
                        if (!_G.NextWave) {
                            _G.NextWave = _G.lastTick + 22000;
                            _G.CurWave = 0;
                            setTimeout(function() {
                                _G.sendChat('The first wave will start in 20 seconds...')
                            }, 2000);

                            let dHead = _G.ents.Create('dick_head');
                            dHead.pos = [-560, -65];
                            dHead.Container.push({
                                item: 'weapon_pistol_wood',
                                am: 3
                            });
                            dHead.Container.push({
                                item: 'weapon_smg',
                                am: 3
                            });
                            dHead.Container.push({
                                item: 'sword_bronze',
                                am: 3
                            });
                            dHead.Container.push({
                                item: 'sword_iron',
                                am: 3
                            });

                            dHead.Container.push({
                                item: 'ammo_pistol',
                                am: 9999
                            });
                            dHead.Container.push({
                                item: 'ammo_smg',
                                am: 9999
                            });
                            dHead.Container.push({
                                item: 'soup_berries',
                                am: 9999
                            });
                            dHead.Container.push({
                                item: 'grenade_beancan',
                                am: 9999
                            });
                        }

                        let sword = _G.ents.Create('rock');
                        _G.wep.BasicPickup(sword, ply, true);
                        /*
                        ply.Holster(true);

                        setTimeout(function() {
                            let pistol = _G.ents.Create('weapon_pistol_wood');
                            _G.wep.BasicPickup(pistol, ply, true);
                        }, 100);
                        */

                        ply.AddItem('soup_berries', 10);
                        //ply.AddItem('ammo_pistol', 22);
                    }
                }

            } else if (info.type === 'AuthToken' && ((!_G.Instance && info.instance === 0) || _G.Instance === info.instance)) {
                _G.Auths[info.auth] = info.user;
            } else if (info.type === 'StateCheck' && ((!_G.Instance && info.instance === 0) || _G.Instance === info.instance)) {
                let foundPlys = [],
                    foundNPCs = [];
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'player') {
                        foundPlys.push(_G.ents.All[i].Owner);
                    } else if (typeof _G.npcs[_G.ents.All[i].class] === 'object') {
                        foundNPCs.push(_G.ents.All[i].class);
                    }
                }

                wsMaster.send(JSON.stringify({
                    type: 'StateResult',
                    result: {
                        players: foundPlys,
                        npcs: foundNPCs,
                        wave: (typeof _G.CurWave !== 'undefined' ? _G.CurWave : false)
                    },
                    instance: info.instance,
                    from: info.from
                }));
            } else if (info.type === 'StateResult') {
                _G.StateInfo[info.instance] = info.result;
            }

            return;
        }


        if (typeof info === 'object' && typeof info.type === 'string') {
            if (info.type === 'ping') {
                // Echo back with the client's timestamp for RTT measurement
                ws.send(JSON.stringify({type: 'pong', t: info.t || 0}));
                return;
            } else if (info.type === 'pong_ack' && typeof info.rtt === 'number' && ws.authUser) {
                // Client reports its measured RTT; store it for lag compensation
                if (typeof _G.playerData[ws.authUser] === 'object') {
                    _G.playerData[ws.authUser].ping = Math.min(Math.max(info.rtt, 0), 800);
                }
                return;
            } else if (info.type === 'input' && typeof info.command === 'string' && typeof info.key_position === 'string' && ws.authUser !== false) {
                _G.RSControl.onmessage({
                    data: JSON.stringify({
                        user: ws.authUser,
                        command: info.command,
                        key_position: info.key_position
                    })
                });
            } else if (info.type === 'Mouse' && typeof info.pos === 'object' && info.pos instanceof Array && typeof info.button === 'number' && info.button <= 5 && typeof info.key_position === 'string' && (info.key_position === 'up' || info.key_position === 'down') && ws.authUser !== false) {
                if (typeof _G.playerData[ws.authUser] === 'object') {
                    let didShoot = false;
                    if (info.button === 0 && info.key_position === 'up' && typeof _G.playerData[ws.authUser].ent === 'object' && typeof _G.playerData[ws.authUser].mouse[0] !== 'undefined' && _G.lastTick - _G.playerData[ws.authUser].mouse[0].time < 150) {
                        didShoot = true;
                    }

                    _G.playerData[ws.authUser].mouse[info.button] = {
                        pos: info.pos,
                        key_position: info.key_position,
                        time: _G.lastTick
                    }

                    _G.playerData[ws.authUser].inputLast = _G.lastTick;

                    if (typeof _G.playerData[ws.authUser].ent === 'object') {
                        _G.playerData[ws.authUser].ent.inputLast = _G.lastTick;
                    }

                    if (didShoot) {
                        let ply = _G.playerData[ws.authUser].ent;

                        if (typeof ply.ActiveWeapon !== 'undefined') {
                            if (typeof ply.ActiveWeapon.PrimaryAttack === 'function') {
                                ply.ActiveWeapon.PrimaryAttack(ply.ActiveWeapon, ply, info);
                            }
                        }
                    }
                }
                //console.log(wsClients.length);
                for (var i = 0; i < wsClients.length; i++) {
                    if (wsClients[i].Hidden) {
                        continue;
                    }

                    wsClients[i].send(JSON.stringify({
                        type: 'mouseInput',
                        user: ws.authUser,
                        data: info,
                        time: _G.lastTick,
                        index: (typeof _G.playerData[ws.authUser] !== 'undefined' && _G.playerData[ws.authUser].ent) ? _G.playerData[ws.authUser].ent.EntIndex : undefined
                    }));
                }
            } else if (info.type === 'ChatSend' && typeof info.msg === 'string' && ws.authUser !== false) {
                if (info.msg.length === 0) {
                    return;
                } else if (info.msg.length > 170 && ws.authUser !== 'goosely') {
                    info.msg = info.msg.substring(0, 170);
                } else if (typeof lastChat[ws.authUser] !== 'undefined' && _G.lastTick - lastChat[ws.authUser] < 1000) {
                    return;
                }

                lastChat[ws.authUser] = _G.lastTick;

                _G.hook.Call('OnChat', {
                    username: ws.authUser,
                    message: info.msg
                });

                _G.RSChat.send(JSON.stringify({
                    message: ws.authUser + ': ' + info.msg,
                    token: window.rsToken,
                    //owner_id: '25135',
                    robot_id: '3341',
                    gre_token: 'check-if-cached',
                    tts_price: 0,
                    sound_price: 0
                }));
                /*
                                for (var i=0; i < wsClients.length; i++) {
                                    wsClients[i].send(JSON.stringify({type: 'Chat', msg: info.msg, user: ws.authUser}));
                                }
                                */
            } else if (info.type === 'ScratchCard' && ws.authUser !== false) {
                console.log(info);
                if (typeof _G.playerData[ws.authUser] === 'object' && typeof _G.playerData[ws.authUser].ent === 'object') {
                    let response = {
                        success: false
                    };
                    if (typeof _G.playerData[ws.authUser].ent.ScratchCard === 'object' && typeof info.data === 'object' && typeof info.data.cell_num === 'number' && info.data.cell_num >= 0 && info.data.cell_num < _G.playerData[ws.authUser].ent.ScratchCard.cell_count) {

                        let scratcher = _G.playerData[ws.authUser].ent.ScratchCard;
                        let type = scratcher.theme

                        if (typeof _G.ScratchSessions[scratcher.game_state.game_id] !== 'object') {
                            _G.ScratchSessions[scratcher.game_state.game_id] = {
                                Owner: ws.authUser,
                                reels: []
                            }

                            scratcher.game_state.opened_cells = [];
                            scratcher.game_state.assigned_cells = {};

                            let randPrizes = [],
                                randChance = 0;
                            for (var scratchRows = 0; scratchRows < Math.ceil(scratcher.cell_count / 3); scratchRows++) {
                                for (var xx = 0; xx < _G.ScratchTypes[type].odds.length; xx++) {
                                    randChance = randInt(0, 1000);
                                    if (randChance <= _G.ScratchTypes[type].odds[xx].chance * 10) {
                                        randPrizes.push({
                                            prize: _G.ScratchTypes[type].odds[xx],
                                            index: x
                                        });
                                        break;
                                    }
                                }
                            }

                            _G.ScratchSessions[scratcher.game_state.game_id].reels = [];
                            if (randPrizes.length > 0) {
                                //_G.ScratchSessions[scratcher.game_state.game_id].reels = [];

                                for (var xx = 0; xx < randPrizes.length; xx++) {
                                    if (typeof randPrizes[xx].prize.reels[0] === 'object') {
                                        let randReel = randPrizes[xx].prize.reels[randInt(0, randPrizes[xx].prize.reels.length - 1)];
                                        for (var zz = 0; zz < randReel.length; zz++) {
                                            _G.ScratchSessions[scratcher.game_state.game_id].reels.push(randReel[zz]);
                                        }
                                    } else {
                                        for (var zz = 0; zz < randPrizes[xx].prize.reels.length; zz++) {
                                            _G.ScratchSessions[scratcher.game_state.game_id].reels.push(randPrizes[xx].prize.reels[zz]);
                                        }
                                    }
                                }
                            }
                            //_G.ScratchSessions[scratcher.game_state.game_id].reels = (typeof randPrize.reels === 'object' && typeof randPrize.reels[0] === 'object') ? randPrize.reels[randInt(0,randPrize.reels.length-1)] : randPrize.reels;
                            //} else {
                            for (var fillEmpty = 0; fillEmpty < scratcher.cell_count - _G.ScratchSessions[scratcher.game_state.game_id].reels.length; fillEmpty++) {

                            }
                            //let randLossReels = [];
                            while (_G.ScratchSessions[scratcher.game_state.game_id].reels.length < scratcher.cell_count) {
                                let randReels = [randInt(1, 6), randInt(1, 6), randInt(1, 6)];
                                for (var xx = 0; xx < _G.ScratchTypes[type].odds.length; xx++) {
                                    if (typeof _G.ScratchTypes[type].odds[xx].reels === 'object' && typeof _G.ScratchTypes[type].odds[xx].reels[0] === 'object') {
                                        for (var zz = 0; zz < _G.ScratchTypes[type].odds[xx].reels.length; zz++) {
                                            if (randReels[0] === _G.ScratchTypes[type].odds[xx].reels[zz][0] && randReels[1] === _G.ScratchTypes[type].odds[xx].reels[zz][1] && randReels[2] === _G.ScratchTypes[type].odds[xx].reels[zz][2]) {
                                                randReels = false;
                                                break;
                                            }
                                        }
                                    } else if (randReels[0] === _G.ScratchTypes[type].odds[xx].reels[0] && randReels[1] === _G.ScratchTypes[type].odds[xx].reels[1] && randReels[2] === _G.ScratchTypes[type].odds[xx].reels[2]) {
                                        randReels = false;
                                        break;
                                    }
                                }

                                if (randReels !== false) {
                                    for (var xx = 0; xx < randReels.length; xx++) {
                                        _G.ScratchSessions[scratcher.game_state.game_id].reels.push(randReels[xx]);
                                    }
                                }
                            }

                            //_G.ScratchSessions[scratcher.game_state.game_id].reels = randLossReels;
                            //}
                            console.log(_G.ScratchSessions[scratcher.game_state.game_id]);
                        }


                        if (scratcher.game_state.opened_cells.indexOf(info.data.cell_num + '') === -1) {
                            scratcher.game_state.opened_cells.push(info.data.cell_num + '');
                            //scratcher.game_state.assigned_cells[info.data.cell_num] = randInt(1,6);
                            scratcher.game_state.assigned_cells[info.data.cell_num] = _G.ScratchSessions[scratcher.game_state.game_id].reels[parseInt(info.data.cell_num)];
                            console.log(_G.ScratchSessions[scratcher.game_state.game_id].reels[parseInt(info.data.cell_num)]);
                        }



                        /*
                        if (scratcher.game_state.opened_cells.indexOf(info.data.cell_num + '') === -1) {
                            scratcher.game_state.opened_cells.push(info.data.cell_num + '');
                            scratcher.game_state.assigned_cells[info.data.cell_num] = randInt(1,6);
                        }
                        */

                        if (scratcher.game_state.opened_cells.length >= _G.playerData[ws.authUser].ent.ScratchCard.cell_count) {
                            /*
                            let payOut = 0;
                            
                            if (typeof scratcher.game_state.assigned_cells[0] !== 'undefined' && scratcher.game_state.assigned_cells[0] === scratcher.game_state.assigned_cells[1] && scratcher.game_state.assigned_cells[0] === scratcher.game_state.assigned_cells[2]) {
                                payOut += 1;
                            }
                            if (typeof scratcher.game_state.assigned_cells[3] !== 'undefined' && scratcher.game_state.assigned_cells[3] === scratcher.game_state.assigned_cells[4] && scratcher.game_state.assigned_cells[3] === scratcher.game_state.assigned_cells[5]) {
                                payOut += 1;
                            }
                            if (typeof scratcher.game_state.assigned_cells[6] !== 'undefined' && scratcher.game_state.assigned_cells[6] === scratcher.game_state.assigned_cells[7] && scratcher.game_state.assigned_cells[6] === scratcher.game_state.assigned_cells[8]) {
                                payOut += 1;
                            }
                            if (typeof scratcher.game_state.assigned_cells[0] !== 'undefined' && scratcher.game_state.assigned_cells[0] === scratcher.game_state.assigned_cells[3] && scratcher.game_state.assigned_cells[0] === scratcher.game_state.assigned_cells[6]) {
                                payOut += 1;
                            }
                            if (typeof scratcher.game_state.assigned_cells[1] !== 'undefined' && scratcher.game_state.assigned_cells[1] === scratcher.game_state.assigned_cells[4] && scratcher.game_state.assigned_cells[1] === scratcher.game_state.assigned_cells[7]) {
                                payOut += 1;
                            }
                            if (scratcher.game_state.assigned_cells[2] === scratcher.game_state.assigned_cells[5] && scratcher.game_state.assigned_cells[2] === scratcher.game_state.assigned_cells[8]) {
                                payOut += 1;
                            }
                            if (scratcher.game_state.assigned_cells[0] === scratcher.game_state.assigned_cells[4] && scratcher.game_state.assigned_cells[0] === scratcher.game_state.assigned_cells[8]) {
                                payOut += 1;
                            }
                            if (scratcher.game_state.assigned_cells[6] === scratcher.game_state.assigned_cells[4] && scratcher.game_state.assigned_cells[6] === scratcher.game_state.assigned_cells[2]) {
                                payOut += 1;
                            }
                            */

                            let findPayouts = [],
                                cellKeys = Object.keys(scratcher.game_state.assigned_cells);
                            for (var xx = 0; xx < _G.ScratchTypes[type].odds.length; xx++) {
                                for (var cellCount = 0; cellCount < Math.ceil(cellKeys.length / 3); cellCount++) {
                                    if (typeof _G.ScratchTypes[type].odds[xx].reels === 'object' && typeof _G.ScratchTypes[type].odds[xx].reels[0] === 'object') {
                                        for (var zz = 0; zz < _G.ScratchTypes[type].odds[xx].reels.length; zz++) {
                                            if (scratcher.game_state.assigned_cells[cellCount * 3] === _G.ScratchTypes[type].odds[xx].reels[zz][0] && scratcher.game_state.assigned_cells[cellCount * 3 + 1] === _G.ScratchTypes[type].odds[xx].reels[zz][1] && scratcher.game_state.assigned_cells[cellCount * 3 + 2] === _G.ScratchTypes[type].odds[xx].reels[zz][2]) {
                                                findPayouts.push({
                                                    am: _G.ScratchTypes[type].odds[xx].pays,
                                                    description: _G.ScratchTypes[type].odds[xx].description
                                                });
                                                break;
                                            }
                                        }
                                    } else if (scratcher.game_state.assigned_cells[cellCount * 3] === _G.ScratchTypes[type].odds[xx].reels[0] && scratcher.game_state.assigned_cells[cellCount * 3 + 1] === _G.ScratchTypes[type].odds[xx].reels[1] && scratcher.game_state.assigned_cells[cellCount * 3 + 2] === _G.ScratchTypes[type].odds[xx].reels[2]) {
                                        findPayouts.push({
                                            am: _G.ScratchTypes[type].odds[xx].pays,
                                            description: _G.ScratchTypes[type].odds[xx].description
                                        });
                                    }
                                }
                            }

                            let payOut = 0,
                                payOutStr = '';
                            for (var xx = 0; xx < findPayouts.length; xx++) {
                                payOut += findPayouts[xx].am;
                                if (typeof findPayouts[xx].description === 'string') {
                                    payOutStr += (payOutStr !== '' ? ', ' : '') + findPayouts[xx].description;
                                }
                            }

                            scratcher.game_state.ended = '1';
                            if (payOut > 0) {
                                _G.playerData[ws.authUser].ent.AddItem('chips', payOut);

                                scratcher.game_state.pay_out = payOut + '.00';
                                scratcher.game_state.prize = {
                                    prize_name: payOut + ' Chips',
                                    win_redirect_url: null
                                };
                            }


                        }

                        response = scratcher;
                        if (info.id) {
                            response.id = info.id;
                        }
                    }
                    /* else {
                                            response = {
                                                type: 'ScratchCard',
                                                id: info.id,
                                                success: true,
                                                balance: '500.00',
                                                cell_count: 9,
                                                game_state: {
                                                    game_id: '1',
                                                    pay_in: '1.0',
                                                    assigned_cells: {},
                                                    opened_cells: [],
                                                    ended: '0'
                                                }
                                            };
                                    
                                            _G.playerData[ws.authUser].ent.ScratchCard = response;
                                        }*/

                    ws.send(JSON.stringify(response));

                    if (response.game_state && response.game_state.ended && response.game_state.ended === '1') {
                        _G.playerData[ws.authUser].ent.ScratchCard = undefined;
                        delete _G.playerData[ws.authUser].ent.ScratchCard;
                    }

                }
                /*
                                for (var i=0; i < wsClients.length; i++) {
                                    wsClients[i].send(JSON.stringify({type: 'Chat', msg: info.msg, user: ws.authUser}));
                                }
                                */
            } else if (info.type === 'SlotMachine' && ws.authUser !== false && typeof info.slot_machine === 'number' && typeof _G.SlotMachines[info.slot_machine] === 'object' && typeof info.bet === 'number' && info.bet > 0) {
                info.bet = parseInt(info.bet);

                let thisMachine = _G.SlotMachines[info.slot_machine];
                console.log(info);
                if (typeof _G.playerData[ws.authUser] === 'object' && typeof _G.playerData[ws.authUser].ent === 'object' && (typeof _G.playerData[ws.authUser].ent.SlotCooldown === 'undefined' || _G.lastTick >= _G.playerData[ws.authUser].ent.SlotCooldown)) {
                    _G.playerData[ws.authUser].ent.SlotCooldown = _G.lastTick + 2500;

                    let hasChips = _G.playerData[ws.authUser].ent.HasItem('chips', 1) || 0;

                    let response = {
                        success: false
                    };

                    if (hasChips >= info.bet && info.bet <= thisMachine.maxBet) {
                        _G.playerData[ws.authUser].ent.TakeItem('chips', info.bet);
                        /*
                        if (typeof _G.playerData[ws.authUser].ent.ScratchCard === 'object' && typeof info.data === 'object' && typeof info.data.cell_num === 'number' && info.data.cell_num >= 0 && info.data.cell_num < _G.playerData[ws.authUser].ent.ScratchCard.cell_count) {
                            
                        }
                        */

                        /*
                        response = {
                            "reels": [
                                4,
                                5,
                                1
                            ],
                            "prize": null,
                            "success": true,
                            "credits": 278,
                            "dayWinnings": 39,
                            "lifetimeWinnings": 393
                        }
                        */
                        let randChance = 0,
                            randPrize = false,
                            randPrizeIndex = false;
                        /*
                    for (var i=0; i < _G.SlotMachineKeys.length; i++) {
                        for (var x=0; x < _G.SlotMachines[_G.SlotMachineKeys[i]].odds.length; x++) {
                            if (randChance <= _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].chance*10) {
                                randPrize = _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x];
                                break;
                            }
                        }
                    }
                    */
                        for (var x = 0; x < thisMachine.odds.length; x++) {
                            randChance = randInt(0, 1000);
                            if (randChance <= thisMachine.odds[x].chance * 10) {
                                randPrize = thisMachine.odds[x];
                                randPrizeIndex = x;
                                break;
                            }
                        }

                        response.success = true;
                        if (randPrize) {
                            response.prize = {
                                id: randPrizeIndex + 1,
                                payoutCredits: randPrize.pays * info.bet + '',
                                payoutWinnings: randPrize.pays * info.bet + ''
                            };

                            _G.playerData[ws.authUser].ent.AddItem('chips', randPrize.pays * info.bet);

                            response.reels = [];
                            let onlyArrays = true;
                            for (var i = 0; i < randPrize.reels.length; i++) {
                                if (typeof randPrize.reels[i] === 'object' && randPrize.reels[i] instanceof Array) {
                                    response.reels[i] = randPrize.reels[i][randInt(0, randPrize.reels[i].length - 1)];
                                } else {
                                    response.reels[i] = randPrize.reels[i];
                                    onlyArrays = false;
                                }
                            }

                            while (onlyArrays && response.reels[0] === response.reels[1] && response.reels[0] === response.reels[2]) {
                                response.reels[2] = randPrize.reels[2][randInt(0, randPrize.reels[2].length - 1)]
                            }
                        } else {
                            response.prize = null;

                            let randNonWin = false;
                            while (randNonWin === false) {
                                let foundWin = false,
                                    randWin = [randInt(1, thisMachine.reelCount), randInt(1, thisMachine.reelCount), randInt(1, thisMachine.reelCount)];

                                /*
                                for (var i=0; i < _G.SlotMachineKeys.length; i++) {
                                    for (var x=0; x < _G.SlotMachines[_G.SlotMachineKeys[i]].odds.length; x++) {
                                        if (
                                            (typeof _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[0] === 'number' && _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[0] === randWin[0])
                                            || (typeof _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[0] === 'object' && _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[0].indexOf(randWin[0]) !== -1)
                                            || (typeof _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[1] === 'number' && _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[1] === randWin[1])
                                            || (typeof _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[1] === 'object' && _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[1].indexOf(randWin[1]) !== -1)
                                            || (typeof _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[2] === 'number' && _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[2] === randWin[2])
                                            || (typeof _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[2] === 'object' && _G.SlotMachines[_G.SlotMachineKeys[i]].odds[x].reels[2].indexOf(randWin[2]) !== -1)
                                        ) {
                                            foundWin = true;
                                            break;
                                        }
                                    }
                                }
                                */
                                for (var x = 0; x < thisMachine.odds.length; x++) {
                                    if (
                                        ((typeof thisMachine.odds[x].reels[0] === 'number' && thisMachine.odds[x].reels[0] === randWin[0]) ||
                                            (typeof thisMachine.odds[x].reels[0] === 'object' && thisMachine.odds[x].reels[0].indexOf(randWin[0]) !== -1)) &&
                                        ((typeof thisMachine.odds[x].reels[1] === 'number' && thisMachine.odds[x].reels[1] === randWin[1]) ||
                                            (typeof thisMachine.odds[x].reels[1] === 'object' && thisMachine.odds[x].reels[1].indexOf(randWin[1]) !== -1)) &&
                                        ((typeof thisMachine.odds[x].reels[2] === 'number' && thisMachine.odds[x].reels[2] === randWin[2]) ||
                                            (typeof thisMachine.odds[x].reels[2] === 'object' && thisMachine.odds[x].reels[2].indexOf(randWin[2]) !== -1))
                                    ) {
                                        foundWin = true;
                                        break;
                                    }
                                }

                                if (!foundWin) {
                                    randNonWin = randWin;
                                    break;
                                }
                            }

                            response.reels = randNonWin;
                        }
                    }

                    response.credits = _G.playerData[ws.authUser].ent.HasItem('chips', 1) || 0;
                    response.dayWinnings = 69;
                    response.lifetimeWinnings = 420;

                    if (info.id) {
                        response.id = info.id;
                    }

                    response.type = 'SlotMachine';

                    ws.send(JSON.stringify(response));
                }
                /*
                                for (var i=0; i < wsClients.length; i++) {
                                    wsClients[i].send(JSON.stringify({type: 'Chat', msg: info.msg, user: ws.authUser}));
                                }
                                */
            } else if (ws.authUser !== false && info.type === 'AdminPos' && ws.authUser && ws.authUser === 'goosely' && typeof info.pos === 'object' && info.pos instanceof Array && info.pos.length === 2 && typeof info.user === 'string' && typeof _G.ents.PlayersByName[info.user] === 'object') {
                _G.ents.PlayersByName[info.user].pos = info.pos
            } else if (ws.authUser !== false && info.type === 'MouseMesh' && ws.authUser && ws.authUser === 'goosely' && typeof info.pos === 'object' && info.pos instanceof Array && info.pos.length === 2 && typeof info.w === 'number' && typeof info.h === 'number') {
                let wall = _G.ents.Create('world_wall');
                wall.pos = info.pos;
                wall.bbox = [0, 0, info.w, info.h];
                wall.parts[0].w = info.w;
                wall.parts[0].h = info.h;
                if (typeof info.rotate !== 'undefined') {
                    wall.rotate = info.rotate;
                }
            } else if (ws.authUser !== false && info.type === 'SlotMachineClose' && typeof _G.playerData[ws.authUser] === 'object' && typeof _G.playerData[ws.authUser].ent === 'object') {
                _G.playerData[ws.authUser].ent.SlotMachine = undefined;
                delete _G.playerData[ws.authUser].ent.SlotMachine;
            } else if (info.type === 'HiddenState') {
                if (info.hidden) {
                    ws.Hidden = true;
                } else {
                    ws.Hidden = undefined;
                    delete ws.Hidden;

                    ws.send(JSON.stringify({
                        type: 'startTick',
                        start: _G.startTick,
                        last: _G.lastTick
                    }));
                    sendEnts(ws);
                    sendPlayerData(ws);
                    ws.send(JSON.stringify({
                        type: 'HiddenState',
                        hidden: false
                    }))
                }
            } else if (info.type === 'BlurState') {
                if (info.blur) {
                    ws.Blur = true;

                    if (ws.authUser && typeof _G.playerData[ws.authUser] !== 'undefined') {
                        _G.playerData[ws.authUser].input = {};
                        _G.playerData[ws.authUser].unpress = {};
                        _G.playerData[ws.authUser].mouse = {};

                        for (var i = 0; i < wsClients.length; i++) {
                            if (wsClients[i].Hidden) {
                                continue;
                            }
                            wsClients[i].send(JSON.stringify({
                                type: 'ClearInput',
                                user: ws.authUser
                            }));
                        }
                    }
                } else {
                    ws.Blur = undefined;
                    delete ws.Blur;
                }
            } else if (info.type === 'PreAuth' && typeof info.auth === 'string' && typeof _G.Auths[info.auth] !== 'undefined') {
                ws.authUser = _G.Auths[info.auth];
                ws.authStr = false;
                ws.send(JSON.stringify({
                    type: 'localplayer',
                    username: ws.authUser
                }));
                console.log('Authed ' + ws.authUser);
                ws.send(JSON.stringify({
                    type: 'authed'
                }));
                delete _G.Auths[info.auth];

                _G.RSControl.onmessage({
                    data: JSON.stringify({
                        user: ws.authUser,
                        command: 'R',
                        key_position: 'up'
                    })
                });
            }
        }
    });

    ws.on('close', function() {
        clearInterval(sendInt);
        wsClients.splice(wsClients.indexOf(ws), 1);
        console.log('Client disconnected (' + wsClients.length + ')');
    });

    setTimeout(function() {
        let authStr = generateSlug(5, {
            format: 'lower'
        });
        ws.send(JSON.stringify({
            type: 'auth',
            token: authStr
        }));
        ws.authStr = authStr;
        ws.authUser = false;

        ws.send(JSON.stringify({
            type: 'startTick',
            start: _G.startTick,
            last: _G.lastTick
        }));
    }, 1);

    if (Date.now() - StartedAt < 2500) {
        setTimeout(function() {
            if (ws && typeof ws === 'object' && typeof ws.send === 'function') {
                try {
                    ws.send(JSON.stringify({
                        type: 'Refresh'
                    }));
                } catch (e) {}
            }
        }, 1000);
    }

    setTimeout(function() {
        if (typeof ws !== 'object' || !ws || wsClients.indexOf(ws) === -1) {
            return;
        }

        for (var z = 0; z < _G.ents.All.length; z++) {
            ws.sentEnts.push(_G.ents.All[z].EntIndex);
        }

        //ws.send('something');
        sendEnts(ws);

        // Send recent chat messages
        for (var z = 0; z < _G.ChatCache.length; z++) {
            ws.send(_G.ChatCache[z]);
        }
    }, 250);

    sendPlayerData(ws);
});

let sndID = 0;

function Audio(str) {
    return {
        cloneNode: function(deep, pos) {
            let audioID = sndID;
            let audioData = {
                type: 'Audio',
                file: str,
                id: audioID
            };

            if (typeof pos === 'object') {
                audioData.pos = pos;
            }

            /*
            return {
                pause: function() { },
                play: function() { },
                destroy: function() { },
                volume: 0
            }*/
            audioData.volume = 0.3;

            audioData.play = function() {
                for (var z = 0; z < wsClients.length; z++) {
                    if (wsClients[z].Hidden) {
                        continue;
                    }

                    wsClients[z].send(JSON.stringify(audioData));
                }
            };

            audioData.pause = function() {
                for (var z = 0; z < wsClients.length; z++) {
                    wsClients[z].send(JSON.stringify({
                        type: 'AudioPause',
                        id: audioID
                    }));
                }
            };

            audioData.destroy = function() {
                for (var z = 0; z < wsClients.length; z++) {
                    wsClients[z].send(JSON.stringify({
                        type: 'AudioDestroy',
                        id: audioID
                    }));
                }
            };

            sndID += 1;

            return audioData;
        },
        pause: function() {},
        play: function() {

        },
        destroy: function() {},
        volume: 0
    }
}

require('dotenv').config();
window.streamKey = process.env.STREAM_KEY || '';
window.rsToken = process.env.RS_TOKEN || '';

/*IF_END*/
/* ======================================================================================================== */

_G.IsLocal = ((localStorage.getItem('GameServerHost') && (localStorage.getItem('GameServerHost').indexOf('127.0.0.1') !== -1 || localStorage.getItem('GameServerHost').indexOf('localhost') !== -1)) ? true : false);


/*IF_CLIENT*/

window.AudioContext = (window.AudioContext || window.webkitAudioContext);
_G.AudioContext = new AudioContext();

if (document.location.toString().toLowerCase().indexOf('farmisland') !== -1) {
    foundInstance = 2;
} else if (document.location.toString().toLowerCase().indexOf('ship') !== -1) {
    foundInstance = 3;
} else if (document.location.toString().toLowerCase().indexOf('city') !== -1) {
    foundInstance = 1;
}

if (typeof foundInstance === 'number') {
    _G.Instance = foundInstance;
}

if (document.location.toString().toLowerCase().indexOf('hide_map') !== -1) {
    _G.HideMap = true;
    document.body.setAttribute('style', 'background: transparent !important');
}

/*IF_END*/

_G.MaxCoal = 0;
_G.MaxCats = 0;
_G.ZoomMin = 0.25;
_G.ZoomMax = 3;
_G.MaxRocks = 0;
_G.MaxIron = 0;

if (_G.Instance === 1) {
    _G.Instance = 1;

    _G.BoundaryX = 1200;
    _G.BoundaryY = 20;
    _G.BoundaryMinX = -750;
    _G.BoundaryMinY = -300;
    _G.MapW = 4470;
    _G.MapH = 900;

    _G.MaxRocks = 0;
    _G.MaxIron = 0;
} else if (_G.Instance === 2) {
    _G.Instance = 2;

    _G.BoundaryX = 7200;
    _G.BoundaryY = 3360;
    _G.BoundaryMinX = -620;
    _G.BoundaryMinY = -800;
    _G.MapW = 8100;
    _G.MapH = 4500;

    _G.MaxRocks = 13;
    _G.MaxIron = 6;
    _G.MaxCoal = 3;
    _G.MaxCats = 4;

    setTimeout(function() {
        _G.viewport.zoomTo = 0.284;
        _G.viewport.xTo = 3412;
        _G.viewport.yTo = 1327;
    }, 1000);
} else if (_G.Instance === 3) {
    _G.Instance = 3;

    _G.BoundaryX = 1650;
    _G.BoundaryY = 245;
    _G.BoundaryMinX = -700;
    _G.BoundaryMinY = -365;
    _G.MapW = 2800;
    _G.MapH = 1683;

    _G.MaxRocks = 0;
    _G.MaxIron = 0;
    _G.MaxCoal = 0;
    _G.MaxCats = 0;

    _G.ZoomMin = 1;

    _G.ShipPos = [
        [333, -200],
        [137, -215],
        [-159, -156],
        [-443, -195],
        [-404, 74],
        [20, -59],
        [198, 129],
        [367, 19],
        [500, -247],
        [573, 8],
        [710, 123],
        [933, 43],
        [1121, -15],
        [1076, -188],
        [1298, -85],
        [827, -226],
        [535, 69],
        [149, 12],
        [-145, -170],
        [751, -246],
        [185, -275],
        [292, 85],
        [-86, 78],
        [673, -86],
        [1219, -23],
        [1139, -200],
        [-497, -193],
        [-496, -58],
        [817, 90],
        [202, 39],
        [29, -92],
        [271, 25],
        [35, -190],
        [685, -181],
        [1318, -124],
        [870, -195],
        [-224, -242],
        [318, -140],
        [434, 81],
        [445, -81],
        [-454, -51],
        [1237, -134],
        [-508, -74]
    ];
} else {
    _G.MaxRocks = 4;
    _G.MaxIron = 2;
}


/*IF_SERVER*/
_G.IsLocal = false;
_G.SERVER = true;
/*IF_END*/

let pNow = performance.now();
_G.lastTick = pNow;
_G.lastRender = _G.lastTick; // Pretend the first draw was on first update.
_G.tickLength = 16; // This sets your simulation to run at 20Hz (50ms)
_G.startTick = _G.lastTick;

/* ======================================================================================================== */
/*IF_CLIENT*/
_G.CLIENT = true;
include('lib/c2d.js');

_G.KeyDefaults = {
    'U': 87,
    'D': 83,
    'L': 65,
    'R': 68,
    'V': 32,
    'SHIFT': 16,
    'E': 69,
    'G': 71,
    'H': 72,
    'I': 73,
    'C': 67
};

_G.KeyNames = {
    'U': 'Move Up',
    'D': 'Move Down',
    'L': 'Move Left',
    'R': 'Move Right',
    'V': 'Attack',
    'SHIFT': 'Sprint',
    'E': 'Use / Pickup',
    'G': 'Drop',
    'H': 'Holster',
    'I': 'Crafting',
    'C': 'Inventory'
};

_G.KeyNamesIndex = Object.keys(_G.KeyNames);

_G.Settings = document.getElementById('settings-menu');

let SettingsTab = function(type) {
    document.getElementById(type === 'tab-ctrl' ? 'tab-audio' : 'tab-ctrl').classList.remove('active');
    if (document.getElementById(type).className.indexOf('active') === -1) {
        document.getElementById(type).classList.add('active');
    }

    if (type === 'tab-ctrl') {
        document.getElementById('settings-inner').innerHTML = '<button type="button" id="setup-gamepad">Want to play with a controller?<br>Click here to set it up!</button>\
<div class="bind-title">Your Button Settings</div>\
<div id="bind-list"><div class="bind-outer first"><span class="bind">Action</span><span class="bind">Button</span></div></div>';

        document.getElementById('setup-gamepad').onclick = function(ev) {
            gamepadMenu();
            _G.CloseSettings();

            ev.preventDefault();
        };

        for (var i = 0; i < _G.KeyNamesIndex.length; i++) {
            let bind = document.createElement('div');
            bind.className = 'bind-outer';

            let bindName = document.createElement('span');
            bindName.className = 'bind';
            bindName.innerText = _G.KeyNames[_G.KeyNamesIndex[i]];
            bind.appendChild(bindName);

            let bindKey = document.createElement('span');
            bindKey.className = 'bind';
            let key = _G.KeyDefaults[_G.KeyNamesIndex[i]];

            let keyStr = String.fromCharCode((96 <= key && key <= 105) ? key - 48 : key);
            if (keyStr === ' ') {
                keyStr = 'Spacebar';
            } else if (key === 16) {
                keyStr = 'Shift';
            } else if (key === 17) {
                keyStr = 'Control';
            } else if (key === 91) {
                keyStr = 'Menu Key';
            } else if (key === 27) {
                keyStr = 'Escape';
            }
            bindKey.innerText = keyStr;
            bind.appendChild(bindKey);

            document.getElementById('bind-list').appendChild(bind);
        }
    } else {
        document.getElementById('settings-inner').innerHTML = '<b>Master Volume</b><br>';

    }
};

let closeSet = false;
_G.OpenSettings = function() {
    SettingsTab('tab-ctrl');

    if (closeSet) {
        clearTimeout(closeSet);
    }

    if (_G.Settings.style.display !== 'block') {
        _G.Settings.style.display = 'block'
        setTimeout(function() {
            if (_G.Settings.className.indexOf('hidden') !== -1) {
                _G.Settings.classList.remove('hidden');
            }
        }, 16);
    }
};

_G.CloseSettings = function() {
    if (closeSet) {
        try {
            clearTimeout(closeSet);
        } catch (e) {}
    }

    if (_G.Settings.className.indexOf('hidden') === -1) {
        _G.Settings.classList.add('hidden');
    }

    closeSet = setTimeout(function() {
        _G.Settings.style.display = 'none';
    }, 440);
};

_G.OpenLoadScreen = function() {
    if (_G.LoadScreen) {
        try {
            document.body.removeChild(_G.LoadScreen);
        } catch (e) {}
    }

    let loadScreen = document.createElement('div')
    loadScreen.style = 'position:fixed;z-index:9999;left:0;top:0;bottom:0;right:0;background:rgba(0,0,0,0.45);backdrop-filter: blur(10px);transition:opacity 500ms ease'
    loadScreen.innerHTML = '<span style="position:absolute;left:0;right:0;top:50%;margin-top:-160px;height:320px;font-size:60px;font-family:\'Open Sans\';font-weight:600;text-align:center;color:#fff;text-shadow:3px 3px 6px #000;transition:opacity 500ms ease"><img src="assets/img/2d-big.png"><br>Loading HoboQuest...</span>';

    _G.LoadScreen = loadScreen;

    document.body.appendChild(loadScreen);
};

_G.OpenLoadScreen();

const scrollToBottom = function(id) {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
}

document.getElementById('but-cam').onclick = function(ev) {
    if (this.className.indexOf('multiple-targets') !== -1) {
        this.className = 'game-icon game-icon-move';
        this._tippy.setContent('Cam Mode: Free Cam');
        _G.CamLock = true;
        _G.MultiTarget = false;
    } else if (this.className.indexOf('human-target') !== -1) {
        this.className = 'game-icon game-icon-multiple-targets';
        this._tippy.setContent('Cam Mode: Multiplayer');
        _G.CamLock = false;
        _G.MultiTarget = true;
    } else {
        if (_G.LocalPlayer) {
            this.className = 'game-icon game-icon-human-target';
            this._tippy.setContent('Cam Mode: Singleplayer');
            _G.MultiTarget = false;
            _G.CamLock = false;
        } else {
            this.className = 'game-icon game-icon-multiple-targets';
            this._tippy.setContent('Cam Mode: Multiplayer');
            _G.MultiTarget = false;
            _G.CamLock = false;
        }
    }

    ev.preventDefault();
}

document.getElementById('but-set').onclick = function(ev) {
    _G.OpenSettings();

    ev.preventDefault();
};

document.getElementById('settings-close').onclick = function(ev) {
    _G.CloseSettings();

    ev.preventDefault();
};

document.getElementById('tab-ctrl').onclick = function(ev) {
    SettingsTab('tab-ctrl');
    ev.preventDefault();
};
document.getElementById('tab-audio').onclick = function(ev) {
    SettingsTab('tab-audio');
    ev.preventDefault();
};

tippy(document.getElementById('but-cam'), {
    content: 'Cam Mode: Multiplayer',
    placement: 'top-end',
    animation: 'scale',
    arrow: false,
    allowHTML: false
});

tippy(document.getElementById('but-set'), {
    content: 'Settings',
    placement: 'top-end',
    animation: 'scale',
    arrow: false,
    allowHTML: false
});

_G.ChatHover = false;
_G.ChatInside = false;
_G.Chatbox = document.getElementById('chatbox');

_G.OpenChatbox = function(should_open) {
    let chatboxIn = document.getElementById('chatbox-input');

    if (!_G.ChatboxInit) {
        /*
        try {
            document.body.removeChild(_G.Chatbox);
        } catch(e) { }
        */
        let chatbox = document.getElementById('chatbox');

        chatbox.addEventListener('mouseover', function(ev) {
            _G.ChatHover = _G.lastTick;
            if (_G.ChatOut) {
                try {
                    clearTimeout(_G.ChatOut);
                    _G.ChatOut = undefined;
                } catch (e) {}
            }
        });

        chatbox.addEventListener('mouseout', function(ev) {
            _G.ChatHover = false;

            if (_G.ChatOut) {
                try {
                    clearTimeout(_G.ChatOut);
                    _G.ChatOut = undefined;
                } catch (e) {}
            }

            _G.ChatOut = setTimeout(function() {
                _G.ChatOut = undefined;
                if (_G.ChatOpen && !_G.ChatHover && !_G.ChatInside) {
                    _G.OpenChatbox(false);
                }
            }, 3000);
        });

        chatboxIn.addEventListener('focus', function(ev) {
            _G.ChatInside = _G.lastTick;

            ev.stopPropagation();
        });

        chatboxIn.addEventListener('blur', function(ev) {
            _G.ChatInside = false;


            if (_G.ChatOut) {
                try {
                    clearTimeout(_G.ChatOut);
                    _G.ChatOut = undefined;
                } catch (e) {}
            }

            _G.ChatOut = setTimeout(function() {
                _G.ChatOut = undefined;
                if (_G.ChatOpen && !_G.ChatHover && !_G.ChatInside) {
                    _G.OpenChatbox(false);
                }
            }, 3000);

            ev.stopPropagation();
        });

        _G.Chatbox = chatbox;

        _G.ChatInside = false;
        _G.ChatHover = false;

        _G.ChatboxInit = true;
    }

    if (_G.HideTimer) {
        try {
            clearTimeout(_G.HideTimer);
        } catch (e) {}
    }

    if (should_open) {
        // Open the chatbox
        _G.ChatOpen = true;

        chatbox.style.display = 'block';
        chatbox.style['pointer-events'] = 'auto';

        setTimeout(function() {
            chatbox.classList.remove('hidden');
            document.getElementById('chatbox-in').style['overflow-y'] = 'auto';
        }, 2);
    } else {
        // Close the chatbox
        _G.ChatOpen = false;
        _G.ChatInside = false;
        _G.ChatHover = false;

        chatbox.classList.add('hidden');
        document.getElementById('chatbox-input').blur();

        document.getElementById('chatbox-in').style['overflow-y'] = 'hidden';
        _G.HideTimer = setTimeout(function() {
            _G.HideTimer = undefined;
            if (!_G.ChatOpen) {
                chatbox.style.display = 'none';
            }
        }, 600);
    }

    /*
    chatbox.addEventListener('mouseover', function(ev) {
        this.classList.remove('hidden');
        document.getElementById('chatbox-in').style['overflow-y'] = 'auto';
    });

    chatbox.addEventListener('mouseout', function(ev) {
        this.classList.add('hidden');
        document.getElementById('chatbox-in').style['overflow-y'] = 'hidden';
    });
    */

    _G.ChatCloseLast = 0;
    chatboxIn.addEventListener('keydown', function(ev) {
        if (ev.keyCode === 13 && this.value.length > 0 && _G.lastTick - _G.ChatOpenLast > 100 && _G.lastTick - _G.ChatCloseLast > 100) {
            _G.ChatCloseLast = _G.lastTick;

            _G.OpenChatbox(false);

            gameServer.send(
                JSON.stringify({
                    type: 'ChatSend',
                    msg: this.value
                })
            );

            this.value = '';
            //scrollToBottom('chatbox-in');

            ev.preventDefault();
            ev.stopPropagation();
        } else if (ev.keyCode === 13 && this.value.length === 0 && _G.ChatOpen) {
            _G.OpenChatbox(false);

            ev.preventDefault();
            ev.stopPropagation();
        } else if (this.value.length > 170 && (!_G.LocalName || _G.LocalName !== 'goosely')) {
            this.value = this.value.substring(0, 170);
        }
    });
}

/*IF_END*/
/* ======================================================================================================== */
  


//let c2d = Collider2D();
let c2d = new Collider2D();

function GetPointRotated(X, Y, W, H, R, Xos, Yos) {
    // Cx, Cy // the coordinates of your center point in world coordinates
    // W      // the width of your rectangle
    // H      // the height of your rectangle
    // θ      // the angle you wish to rotate

    //The offset of a corner in local coordinates (i.e. relative to the pivot point)
    //(which corner will depend on the coordinate reference system used in your environment)

    //The rotated position of this corner in world coordinates    
    var rotatedX = X + (Xos * Math.cos(R)) - (Yos * Math.sin(R))
    var rotatedY = Y + (Xos * Math.sin(R)) + (Yos * Math.cos(R))

    return c2d.vector(rotatedX, rotatedY)
}


var CombatLevelCalculator = (function() {

    function CombatLevelCalculator() {}

    CombatLevelCalculator.prototype.combatLevel = function(self) {
        let attack = (self.skills['Attack'] ? self.skills['Attack'].lvl : 1),
            defence = (self.skills['Defence'] ? self.skills['Defence'].lvl : 1),
            strength = (self.skills['Strength'] ? self.skills['Strength'].lvl : 1),
            hitpoints = (self.skills['Health'] ? self.skills['Health'].lvl : 1),
            prayer = (self.skills['Prayer'] ? self.skills['Prayer'].lvl : 1),
            ranged = (self.skills['Ranged'] ? self.skills['Ranged'].lvl : 1),
            magic = (self.skills['Magic'] ? self.skills['Magic'].lvl : 1);

        // I mean... really?
        attack = parseInt(attack);
        defence = parseInt(defence);
        strength = parseInt(strength);
        hitpoints = parseInt(hitpoints);
        prayer = parseInt(prayer);
        ranged = parseInt(ranged);
        magic = parseInt(magic);

        // Calculate the combat level.
        var advance;
        var result = {};
        var base = (defence + hitpoints + Math.floor(prayer / 2)) * 0.25;
        var melee = (attack + strength) * 0.325;
        var range = Math.floor(ranged * 1.5) * 0.325;
        var mage = Math.floor(magic * 1.5) * 0.325;
        var max = Math.max(melee, range, mage);

        if (max == melee) {
            var type = 'Warrior';
        } else if (max == range) {
            var type = 'Ranger';
        } else if (max == mage) {
            var type = 'Mage';
        }

        result.level = Math.round((base + max) * 1000) / 1000;
        result.combatType = type;

        // Calculate skill levels until next combat level.
        var next = Math.floor(base + max) + 1;
        var melee_need = this.numLevels((base + melee), next, 0.325);
        // Can range and mage be combined, like attack and str are?
        var range_need = this.numLevelsRM(ranged, next, base);
        var mage_need = this.numLevelsRM(magic, next, base);
        var hpdef_need = this.numLevels((base + max), next, 0.25025);
        // var pray_need = this.numLevels((base + max), next, 0.125);
        var pray_need = this.prayerNeed(attack, defence, strength, hitpoints, prayer, ranged, magic);

        result.nextLevel = next;

        if (result.level >= 126) {
            result.canAdvance = false;
        } else {
            result.canAdvance = true;
            result.levelsLeft = {};
            result.levelsLeft.melee = melee_need;
            result.levelsLeft.hpDef = hpdef_need;
            result.levelsLeft.range = range_need;
            result.levelsLeft.magic = mage_need;
            result.levelsLeft.prayer = pray_need;
        }

        return result;
    }

    CombatLevelCalculator.prototype.numLevels = function(start, end, multiple) {
        var need = 0;
        while (start < end) {
            start += multiple;
            ++need;
        }
        return need;
    }

    CombatLevelCalculator.prototype.numLevelsRM = function(start, end, dhp) {
        var need = 0;
        var base = start;
        start = Math.floor(start * 1.5) * 0.325;
        while ((start + dhp) < end) {
            start = Math.floor((base + ++need) * 1.5) * 0.325;
        }
        return need;
    }

    CombatLevelCalculator.prototype.prayerNeed = function(attack, defence, strength, hitpoints, prayer, ranged, magic) {
        var level = this.simpleCombatLevelCalculate(attack, defence, strength, hitpoints, prayer, ranged, magic);
        var nextLevel = Math.floor(level) + 1;

        var estimatedLevel = level;
        var prayerNeeded = 0;
        while (estimatedLevel < nextLevel) {
            prayerNeeded++;
            estimatedLevel = this.simpleCombatLevelCalculate(attack, defence, strength, hitpoints, prayer + prayerNeeded, ranged, magic);
        }

        return prayerNeeded;
    }

    CombatLevelCalculator.prototype.simpleCombatLevelCalculate = function(attack, defence, strength, hitpoints, prayer, ranged, magic) {
        var base = (defence + hitpoints + Math.floor(prayer / 2)) * 0.25;
        var melee = (attack + strength) * 0.325;
        var range = Math.floor(ranged * 1.5) * 0.325;
        var mage = Math.floor(magic * 1.5) * 0.325;
        var max = Math.max(melee, range, mage);
        var level = Math.round((base + max) * 100) / 100;
        return level;
    }

    CombatLevelCalculator.prototype.xpEquate = function(xp) {
        return Math.floor(xp + 300 * Math.pow(2, xp / 7));
    }

    CombatLevelCalculator.prototype.levelToXp = function(level) {
        var xp = 0;
        for (var i = 1; i < level; i++) {
            xp += this.xpEquate(i);
        }
        return Math.floor(xp / 4);
    }

    CombatLevelCalculator.prototype.xpToLevel = function(xp) {
        for (level = 1; level <= 99; level++) {
            if (this.levelToXp(level + 1) > xp) {
                break;
            }
        }
        return level;
    }

    CombatLevelCalculator.prototype.estimateHitpoints = function(attack, defence, strength, ranged, magic) {
        var attack_xp = this.levelToXp(attack);
        var defence_xp = this.levelToXp(defence);
        var strength_xp = this.levelToXp(strength);
        var ranged_xp = this.levelToXp(ranged);
        var magic_xp = this.levelToXp(magic);

        var total_xp = attack_xp + defence_xp + strength_xp + ranged_xp + magic_xp;
        var new_hp = this.xpToLevel((total_xp / 3) + 1154); // 1154 is base hp exp

        if (new_hp > 99) {
            new_hp = 99;
        }
        if (new_hp < 10) {
            new_hp = 10;
        }
        return new_hp;
    }

    return CombatLevelCalculator;
})();


/*IF_CLIENT*/


_G.YTPos = [-580, 280];
_G.YTTime = 0;
//_G.YTVideo = 'M7lc1UVf-VE';

if (!_G.Instance || _G.Instance !== 3) {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    window.onYouTubeIframeAPIReady = function() {
        document.getElementById('youtube').style.display = 'block';
        _G.YTPlayer = new YT.Player('youtube', {
            height: '390',
            width: '640',
            videoId: _G.YTVideo,
            playerVars: {
                'autoplay': 1,
                'wmode': 'opaque',
                'rel': 0,
                'enablejsapi': 1,
                'origin': window.location.origin,
                'playsinline': 1,
                'mute': 1,
                'autohide': 1,
                'showinfo': 0,
                'controls': 0,
                'modestbranding': 1,
                'playerVars': {
                    'controls': 0,
                    'disablekb': 1
                },
            },
            events: {
                'onReady': onPlayerReady,
                //'onStateChange': onPlayerStateChange
            }
        });

        _G.YTPlayerElem = document.getElementById('youtube');


        // This is the source "window" that will emit the events.
        var iframeWindow = _G.YTPlayer.getIframe().contentWindow;

        // Listen to events triggered by postMessage.
        window.addEventListener("message", function(event) {
            // Check that the event was sent from the YouTube IFrame.
            if (event.source === iframeWindow) {
                var data = JSON.parse(event.data);

                // The "infoDelivery" event is used by YT to transmit any
                // kind of information change in the player,
                // such as the current time or a volume change.
                //console.log(data);
                if (
                    data.event === "infoDelivery" &&
                    data.info &&
                    data.info.volume
                ) {
                    _G.YTVolume = parseInt(data.info.volume); // there's also data.info.muted (a boolean)
                }
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        _G.YTPlayer = event.target;
        if (_G.YTVideo) {
            _G.YTPlayer.loadVideoById({
                'videoId': _G.YTVideo,
                'startSeconds': _G.YTTime
            });
        }
        event.target.setVolume(_G.YTVolume);
        event.target.unMute();
        /*
        event.target.playVideo();
        */
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    /*
        var done = false;
        function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
        }
        function stopVideo() {
        player.stopVideo();
        }
        */
}

let gameServer = false

function gameServerConnect() {
    gameServer = new WebSocket("ws" + (location.protocol === 'https:' ? 's' : '') + "://" + (localStorage.getItem('GameServerHost') || '10.0.0.100:9000') + (_G.Instance ? _G.InstanceURL[_G.Instance].toLowerCase() : _G.InstanceURL[0]), 'echo-protocol')
    _G.gameServer = gameServer;

    gameServer.onopen = function(e) {

        if (_G.discoOverlay) {
            document.body.removeChild(_G.discoOverlay);
            _G.discoOverlay = undefined;
        }
        if (_G.discoTimer) {
            clearInterval(_G.discoTimer);
            _G.discoTimer = undefined;
        }
        _G.viewport = {
            x: 0,
            y: 0,
            xTo: 0,
            yTo: 0,
            zoom: 1,
            zoomTo: 1,
        };


    };

    gameServer.onerror = function(e) {

    };

    gameServer.onclose = function(e) {
        setTimeout(gameServerConnect, 1000);

        if (!_G.discoTimer) {
            if (_G.discoOverlay) {
                document.body.removeChild(_G.discoOverlay);
            }

            let discoOverlay = document.createElement('div');
            discoOverlay.style = 'position:fixed;z-index:99999999;right:4px;top:0;width:250px;text-align:right;font-family:"Open Sans";font-size:24px;font-weight:700;text-shadow:2px 2px 6px #000;color:rgba(255,50,50,0.85);';
            discoOverlay.innerText = 'Connection Lost (30)';
            document.body.appendChild(discoOverlay)

            _G.discoTime = 30;
            _G.discoOverlay = discoOverlay;
            _G.discoTimer = setInterval(function() {
                _G.discoTime -= 1;
                _G.discoOverlay.innerText = 'Connection Lost (' + _G.discoTime + ')';
                if (_G.discoTime <= 0) {
                    location.reload(true);
                }
            }, 1000);
        }
    }

    gameServer.entsLoaded = [];
    gameServer.onmessage = function(event) {
        //console.log(event)
        let info = false,
            infoParsed = false;
        try {
            info = JSON.parse(event.data);

            /*
                        infoParsed = JSON.parse(event.data, function(key, val) {
                            if ((key === 'Owner' || key === 'parent' || key === 'ActiveWeapon' || key === 'Hammering' || key === 'Moving' || key === 'Mover' ||key === 'Holstered' || key === 'IsOpen' || key === 'container' || key === 'Driver' || key === 'Driving' || key === 'Placing' || key === 'PlacingObj') && typeof val === 'object' && typeof val.class === 'string') {
                            return 'ent_id:' + _G.ents.All.indexOf(val);
                            } else if (key === 'colliding') {
                            let colliding = [];
                            for (var i=0; i < val.length; i++) {
                                colliding.push('ent_id:' + _G.ents.All.indexOf(val[i]))
                            }
                            return colliding;
                            } else if (key === 'type' && val === 'drawImage') {
                            return 'drawImg';
                            } else if (key === '_idlePrev' || key === '_idleNext' || key === 'Timeout') {
                            return null;
                            } else if (typeof val === 'undefined') {
                            return '@D_ME@';
                            }

                            return val;
                        });
                            */
        } catch (e) {
            info = false;
        }

        if (typeof info === 'object') {
            if (info.type === 'pong' && typeof info.t === 'number') {
                // Measure RTT and report back to server for lag compensation
                let rtt = Date.now() - info.t;
                _G.clientPing = rtt;
                gameServer.send(JSON.stringify({type: 'pong_ack', rtt: rtt}));
            } else if (info.type === 'ents') {
                //document.getElementById('youtube').src = 'https://www.youtube.com/embed/fo8GJ1B-7J4?autoplay=1';

                //if (gameServer.entsLoaded !== true) {
                _G.ents.All = [];
                for (var i = 0; i < info.data.length; i++) {
                    let ent = _G.ents.Create(info.data[i].class);
                    //info.data[i] = updateObject(info.data[i]);
                }
                for (var i = 0; i < info.data.length; i++) {
                    let ent = _G.ents.All[i];
                    //info.data[i] = updateObject(info.data[i]);

                    let entKeys = Object.keys(info.data[i]);
                    for (var x = 0; x < entKeys.length; x++) {
                        ent[entKeys[x]] = (typeof info.data[i][entKeys[x]] === 'string' && info.data[i][entKeys[x]].substring(0, 7) === 'ent_id:') ? _G.ents.All[parseInt(info.data[i][entKeys[x]].substring(7))] : info.data[i][entKeys[x]];
                    }
                    _G.entsByIndex[ent.EntIndex] = _G.ents.All[i];
                    if (_G.LocalName && _G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === _G.LocalName) {
                        _G.LocalPlayer = _G.ents.All[i];

                        if (_G.LocalPlayer.ScratchCard) {
                            createScratcher(_G.LocalPlayer.ScratchCard.game_state.game_id, _G.LocalPlayer.ScratchCard.theme, _G.LocalPlayer.ScratchCard.cell_count, _G.LocalPlayer.ScratchCard.game_state, _G.LocalPlayer.ScratchCard.game_state);
                        }
                        if (_G.LocalPlayer.SlotMachine) {
                            _G.openSlotMachine(_G.LocalPlayer.SlotMachine);
                        }
                    }
                }

                if (typeof gameServer.entsLoaded === 'object') {
                    for (var i = 0; i < gameServer.entsLoaded.length; i++) {
                        let ent = _G.ents.Create(gameServer.entsLoaded[i].class);
                        let entKeys = Object.keys(gameServer.entsLoaded[i]);
                        for (var x = 0; x < entKeys.length; x++) {
                            ent[entKeys[x]] = (typeof gameServer.entsLoaded[i][entKeys[x]] === 'string' && gameServer.entsLoaded[i][entKeys[x]].substring(0, 7) === 'ent_id:') ? _G.ents.All[parseInt(gameServer.entsLoaded[i][entKeys[x]].substring(7))] : gameServer.entsLoaded[i][entKeys[x]];
                        }

                        _G.entsByIndex[ent.EntIndex] = ent;
                    }
                }

                if (!_G.LocalName && !_G.IsSpec) {
                    _G.OpenLoginScreen();
                }

                gameServer.entsLoaded = true;

                _G.viewport = {
                    x: 0,
                    y: 0,
                    xTo: 0,
                    yTo: 0,
                    zoom: 1,
                    zoomTo: 1,
                    loaded: _G.lastTick + 800
                };


                setTimeout(function() {
                    if (window.location.hash.indexOf('#Auth') !== -1) {
                        gameServer.send(JSON.stringify({
                            type: 'PreAuth',
                            auth: window.location.hash.substring(window.location.hash.indexOf('#Auth') + 6)
                        }));

                        window.location.hash = '';
                    }
                    if (window.location.hash.indexOf('#Auth') !== -1) {
                        gameServer.send(JSON.stringify({
                            type: 'PreAuth',
                            auth: window.location.hash.substring(window.location.hash.indexOf('#Auth') + 6)
                        }));

                        window.location.hash = '';
                    }

                }, 10);
                //_G.ents.All = updateObject(_G.ents.All);


                /*
                                } else {
                                    info.data = updateObject(info.data);
                                        for (var i=0; i < info.data.length; i++) {
                                        let ent = (typeof _G.entsByIndex[info.data[i].EntIndex] !== 'undefined') ? _G.entsByIndex[info.data[i].EntIndex] : _G.ents.Create(info.data[i].class),
                                            ogKeys = Object.keys(ent),
                                            entKeys = Object.keys(info.data[i]),
                                            ogPos = [ent.pos[0], ent.pos[1]];

                                        for (var x=0; x < entKeys.length; x++) {
                                            ent[entKeys[x]] = (typeof info.data[i][entKeys[x]] === 'string' && info.data[i][entKeys[x]].substring(0,7) === 'ent_id:') ? _G.ents.All[parseInt(info.data[i][entKeys[x]].substring(7))] : info.data[i][entKeys[x]];
                                            if (ogKeys.indexOf(entKeys[x]) !== -1) {
                                                ogKeys.splice(ogKeys.indexOf(entKeys[x]), 1)
                                            }
                                        }

                                        for (var x=0; x < ogKeys.length; x++) {
                                            if (typeof ent[ogKeys[x]] !== 'function' && ogKeys[x] !== 'Client') {
                                                ent[ogKeys[x]] = undefined;
                                                delete ent[ogKeys[x]];
                                            }
                                        }

                                        if (typeof _G.entsByIndex[ent.EntIndex] === 'undefined') {
                                            _G.entsByIndex[ent.EntIndex] = ent;
                                        }

                                        if (ent.class === 'player' && (ogPos[0] !== ent.pos[0] || ogPos[1] !== ent.pos[1])) {
                                            //if (_G.distance(ogPos[0], ogPos[1], ent.pos[0], ent.pos[1]) > 0) {
                                                ent.pos = typeof ent.posTo === 'undefined' ? ent.pos : ogPos;
                                                ent.posTo = [ent.pos[0], ent.pos[1]];
                                            //} else {
                                            //    ent.pos = ogPos;
                                            //}
                                        }
                                        }

                                }*/


                //_G.ents.All = updateObject(_G.ents.All, _G.ents.All);
                /*
            let ents = info.data;
            ents = updateObject(ents, ents);

            _G.ents.All = ents;
            */

                //ents = updateObject(ents, ents);
                //updateObject(_G.ents.All)

                //_G.ents.All = ents;
                gameServer.entsLoaded = true;
            } else if (info.type === 'ent') {
                if (typeof gameServer.entsLoaded === 'object') {
                    for (var ii = 0; ii < info.data.length; ii++) {
                        gameServer.entsLoaded.push(info.data[ii]);
                    }
                } else {
                    for (var ii = 0; ii < info.data.length; ii++) {
                        let ent = _G.ents.Create(info.data[ii].class);
                        //info.data[ii] = updateObject(info.data[ii]);
                        let entKeys = Object.keys(info.data[ii]);
                        for (var x = 0; x < entKeys.length; x++) {
                            ent[entKeys[x]] = (typeof info.data[ii][entKeys[x]] === 'string' && info.data[ii][entKeys[x]].substring(0, 7) === 'ent_id:') ? _G.ents.All[parseInt(info.data[ii][entKeys[x]].substring(7))] : info.data[ii][entKeys[x]];
                        }
                        _G.entsByIndex[ent.EntIndex] = ent;

                        if (_G.LocalName && ent.class === 'player' && ent.Owner === _G.LocalName) {
                            _G.LocalPlayer = ent;

                            if (_G.LocalPlayer.ScratchCard) {
                                createScratcher(_G.LocalPlayer.ScratchCard.game_state.game_id, _G.LocalPlayer.ScratchCard.theme, _G.LocalPlayer.ScratchCard.cell_count, _G.LocalPlayer.ScratchCard.game_state, _G.LocalPlayer.ScratchCard.game_state);
                            }
                            if (_G.LocalPlayer.SlotMachine) {
                                _G.openSlotMachine(_G.LocalPlayer.SlotMachine);
                            }
                        }
                        //ent = updateObject(ent);
                    }
                }
            } else if (info.type === 'dirUpdate') {
                if (typeof _G.playerData[info.user] === 'object') {
                    if (info.lastDir) {
                        _G.playerData[info.user].lastDir = info.lastDir;
                        if (typeof _G.playerData[info.user].ent === 'object') {
                            _G.playerData[info.user].ent.lastDir = info.lastDir
                        }
                    }
                    if (info.lastDirY) {
                        _G.playerData[info.user].lastDirY = info.lastDirY;
                        if (typeof _G.playerData[info.user].ent === 'object') {
                            _G.playerData[info.user].ent.lastDirY = info.lastDirY
                        }
                    }
                }
            } else if (info.type === 'entUpdate') {
                for (var z = 0; z < _G.ents.All.length; z++) {
                    if (typeof info.data[_G.ents.All[z].EntIndex] !== 'undefined') {
                        /*
                        if (_G.ents.All[z].class === 'player' && _G.ents.All[z].Owner === 'goosely'){
                            console.log(info.data[_G.ents.All[z].EntIndex]);
                        }
                        */
                        info.data[_G.ents.All[z].EntIndex] = updateObject(info.data[_G.ents.All[z].EntIndex]);

                        /*
                        if (_G.ents.All[z].class === 'player' && _G.ents.All[z].Owner === 'goosely'){
                            console.log(info.data[_G.ents.All[z].EntIndex]);
                        }
                        */

                        let oldPos = (_G.ents.All[z].pos ? _G.ents.All[z].pos : false);

                        let dataKeys = Object.keys(info.data[_G.ents.All[z].EntIndex])
                        for (var x = 0; x < dataKeys.length; x++) {
                            if (typeof info.data[_G.ents.All[z].EntIndex][dataKeys[x]] === 'string' && info.data[_G.ents.All[z].EntIndex][dataKeys[x]] === '@D_ME@') {
                                _G.ents.All[z][dataKeys[x]] = undefined;
                                delete _G.ents.All[z][dataKeys[x]];
                            } else {
                                _G.ents.All[z][dataKeys[x]] = (typeof info.data[_G.ents.All[z].EntIndex][dataKeys[x]] === 'string' && info.data[_G.ents.All[z].EntIndex][dataKeys[x]].substring(0, 7) === 'ent_id:') ? _G.ents.All[parseInt(info.data[_G.ents.All[z].EntIndex][dataKeys[x]].substring(7))] : info.data[_G.ents.All[z].EntIndex][dataKeys[x]];
                            }

                        }

                        if (oldPos) {
                            if (_G.LocalPlayer && _G.ents.All[z] === _G.LocalPlayer) {
                                // ── Source-style client prediction reconciliation ─────────────
                                // Never snap pos backward. Instead store the server error as an
                                // additive correction impulse (_posCorrect) that the render loop
                                // bleeds away at ~35 %/frame (~115 ms to 95 % resolved), keeping
                                // the camera smooth and prediction-error invisible to the eye.
                                let serverPos = _G.ents.All[z].pos;
                                let dx = serverPos[0] - oldPos[0];
                                let dy = serverPos[1] - oldPos[1];
                                let distSq = dx * dx + dy * dy;

                                // Always restore client-predicted position (no backward snap)
                                _G.ents.All[z].pos = [oldPos[0], oldPos[1]];

                                if (distSq > 90000) {
                                    // Teleport (> 300 px): accept server position and reset
                                    _G.ents.All[z].pos = [serverPos[0], serverPos[1]];
                                    _G.LocalPlayer._posCorrect = undefined;
                                } else if (distSq > 4) {
                                    // Notable divergence (> 2 px): ACCUMULATE into existing
                                    // correction rather than replace — prevents the previous
                                    // un-applied correction from being discarded when successive
                                    // updates arrive at 64 ms intervals.
                                    if (!_G.LocalPlayer._posCorrect) _G.LocalPlayer._posCorrect = [0, 0];
                                    _G.LocalPlayer._posCorrect[0] += dx;
                                    _G.LocalPlayer._posCorrect[1] += dy;
                                    // Cap magnitude to 60 px to prevent spiral corrections
                                    let _cMag = Math.sqrt(_G.LocalPlayer._posCorrect[0] * _G.LocalPlayer._posCorrect[0] +
                                                          _G.LocalPlayer._posCorrect[1] * _G.LocalPlayer._posCorrect[1]);
                                    if (_cMag > 60) {
                                        _G.LocalPlayer._posCorrect[0] = _G.LocalPlayer._posCorrect[0] / _cMag * 60;
                                        _G.LocalPlayer._posCorrect[1] = _G.LocalPlayer._posCorrect[1] / _cMag * 60;
                                    }
                                }
                                // < 2 px: within prediction tolerance, discard server delta
                            } else if (!_G.ents.All[z].parent) {
                                // Remote entity: snapshot-based interpolation.
                                // Skip for parented entities (weapons/held items) — their
                                // position is driven by the parent update loop, not server pos.
                                // Capture the current interpolated position as the start point so
                                // motion stays continuous even if the previous lerp had not ended.
                                let _interp = _G.ents.All[z].posTo ? _G.ents.All[z].pos : oldPos;
                                _G.ents.All[z]._posFrom = [_interp[0], _interp[1]];
                                _G.ents.All[z]._posToAt = Date.now();
                                _G.ents.All[z].posTo = _G.ents.All[z].pos;
                                _G.ents.All[z].pos = [_interp[0], _interp[1]];
                            } else {
                                // Parented entity: clear any stale interpolation state so
                                // the parent loop has exclusive control of position.
                                _G.ents.All[z].posTo = undefined;
                                _G.ents.All[z]._posFrom = undefined;
                            }
                        }

                        if (_G.LocalPlayer == _G.ents.All[z] && info.data[_G.ents.All[z].EntIndex].ScratchCard) {
                            createScratcher(_G.ents.All[z].ScratchCard.game_state.game_id, _G.ents.All[z].ScratchCard.theme, _G.ents.All[z].ScratchCard.cell_count, _G.ents.All[z].ScratchCard.game_state);
                        }

                        if (_G.LocalPlayer == _G.ents.All[z] && info.data[_G.ents.All[z].EntIndex].SlotMachine) {
                            _G.openSlotMachine(info.data[_G.ents.All[z].EntIndex].SlotMachine);
                        }
                    }
                }
            } else if (info.type === 'ClearInput' && typeof info.user === 'string' && typeof _G.playerData[info.user] === 'object') {
                _G.playerData[info.user].input = {};
                _G.playerData[info.user].mouse = {};
                _G.playerData[info.user].unpress = {};
            } else if (info.type === 'LocationChange') {
                location.href = info.url;
            } else if (info.type === 'YTVideo') {
                _G.YTVideo = info.id;
                _G.YTPos = info.pos;
                _G.YTTime = (info.start / 1000);
                _G.YTLength = parseInt(info.length) * 1000;
                _G.YTReceived = _G.lastTick;
                _G.YTEnd = _G.YTReceived + _G.YTLength - info.start;

                if (_G.YTPlayer && typeof _G.YTPlayer.loadVideoById === 'function') {
                    _G.YTPlayer.loadVideoById({
                        'videoId': info.id,
                        'startSeconds': (info.start / 1000)
                    });
                    _G.YTPlayer.setVolume(_G.YTVolume);
                    _G.YTPlayer.unMute();
                    _G.YTPlayer.playVideo();
                }

            } else if (info.type === 'startTick') {
                //_G.startTick = info.start;
                //_G.lastTick = info.last;
                //_G.offsetTick = performance.now();
                _G.offsetTick = performance.now() - info.last;
                _G.lastTick = info.last;

                _G.lastRender = _G.lastTick; // Pretend the first draw was on first update.
            } else if (info.type === 'Refresh') {
                location.reload(true);
            } else if (info.type === 'entRemove') {
                for (var i = (_G.ents.All.length - 1); i >= 0; i--) {
                    if (!_G.ents.All[i] || info.data.indexOf(_G.ents.All[i].EntIndex) !== -1) {
                        if (_G.ents.PlayersActive.indexOf(_G.ents.All[i]) !== -1) {
                            _G.ents.PlayersActive.splice(_G.ents.PlayersActive.indexOf(_G.ents.All[i]), 1)
                        }

                        _G.ents.All.splice(i, 1);
                    }
                }
                /*
            for (var i=0; i < info.data.length; i++) {
                if (_G.ents.PlayersActive.indexOf(_G.ents.All[info.data[i]]) !== -1) {
                    _G.ents.PlayersActive.splice(_G.ents.PlayersActive.indexOf(_G.ents.All[info.data[i]]), 1)
                }

                _G.ents.All.splice(info.data[i], 1);

            }*/
            } else if (info.type === 'playerData') {
                _G.playerData = info.data;
                let playerKeys = Object.keys(_G.playerData);
                for (var i = 0; i < playerKeys.length; i++) {
                    _G.playerData[playerKeys[i]].ent = _G.ents.All[parseInt(_G.playerData[playerKeys[i]].ent.substring(7))];
                }
            } else if (info.type === 'HiddenState') {
                if (!info.hidden) {
                    _G.HiddenWait = false;
                    _G.Hidden = false;
                } else {
                    _G.Hidden = true;
                }
            } else if (info.type === 'ScratchCard') {
                console.log(info.id);
                if (typeof _G.ScratchCards[info.id] === 'function') {
                    console.log('func found');
                    _G.ScratchCards[info.id](info);
                    _G.ScratchCards[info.id] = undefined;
                    delete _G.ScratchCards[info.id];
                }
            } else if (info.type === 'SlotMachine') {
                console.log(info.id);
                if (typeof _G.SlotMachineCallback[info.id] === 'function') {
                    console.log('func found');
                    _G.SlotMachineCallback[info.id](info);
                    _G.SlotMachineCallback[info.id] = undefined;
                    delete _G.SlotMachineCallback[info.id];
                }
            } else if (info.type === 'Audio') {

                let sndPlay = _G.Sound(info.file).cloneNode(false);
                sndPlay.volume = info.volume;

                _G.SoundsActive[info.id] = sndPlay;
                /*
                if(info.pos && typeof _G.LocalPlayer === 'object') {
                                    // for legacy browsers
                    const AudioContext = window.AudioContext || window.webkitAudioContext;

                    const audioContext = new AudioContext();

                    // pass it into the audio context
                    const track = audioContext.createMediaElementSource(sndPlay);


                    // default pan set to 0 - center
                    const stereoNode = new StereoPannerNode(audioContext, { pan: 0 });

                    // change the value of the balance by updating the pan value
                    if (info.pos[0] < _G.LocalPlayer.pos[0]-200) {
                        let leftAm = (Math.abs((_G.LocalPlayer.pos[0]-200)-info.pos[0])/500);
                        if (leftAm > 1) { leftAm = 1; }

                        stereoNode.pan.value = -1*leftAm;
                    } else if (info.pos[0] > _G.LocalPlayer.pos[0]+300) {
                        let rightAm = (Math.abs(info.pos[0]-(_G.LocalPlayer.pos[0]+300))/500);
                        if (rightAm > 1) { rightAm = 1; }

                        stereoNode.pan.value = 1*rightAm;
                    } else {
                        stereoNode.pan.value = 0;
                    }

                    track.connect(stereoNode).connect(audioContext.destination);
                }
                */

                sndPlay.play();

                setTimeout(function() {
                    try {
                        sndPlay.destroy();
                    } catch (e) {}
                    sndPlay = undefined;
                }, 10000)


            } else if (info.type === 'AudioDestroy' && typeof _G.SoundsActive[info.id] === 'object') {
                try {
                    _G.SoundsActive[info.id].destroy();
                    _G.SoundsActive[info.id] = undefined;
                    delete _G.SoundsActive[info.id];
                } catch (e) {}
            } else if (info.type === 'AudioPause' && typeof _G.SoundsActive[info.id] === 'object') {
                try {
                    _G.SoundsActive[info.id].pause();
                } catch (e) {}
            } else if (info.type === 'playerInput') {

                if (info.data.command === 'R' || info.data.command === 'L' || info.data.command === 'U' || info.data.command === 'D' || info.data.command === 'SHIFT' || info.data.command === 'E' || info.data.command === 'V' || info.data.command === 'C' || info.data.command === 'I' || info.data.command === 'K' || info.data.command === 'H' || info.data.command === 'G') {

                    let plyKey = (typeof info.data.user !== 'undefined' ? info.data.user : (typeof info.data.ip !== 'undefined' ? ('ip-|-' + info.data.ip) : false));
                    plyKey = plyKey.toLowerCase().trim();

                    if (typeof _G.playerData[plyKey] !== 'object') {
                        _G.playerData[plyKey] = {
                            input: {},
                            unpress: {},
                            mouse: {},
                            lastDir: 'L',
                            lastDirY: false,
                            lastDirPress: false
                        };
                    }

                    if (typeof _G.entsByIndex[info.index] !== 'undefined' && (typeof _G.playerData[plyKey].ent !== 'object' || _G.playerData[plyKey].ent !== _G.entsByIndex[info.index])) {
                        _G.playerData[plyKey].ent = _G.entsByIndex[info.index];
                    }

                    if (typeof _G.playerData[plyKey].ent === 'object') {
                        _G.playerData[plyKey].ent.inputLast = info.time;
                    }

                    if (typeof _G.ents.PlayersByName[plyKey] !== 'object') {
                        _G.ents.PlayersByName[plyKey] = _G.entsByIndex[info.index];
                    }

                    if (info.data.key_position === 'down' && (info.data.command === 'L' || info.data.command === 'R' || info.data.command === 'U' || info.data.command === 'D')) {
                        _G.playerData[plyKey].lastDirPress = info.data.command;
                        if (typeof _G.ents.PlayersByName[plyKey] === 'object') {
                            _G.ents.PlayersByName[plyKey].lastDirPress = info.data.command;
                        }
                    }

                    if (typeof _G.banned[plyKey] === 'undefined') {
                        _G.playerData[plyKey].inputLast = info.time;
                        if (typeof _G.ents.PlayersByName[plyKey] === 'object' && _G.ents.PlayersActive.indexOf(_G.ents.PlayersByName[plyKey]) === -1) {
                            _G.ents.PlayersByName[plyKey].inputLast = _G.playerData[plyKey].inputLast;
                            _G.ents.PlayersActive.push(_G.ents.PlayersByName[plyKey]);
                        }
                    }

                    if (info.data.key_position === 'up' && typeof _G.playerData[plyKey].input[info.data.command] !== 'undefined') {
                        _G.playerData[plyKey].input[info.data.command] = undefined;
                        delete _G.playerData[plyKey].input[info.data.command];
                    } else if (info.data.key_position === 'down') {
                        _G.playerData[plyKey].input[info.data.command] = info.time;
                    }
                }

            } else if (info.type === 'mouseInput') {

                let plyKey = info.user;

                if (typeof _G.playerData[plyKey] !== 'object') {
                    _G.playerData[plyKey] = {
                        input: {},
                        unpress: {},
                        mouse: {},
                        lastDir: 'L',
                        lastDirY: false,
                        lastDirPress: false
                    };
                }

                if (typeof _G.playerData[plyKey].ent !== 'object' && typeof _G.entsByIndex[info.index] === 'object') {
                    _G.playerData[plyKey].ent = _G.entsByIndex[info.index];
                }
                if (typeof _G.playerData[plyKey].ent === 'object') {
                    _G.playerData[plyKey].ent.inputLast = info.time;
                }

                if (typeof _G.ents.PlayersByName[plyKey] !== 'object') {
                    _G.ents.PlayersByName[plyKey] = _G.entsByIndex[info.index];
                }

                _G.playerData[plyKey].mouse[info.data.button] = {
                    pos: info.data.pos,
                    key_position: info.data.key_position
                }

                _G.playerData[plyKey].inputLast = info.time;

                //console.log(_G.playerData[plyKey].mouse[info.data.button])

                /*
                                _G.playerData[plyKey].inputLast = info.time;

                                if (info.data.key_position === 'down' && (info.data.command === 'L' || info.data.command === 'R' || info.data.command === 'U' || info.data.command === 'D')) {
                                    _G.playerData[plyKey].lastDirPress = info.data.command;
                                    if (typeof _G.ents.PlayersByName[plyKey] === 'object') {
                                        _G.ents.PlayersByName[plyKey].lastDirPress = info.data.command;
                                    }
                                }

                                if (typeof _G.banned[plyKey] === 'undefined') {
                                    _G.playerData[plyKey].inputLast = Date.now();
                                    if (typeof _G.ents.PlayersByName[plyKey] === 'object' && _G.ents.PlayersActive.indexOf(_G.ents.PlayersByName[plyKey]) === -1) {
                                        _G.ents.PlayersByName[plyKey].inputLast = _G.playerData[plyKey].inputLast;
                                        _G.ents.PlayersActive.push(_G.ents.PlayersByName[plyKey]);
                                    }
                                }
                                */

                /*
                                if (info.data.key_position === 'down' && (!_G.playerData[plyKey].ent || (!_G.playerData[plyKey].ent.invOpen && !_G.playerData[plyKey].ent.craftOpen))) {
                                    if (info.data.command === 'U' || info.data.command === 'D') {
                                        _G.playerData[plyKey].lastDirY = info.data.command;
                                    } else if (!_G.playerData[plyKey].input[''] && !_G.playerData[plyKey].input['R']) {
                                        _G.playerData[plyKey].lastDirY = false
                                    }

                                    if (info.data.command === 'L' || info.data.command === 'R') {
                                        _G.playerData[plyKey].lastDir = info.data.command;
                                    } else if (!_G.playerData[plyKey].input['L'] && !_G.playerData[plyKey].input['L']) {
                                        _G.playerData[plyKey].lastDir = false
                                    }
                                }
                                */

                if (info.data.key_position === 'up' && typeof _G.playerData[plyKey].input[info.data.command] !== 'undefined') {
                    _G.playerData[plyKey].input[info.data.command] = undefined;
                    delete _G.playerData[plyKey].input[info.data.command];
                } else if (info.data.key_position === 'down') {
                    _G.playerData[plyKey].input[info.data.command] = info.time;
                }

            } else if (info.type === 'auth') {
                _G.LoginToken = info.token;
                if (gameServer.entsLoaded === true) {
                    _G.OpenLoginScreen();
                }
            } else if (info.type === 'Chat') {
                if (window.location.hash !== '#spectate') {
                    let chatInner = (typeof _G.Chatbox === 'object' && _G.Chatbox.children && _G.Chatbox.children.length > 0) ? _G.Chatbox.children[0] : false;
                    if (chatInner) {

                        if (!_G.ChatOpen) {
                            _G.Chatbox.style.display = 'block';
                            _G.Chatbox.style['pointer-events'] = 'none';

                            if (_G.ChatboxHide) {
                                try {
                                    clearTimeout(_G.ChatboxHide);
                                } catch (e) {}
                            }

                            _G.ChatboxHide = setTimeout(function() {
                                if (!_G.ChatOpen) {
                                    _G.Chatbox.style.display = 'none';
                                    _G.Chatbox.style['pointer-events'] = 'auto';
                                }
                            }, 4000);
                        }

                        let chatMsg = document.createElement('div');
                        chatMsg.className = 'msg new';
                        setTimeout(function() {
                            chatMsg.className = 'msg';
                        }, 4000)

                        let chatName = document.createElement('span');
                        chatName.className = 'name';
                        chatName.innerText = info.user + ':';

                        chatMsg.appendChild(chatName);

                        let chatTxt = document.createElement('span');
                        chatTxt.innerText = ' ' + info.msg;
                        chatMsg.appendChild(chatTxt);

                        chatInner.appendChild(chatMsg);

                        scrollToBottom('chatbox-in');

                        if (chatInner.children.length > 70) {
                            chatInner.removeChild(chatInner.children[0]);
                        }
                    }
                }

                if (_G.lastTick - info.time < 6000) {
                    _G.chats[info.user] = (typeof _G.chats[info.user] === 'object' ? _G.chats[info.user] : []);

                    let chatM = {};
                    chatM.message = (info.msg + '');
                    if (chatM.message.length > 38) {
                        chatM.message = chatM.message.substring(0, 37) + '...';
                    }

                    chatM.username = info.user;
                    chatM.sent_at = Date.now();
                    chatM.fade_in = (chatM.sent_at + 330);
                    chatM.fade_at = chatM.sent_at + 3840 + (chatM.message.length > 7 ? ((chatM.message.length - 7) * 130) : 0);
                    chatM.scaleY = 0;
                    chatM.posY = 0;

                    _G.chats[info.user].push(chatM);
                }

                if (info.user.toLowerCase() === 'goosely' && info.msg.trim().toLowerCase().indexOf('!yvol') !== -1 && _G.YTPlayer) {
                    let parseVolume = 80;
                    try {
                        parseVolume = parseInt((info.msg.trim().toLowerCase().substring(info.msg.trim().toLowerCase().indexOf('!yvol') + 5)).trim());
                    } catch (e) {
                        parseVolume = 80;
                    }
                    _G.YTVolume = parseVolume;
                    _G.YTPlayer.setVolume(_G.YTVolume);
                    _G.YTPlayer.unMute();
                    _G.YTPlayer.playVideo();
                }
				
                if (info.user.toLowerCase() === 'goosely' && window.location.hash === '#spectate' && info.msg.trim().toLowerCase().indexOf('!debug') !== -1 && _G.YTPlayer) {
					_G.ents.Debug = !_G.ents.Debug;
                }
            } else if (info.type === 'authed') {
                if (window.location.hash === '#spectate') {
                    return;
                }

                if (_G.LoadScreen) {
                    _G.LoadScreen.style.opacity = '0';
                    setTimeout(function() {
                        document.body.removeChild(_G.LoadScreen);
                        _G.LoadScreen = undefined;
                    }, 550)
                }

                if (window.location.hash !== '#spectate') {
                    _G.OpenChatbox(true);
                }
            } else if (info.type === 'localplayer') {
                let foundPly = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === info.username) {
                        foundPly = _G.ents.All[i];
                        break;
                    }
                }
                _G.LocalName = info.username;

                if (_G.LocalName === 'goosely') {
                    window._G = _G;
                }

                if (foundPly) {
                    _G.LocalPlayer = foundPly;
                    document.getElementById('but-cam')._tippy.setContent('Cam Mode: Singleplayer');
                    document.getElementById('but-cam').className = 'game-icon game-icon-human-target';

                    if (_G.LocalPlayer.ScratchCard) {
                        createScratcher(_G.LocalPlayer.ScratchCard.game_state.game_id, _G.LocalPlayer.ScratchCard.theme, _G.LocalPlayer.ScratchCard.cell_count, _G.LocalPlayer.ScratchCard.game_state);
                    }
                    if (_G.LocalPlayer.SlotMachine) {
                        _G.openSlotMachine(_G.LocalPlayer.SlotMachine);
                    }
                }
            }
        }
    }

}

gameServerConnect();

_G.OpenLoginScreen = function() {
    _G.OpenLoadScreen();

    /*
    if (_G.loginBox) {
        try {
            _G.LoadScreen.children[0].removeChild(_G.loginBox);
        } catch(e) { }
    }
    */

    _G.LoadScreen.children[0].innerHTML = '<img src="assets/img/2d-big.png" style="width:80px"><br>Welcome to HoboQuest!';

    let inputBox = document.createElement('span');
    inputBox.style = 'width:560px;font-size:20px;display:block;margin: 0 auto;transition:opacity 500ms ease;';
    inputBox.innerText = 'Input this into RobotStreamer chat to verify username:';

    let inputEnter = document.createElement('input');
    inputEnter.style = 'width: 560px;font-size: 22px;background: rgba(0,0,0,0.5);color: #fff;border: 2px solid rgba(255,255,255,0.7);padding: 3px 8px;border-radius: 6px;margin-top: 3px;';
    inputEnter.value = _G.LoginToken;

    inputBox.appendChild(inputEnter);

    let specOnly = document.createElement('button')
    specOnly.style = 'position:relative;top:6px;cursor:pointer;width: 260px;font-size: 22px;background: rgba(0,0,0,0.5);color: #fff;border: 2px solid rgba(255,255,255,0.7);padding: 3px 8px;border-radius: 6px;margin-top: 3px;';
    specOnly.type = 'button';
    specOnly.innerHTML = 'or click here to spectate';
    specOnly.onclick = function(ev) {
        _G.IsSpec = true;

        if (_G.loginBox) {
            _G.LoadScreen.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(_G.LoadScreen);
                _G.LoadScreen = undefined;
            }, 550)
        }

        ev.preventDefault();
        return true;
    };

    inputBox.appendChild(specOnly);


    _G.loginBox = inputBox;

    _G.LoadScreen.children[0].appendChild(inputBox);

    if (window.location.hash === '#spectate') {
        _G.LoadScreen.style.display = 'none';
        _G.LoadScreen = undefined;
        document.getElementById('buttons').style.display = 'none';
    }
};

/*

function updateObject(object, all) {
    //const results = (object instanceof Array ? [] : {});
    for (var key in object) {
        if (typeof object[key] === 'string' && object[key].substring(0,7) === 'ent_id:') {
                object[key] = _G.ents.All[parseInt(object[key].substring(7))];
        } else if (key === 'img' && typeof object[key] === 'string') {
                object[key] = _G.Material(object[key]);
        } else if (typeof object[key] === "object" && object[key] !== null) {
                object[key] = updateObject(object[key], all);
        }
    }
    return object;
}
*/

function updateObject(object, all, loops) {
    //const results = (object instanceof Array ? [] : {});
    loops = (typeof loops === 'undefined' ? 1 : loops + 1);
    if (loops > 600) {
        console.log(object);
    }

    if (typeof object.src === 'string' && object.src && object.src.length > 0) {
        return 'assets/img/' + object.src.split('assets/img/')[1];
    }

    for (var key in object) {

        if (key === 'img' && typeof object[key] === 'string') {
            object[key] = _G.Material(object[key]);
        } else if (typeof object[key] === "string" && object[key].substring(0, 7) === 'ent_id:') {
            object[key] = _G.ents.All[parseInt(object[key].substring(7))];
        } else if (typeof object[key] === 'string' && object[key] === '@D_ME@') {
            object[key] = undefined;
            //delete object[key];
        } else if (loops > 600 || (key === 'Owner' || key === 'parent' || key === 'ActiveWeapon' || key === 'Target' || key === 'Hammering' || key === 'Moving' || key === 'Mover' || key === 'Holstered' || key === 'IsOpen' || key === 'container' || key === 'Driver' || key === 'Driving' || key === 'Placing' || key === 'PlacingObj')) {
            object[key] = object[key];
            if (loops > 600) {
                console.log(key);
            }
        } else if (typeof object[key] === "object" && object[key] !== null) {
            object[key] = updateObject(object[key], all, loops);
        }
    }
    return object;
}

_G.updateObject = updateObject;

_G.entsByIndex = {};

/*IF_END*/



_G.CombatLevelCalculator = new CombatLevelCalculator();

let chatBot = {
    send: function() {}
};

/*IF_SERVER*/

(function() {
    let InData = false;
    try {
        InData = JSON.parse(localStorage.getItem('InData'));
    } catch (e) {
        InData = false;
    }

    if (typeof InData === 'object' && InData) {
        _G.InData = InData;
    }
})();

chatBot = false;

function chatBotConnect() {
    chatBot = new WebSocket("ws://73.193.51.100:6962")
    chatBot.onopen = function(e) {
        /*
            setTimeout(function() {
                sendChat('[HoboQuest] Connected to chatbot successfully!');
            }, 5000);
            */
        console.log('Connected to chatbot successfully')
    };

    chatBot.onmessage = function(event) {
        let info = false;
        try {
            info = JSON.parse(event.data)
        } catch (e) {
            info = false;
        }

        if (typeof info === 'object') {
            if (info.type === 'Title') {
                let findPly = find(info.username);
                if (findPly !== false) {
                    findPly.title = info.title.substring(0, 16);
                }
            } else if (info.type === 'Backup') {
                if (_G.IsLocal) {
                    if (!_G.Instance || info.id.indexOf('-i' + _G.Instance) !== -1) {
                        sendChat('Loading backup "' + info.id + '"');
                        _G.ents.Backups[info.id] = info.data;
                        _G.Initialize(_G.lastTick, info.id);
                    }
                }
            }
            /*else if (info.type === 'InstanceCheck' && parseInt(info.instance) !== _G.Instance) {
                                        let foundPly = false;
                                        for (var i=0; i < _G.ents.All.length; i++) {
                                            if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === info.username) {
                                                foundPly = true;
                                                break;
                                            }
                                        }


                                        if (chatBot && chatBot.readyState === 1) chatBot.send(JSON.stringify({
                                            type: 'InstanceResult',
                                            username: info.username,
                                            result: foundPly,
                                            instance: info.instance
                                        }));
                                    } else if (typeof _G.Instance === 'undefined' && info.type === 'InstanceResult' && info.result === false && typeof _G.InData[info.username] === 'undefined') {
                                        
                                        _G.playerData[info.username] = {
                                            input: {},
                                            unpress: {},
                                            lastDir: 'L'
                                        };

                                        let ply = false;
                                        for (var i=0; i < _G.ents.All.length; i++) {
                                            if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === info.username) {
                                                ply = _G.ents.All[i];
                                            }
                                        }

                                        if (!ply) {
                                            ply = _G.ents.Create('player:' + info.username);
                                        }
                                        ply.Owner = info.username;
                                        ply.username = info.username;

                                        _G.playerData[info.username].ent = ply;
                                    } else if (info.type === 'Instance') {
                                        if ((!_G.Instance && parseInt(info.toInstance) === 0) || (_G.Instance && parseInt(info.toInstance) === _G.Instance)) {
                                            // Anti-duplication: despawn any pre-existing player with same owner
                                            for (let _dupI = _G.ents.All.length - 1; _dupI >= 0; _dupI--) {
                                                let _dupE = _G.ents.All[_dupI];
                                                if (!_dupE.ShouldRemove && _dupE.Owner === info.user && _dupE.class === 'player') {
                                                    if (!info.data) info.data = {};
                                                    if (_dupE.Inventory && !info.data.Inventory) info.data.Inventory = _dupE.Inventory;
                                                    _dupE.Despawn ? _dupE.Despawn() : (_dupE.ShouldRemove = true);
                                                }
                                            }

                                            let ply = _G.ents.Create('player:' + info.user),
                                                infoKeys = Object.keys(info.data);
                                            for (var i=0; i < infoKeys.length; i++) {
                                                ply[infoKeys[i]] = info.data[infoKeys[i]];
                                                
                                                if (infoKeys[i] === 'parts') {
                                                    for (var z=0; z < ply[infoKeys[i]].length; z++) {
                                                        if (typeof ply[infoKeys[i]][z].img === 'string') {
                                                            ply[infoKeys[i]][z].img = _G.Material(ply[infoKeys[i]][z].img);
                                                        }
                                                    }
                                                }

                                            }

                                            ply.pos = [200,200];

                                            //_G.InData[ply.Owner] = info.data;
                                            if (typeof _G.InData[ply.Owner] !== 'undefined') {
                                                _G.InData[ply.Owner] = undefined;
                                                delete _G.InData[ply.Owner];
                                            }

                                            _G.playerData[ply.Owner] = {
                                                input: {},
                                                unpress: {},
                                                lastDir: 'L'
                                            };
                                            _G.playerData[ply.Owner].ent = ply;

                                            if (info.holstered) {
                                                let wep = _G.ents.Create(info.holstered);
                                                _G.wep.BasicPickup(wep, ply, true);
                                                ply.Holster(ply);
                                            }
                                            setTimeout(function() {
                                                if (info.wep) {
                                                    let wep = _G.ents.Create(info.wep);
                                                    _G.wep.BasicPickup(wep, ply, true);
                                                }
                                            }, 1000)
                                        }

                                    } else if (info.type === 'Compendowntime') {
                                        let findPly = find(info.username);

                                        if (typeof findPly === 'object' && typeof foundPly.comp_528 === 'undefined') {
                                            if (typeof foundPly.ActiveWeapon === 'object' && foundPly.ActiveWeapon.class === 'hatchet') {
                                                foundPly.comp_528 = Date.now();
                                                foundPly.ActiveWeapon.class = 'hatchet_blue';
                                                foundPly.ActiveWeapon.parts[0].img = _G.Material('assets/img/hatchet-blue.png');
                                                sendChat('Redeemed the blue hatchet for 5/28 downtime @' + info.username)
                                            } else {
                                                sendChat('You must have a hatchet equipped in 2D world to claim the blue hatchet @' + info.username);
                                            }
                                        } else {
                                            sendChat('You already claimed the 2D World !compendowntime @' + info.username);
                                        }
                                    }*/
        }
    };

    chatBot.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
        console.log('Chatbot connection closed, attempting to reconnect...');

        setTimeout(function() {
            chatBotConnect();
        }, 1500);
    };

    chatBot.onerror = function(error) {
        console.log(`[error]`);
    };
}


chatBotConnect();

/*IF_END*/

window.addEventListener('error', function(ev) {
    console.log(ev)
    //sendChat(ev.message + ' ' + ev.lineno + ':' + ev.colno);
});

/*IF_SERVER*/
process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });
/*IF_END*/

if (document.location && document.location.toString().indexOf('&2ndstream') !== -1) {
    _G.SecondStream = true;
}

_G.equateXP = function(xp) {
    return Math.floor(xp + 300 * Math.pow(2, xp / 7));
};

_G.LevelToXP = function(level) {
    var xp = 0;

    for (var i = 1; i < level; i++)
        xp += _G.equateXP(i);

    return Math.floor(xp / 4);
};

_G.XPToLevel = function(xp) {
    var level = 1;

    while (_G.LevelToXP(level) < xp)
        level++;

    return level;
};

document.addEventListener('contextmenu', function(ev) {

    ev.preventDefault();
});

_G.ZoomScroll = _G.Instance ? 1 : 2.2;
document.addEventListener('wheel', function(e) {
    if (_G.LoadScreen || _G.ChatHover || _G.ChatInside || _G.Settings.style.display === 'block' || document.getElementsByClassName('game_panel').length > 0) {
        return;
    }

    let zoomAdd = (e.wheelDelta / 2500) * _G.viewport.zoomTo;

    if (_G.viewport.zoomTo > 0.2 || zoomAdd > 0) {
        _G.viewport.zoomTo += zoomAdd;
        if (_G.viewport.zoomTo < _G.ZoomMin) {
            zoomAdd = -(_G.ZoomMin - _G.viewport.zoomTo);
            _G.viewport.zoomTo = _G.ZoomMin;
        }
        if (_G.viewport.zoomTo > _G.ZoomMax) {
            zoomAdd = -(_G.viewport.zoomTo - _G.ZoomMax);
            _G.viewport.zoomTo = _G.ZoomMax;
        }
    } else {
        zoomAdd = 0;
    }

    _G.ZoomScroll += zoomAdd
    if (_G.ZoomScroll < _G.ZoomMin) {
        _G.ZoomScroll = _G.ZoomMin;
    } else if (_G.ZoomScroll > _G.ZoomMax) {
        _G.ZoomScroll = _G.ZoomMax;
    }
});

_G.MouseMove = {};

_G.downX = false;
_G.downY = false;
window.onmousedown = function(e) {
    window.focus();

    if (_G.LoadScreen || _G.ChatHover || _G.ChatInside || _G.Settings.style.display === 'block' || document.getElementsByClassName('game_panel').length > 0) {
        return;
    }

    if (typeof _G.MouseMove[e.button] !== 'undefined') {
        try {
            window.removeEventListener('mousemove', _G.MouseMove[e.button]);
        } catch (e) {}
        _G.MouseMove[e.button] = undefined;
        delete _G.MouseMove[e.button];
    }

    if (e.button === 2 && _G.CtrlDown && _G.LocalName === 'goosely' && !_G.LoadScreen && !_G.ChatHover && !_G.ChatInside) {
        let findMe = Player('goosely');
        if (typeof findMe === 'object') {
            let startX = findMe.pos[0],
                startY = findMe.pos[1];

            _G.downX = e.clientX;
            _G.downY = e.clientY;

            _G.MouseShow = _G.lastTick + 600;

            _G.MouseMove[e.button] = function(ev) {
                let diffX = (_G.downX - ev.clientX) * (1 / _G.viewport.zoom),
                    diffY = (_G.downY - ev.clientY) * (1 / _G.viewport.zoom);

                findMe.pos[0] = startX - diffX;
                findMe.pos[1] = startY - diffY;


                gameServer.send(
                    JSON.stringify({
                        type: 'AdminPos',
                        user: findMe.Owner,
                        pos: findMe.pos
                    })
                );

                _G.MouseShow = _G.lastTick + 600;
            };

            window.addEventListener('mousemove', _G.MouseMove[e.button]);

            e.preventDefault();
        }
    } else if (e.button === 2 && !_G.LoadScreen && !_G.ChatHover && !_G.ChatInside) {
        e.preventDefault();

        let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom)),
            scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

        _G.MousePos = [scrX + (e.clientX * (1 / _G.viewport.zoom)), scrY + (e.clientY * (1 / _G.viewport.zoom))];
        _G.clientX = e.clientX;
        _G.clientY = e.clientY;

        if (_G.clientX && _G.clientY && !_G.AnalogPos) {

            let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom)),
                scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

            _G.MousePos = [scrX + (_G.clientX * (1 / _G.viewport.zoom)), scrY + (_G.clientY * (1 / _G.viewport.zoom))];
        }

        gameServer.send(
            JSON.stringify({
                type: 'Mouse',
                button: e.button,
                pos: _G.MousePos,
                key_position: 'down'
            })
        );

        _G.MouseDown[e.button] = _G.lastTick;
        _G.MouseShow = _G.lastTick + 600;

        if (_G.LocalName) {
            if (typeof _G.playerData[_G.LocalName] !== 'undefined') {
                _G.playerData[_G.LocalName].mouse[e.button] = {
                    pos: _G.MousePos,
                    key_position: 'down'
                };
            }

            _G.MouseMove[e.button] = function(ev) {
                if (!_G.LoadScreen && !_G.ChatInside && _G.Settings.style.display !== 'block' && document.getElementsByClassName('game_panel').length === 0) {
                    scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom));
                    scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

                    _G.MousePos = [scrX + (ev.clientX * (1 / _G.viewport.zoom)), scrY + (ev.clientY * (1 / _G.viewport.zoom))];
                    _G.clientX = ev.clientX;
                    _G.clientY = ev.clientY;

                    if (_G.clientX && _G.clientY && !_G.AnalogPos) {

                        let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom)),
                            scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

                        _G.MousePos = [scrX + (_G.clientX * (1 / _G.viewport.zoom)), scrY + (_G.clientY * (1 / _G.viewport.zoom))];
                    }


                    gameServer.send(
                        JSON.stringify({
                            type: 'Mouse',
                            button: e.button,
                            pos: _G.MousePos,
                            key_position: 'down'
                        })
                    );

                    _G.MouseShow = _G.lastTick + 600;
                }
            };
            window.addEventListener('mousemove', _G.MouseMove[e.button]);

            /*
            ws.onmessage({
                data: JSON.stringify({
                    user: _G.LocalName,
                    command: keyInfo[ev.keyCode],
                    key_position: key_position
                })
            });
            */
        }
    } else if (e.button === 0 && !_G.LoadScreen && !_G.ChatHover && !_G.ChatInside && document.getElementsByClassName('game_panel').length === 0) {
        let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom)),
            scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

        _G.MouseDown[e.button] = _G.lastTick;
        //console.log(e);

        _G.downX = e.clientX;
        _G.downY = e.clientY;

        _G.MouseShow = _G.lastTick + 600;
        _G.MousePos = [scrX + (_G.downX * (1 / _G.viewport.zoom)), scrY + (_G.downY * (1 / _G.viewport.zoom))];
        _G.clientX = _G.downX;
        _G.clientY = _G.downY;

        if (_G.CtrlDown && _G.LocalPlayer && _G.LocalPlayer.ActiveWeapon && _G.LocalPlayer.ActiveWeapon.class === 'hammer') {
            _G.MouseMesh = [Math.floor(_G.MousePos[0] / 10) * 10, Math.floor(_G.MousePos[1] / 10) * 10];
        }

        gameServer.send(
            JSON.stringify({
                type: 'Mouse',
                button: e.button,
                pos: _G.MousePos,
                key_position: 'down'
            })
        );

        e.preventDefault();

        let viewportX = _G.viewport.x,
            viewportY = _G.viewport.y;

        if (!_G.MouseDown[2]) {
            _G.MouseMove[e.button] = function(ev) {
                if (_G.MouseDown[0] && (!_G.MouseMesh || !_G.CtrlDown) && _G.lastTick - _G.MouseDown[0] > 150 && !_G.LoadScreen && !_G.ChatHover && !_G.ChatInside && _G.Settings.style.display !== 'block' && document.getElementsByClassName('game_panel').length === 0) {
                    let diffX = (_G.downX - ev.clientX) * (1 / _G.viewport.zoom),
                        diffY = (_G.downY - ev.clientY) * (1 / _G.viewport.zoom);

                    _G.viewport.xTo = (viewportX + diffX);
                    _G.viewport.yTo = (viewportY + diffY);

                    //console.log(_G.viewport);

                    _G.MouseShow = _G.lastTick + 600;
                }

                _G.clientX = ev.clientX;
                _G.clientY = ev.clientY;

                if (_G.clientX && _G.clientY && !_G.AnalogPos) {

                    let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom)),
                        scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

                    _G.MousePos = [scrX + (_G.clientX * (1 / _G.viewport.zoom)), scrY + (_G.clientY * (1 / _G.viewport.zoom))];
                }

            };

            window.addEventListener('mousemove', _G.MouseMove[e.button]);

        }
    }
};

window.onmouseup = function(e) {
    if (_G.YTVideo && _G.YTPlayer && !_G.YTPlayed && typeof _G.YTReceived !== 'undefined') {

        _G.YTPlayed = true;
        _G.YTPlayer.setVolume(_G.YTVolume);
        _G.YTPlayer.unMute();
        _G.YTPlayer.playVideo();
    }

    if (_G.LoadScreen || _G.ChatHover || _G.ChatInside || document.getElementsByClassName('game_panel').length > 0) {
        return;
    }

    //console.log(e);
    _G.downX = false;
    _G.downY = false;
    let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom));
    scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

    _G.MousePos = [scrX + (e.clientX * (1 / _G.viewport.zoom)), scrY + (e.clientY * (1 / _G.viewport.zoom))];

    if (e.button === 2) {
        _G.clientX = undefined;
        _G.clientY = undefined;
    }

    if (typeof _G.MouseDown[e.button] !== 'undefined') {
        _G.MouseDown[e.button] = undefined;
        delete _G.MouseDown[e.button];
    }


    if (_G.MouseMesh && e.button === 0) {
        let MeshPos = [_G.MouseMesh[0], _G.MouseMesh[1]],
            MeshSize = [_G.MousePos[0] - _G.MouseMesh[0], _G.MousePos[1] - _G.MouseMesh[1]];

        if (_G.MousePos[0] < MeshPos[0]) {
            MeshPos[0] = _G.MousePos[0];
            MeshSize[0] = Math.abs(_G.MousePos[0] - _G.MouseMesh[0]);
        }
        if (_G.MousePos[1] < MeshPos[1]) {
            MeshPos[1] = _G.MousePos[1];
            MeshSize[1] = Math.abs(_G.MousePos[1] - _G.MouseMesh[1]);
        }

        gameServer.send(
            JSON.stringify({
                type: 'MouseMesh',
                pos: MeshPos,
                w: MeshSize[0],
                h: MeshSize[1],
                rotate: _G.MouseMeshR
            })
        );

        _G.MouseMesh = undefined;
        delete _G.MouseMesh;

        _G.MouseMeshR = undefined;
        delete _G.MouseMeshR;
    }

    gameServer.send(
        JSON.stringify({
            type: 'Mouse',
            button: e.button,
            pos: _G.MousePos,
            key_position: 'up'
        })
    );

    _G.MouseShow = _G.lastTick + 600;

    //window.onmousemove = function(ev) { };
    if (typeof _G.MouseMove[e.button] !== 'undefined') {
        try {
            window.removeEventListener('mousemove', _G.MouseMove[e.button]);
        } catch (e) {}
        _G.MouseMove[e.button] = undefined;
        delete _G.MouseMove[e.button];
    }
};


_G.renderBBox = 0;

let F10Down = false;
document.addEventListener('keyup', function(event) {
    if (F10Down && event.key === 'F10') {
        F10Down = false;
        _G.renderBBox++;
        if (_G.renderBBox >= 3) {
            _G.renderBBox = 0;
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (!F10Down && event.key === 'F10') {
        F10Down = true;
        _G.renderBBox++;
        if (_G.renderBBox >= 3) {
            _G.renderBBox = 0;
        }
    }
});

_G.distance = function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
}

_G.Sounds = {};
/*IF_CLIENT*/
_G.Sound = function(path) {
    //return new Audio(path);
    if (typeof _G.Sounds[path] !== 'undefined') {
        return _G.Sounds[path];
    }

    let sndID = 0;
    _G.Sounds[path] = {
        afterLoad: [],
        cloneNode: function(deep, pos) {
            let audioID = sndID;
            let audioData = {
                type: 'Audio',
                file: path,
                id: audioID
            };

            if (typeof pos === 'object') {
                audioData.pos = pos;
            }

            /*
            return {
                pause: function() { },
                play: function() { },
                destroy: function() { },
                volume: 0
            }*/
            audioData.volume = 0.3;
            audioData.gain = false;
            audioData.source = false;

            audioData.play = function() {
                if (_G.Sounds[path].afterLoad) {
                    _G.Sounds[path].afterLoad.push(audioData);
                    return;
                }
                var source = _G.AudioContext.createBufferSource(); // creates a sound source
                source.buffer = _G.Sounds[path].buffer; // tell the source which sound to play
                //source.connect(_G.AudioContext.destination);          // connect the source to the context's destination (the speakers)
                var gainNode = _G.AudioContext.createGain(); // Create a gain node
                source.connect(gainNode); // Connect the source to the gain node
                gainNode.connect(_G.AudioContext.destination); // Connect the gain node to the destination
                gainNode.gain.value = audioData.volume; // Set the volume
                source.start(0);

                audioData.source = source;
                audioData.gain = gainNode;
            };

            audioData.pause = function() {
                if (audioData.source) {
                    audioData.source.disconnect();
                }
                if (audioData.gain) {
                    audioData.gain.disconnect();
                }
            };

            audioData.destroy = function() {
                if (_G.Sounds[path].afterLoad && _G.Sounds[path].afterLoad.indexOf(audioData) !== -1) {
                    _G.Sounds[path].afterLoad.splice(_G.Sounds[path].afterLoad.indexOf(audioData), 1);
                    return;
                }
                if (audioData.source) {
                    audioData.source.disconnect();
                }
                if (audioData.source) {
                    audioData.gain.disconnect();
                }

            };

            sndID += 1;

            return audioData;
        },
        pause: function() {},
        play: function() {

        },
        destroy: function() {},
        volume: 0
    };

    var request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    // Decode asynchronously
    request.onload = function() {
        _G.AudioContext.decodeAudioData(request.response, function(buffer) {
            if (!buffer) {
                console.log('Error decoding file data: ' + url);
                return;
            }

            _G.Sounds[path].buffer = buffer;
            if (_G.Sounds[path].afterLoad.length > 0) {
                for (var i = 0; i < _G.Sounds[path].afterLoad.length; i++) {
                    _G.Sounds[path].afterLoad[i].play();
                }
            }
            _G.Sounds[path].afterLoad = undefined;
        });
    };
    request.onerror = function() {
        console.log('BufferLoader: XHR error');
    };
    request.send();

    return _G.Sounds[path];
}
/*IF_END*/
/*IF_SERVER*/
_G.Sound = function(path) {
    return new Audio(path);
    /*
    if (typeof _G.Sounds[path] !== 'undefined') {
        return _G.Sounds[path];
    }

    _G.Sounds[path] = new Audio(path);
    return _G.Sounds[path];
    */
}
/*IF_END*/
_G.SoundsActive = {};

_G.Materials = {
    loading: document.getElementById('img-loading')
};
_G.Material = function(path) {
    if (_G.SERVER) {
        return path;
    }

    if (typeof _G.Materials[path] !== 'undefined') {
        return _G.Materials[path];
    } else {
        /*
        let newMaterial = document.createElement('img');
        newMaterial.setAttribute('src', path);
        document.getElementById('img-container').appendChild(newMaterial);
        */
        _G.Materials[path] = _G.Materials.loading;

        let newMaterial = new Image();
        newMaterial.src = path;

        _G.Materials[path] = newMaterial;

        return _G.Materials[path];
    }
};

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

function angleToRadians(ang) {
    return ang * (Math.PI / 180);
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w, // x-end
        ye = y + h, // y-end
        xm = x + w / 2, // x-middle
        ym = y + h / 2; // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.fill();
    ctx.closePath();
}

function drawImg(image, x, y, w, h, scale, rotation) {
    //ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    ctx.translate(x, y);
    ctx.scale(scale, 1);
    if (rotation !== 0) {
        ctx.rotate(rotation);
    }
    ctx.drawImg(image, -w / 2, -h / 2, w, h);
}

_G.footsteps = {
    grass: [
        'assets/sound/footsteps/grass1.wav',
        'assets/sound/footsteps/grass2.wav',
        'assets/sound/footsteps/grass3.wav',
        'assets/sound/footsteps/grass4.wav'
    ],
    concrete: [
        'assets/sound/footsteps/concrete1.wav',
        'assets/sound/footsteps/concrete2.wav',
        'assets/sound/footsteps/concrete3.wav',
        'assets/sound/footsteps/concrete4.wav'
    ]
}

_G.sounds = {
    furnace: _G.Sound('assets/sound/furnace.wav'),
    hammering: _G.Sound('assets/sound/hammering.wav'),
    sprint: _G.Sound('assets/sound/suit_sprint.wav'),
    use: _G.Sound('assets/sound/use.wav'),
    equipAmmo: _G.Sound('assets/sound/equip_ammo.wav'),
    engine_start: _G.Sound('assets/sound/v8_start_loop1.wav'),
    engine_stop: _G.Sound('assets/sound/v8_stop1.wav'),
    pistol: [
        _G.Sound('assets/sound/weapons/pistol/pistol_fire2.wav')
    ],
    pistol_empty: _G.Sound('assets/sound/weapons/pistol/pistol_empty.wav'),
    smg: [
        _G.Sound('assets/sound/smg.wav')
    ],
    impacts: {
        weapons: [
            _G.Sound('assets/sound/weapon_impact_soft1.wav'),
            _G.Sound('assets/sound/weapon_impact_soft2.wav'),
            _G.Sound('assets/sound/weapon_impact_soft3.wav')
        ],
        pain_ply: [
            _G.Sound('assets/sound/pl_pain5.wav'),
            _G.Sound('assets/sound/pl_pain6.wav'),
            _G.Sound('assets/sound/pl_pain7.wav')
        ],
        wood: [
            _G.Sound('assets/sound/wood_plank_impact_hard1.wav'),
            _G.Sound('assets/sound/wood_plank_impact_hard2.wav'),
            _G.Sound('assets/sound/wood_plank_impact_hard3.wav'),
            _G.Sound('assets/sound/wood_plank_impact_hard4.wav'),
            _G.Sound('assets/sound/wood_plank_impact_hard5.wav')
        ],
        rock: [
            _G.Sound('assets/sound/rock_impact_hard1.wav'),
            _G.Sound('assets/sound/rock_impact_hard2.wav'),
            _G.Sound('assets/sound/rock_impact_hard3.wav'),
            _G.Sound('assets/sound/rock_impact_hard4.wav'),
            _G.Sound('assets/sound/rock_impact_hard5.wav'),
            _G.Sound('assets/sound/rock_impact_hard6.wav'),
        ]
    },
    gawrsh: _G.Sound('assets/sound/gawrsh.wav'),
    jihad: _G.Sound('assets/sound/jihad.wav'),
    big_explosion: _G.Sound('assets/sound/big_explosion.wav'),
    smoke_inhale: _G.Sound('assets/sound/smoke.wav'),
    explosions: [
        _G.Sound('assets/sound/explode3.wav'),
        _G.Sound('assets/sound/explode4.wav'),
        _G.Sound('assets/sound/explode5.wav')
    ],
    tinder: [
        _G.Sound('assets/sound/lighter1.wav'),
        _G.Sound('assets/sound/lighter2.wav')
    ],
    ignite: _G.Sound('assets/sound/ignite.wav'),
    sizzle: _G.Sound('assets/sound/sizzle.wav'),
    cook: _G.Sound('assets/sound/cook.wav'),
    shovel: _G.Sound('assets/sound/shovel.wav'),
    raking: _G.Sound('assets/sound/raking.wav')
};

_G.skillsImg = _G.Material('assets/img/skills.png');

_G.DownArrow = _G.Material('assets/img/down.png');

_G.skills = [{
        name: 'Attack'
    },
    {
        name: 'Health'
    },
    {
        name: 'Mining'
    },
    {
        name: 'Strength'
    },
    {
        name: 'Agility'
    },
    {
        name: 'Smithing'
    },
    {
        name: 'Defence'
    },
    {
        name: 'Herbology'
    },
    {
        name: 'Fishing'
    },
    {
        name: 'Ranged'
    },
    {
        name: 'Thieving'
    },
    {
        name: 'Cooking'
    },
    {
        name: 'Prayer'
    },
    {
        name: 'Crafting'
    },
    {
        name: 'Firemaking'
    },
    {
        name: 'Magic'
    },
    {
        name: 'Fletching'
    },
    {
        name: 'Woodcutting'
    },
    {
        name: 'Runecrafting'
    },
    {
        name: 'Slayer'
    },
    {
        name: 'Farming'
    },
    {
        name: 'Construction'
    },
    {
        name: 'Hunting'
    }
]

_G.items = {
    'weapon_pistol_wood': {
        name: 'Wood Pistol',
        desc: 'Cheap ranged weapon. Requires ammo.',
        img: _G.Material('assets/img/pistol-wood.png'),
        dropItem: 'weapon_pistol_wood'
    },
    'weapon_smg': {
        name: 'SMG',
        desc: 'Fast-firing automatic weapon. Uses SMG ammo.',
        img: _G.Material('assets/img/smg.png'),
        dropItem: 'weapon_smg'
    },
    'hatchet': {
        name: 'Hatchet',
        desc: 'Chops trees for wood logs.',
        img: _G.Material('assets/img/hatchet.png'),
        dropItem: 'hatchet'
    },
    'sword_bronze': {
        name: 'Bronze Sword',
        desc: 'Melee weapon. Good starter sword.',
        img: _G.Material('assets/img/sword_bronze.png'),
        dropItem: 'sword_bronze'
    },
    'sword_iron': {
        name: 'Iron Sword',
        desc: 'Stronger melee weapon. Good for combat.',
        img: _G.Material('assets/img/sword_iron.png'),
        dropItem: 'sword_iron'
    },
    'rock': {
        name: 'Rock',
        desc: 'Throwable rock. Sell to Dick Head for coins.',
        img: _G.Material('assets/img/rock.png'),
        dropItem: 'rock'
    },
    'hatchet_blue': {
        name: 'Blue Hatchet',
        img: _G.Material('assets/img/hatchet-blue.png'),
        dropItem: 'hatchet_blue'
    },
    'hatchet_bronze': {
        name: 'Bronze Hatchet',
        img: _G.Material('assets/img/hatchet_bronze.png'),
        dropItem: 'hatchet_bronze'
    },
    'hatchet_iron': {
        name: 'Iron Hatchet',
        img: _G.Material('assets/img/hatchet_iron.png'),
        dropItem: 'hatchet_iron'
    },
    'hatchet_steel': {
        name: 'Steel Hatchet',
        img: _G.Material('assets/img/hatchet_steel.png'),
        dropItem: 'hatchet_steel'
    },
    'rake': {
        name: 'Rake',
        img: _G.Material('assets/img/rake.png'),
        dropItem: 'rake'
    },
    'pickaxe': {
        name: 'Wood Pickaxe',
        img: _G.Material('assets/img/pickaxe_wood.png'),
        dropItem: 'pickaxe'
    },
    'pickaxe_bronze': {
        name: 'Bronze Pickaxe',
        img: _G.Material('assets/img/pickaxe_bronze.png'),
        dropItem: 'pickaxe_bronze'
    },
    'pickaxe_iron': {
        name: 'Iron Pickaxe',
        img: _G.Material('assets/img/pickaxe_iron.png'),
        dropItem: 'pickaxe_iron'
    },
    'pickaxe_steel': {
        name: 'Steel Pickaxe',
        img: _G.Material('assets/img/pickaxe_steel.png'),
        dropItem: 'pickaxe_steel'
    },
    'hammer': {
        name: 'Hammer',
        img: _G.Material('assets/img/hammer.png'),
        dropItem: 'hammer'
    },
    'tinderbox': {
        name: 'Tinderbox',
        img: _G.Material('assets/img/tinderbox.png'),
        dropItem: 'tinderbox'
    },
    'jihad': {
        name: 'Jihad',
        img: _G.Material('assets/img/jihad.png'),
        dropItem: 'jihad'
    },
    'logs': {
        name: 'Logs',
        img: _G.Material('assets/img/logs.png'),
        dropItem: 'logs',
        pickupItem: 'logs'
    },
    'charms': {
        name: 'Charms',
        img: _G.Material('assets/img/gamecharms.png'),
        dropItem: 'charms',
        pickupItem: 'charms'
    },
    'chips': {
        name: 'Chips',
        img: _G.Material('assets/img/chips.png'),
        dropItem: 'chips',
        pickupItem: 'chips'
    },
    'bug_token': {
        name: 'Bug Token',
        img: _G.Material('assets/img/bug_token.png'),
        dropItem: 'bug_token',
        pickupItem: 'bug_token'
    },
    'logs_oak': {
        name: 'Oak Logs',
        img: _G.Material('assets/img/logs_oak.png'),
        dropItem: 'logs_oak',
        pickupItem: 'logs_oak'
    },
    'metal': {
        name: 'Bronze Bar',
        img: _G.Material('assets/img/metal.png'),
        dropItem: 'metal'
    },
    'metal_iron': {
        name: 'Iron Bar',
        img: _G.Material('assets/img/metal_iron.png'),
        dropItem: 'metal_iron'
    },
    'metal_steel': {
        name: 'Steel Bar',
        img: _G.Material('assets/img/metal_steel.png'),
        dropItem: 'metal_steel'
    },
    'ore_tin': {
        name: 'Tin Ore',
        img: _G.Material('assets/img/ore_tin.png'),
        dropItem: 'ore_tin'
    },
    'ore_copper': {
        name: 'Copper Ore',
        img: _G.Material('assets/img/ore_copper.png'),
        dropItem: 'ore_copper'
    },
    'ore_iron': {
        name: 'Iron Ore',
        img: _G.Material('assets/img/ore_iron.png'),
        dropItem: 'ore_iron'
    },
    'ore_coal': {
        name: 'Coal Ore',
        img: _G.Material('assets/img/ore_coal.png'),
        dropItem: 'ore_coal'
    },
    'scratch_lamp': {
        name: 'Lamp Scratcher 9',
        img: _G.Material('assets/img/magic_lamp/bg_3by3.png'),
        dropItem: 'scratch_lamp',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_lamp', 'magic_lamp', 9)
        },
        UseName: 'Scratch'
    },
    'scratch_lamp3': {
        name: 'Lamp Scratcher 3',
        img: _G.Material('assets/img/magic_lamp/bg_3by1.png'),
        dropItem: 'scratch_lamp',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_lamp3', 'magic_lamp', 3)
        },
        UseName: 'Scratch'
    },
    'scratch_pirate': {
        name: 'Pirate Scratcher 9',
        img: _G.Material('assets/img/pirates/bg_3by3.png'),
        dropItem: 'scratch_pirate',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_pirate', 'pirates', 9)
        },
        UseName: 'Scratch'
    },
    'scratch_pirate3': {
        name: 'Pirate Scratcher 3',
        img: _G.Material('assets/img/pirates/bg_3by1.png'),
        dropItem: 'scratch_pirate3',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_pirate3', 'pirates', 3)
        },
        UseName: 'Scratch'
    },
    'scratch_mine': {
        name: 'Mine Scratcher 9',
        img: _G.Material('assets/img/mine/bg_3by3.png'),
        dropItem: 'scratch_mine',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_mine', 'mine', 9)
        },
        UseName: 'Scratch'
    },
    'scratch_mine3': {
        name: 'Mine Scratcher 3',
        img: _G.Material('assets/img/mine/bg_3by1.png'),
        dropItem: 'scratch_mine3',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_mine3', 'mine', 3)
        },
        UseName: 'Scratch'
    },
    'scratch_slots': {
        name: 'Slots Scratcher',
        img: _G.Material('assets/img/slots/bg.png'),
        dropItem: 'scratch_slots',
        Use: function(ply) {
            _G.ScratchCardUse(ply, 'scratch_slots', 'slots', 3)
        },
        UseName: 'Scratch'
    },
    'berries': {
        name: 'Berries',
        img: _G.Material('assets/img/berries.png'),
        dropItem: 'berries',
        Use: function(ply) {
            ply.Health += 3;
            if (ply.Health > ply.HealthMax) {
                ply.Health = ply.HealthMax;
            }
            ply.ShowNotify('Ate berries (+3 HP)', 2000);
        },
        UseName: 'Eat'
    },
    'diet_cola': {
        name: 'Diet Cola',
        img: _G.Material('assets/img/diet_cola.png'),
        dropItem: 'diet_cola',
        Use: function(ply) {
            ply.Health += 10;
            if (ply.Health > ply.HealthMax) {
                ply.Health = ply.HealthMax;
            }
            ply.ShowNotify('Drank Diet Cola (+10 HP)', 2000);
        },
        UseName: 'Drink'
    },
    'bones': {
        name: 'Bones',
        img: _G.Material('assets/img/bones.png'),
        dropItem: 'bones'
    },
    'soup_berries': {
        name: 'Berry Soup',
        img: _G.Material('assets/img/soup_berries.png'),
        dropItem: 'soup_berries',
        Use: function(ply) {
            ply.Health += 20;
            if (ply.Health > ply.HealthMax) {
                ply.Health = ply.HealthMax;
            }
            ply.ShowNotify('Ate Berry Soup (+20 HP)', 2000);
        },
        UseName: 'Eat'
    },
    'grenade_beancan': {
        name: 'Beancan Nade',
        img: _G.Material('assets/img/grenade_beancan.png'),
        dropItem: 'grenade_beancan'
    },
    't-berries': {
        name: 'Turd Berries',
        img: _G.Material('assets/img/turd-berries.png'),
        dropItem: 't-berries',
        Use: function(ply) {
            ply.Health += 100;
            if (ply.Health > ply.HealthMax) {
                ply.Health = ply.HealthMax;
            }
            ply.ShowNotify('Ate Turd Berries (+100 HP)', 2000);
        },
        UseName: 'Eat'
    },
    'meth': {
        name: 'Meth',
        img: _G.Material('assets/img/meth.png'),
        dropItem: 'meth',
        Use: function(ply) {
            ply.OnMeth = _G.lastTick;

            let smokeSound = _G.sounds.smoke_inhale.cloneNode(true, ply.pos);
            smokeSound.volume = 0.5;
            smokeSound.play();

            ply.ShowNotify('Smoked meth', 2000);

            ply.invOpen = undefined;
            ply.invSlot = undefined;
            ply.conSlot = undefined;
            ply.conScroll = 0;

            if (ply.container) {
                ply.container.IsOpen = undefined;
                ply.container = undefined;
            }

            setTimeout(function() {
                var dust = _G.ents.Create('dust_smoke');
                dust.pos = [ply.pos[0] + 5, ply.pos[1]];
                dust.direction = -1;
            }, 2000);
        },
        UseName: 'Smoke'
    },
    'methylamine': {
        name: 'Methylamine',
        img: _G.Material('assets/img/methylamine.png'),
        dropItem: 'methylamine'
    },
    'cat_poop': {
        name: 'Cat Poop',
        img: _G.Material('assets/img/cat_poop.png'),
        dropItem: 'cat_poop',
        Use: function(ply) {
            ply.ShowNotify('💩 Ate cat poop 💩', 2000);
            sendChat('@' + ply.Owner + ' pulled a Dustin and ate cat poop for no reason.')

            ply.invOpen = undefined;
            ply.invSlot = undefined;
            ply.conSlot = undefined;
            ply.conScroll = 0;

            if (ply.container) {
                ply.container.IsOpen = undefined;
                ply.container = undefined;
            }
        },
        UseName: 'Eat'
    },
    'lab_upgrade': {
        name: 'Lab Upgrade',
        img: _G.Material('assets/img/lab_upgrade.png'),
        dropItem: 'lab_upgrade'
    },
    'upgrade_radius': {
        name: 'Radius Upgrade',
        img: _G.Material('assets/img/upgrade_radius.png'),
        dropItem: 'upgrade_radius'
    },
    'weed': {
        name: 'Weed',
        img: _G.Material('assets/img/nugs.png'),
        dropItem: 'weed',
        Use: function(ply) {
            ply.Health += 40;
            if (ply.Health > ply.HealthMax) {
                ply.Health = ply.HealthMax;
            }

            let smokeSound = _G.sounds.smoke_inhale.cloneNode(true, ply.pos);
            smokeSound.volume = 0.5;
            smokeSound.play();

            ply.ShowNotify('Smoked weed (+40 HP)', 2000);

            ply.invOpen = undefined;
            ply.invSlot = undefined;
            ply.conSlot = undefined;
            ply.conScroll = 0;

            if (ply.container) {
                ply.container.IsOpen = undefined;
                ply.container = undefined;
            }

            setTimeout(function() {
                var dust = _G.ents.Create('dust_smoke');
                dust.pos = [ply.pos[0] + 5, ply.pos[1]];
                dust.direction = -1;
            }, 2000);
        },
        UseName: 'Smoke'
    },
    'weed_seed': {
        name: 'Weed Seed',
        img: _G.Material('assets/img/seeds.png'),
        dropItem: 'weed_seed'
    },
    'ammo_pistol': {
        name: 'Pistol Ammo',
        img: _G.Material('assets/img/ammo.png'),
        dropItem: 'ammo_pistol'
    },
    'ammo_smg': {
        name: 'SMG Ammo',
        img: _G.Material('assets/img/ammo_smg.png'),
        dropItem: 'ammo_smg'
    },
    // ── NEW WEAPONS ───────────────────────────────────────────────────────────
    'weapon_shotgun': {
        name: 'Shotgun',
        desc: 'Powerful close-range scatter weapon. Uses shotgun shells.',
        img: _G.Material('assets/img/shotgun.png'),
        dropItem: 'weapon_shotgun'
    },
    'ammo_shotgun': {
        name: 'Shotgun Shells',
        desc: 'Ammunition for the shotgun.',
        img: _G.Material('assets/img/ammo_shotgun.png'),
        dropItem: 'ammo_shotgun'
    },
    'weapon_bow': {
        name: 'Bow',
        desc: 'Silent ranged weapon. Fires arrows.',
        img: _G.Material('assets/img/bow.png'),
        dropItem: 'weapon_bow'
    },
    'ammo_arrow': {
        name: 'Arrow',
        desc: 'Ammunition for the bow.',
        img: _G.Material('assets/img/arrow.png'),
        dropItem: 'ammo_arrow'
    },
    // ── ARMOR & HATS ──────────────────────────────────────────────────────────
    'armor_wood_helmet': {
        name: 'Wood Helmet',
        desc: 'Basic head protection. Reduces damage by 10%.',
        img: _G.Material('assets/img/armor_wood_helmet.png'),
        dropItem: 'armor_wood_helmet',
        ArmorSlot: 'head',
        ArmorVal: 0.10,
        Use: function(ply) { _G.EquipArmor(ply, 'armor_wood_helmet'); },
        UseName: 'Equip'
    },
    'armor_iron_helmet': {
        name: 'Iron Helmet',
        desc: 'Sturdy iron head armor. Reduces damage by 18%.',
        img: _G.Material('assets/img/armor_iron_helmet.png'),
        dropItem: 'armor_iron_helmet',
        ArmorSlot: 'head',
        ArmorVal: 0.18,
        Use: function(ply) { _G.EquipArmor(ply, 'armor_iron_helmet'); },
        UseName: 'Equip'
    },
    'armor_steel_helmet': {
        name: 'Steel Helmet',
        desc: 'Heavy-duty steel helm. Reduces damage by 28%.',
        img: _G.Material('assets/img/armor_steel_helmet.png'),
        dropItem: 'armor_steel_helmet',
        ArmorSlot: 'head',
        ArmorVal: 0.28,
        Use: function(ply) { _G.EquipArmor(ply, 'armor_steel_helmet'); },
        UseName: 'Equip'
    },
    'armor_wood_chest': {
        name: 'Wood Chest Armor',
        desc: 'Strapped-on logs. Reduces damage by 15%.',
        img: _G.Material('assets/img/armor_wood_chest.png'),
        dropItem: 'armor_wood_chest',
        ArmorSlot: 'body',
        ArmorVal: 0.15,
        Use: function(ply) { _G.EquipArmor(ply, 'armor_wood_chest'); },
        UseName: 'Equip'
    },
    'armor_iron_chest': {
        name: 'Iron Chest Armor',
        desc: 'Forged iron plate. Reduces damage by 25%.',
        img: _G.Material('assets/img/armor_iron_chest.png'),
        dropItem: 'armor_iron_chest',
        ArmorSlot: 'body',
        ArmorVal: 0.25,
        Use: function(ply) { _G.EquipArmor(ply, 'armor_iron_chest'); },
        UseName: 'Equip'
    },
    'armor_steel_chest': {
        name: 'Steel Chest Armor',
        desc: 'Heavy steel plate. Reduces damage by 35%.',
        img: _G.Material('assets/img/armor_steel_chest.png'),
        dropItem: 'armor_steel_chest',
        ArmorSlot: 'body',
        ArmorVal: 0.35,
        Use: function(ply) { _G.EquipArmor(ply, 'armor_steel_chest'); },
        UseName: 'Equip'
    },
    'hat_cowboy': {
        name: 'Cowboy Hat',
        desc: 'Yeehaw! The classic hobo headwear.',
        img: _G.Material('assets/img/hat_cowboy.png'),
        dropItem: 'hat_cowboy',
        ArmorSlot: 'head',
        ArmorVal: 0.02,
        Use: function(ply) { _G.EquipArmor(ply, 'hat_cowboy'); },
        UseName: 'Equip'
    },
    'hat_tophat': {
        name: 'Top Hat',
        desc: 'For the distinguished hobo. Style over substance.',
        img: _G.Material('assets/img/hat_tophat.png'),
        dropItem: 'hat_tophat',
        ArmorSlot: 'head',
        ArmorVal: 0.0,
        Use: function(ply) { _G.EquipArmor(ply, 'hat_tophat'); },
        UseName: 'Equip'
    },
    'hat_bucket': {
        name: 'Bucket Hat',
        desc: 'A bucket. On your head. Reduces damage by 5%.',
        img: _G.Material('assets/img/hat_bucket.png'),
        dropItem: 'hat_bucket',
        ArmorSlot: 'head',
        ArmorVal: 0.05,
        Use: function(ply) { _G.EquipArmor(ply, 'hat_bucket'); },
        UseName: 'Equip'
    }
};

_G.npcs = {
    'npc_goblin': {
        nametag: 'Goblin',
        lvl: 3,
        DistanceFromHome: 920,
        Speed: 1.23,
        AttackSpeed: 350,
        AttackDelay: 1000,
        AttackDamage: 10,
        HealthMax: 100,
        bbox: [-28, -44, 56, 96],
        parts: [{
            name: 'npc',
            type: 'drawImg',
            img: _G.Material('assets/img/goblin.png'),
            x: 0,
            y: 0,
            w: 76,
            h: 110,
            rotate: 0,
            interpDir: -1
        }],
        DeathDrops: _G.Instance !== 3 ? [{
                item: 'charms',
                am: [2, 13],
                chance: 100
            },
            {
                item: 'bones',
                am: 1,
                chance: 100
            }
        ] : [{
                item: 'berries',
                am: [3, 6],
                chance: 50
            },
            {
                item: 'charms',
                am: [2, 5],
                chance: 80
            }
        ]
    },
    'npc_guard_noob': {
        DistanceFromHome: 448,
        Speed: 1.4,
        AttackSpeed: 350,
        AttackDelay: 1000,
        AttackDamage: _G.Instance !== 3 ? 10 : 8,
        HealthMax: 100,
        bbox: [-32, -64, 64, 126],
        parts: [{
            name: 'npc',
            type: 'drawImg',
            img: _G.Material('assets/img/guard_noob.png'),
            x: 0,
            y: 0,
            w: 64,
            h: 128,
            rotate: 0,
            interpDir: -1
        }],
        DeathDrops: _G.Instance !== 3 ? [{
                item: 'charms',
                am: [4, 19],
                chance: 100
            },
            {
                item: 'bones',
                am: 1,
                chance: 100
            }
        ] : [{
                item: 'berries',
                am: [3, 6],
                chance: 50
            },
            {
                item: 'ammo_pistol',
                am: [2, 6],
                chance: 50
            },
            {
                item: 'charms',
                am: [2, 5],
                chance: 80
            }
        ]
    },
    'npc_guard_mid1': {
        DistanceFromHome: 2000,
        Speed: 1.5,
        AttackSpeed: 320,
        AttackDelay: 900,
        AttackDamage: 10,
        HealthMax: 200,
        bbox: [-32, -64, 64, 126],
        parts: [{
            name: 'npc',
            type: 'drawImg',
            img: _G.Material('assets/img/guard_mid.png'),
            x: 0,
            y: 0,
            w: 64,
            h: 128,
            rotate: 0,
            interpDir: -1
        }],
        DeathDrops: _G.Instance !== 3 ? [{
                item: 'charms',
                am: [8, 22],
                chance: 100
            },
            {
                item: 'bones',
                am: 1,
                chance: 100
            }
        ] : [{
                item: 'soup_berries',
                am: [1, 2],
                chance: 50
            },
            {
                item: 'berries',
                am: [4, 10],
                chance: 50
            },
            {
                item: 'ammo_pistol',
                am: [2, 7],
                chance: 80
            },
            {
                item: 'charms',
                am: [2, 5],
                chance: 80
            }
        ]
    },
    'npc_cat': {
        nametag: 'Cat',
        lvl: 1,
        DistanceFromHome: 548,
        Speed: _G.Instance !== 3 ? 1.01 : 1.08,
        AttackSpeed: 250,
        AttackDelay: 620,
        AttackDamage: 3,
        AttackRotate: -60,
        HealthMax: 70,
        bbox: [-24, -24, 58, 58],
        parts: [{
            name: 'npc',
            type: 'drawImg',
            img: _G.Material('assets/img/cat.png'),
            x: 0,
            y: 0,
            w: 58,
            h: 58,
            rotate: 0,
            interpDir: -1
        }],
        DeathDrops: _G.Instance !== 3 ? [{
                item: 'cat_poop',
                am: 1,
                chance: 75
            },
            {
                item: 'bones',
                am: 1,
                chance: 100
            }
        ] : [{
            item: 'charms',
            am: [2, 5],
            chance: 100
        }]
    },
};

_G.npcs['npc_guard_mid2'] = clone(_G.npcs['npc_guard_mid1']);
_G.npcs['npc_guard_mid2'].parts[0].img = _G.Material('assets/img/guard_mid2.png');

// ── ZOMBIE NPC ────────────────────────────────────────────────────────────────
_G.npcs['npc_zombie'] = {
    nametag: 'Zombie',
    lvl: 2,
    DistanceFromHome: 99999,
    Speed: 0.85,
    AttackSpeed: 600,
    // Longer wind-up before attack so players can see it coming
    AttackDelay: 950,
    AttackDamage: 8,
    AttackRotate: -45,
    HealthMax: 120,
    bbox: [-28, -44, 56, 96],
    parts: [{
        name: 'npc',
        type: 'drawImg',
        img: _G.Material('assets/img/goblin.png'),
        x: 0,
        y: 0,
        w: 76,
        h: 110,
        rotate: 0,
        interpDir: -1
    }],
    DeathDrops: [{
        item: 'bones',
        am: [1, 3],
        chance: 100
    }, {
        item: 'charms',
        am: [1, 5],
        chance: 70
    }, {
        item: 'meat_raw',
        am: [1, 2],
        chance: 40
    }, {
        item: 'coins',
        am: [3, 15],
        chance: 50
    }]
};
// Main map (Instance 0): much shorter aggro range so zombies don't ambush players
// immediately; also reduced damage so bare-handed players have a fighting chance.
/*IF_SERVER*/
if (!_G.Instance) {
    _G.npcs['npc_zombie'].DistanceFromHome = 350;
    _G.npcs['npc_zombie'].AttackDamage = 5;
    _G.npcs['npc_zombie'].AttackDelay = 1100;
}
/*IF_END*/
if (_G.Instance && _G.Instance === 3) {
    _G.npcs['npc_guard_noob'].DistanceFromHome = 99999;
    _G.npcs['npc_guard_mid1'].DistanceFromHome = 99999;
    _G.npcs['npc_guard_mid2'].DistanceFromHome = 99999;
    _G.npcs['npc_cat'].DistanceFromHome = 99999;
    _G.npcs['npc_goblin'].DistanceFromHome = 99999;
}

_G.crafting = {
    'Bronze Bar': {
        item: 'metal',
        w: 39,
        h: 32,
        img: _G.Material('assets/img/metal.png'),
        furnace: 5,
        time: 600,
        recipe: [{
                item: 'ore_tin',
                am: 1
            },
            {
                item: 'ore_copper',
                am: 1
            }
        ]
    },
    'Iron Bar': {
        item: 'metal_iron',
        w: 39,
        h: 32,
        img: _G.Material('assets/img/metal_iron.png'),
        furnace: 7,
        time: 1500,
        recipe: [{
            item: 'ore_iron',
            am: 1
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 15
        }],
        successChance: 50
    },
    'Steel Bar': {
        item: 'metal_steel',
        w: 39,
        h: 32,
        img: _G.Material('assets/img/metal_steel.png'),
        furnace: 9,
        time: 1500,
        recipe: [{
                item: 'ore_iron',
                am: 1
            },
            {
                item: 'ore_coal',
                am: 1
            }
        ],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 20
        }]
    },
    'Beancan Grenade': {
        item: 'grenade_beancan',
        img: _G.Material('assets/img/grenade_beancan.png'),
        w: 40,
        h: 40,
        time: 10000,
        anvil: 5,
        recipe: [{
            item: 'metal',
            am: 6
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 5
        }]
    },
    'Bronze Sword': {
        item: 'sword_bronze',
        img: _G.Material('assets/img/sword_bronze.png'),
        w: 20,
        h: 62,
        time: 10000,
        anvil: 40,
        recipe: [{
            item: 'metal',
            am: 20
        }]
    },
    'Bronze Hatchet': {
        item: 'hatchet_bronze',
        img: _G.Material('assets/img/hatchet_bronze.png'),
        w: 20,
        h: 62,
        time: 6500,
        anvil: 40,
        recipe: [{
            item: 'metal',
            am: 11
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 8
        }]
    },
    'Bronze Pickaxe': {
        item: 'pickaxe_bronze',
        img: _G.Material('assets/img/pickaxe_bronze.png'),
        w: 40,
        h: 62,
        time: 6500,
        anvil: 40,
        recipe: [{
            item: 'metal',
            am: 11
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 9
        }]
    },
    'Iron Sword': {
        item: 'sword_iron',
        img: _G.Material('assets/img/sword_iron.png'),
        w: 20,
        h: 62,
        time: 6500,
        anvil: 60,
        recipe: [{
            item: 'metal_iron',
            am: 7
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 19
        }]
    },
    'Iron Hatchet': {
        item: 'hatchet_iron',
        img: _G.Material('assets/img/hatchet_iron.png'),
        w: 20,
        h: 62,
        time: 6500,
        anvil: 60,
        recipe: [{
            item: 'metal_iron',
            am: 12
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 21
        }]
    },
    'Iron Pickaxe': {
        item: 'pickaxe_iron',
        img: _G.Material('assets/img/pickaxe_iron.png'),
        w: 40,
        h: 62,
        time: 6500,
        anvil: 60,
        recipe: [{
            item: 'metal_iron',
            am: 12
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 20
        }]
    },
    'Steel Hatchet': {
        item: 'hatchet_steel',
        img: _G.Material('assets/img/hatchet_steel.png'),
        w: 20,
        h: 62,
        time: 6500,
        anvil: 80,
        recipe: [{
            item: 'metal_steel',
            am: 15
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 30
        }]
    },
    'Steel Pickaxe': {
        item: 'pickaxe_steel',
        img: _G.Material('assets/img/pickaxe_steel.png'),
        w: 40,
        h: 62,
        time: 6500,
        anvil: 80,
        recipe: [{
            item: 'metal_steel',
            am: 15
        }],
        recipeLevels: [{
            skill: 'Smithing',
            lvl: 32
        }]
    },
    'Berry Soup': {
        item: 'soup_berries',
        img: _G.Material('assets/img/soup_berries.png'),
        w: 32,
        h: 32,
        time: 1500,
        fire: 5,
        recipe: [{
            item: 'berries',
            am: 6
        }],
        successChance: 75
    },
    'Wood Hatchet': {
        item: 'hatchet',
        img: _G.Material('assets/img/hatchet.png'),
        w: 20,
        h: 48,
        time: 5000,
        recipe: [{
            item: 'logs',
            am: 8
        }]
    },
    'Wood Pickaxe': {
        item: 'pickaxe',
        img: _G.Material('assets/img/pickaxe_wood.png'),
        w: 43,
        h: 54,
        time: 5000,
        recipe: [{
            item: 'logs',
            am: 8
        }]
    },
    'Hammer': {
        item: 'hammer',
        img: _G.Material('assets/img/hammer.png'),
        w: 43,
        h: 54,
        time: 5000,
        recipe: [{
            item: 'logs',
            am: 6
        }]
    },
    'Tinderbox': {
        item: 'tinderbox',
        img: _G.Material('assets/img/tinderbox.png'),
        w: 32,
        h: 32,
        time: 3000,
        recipe: [{
            item: 'metal',
            am: 8
        }]
    },
    'Tool Cupboard': {
        item: 'tool_cupboard',
        img: _G.Material('assets/img/cupboard.png'),
        w: 30,
        h: 46,
        time: 5000,
        recipe: [{
                item: 'logs',
                am: 8
            },
            {
                item: 'metal',
                am: 6
            }
        ]
    },
    'Wall': {
        item: 'wall1',
        img: _G.Material('assets/img/wall1.png'),
        w: 32,
        h: 32,
        recipe: [{
                item: 'logs',
                am: 20
            },
            {
                item: 'metal',
                am: 8
            }
        ]
    },
    'Half Wall': {
        item: 'wall1-half',
        img: _G.Material('assets/img/wall1-half.png'),
        w: 32,
        h: 32,
        recipe: [{
                item: 'logs',
                am: 12
            },
            {
                item: 'metal',
                am: 4
            }
        ]
    },
    'Chest': {
        item: 'chest',
        img: _G.Material('assets/img/chest_icon.png'),
        w: 40,
        h: 40,
        time: 5000,
        recipe: [{
                item: 'logs',
                am: 15
            },
            {
                item: 'metal',
                am: 8
            }
        ]
    },
    'Meth Lab': {
        item: 'meth_lab',
        img: _G.Material('assets/img/meth-lab.png'),
        w: 22,
        h: 28,
        recipe: [{
                item: 'logs',
                am: 50
            },
            {
                item: 'metal',
                am: 44
            }
        ]
    },
    'Bed': {
        item: 'bed',
        img: _G.Material('assets/img/bed.png'),
        w: 32,
        h: 32,
        recipe: [{
            item: 'logs',
            am: 30
        }]
    },
    'Text Sign': {
        item: 'text_sign',
        img: _G.Material('assets/img/sign.png'),
        w: 32,
        h: 32,
        recipe: [{
                item: 'logs',
                am: 30
            },
            {
                item: 'metal',
                am: 20
            }
        ]
    },
    'Barb Wire': {
        item: 'barbed_wire',
        img: _G.Material('assets/img/barbed-wire.png'),
        w: 32,
        h: 32,
        recipe: [{
                item: 'metal',
                am: 14
            },
            {
                item: 'logs',
                am: 8
            }
        ]
    },
    'Forcefield': {
        item: 'forcefield',
        img: _G.Material('assets/img/door.png'),
        w: 32,
        h: 32,
        recipe: [{
                item: 'logs',
                am: 20
            },
            {
                item: 'metal',
                am: 12
            }
        ]
    },
    'Pistol': {
        item: 'weapon_pistol_wood',
        w: 46,
        h: 25,
        img: _G.Material('assets/img/pistol-wood.png'),
        recipe: [{
            item: 'metal',
            am: 8
        }]
    },
    'Pistol Ammo': {
        item: 'ammo_pistol',
        am: 60,
        w: 32,
        h: 32,
        img: _G.Material('assets/img/ammo.png'),
        recipe: [{
                item: 'metal',
                am: 2
            }
        ]
    },
    'SMG': {
        item: 'weapon_smg',
        w: 40,
        h: 25,
        img: _G.Material('assets/img/smg.png'),
        recipe: [{
            item: 'metal',
            am: 18
        }]
    },
    'SMG Ammo': {
        item: 'ammo_smg',
        am: 60,
        w: 32,
        h: 32,
        img: _G.Material('assets/img/ammo_smg.png'),
        recipe: [{
                item: 'metal',
                am: 3
            }
        ]
    },
    'Jihad': {
        item: 'jihad',
        w: 27,
        h: 37,
        img: _G.Material('assets/img/jihad.png'),
        recipe: [{
                item: 'logs',
                am: 11
            },
            {
                item: 'berries',
                am: 11
            }
        ]
    },
    'Rusty Car': {
        item: 'vehicle_car1',
        w: 50,
        h: 29,
        img: _G.Material('assets/img/car-icon.png'),
        recipe: [{
                item: 'logs',
                am: 100
            },
            {
                item: 'metal',
                am: 20
            }
        ]
    },
    'Police Car': {
        item: 'vehicle_car_police',
        w: 50,
        h: 35,
        img: _G.Material('assets/img/car-cop-icon.png'),
        recipe: [{
                item: 'logs',
                am: 190
            },
            {
                item: 'metal',
                am: 40
            }
        ]
    },
    // ── ARMOR & HATS ─────────────────────────────────────────────────────────
    'Wood Helmet': {
        item: 'armor_wood_helmet',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/armor_wood_helmet.png'),
        recipe: [{ item: 'logs', am: 25 }]
    },
    'Wood Chest': {
        item: 'armor_wood_chest',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/armor_wood_chest.png'),
        recipe: [{ item: 'logs', am: 40 }]
    },
    'Iron Helmet': {
        item: 'armor_iron_helmet',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/armor_iron_helmet.png'),
        recipe: [{ item: 'metal', am: 18 }]
    },
    'Iron Chest': {
        item: 'armor_iron_chest',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/armor_iron_chest.png'),
        recipe: [{ item: 'metal', am: 28 }]
    },
    'Steel Helmet': {
        item: 'armor_steel_helmet',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/armor_steel_helmet.png'),
        recipe: [
            { item: 'metal', am: 30 },
            { item: 'metal_iron', am: 8 }
        ]
    },
    'Steel Chest': {
        item: 'armor_steel_chest',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/armor_steel_chest.png'),
        recipe: [
            { item: 'metal', am: 45 },
            { item: 'metal_iron', am: 12 }
        ]
    },
    'Cowboy Hat': {
        item: 'hat_cowboy',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/hat_cowboy.png'),
        recipe: [{ item: 'logs', am: 15 }]
    },
    'Bucket Hat': {
        item: 'hat_bucket',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/hat_bucket.png'),
        recipe: [{ item: 'metal', am: 8 }]
    },
    'Top Hat': {
        item: 'hat_tophat',
        w: 32,
        h: 32,
        img: _G.Material('assets/img/hat_tophat.png'),
        recipe: [
            { item: 'logs', am: 10 },
            { item: 'metal', am: 5 }
        ]
    },
    // ── NEW WEAPONS ───────────────────────────────────────────────────────────
    'Shotgun': {
        item: 'weapon_shotgun',
        w: 48,
        h: 24,
        img: _G.Material('assets/img/shotgun.png'),
        recipe: [
            { item: 'metal', am: 22 },
            { item: 'logs', am: 14 }
        ]
    },
    'Shotgun Shells x20': {
        item: 'ammo_shotgun',
        w: 24,
        h: 24,
        img: _G.Material('assets/img/ammo_shotgun.png'),
        am: 20,
        recipe: [{ item: 'metal', am: 4 }]
    },
    'Bow': {
        item: 'weapon_bow',
        w: 24,
        h: 40,
        img: _G.Material('assets/img/bow.png'),
        recipe: [{ item: 'logs', am: 20 }]
    },
    'Arrows x30': {
        item: 'ammo_arrow',
        w: 40,
        h: 12,
        img: _G.Material('assets/img/arrow.png'),
        am: 30,
        recipe: [{ item: 'logs', am: 5 }]
    }
};

_G.placable = {
    'text_sign': {
        name: 'Text Sign',
        UseName: 'Place',
        w: 0,
        h: 0,
        img: 'assets/img/sign.png',
        imgDisable: true,
        bbox: [0, 0, 0, 0],
        Solid: false,
        NoRotate: true,
        renderAfterAll: true,
        PlaceInObjs: true,
        SignText: 'Use !text to set',
        Draw: function(ctx) {
            ctx.font = 'bold 16px "Open Sans"';
            ctx.fillStyle = 'rgba(0,255,0,1)';
            ctx.fillText(this.SignText, 0, 0);
        },
        HealthSize: 50,
        HealthX: 110,
        HealthY: 5
    },
    'wall1': {
        name: 'Wall',
        img: 'assets/img/wall1.png',
        UseName: 'Place',
        w: 240,
        h: 40,
        bbox: [0, 0, 240, 40],
        PlaceInObjs: true,
        Solid: true,
        NoCupboardHP: 250,
        DecayHP: 5000
    },
    'world_door': {
        name: 'World Door',
        img: 'assets/img/wall1.png',
        UseName: 'Place',
        w: 240,
        h: 10,
        bbox: [0, 0, 240, 40],
        PlaceInObjs: true,
        Solid: false,
        Use: function(self, caller) {
            if (self.DoorGoPos) {
                caller.CamBypass = _G.lastTick + 170;
                caller.pos = [self.DoorGoPos[0], self.DoorGoPos[1]];

                if (self.DoorGoPos[0] > _G.BoundaryX || self.DoorGoPos[0] < _G.BoundaryMinX || self.DoorGoPos[1] > _G.BoundaryY || self.DoorGoPos[1] < _G.BoundaryMinY) {
                    caller.OutsideBoundary = true;
                } else if (caller.OutsideBoundary) {
                    caller.OutsideBoundary = false;
                }
            }
        },
        Think: function(self) {
            if (self.DoorGoPos && self.DoorTouch && (!self.LastDoorCheck || _G.lastTick >= self.LastDoorCheck)) {

                self.LastDoorCheck = _G.lastTick + 1000;
                self.colliding = _G.ents.Colliding(self);

                for (var z = 0; z < self.colliding.length; z++) {
                    if (self.colliding[z].class === 'player') {
                        self.colliding[z].CamBypass = _G.lastTick + 170;
                        self.colliding[z].pos = [self.DoorGoPos[0], self.DoorGoPos[1]];

                        if (self.DoorGoPos[0] > _G.BoundaryX || self.DoorGoPos[0] < _G.BoundaryMinX || self.DoorGoPos[1] > _G.BoundaryY || self.DoorGoPos[1] < _G.BoundaryMinY) {
                            self.colliding[z].OutsideBoundary = true;
                        } else if (self.colliding[z].OutsideBoundary) {
                            self.colliding[z].OutsideBoundary = false;
                        }
                    }
                }
            }
        },
        AllowedInstances: [0, 1, 2, 3, 4]
    },
    'world_wall': {
        name: 'World Wall',
        img: 'assets/img/wall1.png',
        UseName: 'Place',
        w: 300,
        h: 10,
        bbox: [0, 0, 300, 10],
        PlaceInObjs: true,
        Solid: true,
        AllowedInstances: [0, 1, 2, 3, 4]
    },
    'wall-wood': {
        name: 'Wall',
        img: 'assets/img/wall1.png',
        UseName: 'Place',
        w: 300,
        h: 40,
        bbox: [0, 0, 300, 10],
        PlaceInObjs: true,
        Solid: true,
        NoCupboardHP: 250,
        DecayHP: 5000
    },
    'barbed_wire': {
        name: 'Barbed Wire',
        img: 'assets/img/barbed-wire.png',
        UseName: 'Place',
        w: 120,
        h: 40,
        bbox: [0, 0, 120, 40],
        Health: 2100,
        HealthMax: 2100,
        HealthSize: 44,
        HealthX: 44,
        HealthY: 44,
        HealthAlpha: 0.33,
        HealthText: 'rgba(255,255,255,0.6)',
        DamageHurts: 2,
        Solid: false,
        Think: function(self, tFrame) {
            if (typeof self.Placing !== 'object') {

                self.colliding = _G.ents.Colliding(self);

                for (var i = 0; i < self.colliding.length; i++) {
                    let plyInfo = _G.playerData[self.colliding[i].Owner]
                    if (typeof plyInfo === 'object' && typeof plyInfo.input === 'object' && self.colliding[i].class === 'player' && !self.colliding[i].Driving && (typeof self.LastHit === 'undefined' || typeof self.LastHit[self.colliding[i].Owner] === 'undefined' || _G.lastTick - self.LastHit[self.colliding[i].Owner] >= 650) && (plyInfo.input['L'] || plyInfo.input['R'] || plyInfo.input['U'] || plyInfo.input['D']) && self.colliding[i].Owner !== self.Owner) {
                        if (typeof self.LastHit === 'undefined') {
                            self.LastHit = {};
                        }
                        self.LastHit[self.colliding[i].Owner] = _G.lastTick;

                        self.colliding[i].OnDamage(self, 12);
                        self.colliding[i].collidingSlow = 0.9;
                        self.colliding[i].collidingSlowAt = _G.lastTick;
                    }
                }
            }
        }
    },
    'wall1-half': {
        name: 'Wall 1/2',
        img: 'assets/img/wall1-half.png',
        UseName: 'Place',
        w: 120,
        h: 40,
        bbox: [0, 0, 120, 40],
        PlaceInObjs: true,
        Solid: true,
        NoCupboardHP: 250,
        DecayHP: 5000
    },
    'forcefield': {
        name: 'Door',
        img: 'assets/img/door.png',
        UseName: 'Place',
        w: 120,
        h: 40,
        bbox: [0, 0, 120, 40],
        Solid: true,
        PlaceInObjs: true,
        NoCupboardHP: 250,
        DecayHP: 5000,
        Client: {
            ClientPos: true
        },
        ThinkClient: true,
        Think: function(self) {
            if (!self.IsOpened && typeof self.rotateOGG !== 'undefined' && (typeof self.Opened === 'undefined' || self.Opened > 0)) {
                self.Opened = (self.Opened ? self.Opened - angleToRadians(2) : angleToRadians(2));

                if (self.Opened < 0) {
                    self.Opened = 0;
                }

                self.rotate = self.Opened + self.rotateOGG;
                self.pos[0] = self.posOG[0] + 45 * (self.Opened / angleToRadians(90));
                if (self.rotateOGG === angleToRadians(90)) {
                    self.pos[1] = self.posOG[1] + 40 * (self.Opened / angleToRadians(90));
                } else {
                    self.pos[1] = self.posOG[1] - 40 * (self.Opened / angleToRadians(90));
                }

                /*
                if (self.Opened <= 0) {
                    let findInside = _G.ents.Colliding(self, true);
                    console.log(findInside);
                    if (findInside.length > 0) {
                        for (var i=0; i < findInside.length; i++) {
                            if (findInside[i].class === 'player') {
                                let addX = (findInside[i].lastDir === 'L' ? 6 : -6),
                                    addY = (findInside[i].lastDirY === 'U' ? 6 : -6),
                                    foundSpot = false,
                                    startPos = [findInside[i].pos[0], findInside[i].pos[1]];
                                
                                for (var ii=0; ii < 7; ii++) {
                                    findInside[i].pos[(findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? 0 : 1] += ((findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? addX : addY);

                                    let checkInside = _G.ents.Colliding(findInside[i], true),
                                        gotSpot = true;
                                    for (var xx=0; xx < checkInside.length; xx++) {
                                        if (checkInside[xx].Solid) {
                                            gotSpot = false;
                                            findInside[i].pos[(findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? 0 : 1] += ((findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? addX : addY);
                                            break;
                                        }
                                    }
                                    if (gotSpot) {
                                        foundSpot = true;
                                        break;
                                    }
                                }

                                if (!foundSpot) {
                                    findInside[i].pos = startPos;


                                    for (var ii=0; ii < 7; ii++) {
                                        findInside[i].pos[(findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? 1 : 0] += ((findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? addY : addX);

                                        let checkInside = _G.ents.Colliding(findInside[i], true),
                                            gotSpot = true;
                                        for (var xx=0; xx < checkInside.length; xx++) {
                                            if (checkInside[xx].Solid) {
                                                gotSpot = false;
                                                findInside[i].pos[(findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? 1 : 0] += ((findInside[i].lastDirPress === 'L' || findInside[i].lastDirPress === 'R') ? addY : addX);
                                                break;
                                            }
                                        }
                                        if (gotSpot) {
                                            foundSpot = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                */
            } else if (self.IsOpened && (!self.Opened || self.Opened < angleToRadians(90))) {
                if (typeof self.rotateOGG === 'undefined' || typeof self.posOG === 'undefined') {
                    self.rotateOGG = self.rotate;
                    self.posOG = [self.pos[0], self.pos[1]];
                }
                self.Opened = (self.Opened ? self.Opened + angleToRadians(2) : angleToRadians(2));

                if (self.Opened > angleToRadians(90)) {
                    self.Opened = angleToRadians(90);
                }

                self.rotate = self.Opened + self.rotateOGG;
                self.pos[0] = self.posOG[0] + 45 * (self.Opened / angleToRadians(90));
                if (self.rotateOGG === angleToRadians(90)) {
                    self.pos[1] = self.posOG[1] + 40 * (self.Opened / angleToRadians(90));
                } else {
                    self.pos[1] = self.posOG[1] - 40 * (self.Opened / angleToRadians(90));
                }

            }

            if (self.IsGhost && !self.IsOpened && self.Opened <= 0) {
                self.IsGhost = undefined;
                self.OwnerPass = undefined;
                self.Togglable = undefined;
                self.Toggled = undefined;
            }
            if (self.AutoClose && _G.lastTick - self.AutoClose > 2500) {
                self.IsOpened = undefined;
            }
        },
        Use: function(self, caller) {
            if (typeof caller.Owner !== 'undefined' && (self.Owner === caller.Owner || (caller.Owner === 'goosely' && caller.ActiveWeapon && caller.ActiveWeapon.class === 'hammer')) && _G.lastTick - self.LastUse > 1000) {
                let plyInside = false;

                self.colliding = _G.ents.Colliding(self);

                for (var i = 0; i < self.colliding.length; i++) {
                    if (self.colliding[i].class === 'player' && self.colliding[i] !== caller && !self.colliding[i].Dying) {
                        plyInside = true;
                        break;
                    } else if ((self.colliding[i].class === 'vehicle_car1' || self.colliding[i].class === 'vehicle_car_police') && self.colliding[i].PlacedBy !== self.Owner) {
                        plyInside = 'car';
                        break;
                    }
                }

                self.LastUse = _G.lastTick;

                if (plyInside === 'car') {
                    caller.ShowNotify('Can\'t close with car inside', 2000);
                } else if (plyInside) {
                    caller.ShowNotify('Can\'t close with player inside', 2000);
                } else {

                    //self.Toggled = !self.Toggled;
                    if (typeof self.IsOpened === 'undefined') {
                        self.IsOpened = true;
                    } else {
                        self.IsOpened = !self.IsOpened;
                    }

                    self.OwnerPass = true;
                    self.Togglable = true;
                    self.Toggled = false;
                    self.IsGhost = Date.now();
                    self.parts[0].img = _G.Material('assets/img/door.png');
                    if (self.IsOpened) {
                        self.AutoClose = _G.lastTick;
                    } else {
                        self.AutoClose = undefined;
                    }
                }

            } else {
                return true;
            }
        }
    },
    'bed': {
        name: 'Bed',
        img: 'assets/img/bed.png',
        UseName: 'Place',
        w: 110,
        h: 78,
        bbox: [0, 0, 110, 78],
        Solid: false,
        NoRotate: true,
        Use: function(self, caller) {
            if (typeof caller.Owner !== 'undefined' && self.Owner === caller.Owner && _G.lastTick - self.LastUse > 1000 && typeof self.Owner.ActiveWeapon === 'undefined') {
                self.LastUse = _G.lastTick;

            } else {
                return true;
            }
        }
    },
    'meth_lab': {
        name: 'Meth Lab',
        img: 'assets/img/m-lab-shake.png',
        UseName: 'Place',
        w: 114,
        h: 69,
        bbox: [3, 30, 99, 27],
        Solid: false,
        NoRotate: true,
        PlaceInObjs: true,
        Draw: function(ctx) {
            if (this.ShowStats) {
                let needPoo = (this.class === 'meth_lab_pro' ? 2 : (this.class === 'meth_lab_mid' ? 3 : 4));
                ctx.save()
                ctx.rotate(-this.rotate);
                /*
                let invFont = 16,
                    zoomLvl = 0;
                if (_G.viewport.zoom < 1.7) {
                    zoomLvl = (1.7 - _G.viewport.zoom);
                    invFont = (16 + Math.round(zoomLvl*15));
                    ctx.font = 'bold ' + invFont + 'px "Open Sans"';
                } else {
                    ctx.font = 'bold 16px "Open Sans"';
                }
                */
                ctx.font = 'bold 16px "Open Sans"';
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                if (!this.MakingMeth) {
                    if (this.CatPoop >= needPoo && this.Methylamine >= 1) {
                        ctx.fillText('Ready to cook!', -4, 7);
                    } else {
                        ctx.fillText('Cat Poop: ' + this.CatPoop + '/' + needPoo, -4, -10);
                        ctx.fillText('Methylamine: ' + this.Methylamine + '/1', -4, 7);
                    }
                }
                ctx.restore()
            }
        },
        Think: function(self) {
            if (self.ShouldRemove) {
                return;
            }
            let needPoo = (self.class === 'meth_lab_pro' ? 2 : (self.class === 'meth_lab_mid' ? 3 : 4))

            if (self.class !== 'meth_lab_pro' && (typeof self.LastUpCheck === 'undefined' || _G.lastTick - self.LastUpCheck >= 3000)) {
                self.LastUpCheck = _G.lastTick;
                self.colliding = _G.ents.Colliding(self, true);

                for (var i = 0; i < self.colliding.length; i++) {
                    if (self.colliding[i].ShouldRemove) {
                        continue;
                    }

                    if (self.colliding[i].class === 'lab_upgrade') {
                        if (typeof self.colliding[i].itemAm !== 'undefined') {
                            self.colliding[i].itemAm -= 1;
                        }

                        if (typeof self.colliding[i].itemAm === 'undefined' || self.colliding[i].itemAm <= 0) {
                            self.colliding[i].ShouldRemove = true;
                        }

                        let newLab = _G.ents.Create(self.class === 'meth_lab' ? 'meth_lab_mid' : 'meth_lab_pro');
                        newLab.Owner = self.Owner;
                        newLab.PlacedBy = self.PlacedBy;
                        newLab.pos = [self.pos[0], self.pos[1]];

                        self.ShouldRemove = true;

                        break;
                    }
                }
            }

            if (!self.MakingMeth && typeof self.LastMethCheck === 'undefined' || _G.lastTick - self.LastMethCheck >= 1000) {
                self.LastMethCheck = _G.lastTick;
                self.colliding = _G.ents.Colliding(self, true);

                if (typeof self.Methylamine === 'undefined') {
                    self.Methylamine = 0;
                }
                if (typeof self.CatPoop === 'undefined') {
                    self.CatPoop = 0;
                }

                for (var i = 0; i < self.colliding.length; i++) {
                    if (self.colliding[i].ShouldRemove) {
                        continue;
                    }

                    if (self.colliding[i].class === 'cat_poop' && self.CatPoop < needPoo) {
                        self.ShowStats = _G.lastTick;
                        let takeFrom = (self.colliding[i].itemAm && self.colliding[i].itemAm > (needPoo - self.CatPoop)) ? (needPoo - self.CatPoop) : (self.colliding[i].itemAm ? self.colliding[i].itemAm : 1);

                        self.CatPoop += takeFrom;

                        if (typeof self.colliding[i].itemAm !== 'undefined') {
                            self.colliding[i].itemAm -= takeFrom;
                        }

                        if (typeof self.colliding[i].itemAm === 'undefined' || self.colliding[i].itemAm <= 0) {
                            self.colliding[i].ShouldRemove = true;
                        }

                    } else if (self.colliding[i].class === 'methylamine' && self.Methylamine <= 0) {
                        self.ShowStats = _G.lastTick;
                        self.Methylamine += 1;

                        if (typeof self.colliding[i].itemAm !== 'undefined') {
                            self.colliding[i].itemAm -= 1;
                        }

                        if (typeof self.colliding[i].itemAm === 'undefined' || self.colliding[i].itemAm <= 0) {
                            self.colliding[i].ShouldRemove = true;
                        }
                    }
                }
            }

            if (typeof self.MakingMeth !== 'undefined') {
                self.rotate = Math.sin(_G.lastTick * .003) * .1
            }

            if (typeof self.MakingMeth !== 'undefined' && Date.now() - self.MakingMeth >= 620) {
                self.MakingMeth = Date.now();
                self.MakingMeths += 1;

                if (self.MakingMeths % 3 === 0) {
                    var dust = _G.ents.Create('dust_meth');
                    dust.pos = [self.pos[0] + 54, self.pos[1] + 20 + randInt(0, 14)];
                    dust.direction = 1;
                }


                if (self.MakingMeths >= (self.class === 'meth_lab_pro' ? 120 : (self.class === 'meth_lab_mid' ? 155 : 190))) {
                    for (var gg = 0; gg < (self.class === 'meth_lab_pro' ? 4 : (self.class === 'meth_lab_mid' ? 3 : 2)); gg++) {
                        let meth = _G.ents.Create('meth');
                        meth.pos[0] = self.pos[0] + randInt(-10, 90);
                        meth.pos[1] = self.pos[1] + 33;
                        meth.rotate = angleToRadians(randInt(0, 360));
                    }

                    self.MakingMeth = undefined;
                    self.MakingMeths = undefined;
                }
            }

            if (_G.lastTick - self.ShowStats > 3500) {
                self.ShowStats = undefined;
            }
        },
        Use: function(self, ply) {
            let needPoo = (self.class === 'meth_lab_pro' ? 2 : (self.class === 'meth_lab_mid' ? 3 : 4));

            if (typeof self.Placing !== 'undefined' && self.Placing && typeof self.Placing === 'object' && typeof self.Placing.Owner === 'string') {
                return true;
            }
            //console.log('a');

            if (typeof self.MakingMeth !== 'undefined') {
                return true;
            }

            if (typeof self.LastUse !== 'undefined' && _G.lastTick - self.LastUse < 1000) {
                return true;
            }
            self.LastUse = _G.lastTick;

            self.ShowStats = _G.lastTick;

            if (self.CatPoop < needPoo) {
                ply.ShowNotify('Need Cat Poop', 1400);
                return true;
            }

            if (self.Methylamine <= 0) {
                ply.ShowNotify('Need Methylamine', 1400);
                return true;
            }

            self.MakingMeth = _G.lastTick;
            self.MakingMeths = 0;

            self.CatPoop = 0;
            self.Methylamine = 0;
        }
    },
    'weed_plant': {
        name: 'Weed Plant',
        img: 'assets/img/can-plant-empty.png',
        img_item: 'assets/img/pot_icon.png',
        UseName: 'Place',
        w: 100,
        h: 127,
        bbox: [3, 10, 94, 117],
        Solid: false,
        NoRotate: true,
        IsGrowing: false,
        Grown: false,
        PlaceInObjs: true,
        Think: function(self) {
            if (typeof self.Placing === 'undefined' || !self.Placing) {

                if (self.IsGrowing) {
                    if (!self.Grown && Date.now() - self.IsGrowing > 300000) {
                        self.Grown = true;
                        self.parts[0].img = _G.Material('assets/img/can-plant-grown.png');
                    }
                } else {
                    self.colliding = _G.ents.Colliding(self);
                    if (self.colliding.length > 0) {
                        for (var i = 0; i < self.colliding.length; i++) {
                            if (self.colliding[i].class === 'weed_seed' && !self.colliding[i].ShouldRemove) {
                                if (typeof self.colliding[i].itemAm !== 'undefined') {
                                    self.colliding[i].itemAm -= 1;
                                    if (self.colliding[i].itemAm <= 0) {
                                        self.colliding[i].ShouldRemove = true;
                                    }
                                } else {
                                    self.colliding[i].ShouldRemove = true;
                                }

                                if (typeof self.colliding[i].PlacedBy !== 'undefined' && typeof _G.playerData[self.colliding[i].PlacedBy] !== 'undefined' && typeof _G.playerData[self.colliding[i].PlacedBy].ent === 'object') {
                                    _G.playerData[self.colliding[i].PlacedBy].ent.AddXP('Farming', 6);
                                }
                                self.IsGrowing = Date.now();
                                self.parts[0].img = _G.Material('assets/img/can-plant.png');
                                break;
                            }
                        }
                    }
                }

            }
        },
        Use: function(self, ply) {
            if (typeof self.Placing !== 'undefined' && self.Placing) {
                return true;
            }

            if (typeof self.LastUse !== 'undefined' && _G.lastTick - self.LastUse < 1000) {
                return true;
            }
            self.LastUse = _G.lastTick;

            if (self.Grown) {
                let randWeed = randInt(1, 3);
                ply.AddItem('weed', randWeed);
                ply.AddItem('weed_seed', 1);
                ply.ShowNotify('+' + randWeed + ' nugs, +1 seeds', 2000);
                self.Grown = false;
                self.IsGrowing = false;
                self.parts[0].img = _G.Material('assets/img/can-plant-empty.png');

                ply.AddXP('Herbology', 15);
            }
        }
    },
    'chest': {
        name: 'Chest',
        img: 'assets/img/chest.png',
        img_item: 'assets/img/chest_icon.png',
        UseName: 'Place',
        w: 71,
        h: 77,
        bbox: [23, 23, 21, 45],
        Solid: false,
        NoRotate: true,
        PlaceInObjs: true,
        IsOpen: false,
        Container: [],
        Think: function(self) {
            if (self.IsOpen && (typeof self.IsOpen !== 'object' || !self.IsOpen.invOpen)) {
                self.IsOpen.container = undefined;
                self.IsOpen = false;
                setTimeout(function() {
                    if (!self.IsOpen) {
                        self.parts[0].img = _G.Material('assets/img/chest.png');
                    }
                }, 900);
            }
        },
        Use: function(self, ply) {
            if (typeof self.Placing !== 'undefined' && self.Placing) {
                return true;
            }


            if (ply.Driving) {
                return true;
            }

            if (typeof ply.PlacingObj !== 'undefined' && ply.PlacingObj) {
                return true;
            }

            if (self.IsOpen && self.IsOpen === ply) {
                return true;
            }

            if (typeof self.LastUse !== 'undefined' && _G.lastTick - self.LastUse < 1000) {
                return true;
            }
            self.LastUse = _G.lastTick;

            if (self.IsOpen && typeof self.IsOpen === 'object') {
                self.IsOpen.container = undefined;
                delete self.IsOpen.container;
                self.IsOpen = false;
            }

            if (!self.IsOpen) {
                ply.conSlot = undefined;
                ply.conScroll = 0;
                ply.invScroll = 0;
                ply.invSlot = 0;
                ply.invOpen = _G.lastTick;

                if (ply.container) {
                    ply.container.IsOpen = undefined;
                }

                ply.container = self;

                self.IsOpen = ply;

                self.parts[0].img = _G.Material('assets/img/chest_open.png');
            } else {

                setTimeout(function() {
                    if (!self.IsOpen) {
                        self.parts[0].img = _G.Material('assets/img/chest.png');
                    }
                }, 900);
            }
        }
    },
    'vehicle_car1': {
        name: 'Rusty Car',
        img: 'assets/img/car1.png',
        img_item: 'assets/img/car-icon.png',
        UseName: 'Place',
        w: 190,
        h: 83,
        bbox: [3, 3, 184, 77],
        Solid: false,
        CollideWithOtherPlacables: true,
        PlaceNearBoundary: true,
        renderBehindPlayer: true,
        AllowedInstances: [2],
        Use: function(self, ply) {
            if (self.Placing) {
                return true;
            }

            if (typeof self.PlacedBy !== 'undefined' && self.PlacedBy !== false && self.PlacedBy !== ply.Owner) {
                return true;
            }

            if (typeof self.Owner !== 'undefined' && self.Owner !== false && self.Owner !== ply.Owner) {
                return true;
            }

            if (typeof ply.Driving !== 'undefined' && ply.Driving !== self) {
                return true;
            }

            if (_G.lastTick - self.LastUse < 2000) {
                return true;
            }

            self.LastUse = _G.lastTick;

            if (typeof self.Driver === 'object') {
                self.Driver.pos[0] = self.pos[0] + 40;
                self.Driver.pos[1] = self.pos[1] - 10;

                let engine = _G.sounds.engine_stop.cloneNode(true, self.pos);
                engine.volume = 0.2;
                engine.play();

                if (typeof self.engineStart !== 'undefined') {
                    try {
                        self.engineStart.pause();
                    } catch (e) {}
                    try {
                        self.engineStart.destroy();
                    } catch (e) {}

                    self.engineStart = undefined;
                }

                if (self.Driver.ExitDrive() === true) {
                    return true;
                }
            }

            self.Driver = ply;
            ply.Driving = self;

            ply.conSlot = undefined;
            ply.invOpen = undefined;
            ply.craftOpen = undefined;
            ply.craftSlot = undefined;
            ply.skillOpen = undefined;

            /*
            if (typeof ply.DropWeapon === 'function') {
                ply.DropWeapon();
            }
            */

            ply.pos[0] = self.pos[0];
            ply.pos[1] = self.pos[1];

            self.engineStart = _G.sounds.engine_start.cloneNode(true, self.pos);
            self.engineStart.volume = 0.2;
            self.engineStart.play();
        },
        ThinkClient: true,
        ThinkFirst: function(tFrame) {
            if (this.Placing || !this.pos) {
                return true;
            }

            this.posLast = [this.pos[0], this.pos[1]];
            this.Forward = (typeof this.Forward === 'undefined' ? 0 : this.Forward);

            let Forward = 0,
                Rotate = 0;

            if (typeof this.Driver === 'object') {
                let ply = _G.playerData[this.Driver.Owner];

                this.colliding = _G.ents.Colliding(this);

                if (typeof ply === 'object') {
                    if (typeof ply.input === 'object' && typeof ply.input['U'] !== 'undefined') {
                        Forward = 6.4;
                    }
                    if (typeof ply.input === 'object' && typeof ply.input['D'] !== 'undefined') {
                        Forward = -4;
                    }
                }

                if (this.Forward >= 0.7 || this.Forward <= 0.7) {
                    let rotation = (this.Forward > 4 ? 2 : (this.Forward / 4) * 2);

                    if (typeof ply === 'object') {
                        if (typeof ply.input === 'object' && typeof ply.input['L'] !== 'undefined') {
                            Rotate = angleToRadians(-rotation);
                        }
                        if (typeof ply.input === 'object' && typeof ply.input['R'] !== 'undefined') {
                            Rotate = angleToRadians(rotation);
                        }
                    }
                }

                this.Driver.pos[0] = this.pos[0] + 60;
                this.Driver.pos[1] = this.pos[1] - 24;

            }
            //this.pos[0] = this.pos[0]+Forward;
            //this.pos[1] = this.pos[1]+0;

            let accel = 0.14;
            let decel = 0.09;
            if (Forward > this.Forward) {
                this.Forward = Math.min(Forward, this.Forward + accel);
            } else if (Forward < this.Forward) {
                this.Forward = Math.max(Forward, this.Forward - accel);
            } else if (Forward === 0) {
                // Friction/coast to stop
                if (this.Forward > decel) this.Forward -= decel;
                else if (this.Forward < -decel) this.Forward += decel;
                else this.Forward = 0;
            }

            if (this.Forward > .1 || this.Forward < -.1) {

                let rot = (this.rotate - angleToRadians(90));
                let vectX = Math.sin(rot),
                    vectY = Math.cos(rot);

                let addPos = [vectX * this.Forward, vectY * this.Forward];


                if (addPos[0] < 0 && this.pos[0] + addPos[0] > _G.BoundaryX - this.bbox[2]) {
                    addPos[0] = 0;
                } else if (addPos[0] > 0 && this.pos[0] + addPos[0] < _G.BoundaryMinX) {
                    addPos[0] = 0;
                }

                if (addPos[1] > 0 && this.pos[1] + addPos[1] > _G.BoundaryY - 150) {
                    addPos[1] = 0;
                } else if (addPos[1] < 0 && this.pos[1] + addPos[1] < _G.BoundaryMinY + 90) {
                    addPos[1] = 0;
                }

                let noSolids = false;

                let bboxToPoly = getRectPolygon([this.pos[0] - addPos[0], this.pos[1] + addPos[1]], this.bbox, this.rotate)

                let collidingEnts = checkCollisions(bboxToPoly, [this.pos[0] - addPos[0], this.pos[1] + addPos[1]], this.bbox, 0, true, (this.Driver && this.Driver.Owner) ? this.Driver.Owner : undefined, this);

                if (collidingEnts.length === 0) {
                    noSolids = true;
                } else {
                    bboxToPoly = getRectPolygon([this.pos[0] - addPos[0], this.pos[1]], this.bbox, this.rotate)

                    collidingEnts = checkCollisions(bboxToPoly, [this.pos[0] - addPos[0], this.pos[1]], this.bbox, 0, true, (this.Driver && this.Driver.Owner) ? this.Driver.Owner : undefined, this);

                    if (collidingEnts.length === 0) {
                        noSolids = 'x';
                    }

                    if (noSolids === false) {
                        bboxToPoly = getRectPolygon([this.pos[0], this.pos[1] + addPos[1]], this.bbox, this.rotate)

                        collidingEnts = checkCollisions(bboxToPoly, [this.pos[0], this.pos[1] + addPos[1]], this.bbox, 0, true, (this.Driver && this.Driver.Owner) ? this.Driver.Owner : undefined, this);

                        if (collidingEnts.length === 0) {
                            noSolids = 'y';
                        }
                    }
                }


                if (noSolids === 'x' && addPos[1] !== 0) {
                    addPos[1] = 0;
                } else if (noSolids === 'y' && addPos[0] !== 0) {
                    addPos[0] = 0;
                } else if (noSolids === false) {
                    addPos = [0, 0];
                }

                if (addPos[0] !== 0) {
                    this.pos[0] -= addPos[0];
                }
                if (addPos[1] !== 0) {
                    this.pos[1] += addPos[1];
                }

                this.vec = [addPos[0], addPos[1]];

                if (Rotate != 0) {


                    let bboxToPoly = getRectPolygon([this.pos[0], this.pos[1]], this.bbox, this.rotate + Rotate)

                    let collidingEnts = checkCollisions(bboxToPoly, [this.pos[0], this.pos[1]], this.bbox, 0, true, ((typeof this.Driving === 'object' && this.Driving.Owner) ? this.Driving.Owner : undefined), this);

                    if (collidingEnts.length === 0) {
                        this.rotate += Rotate;
                    }
                }
            }

            /*IF_SERVER*/
            if (typeof this.Driver === 'object' && typeof this.colliding === 'object') {
                for (var i = 0; i < this.colliding.length; i++) {
                    if (this.Forward >= 5 && this.colliding[i].class === 'player' && this.Driver !== this.colliding[i] && typeof this.colliding[i].Driving === 'undefined' && (typeof this.colliding[i].LastRanover === 'undefined' || _G.lastTick - this.colliding[i].LastRanover > 2000) && !this.colliding[i].SpawnProtect) {
                        if (this.Driver.SpawnProtect) {
                            // Remove temporary godmode received from spawn protection
                            this.Driver.SpawnProtect = undefined;
                            delete this.Driver.SpawnProtect;
                        }

                        this.colliding[i].OnDamage(this, 20);

                        this.colliding[i].LastRanover = _G.lastTick;
                    }
                }
            }
            /*IF_END*/
        }
    },
    'tool_cupboard': {
        name: 'Tool Cupboard',
        img: 'assets/img/cupboard.png',
        img_item: 'assets/img/cupboard.png',
        UseName: 'Place',
        w: 61,
        h: 80,
        bbox: [27, 29, 16, 30],
        Solid: false,
        NoRotate: true,
        PlaceInObjs: true,
        IsOpen: false,
        Container: [],
        renderBehindPlayer: false,
        MaxPlace: 2,
        BuildRadius: 600,
        BuildOrigin: [0, 0],
        StoreItems: {
            'logs': true,
            'logs_oak': true,
            'metal': true,
            'metal_iron': true,
            'metal_steel': true,
            'pickaxe': true,
            'pickaxe_bronze': true,
            'pickaxe_iron': true,
            'pickaxe_steel': true,
            'hatchet': true,
            'hatchet_bronze': true,
            'hatchet_iron': true,
            'hatchet_steel': true,
            'ore_bronze': true,
            'ore_tin': true,
            'ore_iron': true,
            'ore_coal': true,
            'weed': true,
            'meth': true,
            'berries': true,
            'tinderbox': true,
            'weapon_smg': true,
            'weapon_pistol_wood': true,
            'rake': true
        },
        Draw: function(ctx) {
            let self = this;
            if (self.Placing || self.ShowRadius || self.PreviewOrigin) {
                ctx.fillStyle = 'rgba(0,255,0,' + (self.ShowRadius ? '0.13' : '0.25') + ')';
                drawEllipse(ctx, -(self.BuildRadius / 2) + self.bbox[0] + self.bbox[2] * .5 + (self.PreviewOrigin ? self.PreviewOrigin[0] : self.BuildOrigin[0]), -(self.BuildRadius / 2) + self.bbox[1] + self.bbox[3] * .5 + (self.PreviewOrigin ? self.PreviewOrigin[1] : self.BuildOrigin[1]), self.BuildRadius, self.BuildRadius);

                /*
                let ply = false;
                for (var i=0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].Placing && _G.ents.All[i].class !== 'player') {
                        ply = _G.ents.All[i];
                        break;
                    }
                }

                if (ply) {
                ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillText(_G.distance(self.pos[0]+self.bbox[0]+self.bbox[2]*.5, self.pos[1]+self.bbox[1]+self.bbox[3]*.5, ply.pos[0], ply.pos[1]), 0, 0);
                }
                */
            }
        },
        ThinkClient: function(self, lastTick) {
            if (self.ShowRadius && _G.lastRender - self.ShowRadius > 3000) {
                self.ShowRadius = undefined;
                delete self.ShowRadius;
            }
        },
        Think: function(self, lastTick) {
            if (self.ShowRadius && lastTick - self.ShowRadius > 3000) {
                self.ShowRadius = undefined;
                delete self.ShowRadius;
            }
            if (self.IsOpen && (typeof self.IsOpen !== 'object' || !self.IsOpen.invOpen)) {
                self.IsOpen.container = undefined;
                self.IsOpen = false;
                setTimeout(function() {
                    if (!self.IsOpen) {
                        self.parts[0].img = _G.Material('assets/img/cupboard.png');
                    }
                }, 900);
            }

            if (typeof self.PreviewOriginPly !== 'undefined') {
                if (!self.Hammering) {
                    self.PreviewOrigin = undefined;
					self.PreviewOriginPly.PreviewOrigin = undefined;
                    self.PreviewOriginPly = undefined;
                    self.PreviewOriginPos = undefined;
                    delete self.PreviewOrigin;
                    delete self.PreviewOriginPly;
                    delete self.PreviewOriginPos;
                    return;
                }

                if (typeof self.PreviewOriginPly === 'object') {
                    let newPos = [Math.floor(self.PreviewOriginPly.pos[0] - self.PreviewOriginPos[0]), Math.floor(self.PreviewOriginPly.pos[1] - self.PreviewOriginPos[1])];

                    self.PreviewOrigin[0] += newPos[0];
                    self.PreviewOrigin[1] += newPos[1];

					self.PreviewOriginPly.pos = [self.PreviewOriginPos[0], self.PreviewOriginPos[1]];
                }
            }
        },
        Use: function(self, ply) {
            if (typeof self.Placing !== 'undefined' && self.Placing) {
                return true;
            }

            if (ply.Driving) {
                return true;
            }

            if (typeof ply.PlacingObj !== 'undefined' && ply.PlacingObj) {
                return true;
            }

            if (self.IsOpen && self.IsOpen === ply) {
                return true;
            }

            if (typeof self.LastUse !== 'undefined' && _G.lastTick - self.LastUse < 1000) {
                return true;
            }
            self.LastUse = _G.lastTick;

            self.ShowRadius = _G.lastTick;

            if (self.IsOpen && typeof self.IsOpen === 'object') {
                self.IsOpen.container = undefined;
                delete self.IsOpen.container;
                self.IsOpen = false;
            }

            if (!self.IsOpen) {
                ply.conSlot = undefined;
                ply.conScroll = 0;
                ply.invScroll = 0;
                ply.invSlot = 0;
                ply.invOpen = _G.lastTick;

                if (ply.container) {
                    ply.container.IsOpen = undefined;
                }

                ply.container = self;

                self.IsOpen = ply;

                self.parts[0].img = _G.Material('assets/img/cupboard_open.png');
            } else {

                setTimeout(function() {
                    if (!self.IsOpen) {
                        self.parts[0].img = _G.Material('assets/img/cupboard.png');
                    }
                }, 900);
            }
        }
    }

};

_G.placable['meth_lab_mid'] = clone(_G.placable['meth_lab']);
_G.placable['meth_lab_mid'].img = 'assets/img/m-lab-ghetto.png';
_G.placable['meth_lab_mid'].name = 'Meth Lab Mid';

_G.placable['meth_lab_pro'] = clone(_G.placable['meth_lab']);
_G.placable['meth_lab_pro'].img = 'assets/img/m-lab.png';
_G.placable['meth_lab_pro'].name = 'Meth Lab Pro';

_G.placable['vehicle_car_police'] = clone(_G.placable['vehicle_car1']);
_G.placable['vehicle_car_police'].img = 'assets/img/car-police.png';
_G.placable['vehicle_car_police'].img_item = 'assets/img/car-cop-icon.png';
_G.placable['vehicle_car_police'].name = 'Police Car';

_G.vendors = {
    'dick_head': {
        nametag: 'Dick Head',
        bbox: [12, 30, 72, 82],
        parts: [{
            name: 'Dick Head',
            type: 'drawImg',
            img: _G.Material('assets/img/dick-head.png'),
            x: 0,
            y: 0,
            w: 107,
            h: 116
        }],
        BuyItems: _G.Instance !== 3 ? {
            'logs': 1,
            'logs_oak': 2,
            'metal': 4,
            'metal_iron': 6,
            'metal_steel': 8,
            'berries': 1,
            'soup_berries': 5,
            'hatchet': 7,
            'hatchet_bronze': 8,
            'hatchet_iron': 9,
            'hatchet_steel': 10,
            'pickaxe': 7,
            'pickaxe_bronze': 8,
            'pickaxe_iron': 9,
            'pickaxe_steel': 10,
            'hammer': 4,
            'sword_bronze': 9,
            'sword_iron': 12,
            'ore_coal': 3,
            'ore_iron': 3,
            'ore_tin': 2,
            'ore_copper': 2,
            'rock': 0,
            'tool_cupboard': 20,
            'upgrade_radius': 2500,
            'wall1': 30,
            'barbed_wire': 10,
            'wall1-half': 30,
            'forcefield': 30
        } : {
            'rock': 1,
            'sword_bronze': 1,
            'sword_iron': 1,
            'weapon_pistol_wood': 1,
            'weapon_smg': 1,
            'ammo_smg': 1,
            'ammo_pistol': 1,
            'soup_berries': 1,
            'grenade_beancan': 1
        },
        SellItems: _G.Instance !== 3 ? {
            'rock': 1,
            'hatchet': 12,
            'pickaxe': 12,
            'hammer': 8,
            'weapon_pistol_wood': 30,
            'ammo_pistol': 2,
            'weapon_smg': 55,
            'ammo_smg': 3,
            'weapon_shotgun': 80,
            'ammo_shotgun': 3,
            'weapon_bow': 45,
            'ammo_arrow': 1,
            'sword_bronze': 20,
            'sword_iron': 35,
            'armor_wood_helmet': 25,
            'armor_wood_chest': 40,
            'armor_iron_helmet': 65,
            'armor_iron_chest': 90,
            'hat_cowboy': 15,
            'hat_bucket': 20,
            'hat_tophat': 30,
            'soup_berries': 3,
            'grenade_beancan': 5,
            'upgrade_radius': 3000
        } : {
            'weapon_pistol_wood': 45,
            'sword_bronze': 15,
            'sword_iron': 25,
            'weapon_smg': 80,
            'ammo_smg': 2,
            'ammo_pistol': 2,
            'soup_berries': 2,
            'grenade_beancan': 2
        },
        Stock: [{
			item: 'upgrade_radius',
			am: 1,
			time: 10
		}]
    },
    'seller': {
        nametag: 'Shady Guy',
        title: 'yo wasup',
        bbox: [0, 0, 112, 155],
        parts: [{
            name: 'seller',
            type: 'drawImg',
            img: _G.Material('assets/img/seller.png'),
            x: 0,
            y: 0,
            w: 112,
            h: 160
        }],
        BuyItems: {
            'weed': 2,
            'meth': 10,
            'weed_seed': 3,
            'methylamine': 3,
            'cat_poop': 2,
            'lab_upgrade': 2000,
            'upgrade_radius': 2500,
            'meth_lab': 40
        },
        SellItems: {
            'weed_plant': 800,
            'weed_seed': 800,
            'methylamine': 5,
            'cat_poop': 3,
            'lab_upgrade': 3000,
            'upgrade_radius': 3000,
            'meth_lab': 250
        },
        Stock: [{
			item: 'methylamine',
			am: 4,
			time: 15
		}]
    },
    'dick_chips': {
        bbox: [12, 30, 72, 82],
        parts: [{
            name: 'Dick Head',
            type: 'drawImg',
            img: _G.Material('assets/img/dick-head-waiter.png'),
            x: 0,
            y: 0,
            w: 102,
            h: 116
        }],
        nametag: 'Dick\'s Chips',
        BuyItems: {
            'bug_token': 10
        },
        SellItems: {
            'chips': 1,
            'bug_token': 40,
            'scratch_slots': 6,
            'scratch_lamp': 4,
            'scratch_lamp3': 2,
            'scratch_pirate': 4,
            'scratch_pirate3': 2,
            'scratch_mine': 3,
            'scratch_mine3': 1,
        },
        Currency: {
            'bug_token': 'chips',
            'chips': 'bug_token',
            'scratch_lamp': 'chips',
            'scratch_lamp3': 'chips',
            'scratch_mine': 'chips',
            'scratch_mine3': 'chips',
            'scratch_pirate': 'chips',
            'scratch_pirate3': 'chips',
            'scratch_slots': 'chips',
        },
        Stock: [{
                item: 'scratch_lamp',
                am: 2,
                time: 15
            },
            {
                item: 'scratch_lamp3',
                am: 4,
                time: 15
            },
            {
                item: 'scratch_pirate',
                am: 2,
                time: 15
            },
            {
                item: 'scratch_pirate3',
                am: 4,
                time: 15
            },
            {
                item: 'scratch_mine',
                am: 2,
                time: 15
            },
            {
                item: 'scratch_mine3',
                am: 4,
                time: 15
            },
            // Restock one per hour, with 2 maximum available
            {
                item: 'scratch_slots',
                am: 1,
                time: 60,
                max: 2
            },
        ]
    }
};

_G.seeds = [{
        item: 'seed_berry',
		img_seed: 'assets/img/seeds.png',
        am: 1,
        chance: 10,
        pots: ['pot'],
    },
    {
        item: 'seed_banana',
		img_seed: 'assets/img/seeds.png',
        am: 1,
        chance: 10,
        pots: ['pot'],
    },
    {
        item: 'seed_weed',
		img_seed: 'assets/img/seeds.png',
        am: 1,
        chance: 10,
        pots: ['pot'],
        levels: [{
            skill: 'Farming',
            lvl: 15
        }],
        growTime: 120000,
        growItems: [{
            item: 'weed',
            am: 1
        }],
		deadTime: 400000,
		deadItems: [{
			item: 'hemp',
			am: 1
		}]
    }
];

let footstepKeys = Object.keys(_G.footsteps);
for (var i = 0; i < footstepKeys.length; i++) {
    let steps = _G.footsteps[footstepKeys[i]];
    for (var k = 0; k < steps.length; k++) {
        steps[k] = _G.Sound(steps[k]);
    }
}

_G.playerSaves = {};

if (!_G.Instance) {
    try {
        let playerSaves = JSON.parse(localStorage.getItem('playerSaves'));
        if (playerSaves && typeof playerSaves === 'object') {
            _G.playerSaves = playerSaves;
        }
    } catch (e) {}
}

_G.playerData = {};

/*IF_CLIENT*/
var canvas = document.getElementById('game');

_G.canvas = canvas;

_G.CalcScreenSize = function() {
    _G.ScrW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    _G.ScrH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    // Get the canvas and context
    canvas.width = _G.ScrW;
    canvas.height = _G.ScrH;
};

var ctx = canvas.getContext('2d');

ctx.drawImg = function(img, x, y, w, h, ...args) {
    return ctx.drawImage(typeof img === 'string' ? _G.Material(img) : img, x, y, w, h, ...args);
}

_G.CalcScreenSize();

let ResizeTimer = false;
window.addEventListener('resize', function(ev) {
    if (ResizeTimer) {
        clearTimeout(ResizeTimer);
    }
    ResizeTimer = setTimeout(_G.CalcScreenSize, 150);
});

/*IF_END*/

_G.chats = {};

_G.ents = {
    All: [],
    RenderOrder: [],
    Players: [],
    PlayersActive: [],
    PlayersByName: {},
    Debug: false,
    Colliding: function(ent, include_solid) {
        let collidingEnts = [];
        if (typeof ent.bboxs === 'object') {
            for (var k = 0; k < ent.bboxs.length; k++) {
                let bboxToPoly = getRectPolygon(ent.pos, ent.bboxs[k], (typeof ent.rotate !== 'undefined' ? ent.rotate : 0))

                let ents = checkCollisions(bboxToPoly, ent.pos, ent.bbox, 0, undefined, undefined, ent, include_solid);

                collidingEnts.push(...ents);
            }
        } else {
            let bboxToPoly = getRectPolygon(ent.pos, ent.bbox, ent.rotate)

            collidingEnts = checkCollisions(bboxToPoly, ent.pos, ent.bbox, 0, undefined, undefined, ent, include_solid);
        }

        return collidingEnts;
    }
};

_G.FindGoodPos = function(x, y, bbox) {
    let foundPos = [x, y],
        checkPos = [x - 10, y - 29];

    for (var i = 0; i < 160; i++) {
        if (i % 10 === 0 && i !== 0) {
            checkPos[0] -= 60;
            checkPos[1] += 5;
        } else {
            checkPos[0] += 8;
        }

        let bboxToPoly = getRectPolygon([checkPos[0], checkPos[1]], bbox, 0)

        let collidingEnts = checkCollisions(bboxToPoly, [checkPos[0], checkPos[1]], bbox, 0, true);

        if (collidingEnts.length === 0) {
            foundPos = checkPos;
            break;
        }
    }

    return foundPos;
}

_G.ents.getRenderOrder = function() {
    let finalOrder = [];

    let zOrder = [],
        minX = 999999,
        minY = 999999,
        maxX = 0,
        maxY = 0,
        playersActive = 0,
        playerActive = false;
    for (var i = 0; i < _G.ents.All.length; i++) {

        let ent = _G.ents.All[i];
        if (ent.class === 'player') {
            zOrder.push([ent, ent.pos[1] + ent.bbox[1] + ent.bbox[3]]);

            if (ent.inputLast && _G.lastTick - ent.inputLast < 23000) {
                if (ent.pos[0] < minX) {
                    minX = ent.pos[0];
                }

                if (ent.pos[1] < minY) {
                    minY = ent.pos[1];
                }

                let maxWidth = (ent.pos[0] + ent.bbox[0] + ent.bbox[2]);
                if (maxWidth > maxX) {
                    maxX = maxWidth;
                }

                let maxHeight = (ent.pos[1] + ent.bbox[1] + ent.bbox[3]);
                if (maxHeight > maxY) {
                    maxY = maxHeight;
                }

                playersActive += 1;
                playerActive = ent;
            }
        } else if (typeof ent.bbox !== 'undefined') {
            zOrder.push([ent, ent.pos[1] + ent.bbox[1] + ent.bbox[3]])
        }
    }

    _G.viewport.maxX = maxX;
    _G.viewport.minX = minX;
    _G.viewport.maxY = maxY;
    _G.viewport.minY = minY;

    if (minX != 999999 && _G.downX === false && !_G.CamLock) {

        if (_G.LocalPlayer && !_G.MultiTarget) {
            _G.viewport.xTo = (_G.LocalPlayer.pos[0] + _G.LocalPlayer.bbox[0] + _G.LocalPlayer.bbox[2] * .5);
            _G.viewport.yTo = (_G.LocalPlayer.pos[1] + _G.LocalPlayer.bbox[1] + _G.LocalPlayer.bbox[3] * .5);

            _G.viewport.zoomTo = _G.ZoomScroll ? _G.ZoomScroll : (_G.Instance ? 1 : 2.2);
        } else if (playersActive === 1) {
            _G.viewport.xTo = (playerActive.pos[0] + playerActive.bbox[0] + playerActive.bbox[2] * .5);
            _G.viewport.yTo = (playerActive.pos[1] + playerActive.bbox[1] + playerActive.bbox[3] * .5);

            _G.viewport.zoomTo = _G.Instance ? 1 : 2.2;
        } else if (playersActive === 0) {
            _G.viewport.xTo = _G.BoundaryMinX;
            _G.viewport.yTo = _G.BoundaryMinY;

            _G.viewport.zoomTo = 0.7;
        } else {

            let diffX = (maxX - minX),
                diffY = (maxY - minY),
                diffXWidth = (diffX / canvas.width),
                diffYHeight = (diffY / canvas.height),
                diffHigh = (diffXWidth > diffYHeight ? diffX + 47 : diffY + 48);

            if (_G.Instance) {
                _G.viewport.zoomTo = (0.9 / (diffHigh / (diffXWidth > diffYHeight ? canvas.width : canvas.height)));
            } else {
                _G.viewport.zoomTo = (1 / (diffHigh / (diffXWidth > diffYHeight ? canvas.width : canvas.height)));
            }

            //console.log(_G.viewport.zoomTo);

            //_G.viewport.xTo = (minX - 12);
            //_G.viewport.yTo = (minY - 37);
            _G.viewport.xTo = (minX + diffX * .5);
            _G.viewport.yTo = (minY + diffY * .5) - 28;

            if (_G.viewport.zoomTo > 2.2) {
                _G.viewport.zoomTo = 2.2;
            }
        }
    }

    zOrder.sort(function(a, b) {
        return a[1] - b[1];
    });


    for (var i = 0; i < zOrder.length; i++) {
        if (typeof zOrder[i][0].renderBehindPlayer !== 'undefined' && typeof zOrder[i][0].renderAfterAll === 'undefined') {
            finalOrder.push(zOrder[i][0]);
        }
    }

    for (var i = 0; i < zOrder.length; i++) {
        if (typeof zOrder[i][0].renderBehindPlayer === 'undefined' && typeof zOrder[i][0].renderAfterAll === 'undefined') {
            finalOrder.push(zOrder[i][0]);
        }
    }

    for (var i = 0; i < _G.ents.All.length; i++) {
        if (finalOrder.indexOf(_G.ents.All[i]) === -1) {
            finalOrder.push(_G.ents.All[i]);
        }
    }

    for (var i = 0; i < zOrder.length; i++) {
        if (typeof zOrder[i][0].renderAfterAll !== 'undefined') {
            finalOrder.push(zOrder[i][0]);
        }
    }

    _G.ents.RenderOrder = finalOrder;

};

if (_G.CLIENT) {
    setInterval(_G.ents.getRenderOrder, 50);
    _G.ents.getRenderOrder();
}

_G.ents.getPartByName = function(parts, name) {
    let foundPart = false;
    for (var i = 0; i < parts.length; i++) {
        if (typeof parts[i].name !== 'undefined' && parts[i].name.indexOf(name) !== -1) {
            foundPart = parts[i];
            break;
        }
    }
    return foundPart;
};

_G.wep.RotateWep = function(self, rotateIntensity) {

    let lastDir = 'R';

    if (typeof self.Owner !== 'undefined' && typeof self.Owner.Owner !== 'undefined' && typeof _G.playerData[self.Owner.Owner] !== 'undefined' && typeof _G.playerData[self.Owner.Owner].lastDir !== 'undefined') {
        lastDir = _G.playerData[self.Owner.Owner].lastDir;
    }

    self.rotateOG = (typeof self.rotateOG !== 'undefined' ? self.rotateOG : self.rotate);

    self.rotate += angleToRadians(lastDir === 'L' ? 1 : -1);
    self.rotateBack = false;
    self.rotates = 0;
    self.firstTick = _G.lastTick;

    self[_G.CLIENT ? 'ThinkClient' : 'Think'] = function(self, lastTick) {
        let prog = 0;
        if (self.rotates > 5) {
            prog = (lastTick - self.rotateProg);
        } else {
            if (self.rotates === 5) {
                self.rotateProg = lastTick;
            }

            prog = (lastTick - self.firstTick);
        }

        self.rotates += 1;
        self.rotate = self.rotateOG + angleToRadians(0.2 * rotateIntensity * prog * (lastDir === 'L' ? 1 : -1));
        if (self.rotates >= 10) {
            self.rotates;
            self.rotate = self.rotateOG;
            self.rotateOG = undefined;
            self.Think = undefined;
        }
    };
};

_G.wep.BasicPrimaryAttack = function(self, ply) {
    if ((typeof self.Automatic === 'undefined' || self.Automatic === false) && typeof self.AttackDown !== 'undefined') {
        return false;
    }

    if (typeof self.LastShot !== 'undefined' && _G.lastTick - self.LastShot < self.Primary.Delay) {
        return false;
    }

    if (ply.Driving) {
        return false;
    }

    if (ply.SpawnProtect) {
        ply.SpawnProtect = undefined;
    }
    self.LastShot = _G.lastTick;

    let HasAmmo = ply.HasItem(self.Primary.Ammo);
    if (typeof self.Primary.Ammo !== 'undefined' && HasAmmo === 0) {
        let emptySound = _G.sounds.pistol_empty.cloneNode(true, self.pos);
        emptySound.volume = 0.1;
        emptySound.play();

        ply.ShowNotify('No ammo', 2000);
        return false;
    }

    ply.ShowNotify(HasAmmo - 1, 2050);
    ply.TakeItem(self.Primary.Ammo);
    /*if (typeof self.Primary.Ammo !== 'undefined') {
        ply.Ammo[self.Primary.Ammo] -= 1;
        ply.ShowNotify(ply.Ammo[self.Primary.Ammo], 2050);
    }*/

    ply.LastShot = _G.lastTick;

    /*IF_SERVER*/
    let bullet = _G.ents.Create('bullet');

    let lastDir = 'L';
    if (typeof _G.playerData[ply.Owner] !== 'undefined' && typeof _G.playerData[ply.Owner].lastDir !== 'undefined') {
        lastDir = _G.playerData[ply.Owner].lastDir;
    }

    if (typeof _G.playerData[ply.Owner] !== 'undefined' && ((typeof _G.playerData[ply.Owner].mouse[0] !== 'undefined' && _G.lastTick - _G.playerData[ply.Owner].mouse[0].time < 300) || (typeof _G.playerData[ply.Owner].mouse[2] !== 'undefined' && _G.playerData[ply.Owner].mouse[2].key_position === 'down'))) {
        let mousePos = ((typeof _G.playerData[ply.Owner].mouse[2] !== 'undefined' && _G.playerData[ply.Owner].mouse[2].key_position === 'down') ? _G.playerData[ply.Owner].mouse[2].pos : _G.playerData[ply.Owner].mouse[0].pos);

        let vec = [mousePos[0] - self.pos[0], mousePos[1] - self.pos[1]];
        if (vec[0] > 1 || vec[0] < -1) {
            vec[1] = (vec[1] / vec[0]);
            if (vec[0] < -1) {
                vec[1] = -vec[1];
            }
            vec[0] = (vec[0] > 1 ? 1 : -1);
        }
        if (vec[1] > 1 || vec[1] < -1) {
            vec[0] = (vec[0] / vec[1]);
            if (vec[1] < -1) {
                vec[0] = -vec[0];
            }
            vec[1] = (vec[1] > 1 ? 1 : -1);
        }

        bullet.direction = vec;

        if (mousePos[0] < self.pos[0] && _G.playerData[ply.Owner].lastDir !== 'L') {
            _G.playerData[ply.Owner].lastDir = 'L';

            for (var zz = 0; zz < wsClients.length; zz++) {
                wsClients[zz].send(JSON.stringify({
                    type: 'dirUpdate',
                    user: ply.Owner,
                    time: _G.lastTick,
                    lastDir: 'L'
                }));
            }

            lastDir = _G.playerData[ply.Owner].lastDir;
        } else if (mousePos[0] > self.pos[0] && _G.playerData[ply.Owner].lastDir !== 'R') {
            _G.playerData[ply.Owner].lastDir = 'R';

            for (var zz = 0; zz < wsClients.length; zz++) {
                wsClients[zz].send(JSON.stringify({
                    type: 'dirUpdate',
                    user: ply.Owner,
                    time: _G.lastTick,
                    lastDir: 'R'
                }));
            }

            lastDir = _G.playerData[ply.Owner].lastDir;
        }
    } else {
        bullet.direction = lastDir === 'L' ? -1 : 1;
    }

    bullet.pos = [self.pos[0] + (10 * (lastDir === 'L' ? -1 : 1)), self.pos[1] - 11];
    bullet.parts[0].fillStyle = '#ca7153';
    bullet.Owner = ply;
    bullet.Damage = self.Primary.Damage;

    if (typeof self.Primary.BulletColor !== 'undefined') {
        bullet.parts[0].fillStyle = self.Primary.BulletColor;
    }

    if (typeof self.Primary.Sound !== 'undefined') {

        let shootSound = _G.sounds[self.Primary.Sound][randInt(0, _G.sounds[self.Primary.Sound].length - 1)].cloneNode(true, self.pos);
        shootSound.volume = 0.1;
        shootSound.play();
    } else {
        let shootSound = _G.sounds.pistol[randInt(0, _G.sounds.pistol.length - 1)].cloneNode(true, self.pos);
        shootSound.volume = 0.15;
        shootSound.play();
    }

    self.AttackDown = _G.lastTick;

    /*
    if (typeof self.RotateInterval !== 'undefined') {
        clearInterval(self.RotateInterval);
    }

    let lastDir = _G.playerData[ply.Owner].lastDir;
    let rotates = 0;

    self.rotateOG = (typeof self.rotateOG !== 'undefined' ? self.rotateOG : self.rotate);

    self.rotate += angleToRadians(lastDir === 'L' ? -1 : 1); 

    self.RotateInterval = setInterval(function() {
        rotates += 1;

        let rotateAm = (rotates > 5 ? (10 - rotates) : rotates)*(lastDir === 'L' ? -1 : 1);
        self.rotate = self.rotateOG + angleToRadians(rotateAm*-3);
        if (rotates >= 10) {
            self.rotate = self.rotateOG;
            self.rotateOG = undefined;
            clearInterval(self.RotateInterval);
            self.RotateInterval = undefined;
        }    
    }, 6);
    */
    /*IF_END*/
    _G.wep.RotateWep(self, 1);
};

_G.wep.BasicPickup = function(self, caller, bypass_extra_checks) {
    if (typeof bypass_extra_checks === 'undefined' && typeof caller.LastQuickPickup !== 'undefined' && _G.lastTick - caller.LastQuickPickup < 1400) {
        return true;
    }

    if (self.ShouldRemove === true) {
        return true;
    }

    if (typeof bypass_extra_checks === 'undefined' && typeof caller.PickedBerries !== 'undefined' && _G.lastTick - caller.PickedBerries <= 2200) {
        return true;
    }

    if (self.Holstered) {
        return true;
    }

    if (typeof caller.Driving !== 'undefined') {
        return true;
    }

    if (typeof bypass_extra_checks === 'undefined' && typeof caller.LastEquip !== 'undefined' && (_G.lastTick - caller.LastEquip) < 1200) {
        return true;
    }
    caller.LastEquip = _G.lastTick;

    if (self.Owner === caller && caller.ActiveWeapon !== self && self.pickupItem) {
        self.PrimaryAttack(self, caller);
        return true;
    }
    /*
    if (self.Owner === caller)  {
        if (typeof caller.LastEquip !== 'undefined') {
            // Player is dropping the active weapon
            caller.DropWeapon();
        }
        self.Owner = undefined;

        return false;
    }
    */
    if (typeof self.Owner === 'object' && self.Owner.ActiveWeapon === self) {
        return true;
    }

    if (typeof caller.Holstered === 'undefined' && typeof caller.ActiveWeapon === 'object' && caller.ActiveWeapon.class) {
        caller.Holster();

    }

    caller.DropWeapon();

    /*
    if (typeof self.DropInterval !== 'undefined') {
        clearInterval(self.DropInterval);
        self.DropInterval = undefined;
    }
    */

    if (typeof self.Owner !== 'undefined' && typeof self.Owner.ActiveWeapon !== 'undefined') {
        self.Owner.ActiveWeapon = undefined;
    }
    caller.ActiveWeapon = self;

    self.Weapon = {

    };

    let equipSound = false;
    if (typeof self.EquipSounds === 'object') {
        equipSound = self.EquipSounds[randInt(0, self.EquipSounds.length - 1)].cloneNode(true, self.pos)
        equipSound.volume = 0.5;
        equipSound.play();
    } else {
        equipSound = _G.sounds.equipAmmo.cloneNode(true, self.pos);
        equipSound.volume = 0.2;
        equipSound.play();
    }

    setTimeout(function() {
        try {
            equipSound.destroy();
            equipSound = undefined;
        } catch (e) {
            equipSound = undefined;
        }
    }, 2200);

    self.noShadow = true;
    self.Owner = caller;
    self.parent = caller;
    self.parentPart = 'hand';
    self.parentX = 16;
    self.parentY = -1;
    self.parentRotate = angleToRadians(-20);
    self.rotate = 0;
};

_G.wep.BasicInvPickup = function(self, ply) {
    if (_G.CLIENT) {
        return true;
    }

    if (!self.ShouldRemove && !self._pickupLockTick_inv && (typeof ply.CanInvPickup === 'undefined' || _G.lastTick >= ply.CanInvPickup)) {
        // Lock immediately to prevent race-condition double-pickup within the same tick
        self._pickupLockTick_inv = true;
        let itemName = (self.class.substring(self.class.length - 7) === '_pickup' ? self.class.substring(0, self.class.length - 7) : self.class);
        ply.CanInvPickup = _G.lastTick + 300;

        let equipSound = _G.sounds.equipAmmo.cloneNode(true, self.pos);
        equipSound.volume = 0.2;
        equipSound.play();

        let itemAm = (typeof self.itemAm === 'number' ? self.itemAm : 1);

        ply.ShowNotify('+' + itemAm + ' ' + (typeof _G.items[itemName] !== 'undefined' ? _G.items[itemName].name : itemName), 2000);
        ply.AddItem(typeof self.pickupItem !== 'undefined' ? self.pickupItem : itemName, itemAm);

        self.ShouldRemove = true;
        return false;
    }

    return true;

};

_G.wep.List = {
    'weapon_pistol_wood': {
        parts: [{
            name: 'pistolWood',
            type: 'drawImg',
            img: 'assets/img/pistol-wood.png',
            x: 0,
            y: 0,
            w: 46,
            h: 25
        }],
        bbox: [0, 0, 40, 23],
        Primary: {
            Damage: 28,
            Delay: 500,
            Ammo: 'ammo_pistol'
        },
        pickupItem: 'weapon_pistol_wood',
        holsterX: 3,
        holsterY: 20
    },
    'weapon_smg': {
        parts: [{
            name: 'smg',
            type: 'drawImg',
            img: 'assets/img/smg.png',
            x: 0,
            y: 0,
            w: 66,
            h: 41
        }],
        bbox: [0, 0, 66, 41],
        Primary: {
            Damage: 9,
            Delay: 160,
            Sound: 'smg',
            BulletColor: '#000',
            Ammo: 'ammo_smg'
        },
        pickupItem: 'weapon_smg',
        Automatic: true,
        holsterX: -18,
        holsterY: 8,
        holsterRotate: 75
    },
    'hatchet': {
        parts: [{
            name: 'hatchetWood',
            type: 'drawImg',
            img: 'assets/img/hatchet.png',
            x: 0,
            y: 0,
            w: 20,
            h: 48
        }],
        holsterX: 13,
        holsterY: -30,
        holsterRotate: 11,
        bbox: [0, 0, 20, 48],
        parentOffsetX: -6,
        parentOffsetY: -7,
        pickupItem: 'hatchet',
        Primary: {
            Damage: 10,
            Delay: 500
        },
        PrimaryAttack: function(self, ply) {
            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 1000) {
                return false;
            }

            self.Used = _G.lastTick;

            _G.wep.RotateWep(self, -3);
            if (ply.SpawnProtect) {
                ply.SpawnProtect = undefined;
            }

            /*IF_SERVER*/

            let _hatchetLagToken = (typeof _G.lagComp !== 'undefined') ? _G.lagComp.startForPlayer(ply) : null;
            let lastDir = _G.playerData[ply.Owner].lastDir,
                didCut = false,
                didAttack = [];

            self.colliding = _G.ents.Colliding(self, true);

            for (var i = 0; i < self.colliding.length; i++) {
                if (self.colliding[i].class.substring(0, 4) === 'tree' && typeof self.colliding[i].Cut === 'undefined') {
                    let tree = self.colliding[i];

                    if (typeof tree.OnDamage === 'function') {
                        tree.OnDamage(self, typeof _G.wep.List[self.class].TreeDamage === 'number' ? _G.wep.List[self.class].TreeDamage : 30);
                    }

                    didCut = true;
                } else if (self.colliding[i] !== self.Owner && typeof self.colliding[i].OnDamage === 'function' && _G.distance(
                        self.colliding[i].pos[0] + self.colliding[i].bbox[0] + self.colliding[i].bbox[2] * .5,
                        self.colliding[i].pos[1] + self.colliding[i].bbox[1] + self.colliding[i].bbox[3] * .5,
                        self.pos[0] + self.bbox[0] + self.bbox[2] * .5,
                        self.pos[1] + self.bbox[1] + self.bbox[3] * .5
                    ) < (self.colliding[i].Placable ? 150 : 62)) {
                    self.colliding[i].OnDamage(self, 15);
                    didAttack.push(self.colliding[i]);
                }
            }

            if (!didCut) {
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i] !== self.Owner && typeof _G.ents.All[i].OnDamage === 'function' && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5, self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < (_G.ents.All[i].Placable ? 150 : 62)) {
                        _G.ents.All[i].OnDamage(self, 8);
                    }
                }
            }

            if (_hatchetLagToken) _G.lagComp.endRewind(_hatchetLagToken);

            /*IF_END*/
        }
    },
    'sword_bronze': {
        parts: [{
            name: 'sword',
            type: 'drawImg',
            img: 'assets/img/sword_bronze.png',
            x: 0,
            y: 0,
            w: 21,
            h: 82
        }],
        holsterX: 13,
        holsterY: -30,
        holsterRotate: 11,
        bbox: [-12, 0, 46, 88],
        parentOffsetX: -8,
        parentOffsetY: -26,
        pickupItem: 'sword_bronze',
        Primary: {
            Damage: 10,
            Delay: 500
        },
        PrimaryAttack: function(self, ply) {
            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 1000) {
                return false;
            }

            self.Used = _G.lastTick;

            _G.wep.RotateWep(self, -3);
            if (ply.SpawnProtect) {
                ply.SpawnProtect = undefined;
            }

            /*IF_SERVER*/
            let _swordBronzeLagToken = (typeof _G.lagComp !== 'undefined') ? _G.lagComp.startForPlayer(ply) : null;
            let didAttack = [];

            self.colliding = _G.ents.Colliding(self);

            for (var i = 0; i < self.colliding.length; i++) {
                if (self.colliding[i] !== self.Owner && typeof self.colliding[i].OnDamage === 'function') {
                    self.colliding[i].OnDamage(self, 20);
                    didAttack.push(self.colliding[i]);
                }
            }
            if (_swordBronzeLagToken) _G.lagComp.endRewind(_swordBronzeLagToken);
            /*IF_END*/
        }
    },
    'sword_iron': {
        parts: [{
            name: 'sword',
            type: 'drawImg',
            img: 'assets/img/sword_iron.png',
            x: 0,
            y: 0,
            w: 21,
            h: 82
        }],
        holsterX: 13,
        holsterY: -30,
        holsterRotate: 11,
        bbox: [-12, 0, 46, 88],
        parentOffsetX: -8,
        parentOffsetY: -26,
        pickupItem: 'sword_iron',
        Primary: {
            Damage: 10,
            Delay: 500
        },
        PrimaryAttack: function(self, ply) {
            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 1000) {
                return false;
            }

            self.Used = _G.lastTick;

            _G.wep.RotateWep(self, -3);
            if (ply.SpawnProtect) {
                ply.SpawnProtect = undefined;
            }

            /*IF_SERVER*/
            let _swordIronLagToken = (typeof _G.lagComp !== 'undefined') ? _G.lagComp.startForPlayer(ply) : null;
            let didAttack = [];

            self.colliding = _G.ents.Colliding(self);

            for (var i = 0; i < self.colliding.length; i++) {
                if (self.colliding[i] !== self.Owner && typeof self.colliding[i].OnDamage === 'function') {
                    self.colliding[i].OnDamage(self, 30);
                    didAttack.push(self.colliding[i]);
                }
            }
            if (_swordIronLagToken) _G.lagComp.endRewind(_swordIronLagToken);
            /*IF_END*/
        }
    },
    'rock': {
        parts: [{
            name: 'rockImg',
            type: 'drawImg',
            img: 'assets/img/rock.png',
            x: 0,
            y: 0,
            w: 46,
            h: 34
        }],
        bbox: [0, 0, 46, 34],
        parentOffsetX: -12,
        parentOffsetY: 3,
        Primary: {
            Damage: 10,
            Delay: 500
        },
        PrimaryAttack: function(self, ply) {
            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 1000) {
                return false;
            }

            self.Used = _G.lastTick;

            _G.wep.RotateWep(self, -2);
            if (ply.SpawnProtect) {
                ply.SpawnProtect = undefined;
            }

            /*IF_SERVER*/
            let _rockLagToken = (typeof _G.lagComp !== 'undefined') ? _G.lagComp.startForPlayer(ply) : null;
            let lastDir = _G.playerData[ply.Owner].lastDir,
                didCut = false,
                didAttack = [];

            self.colliding = _G.ents.Colliding(self);

            for (var i = 0; i < self.colliding.length; i++) {
                if (self.colliding[i].class === 'tree' && typeof self.colliding[i].Cut === 'undefined') {
                    let tree = self.colliding[i];

                    if (typeof tree.OnDamage === 'function') {
                        tree.OnDamage(self, 10);
                    }

                    didCut = true;
                } else if (self.colliding[i] !== self.Owner && typeof self.colliding[i].OnDamage === 'function' && _G.distance(
                        self.colliding[i].pos[0] + self.colliding[i].bbox[0] + self.colliding[i].bbox[2] * .5,
                        self.colliding[i].pos[1] + self.colliding[i].bbox[1] + self.colliding[i].bbox[3] * .5,
                        self.pos[0] + self.bbox[0] + self.bbox[2] * .5,
                        self.pos[1] + self.bbox[1] + self.bbox[3] * .5
                    ) < 110) {
                    self.colliding[i].OnDamage(self, 4);
                    didAttack.push(self.colliding[i]);
                }
            }

            if (!didCut) {
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i] !== self.Owner && typeof _G.ents.All[i].OnDamage === 'function' && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5, self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 62) {
                        _G.ents.All[i].OnDamage(self, 8);
                    }
                }
            }

            if (_rockLagToken) _G.lagComp.endRewind(_rockLagToken);
            /*IF_END*/
        }
    },
    'pickaxe': {
        holsterX: -1,
        holsterY: -33,
        holsterRotate: 11,
        parts: [{
            name: 'pickaxe',
            type: 'drawImg',
            img: 'assets/img/pickaxe_wood.png',
            x: 0,
            y: 0,
            w: 43,
            h: 54
        }],
        bbox: [3, 10, 22, 44],
        parentOffsetX: -9,
        parentOffsetY: -7,
        Primary: {
            Damage: 5,
            Delay: 500
        },
        pickupItem: 'pickaxe',
        PrimaryAttack: function(self, ply) {
            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 1000) {
                return false;
            }

            self.Used = _G.lastTick;

            _G.wep.RotateWep(self, -3);
            if (ply.SpawnProtect) {
                ply.SpawnProtect = undefined;
            }

            /*IF_SERVER*/

            let _pickaxeLagToken = (typeof _G.lagComp !== 'undefined') ? _G.lagComp.startForPlayer(ply) : null;
            let lastDir = _G.playerData[ply.Owner].lastDir,
                didCut = false,
                didAttack = [];

            self.colliding = _G.ents.Colliding(self, true);

            for (var i = 0; i < self.colliding.length; i++) {
                if ((self.colliding[i].class === 'rock_copper' || self.colliding[i].class === 'rock_tin' || self.colliding[i].class === 'rock_rune' || self.colliding[i].class === 'rock_iron' || self.colliding[i].class === 'rock_coal') && typeof self.colliding[i].Cut === 'undefined') {
                    let tree = self.colliding[i];

                    let cut = _G.sounds.impacts.rock[randInt(0, _G.sounds.impacts.rock.length - 1)].cloneNode(true, self.pos);
                    cut.volume = 0.4;
                    cut.play();

                    if (typeof tree.OnDamage === 'function') {
                        tree.OnDamage(self, typeof _G.wep.List[self.class].RockDamage === 'number' ? _G.wep.List[self.class].RockDamage : 30);
                    }

                    didCut = true;
                } else if (self.colliding[i] !== self.Owner && typeof self.colliding[i].OnDamage === 'function' && _G.distance(
                        self.colliding[i].pos[0] + self.colliding[i].bbox[0] + self.colliding[i].bbox[2] * .5,
                        self.colliding[i].pos[1] + self.colliding[i].bbox[1] + self.colliding[i].bbox[3] * .5,
                        self.pos[0] + self.bbox[0] + self.bbox[2] * .5,
                        self.pos[1] + self.bbox[1] + self.bbox[3] * .5
                    ) < 110) {
                    self.colliding[i].OnDamage(self, 7);
                    didAttack.push(self.colliding[i]);
                }
            }

            if (!didCut) {
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i] !== self.Owner && typeof _G.ents.All[i].OnDamage === 'function' && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5, self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 62) {
                        _G.ents.All[i].OnDamage(self, 7);
                    }
                }
            }

            if (_pickaxeLagToken) _G.lagComp.endRewind(_pickaxeLagToken);
            /*IF_END*/
        }
    },
    'rake': {
        holsterX: -1,
        holsterY: -33,
        holsterRotate: 11,
        parts: [{
            name: 'pickaxe',
            type: 'drawImg',
            img: 'assets/img/rake.png',
            x: 0,
            y: 0,
            w: 43,
            h: 54
        }],
        bbox: [3, 10, 22, 44],
        parentOffsetX: -9,
        parentOffsetY: -7,
        pickupItem: 'rake',
        Automatic: false,
        Primary: {
            Damage: 0,
            Delay: 500
        },
        alpha: 1,
        StopRake: function(self) {
            try {
                self.RakeSound.pause();
            } catch (e) {}
            try {
                self.RakeSound.destroy();
            } catch (e) {}
            self.parentOffsetX = -9;
            self.parentOffsetY = -7;
            self.rotate = 0;
            self.Shoveling = undefined;
            delete self.Shoveling;
        },
        ThinkClient: true,
        Think: function(self) {
            if (self.Shoveling && !self.ShouldRemove && self.Owner) {
                let shovel = (_G.lastTick - self.Shoveling);
                if (shovel > 600) {
                    /*
                    console.log(self.Shoveling)
                    shovel = 1-((shovel-600)/600);
                    if (shovel < 0) {
                        shovel = 0;

                        if (!self.TookItem) {
                            self.Shoveling = undefined;
                            self.TookItem = undefined;
                        }
                    }
                    */
                    shovel = 1;
                } else {
                    shovel = shovel / 600;

                    if (shovel > 1) {
                        shovel = 1;
                    }

                }

                self.Owner.rotate = angleToRadians((_G.playerData[self.Owner.Owner].lastDir === 'L' ? -18 : 18) * shovel);
                self.Owner.rotateTo = angleToRadians((_G.playerData[self.Owner.Owner].lastDir === 'L' ? -18 : 18) * shovel);
                self.parentOffsetY = 12 * shovel + Math.sin(_G.lastTick * .007) * -7;
                self.parentOffsetX = (_G.playerData[self.Owner.Owner].lastDir === 'L' ? -22 : 6) * shovel + Math.sin(_G.lastTick * .007) * (_G.playerData[self.Owner.Owner].lastDir === 'L' ? -8 : -8);
                self.rotate = angleToRadians((_G.playerData[self.Owner.Owner].lastDir === 'L' ? -154 : 154) * shovel) + angleToRadians(Math.sin(_G.lastTick * .007) * (_G.playerData[self.Owner.Owner].lastDir === 'L' ? -25 : 25));
                //self.parts[0].y = 0*shovel;
            }

            if (self.Shoveling && (typeof self.Owner !== 'object' || typeof _G.playerData[self.Owner.Owner] === 'undefined' || _G.playerData[self.Owner.Owner].input['U'] || _G.playerData[self.Owner.Owner].input['D'] || _G.playerData[self.Owner.Owner].input['L'] || _G.playerData[self.Owner.Owner].input['R'])) {
                self.StopRake(self);
            }

            if (self.ShovelKeyDown && (typeof self.Owner !== 'object' || (typeof _G.playerData[self.Owner.Owner] === 'object' && !_G.playerData[self.Owner.Owner].input['V']))) {
                self.ShovelKeyDown = undefined;
                delete self.ShovelKeyDown;
            }

            if (self.Shoveling && self.LastSound && _G.lastTick - self.LastSound >= 12000) {
                self.LastSound = _G.lastTick;
                self.RakeSound = _G.sounds.raking.cloneNode(true, self.pos);
                self.RakeSound.volume = 0.3;
                self.RakeSound.play();
            }
        },
        PrimaryAttack: function(self, ply) {
            if (self.LastAttack && _G.lastTick - self.LastAttack < 1300) {
                return true;
            }

            if (self.ShovelKeyDown) {
                return true;
            }

            if (self.Shoveling) {
                self.StopRake(self);
                self.ShovelKeyDown = true;
                return true;
            }

            self.ShovelKeyDown = true;
            self.LastAttack = _G.lastTick;

            /*IF_SERVER*/
            self.LastSound = _G.lastTick;

            let snd2 = _G.sounds.shovel.cloneNode(true, self.pos);
            snd2.volume = 0.3;
            snd2.play();

            self.RakeSound = _G.sounds.raking.cloneNode(true, self.pos);
            self.RakeSound.volume = 0.3;
            self.RakeSound.play();
            /*IF_END*/

            self.Shoveling = _G.lastTick;
        }
    },
    'hammer': {
        holsterX: -1,
        holsterY: -33,
        holsterRotate: 11,
        parts: [{
            name: 'hammer',
            type: 'drawImg',
            img: 'assets/img/hammer.png',
            x: 0,
            y: 0,
            w: 43,
            h: 54
        }],
        bbox: [3, 10, 22, 44],
        parentOffsetX: -9,
        parentOffsetY: -7,
        pickupItem: 'hammer',
        Primary: {
            Damage: 5,
            Delay: 500
        },
        PrimaryAttack: function(self, ply, inputInfo) {
            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 1000) {
                return false;
            }
            self.Used = _G.lastTick;

            _G.wep.RotateWep(self, -3);

            /*IF_SERVER*/

            if (typeof self.Mover === 'object') {
                self.Mover.Moving = undefined;
                delete self.Mover.Moving;
                self.Mover = undefined;
                delete self.Mover;

                return;
            }

            let nearPlace = false,
                nearDist = 9999999,
				nearPos = [self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5];

			if (typeof inputInfo === 'object' && inputInfo.type === 'Mouse') {
				// Use mouse position instead of weapon position if available
				nearPos = [inputInfo.pos[0], inputInfo.pos[1]];
			}

            for (var i = 0; i < _G.ents.All.length; i++) {
                // Pickup placable objects
                if (_G.ents.All[i].Placable && (!_G.ents.All[i].Hammering || _G.ents.All[i].Hammering !== ply) && (self.Owner.Owner === 'goosely' || _G.ents.All[i].Owner === self.Owner.Owner) && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < nearDist && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 500) {
                    nearDist = _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], nearPos[0], nearPos[1]);
                    nearPlace = _G.ents.All[i];
                }

                // Allow Jackool to pickup anything
                if (self.Owner.Owner === 'goosely' && (!_G.ents.All[i].Owner || _G.ents.All[i].Owner !== 'goosely') && !_G.ents.All[i].Primary && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < nearDist && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 500) {
                    nearDist = _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], nearPos[0], nearPos[1]);
                    nearPlace = _G.ents.All[i];
                }

                // Pickup inventory items that allow hammer pickup
                if (typeof _G.items[_G.ents.All[i].class] === 'object' && _G.items[_G.ents.All[i].class].HammerPickup && (!_G.ents.All[i].Hammering || _G.ents.All[i].Hammering !== ply) && (self.Owner.Owner === 'goosely' || (_G.ents.All[i].PlacedBy === self.Owner.Owner || _G.ents.All[i].Owner === self.Owner.Owner)) && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < nearDist && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 500) {
                    nearDist = _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], nearPos[0], nearPos[1]);
                    nearPlace = _G.ents.All[i];
                }


                // Deselect any entities the player already hammered
                if (_G.ents.All[i].Hammering && _G.ents.All[i].Hammering === self.Owner) {
                    _G.ents.All[i].Hammering = undefined;
                    delete _G.ents.All[i].Hammering;
                }

                // Entity move mode (admin only due to it not checking for collisions/spawn/etc)
                if (_G.ents.All[i].Moving && _G.ents.All[i].Moving === self.Owner) {
                    _G.ents.All[i].Moving = undefined;
                    delete _G.ents.All[i].Moving;
                }

            }

            if (nearPlace) {
                if (self.MoveMode) {
                    nearPlace.Moving = self.Owner;
                    nearPlace.MoveOrigin = [nearPlace.pos[0], nearPlace.pos[1]];
                    nearPlace.MoveStart = [self.Owner.pos[0], self.Owner.pos[1]];
                    self.Mover = nearPlace;
                    self.MoveStart = [self.Owner.pos[0], self.Owner.pos[1]];
                    sendChat('@' + self.Owner.Owner + ' swing hammer to finish placing')
                } else {
                    nearPlace.Hammering = self.Owner;
                    let _upg = _G.buildUpgrades && _G.buildUpgrades[nearPlace.class];
                    let _hintParts = ['V: pick up (75% refund)'];
                    if (_upg) _hintParts.push('!upgrade \u2192 ' + _upg.name);
                    if (nearPlace.class === 'tool_cupboard') _hintParts.push('!origin to reposition');
                    if (typeof self.Owner.LastPickTxt === 'undefined' || _G.lastTick - self.Owner.LastPickTxt > 15000) {
                        self.Owner.LastPickTxt = _G.lastTick;
                        sendChat('@' + self.Owner.Owner + ' [Hammer] Selected (' + _hintParts.join(' | ') + ')');
                    }
                }
            }

            /*IF_END*/

        }
    },
    'tinderbox': {
        holsterX: -7,
        holsterY: 4,
        holsterRotate: 6,
        parts: [{
            name: 'tinderbox',
            type: 'drawImg',
            img: 'assets/img/tinderbox.png',
            x: 0,
            y: 0,
            w: 44,
            h: 40
        }],
        bbox: [3, 3, 38, 34],
        parentOffsetX: -9,
        parentOffsetY: -7,
        pickupItem: 'tinderbox',
        Primary: {
            Damage: 0,
            Delay: 500
        },
        PrimaryAttack: function(self, ply) {
            if (self.LastAttack && _G.lastTick - self.LastAttack < 1000) {
                return true;
            }

            self.LastAttack = _G.lastTick;

            _G.wep.RotateWep(self, 4);

            /*IF_SERVER*/

            self.colliding = _G.ents.Colliding(self);

            let snd = _G.sounds.tinder[randInt(0, _G.sounds.tinder.length - 1)].cloneNode(true, self.pos);
            snd.volume = 0.2;
            snd.play();

            for (var i = 0; i < self.colliding.length; i++) {
                if (!self.colliding[i].ShouldRemove && typeof _G.wep.List[self.colliding[i].class] === 'object' && typeof _G.wep.List[self.colliding[i].class].BurnLength !== 'undefined') {
                    if (typeof _G.wep.List[self.colliding[i].class].BurnLevel !== 'undefined' && (typeof ply.skills['Firemaking'] !== 'object' || ply.skills['Firemaking'].lvl <= _G.wep.List[self.colliding[i].class].BurnLevel)) {
                        ply.ShowNotify('Need ' + _G.wep.List[self.colliding[i].class].BurnLevel + ' Firemaking', 2000);
                        return true;
                    }

                    let randChance = randInt(0, 70);
                    if (randChance <= (typeof ply.skills['Firemaking'] !== 'undefined' ? ply.skills['Firemaking'].lvl : 1)) {
                        ply.AddXP('Firemaking', 20);

                        let fire = _G.ents.Create('campfire');
                        fire.BurnLength = _G.wep.List[self.colliding[i].class].BurnLength;
                        fire.pos = [self.colliding[i].pos[0] + randInt(-10, 10), self.colliding[i].pos[1] + randInt(-10, 10)];

                        if (self.colliding[i].itemAm) {
                            self.colliding[i].itemAm -= 1;
                        }

                        if (typeof self.colliding[i].itemAm === 'undefined' || self.colliding[i].itemAm <= 0) {
                            self.colliding[i].ShouldRemove = true;
                        }

                        let snd2 = _G.sounds.ignite.cloneNode(true, self.pos);
                        snd2.volume = 0.3;
                        snd2.play();
                    } else {
                        ply.ShowNotify('Failed', 1000);
                    }

                    break;
                } else if (!self.colliding[i].ShouldRemove && self.colliding[i].class === 'player' && self.colliding[i] !== self.Owner && self.colliding[i].Dying && (typeof self.colliding[i].alpha === 'undefined' || self.colliding[i].alpha > 0.9)) {
                    let randChance = randInt(0, 70);
                    if (randChance <= (typeof ply.skills['Firemaking'] !== 'undefined' ? ply.skills['Firemaking'].lvl : 1)) {
                        ply.AddXP('Firemaking', 20);

                        let fire = _G.ents.Create('bones');
                        fire.pos = [self.colliding[i].pos[0] + randInt(-10, 10), self.colliding[i].pos[1] + randInt(-10, 10)];

                        self.colliding[i].alpha = 0;

                        let snd2 = _G.sounds.ignite.cloneNode(true, self.pos);
                        snd2.volume = 0.3;
                        snd2.play();
                    } else {
                        ply.ShowNotify('Failed', 1000);
                    }

                    break;
                }
            }

            /*IF_END*/

        }
    },
    'bones': {
        holsterX: -1,
        holsterY: -33,
        holsterRotate: 11,
        parts: [{
            name: 'bones',
            type: 'drawImg',
            img: 'assets/img/bones.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [3, 3, 26, 26],
        parentOffsetX: -9,
        pickupItem: 'bones',
        Primary: {
            Damage: 0,
            Delay: 500
        },
        alpha: 1,
        ThinkClient: true,
        Think: function(self) {
            if (self.Shoveling && !self.ShouldRemove && self.Owner) {
                let shovel = (_G.lastTick - self.Shoveling);
                if (shovel > 600) {
                    //console.log(self.Shoveling)
                    shovel = 1 - ((shovel - 600) / 600);
                    if (shovel < 0) {
                        shovel = 0;

                        if (!self.TookItem) {
                            /*IF_SERVER*/
                            if (typeof self.itemAm !== 'undefined') {
                                self.itemAm -= 1;
                            }

                            if (typeof self.itemAm === 'undefined' || self.itemAm <= 0) {
                                self.ShouldRemove = true;
                            } else {
                                self.alpha = 1;
                            }
                            self.Owner.AddXP('Prayer', 15)

                            self.Owner.ShowNotify('☠️ R.I.P. ☠️', 1500);
                            /*IF_END*/

                            self.TookItem = true;

                            self.Shoveling = undefined;

                        }
                    } else {
                        self.alpha = 0;
                    }

                } else {
                    shovel = shovel / 600;
                    if (shovel > 0.8) {
                        self.alpha = 1 - ((shovel - 0.8) / 0.2);
                    }

                    if (shovel > 1) {
                        shovel = 1;
                    }

                }

                self.Owner.rotate = angleToRadians((_G.playerData[self.Owner.Owner].lastDir === 'L' ? -30 : 30) * shovel);
                self.Owner.rotateTo = angleToRadians((_G.playerData[self.Owner.Owner].lastDir === 'L' ? -30 : 30) * shovel);
                self.parentOffsetY = 26 * shovel;
                self.parentOffsetX = -9 - 8 * shovel;
            }
        },
        PrimaryAttack: function(self, ply) {
            if (self.Shoveling) {
                return true;
            }
            if (self.LastAttack && _G.lastTick - self.LastAttack < 1300) {
                return true;
            }

            self.LastAttack = _G.lastTick;

            self.TookItem = undefined;

            /*IF_SERVER*/
            let snd2 = _G.sounds.shovel.cloneNode(true, self.pos);
            snd2.volume = 0.3;
            snd2.play();
            /*IF_END*/

            self.Shoveling = _G.lastTick;
        }
    },
    'jihad': {
        parts: [{
            name: 'jihad',
            type: 'drawImg',
            img: 'assets/img/jihad.png',
            x: 0,
            y: 0,
            w: 27,
            h: 37
        }],
        bbox: [2, 0, 20, 36],
        Primary: {
            Damage: 1000,
            Delay: 2
        },
        pickupItem: 'jihad',
        Think: function(self) {
            if (typeof self.Used !== 'undefined') {
                let timeSince = (_G.lastTick - self.Used);
                self.parts[0].w = 27 + 20 * (timeSince / 3000) + (Math.sin(_G.lastTick * .005) * 25);
                self.parts[0].h = 37 + 20 * (timeSince / 3000) + Math.sin(_G.lastTick * .5) * 25;
            }
        },
        PrimaryAttack: function(self, ply) {
            if (self.ShouldRemove) {
                return;
            }

            if (typeof self.Used !== 'undefined' && _G.lastTick - self.Used < 4000) {
                return false;
            }

            self.Used = _G.lastTick;
            if (ply.SpawnProtect) {
                ply.SpawnProtect = undefined;
            }

            /*IF_SERVER*/

            let jihadSound = _G.sounds.jihad.cloneNode(true, self.pos);
            jihadSound.volume = 0.3;
            jihadSound.play();

            let ogOwner = self.Owner;

            setTimeout(function() {
                self.parts[0].w = 34;
                self.parts[0].h = 43;

                self.Used = undefined;

                if (self.Owner !== ogOwner) {
                    return;
                }

                let explodeSound = _G.sounds.big_explosion.cloneNode(true, self.pos);
                explodeSound.volume = 0.3;
                explodeSound.play();

                self.ShouldRemove = true;

                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'player') {
                        if (_G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0], self.pos[1]) < 300) {

                            _G.ents.All[i].OnDamage(self, 80);


                            let blowUpSprite = _G.ents.Create('fire_cloud');
                            blowUpSprite.pos = [self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5]

                            let pain = _G.sounds.impacts.pain_ply[randInt(0, _G.sounds.impacts.pain_ply.length - 1)].cloneNode(true, self.pos);
                            pain.volume = 0.15;
                            pain.play();
                        }
                    }
                }
            }, 2320);


            /*IF_END*/
        }
    },
    'ammo_pistol': {
        parts: [{
            name: 'pistolAmmo',
            type: 'drawImg',
            img: 'assets/img/ammo.png',
            x: 0,
            y: 0,
            w: 44,
            h: 44
        }],
        bbox: [0, 0, 44, 44],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'ammo_pistol',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'ammo_smg': {
        parts: [{
            name: 'pistolAmmo',
            type: 'drawImg',
            img: 'assets/img/ammo_smg.png',
            x: 0,
            y: 0,
            w: 44,
            h: 44
        }],
        bbox: [0, 0, 44, 44],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'ammo_smg',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'meth': {
        parts: [{
            name: 'meth',
            type: 'drawImg',
            img: 'assets/img/meth.png',
            x: 0,
            y: 0,
            w: 22,
            h: 28
        }],
        bbox: [0, 0, 22, 28],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'meth',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'methylamine': {
        parts: [{
            name: 'methylamine',
            type: 'drawImg',
            img: 'assets/img/methylamine.png',
            x: 0,
            y: 0,
            w: 62,
            h: 104
        }],
        bbox: [0, 0, 62, 104],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'methylamine',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'cat_poop': {
        parts: [{
            name: 'poop',
            type: 'drawImg',
            img: 'assets/img/cat_poop.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [0, 0, 32, 32],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'cat_poop',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'lab_upgrade': {
        parts: [{
            name: 'upgrade',
            type: 'drawImg',
            img: 'assets/img/lab_upgrade.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [0, 0, 32, 32],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'lab_upgrade',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'upgrade_radius': {
        parts: [{
            name: 'upgrade',
            type: 'drawImg',
            img: 'assets/img/upgrade_radius.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [0, 0, 32, 32],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'upgrade_radius',
        Think: function(self) {
            if (!self.ShouldRemove && (typeof self.LastUpCheck === 'undefined' || _G.lastTick - self.LastUpCheck >= 4000)) {
                self.LastUpCheck = _G.lastTick;

                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (!_G.ents.All[i].ShouldRemove && _G.ents.All[i].class === 'tool_cupboard' && _G.ents.All[i].class === 'tool_cupboard' && ((typeof self.Owner === 'object' && self.Owner.Owner === _G.ents.All[i].Owner) || self.PlacedBy === _G.ents.All[i].Owner) && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5, self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 37) {
                        if (_G.ents.All[i].BuildRadius > 800) {
                            if (_G.ents.PlayersByName[_G.ents.All[i].Owner]) {
                                _G.ents.PlayersByName[_G.ents.All[i].Owner].ShowNotify('Cupboard has max upgrade already', 2500);
                            }
                            continue;
                        }
                        if (typeof self.itemAm !== 'undefined') {
                            self.itemAm -= 1;
                        }

                        if (typeof self.itemAm === 'undefined' || self.itemAm <= 0) {
                            self.ShouldRemove = true;
                        }

                        _G.ents.All[i].BuildRadius += 90;
                        _G.ents.All[i].ShowRadius = _G.lastTick;

                        break;
                    }
                }
            }
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'weed': {
        parts: [{
            name: 'weed',
            type: 'drawImg',
            img: 'assets/img/nugs.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [0, 0, 32, 32],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'weed',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'weed_seed': {
        parts: [{
            name: 'weed_seed',
            type: 'drawImg',
            img: 'assets/img/seeds.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [0, 0, 32, 32],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'weed_seed',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'charms': {
        parts: [{
            name: 'charms',
            type: 'drawImg',
            img: 'assets/img/gamecharms.png',
            x: 0,
            y: 0,
            w: 40,
            h: 30
        }],
        bbox: [1, 1, 38, 28],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'charms',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'chips': {
        parts: [{
            name: 'chips',
            type: 'drawImg',
            img: 'assets/img/chips.png',
            x: 0,
            y: 0,
            w: 44,
            h: 44
        }],
        bbox: [4, 4, 36, 36],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'chips',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'bug_token': {
        parts: [{
            name: 'bug_token',
            type: 'drawImg',
            img: 'assets/img/bug_token.png',
            x: 0,
            y: 0,
            w: 70,
            h: 70
        }],
        bbox: [1, 1, 68, 68],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 'bug_token',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'logs': {
        parts: [{
            name: 'logs',
            type: 'drawImg',
            img: 'assets/img/logs.png',
            x: 0,
            y: 0,
            w: 44,
            h: 41
        }],
        bbox: [1, 1, 42, 39],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        BurnLength: 60000,
        pickupItem: 'logs',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'logs_oak': {
        parts: [{
            name: 'logs_oak',
            type: 'drawImg',
            img: 'assets/img/logs_oak.png',
            x: 0,
            y: 0,
            w: 44,
            h: 41
        }],
        bbox: [1, 1, 42, 39],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        BurnLength: 130000,
        BurnLevel: 4,
        pickupItem: 'logs_oak',
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'metal': {
        parts: [{
            name: 'metal',
            type: 'drawImg',
            img: 'assets/img/metal.png',
            x: 0,
            y: 0,
            w: 39,
            h: 32
        }],
        pickupItem: 'metal',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'metal_iron': {
        parts: [{
            name: 'metal',
            type: 'drawImg',
            img: 'assets/img/metal_iron.png',
            x: 0,
            y: 0,
            w: 39,
            h: 32
        }],
        pickupItem: 'metal_iron',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'metal_steel': {
        parts: [{
            name: 'metal',
            type: 'drawImg',
            img: 'assets/img/metal_steel.png',
            x: 0,
            y: 0,
            w: 39,
            h: 32
        }],
        pickupItem: 'metal_steel',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'ore_copper': {
        parts: [{
            name: 'ore',
            type: 'drawImg',
            img: 'assets/img/ore_copper.png',
            x: 0,
            y: 0,
            w: 36,
            h: 36
        }],
        pickupItem: 'ore_copper',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'ore_tin': {
        parts: [{
            name: 'ore',
            type: 'drawImg',
            img: 'assets/img/ore_tin.png',
            x: 0,
            y: 0,
            w: 36,
            h: 36
        }],
        pickupItem: 'ore_tin',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'ore_iron': {
        parts: [{
            name: 'ore',
            type: 'drawImg',
            img: 'assets/img/ore_iron.png',
            x: 0,
            y: 0,
            w: 36,
            h: 36
        }],
        pickupItem: 'ore_iron',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'ore_coal': {
        parts: [{
            name: 'ore',
            type: 'drawImg',
            img: 'assets/img/ore_coal.png',
            x: 0,
            y: 0,
            w: 36,
            h: 36
        }],
        pickupItem: 'ore_coal',
        bbox: [1, 1, 37, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'berries': {
        parts: [{
            name: 'berries',
            type: 'drawImg',
            img: 'assets/img/berries.png',
            x: 0,
            y: 0,
            w: 37,
            h: 41
        }],
        pickupItem: 'berries',
        bbox: [1, 1, 36, 40],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'diet_cola': {
        parts: [{
            name: 'cola',
            type: 'drawImage',
            img: 'assets/img/diet_cola.png',
            x: 0,
            y: 0,
            w: 18,
            h: 34
        }],
        pickupItem: 'diet_cola',
        bbox: [1, 1, 36, 40],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'soup_berries': {
        parts: [{
            name: 'soup',
            type: 'drawImg',
            img: 'assets/img/soup_berries.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        pickupItem: 'soup_berries',
        bbox: [3, 3, 26, 26],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    },
    'grenade_beancan': {
        parts: [{
            name: 'grenade',
            type: 'drawImg',
            img: 'assets/img/grenade_beancan.png',
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        pickupItem: 'grenade_beancan',
        bbox: [1, 1, 30, 30],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        ThinkClient: true,
        Think: function(self) {
            if (self.ShouldRemove) {
                return;
            }

            if (self.GoPos) {
                self.pos[0] += self.GoMove[0];
                self.pos[1] += self.GoMove[1];
                self.GoInterval += 1;
                if (self.GoInterval >= 30) {
                    self.GoPos = undefined;
                }

                self.rotate += angleToRadians(8);
            }

            if (self.BlowUp && _G.lastTick - self.BlowUp > 3000 && !self.BlownUp) {
                self.ShouldRemove = true;
                self.BlownUp = true;

                /*IF_SERVER*/
                let blowUp = _G.sounds.explosions[randInt(0, _G.sounds.explosions.length - 1)].cloneNode(true, self.pos);
                blowUp.volume = 0.15;
                blowUp.play();

                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (typeof _G.ents.All[i].OnDamage === 'function' && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5, self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5) < 147) {
                        _G.ents.All[i].OnDamage(self, 70);
                    }
                }


                let blowUpSprite = _G.ents.Create('fire_cloud');
                blowUpSprite.pos = [self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5]
                /*IF_END*/
            }
        },
        PrimaryAttack: function(self, ply) {
            if (self.GoPos || self.ShouldRemove) {
                return true;
            }
            if (self.LastAttack && _G.lastTick - self.LastAttack < 1000) {
                return true;
            }

            self.LastAttack = _G.lastTick;


            /*IF_SERVER*/
            let nade = false;

            if (self.itemAm > 1) {
                self.itemAm -= 1;
                nade = _G.ents.Create('grenade_beancan');
                nade.pos = [self.pos[0], self.pos[1]];
            } else {
                nade = self;
                ply.DropWeapon();
            }

            nade.GoPos = [(ply.lastDirPress === 'L' ? -120 : (ply.lastDirPress === 'R' ? 120 : 10)), (ply.lastDirPress === 'U' ? -120 : (ply.lastDirPress === 'D' ? 120 : 10))];
            nade.GoInterval = 0;
            nade.GoMove = [nade.GoPos[0] / 30, nade.GoPos[1] / 30];

            nade.Dropping = undefined;
            delete nade.Dropping;
            nade.DropAdd = undefined;
            delete nade.DropAdd;
            nade.noShadow = true;

            nade.BlowUp = _G.lastTick;
            /*IF_END*/

            return false;
        },
        Draw: function(ctx) {
            let self = this;
            if (self.Owner) {
                ctx.fillStyle = 'rgba(255,0,0,0.85)'
                ctx.fillRect((self.Owner.lastDirPress === 'L' ? -100 : (self.Owner.lastDirPress === 'R' ? 100 : 10)), (self.Owner.lastDirPress === 'U' ? -100 : (self.Owner.lastDirPress === 'D' ? 100 : 10)), 9, 9);
            }

            if (self.BlowUp) {
                ctx.fillStyle = 'rgba(255,0,0,' + Math.sin(_G.lastTick * .009) * 0.8 + ')';
                drawEllipse(ctx, 6, 6, 20, 20);
            }
        }
    },
    't-berries': {
        parts: [{
            name: 'berries',
            type: 'drawImg',
            img: 'assets/img/turd-berries.png',
            x: 0,
            y: 0,
            w: 37,
            h: 41
        }],
        bbox: [1, 1, 36, 40],
        Primary: {
            Damage: 0,
            Delay: 1
        },
        pickupItem: 't-berries',
        PrimaryAttack: _G.wep.BasicInvPickup
    }
};

_G.wep.List['hatchet_blue'] = clone(_G.wep.List['hatchet']);
_G.wep.List['hatchet_blue'].pickupItem = 'hatchet_blue';
_G.wep.List['hatchet_blue'].parts[0].img = 'assets/img/hatchet-blue.png';

// ── SHOTGUN ───────────────────────────────────────────────────────────────────
_G.wep.List['weapon_shotgun'] = {
    parts: [{
        name: 'shotgun',
        type: 'drawImg',
        img: 'assets/img/shotgun.png',
        x: 0,
        y: 0,
        w: 48,
        h: 24
    }],
    bbox: [0, 0, 48, 24],
    Primary: {
        Damage: 18,
        Delay: 900,
        Ammo: 'ammo_shotgun',
        BulletColor: '#ffcc44'
    },
    pickupItem: 'weapon_shotgun',
    holsterX: 2,
    holsterY: 18,
    PrimaryAttack: function(self, ply) {
        if (typeof self.AttackDown !== 'undefined') return false;
        if (typeof self.LastShot !== 'undefined' && _G.lastTick - self.LastShot < 900) return false;
        if (ply.Driving) return false;
        if (ply.SpawnProtect) { ply.SpawnProtect = undefined; }
        self.LastShot = _G.lastTick;

        let HasAmmo = ply.HasItem('ammo_shotgun');
        if (HasAmmo === 0) {
            let emptySound = _G.sounds.pistol_empty.cloneNode(true, self.pos);
            emptySound.volume = 0.1;
            emptySound.play();
            ply.ShowNotify('No shells', 2000);
            return false;
        }
        ply.TakeItem('ammo_shotgun', 1);
        ply.ShowNotify('Shells: ' + (HasAmmo - 1), 2000);
        ply.LastShot = _G.lastTick;

        /*IF_SERVER*/
        let lastDir = (typeof _G.playerData[ply.Owner] !== 'undefined' ? _G.playerData[ply.Owner].lastDir : 'R') || 'R';
        let baseDir = [0, 0];

        if (typeof _G.playerData[ply.Owner] !== 'undefined' && ((typeof _G.playerData[ply.Owner].mouse[0] !== 'undefined' && _G.lastTick - _G.playerData[ply.Owner].mouse[0].time < 300) || (typeof _G.playerData[ply.Owner].mouse[2] !== 'undefined' && _G.playerData[ply.Owner].mouse[2].key_position === 'down'))) {
            let mousePos = ((typeof _G.playerData[ply.Owner].mouse[2] !== 'undefined' && _G.playerData[ply.Owner].mouse[2].key_position === 'down') ? _G.playerData[ply.Owner].mouse[2].pos : _G.playerData[ply.Owner].mouse[0].pos);
            let vec = [mousePos[0] - self.pos[0], mousePos[1] - self.pos[1]];
            if (vec[0] > 1 || vec[0] < -1) { vec[1] = (vec[1] / vec[0]); if (vec[0] < -1) { vec[1] = -vec[1]; } vec[0] = (vec[0] > 1 ? 1 : -1); }
            if (vec[1] > 1 || vec[1] < -1) { vec[0] = (vec[0] / vec[1]); if (vec[1] < -1) { vec[0] = -vec[0]; } vec[1] = (vec[1] > 1 ? 1 : -1); }
            baseDir = vec;
        } else {
            baseDir = [lastDir === 'L' ? -1 : 1, 0];
        }

        // Fire 5 pellets with spread
        let spreadAngles = [-0.28, -0.14, 0, 0.14, 0.28];
        for (let p = 0; p < spreadAngles.length; p++) {
            let pellet = _G.ents.Create('bullet');
            let angle = spreadAngles[p];
            let dx = baseDir[0], dy = (baseDir[1] || 0);
            // Rotate direction by spread angle
            let cos = Math.cos(angle), sin = Math.sin(angle);
            pellet.direction = [dx * cos - dy * sin, dx * sin + dy * cos];
            pellet.pos = [self.pos[0] + (10 * (baseDir[0] > 0 ? 1 : -1)), self.pos[1] - 11];
            pellet.parts[0].fillStyle = '#ffcc44';
            pellet.Owner = ply;
            pellet.Damage = 18;
            pellet.Speed = 10;
        }

        let shootSound = _G.sounds.pistol[randInt(0, _G.sounds.pistol.length - 1)].cloneNode(true, self.pos);
        shootSound.volume = 0.22;
        shootSound.play();
        /*IF_END*/
        _G.wep.RotateWep(self, 1);
    }
};

// ── BOW ───────────────────────────────────────────────────────────────────────
_G.wep.List['weapon_bow'] = {
    parts: [{
        name: 'bow',
        type: 'drawImg',
        img: 'assets/img/bow.png',
        x: 0,
        y: 0,
        w: 24,
        h: 40
    }],
    bbox: [0, 0, 24, 40],
    Primary: {
        Damage: 22,
        Delay: 800,
        Ammo: 'ammo_arrow',
        BulletColor: '#c87820'
    },
    pickupItem: 'weapon_bow',
    holsterX: 10,
    holsterY: 5,
    holsterRotate: 90,
    ThinkClient: function(self) {
        if (self.Holstered || !self.Owner || !self.Owner.Owner) return;
        let pd = _G.playerData[self.Owner.Owner];
        if (!pd) return;
        if (pd.lastDir === 'L') {
            self.parentOffsetX = -6;
            self.parentOffsetY = -10;
            self.parentRotate = 0;
        } else {
            self.parentOffsetX = 0;
            self.parentOffsetY = -10;
            self.parentRotate = 0;
        }
    },
    PrimaryAttack: function(self, ply) {
        if (typeof self.AttackDown !== 'undefined') return false;
        if (typeof self.LastShot !== 'undefined' && _G.lastTick - self.LastShot < 800) return false;
        if (ply.Driving) return false;
        if (ply.SpawnProtect) { ply.SpawnProtect = undefined; }
        self.LastShot = _G.lastTick;

        let HasAmmo = ply.HasItem('ammo_arrow');
        if (HasAmmo === 0) {
            let emptySound = _G.sounds.pistol_empty.cloneNode(true, self.pos);
            emptySound.volume = 0.08;
            emptySound.play();
            ply.ShowNotify('No arrows', 2000);
            return false;
        }
        ply.TakeItem('ammo_arrow', 1);
        ply.ShowNotify('Arrows: ' + (HasAmmo - 1), 2000);
        ply.LastShot = _G.lastTick;

        /*IF_SERVER*/
        let arrow = _G.ents.Create('bullet');
        let lastDir = (typeof _G.playerData[ply.Owner] !== 'undefined' ? _G.playerData[ply.Owner].lastDir : 'R') || 'R';

        if (typeof _G.playerData[ply.Owner] !== 'undefined' && ((typeof _G.playerData[ply.Owner].mouse[0] !== 'undefined' && _G.lastTick - _G.playerData[ply.Owner].mouse[0].time < 300) || (typeof _G.playerData[ply.Owner].mouse[2] !== 'undefined' && _G.playerData[ply.Owner].mouse[2].key_position === 'down'))) {
            let mousePos = ((typeof _G.playerData[ply.Owner].mouse[2] !== 'undefined' && _G.playerData[ply.Owner].mouse[2].key_position === 'down') ? _G.playerData[ply.Owner].mouse[2].pos : _G.playerData[ply.Owner].mouse[0].pos);
            let vec = [mousePos[0] - self.pos[0], mousePos[1] - self.pos[1]];
            if (vec[0] > 1 || vec[0] < -1) { vec[1] = (vec[1] / vec[0]); if (vec[0] < -1) { vec[1] = -vec[1]; } vec[0] = (vec[0] > 1 ? 1 : -1); }
            if (vec[1] > 1 || vec[1] < -1) { vec[0] = (vec[0] / vec[1]); if (vec[1] < -1) { vec[0] = -vec[0]; } vec[1] = (vec[1] > 1 ? 1 : -1); }
            arrow.direction = vec;
        } else {
            arrow.direction = lastDir === 'L' ? -1 : 1;
        }

        arrow.pos = [self.pos[0] + (10 * (lastDir === 'L' ? -1 : 1)), self.pos[1] - 11];
        arrow.parts[0].fillStyle = '#c87820';
        arrow.parts[0].w = 22;
        arrow.parts[0].h = 4;
        arrow.bbox = [-11, -2, 22, 4];
        arrow.isArrow = true;
        arrow.Owner = ply;
        arrow.Damage = 22;
        arrow.Speed = 9;

        // Quiet bowfire sound
        let shootSound = _G.sounds.pistol[randInt(0, _G.sounds.pistol.length - 1)].cloneNode(true, self.pos);
        shootSound.volume = 0.04;
        shootSound.play();
        /*IF_END*/
        _G.wep.RotateWep(self, 1);
    }
};



_G.wep.List['hatchet_bronze'] = clone(_G.wep.List['hatchet']);
_G.wep.List['hatchet_bronze'].pickupItem = 'hatchet_bronze';
_G.wep.List['hatchet_bronze'].parts[0].img = 'assets/img/hatchet_bronze.png';
_G.wep.List['hatchet_bronze'].TreeDamage = 35;

_G.wep.List['hatchet_iron'] = clone(_G.wep.List['hatchet']);
_G.wep.List['hatchet_iron'].pickupItem = 'hatchet_iron';
_G.wep.List['hatchet_iron'].parts[0].img = 'assets/img/hatchet_iron.png';
_G.wep.List['hatchet_iron'].TreeDamage = 40;

_G.wep.List['hatchet_steel'] = clone(_G.wep.List['hatchet']);
_G.wep.List['hatchet_steel'].pickupItem = 'hatchet_steel';
_G.wep.List['hatchet_steel'].parts[0].img = 'assets/img/hatchet_steel.png';
_G.wep.List['hatchet_steel'].TreeDamage = 45;

_G.wep.List['pickaxe_bronze'] = clone(_G.wep.List['pickaxe']);
_G.wep.List['pickaxe_bronze'].pickupItem = 'pickaxe_bronze';
_G.wep.List['pickaxe_bronze'].parts[0].img = 'assets/img/pickaxe_bronze.png';
_G.wep.List['pickaxe_bronze'].RockDamage = 35;

_G.wep.List['pickaxe_iron'] = clone(_G.wep.List['pickaxe']);
_G.wep.List['pickaxe_iron'].pickupItem = 'pickaxe_iron';
_G.wep.List['pickaxe_iron'].parts[0].img = 'assets/img/pickaxe_iron.png';
_G.wep.List['pickaxe_iron'].RockDamage = 40;

_G.wep.List['pickaxe_steel'] = clone(_G.wep.List['pickaxe']);
_G.wep.List['pickaxe_steel'].pickupItem = 'pickaxe_steel';
_G.wep.List['pickaxe_steel'].parts[0].img = 'assets/img/pickaxe_steel.png';
_G.wep.List['pickaxe_steel'].RockDamage = 45;

_G.ScratchKeys = Object.keys(_G.ScratchTypes);
		
for (var i=0; i < _G.ScratchKeys.length; i++) {
	for (var x=0; x < _G.ScratchTypes[_G.ScratchKeys[i]].items.length; x++) {
		let scratchItem = _G.ScratchTypes[_G.ScratchKeys[i]].items[x];
		_G.wep.List[scratchItem] = {
			parts: [{
				name: scratchItem,
				type: 'drawImg',
				img: _G.items[scratchItem].img,
				x: 0,
				y: 0,
				w: 32,
				h: 32
			}],
			bbox: [3, 3, 26, 26],
			parentOffsetX: -6,
			Primary: {
				Damage: 0,
				Delay: 1
			},
			pickupItem: scratchItem,
			PrimaryAttack:  _G.wep.BasicInvPickup
		};
	}
}

for (var i=0; i < _G.seeds.length; i++) {
	_G.wep.List[_G.seeds[i].item] = {
		parts: [{
			name: _G.seeds[i].item,
			type: 'drawImg',
			img: _G.seeds[i].img_seed,
			x: 0,
			y: 0,
			w: 32,
			h: 32
		}],
		bbox: [3, 3, 26, 26],
		parentOffsetX: -6,
		Primary: {
			Damage: 0,
			Delay: 1
		},
		pickupItem: _G.seeds[i].item,
		PrimaryAttack:  _G.wep.BasicInvPickup
	};
}


_G.wep.EquipSounds = {
    'meth': [
        _G.Sound('assets/sound/meth_wow1.wav'),
        _G.Sound('assets/sound/meth_wow2.wav'),
        _G.Sound('assets/sound/meth_wow3.wav')
    ]
}

_G.wep.DropSounds = {
    'meth': [
        _G.Sound('assets/sound/meth_wow1.wav'),
        _G.Sound('assets/sound/meth_wow2.wav'),
        _G.Sound('assets/sound/meth_wow3.wav')
    ]
};


_G.placableKeys = Object.keys(_G.placable);

for (var i = 0; i < _G.placableKeys.length; i++) {
    let placable = _G.placable[_G.placableKeys[i]],
        placableKey = _G.placableKeys[i];

    _G.items[placableKey] = {
        name: placable.name,
        img: _G.Material(typeof placable.img_item !== 'undefined' ? placable.img_item : placable.img),
        dropItem: placableKey + '_pickup',
        UseName: placable.UseName
    };


    if (typeof _G.Instance === 'undefined' || (typeof placable.AllowedInstances === 'object' && placable.AllowedInstances.indexOf(_G.Instance) !== -1)) {

        _G.items[placableKey].Use = function(ply) {
            if (placable.MaxPlace) {
                let foundAm = 0;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === placableKey && _G.ents.All[i].Owner === ply.Owner) {
                        foundAm += 1;
                    }
                }

                if (foundAm >= placable.MaxPlace) {
                    ply.invOpen = undefined;
                    ply.invSlot = undefined;
                    ply.conSlot = undefined;
                    ply.conScroll = 0;
                    ply.ShowNotify('You have the max of these', 2400);
                    ply.AddItem(placableKey, 1);
                    return true;
                }
            }

            let wallPlace = _G.ents.Create(placableKey);
            wallPlace.pos[0] = ply.pos[0];
            wallPlace.pos[1] = ply.pos[1];
            wallPlace.Placing = ply;
            ply.PlacingObj = wallPlace;

            ply.invOpen = undefined;
            ply.invSlot = undefined;
            ply.conSlot = undefined;
            ply.conScroll = 0;
            if (ply.container) {
                ply.container.IsOpen = undefined;
                ply.container = undefined;
            }

            ply.ShowNotify('[SPACE] to place or [C] to cancel', 4000)
        };
    }

    _G.wep.List[placableKey + '_pickup'] = {
        parts: [{
            name: 'item',
            type: 'drawImg',
            img: typeof placable.img_item !== 'undefined' ? placable.img_item : placable.img,
            x: 0,
            y: 0,
            w: 32,
            h: 32
        }],
        bbox: [0, 0, 32, 32],
        parentOffsetX: -6,
        Primary: {
            Damage: 0,
            Delay: 1
        },
        PrimaryAttack: _G.wep.BasicInvPickup
    };
}

_G.craftKeys = Object.keys(_G.crafting);

// ── ARMOR / EQUIPMENT SYSTEM ─────────────────────────────────────────────────
// Visual part definitions for each armor/hat (added to player.parts when equipped)
_G.armorParts = {
    // HEAD SLOT
    'armor_wood_helmet': [
        { name: 'armor_head', type: 'fillRect', x: 0, y: -14, w: 40, h: 8, fillStyle: 'rgba(120,75,30,0.85)' },
        { name: 'armor_head2', type: 'fillRect', x: -2, y: -7, w: 44, h: 6, fillStyle: 'rgba(100,60,20,0.90)' }
    ],
    'armor_iron_helmet': [
        { name: 'armor_head', type: 'fillRect', x: 0, y: -14, w: 40, h: 8, fillStyle: 'rgba(140,140,155,0.85)' },
        { name: 'armor_head2', type: 'fillRect', x: -2, y: -7, w: 44, h: 6, fillStyle: 'rgba(110,110,130,0.90)' }
    ],
    'armor_steel_helmet': [
        { name: 'armor_head', type: 'fillRect', x: 0, y: -16, w: 40, h: 10, fillStyle: 'rgba(70,75,90,0.90)' },
        { name: 'armor_head2', type: 'fillRect', x: -3, y: -7, w: 46, h: 7, fillStyle: 'rgba(50,55,70,0.90)' }
    ],
    'hat_cowboy': [
        { name: 'armor_head', type: 'fillRect', x: -10, y: -5, w: 60, h: 5, fillStyle: 'rgba(165,125,65,0.92)' },
        { name: 'armor_head2', type: 'fillRect', x: 3, y: -18, w: 34, h: 14, fillStyle: 'rgba(180,138,70,0.92)' }
    ],
    'hat_tophat': [
        { name: 'armor_head', type: 'fillRect', x: -3, y: -3, w: 46, h: 4, fillStyle: 'rgba(40,40,40,0.92)' },
        { name: 'armor_head2', type: 'fillRect', x: 4, y: -22, w: 32, h: 22, fillStyle: 'rgba(25,25,25,0.95)' },
        { name: 'armor_head3', type: 'fillRect', x: 5, y: -24, w: 30, h: 4, fillStyle: 'rgba(200,200,200,0.70)' }
    ],
    'hat_bucket': [
        { name: 'armor_head', type: 'fillRect', x: -4, y: -2, w: 48, h: 4, fillStyle: 'rgba(90,140,185,0.92)' },
        { name: 'armor_head2', type: 'fillRect', x: 0, y: -16, w: 40, h: 15, fillStyle: 'rgba(75,125,175,0.88)' }
    ],
    // BODY SLOT
    'armor_wood_chest': [
        { name: 'armor_body', type: 'fillRect', x: -1, y: 5, w: 42, h: 45, fillStyle: 'rgba(140,90,38,0.55)' },
        { name: 'armor_body2', type: 'fillRect', x: 19, y: 5, w: 3, h: 45, fillStyle: 'rgba(90,55,18,0.60)' }
    ],
    'armor_iron_chest': [
        { name: 'armor_body', type: 'fillRect', x: -1, y: 5, w: 42, h: 45, fillStyle: 'rgba(150,150,165,0.55)' },
        { name: 'armor_body2', type: 'fillRect', x: 19, y: 5, w: 3, h: 45, fillStyle: 'rgba(100,100,120,0.60)' }
    ],
    'armor_steel_chest': [
        { name: 'armor_body', type: 'fillRect', x: -1, y: 5, w: 42, h: 45, fillStyle: 'rgba(75,80,95,0.60)' },
        { name: 'armor_body2', type: 'fillRect', x: 19, y: 5, w: 3, h: 45, fillStyle: 'rgba(45,50,65,0.65)' }
    ]
};

// Remove existing armor visual parts from player.parts
_G.RemoveArmorParts = function(ply, slot) {
    let namesToRemove = (slot === 'head') ? ['armor_head', 'armor_head2', 'armor_head3'] : ['armor_body', 'armor_body2'];
    for (let i = ply.parts.length - 1; i >= 0; i--) {
        if (namesToRemove.indexOf(ply.parts[i].name) !== -1) {
            ply.parts.splice(i, 1);
        }
    }
};

// Add visual armor parts to player.parts
_G.AddArmorParts = function(ply, armorKey) {
    let defs = _G.armorParts[armorKey];
    if (!defs) return;
    for (let i = 0; i < defs.length; i++) {
        // Clone part def so each player has independent objects
        ply.parts.push({
            name: defs[i].name,
            type: defs[i].type,
            x: defs[i].x,
            y: defs[i].y,
            w: defs[i].w,
            h: defs[i].h,
            fillStyle: defs[i].fillStyle
        });
    }
};

// Equip armor: called from item Use (item already removed from inv)
_G.EquipArmor = function(ply, armorKey) {
    if (!ply.equipment) ply.equipment = {};
    let itemDef = _G.items[armorKey];
    if (!itemDef || !itemDef.ArmorSlot) return;

    let slot = itemDef.ArmorSlot;
    let oldArmor = ply.equipment[slot];

    // Return old armor to inventory if different
    if (oldArmor && oldArmor !== armorKey) {
        ply.AddItem(oldArmor, 1);
    } else if (oldArmor === armorKey) {
        // Unequip: same armor used again — remove it (it was already taken), just clear slot
        ply.equipment[slot] = undefined;
        delete ply.equipment[slot];
        _G.RemoveArmorParts(ply, slot);
        ply.ShowNotify('Unequipped ' + itemDef.name, 1800);
        return;
    }

    // Equip new armor
    ply.equipment[slot] = armorKey;
    _G.RemoveArmorParts(ply, slot);
    _G.AddArmorParts(ply, armorKey);

    let totalReduction = 0;
    if (ply.equipment.head && _G.items[ply.equipment.head]) totalReduction += (_G.items[ply.equipment.head].ArmorVal || 0);
    if (ply.equipment.body && _G.items[ply.equipment.body]) totalReduction += (_G.items[ply.equipment.body].ArmorVal || 0);
    ply.ShowNotify('Equipped ' + itemDef.name + ' | Total armor: ' + Math.round(totalReduction * 100) + '%', 2500);
};


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return {
        r: r,
        g: g,
        b: b
    };
}

function convertImg(obj) {
    var copy;


    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    if (typeof obj === 'object' && typeof obj.src !== 'undefined' && obj.src) {
        return 'assets/img/' + obj.src.split('assets/img/')[1];
    }

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = convertImg(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = convertImg(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function convertImgBack(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = convertImg(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (attr === 'img' || (typeof obj[attr] === 'string' && obj[attr].indexOf('.png') !== -1)) {
                copy[attr] = _G.Material(obj[attr]);
            }
            if (obj.hasOwnProperty(attr)) copy[attr] = convertImg(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

_G.wep.Create = function(className) {
    //let wepData = structuredClone(_G.wep.List[className]);
    let wepData = clone(_G.wep.List[className])

    if (typeof wepData.parts === 'object') {
        for (var i = 0; i < wepData.parts.length; i++) {
            if (typeof wepData.parts[i].img === 'string') {
                wepData.parts[i].img = _G.Material(wepData.parts[i].img);
            }
        }
    }

    let entIndex = _G.ents.All.push({
        class: className,
        pos: [65, 75],
        bbox: wepData.bbox,
        interpDir: 1,
        parts: wepData.parts,
        rotate: angleToRadians(randInt(-40, 40))
    });

    if (typeof wepData.PrimaryAttack !== 'undefined') {
        _G.ents.All[entIndex - 1].PrimaryAttack = wepData.PrimaryAttack;
    } else {
        _G.ents.All[entIndex - 1].PrimaryAttack = _G.wep.BasicPrimaryAttack;
    }

    _G.ents.All[entIndex - 1].Use = _G.wep.BasicPickup;

    if (typeof wepData.pickupItem === 'string') {
        //self.pickupItem = wepData.pickupItem;

        _G.ents.All[entIndex - 1].UseFirst = function(self, caller) {
            if (typeof self.Owner === 'undefined' && typeof self.Holstered === 'undefined' && !self.ShouldRemove && typeof caller === 'object' && caller.class === 'player' && typeof _G.playerData[caller.Owner].input === 'object' && _G.playerData[caller.Owner].input['SHIFT'] && typeof self.Holstered === 'undefined' && !self.BlowUp) {
                caller.AddItem(self.pickupItem, (typeof self.itemAm === 'number' ? self.itemAm : 1));
                caller.ShowNotify('+' + (typeof self.itemAm === 'number' ? self.itemAm : 1) + ' ' + _G.items[self.pickupItem].name, 2300);
                caller.LastQuickPickup = _G.lastTick;

                self.ShouldRemove = true;

                return;
            }

            return false;
        }
    }

    if (typeof _G.wep.EquipSounds[className] !== 'undefined') {
        _G.ents.All[entIndex - 1].EquipSounds = _G.wep.EquipSounds[className];
    }
    if (typeof _G.wep.DropSounds[className] !== 'undefined') {
        _G.ents.All[entIndex - 1].DropSounds = _G.wep.DropSounds[className];
    }

    let wepKeys = Object.keys(wepData);
    if (typeof wepKeys === 'object') {
        for (var i = 0; i < wepKeys.length; i++) {
            if (typeof _G.ents.All[entIndex - 1][wepKeys[i]] === 'undefined') {
                _G.ents.All[entIndex - 1][wepKeys[i]] = wepData[wepKeys[i]];
            }
        }
    }

    return entIndex;
};


_G.placableCreate = function(className) {

    let entObj = {
        class: className,
        pos: [0, 0],
        bbox: _G.placable[className].bbox,
        interpDir: 1,
        rotate: 0,
        Solid: _G.placable[className].Solid,
        Placable: true,
        noShadow: true,
        direction: 1,
        Placing: false,
        OnDamage: function(inflictor, dmg) {

            if (this.NoCupboardHP) {
                //console.log(this.NoCupboardHP)
                let nearCup = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'tool_cupboard' && this.Owner === _G.ents.All[i].Owner && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5 + _G.ents.All[i].BuildOrigin[0], _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5 + _G.ents.All[i].BuildOrigin[1], this.pos[0] + this.bbox[0] + this.bbox[2] * .5, this.pos[1] + this.bbox[1] + this.bbox[3] * .5) < (_G.ents.All[i].BuildRadius / 2) + 10) {
                        nearCup = _G.ents.All[i];
                        break;
                    }
                }
                //console.log(nearCup)

                if (!nearCup && !this.Health) {
                    this.Health = this.NoCupboardHP;
                    this.HealthMax = this.NoCupboardHP;
                } else if (nearCup && this.Health) {
                    this.Health = undefined;
                    this.HealthMax = undefined;
                    delete this.Health;
                    delete this.HealthMax;

                    return;
                }

                if (!nearCup && inflictor.class !== 'grenade_beancan') {
                    return;
                }
            }

            if (!this.HealthSize) {
                this.HealthSize = 50;
                this.HealthX = (this.bbox[0] + this.bbox[2] * .5 - 25)
            }

            if (inflictor && inflictor.class === 'rock') {
                return;
            }

            if (typeof this.Health !== 'undefined' && typeof this.HealthMax !== 'undefined' && this.HealthMax > 0) {
                this.Health -= dmg;
                this.LastDamage = _G.lastTick;

                let cut = _G.sounds.impacts.wood[randInt(0, _G.sounds.impacts.wood.length - 1)].cloneNode(true, this.pos);
                cut.volume = 0.15;
                cut.play();

                if (this.Health <= 0) {
                    this.ShouldRemove = true;
                }

                if (this.DamageHurts && inflictor.class !== 'bullet') {
                    //console.log(inflictor.Owner)
                    //console.log(typeof inflictor.Owner === 'object')
                    if (typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        //console.log(this.DamageHurts)
                        inflictor.Owner.OnDamage(this, this.DamageHurts)
                    }
                }
            }
        },
        ThinkFirst: function(tFrame) {
			if (this.debug) {
				console.log('a');
			}
            if (this.ShouldRemove) {
                return true;
            }

            if (typeof this.Placing === 'object' && typeof this.Placing.class === 'string' && this.Placing.class === 'player') {
                let plyInfo = _G.playerData[this.Placing.Owner];

                if (plyInfo.input['V']) {
                    let inPly = false;

                    this.colliding = _G.ents.Colliding(this);

                    if ((typeof _G.placable[this.class].PlaceNearBoundary === 'undefined' || _G.placable[this.class].PlaceNearBoundary !== true) && this.pos[0] < _G.BoundaryMinX + 250 || this.pos[0] > _G.BoundaryX - 250 || this.pos[0] + this.bbox[0] + this.bbox[2] > _G.BoundaryX - 250 || this.pos[1] > _G.BoundaryY - 250 || this.pos[1] + this.bbox[1] + this.bbox[3] > _G.BoundaryY - 250) {
                        inPly = true;
                        this.Placing.ShowNotify('Can\'t place on edges of map', 3000);
                    }

                    if (this.Solid) {
                        for (var i = 0; i < this.colliding.length; i++) {
                            if (this.colliding[i].class === 'player') {
                                this.Placing.ShowNotify('Can\'t place inside player', 2400);
                                inPly = true;
                                break;
                            }
                        }
                    }

                    if (!inPly) {
                        for (var i = 0; i < _G.ents.All.length; i++) {
                            if (_G.ents.All[i].class === 'dick_head' && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], this.pos[0], this.pos[1]) < 690) {
                                this.Placing.ShowNotify('Too close to Dick Head', 2400);
                                inPly = true;
                                break;
                            }
                        }
                    }



                    if (!inPly) {
                        for (var i = 0; i < _G.ents.All.length; i++) {
                            if (_G.ents.All[i].class === 'tool_cupboard' && !_G.ents.All[i].Placing && _G.ents.All[i].Owner !== this.Placing.Owner && _G.distance(_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5 + _G.ents.All[i].BuildOrigin[0], _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5 + _G.ents.All[i].BuildOrigin[1], this.pos[0], this.pos[1]) < (_G.ents.All[i].BuildRadius / 2) + 10) {
                                this.Placing.ShowNotify('Too close to Tool Cupboard', 2400);
                                inPly = true;
                                break;
                            }
                        }
                    }

                    if (!inPly && (this.pos[0] < 800 && this.pos[1] < 800)) {
                        this.Placing.ShowNotify('Too close to spawn', 2400);
                        inPly = true;
                    }

                    if (!this.PlaceInObjs) {
                        let bboxToPoly = getRectPolygon([this.pos[0] + 10, this.pos[1] + 10], [this.bbox[0], this.bbox[1], this.bbox[2] - 20, this.bbox[3] - 20], this.rotate)
                        let findPlacable = checkCollisions(bboxToPoly, [this.pos[0] + 10, this.pos[1] + 10], [this.bbox[0], this.bbox[1], this.bbox[2] - 20, this.bbox[3] - 20], 0, undefined, this.Owner);

                        if (findPlacable.indexOf(this) !== -1) {
                            findPlacable.splice(findPlacable.indexOf(this), 1)
                        }
                        if (findPlacable.indexOf(this.Placing) !== -1) {
                            findPlacable.splice(findPlacable.indexOf(this.Placing), 1)
                        }

                        if (findPlacable.length > 0) {
                            this.Placing.ShowNotify('Can\'t place inside other objects', 2400);
                            inPly = true;
                            //console.log(findPlacable)
                        }
                    }


                    if (inPly && this.Placing.Owner === 'goosely') {
                        inPly = false;
                    }


                    if (!inPly) {
                        this.Owner = this.Placing.Owner;
                        if (typeof this.Placing.PlacingObj === 'object') {
                            this.Placing.PlacingObj = undefined;
                        }
                        this.Placing = false;
                    }

                } else if (plyInfo.input['C']) {
                    if (typeof this.Placing.PlacingObj === 'object') {
                        this.Placing.PlacingObj = undefined;
                    }
                    this.Placing.AddItem(this.class, 1);
                    this.ShouldRemove = true;
                }

                if (this.Placing) {
                    if (plyInfo.lastDirPress === 'R') {
                        if (this.NoRotate) {
                            this.pos[0] = this.Placing.pos[0] + this.bbox[0] + this.bbox[2] + 41;
                            this.pos[1] = this.Placing.pos[1];
                        } else {
                            this.pos[0] = this.Placing.pos[0] + this.bbox[1] + 10;
                            this.pos[1] = this.Placing.pos[1] + this.bbox[3] / 2;
                        }

                        this.rotate = this.NoRotate ? 0 : angleToRadians(90);
                    } else if (plyInfo.lastDirPress === 'L') {
                        if (this.NoRotate) {
                            this.pos[0] = this.Placing.pos[0] - this.bbox[0] - this.bbox[2] - this.Placing.bbox[0] - this.Placing.bbox[2] - 5;
                            this.pos[1] = this.Placing.pos[1];
                        } else {
                            this.pos[0] = this.Placing.pos[0] - this.bbox[1] - this.bbox[3] - this.Placing.bbox[0] - this.Placing.bbox[2] * 4 - 5;
                            this.pos[1] = this.Placing.pos[1] + this.bbox[3] / 2;
                        }
                        this.rotate = this.NoRotate ? 0 : angleToRadians(90);
                    } else if (plyInfo.lastDirPress === 'U') {
                        if (this.NoRotate) {
                            this.pos[0] = this.Placing.pos[0] - this.bbox[0] - this.bbox[2] * .5 + 20;
                            this.pos[1] = this.Placing.pos[1] - this.bbox[1] - this.bbox[3] - 10;
                        } else {
                            this.pos[0] = this.Placing.pos[0] - this.bbox[0] - this.bbox[2] * .5 + 20;
                            this.pos[1] = this.Placing.pos[1] - this.bbox[1] - this.bbox[3] - 10;
                        }
                        this.rotate = 0;
                    } else if (plyInfo.lastDirPress === 'D') {
                        if (this.NoRotate) {
                            this.pos[0] = this.Placing.pos[0] - this.bbox[0] - this.bbox[2] * .5 + 20;
                            this.pos[1] = this.Placing.pos[1] + this.bbox[1] + this.Placing.bbox[1] + this.Placing.bbox[3] + 10;
                        } else {
                            this.pos[0] = this.Placing.pos[0] - this.bbox[0] - this.bbox[2] * .5 + 20;
                            this.pos[1] = this.Placing.pos[1] + this.bbox[1] + this.Placing.bbox[1] + this.Placing.bbox[3] + 10;
                        }
                        this.rotate = 0;
                    }

                    this.pos[0] = Math.floor(this.pos[0] / 10) * 10;
                    this.pos[1] = Math.floor(this.pos[1] / 10) * 10;

                    // ── WALL SNAP SYSTEM ─────────────────────────────────────
                    // All wall/door types snap to adjacent placed walls
                    let _snapClasses = ['wall1', 'wall1-half', 'wall-wood', 'wall-wood-half', 'door-wood', 'forcefield'];
                    let isWall = _snapClasses.indexOf(this.class) !== -1;
                    if (isWall) {
                        let snapDist = 80;  // increased from 60 for easier snapping
                        let bestDist = snapDist + 1;
                        let snapX = false, snapY = false;
                        let myW = this.bbox[2], myH = this.bbox[3];
                        let myMidX = this.pos[0] + myW * 0.5;
                        let myMidY = this.pos[1] + myH * 0.5;
                        for (let si = 0; si < _G.ents.All.length; si++) {
                            let sv = _G.ents.All[si];
                            if (sv.ShouldRemove || sv === this || !sv.Placable) continue;
                            if (_snapClasses.indexOf(sv.class) === -1) continue;
                            let svW = sv.bbox[2], svH = sv.bbox[3];
                            // Right-side snap
                            let snapToRight = sv.pos[0] + svW;
                            let snapYAlign = sv.pos[1];
                            let dRight = Math.abs(myMidX - (snapToRight + myW * 0.5)) + Math.abs(myMidY - (snapYAlign + myH * 0.5));
                            if (dRight < bestDist) { bestDist = dRight; snapX = snapToRight; snapY = snapYAlign; }
                            // Left-side snap
                            let snapToLeft = sv.pos[0] - myW;
                            let dLeft = Math.abs(myMidX - (snapToLeft + myW * 0.5)) + Math.abs(myMidY - (snapYAlign + myH * 0.5));
                            if (dLeft < bestDist) { bestDist = dLeft; snapX = snapToLeft; snapY = snapYAlign; }
                            // Below snap
                            let snapToBelow = sv.pos[1] + svH;
                            let snapXAlign = sv.pos[0] - (myW - svW) * 0.5;
                            let dBelow = Math.abs(myMidX - (snapXAlign + myW * 0.5)) + Math.abs(myMidY - (snapToBelow + myH * 0.5));
                            if (dBelow < bestDist) { bestDist = dBelow; snapX = snapXAlign; snapY = snapToBelow; }
                            // Above snap
                            let snapToAbove = sv.pos[1] - myH;
                            let dAbove = Math.abs(myMidX - (snapXAlign + myW * 0.5)) + Math.abs(myMidY - (snapToAbove + myH * 0.5));
                            if (dAbove < bestDist) { bestDist = dAbove; snapX = snapXAlign; snapY = snapToAbove; }
                        }
                        if (snapX !== false) {
                            this.pos[0] = Math.round(snapX);
                            this.pos[1] = Math.round(snapY);
                        }
                    }
                }

            } else if (this.Placing !== false) {
                this.ShouldRemove = true;
            }

            if (typeof _G.placable[this.class].ThinkFirst === 'function') {
                _G.placable[this.class].ThinkFirst.call(this, tFrame);
            }
            if (typeof _G.placable[this.class].Think === 'function') {
                _G.placable[this.class].Think(this, tFrame);
            }
        }
    };

    if (typeof _G.placable[className].renderBehindPlayer === 'undefined' || _G.placable[className].renderBehindPlayer) {
        entObj.renderBehindPlayer = true;
    }

    if (typeof _G.placable[className].imgDisable === 'undefined') {
        entObj.parts = [{
            name: 'placable',
            type: 'drawImg',
            img: _G.Material(_G.placable[className].img),
            x: 0,
            y: 0,
            w: _G.placable[className].w,
            h: _G.placable[className].h
        }];
    } else {
        entObj.parts = [];
    }


    if (_G.placable[className].Draw !== 'undefined') {
        entObj.Draw = _G.placable[className].Draw;
    }
    if (_G.placable[className].SignText !== 'undefined') {
        entObj.SignText = _G.placable[className].SignText;
    }
    if (_G.placable[className].Health !== 'undefined') {
        entObj.Health = _G.placable[className].Health;
    }
    if (_G.placable[className].HealthMax !== 'undefined') {
        entObj.HealthMax = _G.placable[className].HealthMax;
    }
    if (_G.placable[className].HealthSize !== 'undefined') {
        entObj.HealthSize = _G.placable[className].HealthSize;
    }
    if (_G.placable[className].HealthX !== 'undefined') {
        entObj.HealthX = _G.placable[className].HealthX;
    }
    if (_G.placable[className].HealthX !== 'undefined') {
        entObj.HealthY = _G.placable[className].HealthY;
    }
    if (_G.placable[className].HealthAlpha !== 'undefined') {
        entObj.HealthAlpha = _G.placable[className].HealthAlpha;
    }
    if (_G.placable[className].HealthText !== 'undefined') {
        entObj.HealthText = _G.placable[className].HealthText;
    }
    if (_G.placable[className].DamageHurts !== 'undefined') {
        entObj.DamageHurts = _G.placable[className].DamageHurts;
    }
    if (_G.placable[className].Use !== 'undefined') {
        entObj.LastUse = _G.lastTick;
        entObj.Use = _G.placable[className].Use;
    }
    if (typeof _G.placable[className].OwnerPass !== 'undefined') {
        entObj.OwnerPass = _G.placable[className].OwnerPass;
    }
    if (typeof _G.placable[className].IsGrowing !== 'undefined') {
        entObj.IsGrowing = _G.placable[className].IsGrowing;
    }
    if (typeof _G.placable[className].Grown !== 'undefined') {
        entObj.Grown = _G.placable[className].Grown;
    }
    if (typeof _G.placable[className].Toggled !== 'undefined') {
        entObj.Toggled = _G.placable[className].Toggled;
    }
    if (typeof _G.placable[className].Togglable !== 'undefined') {
        entObj.Togglable = _G.placable[className].Togglable;
    }
    if (typeof _G.placable[className].PlaceInObjs !== 'undefined') {
        entObj.PlaceInObjs = _G.placable[className].PlaceInObjs;
    }
    if (typeof _G.placable[className].NoRotate !== 'undefined') {
        entObj.NoRotate = _G.placable[className].NoRotate;
    }
    if (typeof _G.placable[className].renderAfterAll !== 'undefined') {
        entObj.renderAfterAll = _G.placable[className].renderAfterAll;
    }
    if (typeof _G.placable[className].Container !== 'undefined') {
        entObj.Container = [];
    }
    if (typeof _G.placable[className].StoreItems !== 'undefined') {
        entObj.StoreItems = _G.placable[className].StoreItems;
    }
    if (typeof _G.placable[className].BuildRadius !== 'undefined') {
        entObj.BuildRadius = _G.placable[className].BuildRadius;
    }
    if (typeof _G.placable[className].BuildOrigin === 'object') {
        entObj.BuildOrigin = [_G.placable[className].BuildOrigin[0], _G.placable[className].BuildOrigin[1]];
    }
    if (typeof _G.placable[className].NoCupboardHP !== 'undefined') {
        entObj.NoCupboardHP = _G.placable[className].NoCupboardHP;
    }
    if (typeof _G.placable[className].DecayHP !== 'undefined') {
        entObj.DecayHP = _G.placable[className].DecayHP;
    }
    /*
            if (typeof _G.placable[className].Think === 'function') {
                entObj.Think = _G.placable[className].Think;
            }
            if (typeof _G.placable[className].ThinkFirst === 'function') {
                entObj.ThinkFirst = _G.placable[className].ThinkFirst;
            }
            */
    if (typeof _G.placable[className].CollideWithOtherPlacables !== 'undefined') {
        entObj.CollideWithOtherPlacables = _G.placable[className].CollideWithOtherPlacables;
    }
    if (typeof _G.placable[className].PlaceNearBoundary !== 'undefined') {
        entObj.PlaceNearBoundary = _G.placable[className].PlaceNearBoundary;
    }

    /*IF_CLIENT*/
    if (typeof _G.placable[className].ThinkClient === 'function') {
        entObj.ThinkClient = _G.placable[className].ThinkClient;
        entObj.Think = _G.placable[className].ThinkClient;
    }

    if (_G.placable[className].ThinkClient === true && typeof _G.placable[className].Think === 'function') {
        entObj.ThinkClient = true;
        entObj.Think = _G.placable[className].Think;
        console.log(className);
    }

    if (_G.placable[className].ThinkClient === true && typeof _G.placable[className].ThinkFirst === 'function') {
        entObj.ThinkClient = true;
        entObj.ThinkFirst = _G.placable[className].ThinkFirst;
    }
    /*IF_END*/

    return _G.ents.All.push(entObj);
};

_G.ents.Total = 0;

_G.ents.Create = function(className) {
    let entReturn = false,
        entIndex = 0;

    if (className === 'map') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [0, 0],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'map',
                type: 'drawImg',
                img: _G.Material(_G.Instance ? 'assets/img/map' + _G.Instance + '.png?map' : 'assets/img/map-main.png'),
                x: 0,
                y: 0,
                w: _G.MapW ? _G.MapW : 4500,
                h: _G.MapH ? _G.MapH : 4500
            }],
            renderBehindPlayer: true,
            noShadow: true,
            AlwaysRender: true
        });
    } else if (className.substring(0, 6) === 'player') {
        let userName = className.substring(7).toLowerCase().trim();
        let raceRandom = randInt(1, 3);
        let raceColor = (typeof _G.playerSaves[userName] === 'object' && typeof _G.playerSaves[userName].RaceColor === 'string')
            ? _G.playerSaves[userName].RaceColor
            : (raceRandom === 1 ? '#000000' : (raceRandom === 2 ? '#423308' : '#c3836e'));
        /*
        let isMale = (randInt(0,2) !== 0);
        let dickSize = randInt((isMale ? 7 : 14),26);
                if (userName === 'turdferguson') { dickSize = 36; }
                */

        let entParts = [{
                name: 'body',
                type: 'fillRect',
                x: 0,
                y: 0,
                w: 40,
                h: 80,
                fillStyle: raceColor
            },
            {
                name: 'footLeft',
                type: 'fillRect',
                x: -7,
                y: 74,
                w: 16,
                h: 16,
                fillStyle: raceColor
            },
            {
                name: 'footRight',
                type: 'fillRect',
                x: 30,
                y: 74,
                w: 16,
                h: 16,
                fillStyle: raceColor
            },

            {
                name: 'hand',
                type: 'drawImg',
                img: (raceRandom === 1 ? _G.Material('assets/img/hand-black.png') : (raceRandom === 2 ? _G.Material('assets/img/hand-black2.png') : _G.Material('assets/img/hand.png'))),
                x: 48,
                y: 47,
                w: 28,
                h: 24,
                rotate: angleToRadians(20)
            }
        ];

        /*
        if (!isMale) {
            let titSize = randInt(10, 26);
                    if (userName === 'turdferguson') {
                        titSize = 28;
                    }

            let titLeftX = -titSize*.3 + titSize*(5/24);
            if (titLeftX+titSize > 19) {
                titLeftX = 20-titSize-1
            }
            entParts.push({
                name: 'titLeft',
                type: 'drawImg',
                img: _G.Material('assets/img/tit1.png'),
                x: titLeftX,
                y: 30,
                w: titSize,
                h: titSize*(26/24)
            });

            let titRightX = (40 -titSize*.7 - titSize*(5/24));
            if (titRightX < 21) {
                titRightX = 21;
            }
            entParts.push({
                name: 'titRight',
                type: 'drawImg',
                img: _G.Material('assets/img/tit1-right.png'),
                x: titRightX,
                y: 30,
                w: titSize,
                h: titSize*(26/24)
            });
        }
                */

        entParts.push({
                name: 'face',
                type: 'drawImg',
                img: userName === 'turdferguson' ? _G.Material('assets/img/face-turd.png') : _G.Material('assets/img/face1.png'),
                x: 0,
                y: 0,
                w: 38,
                h: 42
            }
            /*
                            {
                                name: 'genitals',
                                type: 'drawImg',
                                img: (isMale ? (raceColor !== '#c3836e' ? _G.Material('assets/img/dick2.png') : _G.Material('assets/img/dick1.png')) : _G.Material('assets/img/vag1.png')),
                                x: (isMale ? 27 : 20),
                                y: 70,
                                w: dickSize,
                                h: (dickSize > (isMale ? 21 : 17) ? (isMale ? 25 : 21) : dickSize*1.166666),
                                rotate: angleToRadians(0),
                                interpOffset: (isMale ? [20, 3] : false)
                            }*/
        );

        let footLeft = _G.ents.getPartByName(entParts, 'footLeft'),
            footRight = _G.ents.getPartByName(entParts, 'footRight');

        if (userName === 'patrick' || userName === 'goosely' || userName === 'turdferguson') {
            footLeft.type = 'drawImg';
            footLeft.img = _G.Material('assets/img/shoe-right.png');
            footLeft.x = 12;
            footLeft.y = 87;
            footLeft.w = 30;
            footLeft.h = 18;
            footLeft.rotate = 0;
            footLeft.interpOffset = [12, 0];

            footRight.type = 'drawImg';
            footRight.img = _G.Material('assets/img/shoe-right.png');
            footRight.x = 42;
            footRight.y = 87;
            footRight.w = 30;
            footRight.h = 18;
            footRight.rotate = 0;
            footRight.interpOffset = [12, 0];
            /*entParts.push(
                {
                    name: 'shoeLeft',
                    type: 'drawImg',
                    img: shoeRight,
                    x: 8,
                    y: 84,
                    w: 30,
                    h: 18,
                    rotate: 0
                },
                {
                    name: 'shoeRight',
                    type: 'drawImg',
                    img: shoeRight,
                    x: 45,
                    y: 84,
                    w: 30,
                    h: 18,
                    rotate: 0
                }
            )*/
        }

        footLeft.startY = footLeft.y;
        footRight.startY = footRight.y;

        entIndex = _G.ents.All.push({
            class: 'player',
            pos: [randInt(25, 300), randInt(60, 300)],
            bbox: [0, 0, 40, 94],
            inv: [],
            equipment: {},
            skills: {},
            interpDir: 1,
            parts: entParts,
            inputLast: _G.lastTick,
            username: userName,
            nametag: userName === 'anon54770277' ? 'trollanon' : ((userName.indexOf('gravegate') !== -1 || (userName.indexOf('goosely') !== -1 && userName !== 'goosely')) ? '↓ really cool and nice ↓' : (userName.substring(0, 4) === 'ip-|' ? 'MingeBag' : userName)),
            Health: 100,
            HealthMax: 100,
            RaceColor: raceColor,
            RaceRGB: hexToRgb(raceColor),
            LastWallPos: {},
            Ammo: {
                pistol: 0,
                smg: 0
            },
            Holster: function(force) {
                if (typeof force === 'undefined' && typeof this.LastHolster !== 'undefined' && _G.lastTick - this.LastHolster < 900) {
                    return true;
                }
                this.LastHolster = _G.lastTick;

                if (typeof this.ActiveWeapon === 'object' && typeof this.ActiveWeapon.class === 'string' && typeof _G.wep.List[this.ActiveWeapon.class] !== 'undefined') {
                    let oldWep = this.Holstered;

                    let wep = this.ActiveWeapon,
                        wepInfo = _G.wep.List[wep.class];

                    /*

                            wep.Weapon = undefined;
                            wep.noShadow = true;
                            wep.Owner = undefined;
                            wep.parent = undefined;
                            wep.parentPart = undefined;
                            wep.parentX = undefined;
                            wep.parentY = undefined;
                            
                            wep.rotate = wep.parts[0].rotate;
                            wep.parts[0].rotate = undefined;
                            wep.parts[0].interpOffset = undefined;
                            wep.parts[0].interpDir = undefined;
                            */
                    this.DropWeapon();


                    /*
                    if (typeof wep.DropInterval !== 'undefined') {
                        clearInterval(wep.DropInterval);
                        wep.DropInterval = undefined;
                    }
                    */

                    wep.parent = this;
                    wep.parentX = 19 + (typeof wepInfo.holsterX === 'number' ? wepInfo.holsterX : 0);
                    wep.parentY = 32 + (typeof wepInfo.holsterY === 'number' ? wepInfo.holsterY : 0);
                    wep.rotate = angleToRadians(typeof wepInfo.holsterRotate === 'number' ? wepInfo.holsterRotate : 80);
                    //self.parentPart = 'body';

                    wep.Holstered = this.Owner;

                    // Clear any lingering weapon animation / bob so holstered weapon stays still
                    wep.ThinkClient = undefined;
                    wep.Think = undefined;
                    wep.rotateOG = undefined;
                    wep.parentOffsetX = undefined;
                    wep.parentOffsetY = undefined;
                    wep.parts[0].rotate = 0;
                    wep.parts[0].interpDir = undefined;
                    wep.parts[0].interpOffset = undefined;

                    wep.noShadow = true;

                    this.Holstered = wep;

                    if (typeof oldWep === 'object' && typeof oldWep.class === 'string') {
                        oldWep.Holstered = undefined;
                        _G.wep.BasicPickup(oldWep, this, true);
                    }
                } else if (typeof this.Holstered === 'object' && typeof this.Holstered.class === 'string') {
                    let oldWep = this.Holstered;
                    oldWep.parent = undefined;
                    oldWep.parentX = undefined
                    oldWep.parentY = undefined
                    oldWep.rotate = 0;

                    oldWep.Holstered = undefined;
                    oldWep.Owner = undefined;
                    this.Holstered = undefined;

                    //oldWep.Use(oldWep, this, true)
                    _G.wep.BasicPickup(oldWep, this, true);
                }
            },
            AddXP: function(skill, am) {
                if (typeof this.skills[skill] === 'undefined') {
                    this.skills[skill] = {
                        lvl: 1,
                        xp: am
                    }
                } else {
                    if (!this.skills[skill].xp) {
                        this.skills[skill].xp = am;
                    } else {
                        this.skills[skill].xp += am;
                    }
                    if (_G.LevelToXP(this.skills[skill].lvl + 1) < this.skills[skill].xp) {
                        this.skills[skill].lvl += 1;
                        sendChat('Congratulations @' + this.Owner + ' you are now level ' + this.skills[skill].lvl + ' ' + skill);

                        if (skill === 'Firemaking') {
                            let wepKeys = Object.keys(_G.wep.List)
                            for (var i = 0; i < wepKeys.length; i++) {
                                if (_G.wep.List[wepKeys[i]].BurnLevel && _G.wep.List[wepKeys[i]].BurnLevel === this.skills[skill].lvl) {
                                    sendChat('@' + this.Owner + ' You can now use your Firemaking skills to burn "' + _G.items[wepKeys[i]].name + '"');
                                }
                            }
                        } else if (skill === 'Smithing') {
                            for (var i = 0; i < _G.craftKeys.length; i++) {
                                if (_G.crafting[_G.craftKeys[i]].recipeLevels) {
                                    for (z = 0; z < _G.crafting[_G.craftKeys[i]].recipeLevels.length; z++) {
                                        if (_G.crafting[_G.craftKeys[i]].recipeLevels[z].skill === skill && _G.crafting[_G.craftKeys[i]].recipeLevels[z].lvl === this.skills[skill].lvl) {
                                            sendChat('You can now use your ' + skill + ' skills to craft "' + _G.craftKeys[i] + '"');
                                        }
                                    }
                                }
                            }
                        }
                    }

                }

                this.lvl = Math.floor(_G.CombatLevelCalculator.combatLevel(this).level);
            },
            AddItem: function(item, am) {
                am = (typeof am !== 'number' ? 1 : am);

                if (typeof _G.items[item] === 'undefined') {
                    return;
                }

                let foundKey = false;
                for (var i = 0; i < this.inv.length; i++) {
                    if (item === this.inv[i].item) {
                        foundKey = i;
                        break;
                    }
                }

                if (foundKey !== false) {
                    this.inv[i].am += am;
                } else {
                    this.inv.push({
                        item: item,
                        am: am
                    })
                }
            },
            HasItem: function(item, am) {
                am = (typeof am !== 'number' ? 1 : am);

                if (typeof _G.items[item] === 'undefined') {
                    return 0;
                }

                let foundKey = false;
                for (var i = 0; i < this.inv.length; i++) {
                    if (item === this.inv[i].item) {
                        foundKey = i;
                        break;
                    }
                }

                if (foundKey !== false) {
                    if (this.inv[foundKey].am >= am) {
                        return this.inv[foundKey].am;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            },
            TakeItem: function(item, am) {
                am = (typeof am !== 'number' ? 1 : am);

                if (typeof _G.items[item] === 'undefined') {
                    return;
                }

                let foundKey = false;
                for (var i = 0; i < this.inv.length; i++) {
                    if (item === this.inv[i].item) {
                        foundKey = i;
                        break;
                    }
                }

                if (foundKey !== false) {
                    this.inv[foundKey].am -= am;
                    if (this.inv[foundKey].am <= 0) {
                        this.inv.splice(foundKey, 1);
                    }
                } else {
                    return false;
                }
            },
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (self.Dying) {
                    return;
                }
                if (typeof self.Driving === 'object' && self.Driving.class === 'bus') {
                    return;
                }

                /*
                if (self.Owner === 'goosely') {
                    //inflictor.ShowNotify('How dare you attack this player', 1500);
                    return;
                } else if (self.Owner === 'goosely' && typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                    inflictor.Owner.ShowNotify('How dare you attack this player', 1500);
                    return;
                }*/
                if (self.SpawnProtect && _G.lastTick > self.SpawnProtect) {
                    self.SpawnProtect = undefined;
                }

                if ((self.SpawnProtect || _G.Instance === 3 || _G.Instance === 1) && typeof inflictor === 'object' && ((typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') || inflictor.class === 'player' || inflictor.class === 'vehicle_car1' || inflictor.class === 'vehicle_car_police')) {
                    return;
                }


                if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player' && inflictor.Owner !== self) {
                    inflictor.Owner.AddXP('Attack', 5);
                }

                // ── ARMOR DAMAGE REDUCTION ───────────────────────────────────
                if (self.equipment) {
                    if (self.equipment.head && _G.items[self.equipment.head] && _G.items[self.equipment.head].ArmorVal) {
                        dmg = Math.max(1, Math.round(dmg * (1 - _G.items[self.equipment.head].ArmorVal)));
                    }
                    if (self.equipment.body && _G.items[self.equipment.body] && _G.items[self.equipment.body].ArmorVal) {
                        dmg = Math.max(1, Math.round(dmg * (1 - _G.items[self.equipment.body].ArmorVal)));
                    }
                }

                self.Health -= dmg;

                // ── MELEE KNOCKBACK ──────────────────────────────────────────
                // Apply a physics-style knockback impulse away from the attacker.
                // Only for melee (not bullets/arrows) so ranged combat feels different.
                /*IF_SERVER*/
                if (inflictor && typeof inflictor.pos === 'object' && !inflictor.isArrow && inflictor.class !== 'bullet' && inflictor.class !== 'grenade_beancan') {
                    let _inflictorPos = (inflictor.class === 'player') ? inflictor.pos :
                                        (inflictor.Owner && inflictor.Owner.pos) ? inflictor.Owner.pos : null;
                    if (_inflictorPos) {
                        let _kdx = self.pos[0] - _inflictorPos[0];
                        let _kdy = self.pos[1] - _inflictorPos[1];
                        let _kdist = Math.sqrt(_kdx * _kdx + _kdy * _kdy) || 1;
                        let _kPower = Math.min(dmg * 1.4, 28); // cap max knockback
                        self.KnockVec = [(_kdx / _kdist) * _kPower, (_kdy / _kdist) * _kPower];
                        self.KnockDecay = 0.72; // per-tick multiplier
                    }
                }
                /*IF_END*/

                // ── HIT FLASH (used by client renderer for red tint) ─────────
                self.LastDamage = _G.lastTick;
                self.HitFlash = Date.now() + 260;

                let pain = _G.sounds.impacts.pain_ply[randInt(0, _G.sounds.impacts.pain_ply.length - 1)].cloneNode(true, self.pos);
                pain.volume = 0.15;
                pain.play();

                if (self.Health <= 0) {
                    self.OnDeath(self, inflictor);
                }

                let dmgAt = _G.lastTick,
                    dmgFades = 0;

                let dmgTimer = setInterval(function() {
                    dmgFades += 1;
                    let fadeProgress = 0,
                        dmgTime = (_G.lastTick - dmgAt);
                    if (_G.lastTick - dmgAt >= 160) {
                        fadeProgress = 1 - ((dmgTime - 160) / 160)
                    } else {
                        fadeProgress = (dmgTime / 160)
                    }
                    let toRed = (255 - self.RaceRGB.r);

                    let redClr = rgbToHex(self.RaceRGB.r + toRed * fadeProgress, self.RaceRGB.g, self.RaceRGB.b);


                    if (dmgTime >= 320) {
                        clearInterval(dmgTimer);

                        self.parts[0].fillStyle = self.RaceColor;
                        self.parts[1].fillStyle = self.RaceColor;
                        self.parts[2].fillStyle = self.RaceColor;
                    } else {
                        self.parts[0].fillStyle = redClr;
                        self.parts[1].fillStyle = redClr;
                        self.parts[2].fillStyle = redClr;
                    }
                }, 20)

                /*
                setTimeout(function() {
                    self.parts[0].fillStyle = raceColor;
                    self.parts[1].fillStyle = raceColor;
                    self.parts[2].fillStyle = raceColor;
                }, 440);
                */
            },
            Despawn: function(self) {
                _G.playerSaves[self.Owner] = {};

                for (var i = 0; i < saveVars.length; i++) {
                    if (typeof self[saveVars[i]] !== 'undefined') {
                        if (saveVars[i] === 'Holstered') {
                            _G.playerSaves[self.Owner][saveVars[i]] = self.Holstered.class
                        } else if (saveVars[i] === 'ActiveWeapon') {
                            _G.playerSaves[self.Owner][saveVars[i]] = self.ActiveWeapon.class
                        } else {
                            _G.playerSaves[self.Owner][saveVars[i]] = convertImg(self[saveVars[i]]);
                        }
                    }
                }

                if (typeof _G.playerSaves[self.Owner].Holstered === 'object') {
                    _G.playerSaves[self.Owner].Holstered = _G.playerSaves[self.Owner].Holstered.class
                }

                if (typeof _G.playerSaves[self.Owner].ActiveWeapon === 'object') {
                    _G.playerSaves[self.Owner].ActiveWeapon = _G.playerSaves[self.Owner].ActiveWeapon.class
                }

                if (typeof _G.playerData[self.Owner] !== 'undefined') {
                    _G.playerData[self.Owner] = undefined;
                    delete _G.playerData[self.Owner];
                }

                if (typeof self.ActiveWeapon === 'object' && self.ActiveWeapon.Placing && _G.placable[self.ActiveWeapon.class]) {
                    self.ActiveWeapon.Placing = undefined;
                    delete self.ActiveWeapon.Placing;
                    self.ActiveWeapon.class = self.ActiveWeapon.class + '_pickup';
                }

                self.ShouldRemove = true;

                localStorage.setItem('playerSaves', JSON.stringify(_G.playerSaves));
            },
            Respawn: function(self) {
                if (self.RaceColor) {
                    for (var ii = 0; ii < self.parts.length; ii++) {
                        if (self.parts[ii].name === 'body' || self.parts[ii].name === 'footLeft' || self.parts[ii].name === 'footRight') {
                            self.parts[ii].fillStyle = self.RaceColor;
                        }
                    }
                }

                self.alpha = 1;
                self.Dying = undefined;
                self.noShadow = undefined;

                let foundBed = false,
                    foundBedPos = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'bed' && _G.ents.All[i].Owner === self.Owner) {
                        foundBed = _G.ents.All[i];
                        break;
                    }
                }

                if (foundBed) {
                    let checkPos = [foundBed.pos[0] - 10, foundBed.pos[1] - 29];

                    for (var i = 0; i < 160; i++) {
                        if (i % 10 === 0 && i !== 0) {
                            checkPos[0] -= 60;
                            checkPos[1] += 5;
                        } else {
                            checkPos[0] += 8;
                        }

                        let bboxToPoly = getRectPolygon([checkPos[0], checkPos[1]], self.bbox, 0)

                        let collidingEnts = checkCollisions(bboxToPoly, [checkPos[0], checkPos[1]], self.bbox, 0, true, self.Owner, self);

                        if (collidingEnts.length === 0) {
                            foundBedPos = checkPos;
                            break;
                        }
                    }

                }

                if (!foundBedPos) {
                    self.pos[0] = randInt(10, 660);
                    self.pos[1] = randInt(10, 660);
                } else {
                    self.pos[0] = foundBedPos[0];
                    self.pos[1] = foundBedPos[1];
                }

                self.Health = self.HealthMax;
                self.HealthDisplay = self.HealthMax;
            },
            OnDeath: function(self, inflictor) {
                if (_G.CLIENT) {
                    return;
                }

                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'bus' && _G.ents.All[i].Riders.indexOf(self) !== -1) {
                        _G.ents.All[i].Riders.splice(_G.ents.All[i].Riders.indexOf(self), 1);

                        /*
                                                            if (_G.ents.All[i].Riders.length <= 0) {
                                                                _G.ents.All[i].BusLeaving = false;
                                                                _G.ents.All[i].BusGoing = false;
                                                            }*/
                    }
                }

                let placingObj = [];

                if (typeof self.Holstered === 'object') {
                    self.Holstered.Holstered = undefined;
                    self.Holstered.Weapon = undefined;
                    self.Holstered.noShadow = undefined;
                    self.Holstered.Owner = undefined;
                    self.Holstered.parent = undefined;
                    self.Holstered.parentPart = undefined;
                    self.Holstered.parentX = undefined;
                    self.Holstered.parentY = undefined;
                    self.Holstered = undefined;
                }
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (typeof _G.ents.All[i].Holstered === 'object' && typeof _G.ents.All[i].Holstered.Owner !== 'undefined' && _G.ents.All[i].Holstered.Owner === self.Owner) {
                        _G.ents.All[i].Holstered = undefined;
                        _G.ents.All[i].Weapon = undefined;
                        _G.ents.All[i].noShadow = undefined;
                        _G.ents.All[i].Owner = undefined;
                        _G.ents.All[i].parent = undefined;
                        _G.ents.All[i].parentPart = undefined;
                        _G.ents.All[i].parentX = undefined;
                        _G.ents.All[i].parentY = undefined;
                    }

                    if (typeof _G.ents.All[i].Placing === 'object' && _G.ents.All[i].Placing === self) {
                        if (typeof _G.ents.All[i].Placing.PlacingObj === 'object') {
                            _G.ents.All[i].Placing.PlacingObj = undefined;
                        }

                        _G.ents.All[i].Placing = false;
                        _G.ents.All[i].ShouldRemove = true;

                        let placable = _G.ents.Create(_G.ents.All[i].class + '_pickup');
                        placable.pos = [_G.ents.All[i].pos[0], _G.ents.All[i].pos[1]];
                    }
                }

                self.ExitDrive();
                self.DropWeapon();
                self.OnMeth = undefined;
                self.invOpen = undefined;
                self.invSlot = undefined;
                self.craftOpen = undefined;
                self.craftSlot = undefined;
                self.skillOpen = undefined;
                self.conSlot = undefined;
                self.conScroll = 0;

                if (self.container) {
                    self.container.IsOpen = undefined;
                    self.container = undefined;
                }

                if (typeof _G.playerData[self.Owner] !== 'undefined') {
                    _G.playerData[self.Owner].input = {};
                    _G.playerData[self.Owner].mouse = {};
                    _G.playerData[self.Owner].unpress = {};

                    for (var zz = 0; zz < wsClients.length; zz++) {
                        wsClients[zz].send(JSON.stringify({
                            type: 'ClearInput',
                            user: self.Owner,
                            time: _G.lastTick
                        }));
                    }
                }

                for (var i = 0; i < self.inv.length; i++) {
                    if (!self.inv[i] || !self.inv[i].item) continue;
                    let _itemDef = _G.items[self.inv[i].item];
                    if (!_itemDef || !_itemDef.dropItem) continue;
                    let itemDrop = _G.ents.Create(_itemDef.dropItem);
                    if (!itemDrop) continue;
                    itemDrop.pos[0] = self.pos[0] + randInt(-30, 30);
                    itemDrop.pos[1] = self.pos[1] + 50 + randInt(0, 20)
                    itemDrop.rotate = angleToRadians(randInt(-6, 6));
                    itemDrop.itemAm = self.inv[i].am;


                    if (!self.OutsideBoundary) {
                        if (itemDrop.pos[0] > _G.BoundaryX - 120) {
                            itemDrop.pos[0] = _G.BoundaryX - 120;
                        }
                        if (itemDrop.pos[0] < _G.BoundaryMinX + 60) {
                            itemDrop.pos[0] = _G.BoundaryMinX + 60;
                        }
                        if (itemDrop.pos[1] > _G.BoundaryY - 60) {
                            itemDrop.pos[1] = _G.BoundaryY - 60;
                        }
                        if (itemDrop.pos[1] < _G.BoundaryMinY + 60) {
                            itemDrop.pos[1] = _G.BoundaryMinY + 60;
                        }
                    }
                }

                /*
                let foundBed = false,
                    foundBedPos = false;
                for (var i=0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].class === 'bed' && _G.ents.All[i].Owner === self.Owner) {
                        foundBed = _G.ents.All[i];
                        break;
                    }
                }

                if (foundBed) {
                    let checkPos = [foundBed.pos[0]-10,foundBed.pos[1]-29];

                    for (var i=0; i < 160; i++) {
                        if (i % 10 === 0 && i !== 0) {
                            checkPos[0] -= 60;
                            checkPos[1] += 5;
                        } else {
                            checkPos[0] += 8;
                        }

                        let bboxToPoly = getRectPolygon([checkPos[0], checkPos[1]], self.bbox, 0)

                        let collidingEnts = checkCollisions(bboxToPoly, [checkPos[0], checkPos[1]], self.bbox, 0, true, self.Owner, self);

                        if (collidingEnts.length === 0) {
                            foundBedPos = checkPos;
                            break;
                        }
                    }

                }

                if (!foundBedPos) {
                    self.pos[0] = randInt(10,660);
                    self.pos[1] = randInt(10,660);
                } else {
                    self.pos[0] = foundBedPos[0];
                    self.pos[1] = foundBedPos[1];
                }

                self.Health = self.HealthMax;
                self.HealthDisplay = self.HealthMax;
                */
                self.Dying = Date.now();
                self.DyingPos = [self.pos[0], self.pos[1]];
                self.DyingRot = self.rotate;
                self.DyingRotTo = 80 + randInt(0, 20);
                if (randInt(0, 1) === 0) {
                    self.DyingRotTo = -self.DyingRotTo;
                }
                self.noShadow = true;

                self.inv = [];

                // ── DROP EQUIPPED ARMOR ON DEATH ─────────────────────────────
                if (self.equipment) {
                    let eqSlots = ['head', 'body'];
                    for (let ei = 0; ei < eqSlots.length; ei++) {
                        let eKey = self.equipment[eqSlots[ei]];
                        if (eKey && _G.items[eKey] && _G.items[eKey].dropItem) {
                            let itemDrop = _G.ents.Create(_G.items[eKey].dropItem);
                            itemDrop.pos[0] = self.pos[0] + randInt(-25, 25);
                            itemDrop.pos[1] = self.pos[1] + 40 + randInt(0, 20);
                            itemDrop.rotate = angleToRadians(randInt(-6, 6));
                            itemDrop.itemAm = 1;
                        }
                    }
                    self.equipment = {};
                    _G.RemoveArmorParts(self, 'head');
                    _G.RemoveArmorParts(self, 'body');
                }

                if (typeof inflictor !== 'undefined') {
                    try {
                        sendChat('[HoboQuest] @' + self.Owner + ' died from ' + ((typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') ? (inflictor.Owner.Owner + ' ') : '') + (inflictor.class === 'player' ? (' ' + inflictor.Owner) : '') + ' ' + inflictor.class.replace(/_/gi, ' '));
                    } catch (e) {}
                }


                if (typeof _G.Instance !== 'undefined') {
                    self.pos = [randInt(10, 660), randInt(10, 660)];
                    let getData = _G.ents.GetSaveData(),
                        userData = {};

                    for (var i = 0; i < getData.length; i++) {
                        if (getData[i].class === 'player' && self.Owner === getData[i].Owner) {
                            userData[getData[i].Owner] = getData[i];
                            break;
                        }
                    }

                    if (typeof userData[self.Owner].pos !== 'undefined') {
                        userData[self.Owner].pos = [randInt(10, 660), randInt(10, 660)];
                    }

                    let userAuth = RandomString(64);

                    let sendData = {
                        type: 'Instance',
                        fromInstance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0),
                        toInstance: !_G.Instance ? 2 : 0,
                        user: self.Owner,
                        data: userData[self.Owner],
                        auth: userAuth
                    };

                    wsMaster.send(JSON.stringify(sendData));

                    for (var zz = 0; zz < wsClients.length; zz++) {
                        if (typeof wsClients[zz].authUser === 'string' && wsClients[zz].authUser === self.Owner) {
                            wsClients[zz].send(JSON.stringify({
                                type: 'LocationChange',
                                url: '/?T=' + Date.now() + '#Auth=' + userAuth
                            }));
                        }
                    }

                    /*
                    let userAuth = RandomString(64);

                                let sendData = {
                                    type: 'Instance',
                                    fromInstance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0),
                                    toInstance: !_G.Instance ? 2 : 0,
                                    user: self.Riders[i].Owner,
                                    data: userData[self.Riders[i].Owner],
                                    auth: userAuth
                                };

                                if (typeof self.Riders[i].Holstered === 'object') {
                                    sendData.holstered = self.Riders[i].Holstered.class;
                                    self.Riders[i].Holstered.ShouldRemove = true;
                                }
                                if (typeof self.Riders[i].ActiveWeapon === 'object') {
                                    sendData.wep = self.Riders[i].ActiveWeapon.class;
                                    self.Riders[i].ActiveWeapon.ShouldRemove = true;
                                }

                                names += ' @' + self.Riders[i].Owner;
                                self.Riders[i].Driving = undefined;
                                self.Riders[i].Despawn(self.Riders[i]);

                                wsMaster.send(JSON.stringify(sendData));

                                if (typeof _G.Instance === 'undefined') {
                                    _G.InData[self.Riders[i].Owner] = Date.now();
                                }

                                for (zz=0; zz < wsClients.length; zz++) {
                                    if (typeof wsClients[zz].authUser === 'string' && wsClients[zz].authUser === self.Riders[i].Owner) {
                                        wsClients[zz].send(JSON.stringify({
                                            type: 'LocationChange',
                                            url: '/' + (_G.Instance ? '' : 'FarmIsland') + '#Auth=' + userAuth
                                        }))
                                    }
                                }
                                */

                    sendChat('@' + self.Owner + ' You died and respawned in the main city - Go here to play https://Hobo.Quest/');
                    self.Despawn(self);

                    if (_G.Instance && _G.Instance === 3) {
                        let plyCount = 0;
                        for (var ii = 0; ii < _G.ents.All.length; ii++) {
                            if (_G.ents.All[ii].class === 'player' && !_G.ents.All[ii].ShouldRemove) {
                                plyCount += 1;
                            }
                        }

                        if (plyCount <= 0) {
                            _G.CurWave = undefined;
                            _G.NextWave = undefined;
                            for (var ii = 0; ii < _G.ents.All.length; ii++) {
                                if (typeof _G.npcs[_G.ents.All[ii].class] === 'object' || _G.ents.All[ii].class !== 'map') {
                                    _G.ents.All[ii].ShouldRemove = true;
                                }
                            }
                        }
                    }

                    if (typeof _G.playerSaves[self.Owner] === 'object') {
                        _G.playerSaves[self.Owner] = undefined;
                        delete _G.playerSaves[self.Owner];
                    }
                } else {
                    if (typeof self.inputLast !== 'undefined' && _G.lastTick - self.inputLast >= 600000) {
                        self.Despawn(self);
                    }
                }


            },
            Draw: function(ctx) {
                if (this.Dying && Date.now() - this.Dying > 5000) {
                    ctx.save()
                    ctx.rotate(-this.rotate);
                    let invFont = 16,
                        zoomLvl = 0;
                    if (_G.viewport.zoom < 1.7) {
                        zoomLvl = (1.7 - _G.viewport.zoom);
                        invFont = (16 + Math.round(zoomLvl * 15));
                        ctx.font = 'bold ' + invFont + 'px "Open Sans"';
                    } else {
                        ctx.font = 'bold 16px "Open Sans"';
                    }
                    ctx.fillStyle = 'rgba(0,220,0,1)';
                    ctx.fillText('Space to respawn', -90 - 70 * zoomLvl, -10);
                    ctx.restore()
                }
            },
            ShowNotify: function(msg, time) {
				let self = this;
                self.Notify = msg;
                if (typeof self.NotifyTimeout !== 'undefined') {
                    clearTimeout(self.NotifyTimeout);
                }
                self.NotifyTimeout = setTimeout(function() {
                    self.Notify = undefined;
                    self.NotifyTimeout = undefined;
                }, time);
            },
            ExitDrive: function() {
                let toReturn = undefined;
                if (typeof this.Driving === 'object' && typeof this.Driving.Driver !== 'undefined') {
                    this.Driving.Driver = undefined;
                    toReturn = true;
                }

                if (typeof this.Driving !== 'undefined') {
                    this.Driving = undefined;
                    if (toReturn !== true) {
                        toReturn = false;
                    }
                }

                return toReturn;
            }
        });

        _G.ents.All[entIndex - 1].DropWeapon = function() {
            if (typeof this.ActiveWeapon === 'undefined') {
                return false;
            }

            let wep = this.ActiveWeapon,
                dropWep = false;

            if (typeof wep.DropSounds === 'object') {
                dropWep = wep.DropSounds[randInt(0, wep.DropSounds.length - 1)].cloneNode(true, this.pos);
                dropWep.volume = 0.15;
                dropWep.play();
            } else {
                dropWep = _G.sounds.impacts.weapons[randInt(0, _G.sounds.impacts.weapons.length - 1)].cloneNode(true, this.pos);
                dropWep.volume = 0.15;
                dropWep.play();
            }

            setTimeout(function() {
                try {
                    dropWep.destroy();
                    dropWep = undefined;
                } catch (e) {
                    dropWep = undefined;
                }
            }, 2200);

            if (this.Holstered === wep) {
                this.Holstered.Holstered = undefined;
                this.Holstered = undefined;
            }

            wep.Holstered = undefined;
            wep.Weapon = undefined;
            wep.noShadow = undefined;
            wep.Owner = undefined;
            wep.parent = undefined;
            wep.parentPart = undefined;
            wep.parentX = undefined;
            wep.parentY = undefined;

            wep.rotate = wep.parts[0].rotate;
            wep.parts[0].rotate = undefined;
            wep.parts[0].interpOffset = undefined;
            wep.parts[0].interpDir = undefined;

            wep.PlacedBy = this.Owner;

            /*
            let drops = 0;
            wep.DropInterval = setInterval(function() {
                if (typeof wep !== 'object' || typeof wep.pos !== 'object') {
                    clearInterval(wep.DropInterval);
                    return;
                }

                wep.pos[1] += 2;
                drops += 1;

                if (drops % 2 === 0) {
                    wep.pos[0] += randInt(-1,1);
                }

                if (drops > 15) {
                    clearInterval(wep.DropInterval);
                    wep.DropInterval = undefined;
                }

                if (wep.pos[0] > _G.BoundaryX-60) {
                    wep.pos[0] = _G.BoundaryX-60;
                }
                if (wep.pos[1] > _G.BoundaryY-60) {
                    wep.pos[1] = _G.BoundaryY-60;
                }
            }, 13);
            */
            wep.Dropping = 0;
            wep.DropAdd = [(this.pos[0] - this.bbox[0] - this.bbox[2] * .5) - (wep.pos[0] - wep.bbox[0] - wep.bbox[2] * .5) + 11, (this.pos[1] + this.bbox[1]) - (wep.pos[1] - wep.bbox[1] - wep.bbox[3])];
            wep.DropAdd = [Math.floor(wep.DropAdd[0] / 10), Math.floor(wep.DropAdd[1] / 10)];

            this.ActiveWeapon = undefined;

            return true;
        }

        _G.ents.PlayersByName[userName] = _G.ents.All[entIndex - 1];

        _G.ents.Players.push(_G.ents.All[entIndex - 1]);

        //_G.ents.PlayersActive.push(_G.ents.All[entIndex - 1]);

        if (typeof _G.playerSaves[userName] === 'object') {
            let saveKeys = Object.keys(_G.playerSaves[userName]),
                playerSave = clone(_G.playerSaves[userName]);

            for (var i = 0; i < saveKeys.length; i++) {
                if (saveKeys[i] === 'parts') {
                    for (var z = 0; z < playerSave[saveKeys[i]].length; z++) {
                        if (typeof playerSave[saveKeys[i]][z].img === 'string') {
                            playerSave[saveKeys[i]][z].img = _G.Material(playerSave[saveKeys[i]][z].img);
                        }
                    }
                    //ent[entKeys[x]] = _G.Material(getEnts[i][entKeys[x]]);
                }
                _G.ents.All[entIndex - 1][saveKeys[i]] = playerSave[saveKeys[i]];
            }

            _G.playerSaves[userName] = undefined;
            delete _G.playerSaves[userName];
            localStorage.setItem('playerSaves', JSON.stringify(_G.playerSaves));
        }

    } else if (typeof _G.wep.List[className] !== 'undefined') {
        entIndex = _G.wep.Create(className);
    } else if (typeof _G.placable[className] !== 'undefined') {
        entIndex = _G.placableCreate(className);
    } else if (className === 'bullet') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [-1, -1, 10, 10],
            interpDir: 1,
            parts: [{
                name: 'body',
                type: 'fillRect',
                x: 0,
                y: 0,
                w: 6,
                h: 6,
                fillStyle: '#fff'
            }],
            ThinkClient: true,
            direction: 1,
            BulletHit: [],
            Damage: 5
        });

        let createTime = Date.now();
        _G.ents.All[entIndex - 1].Think = function(self) {
            /*IF_SERVER*/
            if (Date.now() - createTime > 2000) {
                self.ShouldRemove = true;
                return true;
            }

            let _bulletLagToken = null;
            if (typeof _G.lagComp !== 'undefined' && self.Owner && self.Owner.class === 'player') {
                _bulletLagToken = _G.lagComp.startForPlayer(self.Owner);
            }

            self.colliding = _G.ents.Colliding(self, true);

            if (typeof self.colliding !== 'undefined' && self.colliding.length > 0) {
                for (var i = 0; i < self.colliding.length; i++) {
                    if (self.colliding[i].Solid) {
                        self.ShouldRemove = true;
                        break;
                    } else if (self.colliding[i] !== self.Owner && typeof self.colliding[i].OnDamage === 'function' && self.BulletHit.indexOf(self.colliding[i]) === -1) {
                        self.BulletHit.push(self.colliding[i]);

                        self.colliding[i].OnDamage(self, self.Damage);
                    }
                }
            }

            if (_bulletLagToken) _G.lagComp.endRewind(_bulletLagToken);
            /*IF_END*/

            if (typeof self.direction === 'object') {
                self.pos[0] += (self.Speed || 13) * self.direction[0];
                self.pos[1] += (self.Speed || 13) * self.direction[1];
            } else {
                self.pos[0] += (self.Speed || 13) * self.direction;
            }

            if (self.isArrow) {
                // ── Arrow gravity arc ─────────────────────────────────────────
                // Accumulate a small downward drift so arrows trace a gentle arc
                // rather than flying in a perfectly straight line.  GravVec is
                // applied both to the visual position (y) and the direction vector
                // so the rotate angle stays aligned with actual flight path.
                if (typeof self.direction === 'object') {
                    if (!self._gravAccum) self._gravAccum = 0;
                    self._gravAccum += 0.04; // pixels of downward acceleration per tick
                    self._gravAccum = Math.min(self._gravAccum, 3.5); // terminal velocity
                    self.pos[1] += self._gravAccum;
                    // Tilt direction down gradually so rotation matches arc
                    let _gSpd = Math.sqrt(self.direction[0] * self.direction[0] + self.direction[1] * self.direction[1]);
                    self.direction[1] += 0.003 * _gSpd;
                    // Re-normalise so speed stays constant
                    let _gMag = Math.sqrt(self.direction[0] * self.direction[0] + self.direction[1] * self.direction[1]);
                    if (_gMag > 0) { self.direction[0] /= _gMag; self.direction[1] /= _gMag; }
                    self.rotate = Math.atan2(self.direction[1], self.direction[0]);
                } else {
                    self.rotate = self.direction > 0 ? 0 : Math.PI;
                }
            }
        };
    } else if (className === 'tree') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [56, 32, 49, 170],
            interpDir: 1,
            parts: [{
                name: 'tree',
                type: 'drawImg',
                img: _G.Material('assets/img/tree.png'),
                x: 0,
                y: 0,
                w: 158,
                h: 212
            }],
            direction: 1,
            Health: 150,
            HealthMax: 150,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof self.Cut !== 'undefined') {
                    return false;
                }

                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && (inflictor.class === 'bullet' || inflictor.class.substring(0, 6) === 'sword_')) {
                    return false;
                }
                self.LastDamage = _G.lastTick;
                self.Health -= dmg;


                let cut = _G.sounds.impacts.wood[randInt(0, _G.sounds.impacts.wood.length - 1)].cloneNode(true, self.pos);
                cut.volume = 0.15;
                cut.play();


                if (self.Health < 0) {
                    self.Health = 0;
                }

                if (self.Health === 0 && typeof self.Cut === 'undefined') {
                    self.Cut = _G.lastTick;
                    setTimeout(function() {
                        self.Cut = undefined;
                        self.parts[0].img = _G.Material('assets/img/tree.png');
                        self.Health = self.HealthMax;
                        self.HealthDisplay = self.HealthMax;
                    }, 160000);

                    self.parts[0].img = _G.Material('assets/img/tree_cut.png');

                    for (var i = 0; i < randInt(1, inflictor.class === 'hatchet' ? 3 : 2); i++) {
                        let logs = _G.ents.Create('logs');
                        /*logs.pos[0] = self.pos[0]+randInt(-70,70);
                        logs.pos[1] = self.pos[1]+50+randInt(0,30)
                        */
                        logs.pos = _G.FindGoodPos(self.pos[0] + 20 + randInt(-10, 10), self.pos[1] + 90, logs.bbox);
                        logs.rotate = angleToRadians(randInt(-6, 6));

                        if (logs.pos[0] > _G.BoundaryX - 20) {
                            logs.pos[0] = _G.BoundaryX - 20;
                        } else if (logs.pos[0] < _G.BoundaryMinX + 20) {
                            logs.pos[0] = _G.BoundaryMinX + 20;
                        }

                        if (logs.pos[1] > _G.BoundaryY - 20) {
                            logs.pos[1] = _G.BoundaryY - 20;
                        } else if (logs.pos[1] < _G.BoundaryMinY + 20) {
                            logs.pos[1] = _G.BoundaryMinY + 20;
                        }
                    }

                    if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        inflictor.Owner.AddXP('Woodcutting', 25);
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
            }
        });
    } else if (className === 'tree_oak') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [56, 32, 49, 170],
            interpDir: 1,
            parts: [{
                name: 'tree',
                type: 'drawImg',
                img: _G.Material('assets/img/tree-oak.png'),
                x: 0,
                y: 0,
                w: 172,
                h: 212
            }],
            direction: 1,
            Health: 450,
            HealthMax: 450,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && (inflictor.class === 'bullet' || inflictor.class.substring(0, 6) === 'sword_')) {
                    return false;
                }

                if (typeof inflictor.Owner !== 'object' || typeof inflictor.Owner.skills !== 'object' || typeof inflictor.Owner.skills['Woodcutting'] !== 'object' || inflictor.Owner.skills['Woodcutting'].lvl < 15) {
                    try {
                        if (inflictor.class === 'player') {
                            inflictor.ShowNotify('Need lvl 15 Woodcutting', 2100);
                        } else {
                            inflictor.Owner.ShowNotify('Need lvl 15 Woodcutting', 2100);
                        }
                    } catch (e) {}
                    return false;
                }

                self.LastDamage = _G.lastTick;
                self.Health -= dmg;

                if (self.Health < 0) {
                    self.Health = 0;
                }

                let cut = _G.sounds.impacts.wood[randInt(0, _G.sounds.impacts.wood.length - 1)].cloneNode(true, self.pos);
                cut.volume = 0.15;
                cut.play();


                if (self.Health === 0 && typeof self.Cut === 'undefined') {
                    self.Cut = _G.lastTick;
                    setTimeout(function() {
                        self.Cut = undefined;
                        self.parts[0].img = _G.Material('assets/img/tree-oak.png');
                        self.Health = self.HealthMax;
                        self.HealthDisplay = self.HealthMax;
                    }, 160000);

                    self.parts[0].img = _G.Material('assets/img/tree-oak_cut.png');

                    for (var i = 0; i < randInt(1, inflictor.class === 'hatchet' ? 2 : 1); i++) {
                        let logs = _G.ents.Create('logs_oak');
                        logs.pos[0] = self.pos[0] + randInt(-70, 70);
                        logs.pos[1] = self.pos[1] + 50 + randInt(0, 30)
                        logs.rotate = angleToRadians(randInt(-6, 6));
                    }

                    if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        inflictor.Owner.AddXP('Woodcutting', 38);
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
            }
        });
    } else if (className === 'rock_copper') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [5, 5, 80, 78],
            interpDir: 1,
            parts: [{
                name: 'rock',
                type: 'drawImg',
                img: _G.Material('assets/img/copper.png'),
                x: 0,
                y: 0,
                w: 90,
                h: 84
            }],
            direction: 1,
            Health: 150,
            HealthMax: 150,
            HealthSize: 54,
            HealthX: 10,
            HealthY: 26,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && inflictor.class.substring(0, 7) !== 'pickaxe') {
                    return false;
                }
                self.LastDamage = _G.lastTick;
                self.Health -= dmg;

                if (self.Health < 0) {
                    self.Health = 0;
                }

                if (self.Health === 0 && typeof self.ShouldRemove === 'undefined') {
                    self.ShouldRemove = true;

                    for (var i = 0; i < randInt(1, 2); i++) {
                        let logs = _G.ents.Create('ore_copper');
                        logs.pos[0] = self.pos[0] + randInt(-70, 70);
                        logs.pos[1] = self.pos[1] + 50 + randInt(0, 30)
                        logs.rotate = angleToRadians(randInt(-6, 6));

                        if (logs.pos[0] > _G.BoundaryX - 20) {
                            logs.pos[0] = _G.BoundaryX - 20;
                        } else if (logs.pos[0] < _G.BoundaryMinX + 20) {
                            logs.pos[0] = _G.BoundaryMinX + 20;
                        }

                        if (logs.pos[1] > _G.BoundaryY - 20) {
                            logs.pos[1] = _G.BoundaryY - 20;
                        } else if (logs.pos[1] < _G.BoundaryMinY + 20) {
                            logs.pos[1] = _G.BoundaryMinY + 20;
                        }

                    }

                    if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        inflictor.Owner.AddXP('Mining', 19);
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
            }
        });
    } else if (className === 'rock_tin') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [5, 5, 80, 78],
            interpDir: 1,
            parts: [{
                name: 'rock',
                type: 'drawImg',
                img: _G.Material('assets/img/tin.png'),
                x: 0,
                y: 0,
                w: 90,
                h: 84
            }],
            direction: 1,
            Health: 150,
            HealthMax: 150,
            HealthSize: 54,
            HealthX: 10,
            HealthY: 26,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && inflictor.class.substring(0, 7) !== 'pickaxe') {
                    return false;
                }
                self.LastDamage = _G.lastTick;
                self.Health -= dmg;

                if (self.Health < 0) {
                    self.Health = 0;
                }

                if (self.Health === 0 && typeof self.ShouldRemove === 'undefined') {
                    self.ShouldRemove = true;

                    for (var i = 0; i < randInt(1, 2); i++) {
                        let logs = _G.ents.Create('ore_tin');
                        logs.pos[0] = self.pos[0] + randInt(-70, 70);
                        logs.pos[1] = self.pos[1] + 50 + randInt(0, 30)
                        logs.rotate = angleToRadians(randInt(-6, 6));
                        if (logs.pos[0] > _G.BoundaryX - 20) {
                            logs.pos[0] = _G.BoundaryX - 20;
                        } else if (logs.pos[0] < _G.BoundaryMinX + 20) {
                            logs.pos[0] = _G.BoundaryMinX + 20;
                        }

                        if (logs.pos[1] > _G.BoundaryY - 20) {
                            logs.pos[1] = _G.BoundaryY - 20;
                        } else if (logs.pos[1] < _G.BoundaryMinY + 20) {
                            logs.pos[1] = _G.BoundaryMinY + 20;
                        }

                    }

                    if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        inflictor.Owner.AddXP('Mining', 19);
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
            }
        });
    } else if (className === 'rock_iron') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [5, 5, 80, 78],
            interpDir: 1,
            parts: [{
                name: 'rock',
                type: 'drawImg',
                img: _G.Material('assets/img/rock_iron.png'),
                x: 0,
                y: 0,
                w: 90,
                h: 84
            }],
            direction: 1,
            Health: 450,
            HealthMax: 450,
            HealthSize: 54,
            HealthX: 10,
            HealthY: 26,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && inflictor.class.substring(0, 7) !== 'pickaxe') {
                    return false;
                }

                if (typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player' && (typeof inflictor.Owner.skills !== 'object' || typeof inflictor.Owner.skills['Mining'] !== 'object' || inflictor.Owner.skills['Mining'].lvl < 15)) {
                    inflictor.Owner.ShowNotify('Need lvl 15 mining', 2000);
                    return false;
                }

                self.LastDamage = _G.lastTick;
                self.Health -= dmg;

                if (self.Health < 0) {
                    self.Health = 0;
                }

                if (self.Health === 0 && typeof self.ShouldRemove === 'undefined') {
                    self.ShouldRemove = true;

                    let logs = _G.ents.Create('ore_iron');
                    logs.pos[0] = self.pos[0] + randInt(-70, 70);
                    logs.pos[1] = self.pos[1] + 50 + randInt(0, 30)
                    logs.rotate = angleToRadians(randInt(-6, 6));

                    if (logs.pos[0] > _G.BoundaryX - 20) {
                        logs.pos[0] = _G.BoundaryX - 20;
                    } else if (logs.pos[0] < _G.BoundaryMinX + 20) {
                        logs.pos[0] = _G.BoundaryMinX + 20;
                    }

                    if (logs.pos[1] > _G.BoundaryY - 20) {
                        logs.pos[1] = _G.BoundaryY - 20;
                    } else if (logs.pos[1] < _G.BoundaryMinY + 20) {
                        logs.pos[1] = _G.BoundaryMinY + 20;
                    }

                    if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        inflictor.Owner.AddXP('Mining', 35);
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
            }
        });
    } else if (className === 'rock_coal') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [5, 5, 80, 78],
            interpDir: 1,
            parts: [{
                name: 'rock',
                type: 'drawImg',
                img: _G.Material('assets/img/rock_coal.png'),
                x: 0,
                y: 0,
                w: 90,
                h: 84
            }],
            direction: 1,
            Health: 580,
            HealthMax: 580,
            HealthSize: 54,
            HealthX: 10,
            HealthY: 26,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && inflictor.class.substring(0, 7) !== 'pickaxe') {
                    return false;
                }

                if (typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player' && (typeof inflictor.Owner.skills !== 'object' || typeof inflictor.Owner.skills['Mining'] !== 'object' || inflictor.Owner.skills['Mining'].lvl < 20)) {
                    inflictor.Owner.ShowNotify('Need lvl 20 mining', 2000);
                    return false;
                }

                self.LastDamage = _G.lastTick;
                self.Health -= dmg;

                if (self.Health < 0) {
                    self.Health = 0;
                }

                if (self.Health === 0 && typeof self.ShouldRemove === 'undefined') {
                    self.ShouldRemove = true;

                    let logs = _G.ents.Create('ore_coal');
                    logs.pos[0] = self.pos[0] + randInt(-70, 70);
                    logs.pos[1] = self.pos[1] + 50 + randInt(0, 30)
                    logs.rotate = angleToRadians(randInt(-6, 6));

                    if (logs.pos[0] > _G.BoundaryX - 20) {
                        logs.pos[0] = _G.BoundaryX - 20;
                    } else if (logs.pos[0] < _G.BoundaryMinX + 20) {
                        logs.pos[0] = _G.BoundaryMinX + 20;
                    }

                    if (logs.pos[1] > _G.BoundaryY - 20) {
                        logs.pos[1] = _G.BoundaryY - 20;
                    } else if (logs.pos[1] < _G.BoundaryMinY + 20) {
                        logs.pos[1] = _G.BoundaryMinY + 20;
                    }

                    if (typeof inflictor === 'object' && typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                        inflictor.Owner.AddXP('Mining', 50);
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
            }
        });
    } else if (className === 'rock_rune') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [5, 5, 80, 81],
            interpDir: 1,
            parts: [{
                name: 'rune',
                type: 'drawImg',
                img: _G.Material('assets/img/rune.png'),
                x: 0,
                y: 0,
                w: 90,
                h: 84
            }],
            direction: 1,
            Health: 450,
            HealthMax: 450,
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (typeof inflictor === 'object' && typeof inflictor.class === 'string' && inflictor.class !== 'pickaxe') {
                    return false;
                }
                self.LastDamage = _G.lastTick;
                /*
                self.Health -= dmg;

                if (self.Health < 0) {
                    self.Health = 0;
                }

                if (self.Health === 0 && typeof self.ShouldRemove === 'undefined') {
                    self.ShouldRemove = true;

                    for (var i=0; i < randInt(1,2); i++) {
                        let logs = _G.ents.Create('metal');
                        logs.pos[0] = self.pos[0]+randInt(-70,70);
                        logs.pos[1] = self.pos[1]+50+randInt(0,30)
                        logs.rotate = angleToRadians(randInt(-6,6));
                        logs.nametag = undefined;
                    }

                    //inflictor.Owner.input['V'] = undefined;
                }
                */
                if (typeof inflictor.Owner === 'object' && inflictor.Owner.class === 'player') {
                    inflictor.Owner.ShowNotify('Need lvl 85 mining', 2000);
                }
            }
        });
    } else if (className === 'bush') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [24, 22, 82, 94],
            interpDir: 1,
            parts: [{
                name: 'tree',
                type: 'drawImg',
                img: _G.Material('assets/img/bush.png'),
                x: 0,
                y: 0,
                w: 140,
                h: 115
            }],
            direction: 1,
            HasBerries: _G.lastTick,
            UseFirst: function(self, ply) {
                if (self.HasBerries) {
                    self.parts[0].img = _G.Material('assets/img/bush_picked.png');
                    ply.ShowNotify('+2 Berries', 2000)
                    ply.AddXP('Herbology', 4);
                    ply.AddItem('berries', 2)
                    self.HasBerries = undefined;
                    setTimeout(function() {
                        self.parts[0].img = _G.Material('assets/img/bush.png');
                        self.HasBerries = _G.lastTick;
                    }, 320000)

                    ply.PickedBerries = _G.lastTick;

                    return;
                } else {
                    return false;
                }
            }
        });
    } else if (className === 'plus_ad') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'plusAd',
                type: 'drawImg',
                img: _G.Material('assets/img/plus.png'),
                x: 0,
                y: 0,
                w: 245,
                h: 301
            }],
            noShadow: true,
            renderBehindPlayer: true,
        });

    } else if (className === 'slot_machine') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [6, 6, 40, 78],
            interpDir: 1,
            parts: [{
                name: 'slotMachine',
                type: 'drawImg',
                img: _G.Material('assets/img/slot_machine1.png'),
                x: 0,
                y: 0,
                w: 60,
                h: 98
            }],
            noShadow: true,
            renderBehindPlayer: true,
            MachineID: 1,
            Use: function(self, caller) {
                if (!caller.SlotMachine) {
                    caller.SlotMachine = this.MachineID;
                    return;
                }
                return true;
            }
        });

    } else if (className === 'map_club') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [-16000, -16000],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'plusAd',
                type: 'drawImg',
                img: _G.Material('assets/img/map_club.png'),
                x: 0,
                y: 0,
                w: 2000,
                h: 1744
            }],
            noShadow: true,
            renderBehindPlayer: true,
            AlwaysRender: true
        });
    } else if (className === 'map_bank') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [16000, 16000],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'plusAd',
                type: 'drawImg',
                img: _G.Material('assets/img/map_bank.png'),
                x: 0,
                y: 0,
                w: 1080,
                h: 1441
            }],
            noShadow: true,
            renderBehindPlayer: true,
            AlwaysRender: true
        });
    } else if (className === 'campfire') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [65, 75],
            bbox: [8, 20, 52, 45],
            interpDir: 1,
            parts: [{
                name: 'campfire',
                type: 'drawImg',
                img: _G.Material('assets/img/campfire.png'),
                x: 0,
                y: 0,
                w: 65,
                h: 75
            }],
            noShadow: true,
            renderBehindPlayer: true,
            nametag: 'Campfire',
            title: 'Open crafting nearby',
            alpha: 0,
            FireSource: true,
            Think: function(self) {
                if (!self.ShouldRemove && _G.lastTick - self.CreatedAt > self.BurnLength) {
                    if (!self.alpha) {
                        self.alpha = 1;
                    }
                    self.alpha -= 0.03;
                    if (self.alpha <= 0) {
                        self.alpha = 0;
                        self.ShouldRemove = true;

                        for (var i = 0; i < _G.ents.All.length; i++) {
                            if (_G.ents.All[i].class === 'player' && _G.ents.All[i].craftOpen && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], self.pos[0], self.pos[1]) < 240) {
                                _G.ents.All[i].craftOpen = undefined;
                                delete _G.ents.All[i].craftOpen;
                            }
                        }
                    }

                    if (!self.SndPlayed) {
                        self.SndPlayed = true;

                        let snd2 = _G.sounds.sizzle.cloneNode(true, self.pos);
                        snd2.volume = 0.3;
                        snd2.play();
                    }
                } else if (!self.ShouldRemove && self.alpha < 1) {
                    self.alpha += 0.03;
                }
            },
            CreatedAt: _G.lastTick
        });
    } else if (typeof _G.npcs[className] === 'object') {
        let npcData = clone(_G.npcs[className]);
        npcData.parts[0].img = _G.npcs[className].parts[0].img;


        if (typeof npcData.parts[0].img === 'object' && npcData.parts[0].img instanceof Array) {
            npcData.parts[0].img = npcData.parts[0].img[randInt(0, npcData.parts[0].img.length)]
        }

        entIndex = _G.ents.All.push({
            class: className,
            pos: [125, 1075],
            bbox: npcData.bbox,
            interpDir: -1,
            parts: npcData.parts,
            Speed: npcData.Speed,
            DistanceFromHome: npcData.DistanceFromHome,
            LastAttack: 0,
            AttackSpeed: npcData.AttackSpeed,
            AttackDelay: npcData.AttackDelay,
            AttackDamage: npcData.AttackDamage,
            AttackRotate: (typeof npcData.AttackRotate !== 'undefined' ? npcData.AttackRotate : -34),
            TargetCheck: 0,
            LastMove: 0,
            Health: npcData.HealthMax,
            HealthMax: npcData.HealthMax,
            nametag: (npcData.nametag ? npcData.nametag : undefined),
            lvl: (npcData.lvl ? npcData.lvl : 3),
            DeathDrops: (typeof npcData.DeathDrops === 'object' ? npcData.DeathDrops : false),
            OnDamage: function(inflictor, dmg) {
				let self = this;
                if (_G.CLIENT) {
                    return;
                }

                if (!self.ShouldRemove && typeof self.Health !== 'undefined' && typeof self.HealthMax !== 'undefined' && self.HealthMax > 0) {
                    self.Health -= dmg;
                    self.LastDamage = _G.lastTick;
                    self.HitFlash = Date.now() + 260;

                    // ── NPC aggro switch: if hit by a player closer than current target, switch ──
                    if (inflictor && !self.ShouldRemove) {
                        let _attacker = (inflictor.class === 'player') ? inflictor :
                                        (inflictor.Owner && inflictor.Owner.class === 'player') ? inflictor.Owner : null;
                        if (_attacker) {
                            if (!self.Target || (self.Target.class === 'player' && self.Target !== _attacker &&
                                _G.distance(self.pos[0], self.pos[1], _attacker.pos[0], _attacker.pos[1]) <
                                _G.distance(self.pos[0], self.pos[1], self.Target.pos[0], self.Target.pos[1]))) {
                                self.Target = _attacker;
                                self.TargetOffset = [randInt(0, 1) === 1 ? (66 + randInt(-10, 10)) : randInt(-32, -15), randInt(10, 50) + 10];
                            }
                        }
                    }

                    if (self.Health <= 0) {
                        self.ShouldRemove = true;
                        if (self.DeathDrops) {
                            let randDrop = [];
                            for (var i = 0; i < self.DeathDrops.length; i++) {
                                let rand = randInt(0, 100);
                                if (rand <= self.DeathDrops[i].chance) {
                                    randDrop.push(self.DeathDrops[i]);
                                }
                            }

                            if (randDrop.length > 0) {
                                for (var zz = 0; zz < randDrop.length; zz++) {
                                    let dropItem = _G.ents.Create(randDrop[zz].item);
                                    dropItem.pos = [self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .8];

                                    if (typeof randDrop[zz].am === 'number') {
                                        dropItem.itemAm = randDrop[zz].am;
                                    } else if (typeof randDrop[zz].am === 'object' && randDrop[zz].am instanceof Array) {
                                        dropItem.itemAm = randInt(randDrop[zz].am[0], randDrop[zz].am[1]);
                                    }
                                }
                            }
                        }
                    }

                    let pain = _G.sounds.impacts.pain_ply[randInt(0, _G.sounds.impacts.pain_ply.length - 1)].cloneNode(true, self.pos);
                    pain.volume = 0.15;
                    pain.play();
                }
            },
            Think: function(self) {
                if (_G.CLIENT || self.ShouldRemove) {
                    return;
                }

                // Drop stale player targets that have been removed or are dying
                if (self.Target && !(self.Target instanceof Array) &&
                    (self.Target.ShouldRemove || self.Target.Dying || !self.Target.pos)) {
                    self.Target = undefined;
                }

                if ((!self.Target || self.Target instanceof Array) && _G.lastTick - self.TargetCheck > 1000) {
                    self.TargetCheck = _G.lastTick;

                    // ── Find closest player in aggro range ────────────────────
                    let _closestPly = null, _closestDist = Infinity;
                    for (var i = 0; i < _G.ents.All.length; i++) {
                        if (_G.ents.All[i].class === 'player' && !_G.ents.All[i].Dying) {
                            let _pd = _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1],
                                self.posStart ? self.posStart[0] : self.pos[0],
                                self.posStart ? self.posStart[1] : self.pos[1]);
                            let _aggroRange = (typeof self.DistanceFromHome !== 'undefined') ? self.DistanceFromHome : 1000;
                            if (_pd < _aggroRange && _pd < _closestDist) {
                                _closestDist = _pd;
                                _closestPly  = _G.ents.All[i];
                            }
                        }
                    }
                    if (_closestPly) {
                        self.Target = _closestPly;
                        self.TargetOffset = [randInt(0, 1) === 1 ? (66 + randInt(-10, 10)) : randInt(-32, -15), randInt(10, 50) + 10];
                    }
                }

                // ── Patrol: wander between random waypoints near home when idle ──
                if ((!self.Target || self.Target instanceof Array) && _G.lastTick - self.LastMove > 9500) {
                    self.LastMove = _G.lastTick;
                    self.TargetOffset = undefined;
                    // Choose a patrol point within ±40% of DistanceFromHome so NPCs
                    // spread around their home position instead of all piling in one spot.
                    let _pRange = Math.round((typeof self.DistanceFromHome !== 'undefined' ? self.DistanceFromHome : 300) * 0.4);
                    self.Target = [
                        self.posStart[0] + randInt(-_pRange, _pRange),
                        self.posStart[1] + randInt(-_pRange, _pRange)
                    ];
                }

                if (self.Target && (typeof self.Target === 'object' || typeof _G.ents.PlayersByName[self.Target] === 'object')) {
                    let pos = false,
                        ent = false;
                    if (self.Target instanceof Array) {
                        if (self.Target[0] === self.pos[0] && self.Target[1] === self.pos[1]) {
                            self.Target = undefined;
                            delete self.Target;
                            return;
                        }

                        pos = [self.Target[0], self.Target[1]];
                    } else if (typeof self.Target === 'object' && typeof self.Target.pos === 'object') {
                        pos = [self.Target.pos[0], self.Target.pos[1]];
                        ent = self.Target;
                    } else if (typeof _G.ents.PlayersByName[self.Target] === 'object') {
                        pos = [_G.ents.PlayersByName[self.Target].pos[0], _G.ents.PlayersByName[self.Target].pos[1]];
                        ent = _G.ents.PlayersByName[self.Target];
                    }

                    if (self.TargetOffset && pos) {
                        pos[0] += self.TargetOffset[0];
                        pos[1] += self.TargetOffset[1];
                    }

                    if (ent && ent.Dying) {
                        self.Target = [self.posStart[0] + randInt(-20, 20), self.posStart[1] + randInt(-20, 20)];
                        return;
                    }

                    if (!pos) {
                        return;
                    }


                    if (!(self.Target instanceof Array) && _G.distance(self.pos[0], self.pos[1], self.posStart[0], self.posStart[1]) > self.DistanceFromHome) {
                        self.Target = [self.posStart[0] + randInt(-20, 20), self.posStart[1] + randInt(-20, 20)];
                        return;
                    }

                    let vec = [pos[0] - self.pos[0], pos[1] - self.pos[1]];

                    if (vec[0] > self.Speed) {
                        let ratio = (vec[1] / vec[0])
                        vec[0] = self.Speed;
                        vec[1] = vec[0] * ratio
                    } else if (vec[0] < -self.Speed) {
                        let ratio = (vec[1] / vec[0])
                        vec[0] = -self.Speed;
                        vec[1] = vec[0] * ratio
                    }

                    if (vec[1] > self.Speed) {
                        let ratio = (vec[0] / vec[1])
                        vec[1] = self.Speed;
                        vec[0] = vec[1] * ratio
                    } else if (vec[1] < -self.Speed) {
                        let ratio = (vec[0] / vec[1])
                        vec[1] = -self.Speed;
                        vec[0] = vec[1] * ratio
                    }

                    if (typeof self.StuckAt !== 'undefined' && _G.lastTick - self.StuckAt >= 1000) {
                        if (self.StuckTries === 1) {
                            vec = [-vec[0], vec[1]];
                        } else if (self.StuckTries === 2) {
                            vec = [-vec[0], -vec[1]];
                        } else if (self.StuckTries === 3 && _G.lastTick - self.StuckAt) {
                            vec = [-vec[0], -vec[1]];
                        } else {
                            vec = [vec[0], -vec[1]];
                        }
                        if (_G.lastTick - self.StuckAt >= 1200) {
                            self.StuckAt = undefined;
                            self.StuckTries += 1;

                            if (self.StuckTries > 3) {
                                self.StuckTries = 0;
                            }
                        }
                    }

                    let vecY = vec[1];

                    let bboxToPoly = getRectPolygon([self.pos[0] + vec[0], self.pos[1] + vec[1]], self.bbox, 0)

                    let collidingEnts = checkCollisions(bboxToPoly, [self.pos[0] + vec[0], self.pos[1] + vec[1]], self.bbox, 0, true, undefined, self);


                    if (collidingEnts.length > 0) {
                        bboxToPoly = getRectPolygon([self.pos[0] + vec[0], self.pos[1]], self.bbox, 0)

                        collidingEnts = checkCollisions(bboxToPoly, [self.pos[0] + vec[0], self.pos[1]], self.bbox, 0, true, undefined, self);

                        if (collidingEnts.length > 0) {

                            bboxToPoly = getRectPolygon([self.pos[0], self.pos[1] + vec[1]], self.bbox, 0)

                            collidingEnts = checkCollisions(bboxToPoly, [self.pos[0], self.pos[1] + vec[1]], self.bbox, 0, true, undefined, self);

                            if (collidingEnts.length > 0) {

                                if (Math.abs(vec[0]) < self.Speed) {
                                    vec[0] = self.Speed;
                                }

                                bboxToPoly = getRectPolygon([self.pos[0] + vec[0], self.pos[1]], self.bbox, 0)

                                collidingEnts = checkCollisions(bboxToPoly, [self.pos[0] + vec[0], self.pos[1]], self.bbox, 0, true, undefined, self);

                                if (collidingEnts.length > 0) {
                                    vec = [0, 0];
                                    if (typeof self.StuckAt === 'undefined') {
                                        self.StuckAt = _G.lastTick;
                                        self.StuckTries = self.StuckTries ? self.StuckTries : 0;
                                    }
                                } else {
                                    vec[1] = 0;
                                }
                            } else {
                                vec[0] = 0;
                                if (typeof self.StuckAt === 'undefined') {
                                    self.StuckAt = _G.lastTick;
                                    self.StuckTries = self.StuckTries ? self.StuckTries : 0;
                                }
                            }

                        } else {
                            vec[1] = 0;
                        }
                    }

                    if (vec[0] !== 0) {
                        self.pos[0] += vec[0];
                    }

                    if (vec[1] !== 0) {
                        self.pos[1] += vec[1];
                    }

                    let ang = (self.interpDir > 0 ? 11 : -11);
                    if (vec[1] < -0.1 && self.rotate !== angleToRadians(ang)) {
                        self.rotateTo = angleToRadians(ang);
                    } else if (vec[1] > 0.1 && self.rotate !== angleToRadians(-ang)) {
                        self.rotateTo = angleToRadians(-ang);
                    } else if (vec[1] <= 0.1 || vec[1] >= -0.1 && self.rotate !== 0) {
                        self.rotateTo = 0;
                    }

                    if (vec[0] !== 0) {
                        self.parts[0].rotate = Math.sin(_G.lastTick * .009) * .144;
                        if (vec[0] > 0 && self.interpDir > -1) {
                            self.interpDir -= .1;
                            self.parts[0].interpDir = self.interpDir;
                        } else if (vec[0] < 0 && self.interpDir < 1) {
                            self.interpDir += .1;
                            self.parts[0].interpDir = self.interpDir;
                        } else if (vec[0] === 0 && self.interpDir !== 0) {
                            if (self.interpDir > .1) {
                                self.interpDir -= .1;
                            } else if (self.interpDir < -.1) {
                                self.interpDir += .1;
                            } else {
                                self.interpDir = 0;
                            }
                            self.parts[0].interpDir = self.interpDir;
                        }
                    } else if (self.interpDir < 0 && self.interpDir !== -1) {
                        self.interpDir = -1;
                    } else if (self.interpDir > 0 && self.interpDir !== 1) {
                        self.interpDir = 1;
                    } else if (self.interpDir === 0) {
                        self.interpDir = 1;
                    }

                    if (ent && !ent.ShouldRemove && !ent.Dying && ent.pos && typeof ent.OnDamage === 'function' && _G.distance(self.pos[0] + self.bbox[0] + self.bbox[2] * .5, self.pos[1] + self.bbox[1] + self.bbox[3] * .5, pos[0] + ent.bbox[0] + ent.bbox[2] * .5, pos[1] + ent.bbox[1] + ent.bbox[3] * .5) < 80) {
                        if (_G.lastTick - self.LastAttack > self.AttackSpeed + self.AttackDelay) {
                            self.LastAttack = _G.lastTick;
                            ent.OnDamage(self, self.AttackDamage);
                        }

                        // ── Attack telegraph ──────────────────────────────────
                        // Set NPC.AttackWarnFlash 400 ms before the hit lands.
                        // The hit-flash renderer picks this up as an orange tint
                        // so the player has a visual cue to dodge/block.
                        let _timeToHit = (self.AttackSpeed + self.AttackDelay) - (_G.lastTick - self.LastAttack);
                        if (_timeToHit > 0 && _timeToHit < 400) {
                            self.AttackWarnFlash = true;
                            self.HitFlash = Date.now() + 80; // brief orange tint (reused field)
                        } else {
                            self.AttackWarnFlash = undefined;
                        }

                        let rot = _G.lastTick - self.LastAttack;
                        if (rot <= self.AttackSpeed * .5) {
                            rot = (rot / (self.AttackSpeed * .5))
                        } else {
                            rot = 1 - ((rot - self.AttackSpeed * .5) / (self.AttackSpeed * .5))
                        }

                        if (rot < 0) {
                            rot = 0;
                        } else if (rot > 1) {
                            rot = 1;
                        }


                        self.parts[0].rotate = angleToRadians(self.AttackRotate ? self.AttackRotate : -34) * rot;
                        self.parts[0].rotateAttack = true;
                    } else if (self.parts[0].rotateAttack) {
                        self.parts[0].rotate = 0;
                        self.parts[0].rotateAttack = undefined;
                    }
                }
            }
        });

    } else if (className === 'bus') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [-200, 190],
            bbox: [10, 10, 285, 90],
            interpDir: 1,
            parts: [{
                name: 'bus',
                type: 'drawImg',
                img: _G.Material('assets/img/truck.png'),
                x: 0,
                y: 0,
                w: 305,
                h: 110
            }],
            Draw: function(ctx) {
                let self = this;
                if (self.BusLeaving && !self.BusGoing) {
                    ctx.save()
                    ctx.rotate(-self.rotate);
                    let invFont = 16,
                        zoomLvl = 0;
                    if (_G.viewport.zoom < 1.7) {
                        zoomLvl = (1.7 - _G.viewport.zoom);
                        invFont = (16 + parseFloat((zoomLvl * 15).toFixed(2)));
                        ctx.font = 'bold ' + invFont + 'px "Open Sans"';
                    } else {
                        ctx.font = 'bold 16px "Open Sans"';
                    }
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 5;
                    ctx.lineWidth = 1;
                    ctx.strokeText((self.BusName || 'Bus') + ' leaves in ' + ((15000 - (_G.lastTick - self.BusLeaving)) / 1000).toFixed(1), 71 - 120 * zoomLvl, 66);
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillText((self.BusName || 'Bus') + ' leaves in ' + ((15000 - (_G.lastTick - self.BusLeaving)) / 1000).toFixed(1), 70 - 120 * zoomLvl, 65);
                    ctx.restore()
                }
            },
            noShadow: true,
            renderBehindPlayer: true,
            UseDown: [],
            Riders: [],
            BusLeaving: false,
			RiderOffset: [50, 0],
            ThinkClient: function(self) {
                if (self.BusLeaving) {
                    for (var i = 0; i < self.Riders.length; i++) {
                        self.Riders[i].pos = [self.pos[0] + self.RiderOffset[0], self.pos[1] + self.RiderOffset[1]];
                    }
                    if (self.BusGoing) {
                        self.pos[0] -= 4;
                    }
                }
            },
            Think: function(self) {
                if (self.UseDown.length > 0) {
                    for (var i = 0; i < self.UseDown.length; i++) {
                        if (typeof _G.playerData[self.UseDown[i].Owner] === 'undefined' || typeof _G.playerData[self.UseDown[i].Owner].input !== 'object' || typeof _G.playerData[self.UseDown[i].Owner].input['E'] === 'undefined') {
                            self.UseDown.splice(i, 1);
                        }
                    }
                }

                if (self.BusLeaving) {
                    for (var i = 0; i < self.Riders.length; i++) {
                        self.Riders[i].pos = [self.pos[0] + self.RiderOffset[0], self.pos[1] + self.RiderOffset[1]];
                    }
                    if (!self.BusGoing && _G.lastTick - self.BusLeaving >= 15000) {
                        self.BusGoing = true;
                    } else if (self.BusGoing) {
                        self.pos[0] -= 4;
                    }

                    if (self.pos[0] < _G.BoundaryMinX - 1200) {
                        if (!self.BusLeft) {
                            let getData = _G.ents.GetSaveData(),
                                userData = {};

                            for (var i = 0; i < getData.length; i++) {
                                if (getData[i].class === 'player') {
                                    userData[getData[i].Owner] = getData[i];
                                }
                            }

                            let names = '';
                            for (var i = 0; i < self.Riders.length; i++) {
                                let userAuth = RandomString(64);

                                let sendData = {
                                    type: 'Instance',
                                    fromInstance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0),
                                    toInstance: !_G.Instance ? (typeof self.GoInstance == 'number' ? self.GoInstance : 2) : 0,
                                    user: self.Riders[i].Owner,
                                    data: userData[self.Riders[i].Owner],
                                    auth: userAuth
                                };

                                if (typeof self.Riders[i].Holstered === 'object') {
                                    sendData.holstered = self.Riders[i].Holstered.class;
                                    self.Riders[i].Holstered.ShouldRemove = true;
                                }
                                if (typeof self.Riders[i].ActiveWeapon === 'object') {
                                    sendData.wep = self.Riders[i].ActiveWeapon.class;
                                    self.Riders[i].ActiveWeapon.ShouldRemove = true;
                                }

                                names += ' @' + self.Riders[i].Owner;
                                self.Riders[i].Driving = undefined;
                                self.Riders[i].pos = [randInt(10, 660), randInt(10, 660)];
                                self.Riders[i].Despawn(self.Riders[i]);

                                wsMaster.send(JSON.stringify(sendData));

                                if (typeof _G.Instance === 'undefined') {
                                    _G.InData[self.Riders[i].Owner] = Date.now();
                                }

                                for (var zz = 0; zz < wsClients.length; zz++) {
                                    if (typeof wsClients[zz].authUser === 'string' && wsClients[zz].authUser === self.Riders[i].Owner) {
                                        wsClients[zz].send(JSON.stringify({
                                            type: 'LocationChange',
                                            url: ((typeof self.GoInstance == 'number' && typeof _G.InstanceURL[self.GoInstance] !== 'undefined') ? _G.InstanceURL[self.GoInstance] : ('/' + (_G.Instance ? '' : 'FarmIsland'))) + ('?T=' + Date.now()) + '#Auth=' + userAuth
                                        }))
                                    }
                                }
                                /*
                                        let sendData = {
                                            type: 'Instance',
                                            fromInstance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0),
                                            toInstance: !_G.Instance ? 2 : 0,
                                            user: self.Riders[i].Owner,
                                            data: userData[self.Riders[i].Owner]
                                        };

                                        if (typeof self.Riders[i].Holstered === 'object') {
                                            sendData.holstered = self.Riders[i].Holstered.class;
                                            self.Riders[i].Holstered.ShouldRemove = true;
                                        }
                                        if (typeof self.Riders[i].ActiveWeapon === 'object') {
                                            sendData.wep = self.Riders[i].ActiveWeapon.class;
                                            self.Riders[i].ActiveWeapon.ShouldRemove = true;
                                        }

                                        names += ' @' + self.Riders[i].Owner;
                                        self.Riders[i].Driving = undefined;
                                        self.Riders[i].Despawn(self.Riders[i]);

                                        chatBot.send(JSON.stringify(sendData));

                                        if (typeof _G.Instance === 'undefined') {
                                            _G.InData[self.Riders[i].Owner] = Date.now();
                                        }
*/

                            }

                            self.BusLeft = _G.lastTick;

                            if (self.Riders.length > 0) {
                                if (_G.Instance) {
                                    sendChat(names + ' You went to the main city - Go here to play https://Hobo.Quest/')
                                } else {
                                    sendChat(names + ' You took the bus - Go here to play https://Hobo.Quest/' + ((typeof self.GoInstance == 'number' && typeof _G.InstanceURL[self.GoInstance] !== 'undefined') ? _G.InstanceURL[self.GoInstance] : 'FarmIsland'))
                                }
                            }

                            self.Riders = [];
                        } else if (self.BusLeft && self.pos[0] < _G.BoundaryMinX - 3000) {
                            self.pos = ((typeof self.posStart === 'object' && [self.posStart[0], self.posStart[1]]) || [100, 100]);
                            self.BusLeaving = false;
                            self.BusGoing = false;
                            self.BusLeft = undefined;
                        }
                    }
                }



            },
            Use: function(self, caller) {
                if (caller.Driving && caller.Driving !== self) {
                    return true;
                }

                if (self.BusGoing) {
                    return true;
                }

                /*
                if (caller.Owner !== 'goosely') {
                    return true;
                }
                */

                let foundWS = false;
                for (var zz = 0; zz < wsClients.length; zz++) {
                    if (wsClients[zz].authUser === caller.Owner) {
                        foundWS = wsClients[zz];
                        break;
                    }
                }

                if (!foundWS) {
                    if (!caller.LastWebNotify || _G.lastTick - caller.LastWebNotify > 10000) {
                        caller.LastWebNotify = _G.lastTick;
                        caller.ShowNotify('➨ Hobo.Quest to ride bus', 2000);
                        sendChat('@' + caller.Owner + ' You must play the game via website at https://Hobo.Quest/ in order to ride the bus.')
                    }
                    return true;
                }


                if (self.UseDown.indexOf(caller) === -1) {
                    if (typeof caller.Driving !== 'object') {
                        caller.Driving = self;
                        caller.pos = [0 + randInt(0, 60), 170];
                        self.Riders.push(caller);
                        if (!self.BusLeaving) {
                            self.BusLeaving = _G.lastTick;
                        }
                    } else {
                        caller.Driving = undefined;
                        if (self.Riders.indexOf(caller) !== -1) {
                            self.Riders.splice(self.Riders.indexOf(caller), 1);
                        }
                        /*
                        if (self.BusLeaving) {
                            self.BusLeaving = false;
                        }
                        */
                    }
                    self.UseDown.push(caller);

                    return;
                }
                return true;
            }
        });
    } else if (className === 'boat_small') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: (_G.Instance && _G.Instance === 3) ? [-860, -285] : [-360, 350],
            bbox: [10, 30, 140, 24],
            interpDir: 1,
            parts: [{
                name: 'boat',
                type: 'drawImg',
                img: _G.Material('assets/img/boat-small.png'),
                x: 0,
                y: 0,
                w: 164,
                h: 80
            }],
            Draw: function(ctx) {
                let self = this;
                if (self.BusLeaving && !self.BusGoing) {
                    ctx.save()
                    ctx.rotate(-self.rotate);
                    let invFont = 16,
                        zoomLvl = 0;
                    if (_G.viewport.zoom < 1.7) {
                        zoomLvl = (1.7 - _G.viewport.zoom);
                        invFont = (16 + Math.round(zoomLvl * 15));
                        ctx.font = 'bold ' + invFont + 'px "Open Sans"';
                    } else {
                        ctx.font = 'bold 16px "Open Sans"';
                    }
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillText('Boat leaves in ' + ((15000 - (_G.lastTick - self.BusLeaving)) / 1000).toFixed(1), 20 + 70 * zoomLvl, -10);
                    ctx.restore()
                }

                if (_G.StateInfo[3]) {
                    ctx.save()
                    ctx.rotate(-self.rotate);
                    let invFont = 16,
                        zoomLvl = 0;
                    if (_G.viewport.zoom < 1.7) {
                        zoomLvl = (1.7 - _G.viewport.zoom);
                        invFont = (16 + Math.round(zoomLvl * 15));
                        ctx.font = 'bold ' + invFont + 'px "Open Sans"';
                    } else {
                        ctx.font = 'bold 16px "Open Sans"';
                    }
                    ctx.fillStyle = 'rgba(255,255,255,1)';
                    ctx.fillText('Ship is at sea', 20 + 70 * zoomLvl, -10);
                    ctx.fillText('Wave ' + _G.StateInfo[3].wave, 20 + 70 * zoomLvl, -10 + invFont + 6);
                    ctx.fillText(_G.StateInfo[3].players.length + ' players alive', 20 + 70 * zoomLvl, -10 + (invFont * 2) + 6);
                    ctx.restore();
                }
            },
            noShadow: true,
            renderBehindPlayer: true,
            UseDown: [],
            Riders: [],
            BusLeaving: false,
            ThinkClient: function(self) {
                if (self.BusLeaving) {
                    for (var i = 0; i < self.Riders.length; i++) {
                        if (typeof self.Riders[i] === 'object') {
                            self.Riders[i].pos = [self.pos[0] + 500, self.pos[1] + 76];
                        }
                    }
                    if (self.BusGoing) {
                        self.pos[0] -= 4;
                    }
                }
            },
            Think: function(self) {
                if (typeof self.StateCheck === 'undefined' || _G.lastTick >= self.StateCheck) {
                    self.StateCheck = _G.lastTick + 5000;
                    try {
                        wsMaster.send(JSON.stringify({
                            type: 'StateCheck',
                            instance: 3
                        }));
                    } catch (e) {}
                }

                if (self.UseDown.length > 0) {
                    for (var i = 0; i < self.UseDown.length; i++) {
                        if (typeof _G.playerData[self.UseDown[i].Owner] === 'undefined' || typeof _G.playerData[self.UseDown[i].Owner].input !== 'object' || typeof _G.playerData[self.UseDown[i].Owner].input['E'] === 'undefined') {
                            self.UseDown.splice(i, 1);
                        }
                    }
                }

                if (self.BusLeaving) {
                    for (var i = 0; i < self.Riders.length; i++) {
                        self.Riders[i].pos = [self.pos[0] + 320, self.pos[1] + 26]
                    }
                    if (!self.BusGoing && _G.lastTick - self.BusLeaving >= 15000) {
                        self.BusGoing = true;
                    } else if (self.BusGoing) {
                        self.pos[0] -= 4;
                    }

                    if (self.pos[0] < _G.BoundaryMinX - 1200) {
                        if (!self.BusLeft) {
                            let getData = _G.ents.GetSaveData(),
                                userData = {};

                            for (var i = 0; i < getData.length; i++) {
                                if (getData[i].class === 'player') {
                                    userData[getData[i].Owner] = getData[i];
                                }
                            }

                            let names = '';
                            for (var i = 0; i < self.Riders.length; i++) {
                                let userAuth = RandomString(64);

                                let sendData = {
                                    type: 'Instance',
                                    fromInstance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0),
                                    toInstance: !_G.Instance ? 3 : 0,
                                    user: self.Riders[i].Owner,
                                    data: userData[self.Riders[i].Owner],
                                    auth: userAuth
                                };

                                if (typeof self.Riders[i].Holstered === 'object') {
                                    sendData.holstered = self.Riders[i].Holstered.class;
                                    self.Riders[i].Holstered.ShouldRemove = true;
                                }
                                if (typeof self.Riders[i].ActiveWeapon === 'object') {
                                    sendData.wep = self.Riders[i].ActiveWeapon.class;
                                    self.Riders[i].ActiveWeapon.ShouldRemove = true;
                                }

                                names += ' @' + self.Riders[i].Owner;
                                self.Riders[i].Driving = undefined;
                                self.Riders[i].pos = [randInt(10, 660), randInt(10, 660)];
                                self.Riders[i].Despawn(self.Riders[i]);

                                wsMaster.send(JSON.stringify(sendData));

                                if (typeof _G.Instance === 'undefined') {
                                    _G.InData[self.Riders[i].Owner] = Date.now();
                                }

                                for (var zz = 0; zz < wsClients.length; zz++) {
                                    if (typeof wsClients[zz].authUser === 'string' && wsClients[zz].authUser === self.Riders[i].Owner) {
                                        wsClients[zz].send(JSON.stringify({
                                            type: 'LocationChange',
                                            url: '/' + (_G.Instance ? '' : 'Ship') + ('?T=' + Date.now()) + '#Auth=' + userAuth
                                        }))
                                    }
                                }
                                /*
                                        let sendData = {
                                            type: 'Instance',
                                            fromInstance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0),
                                            toInstance: !_G.Instance ? 2 : 0,
                                            user: self.Riders[i].Owner,
                                            data: userData[self.Riders[i].Owner]
                                        };

                                        if (typeof self.Riders[i].Holstered === 'object') {
                                            sendData.holstered = self.Riders[i].Holstered.class;
                                            self.Riders[i].Holstered.ShouldRemove = true;
                                        }
                                        if (typeof self.Riders[i].ActiveWeapon === 'object') {
                                            sendData.wep = self.Riders[i].ActiveWeapon.class;
                                            self.Riders[i].ActiveWeapon.ShouldRemove = true;
                                        }

                                        names += ' @' + self.Riders[i].Owner;
                                        self.Riders[i].Driving = undefined;
                                        self.Riders[i].Despawn(self.Riders[i]);

                                        chatBot.send(JSON.stringify(sendData));

                                        if (typeof _G.Instance === 'undefined') {
                                            _G.InData[self.Riders[i].Owner] = Date.now();
                                        }
*/

                            }

                            self.BusLeft = _G.lastTick;

                            if (self.Riders.length > 0) {
                                if (_G.Instance) {
                                    sendChat(names + ' You took the boat to the main city - Go here to play https://Hobo.Quest/')
                                } else {
                                    sendChat(names + ' You boarded the ship - Go here to play https://Hobo.Quest/Ship')
                                }
                            }

                            self.Riders = [];
                        } else if (self.BusLeft && self.pos[0] < _G.BoundaryMinX - 3000) {
                            if (_G.Instance && _G.Instance === 3) {
                                self.pos = [-860, -285];
                            } else {
                                self.pos = [-360, 350];
                            }
                            self.BusLeaving = false;
                            self.BusGoing = false;
                            self.BusLeft = undefined;
                        }
                    }
                }



            },
            Use: function(self, caller) {
                if (caller.Driving && caller.Driving !== self) {
                    return true;
                }

                if (self.BusGoing) {
                    return true;
                }

                /*
                if (caller.Owner !== 'goosely') {
                    return true;
                }
                */

                let foundWS = false;
                for (var zz = 0; zz < wsClients.length; zz++) {
                    if (wsClients[zz].authUser === caller.Owner) {
                        foundWS = wsClients[zz];
                        break;
                    }
                }

                if (!foundWS) {
                    if (!caller.LastWebNotify || _G.lastTick - caller.LastWebNotify > 10000) {
                        caller.LastWebNotify = _G.lastTick;
                        caller.ShowNotify('➨ Hobo.Quest to board ship', 2000);
                        sendChat('@' + caller.Owner + ' You must play the game via website at https://Hobo.Quest/ in order to board the boat.')
                    }
                    return true;
                }

                if (_G.StateInfo[3] && _G.StateInfo[3].players.length > 0 && _G.StateInfo[3].wave !== false) {
                    caller.ShowNotify('Ship is at sea (wave ' + _G.StateInfo[3].wave + ', ' + _G.StateInfo[3].players.length + ' players)', 3000);
                    return true;
                }

                if (caller.inv.length > 0) {
                    caller.ShowNotify('Can\'t bring items', 3000);
                    return true;
                }

                if (typeof caller.ActiveWeapon === 'object' || typeof caller.Holstered === 'object') {
                    caller.ShowNotify('Can\'t bring weapons', 3000);
                    return true;
                }


                if (self.UseDown.indexOf(caller) === -1) {
                    if (typeof caller.Driving !== 'object') {
                        caller.Driving = self;
                        caller.pos = [0 + randInt(0, 60), 170];
                        self.Riders.push(caller);
                        if (!self.BusLeaving) {
                            self.BusLeaving = _G.lastTick;
                        }
                    } else {
                        caller.Driving = undefined;
                        if (self.Riders.indexOf(caller) !== -1) {
                            self.Riders.splice(self.Riders.indexOf(caller), 1);
                        }
                        /*
                        if (self.BusLeaving) {
                            self.BusLeaving = false;
                        }
                        */
                    }
                    self.UseDown.push(caller);

                    return;
                }
                return true;
            }
        });
    } else if (typeof _G.vendors[className] === 'object') {
        let entConstruct = {
            class: className,
            pos: [0, 0],
            bbox: _G.vendors[className].bbox,
            interpDir: 1,
            parts: _G.vendors[className].parts,
            nametag: _G.vendors[className].nametag,
            Container: [],
            IsOpen: false,
            Think: function(self) {
                if (self.IsOpen && (typeof self.IsOpen !== 'object' || !self.IsOpen.invOpen)) {
                    self.IsOpen.container = undefined;
                    self.IsOpen = false;
                }
            },
            Use: function(self, ply) {
                if (ply.Driving) {
                    return true;
                }

                if (self.IsOpen && self.IsOpen === ply) {
                    return true;
                }

                if (ply.Driving) {
                    return true;
                }

                if (typeof self.LastUse !== 'undefined' && _G.lastTick - self.LastUse < 1000) {
                    return true;
                }
                self.LastUse = _G.lastTick;

                if (self.IsOpen && typeof self.IsOpen === 'object') {
                    self.IsOpen.container = undefined;
                    delete self.IsOpen.container;
                    self.IsOpen = false;
                }

                if (!self.IsOpen) {
                    ply.conSlot = undefined;
                    ply.conScroll = 0;
                    ply.invScroll = 0;
                    ply.invSlot = 0;
                    ply.invOpen = _G.lastTick;

                    if (ply.container) {
                        ply.container.IsOpen = undefined;
                    }

                    ply.container = self;

                    self.IsOpen = ply;

                }
            }
        };

        if (typeof _G.vendors[className].BuyItems === 'object') {
            entConstruct.BuyItems = _G.vendors[className].BuyItems;
        }
        if (typeof _G.vendors[className].SellItems === 'object') {
            entConstruct.SellItems = _G.vendors[className].SellItems;
        }
        if (typeof _G.vendors[className].Currency === 'object') {
            entConstruct.Currency = _G.vendors[className].Currency;
        }
        if (typeof _G.vendors[className].title !== 'undefined') {
            entConstruct.title = _G.vendors[className].title;
        }

        if (typeof _G.vendors[className].Stock === 'object') {
            entConstruct.Stock = _G.vendors[className].Stock;
            entConstruct.RestockVendor = function() {
                for (var xx = 0; xx < this.Stock.length; xx++) {
                    if (typeof this.Stock[xx].next === 'undefined' || Date.now() >= this.Stock[xx].next) {
                        this.Stock[xx].next = Date.now() + this.Stock[xx].time * 1000;
                        let foundItem = false;
                        for (var findItem = 0; findItem < this.Container.length; findItem++) {
                            if (this.Container[findItem].item === this.Stock[xx].item) {
                                foundItem = this.Container[findItem];
                                break;
                            }
                        }

                        if (foundItem) {
                            if (typeof this.Stock[xx].max !== 'undefined' && foundItem.am < this.Stock[xx].max) {
                                foundItem.am += this.Stock[xx].am;
                                if (foundItem.am > this.Stock[xx].max) {
                                    foundItem.am = this.Stock[xx].max;
                                }
                            } else if (foundItem.am < this.Stock[xx].am) {
                                foundItem.am = this.Stock[xx].am;
                            }
                        } else {
                            let newItem = {
                                item: this.Stock[xx].item,
                                am: this.Stock[xx].am
                            }
                            this.Container.push(newItem);
                        }
                    }
                }
            };

            entConstruct.RestockVendor();
        }

        entIndex = _G.ents.All.push(entConstruct);
    } else if (className === 'furnace') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [30, 630],
            bbox: [28, 5, 180, 144],
            interpDir: 1,
            parts: [{
                name: 'furnace',
                type: 'drawImg',
                img: _G.Material('assets/img/furnace.png'),
                x: 0,
                y: 0,
                w: 220,
                h: 172
            }],
            nametag: 'Furnace',
            title: 'Open crafting menu near me'
        });
    } else if (className === 'anvil') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [320, 710],
            bbox: [0, 6, 62, 50],
            interpDir: 1,
            parts: [{
                name: 'anvil',
                type: 'drawImg',
                img: _G.Material('assets/img/anvil.png'),
                x: 0,
                y: 0,
                w: 62,
                h: 55
            }],
            nametag: 'Anvil',
            title: 'Open crafting menu near me'
        });
    } else if (className === 'miley_cyrus') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [235, 40],
            bbox: [12, 12, 129, 200],
            interpDir: 1,
            nametag: 'Insurance Vendor',
            parts: [{
                name: 'Miley',
                type: 'drawImg',
                img: _G.Material('assets/img/miley-cyrus.png'),
                x: 0,
                y: 0,
                w: 141,
                h: 300
            }]
        });
    } else if (className === 'fire_cloud') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [235, 40],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'fire',
                type: 'drawImg',
                img: _G.Material('assets/img/fire_cloud1.png'),
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                rotate: 0
            }],
            Think: function(self) {
                if (self.DustSpins < 100) {
                    self.DustSpins += 1;
                    self.parts[0].rotate += angleToRadians(8);
                    if (self.DustSpins > 40) {
                        self.alpha -= 0.04;
                        if (self.alpha < 0) {
                            self.alpha = 0;
                            self.ShouldRemove = true;
                        }
                    } else {
                        self.alpha += 0.05;
                        if (self.alpha > 1) {
                            self.alpha = 1;
                        }
                    }

                    self.parts[0].w += self.DustSpins < 10 ? 5 : 1;
                    self.parts[0].h += self.DustSpins < 10 ? 5 : 1;
                    self.pos[0] -= 1;
                } else {
                    self.ShouldRemove = true;
                }
            },
            DustSpins: 0,
            rotate: randInt(0, 360),
            alpha: 0.1,
            noShadow: true,
            renderBehindPlayer: true,
            direction: 1
        });
    } else if (className === 'dust_footstep') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [235, 40],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'Footstep Dust Cloud',
                type: 'drawImg',
                img: _G.Material('assets/img/dust.png'),
                x: 0,
                y: 0,
                w: 16,
                h: 16
            }],
            rotate: randInt(0, 360),
            alpha: 0.8,
            noShadow: true,
            renderBehindPlayer: true,
            direction: 1,
            Think: function(ent) {
                if (ent.ShouldRemove) {
                    return;
                }

                ent.alpha -= 0.03;
                ent.rotate += 0.02 * ent.direction;
                ent.parts[0].w += 0.3;
                ent.parts[0].h += 0.3;
                ent.pos[1] += 0.1;
                if (ent.alpha < 0) {
                    ent.alpha = 0;
                    ent.ShouldRemove = true;
                }
            }
        });
    } else if (className === 'dust_smoke') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [235, 40],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'Smoke Cloud',
                type: 'drawImg',
                img: _G.Material('assets/img/dust.png'),
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }],
            rotate: randInt(0, 360),
            alpha: 0.92,
            noShadow: true,
            renderBehindPlayer: true,
            direction: 1,
            Think: function(ent) {
                if (ent.ShouldRemove) {
                    return;
                }

                ent.alpha -= 0.004;
                ent.rotate += 0.005 * ent.direction;
                ent.parts[0].w += 0.6;
                ent.parts[0].h += 0.6;
                ent.pos[1] += 0.1;
                if (ent.alpha < 0) {
                    ent.alpha = 0;
                    ent.ShouldRemove = true;
                }

                if (ent.parts[0].w < 74) {
                    ent.parts[0].w += 1;
                    ent.parts[0].h += 1;
                }
            }
        });
    } else if (className === 'dust_meth') {
        entIndex = _G.ents.All.push({
            class: className,
            pos: [235, 40],
            bbox: [0, 0, 0, 0],
            interpDir: 1,
            parts: [{
                name: 'Meth Dust Cloud',
                type: 'drawImg',
                img: _G.Material('assets/img/dust_meth.png'),
                x: 0,
                y: 0,
                w: 90,
                h: 90
            }],
            rotate: randInt(0, 360),
            alpha: 0.9,
            noShadow: true,
            direction: 1,
            Think: function(ent) {
                if (ent.ShouldRemove) {
                    return;
                }

                ent.alpha -= 0.03;
                ent.rotate += 0.02 * ent.direction;
                ent.parts[0].w += 0.3;
                ent.parts[0].h += 0.3;
                ent.pos[1] += 0.1;
                if (ent.alpha < 0) {
                    ent.alpha = 0;
                    ent.ShouldRemove = true;
                }
            }
        });
    }

    if (entIndex === 0) {
        return;
    }

    entIndex -= 1;

    if (typeof _G.ents.All[entIndex].rotate === 'undefined') {
        _G.ents.All[entIndex].rotate = 0;
    }

    /*
    if (typeof _G.ents.All[entIndex].colliding === 'undefined') {
        _G.ents.All[entIndex].colliding = false;
    }
            */

    if (typeof _G.ents.All[entIndex].bbox !== 'object' && typeof _G.ents.All[entIndex].bboxs === 'object') {
        let bboxStartX = false,
            bboxStartY = false,
            bboxMaxX = 0,
            bboxMaxY = 0,
            bboxMaxWidth = 0,
            bboxMaxHeight = 0;

        for (var i = 0; i < _G.ents.All[entIndex].bboxs.length; i++) {
            let bbox = _G.ents.All[entIndex].bboxs[i];
            if (bbox[2] > bboxMaxWidth) {
                bboxMaxWidth = bbox[2];
            }

            if (bbox[3] > bboxMaxHeight) {
                bboxMaxHeight = bbox[3];
            }

            if (bboxStartX === false || bbox[0] < bboxStartX) {
                bboxStartX = bbox[0];
            }

            if (bboxStartY === false || bbox[1] < bboxStartY) {
                bboxStartY = bbox[1];
            }

            if (bbox[0] + bbox[2] > bboxMaxX) {
                bboxMaxX = bbox[0] + bbox[2];
            }

            if (bbox[1] + bbox[3] > bboxMaxY) {
                bboxMaxY = bbox[1] + bbox[3];
            }
        }

        _G.ents.All[entIndex].bbox = [bboxStartX, bboxStartY, (bboxMaxX - bboxStartX), (bboxMaxY - bboxStartY)];
        ///console.log(bboxMaxY, bboxStartY)
    }

    /*IF_CLIENT*/
    _G.ents.getRenderOrder();
    _G.ents.All[entIndex].Client = {};
    /*IF_END*/

    /*IF_SERVER*/
    _G.ents.All[entIndex].NetSend = true;
    _G.ents.All[entIndex].EntIndex = _G.ents.Total;
    /*IF_END*/

    _G.ents.Total += 1;

    return _G.ents.All[entIndex];
};

function clamp(v, min, max) {
    return v > min ? v < max ? v : max : min;
}

let saveClasses = ['player', 'vehicle_car1', 'vehicle_car_police', 'hatchet', 'diet_cola', 'bones', 'hatchet_bronze', 'hatchet_iron', 'hatchet_steel', 'hammer', 'hatchet_blue', 'world_wall', 'world_door', 'wall1', 'wall1-half', 'forcefield', 'pickaxe', 'rake', 'pickaxe_bronze', 'pickaxe_iron', 'pickaxe_steel', 'berries', 't-berries', 'soup_berries', 'logs', 'logs_oak', 'metal', 'metal_iron', 'metal_steel', 'meth', 'weed', 'weed_seed', 'meth_lab_shake', 'meth_lab_mid', 'meth_lab_pro', 'meth_lab', 'weed_plant', 'weapon_pistol_wood', 'weapon_smg', 'ammo_smg', 'ammo_pistol', 'jihad', 'wall-wood', 'wall-wood-half', 'door-wood', 'bed', 'text_sign', 'ore_copper', 'ore_tin', 'ore_iron', 'sword_bronze', 'sword_iron', 'sword_steel', 'dick_head', 'dick_chips', 'seller', 'bug_token', 'charms', 'chips', 'slot_machine', 'cat_poop', 'methylamine', 'lab_upgrade', 'upgrade_radius', 'grenade_beancan', 'tinderbox', 'campfire', 'tree', 'tree_oak', 'bush', 'scratch_lamp', 'scratch_lamp3', 'scratch_mine', 'scratch_mine3', 'scratch_pirate', 'scratch_pirate3', 'scratch_slots'],
    saveVars = ['inv', 'equipment', 'skills', 'class', 'Owner', 'username', 'nametag', 'pos', 'parts', 'RaceRGB', 'RaceColor', 'bbox', 'rotate', 'rotateTo', 'Health', 'HealthMax', 'DontRender', 'am', 'Am', 'DoorTouch', 'DoorGoPos', 'OutsideBoundary', 'Amount', 'itemAm', 'inputLast', 'title', 'SignText', 'Toggled', 'noShadow', 'parent', 'parentPart', 'parentX', 'parentY', 'Holstered', 'comp_528', 'PlacedBy', 'IsGrowing', 'Grown', 'Dying', 'DyingRot', 'DyingRotTo', 'DyingPos', 'ShouldRemove', 'rotateOGG', 'bboxOG', 'posOG', 'Opened', 'BuildRadius', 'BuildOrigin', 'Container', 'parentRotate', 'interpDir', 'interpOffset', 'Methylamine', 'CatPoop', 'MakingMeth', 'MakingMeths', 'IsGhost', 'Togglable', 'OwnerPass', 'AutoClose', 'BlowUp', 'BlownUp', 'CreatedAt', 'BurnLength', 'ScratchCard', 'SlotMachine', 'MachineID'];

for (var i = 0; i < _G.placableKeys.length; i++) {
    saveClasses.push(_G.placableKeys[i]);
    saveClasses.push(_G.placableKeys[i] + '_pickup');
}

_G.banned = {
    //'boilocks': true,
    //'fink': true,
    'kendra': true
};

/*IF_SERVER*/

_G.ents.Backups = {
    last: Date.now()
};

_G.ents.GetSaveData = function(force) {
    if (typeof _G.ents.HasLoaded === 'undefined') {
        return;
    }

    let saveEnts = [];
    for (var i = 0; i < _G.ents.All.length; i++) {
        if (saveClasses.indexOf(_G.ents.All[i].class) !== -1) {
            let saveEnt = {};
            for (var x = 0; x < saveVars.length; x++) {
                if (typeof _G.ents.All[i][saveVars[x]] !== 'undefined' && ((saveVars[x] !== 'Owner' && saveVars[x] !== 'parent' && saveVars[x] !== 'Holstered') || typeof _G.ents.All[i][saveVars[x]] === 'string')) {
                    saveEnt[saveVars[x]] = convertImg(_G.ents.All[i][saveVars[x]]);
                }

                if ((saveVars[x] === 'Owner' || saveVars[x] === 'parent')) {
                    if (typeof _G.ents.All[i].Owner === 'object' && typeof _G.ents.All[i].Owner.Owner === 'string') {
                        saveEnt[saveVars[x]] = _G.ents.All[i].Owner.Owner;
                    }
                } else if (saveVars[x] === 'Holstered') {
                    if (typeof _G.ents.All[i].Holstered === 'object' && typeof _G.ents.All[i].Holstered.Owner === 'string') {
                        saveEnt[saveVars[x]] = _G.ents.All[i].Holstered.Owner;
                    }
                }
            }
            if (_G.placable[saveEnt.class] !== 'undefined' && typeof _G.ents.All[i].Placing !== 'undefined' && _G.ents.All[i].Placing) {
                saveEnt.Placing = undefined;
                delete saveEnt.Placing;
                saveEnt.class = saveEnt.class + '_pickup';
            }

            saveEnts.push(saveEnt);
        }
    }

    return saveEnts;
};


_G.ents.SaveEnts = function(force) {
    if (typeof _G.ents.HasLoaded === 'undefined') {
        return;
    }

    let saveEnts = [];
    for (var i = 0; i < _G.ents.All.length; i++) {
        if (saveClasses.indexOf(_G.ents.All[i].class) !== -1) {
            let saveEnt = {};
            for (var x = 0; x < saveVars.length; x++) {
                if (typeof _G.ents.All[i][saveVars[x]] !== 'undefined' && ((saveVars[x] !== 'Owner' && saveVars[x] !== 'parent' && saveVars[x] !== 'Holstered') || typeof _G.ents.All[i][saveVars[x]] === 'string')) {
                    saveEnt[saveVars[x]] = convertImg(_G.ents.All[i][saveVars[x]]);
                }

                if ((saveVars[x] === 'Owner' || saveVars[x] === 'parent')) {
                    if (typeof _G.ents.All[i].Owner === 'object' && typeof _G.ents.All[i].Owner.Owner === 'string') {
                        saveEnt[saveVars[x]] = _G.ents.All[i].Owner.Owner;
                    }
                } else if (saveVars[x] === 'Holstered') {
                    if (typeof _G.ents.All[i].Holstered === 'object' && typeof _G.ents.All[i].Holstered.Owner === 'string') {
                        saveEnt[saveVars[x]] = _G.ents.All[i].Holstered.Owner;
                    }
                }
            }
            if (_G.placable[saveEnt.class] !== 'undefined' && typeof _G.ents.All[i].Placing !== 'undefined' && _G.ents.All[i].Placing) {
                saveEnt.class = saveEnt.class + '_pickup';
                saveEnt.Placing = undefined;
                delete saveEnt.Placing;
            }

            saveEnts.push(saveEnt);
        }
    }

    localStorage.setItem('ents' + (_G.Instance ? ('-i' + _G.Instance) : ''), JSON.stringify(saveEnts));

    if ((typeof force !== 'undefined' && force === true) || (!_G.IsLocal && Date.now() - _G.ents.Backups.last >= 1800000)) {
        let dateNow = Date.now();
        if (_G.Instance) {
            dateNow = dateNow + '-i' + _G.Instance;
        }

        _G.ents.Backups.last = dateNow;
        _G.ents.Backups[dateNow] = saveEnts;
        localStorage.setItem('backups', JSON.stringify(_G.ents.Backups));
        sendChat('Created backup of entity/player data on map (' + dateNow + ')');
    }

    if (!_G.IsLocal && typeof _G.ents.Backups.lastExport === 'undefined' || Date.now() - _G.ents.Backups.lastExport >= 43200000) {
        sendChat('Exporting local backups of entity/player data to chatbot...');

        let backupKeys = Object.keys(_G.ents.Backups);
        for (var i = 0; i < backupKeys.length; i++) {
            if (backupKeys[i] !== 'last' && backupKeys[i] !== 'lastExport') {
                if (chatBot && chatBot.readyState === 1) {
                    chatBot.send(JSON.stringify({
                        type: 'BackupExportOnly',
                        id: backupKeys[i],
                        data: _G.ents.Backups[backupKeys[i]],
                        instance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0)
                    }));
                }
            }
        }

        _G.ents.Backups = {
            last: Date.now() - 2000000,
            lastExport: Date.now()
        };

    }

    localStorage.setItem('InData', JSON.stringify(_G.InData));

    /*
                    let PlayersActive = [];
                    for (var i=0; i < _G.ents.PlayersActive.length; i++) {
                        if (typeof _G.ents.PlayersActive[i] === 'object' && typeof _G.ents.PlayersActive[i].Owner !== 'undefined') {
                            PlayersActive.push(_G.ents.PlayersActive[i].Owner);
                        }
                    }
                    localStorage.setItem('PlayersActive' + (_G.Instance ? ('-i' + _G.Instance) : ''), JSON.stringify(PlayersActive));
                    //localStorage.setItem('playerData', JSON.stringify(_G.playerData));
    */

    return saveEnts;
};

if (typeof _G.Instance === 'undefined') {
    _G.ents.CleanInactive = function() {
        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class === 'player' && (typeof _G.ents.All[i].inputLast === 'undefined' || _G.lastTick - _G.ents.All[i].inputLast >= 1800000) && _G.ents.All[i].inv.length === 0 && !_G.ents.All[i].ShouldRemove && typeof _G.ents.All[i].ActiveWeapon !== 'object' && typeof _G.ents.All[i].Holstered !== 'object') {
                _G.ents.All[i].Respawn(_G.ents.All[i]);
                //_G.ents.All[i].pos = [randInt(25,300), randInt(60, 300)];
                _G.ents.All[i].Despawn(_G.ents.All[i]);
                //console.log(_G.ents.All[i]);
                /*
                if (typeof _G.playerData[_G.ents.All[i].Owner] !== 'undefined') {
                    _G.playerData[_G.ents.All[i].Owner] = undefined;
                    delete _G.playerData[_G.ents.All[i].Owner];
                }

                _G.ents.All[i].ShouldRemove = true;
                */
            } else if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Dying && Date.now() - _G.ents.All[i].Dying >= 600000) {
                _G.ents.All[i].Respawn(_G.ents.All[i]);
                _G.ents.All[i].Despawn(_G.ents.All[i]);
            }
        }
    };
    setInterval(_G.ents.CleanInactive, 600000);
}

setInterval(_G.ents.SaveEnts, 30000);

process.stdin.resume(); //so the program will not close instantly


function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    try { _G.ents.SaveEnts(); } catch(e) { console.error('SaveEnts error during exit:', e.message); }
    if (options.exit) {
        setTimeout(function() {
            process.exit();
        }, 500);
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGTERM', exitHandler.bind(null, {
    exit: true
}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
    exit: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));

//setTimeout(function() { location.reload(); }, 3800000);

_G.ents.RestoreEnts = function(backupID) {
    //_G.playerData = JSON.parse(localStorage.getItem('playerData'));

    let getEnts = false;
    if (typeof backupID !== 'undefined' && typeof _G.ents.Backups[backupID] !== 'undefined') {
        getEnts = _G.ents.Backups[backupID];
    } else {
        try {
            getEnts = JSON.parse(localStorage.getItem('ents' + (_G.Instance ? ('-i' + _G.Instance) : '')));
        } catch (e) {
            console.error(e);
            getEnts = false;
        }
    }

    if (getEnts) {
        for (var i = 0; i < getEnts.length; i++) {
            //console.log(getEnts[i].class)

            let ent = _G.ents.Create(getEnts[i].class === 'player' ? ('player:' + getEnts[i].Owner) : getEnts[i].class),
                entKeys = Object.keys(getEnts[i]);

            if (getEnts[i].class === 'player' && typeof getEnts[i].Owner !== 'undefined') {
                if (typeof _G.playerData[getEnts[i].Owner] !== 'undefined') {
                    _G.playerData[getEnts[i].Owner].ent = ent;
                }

                /*
                                            for (var c=0; c < _G.ents.All.length; c++) {
                                                if (_G.ents.All[c].class === 'player' && _G.ents.All[c].Owner === getEnts[i].Owner) {
                                                    _G.ents.All[c].ShouldRemove = true;
                                                }
                                            }
                                            */
            }

            for (var x = 0; x < entKeys.length; x++) {
                if (entKeys[x] === 'parts') {
                    for (var z = 0; z < getEnts[i][entKeys[x]].length; z++) {
                        if (typeof getEnts[i][entKeys[x]][z].img === 'string') {
                            getEnts[i][entKeys[x]][z].img = _G.Material(getEnts[i][entKeys[x]][z].img);
                        }
                    }
                    //ent[entKeys[x]] = _G.Material(getEnts[i][entKeys[x]]);
                }

                if (typeof ent === 'object') {
                    ent[entKeys[x]] = getEnts[i][entKeys[x]];
                }

            }

            /*
            if (getEnts[i].class === 'player' && typeof getEnts[i].Owner !== 'undefined') {
                for (var c=0; c < _G.ents.All.length; c++) {
                    if (_G.ents.All[c].Owner === getEnts[i].Owner) {
                        _G.ents.All[c].ShouldRemove = true;
                    }
                }
            }
            */
        }

        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class === 'player' && typeof _G.ents.PlayersByName[_G.ents.All[i].username] !== 'object') {
                _G.ents.PlayersByName[_G.ents.All[i].username] = _G.ents.All[i];
            }
        }

        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class !== 'player' && typeof _G.ents.All[i].Owner === 'string' && typeof _G.placable[_G.ents.All[i].class] === 'undefined') {
                //console.log(_G.ents.All[i].Owner);
                if (typeof _G.ents.PlayersByName[_G.ents.All[i].Owner] !== 'undefined') {
                    if (typeof _G.wep.List[_G.ents.All[i].class] === 'object') {
                        _G.ents.PlayersByName[_G.ents.All[i].Owner].ActiveWeapon = _G.ents.All[i];
                    }

                    _G.ents.All[i].Owner = _G.ents.PlayersByName[_G.ents.All[i].Owner];
                } else {
                    _G.ents.All[i].Owner = undefined;
                }
            }
        }


        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class !== 'player' && typeof _G.ents.All[i].parent === 'string') {
                if (typeof _G.ents.PlayersByName[_G.ents.All[i].parent] !== 'undefined') {
                    _G.ents.All[i].parent = _G.ents.PlayersByName[_G.ents.All[i].parent];
                } else {
                    _G.ents.All[i].parent = undefined;
                }
            }
        }

        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class !== 'player' && typeof _G.ents.All[i].Holstered === 'string') {
                if (typeof _G.ents.PlayersByName[_G.ents.All[i].Holstered] !== 'undefined') {
                    _G.ents.All[i].Holstered = _G.ents.PlayersByName[_G.ents.All[i].Holstered];
                    _G.ents.All[i].Holstered.Holstered = _G.ents.All[i];
                    _G.ents.All[i].parent = _G.ents.All[i].Holstered;
                } else {
                    _G.ents.All[i].Holstered = undefined;
                }
            }
        }

        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class === 'player' && _G.ents.All[i].skills && !_G.ents.All[i].lvl) {
                _G.ents.All[i].lvl = Math.floor(_G.CombatLevelCalculator.combatLevel(_G.ents.All[i]).level);
            }
            if (_G.ents.All[i].class === 'player' && typeof _G.ents.All[i].inputLast !== 'undefined') {
                _G.ents.All[i].inputLast = undefined;
            }
        }


    }

    _G.ents.HasLoaded = true;

    /*
                    try {
                        let PlayersActive = JSON.parse(localStorage.getItem('PlayersActive' + (_G.Instance ? ('-i' + _G.Instance) : '')));
                        let foundPlys = [];
                        for (var z=0; z < _G.ents.All.length; z++) {
                            if (_G.ents.All[z].class === 'player' && PlayersActive.indexOf(_G.ents.All[z].Owner) !== -1) {
                                foundPlys.push(_G.ents.All[i]);
                            }
                        }

                        _G.ents.PlayersActive = foundPlys;
                    } catch(e) {
                        _G.ents.PlayersActive = [];
                    }
                    */


    let entBackups = false;
    try {
        entBackups = JSON.parse(localStorage.getItem('backups'));
    } catch (e) {
        entBackups = false;
    }

    if (entBackups && typeof entBackups === 'object' && typeof entBackups.last !== 'undefined') {
        _G.ents.Backups = entBackups;
    }
};

/*IF_END*/

// ════════════════════════════════════════════════════════════════════════
//  HAMMER BUILD RECIPES (shared server + client)
//  Used by V-key build shortcut (no pre-crafted item needed) and HUD display.
//  Refund on pickup = ceil(amount * 0.75).
// ════════════════════════════════════════════════════════════════════════
_G.buildRecipes = {
    'wall-wood':     [{ item: 'logs', am: 5 }],
    'wall-wood-half':[{ item: 'logs', am: 3 }],
    'wall1':         [{ item: 'logs', am: 5 }, { item: 'metal', am: 4 }],
    'wall1-half':    [{ item: 'logs', am: 3 }, { item: 'metal', am: 2 }],
    'door-wood':     [{ item: 'logs', am: 4 }],
    'forcefield':    [{ item: 'logs', am: 4 }, { item: 'metal', am: 6 }],
    'bed':           [{ item: 'logs', am: 10 }],
    'tool_cupboard': [{ item: 'logs', am: 8 }, { item: 'metal', am: 6 }],
    'campfire':      [{ item: 'logs', am: 5 }],
    'barbed_wire':   [{ item: 'metal', am: 8 }, { item: 'logs', am: 4 }],
};

// ════════════════════════════════════════════════════════════════════════
//  BUILD UPGRADES  (hammer V on existing owned structure = upgrade it)
//  Keys = source class, value = { to: targetClass, cost: recipe, name }
//  Server-side: hammer's ThinkFirst checks for V on existing structure.
//  The upgrade replaces the entity in-place preserving pos/owner.
// ════════════════════════════════════════════════════════════════════════
_G.buildUpgrades = {
    'wall-wood':      { to: 'wall1',      cost: [{ item: 'metal', am: 4 }],              name: 'Upgrade → Stone Wall' },
    'wall-wood-half': { to: 'wall1-half', cost: [{ item: 'metal', am: 2 }],              name: 'Upgrade → Stone Half-Wall' },
    'door-wood':      { to: 'forcefield', cost: [{ item: 'metal', am: 6 }],              name: 'Upgrade → Metal Door' },
};

// ════════════════════════════════════════════════════════════════════════
//  BUILD MENU PIECE NAMES & CATEGORIES  (client lookup for canvas HUD cards)
// ════════════════════════════════════════════════════════════════════════
/*IF_CLIENT*/
_G._bmPieceNames = {
    'wall-wood':'Wood Wall', 'wall-wood-half':'Wood Half-Wall',
    'wall1':'Stone Wall',    'wall1-half':'Stone Half-Wall',
    'door-wood':'Wood Door', 'forcefield':'Metal Door',
    'bed':'Bed',             'tool_cupboard':'Tool Cupboard',
    'campfire':'Campfire',   'barbed_wire':'Barbed Wire'
};
// Category name lookup — used by the HUD card to show the active tab
_G._bmCatNames = {
    'wall-wood':'Walls',  'wall-wood-half':'Walls',
    'wall1':'Walls',      'wall1-half':'Walls',
    'door-wood':'Doors',  'forcefield':'Doors',
    'bed':'Utilities',    'tool_cupboard':'Utilities',
    'campfire':'Utilities','barbed_wire':'Utilities'
};
// Fake style element placeholder to keep the replace anchor narrow
let _bmStyle = document.createElement('style');
/*IF_END*/

let lastFrame = 0;

function render(tFrame) {

    let calcFrame = (tFrame - lastFrame);
    lastFrame = tFrame;

    if (_G.viewport.zoom !== _G.viewport.zoomTo) {
        if (_G.lastTick <= _G.viewport.loaded || (_G.LocalPlayer && _G.LocalPlayer.CamBypass && _G.lastTick <= _G.LocalPlayer.CamBypass)) {
            _G.viewport.zoom = _G.viewport.zoomTo
        } else {
            // was .000005
            let interpolate = (Math.abs(_G.viewport.zoom - _G.viewport.zoomTo) / 0.004) * 0.000005 * calcFrame;
            //_G.viewport.xTo -= (interpolate*canvas.width);

            if (_G.viewport.zoom < _G.viewport.zoomTo) {
                _G.viewport.zoom += interpolate;
                if (_G.viewport.zoom >= _G.viewport.zoomTo) {
                    _G.viewport.zoom = _G.viewport.zoomTo;
                }
            } else if (_G.viewport.zoom > _G.viewport.zoomTo) {
                _G.viewport.zoom -= interpolate;
                if (_G.viewport.zoom <= _G.viewport.zoomTo) {
                    _G.viewport.zoom = _G.viewport.zoomTo;
                }
            }
        }
    }
    if (_G.viewport.x !== _G.viewport.xTo) {
        if (_G.lastTick <= _G.viewport.loaded || Math.abs(_G.viewport.x - _G.viewport.xTo) > 3000 || (_G.LocalPlayer && _G.LocalPlayer.CamBypass && _G.lastTick <= _G.LocalPlayer.CamBypass)) {
            _G.viewport.x = _G.viewport.xTo
        } else {
            // was 0.00001
            let interpolate = (Math.abs(_G.viewport.x - _G.viewport.xTo) / 0.004) * 0.000006 * calcFrame;

            if (_G.viewport.x < _G.viewport.xTo) {
                _G.viewport.x += interpolate;
                if (_G.viewport.x >= _G.viewport.xTo) {
                    _G.viewport.x = _G.viewport.xTo;
                }
            } else if (_G.viewport.x > _G.viewport.xTo) {
                _G.viewport.x -= interpolate;
                if (_G.viewport.x <= _G.viewport.xTo) {
                    _G.viewport.x = _G.viewport.xTo;
                }
            }
        }
    }
    if (_G.viewport.y !== _G.viewport.yTo) {
        if (_G.lastTick <= _G.viewport.loaded || Math.abs(_G.viewport.y - _G.viewport.yTo) > 3000 || (_G.LocalPlayer && _G.LocalPlayer.CamBypass && _G.lastTick <= _G.LocalPlayer.CamBypass)) {
            _G.viewport.y = _G.viewport.yTo
        } else {
            let interpolate = (Math.abs(_G.viewport.y - _G.viewport.yTo) / 0.004) * 0.000006 * calcFrame;

            if (_G.viewport.y < _G.viewport.yTo) {
                _G.viewport.y += interpolate;
                if (_G.viewport.y >= _G.viewport.yTo) {
                    _G.viewport.y = _G.viewport.yTo;
                }
            } else if (_G.viewport.y > _G.viewport.yTo) {
                _G.viewport.y -= interpolate;
                if (_G.viewport.y <= _G.viewport.yTo) {
                    _G.viewport.y = _G.viewport.yTo;
                }
            }
        }
    }


    if (_G.Instance && _G.Instance === 3) {
        if (!_G.WaterX) {
            _G.WaterX = 0;
            _G.WaterY = 0;
            _G.WaterNext = _G.lastTick + randInt(42000, 75000);
            _G.WaterCur = true;
        }
        if (_G.lastTick > _G.WaterNext) {
            _G.WaterCur = !_G.WaterCur;
            _G.WaterNext = _G.lastTick + randInt(42000, 75000);
        }
        _G.WaterY -= 0.1 * (_G.WaterCur ? 1 : -1);
        _G.WaterX -= 1;
        document.body.style.backgroundPosition = (-((_G.viewport.x - _G.WaterX) * _G.viewport.zoom) + (((1 / _G.viewport.zoom) * (_G.canvas.width / 2) * _G.viewport.zoom)) + 'px ') + (-((_G.viewport.y - _G.WaterY) * _G.viewport.zoom) + ((1 / _G.viewport.zoom) * (_G.canvas.height / 2) * _G.viewport.zoom) + 'px');
    } else {
        if (!_G.HideMap) {
            document.body.style.backgroundPosition = (-(_G.viewport.x * _G.viewport.zoom) + (((1 / _G.viewport.zoom) * (_G.canvas.width / 2) * _G.viewport.zoom)) + 'px ') + (-(_G.viewport.y * _G.viewport.zoom) + ((1 / _G.viewport.zoom) * (_G.canvas.height / 2) * _G.viewport.zoom) + 'px');
        }

        if (_G.YTPlayerElem) {
            if (_G.YTFull) {
                let timeSince = _G.lastTick - _G.YTFullAt;
                if (timeSince < 1000) {
                    if (!_G.YTStyle) {
                        _G.YTStyle = {
                            left: parseInt(_G.YTPlayerElem.style.left.replace(/px/gi, '')),
                            top: parseInt(_G.YTPlayerElem.style.top.replace(/px/gi, '')),
                            width: parseInt(_G.YTPlayerElem.style.width.replace(/px/gi, '')),
                            height: parseInt(_G.YTPlayerElem.style.height.replace(/px/gi, ''))
                        };
                    }

                    let timeProg = (timeSince / 1000);
                    let timeProgFlip = 1 - timeProg;

                    _G.YTPlayerElem.style.left = _G.YTStyle.left + (((_G.viewport.x * _G.viewport.zoom) - (1 / _G.viewport.zoom) * (_G.ScrW / 2) - _G.YTStyle.left) * timeProgFlip) + 'px';
                    _G.YTPlayerElem.style.top = _G.YTStyle.top + (((_G.viewport.y * _G.viewport.zoom) - (1 / _G.viewport.zoom) * (_G.ScrH / 2) - _G.YTStyle.top) * timeProgFlip) + 'px';
                    _G.YTPlayerElem.style.width = (_G.YTStyle.width + ((_G.ScrW - _G.YTStyle.width) * timeProg)) + 'px';
                    _G.YTPlayerElem.style.height = (_G.YTStyle.height + ((_G.ScrH - _G.YTStyle.height) * timeProg)) + 'px';
                } else {
                    _G.YTPlayerElem.style.left = '0';
                    _G.YTPlayerElem.style.top = '0';
                    _G.YTPlayerElem.style.width = '100%';
                    _G.YTPlayerElem.style.height = '100%';
                }
            } else {
                _G.YTPlayerElem.style.left = (-(_G.viewport.x * _G.viewport.zoom) + (((1 / _G.viewport.zoom) * (_G.canvas.width / 2) * _G.viewport.zoom)) + (_G.YTPos[0] * _G.viewport.zoom) + 'px ');
                _G.YTPlayerElem.style.top = (-(_G.viewport.y * _G.viewport.zoom) + ((1 / _G.viewport.zoom) * (_G.canvas.height / 2) * _G.viewport.zoom) + (_G.YTPos[1] * _G.viewport.zoom) + 'px');
                _G.YTPlayerElem.style.width = _G.viewport.zoom * 178 + 'px';
                _G.YTPlayerElem.style.height = _G.viewport.zoom * 100 + 'px';

                if (_G.YTStyle) {
                    _G.YTStyle = undefined;
                }
            }
        }
        /*
    document.getElementById('youtube').style.left = (-(_G.viewport.x*_G.viewport.zoom)+(((1/_G.viewport.zoom)*(_G.canvas.width/2)*_G.viewport.zoom)) + 'px ');
    document.getElementById('youtube').style.top = (-(_G.viewport.y*_G.viewport.zoom) + ((1/_G.viewport.zoom)*(_G.canvas.height/2)*_G.viewport.zoom) + 'px');
    document.getElementById('youtube').style.width = _G.viewport.zoom*533 + 'px';
    document.getElementById('youtube').style.height = _G.viewport.zoom*300 + 'px';
    */
    }

    if (!_G.HideMap) {
        document.body.style.backgroundSize = _G.viewport.zoom * 30 + '%';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── Cache per-frame viewport constants once outside the entity loop ──────
    // Avoids recomputing these 8+ times per entity every frame (big win on Firefox).
    let _rvx = _G.viewport.x * _G.viewport.zoom;
    let _rvy = _G.viewport.y * _G.viewport.zoom;
    let _rcx = canvas.width * 0.5;
    let _rcy = canvas.height * 0.5;
    let _rvz = _G.viewport.zoom;
    let _rvHW = _G.canvas.width * 0.5 * (1 / _rvz);   // half-viewport width in world units
    let _rvHH = _G.canvas.height * 0.5 * (1 / _rvz);  // half-viewport height in world units

    for (var i = 0; i < _G.ents.RenderOrder.length; i++) {
        let ent = _G.ents.RenderOrder[i],
            parts = ent.parts;

        if (ent.class === 'map' && _G.HideMap) {
            continue;
        }

        if (ent.DontRender) {
            continue;
        }

        if (!ent.AlwaysRender &&
            ((ent.pos[0] + ent.bbox[0] + ent.bbox[2]) < _G.viewport.x - _rvHW - 100 || (ent.pos[0]) > _G.viewport.x + _rvHW + 160 || (ent.pos[1] + ent.bbox[1] + ent.bbox[3]) < _G.viewport.y - _rvHH - 160 || (ent.pos[1]) > _G.viewport.y + _rvHH + 160) &&
            (!ent.posTo || (ent.posTo[0] + ent.bbox[0] + ent.bbox[2]) < _G.viewport.x - _rvHW - 100 || (ent.posTo[0]) > _G.viewport.x + _rvHW + 160 || (ent.posTo[1] + ent.bbox[1] + ent.bbox[3]) < _G.viewport.y - _rvHH - 160 || (ent.posTo[1]) > _G.viewport.y + _rvHH + 160)

        ) {
            continue;
        }

        if (typeof ent.alpha !== 'undefined') {
            ctx.globalAlpha = ent.alpha;
        }
        ctx.save();

        // Todo: Make things outside the render _G.viewport not render

        /*
        if (ent.pos[0] < _G.viewport.x-(640*_G.viewport.zoom) || ent.pos[0] < _G.viewport.y-(640*_G.viewport.zoom)) {
            continue;
        }
        */

        if (typeof ent.posTo !== 'undefined') {
            // ── Snapshot-based entity interpolation (Source cl_interp equivalent) ──
            // Lerp from _posFrom → posTo over 100 ms (covers ≤ one dropped update).
            // If destination is too far it was a teleport — snap immediately.
            let _now = Date.now();
            let _elapsed = (_now - (ent._posToAt || _now));
            let _t = Math.min(1, _elapsed / 100);
            let _fx = (ent._posFrom) ? ent._posFrom[0] : ent.pos[0];
            let _fy = (ent._posFrom) ? ent._posFrom[1] : ent.pos[1];
            let _dxI = ent.posTo[0] - _fx;
            let _dyI = ent.posTo[1] - _fy;
            let _dist = Math.abs(_dxI) + Math.abs(_dyI);

            if (_dist > 300) {
                // Teleport: too far to interpolate (spawn, respawn, teleport item)
                ent.pos[0] = ent.posTo[0];
                ent.pos[1] = ent.posTo[1];
                ent.posTo = undefined;
                ent._posFrom = undefined;
            } else {
                // Ease-out quad for smoother deceleration at arrival
                let _tEase = 1 - (1 - _t) * (1 - _t);
                ent.pos[0] = _fx + _dxI * _tEase;
                ent.pos[1] = _fy + _dyI * _tEase;
                if (_t >= 1) {
                    ent.pos[0] = ent.posTo[0];
                    ent.pos[1] = ent.posTo[1];
                    ent.posTo = undefined;
                    ent._posFrom = undefined;
                }
            }
        }

        // ── Source cl_smooth equivalent ─────────────────────────────────────
        // Apply the accumulated server position correction (_posCorrect) as a
        // smooth additive impulse: 35 % per render frame (≈ 115 ms to 95 %
        // resolved at 60 fps). This is non-reverting — pos never snaps backward,
        // so the camera and animation stay visually continuous.
        if (ent === _G.LocalPlayer && ent._posCorrect) {
            // Bleed at 18 %/frame (≈ 250 ms to 95 % resolved at 60 fps) — slower
            // than before to eliminate the visible camera lurch when corrections
            // arrive at different magnitudes across successive server updates.
            let _ca = Math.min(0.18, 0.18 * calcFrame / 16);
            ent.pos[0] += ent._posCorrect[0] * _ca;
            ent.pos[1] += ent._posCorrect[1] * _ca;
            ent._posCorrect[0] *= (1 - _ca);
            ent._posCorrect[1] *= (1 - _ca);
            if (Math.abs(ent._posCorrect[0]) < 0.2 && Math.abs(ent._posCorrect[1]) < 0.2) {
                ent._posCorrect = undefined;
            }
        }

        if (typeof ent.rotateTo !== 'undefined' && ent.rotate !== ent.rotateTo) {
            if (ent.rotateTo > ent.rotate) {
                ent.rotate += 0.0008 * calcFrame;
                if (ent.rotateTo < ent.rotate) {
                    ent.rotate = ent.rotateTo;
                }
            } else if (ent.rotateTo < ent.rotate) {
                ent.rotate -= 0.0008 * calcFrame;
                if (ent.rotateTo > ent.rotate) {
                    ent.rotate = ent.rotateTo;
                }
            }

        }


        if (typeof ent.Notify !== 'undefined') {
            ctx.save();
            ctx.translate(-_rvx + _rcx, -_rvy + _rcy);
            ctx.scale(_rvz, _rvz);

            ctx.globalAlpha = 0.95;

            ctx.font = 'bold 16px "Open Sans"';
            let notifyWidth = ctx.measureText(ent.Notify).width,
                notifyY = 9 + (typeof ent.invOpen !== 'undefined' ? -16 : (ent.craftOpen ? -24 : 0));

            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(0,0,0,0.6)';
            ctx.strokeText(ent.Notify, ent.pos[0] + ent.bbox[2] + 7, ent.pos[1] + notifyY);
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText(ent.Notify, ent.pos[0] + ent.bbox[2] + 7, ent.pos[1] + notifyY);

            if (typeof ent.alpha !== 'undefined') {
                ctx.globalAlpha = ent.alpha;
            } else {
                ctx.globalAlpha = 1;
            }

            ctx.restore();
        }

        // ── HIT FLASH: red overlay when entity was recently damaged ─────────
        // HitFlash holds a future timestamp (Date.now() + 260) set on damage.
        // While HitFlash > now, we overlay a semi-transparent red rect scaled
        // to the entity bbox, giving clear feedback on both players and NPCs.
        // AttackWarnFlash uses orange to telegraph an incoming NPC strike.
        /*IF_CLIENT*/
        if (ent.HitFlash && Date.now() < ent.HitFlash) {
            let _hfAlpha = Math.min(0.45, 0.45 * (ent.HitFlash - Date.now()) / 200);
            let _hfColor = ent.AttackWarnFlash ? '#ff8800' : '#ff2222';
            ctx.save();
            ctx.translate(-_rvx + _rcx, -_rvy + _rcy);
            ctx.scale(_rvz, _rvz);
            ctx.globalAlpha = _hfAlpha;
            ctx.fillStyle   = _hfColor;
            ctx.fillRect(ent.pos[0] + ent.bbox[0], ent.pos[1] + ent.bbox[1], ent.bbox[2], ent.bbox[3]);
            ctx.restore();
        }
        /*IF_END*/

        // Nametag is drawn in a dedicated second pass (after all entity bodies)
        // to ensure it always renders above everything.

        ctx.restore();


        /*
                        if (ent.RotateWep) {
                        ent.RotateWep = undefined;
                        ent.RotateWepUndo = _G.lastTick+300;
                        if (!ent.rotateTo) {
                            ent.rotateTo = ent.rotate;
                        }
                        ent.rotateTo += angleToRadians(ent.RotateAm*11);
                        } else if (ent.RotateWepUndo && ent.RotateWepUndo >= _G.lastTick) {
                        ent.RotateWepUndo = undefined;
                        ent.rotateTo -= angleToRadians(ent.RotateAm*11);
                        }
                        */

        ctx.save();
        if (typeof ent.noShadow === 'undefined') {
            let W = ent.pos[0] * _rvz + ent.bbox[0] * _rvz + ent.bbox[2] * .5 * _rvz - _rvx + _rcx,
                H = ent.pos[1] * _rvz + ent.bbox[1] * _rvz + ent.bbox[3] * .5 * _rvz - _rvy + _rcy;

            ctx.setTransform(1, 0, 0, 1, W, H);
            if (typeof ent.rotate !== 'undefined' && ent.rotate !== 0) {
                ctx.rotate(ent.rotate);
            }

            ctx.scale(_rvz, _rvz);

            ctx.fillStyle = 'rgba(0,0,0,0.3)';

            if (typeof ent.Driving !== 'undefined') {
                ctx.fillStyle = 'rgba(0,0,0,0.0)';
            }

            drawEllipse(ctx, -ent.bbox[2] * .5 - 10, ent.bbox[3] * .5 - 8, ent.bbox[2] + 20, 11);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        //ctx.restore();

        ctx.save();
        //ctx.translate(ent.pos[0], ent.pos[1]);

        if (typeof ent.rotate !== 'undefined' && ent.rotate !== 0) {
            //ctx.translate(ent.bbox[2]*.5 + ent.bbox[0], ent.bbox[3]*.5 + ent.bbox[1]);
            ctx.setTransform(1, 0, 0, 1,
                ent.pos[0] * _rvz + ent.bbox[2] * .5 * _rvz + ent.bbox[0] * _rvz - _rvx + _rcx,
                ent.pos[1] * _rvz + ent.bbox[3] * .5 * _rvz + ent.bbox[1] * _rvz - _rvy + _rcy
            );
            //ctx.translate(ent.pos[0] + ent.bbox[2]*.5, ent.pos[1] + ent.bbox[3]*.5);

            ctx.rotate(ent.rotate);

            ctx.translate(-ent.bbox[2] * .5 * _rvz - ent.bbox[0] * _rvz, -ent.bbox[3] * .5 * _rvz - ent.bbox[1] * _rvz)
            //ctx.setTransform(1,0,0,1,ent.pos[0] + ent.bbox[0], ent.pos[1] + ent.bbox[1]);
            //ctx.translate(-(ent.bbox[2]*.5 + ent.bbox[0]), -(ent.bbox[3]*.5 + ent.bbox[1]));
        } else {

            ctx.setTransform(1, 0, 0, 1,
                ent.pos[0] * _rvz - _rvx + _rcx,
                ent.pos[1] * _rvz - _rvy + _rcy
            );
        }

        ctx.scale(_rvz, _rvz);

        if (typeof ent.Driving === 'undefined' && (typeof ent.Owner !== 'object' || !_G.wep.List[ent.class] || typeof ent.Owner.Driving === 'undefined')) {

            for (var k = 0; k < parts.length; k++) {
                ctx.save();
                if (typeof parts[k].fillStyle !== 'undefined') {
                    ctx.fillStyle = parts[k].fillStyle;
                }
                /*
                ctx.shadowOffsetX = 7;
                ctx.shadowOffsetY = 7;
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 26;
                        */
                let part = parts[k];
                if (parts[k].type === 'fillRect') {
                    ctx[parts[k].type](parts[k].x, parts[k].y, parts[k].w, parts[k].h);
                } else if (parts[k].type === 'fillCircle') {
                    drawEllipse(ctx, parts[k].x, parts[k].y, parts[k].w, parts[k].h);
                } else if (parts[k].type === 'fillStyle') {
                    ctx.fillStyle = parts[k].value;
                } else if (parts[k].type === 'drawImg') {
                    if (typeof parts[k].rotate !== 'undefined') {
                        if (typeof parts[k].interpOffset === 'object') {
                            drawImg(parts[k].img, parts[k].x + ent.interpDir * (ent.interpDir < 0 ? parts[k].interpOffset[0] : parts[k].interpOffset[1]), parts[k].y, parts[k].w, parts[k].h, ent.interpDir, parts[k].rotate);
                        } else {
                            drawImg(parts[k].img, parts[k].x, parts[k].y, parts[k].w, parts[k].h, ent.interpDir, parts[k].rotate);
                        }
                    } else {
                        ctx[parts[k].type](parts[k].img, parts[k].x, parts[k].y, parts[k].w, parts[k].h);
                    }
                }
                ctx.restore();
            }

            if (ent.Hammering || ent.Moving) {
                ctx.fillStyle = 'rgba(0,255,0,0.5)';
                ctx['fillRect'](ent.bbox[0] - 2, ent.bbox[1] - 2, ent.bbox[2] + 4, ent.bbox[3] + 4);
            }

        }

        if (typeof ent.Draw === 'function') {
            ent.Draw(ctx);
        }

        if (ent.itemAm && ent.itemAm > 1 && !_G.ents.Debug) {
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            if (ent.class === 'bug_token') {
                ctx.font = 'bold 26px "Open Sans"';

                ctx.strokeStyle = 'rgba(0,0,0.6)';
                ctx.strokeText(ent.itemAm, ent.bbox[2] * .5 - ((ent.itemAm + '').length * 9), ent.bbox[3] * .5 + 10);

                ctx.fillText(ent.itemAm, ent.bbox[2] * .5 - ((ent.itemAm + '').length * 9), ent.bbox[3] * .5 + 10);
            } else {
                ctx.font = 'bold 14px "Open Sans"';
                ctx.fillText(ent.itemAm, 0, 0);
            }
        }

        if (_G.ents.Debug) {
            if (typeof ent.Owner === 'string') {
                ctx.font = 'bold 16px "Open Sans"';
                ctx.fillStyle = 'rgba(0,255,0,1)';
                ctx.fillText(_G.ents.All.indexOf(ent) + ' ' + ent.Owner, 0, 0);
            } else {
                ctx.font = 'bold 16px "Open Sans"';
                ctx.fillStyle = 'rgba(0,255,0,1)';
                ctx.fillText(_G.ents.All.indexOf(ent) + '', 0, 0);
            }


            if (typeof ent.Health !== 'undefined') {
                ctx.font = 'bold 14px "Open Sans"';
                ctx.fillStyle = 'rgba(0,255,0,1)';
                ctx.fillText(ent.Health + '/' + (typeof ent.HealthMax !== 'undefined' ? ent.HealthMax : '?') + 'hp', 0, 18);
            }
			
            if (typeof ent.speedMultiplier !== 'undefined') {
                ctx.font = 'bold 17px "Open Sans"';
                ctx.fillStyle = 'rgba(0,255,0,1)';
                ctx.fillText(ent.speedMultiplier, 4, 31);
            }
        }

        ctx.restore();


        if (typeof ent.Health !== 'undefined' && !ent.HealthHidden && ent.Health > 0 && (ent.class === 'player' || (ent.LastDamage && _G.lastTick - ent.LastDamage < 3000))) {
            if (typeof ent.Client.HealthDisplay === 'undefined') {
                ent.Client.HealthDisplay = ent.Health;
            }

            if (ent.Client.HealthDisplay < ent.Health) {
                ent.Client.HealthDisplay += 2;

                if (ent.Client.HealthDisplay > ent.Health) {
                    ent.Client.HealthDisplay = ent.Health;
                }
            } else if (ent.Client.HealthDisplay > ent.Health) {
                ent.Client.HealthDisplay -= 2;

                if (ent.Client.HealthDisplay < ent.Health) {
                    ent.Client.HealthDisplay = ent.Health;
                }
            }

            ctx.save();
            ctx.translate(-_G.viewport.x * _G.viewport.zoom + (canvas.width * .5), -_G.viewport.y * _G.viewport.zoom + (canvas.height * .5));
            ctx.scale(_G.viewport.zoom, _G.viewport.zoom);

            ctx.globalAlpha = typeof ent.HealthAlpha !== 'undefined' ? ent.HealthAlpha : 0.6;

            let xPos = ent.pos[0] - 11 + ent.bbox[0] + (typeof ent.HealthX === 'number' ? ent.HealthX : 0),
                yPos = ent.pos[1] + ent.bbox[1] - 51 + (typeof ent.HealthY === 'number' ? ent.HealthY : 0);

            ctx.fillStyle = '#000';
            ctx['fillRect'](xPos, yPos, typeof ent.HealthSize !== 'undefined' ? ent.HealthSize : ent.bbox[2] + 22, 15);

            let healthPercent = (ent.Client.HealthDisplay / ent.HealthMax);
            if (healthPercent > 1) {
                healthPercent = 1;
            } else if (healthPercent < 0) {
                healthPercent = 0;
            }

            ctx.fillStyle = '#0f0';
            ctx['fillRect'](xPos + 1, yPos + 1, Math.round((typeof ent.HealthSize !== 'undefined' ? ent.HealthSize - 2 : ent.bbox[2] + 20) * healthPercent), 13);

            if (typeof ent.alpha !== 'undefined') {
                ctx.globalAlpha = ent.alpha;
            } else {
                ctx.globalAlpha = 1;
            }

            let barW = Math.round((typeof ent.HealthSize !== 'undefined' ? ent.HealthSize : ent.bbox[2] + 20) * healthPercent);
            ctx.font = 'bold 15px "Open Sans"';
            ctx.fillStyle = typeof ent.HealthText !== 'undefined' ? ent.HealthText : 'rgba(255,255,255,0.9)';
            ctx.textAlign = "center";
            ctx.fillText(ent.Health, xPos + Math.round(barW * .5), yPos + 13);


            ctx.restore();
        }




        if (_G.renderBBox !== 0 && typeof ent.bbox === 'object') {

            ctx.save();

            if (typeof ent.rotate !== 'undefined' && ent.rotate !== 0) {
                //ctx.translate(ent.bbox[2]*.5 + ent.bbox[0], ent.bbox[3]*.5 + ent.bbox[1]);
                ctx.setTransform(1, 0, 0, 1,
                    ent.pos[0] * _G.viewport.zoom + ent.bbox[2] * .5 * _G.viewport.zoom + ent.bbox[0] * _G.viewport.zoom - _G.viewport.x * _G.viewport.zoom + (canvas.width * .5),
                    ent.pos[1] * _G.viewport.zoom + ent.bbox[3] * .5 * _G.viewport.zoom + ent.bbox[1] * _G.viewport.zoom - _G.viewport.y * _G.viewport.zoom + (canvas.height * .5)
                );
                //ctx.translate(ent.pos[0] + ent.bbox[2]*.5, ent.pos[1] + ent.bbox[3]*.5);

                ctx.rotate(ent.rotate);

                ctx.translate(-ent.bbox[2] * .5 * _G.viewport.zoom - ent.bbox[0] * _G.viewport.zoom, -ent.bbox[3] * .5 * _G.viewport.zoom - ent.bbox[1] * _G.viewport.zoom)
                //ctx.setTransform(1,0,0,1,ent.pos[0] + ent.bbox[0], ent.pos[1] + ent.bbox[1]);
                //ctx.translate(-(ent.bbox[2]*.5 + ent.bbox[0]), -(ent.bbox[3]*.5 + ent.bbox[1]));
            } else {

                ctx.setTransform(1, 0, 0, 1,
                    ent.pos[0] * _G.viewport.zoom - _G.viewport.x * _G.viewport.zoom + (canvas.width * .5),
                    ent.pos[1] * _G.viewport.zoom - _G.viewport.y * _G.viewport.zoom + (canvas.height * .5)
                );
            }

            ctx.scale(_G.viewport.zoom, _G.viewport.zoom);

            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(0,255,0,1)';

            ctx.strokeRect(0, 0, 3, 3);

            ctx.lineWidth = 2;
            if (ent.colliding && ent.colliding.length > 0) {

                ctx.strokeStyle = 'rgba(255,0,0,0.45)';
            } else {
                ctx.strokeStyle = 'rgba(0,255,0,0.45)';
            }

            if (typeof ent.bboxs === 'object' && _G.renderBBox !== 2) {
                for (var k = 0; k < ent.bboxs.length; k++) {
                    let bbox = ent.bboxs[k];

                    //ctx.setTransform(1,bbox[0],bbox[1],1,bbox[2],bbox[3])
                    if (bbox[0] !== 0 || bbox[1] !== 0) {
                        //ctx.translate(bbox[0], bbox[1]);
                    }
                    //ctx.strokeRect(0, 0, bbox[2], bbox[3]);
                    ctx.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);
                    if (bbox[0] !== 0 || bbox[1] !== 0) {
                        //ctx.translate(-bbox[0], -bbox[1]);
                    }
                    //ctx.setTransform(1,0,0,1,0,0);
                }
            } else {
                if (ent.bbox[0] !== 0 || ent.bbox[1] !== 0) {
                    //ctx.translate(ent.bbox[0], ent.bbox[1]);
                }
                ctx.strokeRect(ent.bbox[0], ent.bbox[1], ent.bbox[2], ent.bbox[3]);
                if (ent.bbox[0] !== 0 || ent.bbox[1] !== 0) {
                    //ctx.translate(-ent.bbox[0], -ent.bbox[1]);
                }
            }

            ctx.restore();
        }

        ctx.restore();

        if (typeof ent.alpha !== 'undefined') {
            ctx.globalAlpha = 1;
        }

    }

    // ── NAMETAG SECOND PASS ──────────────────────────────────────────────────
    // Render all nametags after all entity bodies so they always appear on top.
    {
        ctx.save();
        ctx.translate(-_rvx + _rcx, -_rvy + _rcy);
        ctx.scale(_rvz, _rvz);
        ctx.shadowBlur = 0; // no shadow = much faster (especially on Firefox)

        for (let _ni = 0; _ni < _G.ents.RenderOrder.length; _ni++) {
            let _ne = _G.ents.RenderOrder[_ni];
            if (typeof _ne.nametag === 'undefined' || _ne.ShouldRemove || _ne.DontRender) continue;
            if (typeof _ne.alpha !== 'undefined') ctx.globalAlpha = _ne.alpha;

            // Y: 8px above the top edge of the bounding box
            let _ntY = _ne.pos[1] + _ne.bbox[1] - 8;
            // X: horizontally centred on the bounding box
            let _ntCX = _ne.pos[0] + _ne.bbox[0] + _ne.bbox[2] * 0.5;

            ctx.font = 'bold 16px "Open Sans Condensed", sans-serif';
            let _nw = ctx.measureText(_ne.nametag).width;

            // Dark pill background for readability
            let _padX = 5, _padY = 2;
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.beginPath();
            let _rx = _ntCX - _nw * 0.5 - _padX;
            let _ry = _ntY - 15;
            let _rw = _nw + _padX * 2;
            let _rh = 18;
            ctx.roundRect ? ctx.roundRect(_rx, _ry, _rw, _rh, 4) : ctx.rect(_rx, _ry, _rw, _rh);
            ctx.fill();

            // Stroke outline for legibility without shadowBlur
            ctx.strokeStyle = 'rgba(0,0,0,0.8)';
            ctx.lineWidth = 3;
            ctx.strokeText(_ne.nametag, _ntCX - _nw * 0.5, _ntY);
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.lineWidth = 1;
            ctx.fillText(_ne.nametag, _ntCX - _nw * 0.5, _ntY);

            // Level / title line
            if ((_ne.class !== 'player' && _ne.title) || _ne.lvl) {
                ctx.font = 'bold 12px "Open Sans", sans-serif';
                let _lvlTxt = (_ne.class !== 'player' && _ne.title) ? _ne.title : ('LVL ' + (_ne.lvl || 3));
                if (_ne.username === 'turdferguson') _lvlTxt = '🦚🐡🦚🐡';
                let _lw = ctx.measureText(_lvlTxt).width;
                ctx.strokeStyle = 'rgba(0,0,0,0.8)';
                ctx.lineWidth = 2.5;
                ctx.strokeText(_lvlTxt, _ntCX - _lw * 0.5, _ntY + 15);
                ctx.fillStyle = (_ne.username === 'turdferguson') ? 'rgba(255,50,50,0.95)' : 'rgba(220,220,255,0.92)';
                ctx.fillText(_lvlTxt, _ntCX - _lw * 0.5, _ntY + 15);
            }

            // Chat bubbles
            if (typeof _ne.username !== 'undefined' && typeof _G.chats[_ne.username] === 'object') {
                ctx.font = 'bold 14px "Open Sans", sans-serif';
                for (let _ci = (_G.chats[_ne.username].length - 1); _ci >= 0; _ci--) {
                    let _chat = _G.chats[_ne.username][_ci];
                    let _chatW = ctx.measureText(_chat.message).width;
                    let _gotoY = (14 * (_G.chats[_ne.username].length - _ci)) + 32;
                    if (_chat.posY < _gotoY) _chat.posY += 0.5;
                    else if (_chat.posY > _gotoY) _chat.posY -= 0.5;
                    if (_chat.scaleY < 1) _chat.scaleY += 0.05;
                    let _dn = Date.now(), _fi = 1;
                    if (_dn > _chat.fade_at) {
                        let _fo = 1 - (_dn - _chat.fade_at) / 300;
                        if (_fo <= 0) { _G.chats[_ne.username].splice(_ci, 1); continue; }
                        _fi = _fo;
                    } else if (_dn < _chat.fade_in) {
                        _fi = 1 - (_chat.fade_in - _dn) / 330;
                    }
                    ctx.fillStyle = 'rgba(255,255,255,' + (_fi * 0.85) + ')';
                    ctx.strokeStyle = 'rgba(0,0,0,' + (_fi * 0.7) + ')';
                    ctx.lineWidth = 2.5;
                    let _chatY = _ne.pos[1] + _ne.bbox[1] - 22 - _chat.posY;
                    ctx.strokeText(_chat.message, _ntCX - _chatW * 0.5, _chatY);
                    ctx.fillText(_chat.message, _ntCX - _chatW * 0.5, _chatY);
                }
            }

            if (typeof _ne.alpha !== 'undefined') ctx.globalAlpha = 1;
        }
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    // ── END NAMETAG SECOND PASS ──────────────────────────────────────────────

    // ══ BUILD MENU HUD CARDS ══════════════════════════════════════════════════
    // Shows for any player holding a hammer with a BuildMenuPiece selected.
    // Displays: category tab, piece name with arrow indicators, per-resource
    // costs coloured green (have enough) / red (missing), and key hints.
    // ─────────────────────────────────────────────────────────────────────────
    /*IF_CLIENT*/
    for (let _bi = 0; _bi < _G.ents.RenderOrder.length; _bi++) {
        let _be = _G.ents.RenderOrder[_bi];
        if (_be.class !== 'player') continue;
        if (!_be.ActiveWeapon || _be.ActiveWeapon.class !== 'hammer') continue;
        if (!_be.BuildMenuPiece) continue;

        // World → screen
        let _bsx = (_be.pos[0] + _be.bbox[0] + _be.bbox[2] * 0.5) * _rvz - _rvx + _rcx;
        let _bsy = (_be.pos[1] + _be.bbox[1]) * _rvz - _rvy + _rcy - 14;

        let _bname    = (_G._bmPieceNames && _G._bmPieceNames[_be.BuildMenuPiece]) ? _G._bmPieceNames[_be.BuildMenuPiece] : _be.BuildMenuPiece;
        let _bcatName = (_G._bmCatNames   && _G._bmCatNames[_be.BuildMenuPiece])   ? _G._bmCatNames[_be.BuildMenuPiece]   : '';
        let _brecipe  = _G.buildRecipes && _G.buildRecipes[_be.BuildMenuPiece];

        // Build per-resource text + colour check (only possible for local player)
        let _costLines = [];
        if (_brecipe) {
            for (let _ri = 0; _ri < _brecipe.length; _ri++) {
                let _r = _brecipe[_ri];
                let _have = 0;
                if (_be === _G.LocalPlayer && _be.inv) {
                    for (let _ii = 0; _ii < _be.inv.length; _ii++) {
                        if (_be.inv[_ii].item === _r.item) { _have = _be.inv[_ii].am; break; }
                    }
                }
                let _iname = (_G.items[_r.item] && _G.items[_r.item].name) ? _G.items[_r.item].name : _r.item;
                _costLines.push({ text: _r.am + '\u00d7' + _iname, have: _have >= _r.am });
            }
        }

        let _bhintStr  = 'E: cycle \u2502 SHIFT+E: cat \u2502 V: build \u2502 V\u00d7 select';
        let _btext     = '\u25c4 ' + _bname + ' \u25ba';

        ctx.save();
        ctx.font = 'bold 12px monospace';
        let _btextW   = ctx.measureText(_btext).width;
        ctx.font      = '9px sans-serif';
        let _bhintW   = ctx.measureText(_bhintStr).width;
        let _bcatW    = _bcatName ? ctx.measureText(_bcatName.toUpperCase()).width + 14 : 0;
        let _maxCostW = 0;
        for (let _ri = 0; _ri < _costLines.length; _ri++) {
            ctx.font = '10px sans-serif';
            let _cw = ctx.measureText(_costLines[_ri].text).width;
            if (_cw > _maxCostW) _maxCostW = _cw;
        }
        let _bw   = Math.max(_btextW + 16, _bhintW + 12, _maxCostW + 24, _bcatW + 16, 140);
        let _bh   = 22 + (_costLines.length > 0 ? _costLines.length * 13 + 4 : 0) + 14;
        let _brx  = Math.round(_bsx - _bw * 0.5);
        let _bry  = Math.round(_bsy - _bh - 4);
        let _br   = 6;

        // ── background pill ──
        ctx.beginPath();
        ctx.moveTo(_brx + _br, _bry);
        ctx.lineTo(_brx + _bw - _br, _bry);
        ctx.arcTo(_brx + _bw, _bry,      _brx + _bw, _bry + _br,      _br);
        ctx.lineTo(_brx + _bw, _bry + _bh - _br);
        ctx.arcTo(_brx + _bw, _bry + _bh, _brx + _bw - _br, _bry + _bh, _br);
        ctx.lineTo(_brx + _br, _bry + _bh);
        ctx.arcTo(_brx, _bry + _bh,      _brx, _bry + _bh - _br,      _br);
        ctx.lineTo(_brx, _bry + _br);
        ctx.arcTo(_brx, _bry,            _brx + _br, _bry,             _br);
        ctx.closePath();
        ctx.fillStyle   = 'rgba(8,8,16,0.88)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,165,0,0.85)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        // ── category badge (top) ──
        if (_bcatName) {
            ctx.font      = 'bold 8px sans-serif';
            ctx.fillStyle = 'rgba(255,165,0,0.75)';
            ctx.fillText(_bcatName.toUpperCase(), _bsx, _bry + 8);
        }

        // ── piece name ──
        ctx.font      = 'bold 12px monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText(_btext, _bsx, _bry + (_bcatName ? 20 : 12));

        // ── resource costs (green = have, red = need) ──
        let _costStartY = _bry + (_bcatName ? 32 : 24);
        for (let _ri = 0; _ri < _costLines.length; _ri++) {
            ctx.font      = '10px sans-serif';
            ctx.fillStyle = _costLines[_ri].have ? 'rgba(100,230,100,0.95)' : 'rgba(255,90,90,0.95)';
            ctx.fillText(_costLines[_ri].text, _bsx, _costStartY + _ri * 13);
        }

        // ── hint bar ──
        ctx.font      = '8px sans-serif';
        ctx.fillStyle = 'rgba(160,160,160,0.65)';
        ctx.fillText(_bhintStr, _bsx, _bry + _bh - 7);

        ctx.restore();
    }
    // ── END BUILD MENU HUD CARDS ─────────────────────────────────────────────
    /*IF_END*/

    for (var i = 0; i < _G.ents.All.length; i++) {
        if (typeof _G.ents.All[i].invOpen !== 'undefined') {
            ctx.save();

            let ply = _G.ents.All[i];
            ctx.translate(-_G.viewport.x * _G.viewport.zoom + (canvas.width * .5), -_G.viewport.y * _G.viewport.zoom + (canvas.height * .5));
            ctx.scale(_G.viewport.zoom, _G.viewport.zoom);

            let invW = 90,
                invX = 0,
                invY = ply.pos[1],
                txtOffset = 0;

            if ((ply.pos[1] + ply.bbox[1] + ply.bbox[3] + 40) > _G.viewport.y + (_G.canvas.height * .5 * (1 / _G.viewport.zoom))) {

                if (_G.viewport.zoom < 1.7) {
                    invY -= 94 * (1.7 - _G.viewport.zoom);
                } else {
                    invY -= 30;
                }
            }

            let invFont = 14
            if (_G.viewport.zoom < 1.7) {
                invW = invW * (1 + (1.7 - _G.viewport.zoom))
                invFont = (14 + Math.round((1.7 - _G.viewport.zoom) * 18));
                ctx.font = 'bold ' + invFont + 'px "Open Sans"';
            } else {
                ctx.font = 'bold 14px "Open Sans"';
            }

            if (typeof _G.playerData[ply.Owner] === 'object' && _G.playerData[ply.Owner].lastDir === 'L') {
                invX = ply.pos[0] - invW - 5;
                txtOffset = -invW - 4;
                ctx.textAlign = 'right';
            } else {
                invX = ply.pos[0] + ply.bbox[0] + ply.bbox[2] + 6;
            }

            let slotSize = Math.round(invW / 3) - 1

            ctx.fillStyle = 'rgba(0,0,0,0.5)'
            ctx.fillRect(invX, invY, invW + 1, invW + 1);



            let currency = 'charms';
            if (ply.container && ply.container.Currency && typeof ply.invSlot !== 'undefined' && typeof ply.inv[ply.invSlot] === 'object' && typeof ply.container.Currency[ply.inv[ply.invSlot].item] !== 'undefined') {
                currency = ply.container.Currency[ply.inv[ply.invSlot].item];
            }


            ctx.lineWidth = 3;

            if (typeof ply.invSlot !== 'undefined' && typeof ply.inv[ply.invSlot] === 'object' && (!ply.container || !ply.container.StoreItems || typeof ply.container.StoreItems[ply.inv[ply.invSlot].item] !== 'undefined') && (!ply.container || !ply.container.BuyItems || typeof ply.container.BuyItems[ply.inv[ply.invSlot].item] !== 'undefined')) {
                ctx.strokeText(_G.items[ply.inv[ply.invSlot].item].name, invX + invW + 1 + txtOffset, invY + invFont - 1);

                // Show item description if it has one
                let invDescLines = 0;
                if (_G.items[ply.inv[ply.invSlot].item].desc && !ply.container) {
                    ctx.strokeText(_G.items[ply.inv[ply.invSlot].item].desc, invX + invW + 1 + txtOffset, invY + invFont * 2 + 1);
                    invDescLines = 1;
                }

                ctx.strokeText(ply.container ? (ply.container.BuyItems ? ('[E] Sell for ' + ply.container.BuyItems[ply.inv[ply.invSlot].item] + (currency !== 'charms' ? ' ' + _G.items[currency].name : '')) : '[E] Stash 1') : '[G] Drop', invX + invW + 1 + txtOffset, invY + invFont * (2 + invDescLines) + 1);

                if (ply.container && !ply.container.BuyItems && ply.inv[ply.invSlot].am >= 5) {
                    ctx.strokeText('[G] Stash 5', invX + invW + 1 + txtOffset, invY + invFont * (3 + invDescLines) + 1);
                } else if (!ply.container && typeof _G.items[ply.inv[ply.invSlot].item].Use === 'function') {
                    ctx.strokeText('[E] ' + (typeof _G.items[ply.inv[ply.invSlot].item].UseName !== 'undefined' ? _G.items[ply.inv[ply.invSlot].item].UseName : 'Use'), invX + invW + 1 + txtOffset, invY + invFont * (3 + invDescLines) + 1);
                }

                if (ply.container && !ply.container.BuyItems) {
                    ctx.strokeText('[Space] All', invX + invW + 1 + txtOffset, invY + invFont * (ply.inv[ply.invSlot].am >= 5 ? (4 + invDescLines) : (3 + invDescLines)) + 1);
                } else if (!ply.container && typeof _G.wep.List[ply.inv[ply.invSlot].item] === 'object') {
                    ctx.strokeText('[Space] Equip', invX + invW + 1 + txtOffset, invY + invFont * (typeof _G.items[ply.inv[ply.invSlot].item].Use === 'function' ? (4 + invDescLines) : (3 + invDescLines)) + 1);
                }
            }

            ctx.strokeText('[C] Close Inv', invX + invW + txtOffset, invY + invW - 10);

            ctx.fillStyle = 'rgba(255,255,255,0.8)';

            if (typeof ply.invSlot !== 'undefined' && typeof ply.inv[ply.invSlot] === 'object' && (!ply.container || !ply.container.StoreItems || typeof ply.container.StoreItems[ply.inv[ply.invSlot].item] !== 'undefined') && (!ply.container || !ply.container.BuyItems || typeof ply.container.BuyItems[ply.inv[ply.invSlot].item] !== 'undefined')) {
                ctx.fillText(_G.items[ply.inv[ply.invSlot].item].name, invX + invW + 1 + txtOffset, invY + invFont - 1);

                // Show item description if it has one (cyan)
                let invDescLinesFill = 0;
                if (_G.items[ply.inv[ply.invSlot].item].desc && !ply.container) {
                    ctx.fillStyle = 'rgba(100,220,255,0.9)';
                    ctx.fillText(_G.items[ply.inv[ply.invSlot].item].desc, invX + invW + 1 + txtOffset, invY + invFont * 2 + 1);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    invDescLinesFill = 1;
                }

                ctx.fillText(ply.container ? (ply.container.BuyItems ? ('[E] Sell for ' + ply.container.BuyItems[ply.inv[ply.invSlot].item] + (currency !== 'charms' ? ' ' + _G.items[currency].name : '')) : '[E] Stash 1') : '[G] Drop', invX + invW + 1 + txtOffset, invY + invFont * (2 + invDescLinesFill) + 1);


                if (ply.container && !ply.container.BuyItems && ply.inv[ply.invSlot].am >= 5) {
                    ctx.fillText('[G] Stash 5', invX + invW + 1 + txtOffset, invY + invFont * (3 + invDescLinesFill) + 1);
                } else if (!ply.container && typeof _G.items[ply.inv[ply.invSlot].item].Use === 'function') {
                    ctx.fillText('[E] ' + (typeof _G.items[ply.inv[ply.invSlot].item].UseName !== 'undefined' ? _G.items[ply.inv[ply.invSlot].item].UseName : 'Use'), invX + invW + 1 + txtOffset, invY + invFont * (3 + invDescLinesFill) + 1);
                }

                if (ply.container && !ply.container.BuyItems) {
                    ctx.fillText('[Space] All', invX + invW + 1 + txtOffset, invY + invFont * (ply.inv[ply.invSlot].am >= 5 ? (4 + invDescLinesFill) : (3 + invDescLinesFill)) + 1);
                } else if (!ply.container && typeof _G.wep.List[ply.inv[ply.invSlot].item] === 'object') {
                    ctx.fillText('[Space] Equip', invX + invW + 1 + txtOffset, invY + invFont * (typeof _G.items[ply.inv[ply.invSlot].item].Use === 'function' ? (4 + invDescLinesFill) : (3 + invDescLinesFill)) + 1);
                }
            }

            ctx.fillText('[C] Close Inv', invX + invW + 1 + txtOffset, invY + invW - 10);

            // ── EQUIPPED ARMOR DISPLAY ──────────────────────────────────────
            if (!ply.container && ply.equipment && (ply.equipment.head || ply.equipment.body)) {
                let armorY = invY + invW + invFont + 6;
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(0,0,0,0.7)';
                ctx.fillStyle = 'rgba(255,200,80,0.95)';
                ctx.font = 'bold ' + Math.max(11, Math.round(invFont * 0.85)) + 'px "Open Sans"';
                ctx.strokeText('Equipped:', invX + invW + 1 + txtOffset, armorY);
                ctx.fillText('Equipped:', invX + invW + 1 + txtOffset, armorY);
                ctx.fillStyle = 'rgba(180,255,180,0.95)';
                let armorLineY = armorY + invFont + 2;
                if (ply.equipment.head && _G.items[ply.equipment.head]) {
                    ctx.strokeText('Head: ' + _G.items[ply.equipment.head].name, invX + invW + 1 + txtOffset, armorLineY);
                    ctx.fillText('Head: ' + _G.items[ply.equipment.head].name, invX + invW + 1 + txtOffset, armorLineY);
                    armorLineY += invFont + 1;
                }
                if (ply.equipment.body && _G.items[ply.equipment.body]) {
                    ctx.strokeText('Body: ' + _G.items[ply.equipment.body].name, invX + invW + 1 + txtOffset, armorLineY);
                    ctx.fillText('Body: ' + _G.items[ply.equipment.body].name, invX + invW + 1 + txtOffset, armorLineY);
                    armorLineY += invFont + 1;
                }
                let totalArmor = 0;
                if (ply.equipment.head && _G.items[ply.equipment.head]) totalArmor += (_G.items[ply.equipment.head].ArmorVal || 0);
                if (ply.equipment.body && _G.items[ply.equipment.body]) totalArmor += (_G.items[ply.equipment.body].ArmorVal || 0);
                if (totalArmor > 0) {
                    ctx.fillStyle = 'rgba(255,150,80,0.95)';
                    ctx.strokeText('DMG reduction: ' + Math.round(totalArmor * 100) + '%', invX + invW + 1 + txtOffset, armorLineY);
                    ctx.fillText('DMG reduction: ' + Math.round(totalArmor * 100) + '%', invX + invW + 1 + txtOffset, armorLineY);
                }
            }

            let col = 0;
            for (var z = 0; z < 9; z++) {
                if (z % 3 == 0 && z !== 0) {
                    col += 1;
                }

                let slotX = invX + (z % 3) * (slotSize + 1),
                    slotY = invY + col * (slotSize + 1) + 1,
                    invSlot = z + (ply.invScroll * 3);

                if (invSlot === ply.invSlot) {
                    ctx.fillStyle = 'rgba(140,255,140,0.9)';
                    ctx.fillRect(slotX - 1, slotY - 1, slotSize, slotSize);
                } else {
                    ctx.fillStyle = 'rgba(245,245,245,0.6)';
                    ctx.fillRect(slotX, slotY, slotSize, slotSize);
                }

                if (typeof ply.inv[invSlot] === 'object') {
                    //ctx.save();
                    //drawImg(_G.items[ply.inv[z].item].img, slotX+15, slotY+15, 28, 28);
                    ctx.drawImg(_G.items[ply.inv[invSlot].item].img, slotX + 1, slotY + 1, slotSize - 2, slotSize - 2);

                    //ctx.restore();

                    //ctx.save();

                    ctx.font = 'bold ' + (ply.inv[invSlot].am > 999 ? Math.round(invFont * .8) : invFont) + 'px "Open Sans"';

                    ctx.textAlign = 'left';
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                    ctx.strokeText(ply.inv[invSlot].am, slotX + 2, slotY + invFont - 3);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.fillText(ply.inv[invSlot].am, slotX + 2, slotY + invFont - 3);
                    //ctx.restore();


                }
            }

            if (ply.inv.length > 9 + (ply.invScroll * 3)) {
                ctx.globalAlpha = 0.85;
                let arrowSize = Math.round(slotSize / 1.5);
                ctx.drawImg(_G.DownArrow, invX + ((typeof _G.playerData[ply.Owner] === 'object' && _G.playerData[ply.Owner].lastDir === 'L') ? invW + 1 : -arrowSize - 1), invY + (slotSize * 3) - arrowSize - 6, arrowSize, arrowSize);
                ctx.globalAlpha = 1;
            }

            if (ply.container && ply.container.Container) {


                if (_G.viewport.zoom < 1.7) {
                    ctx.font = 'bold ' + invFont + 'px "Open Sans"';
                } else {
                    ctx.font = 'bold 14px "Open Sans"';
                }

                if (typeof _G.playerData[ply.Owner] === 'object' && _G.playerData[ply.Owner].lastDir === 'L') {
                    invX = ply.pos[0] + ply.bbox[0] + ply.bbox[2] + 6;
                    txtOffset = 0;
                    ctx.textAlign = 'left';
                } else {
                    invX = ply.pos[0] - invW - 5;
                    txtOffset = -invW - 4;
                    ctx.textAlign = 'right';
                }

                let slotSize = Math.round(invW / 3) - 1

                ctx.fillStyle = 'rgba(0,0,0,0.5)'
                ctx.fillRect(invX, invY, invW + 1, invW + 1);


                let currencyBuy = 'charms';
                if (ply.container.Currency && typeof ply.conSlot !== 'undefined' && typeof ply.container.Container[ply.conSlot] === 'object' && typeof ply.container.Currency[ply.container.Container[ply.conSlot].item] !== 'undefined') {
                    currencyBuy = ply.container.Currency[ply.container.Container[ply.conSlot].item];
                }


                ctx.lineWidth = 3;

                if (typeof ply.conSlot !== 'undefined' && typeof ply.container.Container[ply.conSlot] === 'object') {
                    ctx.strokeText(_G.items[ply.container.Container[ply.conSlot].item].name, invX + invW + 1 + txtOffset, invY + invFont - 1);

                    let itemPrice = ply.container.BuyItems ? (typeof ply.container.SellItems[ply.container.Container[ply.conSlot].item] !== 'undefined' ? ply.container.SellItems[ply.container.Container[ply.conSlot].item] : Math.ceil(ply.container.BuyItems[ply.container.Container[ply.conSlot].item] * 1.34)) : false;

                    let descLineOffset = 0;
                    if (_G.items[ply.container.Container[ply.conSlot].item].desc) {
                        ctx.strokeText(_G.items[ply.container.Container[ply.conSlot].item].desc, invX + invW + 1 + txtOffset, invY + invFont * 2 + 1);
                        descLineOffset = 1;
                    }

                    ctx.strokeText(itemPrice ? ('[E] Buy for ' + itemPrice + (currencyBuy !== 'charms' ? (' ' + _G.items[currencyBuy].name) : '')) : '[E] Take 1', invX + invW + 1 + txtOffset, invY + invFont * (2 + descLineOffset) + 1);

                    if (!ply.container.BuyItems && ply.container.Container[ply.conSlot].am >= 5) {
                        ctx.strokeText('[G] Take 5', invX + invW + 1 + txtOffset, invY + invFont * (3 + descLineOffset) + 1);
                    }

                    if (!ply.container.BuyItems) {
                        ctx.strokeText('[Space] All', invX + invW + 1 + txtOffset, invY + invFont * (ply.container.Container[ply.conSlot].am >= 5 ? (4 + descLineOffset) : (3 + descLineOffset)) + 1);
                    }
                }

                ctx.fillStyle = 'rgba(255,255,255,0.8)';

                if (typeof ply.conSlot !== 'undefined' && typeof ply.container.Container[ply.conSlot] === 'object') {
                    ctx.fillText(_G.items[ply.container.Container[ply.conSlot].item].name, invX + invW + 1 + txtOffset, invY + invFont - 1);

                    let itemPrice = ply.container.BuyItems ? (typeof ply.container.SellItems[ply.container.Container[ply.conSlot].item] !== 'undefined' ? ply.container.SellItems[ply.container.Container[ply.conSlot].item] : Math.ceil(ply.container.BuyItems[ply.container.Container[ply.conSlot].item] * 1.34)) : false;

                    let descLineOffset = 0;
                    if (_G.items[ply.container.Container[ply.conSlot].item].desc) {
                        ctx.fillStyle = 'rgba(200,240,255,0.75)';
                        ctx.fillText(_G.items[ply.container.Container[ply.conSlot].item].desc, invX + invW + 1 + txtOffset, invY + invFont * 2 + 1);
                        ctx.fillStyle = 'rgba(255,255,255,0.8)';
                        descLineOffset = 1;
                    }

                    ctx.fillText(itemPrice ? ('[E] Buy for ' + itemPrice + (currencyBuy !== 'charms' ? (' ' + _G.items[currencyBuy].name) : '')) : '[E] Take 1', invX + invW + 1 + txtOffset, invY + invFont * (2 + descLineOffset) + 1);

                    if (!ply.container.BuyItems && ply.container.Container[ply.conSlot].am >= 5) {
                        ctx.fillText('[G] Take 5', invX + invW + 1 + txtOffset, invY + invFont * (3 + descLineOffset) + 1);
                    }

                    if (!ply.container.BuyItems) {
                        ctx.fillText('[Space] All', invX + invW + 1 + txtOffset, invY + invFont * (ply.container.Container[ply.conSlot].am >= 5 ? (4 + descLineOffset) : (3 + descLineOffset)) + 1);
                    }
                }

                let col = 0;
                for (var z = 0; z < 9; z++) {
                    if (z % 3 == 0 && z !== 0) {
                        col += 1;
                    }
                    //console.log(ply.container.Container[z]);

                    let slotX = invX + (z % 3) * (slotSize + 1),
                        slotY = invY + col * (slotSize + 1) + 1,
                        itemSlot = z + (ply.conScroll * 3);

                    if (itemSlot === ply.conSlot) {
                        ctx.fillStyle = 'rgba(140,255,140,0.9)';
                        ctx.fillRect(slotX - 1, slotY - 1, slotSize, slotSize);
                    } else {
                        ctx.fillStyle = 'rgba(245,245,245,0.6)';
                        ctx.fillRect(slotX, slotY, slotSize, slotSize);
                    }


                    if (typeof ply.container.Container[itemSlot] === 'object') {
                        //ctx.save();
                        //drawImg(_G.items[ply.inv[z].item].img, slotX+15, slotY+15, 28, 28);
                        ctx.drawImg(_G.items[ply.container.Container[itemSlot].item].img, slotX, slotY, slotSize, slotSize);

                        //ctx.restore();

                        //ctx.save();

                        ctx.font = 'bold ' + (ply.container.Container[itemSlot].am > 999 ? Math.round(invFont * .8) : invFont) + 'px "Open Sans"';

                        ctx.textAlign = 'left';
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                        ctx.strokeText(ply.container.Container[itemSlot].am, slotX + 2, slotY + invFont - 3);
                        ctx.fillStyle = 'rgba(255,255,255,0.8)';
                        ctx.fillText(ply.container.Container[itemSlot].am, slotX + 2, slotY + invFont - 3);
                        //ctx.restore();


                    }
                }
            }

            ctx.restore();


        } else if (typeof _G.ents.All[i].skillOpen !== 'undefined' && (!_G.LocalPlayer || _G.LocalPlayer === _G.ents.All[i])) {
            ctx.save();

            let ply = _G.ents.All[i];
            ctx.translate(-_G.viewport.x * _G.viewport.zoom + (canvas.width * .5), -_G.viewport.y * _G.viewport.zoom + (canvas.height * .5));
            ctx.scale(_G.viewport.zoom, _G.viewport.zoom);

            let invX = 0,
                invY = ply.pos[1] - 24,
                skillW = 126,
                skillH = 170;

            let skillFont = 15
            if (_G.viewport.zoom < 1.7) {
                skillW = skillW * (1 + (1.7 - _G.viewport.zoom))
                skillH = skillH * (1 + (1.7 - _G.viewport.zoom))
                skillFont = (15 + Math.round((1.7 - _G.viewport.zoom) * 18));
                ctx.font = 'bold ' + skillFont + 'px "Open Sans"';
            } else {
                ctx.font = 'bold 15px "Open Sans"';
            }

            if (typeof _G.playerData[ply.Owner] === 'object' && _G.playerData[ply.Owner].lastDir === 'L') {
                invX = ply.pos[0] - skillW - 5;
            } else {
                invX = ply.pos[0] + ply.bbox[0] + ply.bbox[2] + 6;
            }

            ctx.drawImg(_G.skillsImg, invX, invY, skillW, skillH);

            let icoW = (skillW / 3) - (skillH * .02),
                icoH = (skillH / 8) - (skillH * .009);

            let col = 0
            for (var z = 0; z < _G.skills.length; z++) {
                if (z % 3 == 0 && z !== 0) {
                    col += 1;
                }

                ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                ctx.strokeText(typeof _G.ents.All[i].skills[_G.skills[z].name] !== 'undefined' ? _G.ents.All[i].skills[_G.skills[z].name].lvl : '1', invX + (z % 3) * icoW + (skillW * .19), invY + (col * icoH) + (skillH * .12));

                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillText(typeof _G.ents.All[i].skills[_G.skills[z].name] !== 'undefined' ? _G.ents.All[i].skills[_G.skills[z].name].lvl : '1', invX + (z % 3) * icoW + (skillW * .19), invY + (col * icoH) + (skillH * .12));

            }

            ctx.restore();


        } else if (typeof _G.ents.All[i].craftOpen !== 'undefined') {
            ctx.save();

            let ply = _G.ents.All[i];
            ctx.translate(-_G.viewport.x * _G.viewport.zoom + (canvas.width * .5), -_G.viewport.y * _G.viewport.zoom + (canvas.height * .5));
            ctx.scale(_G.viewport.zoom, _G.viewport.zoom);

            let craftX = 0,
                craftY = ply.pos[1];


            if ((ply.pos[1] + ply.bbox[1] + ply.bbox[3] + 40) > _G.viewport.y + (_G.canvas.height * .5 * (1 / _G.viewport.zoom))) {

                if (_G.viewport.zoom < 1.7) {
                    craftY -= 94 * (1.7 - _G.viewport.zoom);
                } else {
                    craftY -= 30;
                }
            }

            let skillFont = 14,
                craftHeight = 16,
                craftOffset = 0;
            if (_G.viewport.zoom < 1.7) {
                //skillW = skillW * (1 +  (1.7 - _G.viewport.zoom))
                skillFont = (15 + Math.round((1.7 - _G.viewport.zoom) * 18));
                ctx.font = 'bold ' + skillFont + 'px "Open Sans"';
                craftHeight = 16 + Math.round((1.7 - _G.viewport.zoom) * 18)
                craftOffset = Math.round((1.7 - _G.viewport.zoom) * 18)
            } else {
                ctx.font = 'bold 14px "Open Sans"';
            }

            let craftW = 0;
            for (var z = ply.craftScroll; z < ply.craftScroll + 6; z++) {
                let rectSize = ctx.measureText(_G.craftKeys[z])
                if (rectSize.width > craftW) {
                    craftW = rectSize.width;
                }
            }

            if (typeof _G.playerData[ply.Owner] === 'object' && _G.playerData[ply.Owner].lastDir === 'L') {
                craftX = ply.pos[0] - craftW - 35;
            } else {
                craftX = ply.pos[0] + ply.bbox[0] + ply.bbox[2] + 6;
            }


            ctx.strokeStyle = 'rgba(0,0,0,0.6)';
            ctx.strokeText('[I] Crafting', craftX, craftY);

            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText('[I] Crafting', craftX, craftY);

            /*

            let craftHover = false,
                craftYAdd = 0,
                craftScroll = 0,
                craftScrolled = 0;

            for (var z=ply.craftScroll; z < ply.craftScroll+6; z++) {
            while (craftScrolled < 6) {
                craftScroll += 1;
                let z = ply.craftScroll+craftScroll;

                if (_G.crafting[_G.craftKeys[z]].furnace) {
                    let foundFurnace = false;
                    for (var xx=0; xx < _G.ents.All.length; xx++) {
                        if (_G.ents.All[xx].class === 'furnace' &&
                            _G.distance(
                                _G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2]*.5,
                                _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3]*.5,
                                _G.ents.All[xx].pos[0] + self.bbox[0] + self.bbox[2]*.5,
                                self.pos[1] + self.bbox[1] + self.bbox[3]*.5
                            )
                        ) {
                            foundFurnace = true;
                            break;
                        }
                    }
                }
                */


            let craftHover = false,
                craftYAdd = 0;
            for (var z = ply.craftScroll; z < ply.craftScroll + 6; z++) {
                let craftItem = ply.craftable[ply.craftKeys[z]];

                if (ply.craftSlot === z) {
                    ctx.fillStyle = 'rgba(245,245,245,0.8)';
                } else {
                    ctx.fillStyle = 'rgba(245,245,245,0.6)';
                }
                let rectSize = ctx.measureText(ply.craftKeys[z])
                ctx.fillRect(craftX - 1, craftY + 4 + craftYAdd, rectSize.width + 4, craftHeight);

                if (rectSize.width > craftW) {
                    craftW = rectSize.width;
                }

                if (ply.craftSlot === z) {
                    craftHover = craftItem;

                    ctx.fillStyle = 'rgba(0,0,0,0.95)';
                    ctx.fillRect(craftX - 2, craftY + 4 + craftYAdd, 3, craftHeight);

                } else {
                    ctx.fillStyle = 'rgba(0,0,0,0.85)';
                }
                ctx.fillText(ply.craftKeys[z], craftX + (ply.craftSlot === z ? 2 : 0), craftY + 16 + craftYAdd + craftOffset);

                craftYAdd += craftHeight + 1;
            }

            if (craftHover) {
                craftW += 6
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fillRect(craftX + craftW, craftY - 13 * (_G.viewport.zoom < 1 ? 1 / _G.viewport.zoom : 1), craftHover.w + 2, craftHover.h + 2);
                ctx.drawImg(craftHover.img, craftX + craftW + 1, craftY - 12 * (_G.viewport.zoom < 1 ? 1 / _G.viewport.zoom : 1), craftHover.w, craftHover.h);

                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.fillText('Need:', craftX + craftW, craftY + craftHover.h + 2);

                let canCraft = true;
                for (var x = 0; x < craftHover.recipe.length; x++) {
                    let hasItem = ply.HasItem(craftHover.recipe[x].item, 1);
                    //console.log(hasItem);
                    if (craftHover.recipe[x].am > hasItem) {
                        ctx.fillStyle = 'rgba(255,255,255,0.9)';
                        if (canCraft) {
                            canCraft = false;
                        }
                    } else {
                        ctx.fillStyle = 'rgba(0,255,0,0.92)';
                    }

                    ctx.fillText(_G.items[craftHover.recipe[x].item].name + ' (' + hasItem + '/' + craftHover.recipe[x].am + ')', craftX + craftW, craftY + craftHover.h + craftHeight + (x * craftHeight));
                }

                let lvlCount = 0;
                if (typeof craftHover.recipeLevels === 'object') {
                    lvlCount = craftHover.recipeLevels.length;
                    for (var x = 0; x < craftHover.recipeLevels.length; x++) {
                        let hasSkill = (typeof ply.skills[craftHover.recipeLevels[x].skill] !== 'undefined' ? ply.skills[craftHover.recipeLevels[x].skill].lvl : 1);
                        //console.log(hasItem);
                        if (craftHover.recipeLevels[x].lvl > hasSkill) {
                            ctx.fillStyle = 'rgba(255,255,255,0.9)';
                            if (canCraft) {
                                canCraft = false;
                            }
                        } else {
                            ctx.fillStyle = 'rgba(0,255,0,0.92)';
                        }

                        ctx.fillText(craftHover.recipeLevels[x].skill + ' LVL ' + hasSkill + '/' + craftHover.recipeLevels[x].lvl, craftX + craftW, craftY + craftHover.h + craftHeight + (x * craftHeight) + (craftHover.recipe.length * craftHeight));
                    }
                }

                if (typeof craftHover.successChance !== 'undefined') {
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.fillText(craftHover.successChance + '% success rate', craftX + craftW, craftY + craftHover.h + craftHeight + (lvlCount * craftHeight) + (craftHover.recipe.length * craftHeight));
                }

                if (craftHover.anvil) {
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.fillText('+' + craftHover.anvil + ' Smithing XP', craftX + craftW, craftY + craftHover.h + craftHeight * (craftHover.successChance ? 2 : 1) + (lvlCount * craftHeight) + (craftHover.recipe.length * craftHeight));
                } else if (craftHover.furnace) {
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.fillText('+' + craftHover.furnace + ' Smithing XP', craftX + craftW, craftY + craftHover.h + craftHeight * (craftHover.successChance ? 2 : 1) + (lvlCount * craftHeight) + (craftHover.recipe.length * craftHeight));
                } else if (craftHover.fire) {
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.fillText('+' + craftHover.fire + ' Cooking XP', craftX + craftW, craftY + craftHover.h + craftHeight * (craftHover.successChance ? 2 : 1) + (lvlCount * craftHeight) + (craftHover.recipe.length * craftHeight));
                }

                if (canCraft) {

                    ctx.fillStyle = 'rgba(255,255,255,0.6)';
                    ctx.fillRect(craftX - 2, craftY + craftYAdd + 4, craftW, craftHeight);

                    let craftProg = 0;
                    if (ply.useCraft) {
                        craftProg = (_G.lastTick - ply.useCraft) / ply.useCraftTime;
                        if (craftProg > 1) {
                            craftProg = 1;
                        }

                        ctx.fillStyle = 'rgba(0,255,0,0.95)';
                        ctx.fillRect(craftX - 2, craftY + craftYAdd + 4, craftW * craftProg, craftHeight);
                    }

                    ctx.strokeStyle = 'rgba(0,165,0,0.9)';

                    if (ply.useCraft) {
                        ctx.strokeText((craftProg === 1 && typeof ply.failCraft !== 'undefined') ? (ply.failCraft ? ('Failed to ' + ply.failCraft) : 'Crafted!') : 'Crafting...', craftX, craftY + craftYAdd + craftHeight);
                    } else {
                        ctx.strokeText('Hold E to Craft', craftX, craftY + craftYAdd + craftHeight);
                    }

                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    if (ply.useCraft) {
                        ctx.fillText((craftProg === 1 && typeof ply.failCraft !== 'undefined') ? (ply.failCraft ? ('Failed to ' + ply.failCraft) : 'Crafted!') : 'Crafting...', craftX, craftY + craftYAdd + craftHeight);
                    } else {
                        ctx.fillText('Hold E to Craft', craftX, craftY + craftYAdd + craftHeight);
                    }

                }
            }

            ctx.restore();

        }
    }


    if (_G.MousePos && _G.MouseShow && _G.MouseShow > _G.lastTick) {
        ctx.save();
        ctx.translate(-_G.viewport.x * _G.viewport.zoom + (canvas.width * .5), -_G.viewport.y * _G.viewport.zoom + (canvas.height * .5));
        ctx.scale(_G.viewport.zoom, _G.viewport.zoom);

        ctx.fillStyle = 'rgb(255,0,0)'
        ctx.fillRect(_G.MousePos[0], _G.MousePos[1], 5, 5);
        ctx.restore();
    }

    if (_G.MouseMesh) {
        let mouseX = Math.floor(_G.MousePos[0] / 10) * 10,
            mouseY = Math.floor(_G.MousePos[1] / 10) * 10;

        ctx.save();

        if (_G.MouseMeshR) {
            ctx.setTransform(1, 0, 0, 1,
                _G.MouseMesh[0] * _G.viewport.zoom + (Math.abs(_G.MousePos[0] - _G.MouseMesh[0]) * .5) * _G.viewport.zoom - _G.viewport.x * _G.viewport.zoom + (canvas.width * .5),
                _G.MouseMesh[1] * _G.viewport.zoom + (Math.abs(_G.MousePos[1] - _G.MouseMesh[1]) * .5) * _G.viewport.zoom - _G.viewport.y * _G.viewport.zoom + (canvas.height * .5)
            );

            ctx.translate(-Math.abs(_G.MousePos[0] - _G.MouseMesh[0]) * .5 * _G.viewport.zoom, -Math.abs(_G.MousePos[1] - _G.MouseMesh[1]) * .5 * _G.viewport.zoom)
        } else {
            ctx.setTransform(1, 0, 0, 1,
                _G.MouseMesh[0] * _G.viewport.zoom - _G.viewport.x * _G.viewport.zoom + (canvas.width * .5),
                _G.MouseMesh[1] * _G.viewport.zoom - _G.viewport.y * _G.viewport.zoom + (canvas.height * .5)
            );
        }

        if (_G.MouseMeshR) {
            ctx.rotate(_G.MouseMeshR);
        }

        /*
                    ctx.translate(-_G.viewport.x*_G.viewport.zoom + (canvas.width * .5), -_G.viewport.y*_G.viewport.zoom + (canvas.height * .5));
                                ctx.scale(_G.viewport.zoom, _G.viewport.zoom);
                                */

        /*
        ctx.fillStyle = 'rgb(255,0,0)'
        ctx.fillRect(0, 0, (mouseX-_G.MouseMesh[0])*_G.viewport.zoom, (mouseY-_G.MouseMesh[1])*_G.viewport.zoom);
        */

        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,255,0,0.8)';
        ctx.strokeRect(0, 0, (mouseX - _G.MouseMesh[0]) * _G.viewport.zoom, (mouseY - _G.MouseMesh[1]) * _G.viewport.zoom);

        ctx.restore();
    }
}

let getRectPolygon = function(pos, bbox, rotate) {
    if (typeof rotate === 'undefined') {
        rotate = 0;
    }
    var poly = [];
    poly.push(GetPointRotated(pos[0] + bbox[0] + bbox[2] * .5, pos[1] + bbox[1] + bbox[3] * .5, bbox[2], bbox[3], rotate, -bbox[2] * .5, bbox[3] * .5));
    poly.push(GetPointRotated(pos[0] + bbox[0] + bbox[2] * .5, pos[1] + bbox[1] + bbox[3] * .5, bbox[2], bbox[3], rotate, bbox[2] * .5, bbox[3] * .5));
    poly.push(GetPointRotated(pos[0] + bbox[0] + bbox[2] * .5, pos[1] + bbox[1] + bbox[3] * .5, bbox[2], bbox[3], rotate, -bbox[2] * .5, -bbox[3] * .5));
    poly.push(GetPointRotated(pos[0] + bbox[0] + bbox[2] * .5, pos[1] + bbox[1] + bbox[3] * .5, bbox[2], bbox[3], rotate, bbox[2] * .5, -bbox[3] * .5));

    return c2d.polygon(c2d.vector(0, 0), poly);
};

let checkCollisions = function(poly, pos, bbox, startIndex, only_solid, owner, entCheck, include_solid) {
    only_solid = (typeof only_solid !== 'undefined' ? only_solid : false);

    if (!only_solid && typeof entCheck === 'object' && entCheck.Solid && !entCheck.Togglable) {
        return [];
    }


    var startIndex = (typeof startIndex === 'number' ? startIndex : 0);

    let collidingEnts = [];

    for (var k = startIndex; k < _G.ents.All.length; k++) {
        let ent = _G.ents.All[k];
        if (typeof ent.bbox !== 'object' || (ent.bbox[2] <= 0 && ent.bbox[3] <= 0)) {
            continue;
        }
        if (only_solid && !ent.Solid) {
            continue;
        }
        if (only_solid && ent.Solid && ent.OwnerPass && ent.Owner === owner) {
            continue;
        }
        if (only_solid && ent.Solid && ent.Placing) {
            continue;
        }
        if (only_solid && ent.Solid && ent.Togglable && !ent.Toggled) {
            continue;
        }
        if (typeof include_solid === 'undefined' && !only_solid && ent.Solid && !ent.Togglable) {
            continue;
        }
        if (typeof entCheck === 'object' && entCheck.Placable && !entCheck.CollideWithOtherPlacables && ent.Placable) {
            continue;
        }
        if (typeof include_solid === 'undefined' && !only_solid && typeof entCheck === 'object' && ((entCheck.class === 'player' && ent.Placable && ent.Solid && !ent.Togglable) || (ent.class === 'player' && entCheck.Placable && ent.Solid && !ent.Togglable))) {
            continue;
        }

        let bboxW = ent.bbox[2];
        if (bbox[2] > bboxW) {
            bboxW = bbox[2];
        }
        if (bbox[3] > bboxW) {
            bboxW = bbox[3];
        }
        if (ent.bbox[3] > bboxW) {
            bboxW = ent.bbox[3];
        }

        if (_G.distance(pos[0], pos[1], ent.pos[0], ent.pos[1]) > bboxW + 10) {
            continue;
        }

        // Don't check self entity for it's own collision
        //if (k === i) { continue; }

        /*
        if (p5.collideRectRect(ent.x+ent.bbox[0], ent.y+ent.bbox[1], ent.bbox[2], ent.bbox[3], ent.x+ent.bbox[0], ent.y+ent.bbox[1], ent.bbox[2], ent.bbox[3])) {
            ent.colliding = true;
            ent.colliding = true;
        }
        */
        if (typeof ent.bboxs === 'object') {
            for (var z = 0; z < ent.bboxs.length; z++) {
                let entPoly = getRectPolygon(ent.pos, ent.bboxs[z], ent.rotate)
                if (c2d.testPolygonPolygon(poly, c2d.polygon(c2d.vector(0, 0), entPoly))) {
                    collidingEnts.push(ent);
                    break;
                }
            }
        } else {
            let entPoly = getRectPolygon(ent.pos, ent.bbox, ent.rotate)

            if (c2d.testPolygonPolygon(poly, entPoly)) {
                collidingEnts.push(ent);
            }
        }

    }


    return collidingEnts;
};

let lastTick = false;

_G.isOBS = (typeof navigator === 'object' && navigator.userAgent && navigator.userAgent.indexOf('OBS') !== -1);

_G.Tick = async function(tFrame) {
    /*IF_CLIENT*/
    if (window.location.hash !== '#spectate') {
        gamepadCheck();
    }
    /*IF_END*/

    if (_G.YTPos && _G.isOBS && _G.YTEnd && (!_G.YTFullCheck || _G.lastTick > _G.YTFullCheck)) {
        _G.YTFullCheck = _G.lastTick + 2000;
        let allNearPlayer = true;
        for (var i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class === 'player' && _G.ents.All[i].inputLast && _G.lastTick - _G.ents.All[i].inputLast < 18000 && (_G.ents.All[i].pos[0] < _G.YTPos[0] || _G.ents.All[i].pos[0] > _G.YTPos[0] + 178 || _G.ents.All[i].pos[1] > _G.YTPos[1] + 103 || _G.ents.All[i].pos[1] < _G.YTPos[1] - 20)) {
                allNearPlayer = false;
                break;
            }
        }

        if (allNearPlayer && _G.lastTick < _G.YTEnd && !_G.YTFull) {
            _G.YTFull = true;
            _G.YTFullAt = _G.lastTick;
            document.getElementById('message').innerHTML = 'Move in-game to close YouTube';
        } else if ((!allNearPlayer || _G.lastTick >= _G.YTEnd) && _G.YTFull) {
            _G.YTFull = false;
            _G.YTFullAt = _G.lastTick;
            document.getElementById('message').innerHTML = '<img src="assets/img/"assets/imgg.png" style="width:32px;top: 8px;position: relative;"> Hobo.Quest';
        }
    }

    if (_G.Instance && _G.Instance === 3) {
        if (_G.WaveStart && _G.lastTick >= _G.WaveStart) {
            _G.WaveStart = undefined;

            sendChat('Wave ' + _G.CurWave + ' on the ship has started!');
            _G.NextWave = _G.lastTick + 13000 + (1500 * _G.CurWave);

            if (_G.CurWave <= 2) {
                for (var zz = 0; zz < 3 + (_G.CurWave === 2 ? 2 : 0); zz++) {
                    let npc = _G.ents.Create('npc_cat'),
                        npcPos = randInt(0, _G.ShipPos.length - 1);
                    npc.pos = [_G.ShipPos[npcPos][0] + randInt(-10, 10), _G.ShipPos[npcPos][1] + randInt(-10, 10)];
                    npc.posStart = [npc.pos[0], npc.pos[1]];
                }
            } else if (_G.CurWave <= 4) {
                for (var zz = 0; zz < 2 + (_G.CurWave === 4 ? 1 : 0); zz++) {
                    let npc = _G.ents.Create('npc_goblin'),
                        npcPos = randInt(0, _G.ShipPos.length - 1);
                    npc.pos = [_G.ShipPos[npcPos][0] + randInt(-10, 10), _G.ShipPos[npcPos][1] + randInt(-10, 10)];
                    npc.posStart = [npc.pos[0], npc.pos[1]];
                }
            } else {
                for (var zz = 0; zz < ((_G.CurWave - 3) * (_G.CurWave <= 7 ? 2 : 1)); zz++) {
                    let npc = _G.ents.Create('npc_guard_' + (_G.CurWave > 5 ? ('mid' + randInt(1, 2)) : 'noob')),
                        npcPos = randInt(0, _G.ShipPos.length - 1);
                    npc.pos = [_G.ShipPos[npcPos][0] + randInt(-10, 10), _G.ShipPos[npcPos][1] + randInt(-10, 10)];
                    npc.posStart = [npc.pos[0], npc.pos[1]];
                }
            }
        }

        if (_G.NextWave && _G.lastTick > _G.NextWave) {
            let npcCount = 0;
            for (var zz = 0; zz < _G.ents.All.length; zz++) {
                if (typeof _G.npcs[_G.ents.All[zz].class] === 'object') {
                    npcCount += 1;
                }
            }
            if (npcCount <= 0) {
                _G.CurWave += 1;
                sendChat('Wave ' + _G.CurWave + ' starts in 15 seconds...');
                _G.NextWave = _G.lastTick + 999999999999;
                _G.WaveStart = _G.lastTick + 15000;
            } else {
                _G.NextWave = _G.lastTick + 3000;
            }
        }
    }



    if (_G.MouseDown[2]) {
        let scrX = _G.viewport.x - (_G.canvas.width * .5 * (1 / _G.viewport.zoom)),
            scrY = _G.viewport.y - (_G.canvas.height * .5 * (1 / _G.viewport.zoom));

        if (_G.clientX && _G.clientY && !_G.AnalogPos) {
            _G.MousePos = [scrX + (_G.clientX * (1 / _G.viewport.zoom)), scrY + (_G.clientY * (1 / _G.viewport.zoom))];
        }

        gameServer.send(
            JSON.stringify({
                type: 'Mouse',
                button: 2,
                pos: _G.MousePos,
                key_position: 'down'
            })
        );
    }
    //if (_G.viewport.zoom <= 0.88) {
    /*
    document.body.style.backgroundPosition = (-(_G.viewport.x*_G.viewport.zoom)+(((1/_G.viewport.zoom)*(_G.canvas.width/2)*_G.viewport.zoom)) + 'px ') + (-(_G.viewport.y*_G.viewport.zoom) + ((1/_G.viewport.zoom)*(_G.canvas.height/2)*_G.viewport.zoom) + 'px');
    document.body.style.backgroundSize = _G.viewport.zoom*30 + '%';
    */
    //}

    /*
    let vid = document.getElementById('myvid');
    vid.style.left = -(_G.viewport.x*_G.viewport.zoom)-389*_G.viewport.zoom+_G.canvas.width*.5 + 'px';

    vid.style.top = -(_G.viewport.y*_G.viewport.zoom)-63*_G.viewport.zoom+_G.canvas.height*.5 + 'px';
    vid.style.width = 1280*_G.viewport.zoom;
    vid.style.height = 720*_G.viewport.zoom;

    if (vid.style.width > 480) {
        vid.style.width = 480;
    }
    if (vid.style.height > 320) {
        vid.style.width = 320;
    }
    */

    let playerNames = Object.keys(_G.playerData);
    for (var i = 0; i < playerNames.length; i++) {
        let ply = _G.playerData[playerNames[i]],
            addPos = [0, 0];

        if (typeof ply.ent !== 'object') {
            continue;
        }

        if (typeof ply.ent.Driving !== 'undefined') {
            continue;
        }

        if (ply.ent.Dying) {
            continue;
        }

        /*IF_SERVER*/

        if (typeof ply.input['H'] === 'undefined' && typeof ply.ent.holdingH !== 'undefined') {
            ply.ent.holdingH = undefined;
        }

        if (typeof ply.input['H'] !== 'undefined' && typeof ply.ent.holdingH === 'undefined' && !ply.ent.Driving) {
            ply.ent.holdingH = _G.lastTick;
            // Shift+H: stash active weapon straight into inventory
            if (typeof ply.input['SHIFT'] !== 'undefined' && typeof ply.ent.ActiveWeapon === 'object') {
                let _wep = ply.ent.ActiveWeapon;
                let _itemKey = _wep.pickupItem || _wep.class;
                _wep.ShouldRemove = true;
                _wep.Owner = undefined;
                _wep.parent = undefined;
                _wep.parentX = undefined;
                _wep.parentY = undefined;
                if (ply.ent.Holstered === _wep) ply.ent.Holstered = undefined;
                ply.ent.ActiveWeapon = undefined;
                ply.ent.AddItem(_itemKey, 1);
                let _iname = (_G.items[_itemKey] && _G.items[_itemKey].name) || _itemKey;
                ply.ent.ShowNotify(_iname + ' stored in inventory', 1500);
            } else {
                ply.ent.Holster();
            }
        }


        if (typeof ply.input['C'] === 'undefined' && typeof ply.ent.holdingC !== 'undefined') {
            ply.ent.holdingC = undefined;
        }

        if (typeof ply.input['C'] !== 'undefined' && typeof ply.ent.holdingC === 'undefined') {
            ply.ent.holdingC = _G.lastTick;

            if (typeof ply.ent.invOpen === 'undefined') {
                if (typeof ply.input['V'] !== 'undefined') {
                    ply.input['V'] = undefined;
                }
                if (typeof ply.input['E'] !== 'undefined') {
                    ply.input['E'] = undefined;
                }
                if (typeof ply.input['U'] !== 'undefined') {
                    ply.input['U'] = undefined;
                }
                if (typeof ply.input['D'] !== 'undefined') {
                    ply.input['D'] = undefined;
                }
                if (typeof ply.input['L'] !== 'undefined') {
                    ply.input['L'] = undefined;
                }
                if (typeof ply.input['R'] !== 'undefined') {
                    ply.input['R'] = undefined;
                }

                ply.ent.craftOpen = undefined;
                ply.ent.craftSlot = undefined;
                ply.ent.skillOpen = undefined;

                ply.ent.conSlot = undefined;
                ply.ent.conScroll = undefined;

                ply.ent.invScroll = 0;
                ply.ent.invSlot = 0;
                ply.ent.invOpen = _G.lastTick;
            } else {
                ply.ent.invOpen = undefined;
                ply.ent.craftOpen = undefined;
                ply.ent.craftSlot = undefined;
                ply.ent.skillOpen = undefined;
                ply.ent.conSlot = undefined;
                ply.ent.conScroll = undefined;
            }
        }


        if (typeof ply.input['K'] === 'undefined' && typeof ply.ent.holdingK !== 'undefined') {
            ply.ent.holdingK = undefined;
        }

        if (typeof ply.input['K'] !== 'undefined' && typeof ply.ent.holdingK === 'undefined') {
            ply.ent.holdingK = _G.lastTick;

            if (typeof ply.ent.skillOpen === 'undefined') {
                if (typeof ply.input['V'] !== 'undefined') {
                    ply.input['V'] = undefined;
                }
                if (typeof ply.input['E'] !== 'undefined') {
                    ply.input['E'] = undefined;
                }
                if (typeof ply.input['U'] !== 'undefined') {
                    ply.input['U'] = undefined;
                }
                if (typeof ply.input['D'] !== 'undefined') {
                    ply.input['D'] = undefined;
                }
                if (typeof ply.input['L'] !== 'undefined') {
                    ply.input['L'] = undefined;
                }
                if (typeof ply.input['R'] !== 'undefined') {
                    ply.input['R'] = undefined;
                }

                ply.ent.craftOpen = undefined;
                ply.ent.craftSlot = undefined;

                ply.ent.invSlot = undefined;
                ply.ent.invOpen = undefined;

                ply.ent.skillOpen = _G.lastTick;
                ply.ent.skillSlot = 0;
            } else {
                ply.ent.invOpen = undefined;
                ply.ent.craftOpen = undefined;
                ply.ent.craftSlot = undefined;
                ply.ent.skillOpen = undefined;
            }
        }

        // ── Hammer Build Menu ─────────────────────────────────────────────────
        // Build pieces are grouped into categories.  E cycles pieces inside
        // the current category.  CTRL+E (or Q) advances to the next category.
        // The HUD card (client-side render) reflects category + piece name.
        // ─────────────────────────────────────────────────────────────────────
        if (typeof ply.input['E'] === 'undefined' && typeof ply.ent.holdingE_bm !== 'undefined') {
            ply.ent.holdingE_bm = undefined;
        }

        if (typeof ply.input['E'] !== 'undefined' && typeof ply.ent.holdingE_bm === 'undefined' &&
            typeof ply.ent.ActiveWeapon === 'object' && ply.ent.ActiveWeapon.class === 'hammer' &&
            !ply.ent.invOpen && !ply.ent.craftOpen && !ply.ent.skillOpen) {
            ply.ent.holdingE_bm = _G.lastTick;

            // Category tables — CTRL+E switches category, plain E cycles within it
            let _bmCats = [
                { name: 'Walls',      pieces: ['wall-wood','wall-wood-half','wall1','wall1-half'] },
                { name: 'Doors',      pieces: ['door-wood','forcefield'] },
                { name: 'Utilities',  pieces: ['bed','tool_cupboard','campfire','barbed_wire'] }
            ];

            let _shiftDown = (typeof ply.input['SHIFT'] !== 'undefined');

            if (_shiftDown) {
                // SHIFT+E: switch to next category, reset to first piece in it
                if (typeof ply.ent.BuildMenuCat !== 'number') ply.ent.BuildMenuCat = 0;
                ply.ent.BuildMenuCat = (ply.ent.BuildMenuCat + 1) % _bmCats.length;
                ply.ent.BuildMenuPiece = _bmCats[ply.ent.BuildMenuCat].pieces[0];
            } else {
                // E: cycle through pieces in current category
                if (typeof ply.ent.BuildMenuCat !== 'number') ply.ent.BuildMenuCat = 0;
                let _curCat = _bmCats[ply.ent.BuildMenuCat];
                let _curIdx = _curCat.pieces.indexOf(ply.ent.BuildMenuPiece);
                ply.ent.BuildMenuPiece = _curCat.pieces[(_curIdx + 1) % _curCat.pieces.length];
            }

            let _bmItemDef = _G.items[ply.ent.BuildMenuPiece];
            let _bmName = (typeof _bmItemDef === 'object' && _bmItemDef.name) ? _bmItemDef.name : ply.ent.BuildMenuPiece;
            let _bmRec = _G.buildRecipes && _G.buildRecipes[ply.ent.BuildMenuPiece];
            let _catName = _bmCats[ply.ent.BuildMenuCat || 0].name;
            let _bmCostTxt = _bmRec ? ' [' + _bmRec.map(function(r) {
                let _have = ply.ent.HasItem ? (ply.ent.HasItem(r.item) || 0) : 0;
                return r.am + ' ' + r.item + '(' + _have + ')';
            }).join(', ') + ']' : '';
            ply.ent.ShowNotify('[' + _catName + '] ' + _bmName + _bmCostTxt, 2200);
        }

        if (typeof ply.input['I'] === 'undefined' && typeof ply.ent.holdingI !== 'undefined') {
            ply.ent.holdingI = undefined;
        }

        if (typeof ply.input['I'] !== 'undefined' && typeof ply.ent.holdingI === 'undefined') {
            ply.ent.holdingI = _G.lastTick;

            if (typeof ply.ent.craftOpen === 'undefined') {
                if (typeof ply.input['V'] !== 'undefined') {
                    ply.input['V'] = undefined;
                }
                if (typeof ply.input['E'] !== 'undefined') {
                    ply.input['E'] = undefined;
                }
                if (typeof ply.input['U'] !== 'undefined') {
                    ply.input['U'] = undefined;
                }
                if (typeof ply.input['D'] !== 'undefined') {
                    ply.input['D'] = undefined;
                }
                if (typeof ply.input['L'] !== 'undefined') {
                    ply.input['L'] = undefined;
                }
                if (typeof ply.input['R'] !== 'undefined') {
                    ply.input['R'] = undefined;
                }

                ply.ent.craftable = {};

                let foundFurnace = false;
                for (var xx = 0; xx < _G.ents.All.length; xx++) {
                    if (_G.ents.All[xx].class === 'furnace' &&
                        _G.distance(
                            _G.ents.All[xx].pos[0] + _G.ents.All[xx].bbox[0] + _G.ents.All[xx].bbox[2] * .5,
                            _G.ents.All[xx].pos[1] + _G.ents.All[xx].bbox[1] + 10 + _G.ents.All[xx].bbox[3] * .5,
                            ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] * .5,
                            ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] * .5
                        ) < 114
                    ) {
                        foundFurnace = true;
                        break;
                    }
                }

                let foundAnvil = false;
                for (var xx = 0; xx < _G.ents.All.length; xx++) {
                    if (_G.ents.All[xx].class === 'anvil' &&
                        _G.distance(
                            _G.ents.All[xx].pos[0] + _G.ents.All[xx].bbox[0] + _G.ents.All[xx].bbox[2] * .5,
                            _G.ents.All[xx].pos[1] + _G.ents.All[xx].bbox[1] + 10 + _G.ents.All[xx].bbox[3] * .5,
                            ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] * .5,
                            ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] * .5
                        ) < 70
                    ) {
                        foundAnvil = true;
                        break;
                    }
                }

                let foundFire = false;
                for (var xx = 0; xx < _G.ents.All.length; xx++) {
                    if (_G.ents.All[xx].FireSource &&
                        _G.distance(
                            _G.ents.All[xx].pos[0] + _G.ents.All[xx].bbox[0] + _G.ents.All[xx].bbox[2] * .5,
                            _G.ents.All[xx].pos[1] + _G.ents.All[xx].bbox[1] + 10 + _G.ents.All[xx].bbox[3] * .5,
                            ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] * .5,
                            ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] * .5
                        ) < 70
                    ) {
                        foundFire = true;
                        break;
                    }
                }

                for (var ii = 0; ii < _G.craftKeys.length; ii++) {
                    if (_G.crafting[_G.craftKeys[ii]].furnace && !foundFurnace) {
                        continue;
                    }
                    if (_G.crafting[_G.craftKeys[ii]].anvil && !foundAnvil) {
                        continue;
                    }
                    if (_G.crafting[_G.craftKeys[ii]].fire && !foundFire) {
                        continue;
                    }

                    ply.ent.craftable[_G.craftKeys[ii]] = _G.crafting[_G.craftKeys[ii]];
                }
                ply.ent.craftKeys = Object.keys(ply.ent.craftable);

                ply.ent.craftOpen = _G.lastTick;
                ply.ent.craftSlot = 0;
                ply.ent.craftScroll = 0;

                ply.ent.invOpen = undefined;
                ply.ent.skillOpen = undefined;
            } else {
                ply.ent.craftOpen = undefined;
                ply.ent.skillOpen = undefined;
            }
        }

        /*IF_END*/


        if (ply.lastDir === 'L' && ply.ent.interpDir > -1) {
            ply.ent.interpDir -= 0.05;
            if (ply.ent.interpDir <= 0.4 && ply.ent.interpDir > -0.4) {
                ply.ent.interpDir = -0.4;
            }
        } else if (ply.lastDir === 'R' && ply.ent.interpDir < 1) {
            ply.ent.interpDir += 0.05;
            if (ply.ent.interpDir >= -0.4 && ply.ent.interpDir < 0.4) {
                ply.ent.interpDir = 0.4;
            }
        }

        let angUpDown = (ply.lastDir === 'R' ? 9 : -9);
        if (ply.lastDirY === 'D') {
            ply.ent.rotateTo = angleToRadians(angUpDown);
        } else if (ply.lastDirY === 'U') {
            ply.ent.rotateTo = angleToRadians(-angUpDown);
        } else {
            ply.ent.rotateTo = angleToRadians(0);
        }

        /*IF_SERVER*/

        if (typeof ply.ent.invOpen !== 'undefined') {
            if (typeof ply.input['R'] !== 'undefined' && typeof ply.ent.rDown === 'undefined') {
                ply.ent.rDown = _G.lastTick;
                if (typeof ply.ent.conSlot !== 'undefined') {
                    ply.ent.conSlot += 1;
                } else {
                    ply.ent.invSlot += 1;
                }
                if ((typeof ply.ent.conSlot !== 'undefined' && ply.ent.conSlot % 3 === 0 && ply.ent.conSlot !== 0) || (ply.ent.invSlot % 3 === 0 && ply.ent.invSlot !== 0)) {
                    if (ply.ent.container && typeof ply.ent.conSlot === 'undefined') {
                        ply.ent.conScroll = 0;
                        if (ply.ent.invScroll > 0) {
                            ply.ent.conSlot = 0;
                        } else {
                            ply.ent.conSlot = ply.ent.invSlot - 3;
                        }
                        ply.ent.invSlot = undefined;
                    } else if (typeof ply.ent.conSlot !== 'undefined') {
                        ply.ent.invScroll = 0;
                        if (ply.ent.conScroll > 0) {
                            ply.ent.invSlot = 0;
                        } else {
                            ply.ent.invSlot = ply.ent.conSlot - 3;
                        }
                        ply.ent.conSlot = undefined;
                        if (ply.ent.invScroll < ply.ent.conScroll) {
                            ply.ent.invSlot -= (3 * (ply.ent.conScroll - ply.ent.invScroll))
                        } else if (ply.ent.invScroll > ply.ent.conScroll) {
                            ply.ent.invSlot += (3 * (ply.ent.invScroll - ply.ent.conScroll))
                        }
                    } else {
                        ply.ent.invSlot -= 3;
                    }
                }
            } else if (typeof ply.input['R'] === 'undefined' && typeof ply.ent.rDown !== 'undefined') {
                ply.ent.rDown = undefined;
            }

            if (typeof ply.input['L'] !== 'undefined' && typeof ply.ent.lDown === 'undefined') {
                ply.ent.lDown = _G.lastTick;

                if (!ply.ent.container) {
                    if (ply.ent.invSlot % 3 === 0) {
                        ply.ent.invSlot += 2;
                    } else {
                        ply.ent.invSlot -= 1;
                    }
                } else {

                    if (typeof ply.ent.conSlot === 'undefined' && ply.ent.invSlot % 3 === 0) {
                        ply.ent.conSlot = ply.ent.invSlot + 2;
                        ply.ent.invSlot = undefined;
                        if (ply.ent.conScroll < ply.ent.invScroll) {
                            ply.ent.conSlot -= (3 * (ply.ent.invScroll - ply.ent.conScroll))
                        } else if (ply.ent.conScroll > ply.ent.invScroll) {
                            ply.ent.conSlot += (3 * (ply.ent.invScroll - ply.ent.conScroll))
                        }
                    } else if (typeof ply.ent.conSlot !== 'undefined' && ply.ent.conSlot % 3 === 0) {
                        ply.ent.invSlot = ply.ent.conSlot + 2;
                        ply.ent.conSlot = undefined;
                        if (ply.ent.invScroll < ply.ent.conScroll) {
                            ply.ent.invSlot -= (3 * (ply.ent.conScroll - ply.ent.invScroll))
                        } else if (ply.ent.invScroll > ply.ent.conScroll) {
                            ply.ent.invSlot += (3 * (ply.ent.invScroll - ply.ent.conScroll))
                        }
                    } else {
                        if (typeof ply.ent.conSlot !== 'undefined') {
                            ply.ent.conSlot -= 1;
                        } else {
                            ply.ent.invSlot -= 1;
                        }
                    }

                }
            } else if (typeof ply.input['L'] === 'undefined' && typeof ply.ent.lDown !== 'undefined') {
                ply.ent.lDown = undefined;
            }

            if (typeof ply.input['D'] !== 'undefined' && typeof ply.ent.dDown === 'undefined') {
                ply.ent.dDown = _G.lastTick;
                if (typeof ply.ent.conSlot !== 'undefined' && ply.ent.container) {
                    ply.ent.conSlot += 3;

                    if (ply.ent.conSlot >= 9 + (ply.ent.conScroll * 3)) {
                        if (ply.ent.container.Container.length > 9 + (ply.ent.conScroll * 3)) {
                            ply.ent.conScroll += 1;
                        } else {
                            ply.ent.conSlot -= 9 + (ply.ent.conScroll * 3);
                            ply.ent.conScroll = 0;
                        }
                    }
                } else {
                    ply.ent.invSlot += 3;
                    if (ply.ent.invSlot >= 9 + (ply.ent.invScroll * 3)) {
                        //ply.ent.invSlot -= 9;
                        if (ply.ent.inv.length > 9 + (ply.ent.invScroll * 3)) {
                            ply.ent.invScroll += 1;
                        } else {
                            ply.ent.invSlot -= 9 + (ply.ent.invScroll * 3);
                            ply.ent.invScroll = 0;
                        }
                    }
                }
            } else if (typeof ply.input['D'] === 'undefined' && typeof ply.ent.dDown !== 'undefined') {
                ply.ent.dDown = undefined;
            }

            if (typeof ply.input['U'] !== 'undefined' && typeof ply.ent.uDown === 'undefined') {
                ply.ent.uDown = _G.lastTick;
                if (typeof ply.ent.conSlot !== 'undefined') {
                    ply.ent.conSlot -= 3;


                    if (ply.ent.conSlot < (ply.ent.conScroll * 3)) {
                        //ply.ent.invSlot -= 9;
                        if (ply.ent.conSlot < 0) {
                            ply.ent.conScroll = ply.ent.container.Container.length <= 9 ? 0 : Math.ceil((ply.ent.container.Container.length - 9) / 3);
                            ply.ent.conSlot += 9 + (ply.ent.conScroll * 3);
                            //ply.ent.invScroll -= 1;
                            //ply.ent.invScroll = Math.ceil(ply.ent.invSlot/3);
                        } else {
                            ply.ent.conScroll = Math.floor(ply.ent.conSlot / 3);
                            //ply.ent.invScroll = Math.ceil((ply.ent.inv.length-9)/3);
                            //ply.ent.invSlot += 9+(ply.ent.invScroll*3);
                        }

                        if (ply.ent.conScroll < 0) {
                            ply.ent.conScroll = 0;
                        }
                    }
                } else {
                    ply.ent.invSlot -= 3;

                    if (ply.ent.invSlot < (ply.ent.invScroll * 3)) {
                        //ply.ent.invSlot -= 9;
                        if (ply.ent.invSlot < 0) {
                            ply.ent.invScroll = ply.ent.inv.length <= 9 ? 0 : Math.ceil((ply.ent.inv.length - 9) / 3);
                            ply.ent.invSlot += 9 + (ply.ent.invScroll * 3);
                            //ply.ent.invScroll -= 1;
                            //ply.ent.invScroll = Math.ceil(ply.ent.invSlot/3);
                        } else {
                            ply.ent.invScroll = Math.floor(ply.ent.invSlot / 3);
                            //ply.ent.invScroll = Math.ceil((ply.ent.inv.length-9)/3);
                            //ply.ent.invSlot += 9+(ply.ent.invScroll*3);
                        }

                        if (ply.ent.invScroll < 0) {
                            ply.ent.invScroll = 0;
                        }
                    }
                }
            } else if (typeof ply.input['U'] === 'undefined' && typeof ply.ent.uDown !== 'undefined') {
                ply.ent.uDown = undefined;
            }
        } else if (typeof ply.ent.craftOpen !== 'undefined') {
            /*
            if (typeof ply.input['R'] !== 'undefined' && typeof ply.ent.rDown === 'undefined') {
                ply.ent.rDown = _G.lastTick;
                ply.ent.craftSlot += 1;
            } else if (typeof ply.input['R'] === 'undefined' && typeof ply.ent.rDown !== 'undefined') {
                ply.ent.rDown = undefined;
            }

            if (typeof ply.input['L'] !== 'undefined' && typeof ply.ent.lDown === 'undefined') {
                ply.ent.lDown = _G.lastTick;
                ply.ent.craftSlot += 1;
            } else if (typeof ply.input['L'] === 'undefined' && typeof ply.ent.lDown !== 'undefined') {
                ply.ent.lDown = undefined;
            }
            */

            if (typeof ply.input['D'] !== 'undefined' && typeof ply.ent.dDown === 'undefined') {
                ply.ent.dDown = _G.lastTick;
                if (ply.ent.craftSlot < Object.keys(ply.ent.craftable).length - 1) {
                    ply.ent.craftSlot += 1;
                    if (ply.ent.craftSlot >= ply.ent.craftScroll + 6) {
                        ply.ent.craftScroll += 1;
                    }


                    if (typeof ply.ent.useCraftTimer !== 'undefined') {
                        clearTimeout(ply.ent.useCraftTimer);
                    }

                    if (ply.ent.useCraft) {
                        ply.ent.useCraft = undefined;
                        ply.ent.useCraftTime = undefined;
                    }
                }
            } else if (typeof ply.input['D'] === 'undefined' && typeof ply.ent.dDown !== 'undefined') {
                ply.ent.dDown = undefined;
            }

            if (typeof ply.input['U'] !== 'undefined' && typeof ply.ent.uDown === 'undefined') {
                ply.ent.uDown = _G.lastTick;
                if (ply.ent.craftSlot > 0) {
                    ply.ent.craftSlot -= 1;
                    if (ply.ent.craftSlot < ply.ent.craftScroll) {
                        ply.ent.craftScroll -= 1;
                    }

                    if (typeof ply.ent.useCraftTimer !== 'undefined') {
                        clearTimeout(ply.ent.useCraftTimer);
                    }

                    if (ply.ent.useCraft) {
                        ply.ent.useCraft = undefined;
                        ply.ent.useCraftTime = undefined;
                    }
                }
            } else if (typeof ply.input['U'] === 'undefined' && typeof ply.ent.uDown !== 'undefined') {
                ply.ent.uDown = undefined;
            }
        }

        /*IF_END*/

        if (!ply.ent.craftOpen && !ply.ent.invOpen) {
            if (typeof ply.mouse[2] !== 'undefined' && ply.mouse[2].key_position === 'down' && (Math.abs(ply.mouse[2].pos[0] - ply.ent.pos[0]) > 1 || Math.abs(ply.mouse[2].pos[1] - ply.ent.pos[1]) > 1)) {
                let vec = [ply.mouse[2].pos[0] - ply.ent.pos[0], ply.mouse[2].pos[1] - ply.ent.pos[1]];
                if (vec[0] > 1 || vec[0] < -1) {
                    vec[1] = (vec[1] / vec[0]);
                    if (vec[0] < -1) {
                        vec[1] = -vec[1];
                    }
                    vec[0] = (vec[0] > 1 ? 1 : -1);
                }
                if (vec[1] > 1 || vec[1] < -1) {
                    vec[0] = (vec[0] / vec[1]);
                    if (vec[1] < -1) {
                        vec[0] = -vec[0];
                    }
                    vec[1] = (vec[1] > 1 ? 1 : -1);
                }

                let vecSpeed = (_G.distance(ply.ent.pos[0], ply.ent.pos[1], ply.mouse[2].pos[0], ply.mouse[2].pos[1]) / 100);
                if (vecSpeed < 1) {
                    vec[0] = vec[0] * vecSpeed;
                    vec[1] = vec[1] * vecSpeed;
                }

                addPos = vec;

                if (addPos[0] < 0) {
                    ply.lastDir = 'L';
                }
                if (addPos[0] > 0) {
                    ply.lastDir = 'R';
                }

                if (addPos[1] < 0) {
                    ply.lastDirY = 'U';
                }
                if (addPos[1] > 0) {
                    ply.lastDirY = 'D';
                }
            } else {
                if (typeof ply.input['R'] !== 'undefined' && (ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] < _G.BoundaryX || ply.ent.OutsideBoundary)) {
                    addPos[0]++;
                    ply.lastDir = 'R';
                }

                if (typeof ply.input['L'] !== 'undefined' && (ply.ent.pos[0] > _G.BoundaryMinX || ply.ent.OutsideBoundary)) {
                    addPos[0]--;
                    ply.lastDir = 'L';
                }


                if (typeof ply.input['D'] !== 'undefined' && (ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] < _G.BoundaryY || ply.ent.OutsideBoundary)) {
                    addPos[1]++;
                    ply.lastDirY = 'D';
                }

                if (typeof ply.input['U'] !== 'undefined' && (ply.ent.pos[1] > _G.BoundaryMinY || ply.ent.OutsideBoundary)) {
                    addPos[1]--;
                    ply.lastDirY = 'U';
                }
            }
        }

        if ((ply.lastDirY === 'D' || ply.lastDirY === 'U') && addPos[1] === 0) {
            ply.lastDirY = false;
        }

        let speedMultiplier = 1;

        if (typeof ply.input['SHIFT'] !== 'undefined') {
            speedMultiplier = 2;

            if (ply.ent.SpeedHax) {
                speedMultiplier = 12;
            }
        }

        if (typeof ply.ent.OnMeth !== 'undefined' && _G.lastTick - ply.ent.OnMeth < 14000) {
            speedMultiplier = 6;
        }

        if (typeof ply.ent.collidingSlow !== 'undefined' && _G.lastTick - ply.ent.collidingSlowAt < 1000) {
            speedMultiplier = ply.ent.collidingSlow;
        }

        if (speedMultiplier !== 1) {
            addPos[0] = addPos[0] * speedMultiplier;
            addPos[1] = addPos[1] * speedMultiplier;
        }

		if (ply.ent) {
			ply.ent.speedMultiplier = speedMultiplier;
		}

        if (!ply.ent.OutsideBoundary) {
            if (ply.ent.pos[0] + addPos[0] < _G.BoundaryMinX) {
                addPos[0] = 0;
            } else if (ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] + addPos[0] > _G.BoundaryX) {
                addPos[0] = 0;
            }

            if (ply.ent.pos[1] + addPos[1] < _G.BoundaryMinY) {
                addPos[1] = 0;
            } else if (ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] + addPos[1] > _G.BoundaryX) {
                addPos[1] = 0;
            }
        }

		/*IF_CLIENT*/
		if (ply.ent.PreviewOrigin && typeof ply.ent.ActiveWeapon === 'object' && ply.ent.ActiveWeapon.class === 'hammer') {
			addPos = [0,0]; // no movement when previewing TC origin
		}
		/*IF_END*/

        let noSolids = false;

        let bboxToPoly = getRectPolygon([ply.ent.pos[0] + addPos[0], ply.ent.pos[1] + addPos[1]], ply.ent.bbox, 0)

        let collidingEnts = checkCollisions(bboxToPoly, [ply.ent.pos[0] + addPos[0], ply.ent.pos[1] + addPos[1]], ply.ent.bbox, 0, true, ply.ent.Owner, ply.ent);

        if (collidingEnts.length === 0) {
            noSolids = true;
        } else {
            bboxToPoly = getRectPolygon([ply.ent.pos[0] + addPos[0], ply.ent.pos[1]], ply.ent.bbox, 0)

            collidingEnts = checkCollisions(bboxToPoly, [ply.ent.pos[0] + addPos[0], ply.ent.pos[1]], ply.ent.bbox, 0, true, ply.ent.Owner, ply.ent);

            if (collidingEnts.length === 0) {
                noSolids = 'x';
            }

            if (noSolids === false) {
                bboxToPoly = getRectPolygon([ply.ent.pos[0], ply.ent.pos[1] + addPos[1]], ply.ent.bbox, 0)

                collidingEnts = checkCollisions(bboxToPoly, [ply.ent.pos[0], ply.ent.pos[1] + addPos[1]], ply.ent.bbox, 0, true, ply.ent.Owner, ply.ent);

                if (collidingEnts.length === 0) {
                    noSolids = 'y';
                }
            }
        }

        if (noSolids === 'x' && addPos[1] !== 0) {
            addPos[1] = 0;
            //ply.input['U'] = undefined;
            //ply.input['D'] = undefined;
        } else if (noSolids === 'y' && addPos[0] !== 0) {
            addPos[0] = 0;
            //ply.input['L'] = undefined;
            //ply.input['R'] = undefined;
        } else if (noSolids === false) {
            addPos = [0, 0];
            //ply.input['L'] = undefined;
            //ply.input['R'] = undefined;
            //ply.input['U'] = undefined;
            //ply.input['D'] = undefined;
        }

        let handX = (ply.lastDir === 'R' ? 48 : -7);

        if (addPos[0] !== 0 || addPos[1] !== 0) {
            ply.ent.posLast = [ply.ent.pos[0], ply.ent.pos[1]];
        }

        
        if (addPos[0] !== 0) {
            ply.ent.pos[0] += addPos[0];
        }

        if (addPos[1] !== 0) {
            ply.ent.pos[1] += addPos[1];
        }

        /*IF_SERVER*/
        // ── Apply knockback impulse if one is pending ─────────────────────
        if (ply.ent.KnockVec) {
            ply.ent.pos[0] += ply.ent.KnockVec[0];
            ply.ent.pos[1] += ply.ent.KnockVec[1];
            ply.ent.KnockVec[0] *= ply.ent.KnockDecay;
            ply.ent.KnockVec[1] *= ply.ent.KnockDecay;
            if (Math.abs(ply.ent.KnockVec[0]) < 0.4 && Math.abs(ply.ent.KnockVec[1]) < 0.4) {
                ply.ent.KnockVec = undefined;
                ply.ent.KnockDecay = undefined;
            }
        }
        /*IF_END*/

        if (!ply.ent.parts) {
            continue;
        }

        let footLeft = _G.ents.getPartByName(ply.ent.parts, 'footLeft'),
            footRight = _G.ents.getPartByName(ply.ent.parts, 'footRight'),
            hand = _G.ents.getPartByName(ply.ent.parts, 'hand');


        if (typeof footLeft !== 'object' || typeof footRight !== 'object' || typeof hand !== 'object') {
            continue;
        }


        if (addPos[0] !== 0 || addPos[1] !== 0) {
            if (typeof footLeft.moveFoot !== 'undefined') {
                footLeft.y += 0.36 * speedMultiplier;
                footRight.y -= 0.36 * speedMultiplier;

                if (!ply.ent.Punching) {
                    hand.rotate -= 0.02 * speedMultiplier;
                    hand.x += 0.34 * speedMultiplier;
                }

                if (footLeft.y > (footLeft.startY + 4)) {
                    footLeft.moveFoot = undefined;

                    /*IF_CLIENT*/
                    let footstep = false;
                    if (ply.ent.pos[1] < 240) {
                        footstep = _G.footsteps.concrete[randInt(0, _G.footsteps.concrete.length - 1)].cloneNode(true);
                    } else if (!_G.Instance && (ply.ent.pos[0] < _G.BoundaryMinX + 240 || ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] > _G.BoundaryX - 240 || ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] > _G.BoundaryY - 240)) {
                        footstep = _G.footsteps.concrete[randInt(0, _G.footsteps.concrete.length - 1)].cloneNode(true);
                    } else {
                        footstep = _G.footsteps.grass[randInt(0, _G.footsteps.grass.length - 1)].cloneNode(true);
                    }
                    footstep.volume = 0.1;
                    footstep.play();

                    setTimeout(function() {
                        try {
                            footstep.destroy();
                            foostep = undefined;
                        } catch (e) {}
                    }, 900);
                    /*IF_END*/

                    /*
                    let dust = _G.ents.Create('dust_footstep');
                    dust.pos = [footLeft.x + ply.ent.pos[0] - (footLeft.w*.1), footLeft.y + ply.ent.pos[1]-2];
                    dust.direction = (addPos[0] > 0 ? 1 : -1);
                            dust.Owner = ply.ent;

                            if (typeof ply.FootDust === 'undefined') {
                                ply.FootDust = 0;
                            }
*/
                }
            } else {
                footLeft.y -= 0.36 * speedMultiplier;
                footRight.y += 0.36 * speedMultiplier;


                if (!ply.ent.Punching) {
                    hand.rotate += 0.02 * speedMultiplier;
                    hand.x -= 0.34 * speedMultiplier;
                }

                if (footLeft.y < (footLeft.startY - 8)) {
                    footLeft.moveFoot = true;
                    //soundPlay('footstep-grass' + randInt(1,5), {volume: 0.8});

                    /*IF_CLIENT*/
                    let footstep = false;
                    if (ply.ent.pos[1] < 240) {
                        footstep = _G.footsteps.concrete[randInt(0, _G.footsteps.concrete.length - 1)].cloneNode(true);
                    } else if (!_G.Instance && (ply.ent.pos[0] < _G.BoundaryMinX + 240 || ply.ent.pos[0] + ply.ent.bbox[0] + ply.ent.bbox[2] > _G.BoundaryX - 240 || ply.ent.pos[1] + ply.ent.bbox[1] + ply.ent.bbox[3] > _G.BoundaryY - 240)) {
                        footstep = _G.footsteps.concrete[randInt(0, _G.footsteps.concrete.length - 1)].cloneNode(true);
                    } else {
                        footstep = _G.footsteps.grass[randInt(0, _G.footsteps.grass.length - 1)].cloneNode(true);
                    }
                    footstep.volume = 0.15;
                    footstep.play();
                    /*IF_END*/
                    /*
                    let dust = _G.ents.Create('dust_footstep');
                    dust.pos = [footRight.x + ply.ent.pos[0] - (footRight.w*.3), footRight.y + ply.ent.pos[1]-2];
                    dust.direction = (addPos[0] > 0 ? 1 : -1);
                    if (dust.direction === -1) {
                        dust.pos[1] -= 6;
                    }
                            */
                }
            }

            if (hand.x - handX > 10) {
                hand.x -= ((hand.x - handX - 10) / 4 + 0.34);
            } else if (hand.x - handX < -10) {
                hand.x += ((handX - hand.x - 10) / 4 + 0.34);
            }

        } else if (footLeft.y !== footLeft.startY || footRight.y !== footRight.startY || hand.rotate !== angleToRadians(20) || hand.x !== handX) {

            if (footLeft.y < footLeft.startY) {
                footLeft.y += 0.36;
            } else if (footLeft.y > (footLeft.startY + 0.99)) {
                footLeft.y -= 0.36;
            } else if (footLeft.y > footLeft.startY) {
                footLeft.y = footLeft.startY;
            }

            if (footRight.y < footRight.startY) {
                footRight.y += 0.36;
            } else if (footRight.y > (footRight.startY + 0.99)) {
                footRight.y -= 0.36;
            } else if (footRight.y > footRight.startY) {
                footRight.y = footRight.startY;
            }

            if (!ply.ent.Punching) {
                if (hand.rotate < angleToRadians(18)) {
                    hand.rotate += angleToRadians(2);
                } else if (hand.rotate > angleToRadians(22)) {
                    hand.rotate -= angleToRadians(2);
                } else {
                    hand.rotate = angleToRadians(20);
                }

                if (hand.x < handX) {
                    if ((handX - hand.x) > 3) {
                        hand.x += ((handX - hand.x - 3) / 4 + 0.34);
                    } else {
                        hand.x += 0.34;
                    }

                    if (hand.x > handX) {
                        hand.x = handX;
                    }
                } else if (hand.x > (handX + 0.4)) {
                    if ((hand.x - handX) > 3) {
                        hand.x -= ((hand.x - handX - 3) / 4 + 0.34);
                    } else {
                        hand.x -= 0.34;
                    }

                    if (hand.x < handX) {
                        hand.x = handX;
                    }
                } else {
                    hand.x = handX;
                }
            }

            //console.log(hand.x + '    ' + handX);
        }

        if (ply.ent.Punching) {
            let punchP = (_G.lastTick - ply.ent.Punching > 150) ? (1 - ((_G.lastTick - ply.ent.Punching - 150) / 150)) : (_G.lastTick - ply.ent.Punching) / 150;

            if (punchP < 0) {
                ply.ent.Punching = undefined;
                delete ply.ent.Punching;
                punchP = 0;
            } else if (punchP > 1) {
                punchP = 1;
            }

            hand.x = (ply.lastDir === 'L' ? -19 : 19) * punchP + (ply.lastDir === 'R' ? 48 : 0);
            hand.y = -6 * punchP + 47;
            hand.rotate = (angleToRadians(-44) * punchP);
        }
    }

    /*IF_SERVER*/
    // Lag compensation: snapshot all player positions this tick
    if (typeof _G.lagComp !== 'undefined') {
        _G.lagComp.snapshot();
    }

    let removeEnts = [],
        removeEntObjs = [];
    for (var i = (_G.ents.All.length - 1); i >= 0; i--) {
        if (typeof _G.ents.All[i].ShouldRemove !== 'undefined') {
            removeEnts.push(_G.ents.All[i].EntIndex);
            removeEntObjs.push(_G.ents.All[i]);

            if (_G.ents.PlayersActive.indexOf(_G.ents.All[i]) !== -1) {
                _G.ents.PlayersActive.splice(_G.ents.PlayersActive.indexOf(_G.ents.All[i]), 1)
            }

            _G.ents.All.splice(i, 1);
        }
    }

    if (removeEnts.length > 0) {
        for (var z = 0; z < _G.ents.All.length; z++) {
            if (_G.ents.All[z].ActiveWeapon && removeEntObjs.indexOf(_G.ents.All[z].ActiveWeapon) !== -1) {
                _G.ents.All[z].ActiveWeapon = undefined;
                delete _G.ents.All[z].ActiveWeapon;
            } else if (typeof _G.ents.All[z].Owner === 'object' && removeEntObjs.indexOf(_G.ents.All[z].Owner) !== -1) {
                _G.ents.All[z].Owner = undefined;
            }
        }

        for (var z = 0; z < wsClients.length; z++) {
            wsClients[z].send(JSON.stringify({
                type: 'entRemove',
                data: removeEnts
            }));
        }
    }
    /*IF_END*/

    /*
    }
    }
    for (var i=(_G.ents.All.length-1); i >= 0; i--) {
        _G.ents.All[i].colliding = [];

        if (typeof _G.ents.All[i].ShouldRemove !== 'undefined') {
            _G.ents.All.splice(i, 1);
        }
    }

    for (var i=0; i < _G.ents.All.length; i++) {
        let ent = _G.ents.All[i],
            collidingEnts = [];
                if (typeof ent.bbox === 'object' && ent.bbox[2] === 0 && ent.bbox[3] === 0) {
                    continue;
                }
                if (ent.class === 'player' && typeof _G.playerData[ent.Owner] === 'object' && _G.playerData[ent.Owner].input['L'] === 'undefined' && _G.playerData[ent.Owner].input['R'] === 'undefined' && _G.playerData[ent.Owner].input['U'] === 'undefined' && _G.playerData[ent.Owner].input['D'] === 'undefined' && _G.playerData[ent.Owner].input['V'] === 'undefined' && _G.playerData[ent.Owner].input['E'] === 'undefined') {
                    continue;
                }

        if (typeof ent.bboxs === 'object') {
            for (var k=0; k < ent.bboxs.length; k++) {
                let bboxToPoly = getRectPolygon(ent.pos, ent.bboxs[k], (typeof ent.rotate !== 'undefined' ? ent.rotate : 0))

                let ents = checkCollisions(bboxToPoly, ent.pos, ent.bbox, (i+1), undefined, undefined, ent);

                collidingEnts.push(...ents);
            }
        } else {
            let bboxToPoly = getRectPolygon(ent.pos, ent.bbox, ent.rotate)

            collidingEnts = checkCollisions(bboxToPoly, ent.pos, ent.bbox, (i+1), undefined, undefined, ent);
        }

        if (collidingEnts.length > 0) {
            for (var E=0; E < collidingEnts.length; E++) {
                collidingEnts[E].colliding.push(ent);
                ent.colliding.push(collidingEnts[E]);
            }
        }
    }
            */

    /*IF_CLIENT*/

    for (var i = 0; i < _G.ents.All.length; i++) {
        if (_G.ents.All[i].ThinkClient === true && typeof _G.ents.All[i].ThinkFirst === 'function') {
            _G.ents.All[i].ThinkFirst(lastTick);
        }
        if (_G.ents.All[i].ThinkClient === true && typeof _G.ents.All[i].Think === 'function') {
            _G.ents.All[i].Think(_G.ents.All[i], lastTick);
        }
        if (typeof _G.ents.All[i].ThinkClient === 'function') {
            _G.ents.All[i].ThinkClient(_G.ents.All[i], lastTick);
        }
    }
    /*IF_END*/


    for (var i = 0; i < _G.ents.All.length; i++) {

        /*
        if (_G.ents.All[i].class === 'player' && _G.ents.All[i].invOpen && typeof _G.playerData[_G.ents.All[i].Owner] === 'object' && typeof _G.playerData[_G.ents.All[i].Owner].input['E'] !== 'undefined' && typeof _G.ents.All[i].vInv === 'undefined') {
                let ply = _G.ents.All[i];
                ply.vInv = _G.lastTick;
                if (typeof ply.inv[ply.invSlot] === 'object' && typeof _G.items[ply.inv[ply.invSlot].item].Use === 'function') {
                    let invSlot = ply.invSlot,
                        invItem = ply.inv[invSlot].item;

                    ply.inv[invSlot].am -= 1;

                    if (typeof ply.inv[invSlot].am === 'undefined' || ply.inv[invSlot].am <= 0) {
                        ply.inv.splice(invSlot, 1);
                    }

                    //ply.TakeItem(ply.inv[ply.invSlot].item, 1);
                    _G.items[invItem].Use(ply);
                }
        } else if (typeof _G.ents.All[i].vInv !== 'undefined' && typeof _G.playerData[_G.ents.All[i].Owner].input['E'] === 'undefined') {
            _G.ents.All[i].vInv = undefined;
        }
        */

        if (_G.ents.All[i].skillOpen && _G.lastTick - _G.ents.All[i].skillOpen >= 8200) {
            _G.ents.All[i].skillOpen = undefined;
            delete _G.ents.All[i].skillOpen;
        }

        if (_G.ents.All[i].class === 'player' && typeof _G.playerData[_G.ents.All[i].Owner] === 'object' && !_G.ents.All[i].Dying && typeof _G.playerData[_G.ents.All[i].Owner].input['V'] !== 'undefined') {
            let ply = _G.ents.All[i];

            if (!ply.invOpen) {
                /*
                // Auto equip holstered weapon when pressing attack button with no active weapon
                if (typeof ply.ActiveWeapon !== 'object' && typeof ply.Holstered === 'object') {
                    let oldWep = ply.Holstered;
                    ply.Holstered = undefined;

                    oldWep.Holstered = undefined;
                    oldWep.parent = undefined;
                    oldWep.parentX = undefined;
                    oldWep.parentY = undefined;

                    _G.wep.BasicPickup(oldWep, ply, true);
                }
                */

                // Check if player has a weapon/equip to use
                if (typeof ply.ActiveWeapon !== 'undefined') {
                    /*IF_SERVER*/
                    // Hammer: pickup selected structure (with resource refund) OR build new structure from raw resources
                    if (ply.ActiveWeapon.class === 'hammer' && !ply.PlacingObj) {
                        // Priority 1: pick up any structure the player has already selected (Hammering)
                        let _hamSel = null;
                        for (let _hi = 0; _hi < _G.ents.All.length; _hi++) {
                            if (_G.ents.All[_hi].Hammering === ply) { _hamSel = _G.ents.All[_hi]; break; }
                        }
                        if (_hamSel) {
                            _hamSel.Hammering = undefined;
                            if (_hamSel.Container && _hamSel.Container.length > 0) {
                                ply.ShowNotify('Empty the container first', 2500);
                            } else {
                                // ── Upgrade check: does this structure have an upgrade path? ──
                                let _upDef = _G.buildUpgrades && _G.buildUpgrades[_hamSel.class];
                                if (_upDef) {
                                    let _upCost = _upDef.cost;
                                    let _upCanAfford = true, _upMissMsg = '';
                                    for (let _ui = 0; _ui < _upCost.length; _ui++) {
                                        let _uhave = ply.HasItem(_upCost[_ui].item) || 0;
                                        if (_uhave < _upCost[_ui].am) {
                                            _upCanAfford = false;
                                            let _uiName = (_G.items[_upCost[_ui].item] && _G.items[_upCost[_ui].item].name) || _upCost[_ui].item;
                                            _upMissMsg = 'Upgrade needs ' + _upCost[_ui].am + ' ' + _uiName;
                                            break;
                                        }
                                    }
                                    if (_upCanAfford) {
                                        // Deduct resources, swap class in-place
                                        for (let _ui = 0; _ui < _upCost.length; _ui++) {
                                            ply.TakeItem(_upCost[_ui].item, _upCost[_ui].am);
                                        }
                                        let _upOldClass = _hamSel.class;
                                        _hamSel.class = _upDef.to;
                                        let _newDef = _G.items[_upDef.to];
                                        if (_newDef) {
                                            if (_newDef.bbox) _hamSel.bbox = _newDef.bbox.slice();
                                            if (_newDef.Health && !_hamSel.MaxHealth) _hamSel.MaxHealth = _newDef.Health;
                                            if (_newDef.Health) _hamSel.Health = _newDef.Health;
                                        }
                                        let _upgName = (_G.items[_upDef.to] && _G.items[_upDef.to].name) || _upDef.to;
                                        ply.ShowNotify('Upgraded to ' + _upgName + '!', 2500);
                                        return;
                                    } else {
                                        // Show hint: can also pick up OR upgrade (afford msg)
                                        ply.ShowNotify(_upMissMsg + ' \u2502 Hold V to pick up', 3000);
                                        // Only pick up if player is holding V for > 500ms (gives a "hold to confirm" UX)
                                        if (!ply._hammerHoldV) {
                                            ply._hammerHoldV = _G.lastTick;
                                            return;
                                        }
                                        if (_G.lastTick - ply._hammerHoldV < 600) return;
                                        ply._hammerHoldV = undefined;
                                        // Fall through to normal pickup below
                                    }
                                }
                                ply._hammerHoldV = undefined;
                                let _refRec = _G.buildRecipes && _G.buildRecipes[_hamSel.class];
                                if (_refRec) {
                                    for (let _ri = 0; _ri < _refRec.length; _ri++) {
                                        ply.AddItem(_refRec[_ri].item, Math.ceil(_refRec[_ri].am * 0.75));
                                    }
                                } else {
                                    ply.AddItem(_hamSel.class, 1);
                                }
                                if (_hamSel.class === 'tool_cupboard' && _hamSel.BuildRadius > 600) {
                                    let _radUpg = Math.floor((_hamSel.BuildRadius - 600) / 90);
                                    if (_radUpg > 0) ply.AddItem('upgrade_radius', _radUpg);
                                }
                                let _sname = (_G.items[_hamSel.class] && _G.items[_hamSel.class].name) || _hamSel.class;
                                ply.ShowNotify('Picked up ' + _sname, 2000);
                                _hamSel.ShouldRemove = true;
                            }
                            return;
                        }
                        // Priority 2: build selected piece directly from raw resources
                        if (typeof ply.BuildMenuPiece === 'string') {
                            let _bmCls = ply.BuildMenuPiece;
                            let _bmDef = _G.items[_bmCls];
                            if (typeof _bmDef === 'object' && typeof _bmDef.Use === 'function') {
                                let _bmRec = _G.buildRecipes && _G.buildRecipes[_bmCls];
                                if (_bmRec) {
                                    let _canBuild = true, _missMsg = '';
                                    for (let _ri = 0; _ri < _bmRec.length; _ri++) {
                                        let _have = ply.HasItem(_bmRec[_ri].item) || 0;
                                        if (_have < _bmRec[_ri].am) {
                                            _canBuild = false;
                                            let _iname = (_G.items[_bmRec[_ri].item] && _G.items[_bmRec[_ri].item].name) || _bmRec[_ri].item;
                                            _missMsg = 'Need ' + _bmRec[_ri].am + ' ' + _iname;
                                            break;
                                        }
                                    }
                                    if (_canBuild) {
                                        for (let _ri = 0; _ri < _bmRec.length; _ri++) {
                                            ply.TakeItem(_bmRec[_ri].item, _bmRec[_ri].am);
                                        }
                                        _bmDef.Use(ply);
                                    } else {
                                        ply.ShowNotify(_missMsg, 2000);
                                    }
                                } else {
                                    // Fallback: check pre-crafted item in inventory
                                    let _bmHas = ply.HasItem(_bmCls, 1);
                                    if (_bmHas >= 1) {
                                        for (let _bii = 0; _bii < ply.inv.length; _bii++) {
                                            if (ply.inv[_bii].item === _bmCls) {
                                                ply.inv[_bii].am -= 1;
                                                if (ply.inv[_bii].am <= 0) ply.inv.splice(_bii, 1);
                                                break;
                                            }
                                        }
                                        _bmDef.Use(ply);
                                    } else {
                                        ply.ShowNotify('Need ' + (_bmDef.name || _bmCls) + ' in inventory', 2000);
                                    }
                                }
                                return;
                            }
                        }
                    }
                    /*IF_END*/
                    if (typeof ply.ActiveWeapon.PrimaryAttack === 'function') {
                        ply.LastAttack = _G.lastTick;
                        ply.ActiveWeapon.PrimaryAttack(ply.ActiveWeapon, ply);
                    }
                } else if (!ply.Punching && (!ply.PunchLast || _G.lastTick - ply.PunchLast > 1000) && ply.parts) {
                    ply.PunchLast = _G.lastTick;
                    ply.Punching = _G.lastTick;
                    let fistPart = _G.ents.getPartByName(ply.parts, 'hand');

                    /*IF_SERVER*/
                    if (ply.SpawnProtect) {
                        ply.SpawnProtect = undefined;
                    }

                    for (var ii = 0; ii < _G.ents.All.length; ii++) {
                        if (_G.ents.All[ii] !== ply && typeof _G.ents.All[ii].OnDamage === 'function' && _G.distance(_G.ents.All[ii].pos[0] + _G.ents.All[ii].bbox[0] + _G.ents.All[ii].bbox[2] * .5, _G.ents.All[ii].pos[1] + _G.ents.All[ii].bbox[1] + _G.ents.All[ii].bbox[3] * .5, ply.pos[0] + fistPart.x, ply.pos[1] + fistPart.y) < (_G.ents.All[ii].class.substring(0, 4) === 'tree' ? 67 : (_G.ents.All[ii].class === 'player' ? 60 : 50))) {
                            _G.ents.All[ii].OnDamage(ply, (_G.ents.All[ii].class === 'tree' ? 10 : 6));
                        }
                    }
                    /*IF_END*/
                }
            }
        } else if (typeof _G.ents.All[i].AttackDown !== 'undefined') {
            if (typeof _G.ents.All[i].Owner === 'undefined' || _G.ents.All[i].Owner.ActiveWeapon !== _G.ents.All[i] || typeof _G.playerData[_G.ents.All[i].Owner.Owner].input['V'] === 'undefined') {
                _G.ents.All[i].AttackDown = undefined;
            }
        }
    }


    /*IF_SERVER*/
    let sendEnts = [];
    for (var i = 0; i < _G.ents.All.length; i++) {

        if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Dying) {
            let percent = (Date.now() - _G.ents.All[i].Dying) / 600;
            if (percent > 1) {
                percent = 1;
            }

            _G.ents.All[i].rotate = _G.ents.All[i].DyingRot + angleToRadians(Math.round(percent * 96));
            _G.ents.All[i].rotateTo = _G.ents.All[i].DyingRot + angleToRadians(Math.round(percent * 96));
            _G.ents.All[i].pos = [_G.ents.All[i].DyingPos[0], _G.ents.All[i].DyingPos[1] + Math.round(percent * 35)];
        }


        let calcFrame = (tFrame - lastTick);
        let ent = _G.ents.All[i];
        if (typeof ent.rotateTo !== 'undefined' && ent.rotate !== ent.rotateTo) {
            if (ent.rotateTo > ent.rotate) {
                ent.rotate += 0.0008 * calcFrame;
                if (ent.rotateTo < ent.rotate) {
                    ent.rotate = ent.rotateTo;
                }
            } else if (ent.rotateTo < ent.rotate) {
                ent.rotate -= 0.0008 * calcFrame;
                if (ent.rotateTo > ent.rotate) {
                    ent.rotate = ent.rotateTo;
                }
            }

        }


        if (_G.ents.All[i].NetSend) {
            _G.ents.All[i].NetSend = undefined;
            delete _G.ents.All[i].NetSend;
            sendEnts.push(_G.ents.All[i]);

        }




        let isPly = _G.ents.All[i].class === 'player' && typeof _G.playerData[_G.ents.All[i].Owner] === 'object';

        if (isPly && !_G.ents.All[i].Dying && typeof _G.playerData[_G.ents.All[i].Owner].input['E'] !== 'undefined' && (typeof _G.ents.All[i].LastUseDown === 'undefined' || _G.lastTick - _G.ents.All[i].LastUseDown > 50)) {
            let ply = _G.ents.All[i];
            ply.LastUseDown = _G.lastTick;

            if (typeof ply.craftOpen !== 'undefined') {
                if (typeof ply.useCraft === 'undefined') {
                    let hasItems = true;
                    for (var x = 0; x < ply.craftable[ply.craftKeys[ply.craftSlot]].recipe.length; x++) {
                        if (ply.HasItem(ply.craftable[ply.craftKeys[ply.craftSlot]].recipe[x].item, ply.craftable[ply.craftKeys[ply.craftSlot]].recipe[x].am) === 0) {
                            hasItems = false;
                            break;
                        }
                    }

                    if (typeof ply.craftable[ply.craftKeys[ply.craftSlot]].recipeLevels === 'object') {
                        for (var x = 0; x < ply.craftable[ply.craftKeys[ply.craftSlot]].recipeLevels.length; x++) {
                            if (typeof ply.skills[ply.craftable[ply.craftKeys[ply.craftSlot]].recipeLevels[x].skill] === 'undefined' || ply.skills[ply.craftable[ply.craftKeys[ply.craftSlot]].recipeLevels[x].skill].lvl < ply.craftable[ply.craftKeys[ply.craftSlot]].recipeLevels[x].lvl) {
                                hasItems = false;
                                break;
                            }
                        }
                    }

                    if (!hasItems) {
                        continue;
                    }

                    ply.useCraftTime = (typeof ply.craftable[ply.craftKeys[ply.craftSlot]].time !== 'undefined' ? ply.craftable[ply.craftKeys[ply.craftSlot]].time : 3000);
                    ply.useCraft = _G.lastTick;

                    if (typeof ply.useCraftTimer !== 'undefined') {
                        clearTimeout(ply.useCraftTimer);
                    }

                    ply.failCraft = undefined;

                    ply.useCraftTimer = setTimeout(function() {
                        if (ply.useCraft && typeof ply.craftSlot !== 'undefined' && ply.craftOpen) {
                            for (var z = 0; z < ply.craftable[ply.craftKeys[ply.craftSlot]].recipe.length; z++) {
                                ply.TakeItem(ply.craftable[ply.craftKeys[ply.craftSlot]].recipe[z].item, ply.craftable[ply.craftKeys[ply.craftSlot]].recipe[z].am);
                            }

                            if (typeof ply.craftable[ply.craftKeys[ply.craftSlot]].successChance !== 'undefined') {
                                let randChance = randInt(1, 100);
                                if (randChance > ply.craftable[ply.craftKeys[ply.craftSlot]].successChance) {
                                    ply.useCraftTimer = undefined;
                                    if (ply.craftable[ply.craftKeys[ply.craftSlot]].furnace) {
                                        ply.failCraft = 'Smelt';
                                    } else if (ply.craftable[ply.craftKeys[ply.craftSlot]].fire) {
                                        ply.failCraft = 'Cook';
                                    } else {
                                        ply.failCraft = 'Craft';
                                    }
                                    ply.ShowNotify('Failed to ' + ply.failCraft, 2000);
                                    return;
                                }
                            }

                            ply.failCraft = false;

                            ply.AddItem(ply.craftable[ply.craftKeys[ply.craftSlot]].item, (typeof ply.craftable[ply.craftKeys[ply.craftSlot]].am !== 'undefined' ? ply.craftable[ply.craftKeys[ply.craftSlot]].am : 1));
                            ply.ShowNotify('+' + (typeof ply.craftable[ply.craftKeys[ply.craftSlot]].am !== 'undefined' ? ply.craftable[ply.craftKeys[ply.craftSlot]].am : 1) + ' ' + _G.items[ply.craftable[ply.craftKeys[ply.craftSlot]].item].name, 3000);

                            if (ply.craftable[ply.craftKeys[ply.craftSlot]].anvil) {
                                let craftSound = _G.sounds.hammering.cloneNode(true, ply.pos);
                                craftSound.volume = 0.5;
                                craftSound.play();

                                ply.AddXP('Smithing', ply.craftable[ply.craftKeys[ply.craftSlot]].anvil);
                            } else if (ply.craftable[ply.craftKeys[ply.craftSlot]].furnace) {
                                let craftSound = _G.sounds.furnace.cloneNode(true, ply.pos);
                                craftSound.volume = 0.5;
                                craftSound.play();

                                ply.AddXP('Smithing', ply.craftable[ply.craftKeys[ply.craftSlot]].furnace);
                            } else if (ply.craftable[ply.craftKeys[ply.craftSlot]].fire) {
                                let craftSound = _G.sounds.cook.cloneNode(true, ply.pos);
                                craftSound.volume = 0.5;
                                craftSound.play();

                                ply.AddXP('Cooking', ply.craftable[ply.craftKeys[ply.craftSlot]].fire);
                            } else {
                                let craftSound = _G.sounds.hammering.cloneNode(true, ply.pos);
                                craftSound.volume = 0.5;
                                craftSound.play();
                            }
                        }
                        ply.useCraftTimer = undefined;
                    }, ply.useCraftTime);
                }
            } else {
                if (typeof _G.ents.All[i].Driving !== 'undefined' && typeof _G.ents.All[i].Driving.Use === 'function') {
                    _G.ents.All[i].Driving.Use(_G.ents.All[i].Driving, _G.ents.All[i]);
                } else {
                    let didUse = false;

                    _G.ents.All[i].colliding = _G.ents.Colliding(_G.ents.All[i]);

                    if (_G.ents.All[i].colliding.length > 0) {
                        // Player entity is pressing use key and is colliding with an object, check if any entities have a use function nearby
                        for (var z = _G.ents.All[i].colliding.length - 1; z >= 0; z--) {

                            if (typeof _G.ents.All[i].colliding[z].UseFirst === 'function') {
                                let collider = _G.ents.All[i].colliding[z];
                                // Guard: skip if item already picked up this tick (anti-duplication)
                                if (collider._pickupLockTick === _G.lastTick) { continue; }
                                let useReturn = collider.UseFirst(collider, _G.ents.All[i]);

                                if (useReturn !== false) {
                                    if (useReturn !== true) {
                                        let useSound = _G.sounds.use.cloneNode(true, _G.ents.All[i].pos);
                                        useSound.volume = 0.15;
                                        useSound.play();
                                    }
                                    // Mark item as used this tick so concurrent interactions
                                    // with the same entity cannot double-consume it.
                                    collider._pickupLockTick = _G.lastTick;
                                    didUse = true;
                                    break; // Only process ONE UseFirst per E press
                                } else {
                                    continue;
                                }

                            }
                        }

                        if (!didUse) {
                            for (var z = _G.ents.All[i].colliding.length - 1; z >= 0; z--) {
                                let collider = _G.ents.All[i].colliding[z];

                                if (typeof collider.Use === 'function') {
                                    let useReturn = collider.Use(collider, _G.ents.All[i]);

                                    if (useReturn !== false) {
                                        if (useReturn !== true) {
                                            let useSound = _G.sounds.use.cloneNode(true, _G.ents.All[i].pos);
                                            useSound.volume = 0.15;
                                            useSound.play();
                                        }

                                        didUse = true;
                                    } else {
                                        break;
                                    }

                                }
                                /*
                                if (collider.class === 'weapon_pistol_wood') {
                                    //collider.alpha = 0;
                                    //collider.ShouldRemove = true;
                                    collider.parent = _G.ents.All[i];
                                    collider.parentX = 39;
                                    collider.parentY = 28;
                                }
                                */
                            }
                        }
                    }

                    if (!didUse) {
                        // If nothing was used, check if player has an active weapon to use
                        //console.log(_G.ents.All[i].ActiveWeapon);
                        if (typeof _G.ents.All[i].ActiveWeapon !== 'undefined' && typeof _G.ents.All[i].ActiveWeapon.Use === 'function') {
                            _G.ents.All[i].ActiveWeapon.Use(_G.ents.All[i].ActiveWeapon, _G.ents.All[i])
                        }
                    }
                }
            }
        } else if (isPly && typeof _G.playerData[_G.ents.All[i].Owner].input['E'] === 'undefined' && typeof _G.ents.All[i].useCraft !== 'undefined') {
            _G.ents.All[i].useCraft = undefined;

            if (typeof _G.ents.All[i].useCraftTimer !== 'undefined') {
                clearTimeout(_G.ents.All[i].useCraftTimer);
            }
        }

        if (_G.ents.All[i].class === 'player' && !_G.ents.All[i].OutsideBoundary) {
            if (_G.ents.All[i].pos[0] < _G.BoundaryMin) {
                _G.ents.All[i].pos[0] = _G.BoundaryMin;
            }
            if (_G.ents.All[i].pos[0] + _G.ents.All[i].bbox[2] > _G.BoundaryX) {
                _G.ents.All[i].pos[0] = _G.BoundaryX - _G.ents.All[i].bbox[2];
            }
            if (_G.ents.All[i].pos[1] < _G.BoundaryMinY) {
                _G.ents.All[i].pos[1] = _G.BoundaryMinY;
            }
            if (_G.ents.All[i].pos[1] + _G.ents.All[i].bbox[3] > _G.BoundaryY) {
                _G.ents.All[i].pos[1] = _G.BoundaryY - _G.ents.All[i].bbox[3];
            }

        }

        if (_G.ents.All[i].class === 'player' && typeof _G.playerData[_G.ents.All[i].Owner] === 'object' && _G.ents.All[i].Dying && (Date.now() - _G.ents.All[i].Dying > 5000) && (typeof _G.playerData[_G.ents.All[i].Owner].input['V'] !== 'undefined' || typeof _G.playerData[_G.ents.All[i].Owner].input['U'] !== 'undefined' || typeof _G.playerData[_G.ents.All[i].Owner].input['D'] !== 'undefined' || typeof _G.playerData[_G.ents.All[i].Owner].input['L'] !== 'undefined' || typeof _G.playerData[_G.ents.All[i].Owner].input['R'] !== 'undefined')) {
            _G.ents.All[i].Respawn(_G.ents.All[i]);
        }
        if (typeof _G.ents.All[i].ThinkFirst === 'function') {
            try { _G.ents.All[i].ThinkFirst(lastTick); } catch(e) { console.error('[ThinkFirst]', _G.ents.All[i].class, e.message); }
        }
        if (typeof _G.ents.All[i].Think === 'function') {
            try { _G.ents.All[i].Think(_G.ents.All[i], lastTick); } catch(e) { console.error('[Think]', _G.ents.All[i].class, e.message); }
        }
        if (_G.ents.All[i].Hammering && (typeof _G.ents.All[i].Hammering !== 'object' || typeof _G.ents.All[i].Hammering.ActiveWeapon !== 'object' || _G.ents.All[i].Hammering.ActiveWeapon.class !== 'hammer')) {
            _G.ents.All[i].Hammering = undefined;
            delete _G.ents.All[i].Hammering;
        }
        if (_G.ents.All[i].Moving && (typeof _G.ents.All[i].Moving !== 'object' || typeof _G.ents.All[i].Moving.ActiveWeapon !== 'object' || _G.ents.All[i].Moving.ActiveWeapon.class !== 'hammer')) {
            _G.ents.All[i].Moving = undefined;
            delete _G.ents.All[i].Moving;
        } else if (_G.ents.All[i].Moving) {
            _G.ents.All[i].pos[0] = _G.ents.All[i].MoveOrigin[0] + Math.floor((_G.ents.All[i].Moving.pos[0] - _G.ents.All[i].MoveStart[0]) / 10) * 10;
            _G.ents.All[i].pos[1] = _G.ents.All[i].MoveOrigin[1] + Math.floor((_G.ents.All[i].Moving.pos[1] - _G.ents.All[i].MoveStart[1]) / 10) * 10;
        }

        if (typeof _G.ents.All[i].Dropping !== 'undefined') {
            _G.ents.All[i].Dropping += 1;
            _G.ents.All[i].pos[0] += _G.ents.All[i].DropAdd[0];
            _G.ents.All[i].pos[1] += _G.ents.All[i].DropAdd[1];

            if (_G.ents.All[i].Dropping >= 10) {
                _G.ents.All[i].Dropping = undefined;
                _G.ents.All[i].DropAdd = undefined;
                delete _G.ents.All[i].Dropping;
                delete _G.ents.All[i].DropAdd;
            }
        }
    }

    if (sendEnts.length > 0) {
        for (var z = 0; z < wsClients.length; z++) {
            if (wsClients[z].Hidden) {
                continue;
            }

            wsClients[z].send(JSON.stringify({
                type: 'ent',
                data: sendEnts
            }, function(key, val) {
                if ((key === 'Owner' || key === 'parent' || key === 'ActiveWeapon' || key === 'Target' || key === 'Hammering' || key === 'Moving' || key === 'Mover' || key === 'Holstered' || key === 'IsOpen' || key === 'container' || key === 'Driver' || key === 'Driving' || key === 'Placing' || key === 'PlacingObj') && typeof val === 'object' && typeof val.class === 'string') {
                    return 'ent_id:' + _G.ents.All.indexOf(val);
                } else if (key === 'colliding') {
                    let colliding = [];
                    for (var i = 0; i < val.length; i++) {
                        colliding.push('ent_id:' + _G.ents.All.indexOf(val[i]))
                    }
                    return colliding;
                } else if (key === 'type' && val === 'drawImage') {
                    return 'drawImg';
                } else if (key === '_idlePrev' || key === '_idleNext' || key === 'Timeout') {
                    return null;
                } else if (typeof val === 'undefined') {
                    return '@D_ME@';
                }

                return val;
            }));
        }
    }
    /*IF_END*/

    for (var i = 0; i < _G.ents.All.length; i++) {
        if (typeof _G.ents.All[i].parent !== 'undefined') {
            var ent = _G.ents.All[i],
                parentX = (typeof ent.parentX !== 'undefined' ? ent.parentX : 0),
                parentY = (typeof ent.parentY !== 'undefined' ? ent.parentY : 0);

            if (typeof ent.parentPart !== 'undefined' && ent.parent && ent.parent.parts) {
                var entPart = _G.ents.getPartByName(ent.parent.parts, ent.parentPart);

                if (entPart) {

                    ent.pos[0] = ent.parent.pos[0] + entPart.x + parentX;
                    ent.pos[1] = ent.parent.pos[1] + entPart.y + parentY;

                    if (typeof ent.parent.interpDir !== 'undefined') {
                        if (!ent.bboxOG) {
                            ent.bboxOG = [ent.bbox[0], ent.bbox[1], ent.bbox[2], ent.bbox[3]];
                        }
                        //console.log(ent.parent.interpDir);
                        //console.log(entPart.interpOffset);
                        ent.parts[0].interpDir = ent.parent.interpDir;
                        ent.parts[0].interpOffset = ent.parent.interpOffset;
                        ent.parts[0].rotate = entPart.rotate;
                        //ent.rotate = entPart.rotate;
                        if (typeof ent.parentRotate !== 'undefined') {
                            //ent.rotate += ent.parentRotate;
                            ent.parts[0].rotate += ent.parentRotate;
                        }
                        ent.interpDir = ent.parent.interpDir;
                        ent.interpOffset = ent.parent.interpOffset;

                        if (ent.parent.interpOffset) {
                            ent.bbox = [ent.bboxOG[0] + ent.parent.interpOffset[0] - ent.parts[0].w, ent.bboxOG[1] + ent.parent.interpOffset[1] - ent.parts[0].h, ent.bboxOG[2], ent.bboxOG[3]];
                        } else {
                            ent.bbox = [ent.bboxOG[0] - ent.parts[0].w * .5, ent.bboxOG[1] - ent.parts[0].h * .5, ent.bboxOG[2], ent.bboxOG[3]];
                        }
                    }
                }

                //console.log(ent.parent.lastDir );
                if (ent.parent && ent.parent.class === 'player') {
                    if (typeof _G.playerData[ent.parent.Owner] !== 'undefined' && _G.playerData[ent.parent.Owner].lastDir === 'L') {
                        ent.pos[0] -= (parentX + 15);

                        if (typeof ent.parentOffsetX !== 'undefined') {
                            ent.pos[0] -= ent.parentOffsetX;
                        }
                    } else {
                        if (typeof ent.parentOffsetX !== 'undefined') {
                            ent.pos[0] += ent.parentOffsetX;
                        }
                    }
                } else if (typeof ent.parentOffsetX !== 'undefined') {
                    ent.pos[0] += ent.parentOffsetX;
                }

                if (typeof ent.parentOffsetY !== 'undefined') {
                    ent.pos[1] += ent.parentOffsetY;
                }
            } else if (ent.parent && ent.parent.pos) {
                ent.pos[0] = ent.parent.pos[0] + parentX;
                ent.pos[1] = ent.parent.pos[1] + parentY;
            }

        } else if (_G.ents.All[i].bboxOG) {
            _G.ents.All[i].bbox = [_G.ents.All[i].bboxOG[0], _G.ents.All[i].bboxOG[1], _G.ents.All[i].bboxOG[2], _G.ents.All[i].bboxOG[3]];
            _G.ents.All[i].bboxOG = undefined;
            delete _G.ents.All[i].bboxOG;
        }

        /*
        if (_G.ents.All[i].class === 'wall1') {
            for (var x=0; x <_G.ents.PlayersActive.length; x++) {
                if (_G.ents.All[i].colliding.indexOf(_G.ents.PlayersActive[x]) !== -1) {
                    _G.ents.PlayersActive[x].pos[0] = _G.ents.PlayersActive[x].LastWallPos[0];
                    _G.ents.PlayersActive[x].pos[1] = _G.ents.PlayersActive[x].LastWallPos[1];

                    _G.playerData[_G.ents.PlayersActive[x].Owner].input['D'] = undefined;
                    _G.playerData[_G.ents.PlayersActive[x].Owner].input['U'] = undefined;
                    _G.playerData[_G.ents.PlayersActive[x].Owner].input['L'] = undefined;
                    _G.playerData[_G.ents.PlayersActive[x].Owner].input['R'] = undefined;

                    let posX = (_G.ents.All[i].pos[0]+_G.ents.All[i].bbox[0]+_G.ents.All[i].bbox[2])-_G.ents.PlayersActive[x].pos[0],
                        posY = (_G.ents.All[i].pos[1]+_G.ents.All[i].bbox[1]+_G.ents.All[i].bbox[3])-_G.ents.PlayersActive[x].pos[1];
                    
                    //_G.ents.PlayersActive[x].pos[0] -= 50;
                } else {
                    _G.ents.PlayersActive[x].LastWallPos = _G.ents.PlayersActive[x].pos;
                }
            }
        }
        */
    }

    lastTick = tFrame;
};


/*IF_SERVER*/
// ══════════════════════════════════════════════════════════════════════════════
// Source-style Lag Compensation  (server-only)
// ══════════════════════════════════════════════════════════════════════════════
// Methodology derived from Valve's Source Multiplayer Networking whitepaper:
//   rewindTime = serverTime - oneWayLatency - clientInterpDelay
//
// History is kept for up to MAX_DURATION ms for every player and damageable
// NPC.  Melee and projectile attacks call startForPlayer(), do hit detection
// against the rewound world, then call endRewind() to restore positions.
//
// Key improvements over a naïve snapshot-and-restore:
//  • Separate bbox history lets size-changed entities (crouching etc.) be
//    restored accurately.
//  • Per-entity rewind flag (_lagRewound) prevents double-rewind when two
//    attackers fire in the same tick.
//  • Ping is smoothed with EMA so one laggy packet doesn't over-rewind.
//  • History is purged immediately when an entity is removed (ShouldRemove).
// ──────────────────────────────────────────────────────────────────────────────
_G.lagComp = {
    history: {},      // EntIndex → [{time,x,y}]  oldest→newest
    MAX_DURATION: 1000,
    MAX_ENTRIES: 70,

    // ── record current positions ──────────────────────────────────────────
    snapshot: function() {
        let now = _G.lastTick;
        for (let i = 0; i < _G.ents.All.length; i++) {
            let ent = _G.ents.All[i];
            // Only live, positionable, hittable entities
            if (!ent.pos) continue;
            if (ent.class !== 'player' && typeof ent.OnDamage !== 'function') continue;
            let key = ent.EntIndex;
            if (typeof key !== 'number') continue;

            // Purge history for removed entities immediately
            if (ent.ShouldRemove) {
                if (_G.lagComp.history[key]) {
                    delete _G.lagComp.history[key];
                }
                continue;
            }

            if (!_G.lagComp.history[key]) _G.lagComp.history[key] = [];
            let hist = _G.lagComp.history[key];
            if (hist.length > 0 && hist[hist.length - 1].time === now) continue;
            hist.push({ time: now, x: ent.pos[0], y: ent.pos[1] });
            // Prune tail
            while (hist.length > _G.lagComp.MAX_ENTRIES ||
                   (hist.length > 1 && now - hist[0].time > _G.lagComp.MAX_DURATION)) {
                hist.shift();
            }
        }
    },

    // ── binary-search interpolated position ──────────────────────────────
    getPos: function(entIndex, targetTime) {
        let hist = _G.lagComp.history[entIndex];
        if (!hist || hist.length === 0) return null;
        if (targetTime <= hist[0].time) return { x: hist[0].x, y: hist[0].y };
        let last = hist[hist.length - 1];
        if (targetTime >= last.time) return { x: last.x, y: last.y };
        let lo = 0, hi = hist.length - 1;
        while (lo < hi - 1) {
            let mid = (lo + hi) >> 1;
            if (hist[mid].time <= targetTime) lo = mid; else hi = mid;
        }
        let t0 = hist[lo].time, t1 = hist[hi].time;
        let alpha = (t1 > t0) ? (targetTime - t0) / (t1 - t0) : 1;
        return {
            x: hist[lo].x + (hist[hi].x - hist[lo].x) * alpha,
            y: hist[lo].y + (hist[hi].y - hist[lo].y) * alpha
        };
    },

    // ── rewind all hittable entities; return restore token ────────────────
    rewindAll: function(targetTime) {
        let token = {};
        for (let i = 0; i < _G.ents.All.length; i++) {
            let ent = _G.ents.All[i];
            if (ent.ShouldRemove || !ent.pos) continue;
            if (ent.class !== 'player' && typeof ent.OnDamage !== 'function') continue;
            let key = ent.EntIndex;
            if (typeof key !== 'number') continue;
            if (ent._lagRewound) continue; // already rewound this tick
            let rewound = _G.lagComp.getPos(key, targetTime);
            if (!rewound) continue;
            // Skip if rewind distance is negligible (< 1 px) to avoid FP noise
            let ddx = rewound.x - ent.pos[0], ddy = rewound.y - ent.pos[1];
            if (ddx * ddx + ddy * ddy < 1) continue;
            token[key] = { ent: ent, ox: ent.pos[0], oy: ent.pos[1] };
            ent.pos[0] = rewound.x;
            ent.pos[1] = rewound.y;
            ent._lagRewound = true;
        }
        return token;
    },

    // ── restore all rewound positions ────────────────────────────────────
    endRewind: function(token) {
        if (!token) return;
        for (let key in token) {
            let r = token[key];
            if (r && r.ent && Array.isArray(r.ent.pos)) {
                r.ent.pos[0] = r.ox;
                r.ent.pos[1] = r.oy;
                r.ent._lagRewound = undefined;
            }
        }
    },

    // ── Source formula: rewindTime = now - oneWay - interpDelay ──────────
    // Uses a smoothed (EMA) ping to avoid over-rewind from single-packet spikes.
    startForPlayer: function(ply) {
        if (!ply || !ply.Owner) return null;
        let pd = _G.playerData[ply.Owner];
        let rawPing = (pd && typeof pd.ping === 'number') ? pd.ping : 100;
        // Smooth ping with EMA (alpha=0.15) so a single bad packet doesn't
        // over-compensate.  Store smoothed value back on playerData.
        if (pd) {
            pd._smoothPing = (pd._smoothPing === undefined)
                ? rawPing
                : pd._smoothPing * 0.85 + rawPing * 0.15;
        }
        let smoothPing = (pd && pd._smoothPing !== undefined) ? pd._smoothPing : rawPing;
        let oneWay     = Math.min(smoothPing / 2, 500); // cap at 500 ms
        let interpDelay = 100;  // matches client cl_interp 0.1
        let rewindTime = _G.lastTick - oneWay - interpDelay;
        rewindTime = Math.max(rewindTime, _G.lastTick - _G.lagComp.MAX_DURATION);
        return _G.lagComp.rewindAll(rewindTime);
    }
};
/*IF_END*/

_G.Initialize = function(fTime, override) {

    if (typeof override === 'undefined' && typeof _G.FirstInit !== 'undefined') {
        return;
    }

    _G.FirstInit = fTime;
    //_G.lastTick = performance.now();
    //_G.lastRender = _G.lastTick; // Pretend the first draw was on first update.
    //_G.tickLength = 16; // This sets your simulation to run at 20Hz (50ms)
    //_G.startTick = _G.lastTick;

    /*
            document.getElementById('message').innerHTML = 'WASD to move - E to Use - V to Shoot - C for inventory';
            //document.getElementById('message').innerHTML = 'GAME IN BETA MODE - NOT USING MAIN PLAYER SAVE'
            document.getElementById('message').style['font-size'] = '28px';
*/
    /*IF_CLIENT*/
    document.getElementById('message').style['font-size'] = '25px';
    document.getElementById('message').style['weight'] = '600';
    document.getElementById('message').style['margin-top'] = '-4px';
    document.getElementById('message').innerHTML = '<img src="assets/img/2d-big.png" style="width:32px;top: 8px;position: relative;"> Hobo.Quest';
    //document.getElementById('message').parentNode.removeChild(document.getElementById('message'));
    /*IF_END*/

    _G.Material('assets/img/bush_picked.png');

    /*IF_SERVER*/
    _G.Map = _G.ents.Create('map');
    _G.Map.pos[0] = -762;
    _G.Map.pos[1] = -870;

    /*
    let pistol = _G.ents.Create('weapon_pistol_wood');
    pistol.pos[0] = randInt(20,270);
    pistol.pos[1] = randInt(66, 220);

    let smg = _G.ents.Create('weapon_smg');
    smg.pos[0] = randInt(20,270);
    smg.pos[1] = randInt(66, 220);

    smg = _G.ents.Create('weapon_smg');
    smg.pos[0] = 820+randInt(20,270);
    smg.pos[1] = 340+randInt(66, 220);

    let spawnAmmo = function() {

        let ammoCount = 0;
        for (var i=0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class === 'ammo_pistol' || _G.ents.All[i].class === 'ammo_smg') {
                ammoCount += 1;
            }
        }

        if (ammoCount < 3) {
            let ammo = _G.ents.Create('ammo_pistol');
            ammo.pos[0] = randInt(20, 1870);
            ammo.pos[1] = randInt(66, 220);

            ammo = _G.ents.Create('ammo_smg');
            ammo.pos[0] = randInt(20, 1890);
            ammo.pos[1] = randInt(66, 220);
        }

    };
    setInterval(spawnAmmo, 26000)
    spawnAmmo();
    spawnAmmo();
    spawnAmmo();
    */


    /*
    for (var i=0; i < 4; i++) {
        let rock = _G.ents.Create('rock');
        rock.pos[0] = randInt(310,680);
        rock.pos[1] = randInt(310, 680);
    }
    */
    let lab = false;

    /*
    if (typeof _G.Instance === 'undefined') {
        lab = _G.ents.Create('dick_head');
        lab.pos[0] = 10;
        lab.pos[1] = 372;
        lab.lvl = 1337;
        lab.rotate = angleToRadians(6);
        lab.nametag = 'Dick Head';
        lab.Health = 10000;
        lab.HealthMax = 10000;
    }
    */

    // Spawn trees randomly amongst the map
    /*
    let randOak = randInt(0,13);
    for (var i=0; i < (typeof _G.Instance === 'undefined' ? 14 : 22); i++) {
        lab = _G.ents.Create(i === randOak ? 'tree_oak' : 'tree');
        if (typeof _G.Instance === 'undefined') {
            lab.pos[0] = (i%4)*740+randInt(-150,150)+330;
            lab.pos[1] = Math.floor(i/4)*410+(i%4)+randInt(-60,160)+700;
        } else {
            lab.pos = [randInt(_G.BoundaryMinX+260,_G.BoundaryX-260), randInt(_G.BoundaryMinY+300,_G.BoundaryY-60)]
        }
        lab.rotate = angleToRadians(randInt(-3,3));
        lab.nametag = undefined;
    }
    */

    if (_G.Instance && _G.Instance === 2) {
        let furnace = _G.ents.Create('furnace');
        let anvil = _G.ents.Create('anvil');
    }


    if (!_G.Instance || _G.Instance === 2 || _G.Instance === 1) {
        // Spawn bus for traveling between instances
        lab = _G.ents.Create('bus');
        if (_G.Instance && _G.Instance === 1) {
            lab.GoInstance = undefined;
            lab.bbox = [0, 5, 254, 134];
            lab.parts[0].w = 254;
            lab.parts[0].h = 144;
            lab.parts[0].img = _G.Material('assets/img/shuttle.png');
        } else {
            lab.BusName = 'Truck';
            lab.posStart = [lab.pos[0], lab.pos[1]];
        }

        if (!_G.Instance) {
            let bus2 = _G.ents.Create('bus');
            bus2.GoInstance = 1;
            bus2.pos = [100, 38];
            bus2.posStart = [bus2.pos[0], bus2.pos[1]];
            bus2.bbox = [0, 5, 254, 134];
            bus2.parts[0].w = 254;
            bus2.parts[0].h = 144;
            bus2.parts[0].img = _G.Material('assets/img/shuttle.png');
        }

        if (_G.Instance === 1) {
            // Move bus
            lab.pos = [-400, -185];
            lab.posStart = [lab.pos[0], lab.pos[1]];

            // Create club interior
            _G.MapClub = _G.ents.Create('map_club');

            // Create bank interior
            _G.MapBank = _G.ents.Create('map_bank');


        } else {
            lab = _G.ents.Create('rock_rune');
            lab.pos[0] = randInt(0, 2100) + 600;
            lab.pos[1] = randInt(0, 1500);
        }

    }

    if (!_G.Instance) {
        lab = _G.ents.Create('boat_small');
    }

    /*
    for (var i=0; i < 4; i++) {
                lab = _G.ents.Create('rock_copper');
                lab.pos[0] = randInt(0,2100)+600;
                lab.pos[1] = randInt(0,1500);
    }
    */


    for (var zz = 0; zz < _G.MaxRocks; zz++) {
        let getPos = false,
            attemptPos = 0;
        while (!getPos && attemptPos < 120) {
            attemptPos += 1
            let randPos = [randInt(_G.BoundaryMinX + 40, _G.BoundaryX - 40), randInt(_G.BoundaryMinY + 40, _G.BoundaryY - 40)];

            let nearObj = false;
            for (var i = 0; i < _G.ents.All.length; i++) {
                if (_G.ents.All[i].Placable && _G.distance(randPos[0], randPos[1], _G.ents.All[i].pos[0], _G.ents.All[i].pos[1]) < 340) {
                    nearObj = true;
                }
            }

            if (!nearObj) {
                getPos = randPos;
            }
        }

        if (getPos) {
            let newlab = _G.ents.Create(randInt(0, 1) === 1 ? 'rock_tin' : 'rock_copper');
            newlab.pos[0] = getPos[0];
            newlab.pos[1] = getPos[1];
        }
    }

    for (var zz = 0; zz < _G.MaxIron; zz++) {
        let getPos = false,
            attemptPos = 0;
        while (!getPos && attemptPos < 120) {
            attemptPos += 1
            let randPos = [randInt(_G.BoundaryMinX + 40, _G.BoundaryX - 40), randInt(_G.BoundaryMinY + 40, _G.BoundaryY - 40)];

            let nearObj = false;
            for (var i = 0; i < _G.ents.All.length; i++) {
                if (_G.ents.All[i].Placable && _G.distance(randPos[0], randPos[1], _G.ents.All[i].pos[0], _G.ents.All[i].pos[1]) < 340) {
                    nearObj = true;
                }
            }

            if (!nearObj) {
                getPos = randPos;
            }
        }

        if (getPos) {
            let newlab = _G.ents.Create('rock_iron');
            newlab.pos[0] = getPos[0];
            newlab.pos[1] = getPos[1];
        }
    }

    _G.coalSpot = [randInt(_G.BoundaryMinX + 600, _G.BoundaryX - 600), randInt(_G.BoundaryMinY + 100, _G.BoundaryY - 600)];

    if (_G.MaxCoal > 0) {

        if (_G.Instance && _G.Instance === 2) {
            let npc = _G.ents.Create('npc_goblin');
            npc.pos = [_G.coalSpot[0], _G.coalSpot[1]];
            npc.posStart = [npc.pos[0], npc.pos[1]];

            setInterval(function() {
                let foundGob = false;
                for (var zz = 0; zz < _G.ents.All.length; zz++) {
                    if (_G.ents.All[zz].class === 'npc_goblin') {
                        foundGob = true;
                        break;
                    }
                }

                if (!foundGob) {
                    let npc = _G.ents.Create('npc_goblin');
                    npc.pos = [_G.coalSpot[0], _G.coalSpot[1]];
                    npc.posStart = [npc.pos[0], npc.pos[1]];
                }
            }, 460000);

            setInterval(function() {
                let foundGuard = false;
                for (var zz = 0; zz < _G.ents.All.length; zz++) {
                    if (_G.ents.All[zz].class === 'npc_guard_noob') {
                        foundGuard = true;
                        break;
                    }
                }

                if (!foundGuard) {
                    let guard = _G.ents.Create('npc_guard_noob');
                    guard.pos = [50, 828];
                    guard.posStart = [guard.pos[0], guard.pos[1]];
                    guard.nametag = 'Camp Guard';
                    guard.lvl = 4;
                }
            }, 460000);


            let guard = _G.ents.Create('npc_guard_noob');
            guard.pos = [150, 828];
            guard.posStart = [guard.pos[0], guard.pos[1]];
            guard.nametag = 'Camp Guard';
            guard.lvl = 4;

            for (var i = 0; i < _G.MaxCats; i++) {
                let cat = _G.ents.Create('npc_cat');
                cat.pos = [randInt(0, 4500) + 500, randInt(0, 2500) + 500];
                cat.posStart = [cat.pos[0], cat.pos[1]];
            }

            setInterval(function() {
                let foundCats = 0;
                for (var zz = 0; zz < _G.ents.All.length; zz++) {
                    if (_G.ents.All[zz].class === 'npc_cat') {
                        foundCats += 1;
                    }
                }

                if (foundCats < _G.MaxCats) {

                    for (var i = 0; i < _G.MaxCats - foundCats; i++) {
                        let cat = _G.ents.Create('npc_cat');
                        cat.pos = [randInt(0, 4500) + 500, randInt(0, 2500) + 500];
                        cat.posStart = [cat.pos[0], cat.pos[1]];
                    }

                }
            }, 290000);


        }

        for (var zz = 0; zz < _G.MaxCoal; zz++) {
            let getPos = false,
                attemptPos = 0;
            while (!getPos && attemptPos < 120) {
                attemptPos += 1
                //let randPos = [randInt(_G.BoundaryMinX+40,_G.BoundaryX-40), randInt(_G.BoundaryMinY+40,_G.BoundaryY-40)];
                let randPos = [_G.coalSpot[0] + randInt(0, 600), _G.coalSpot[1] + randInt(0, 600)]

                let nearObj = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (_G.ents.All[i].Placable && _G.distance(randPos[0], randPos[1], _G.ents.All[i].pos[0], _G.ents.All[i].pos[1]) < 340) {
                        nearObj = true;
                    }
                }

                if (!nearObj) {
                    getPos = randPos;
                }
            }

            if (getPos) {
                let newlab = _G.ents.Create('rock_coal');
                newlab.pos[0] = getPos[0];
                newlab.pos[1] = getPos[1];
            }
        }
    }

    _G.RestockVendors = function() {
        for (var zz = 0; zz < _G.ents.All.length; zz++) {
            if (typeof _G.ents.All[zz].RestockVendor === 'function') {
                _G.ents.All[zz].RestockVendor();
            }
        }
        /*
                for (var zz=0; zz < _G.ents.All.length; zz++) {
                    if (_G.ents.All[zz].class === 'seller') {
                        let sellCont = _G.ents.All[zz].Container,
                            foundIt = false;
                        for (var xx=0; xx < sellCont.length; xx++) {
                            if (sellCont[xx].item === 'methylamine') {
                                foundIt = sellCont[xx];
                                break;
                            }
                        }

                        if (foundIt === false) {
                            sellCont.push({
                                item: 'methylamine',
                                am: 4
                            });
                        } else {
                            foundIt.am = 4;
                        }

                        foundIt = false;
                        for (var xx=0; xx < sellCont.length; xx++) {
                            if (sellCont[xx].item === 'lab_upgrade') {
                                foundIt = sellCont[xx];
                                break;
                            }
                        }

                        if (foundIt === false) {
                            sellCont.push({
                                item: 'lab_upgrade',
                                am: 1
                            });
                        }
                    } else if (_G.ents.All[zz].class === 'dick_head') {
                        let sellCont = _G.ents.All[zz].Container,
                            foundIt = false;
                        
                        for (var xx=0; xx < sellCont.length; xx++) {
                            if (sellCont[xx].item === 'upgrade_radius') {
                                foundIt = sellCont[xx];
                                break;
                            }
                        }

                        if (foundIt === false) {
                            _G.ents.All[zz].Container = [{
                                item: 'upgrade_radius',
                                am: 1
                            }, ...sellCont];
                        }
                        //console.log('dick')
                    } else if (_G.ents.All[zz].class === 'dick_chips') {
                        let sellCont = _G.ents.All[zz].Container,
                            foundIt = {};
                        for (var xx=0; xx < sellCont.length; xx++) {
                            foundIt[sellCont[xx].item] = sellCont[xx];
                        }

                        if (!foundIt['scratch_lamp']) {
                            sellCont.push({
                                item: 'scratch_lamp',
                                am: 5
                            });
                        } else {
                            foundIt['scratch_lamp'].am = 999;
                        }
                    }
                }
                */
    };

    setInterval(_G.RestockVendors, 60000);
    setTimeout(_G.RestockVendors, 5000);

    setInterval(function() {

        let totalRocks = 0,
            totalIron = 0,
            totalCoal = 0;
        for (var cc = 0; cc < _G.ents.All.length; cc++) {
            if (_G.ents.All[cc].class === 'rock_tin' || _G.ents.All[cc].class === 'rock_copper') {
                totalRocks += 1;
            } else if (_G.ents.All[cc].class === 'rock_iron') {
                totalIron += 1;
            } else if (_G.ents.All[cc].class === 'rock_coal') {
                totalCoal += 1;
            }
        }

        if (totalRocks < _G.MaxRocks) {
            for (var xx = 0; xx < (_G.MaxRocks - totalRocks); xx++) {
                let getPos = false,
                    attemptPos = 0;
                while (!getPos && attemptPos < 120) {
                    attemptPos += 1
                    let randPos = [randInt(_G.BoundaryMinX + 40, _G.BoundaryX - 40), randInt(_G.BoundaryMinY + 40, _G.BoundaryY - 40)];

                    let nearObj = false;
                    for (var dd = 0; dd < _G.ents.All.length; dd++) {
                        if (_G.ents.All[dd].Placable && _G.distance(randPos[0], randPos[1], _G.ents.All[dd].pos[0], _G.ents.All[dd].pos[1]) < 340) {
                            nearObj = true;
                        }
                    }

                    if (!nearObj) {
                        getPos = randPos;
                    }
                }

                if (getPos) {
                    lab = _G.ents.Create(randInt(0, 1) === 1 ? 'rock_tin' : 'rock_copper');
                    lab.pos[0] = getPos[0];
                    lab.pos[1] = getPos[1];
                }
            }
        }

        if (totalIron < _G.MaxIron) {
            for (var xx = 0; xx < (_G.MaxIron - totalIron); xx++) {
                let getPos = false,
                    attemptPos = 0;
                while (!getPos && attemptPos < 120) {
                    attemptPos += 1
                    let randPos = [randInt(_G.BoundaryMinX + 40, _G.BoundaryX - 40), randInt(_G.BoundaryMinY + 40, _G.BoundaryY - 40)];
                    //let randPos = [_G.coalSpot[0]+randInt(0,600), _G.coalSpot[1]+randInt(0,600)]

                    let nearObj = false;
                    for (var dd = 0; dd < _G.ents.All.length; dd++) {
                        if (_G.ents.All[dd].Placable && _G.distance(randPos[0], randPos[1], _G.ents.All[dd].pos[0], _G.ents.All[dd].pos[1]) < 340) {
                            nearObj = true;
                        }
                    }

                    if (!nearObj) {
                        getPos = randPos;
                    }
                }

                if (getPos) {
                    lab = _G.ents.Create('rock_iron');
                    lab.pos[0] = getPos[0];
                    lab.pos[1] = getPos[1];
                }
            }
        }


        if (totalCoal < _G.MaxCoal) {
            for (var xx = 0; xx < (_G.MaxCoal - totalCoal); xx++) {
                let getPos = false,
                    attemptPos = 0;
                while (!getPos && attemptPos < 120) {
                    attemptPos += 1
                    //let randPos = [randInt(_G.BoundaryMinX+40,_G.BoundaryX-40), randInt(_G.BoundaryMinY+40,_G.BoundaryY-40)];
                    let randPos = [_G.coalSpot[0] + randInt(0, 600), _G.coalSpot[1] + randInt(0, 600)]

                    let nearObj = false;
                    for (var dd = 0; dd < _G.ents.All.length; dd++) {
                        if (_G.ents.All[dd].Placable && _G.distance(randPos[0], randPos[1], _G.ents.All[dd].pos[0], _G.ents.All[dd].pos[1]) < 340) {
                            nearObj = true;
                        }
                    }

                    if (!nearObj) {
                        getPos = randPos;
                    }
                }

                if (getPos) {
                    let coal = _G.ents.Create('rock_coal');
                    coal.pos[0] = getPos[0];
                    coal.pos[1] = getPos[1];
                }
            }
        }

    }, _G.Instance ? 580000 : 600000)


    /*
                    for (var i=0; i < 8; i++) {
                        lab = _G.ents.Create('bush');
                        lab.pos[0] = (i%3)*1080+randInt(-170,170)+690;
                        lab.pos[1] = Math.floor(i/2)*410+(i%2)+randInt(-60,160)+1100;
                        lab.rotate = angleToRadians(randInt(-3,3));
                        lab.nametag = undefined;
                    }
    */

    setTimeout(function() {
        _G.ents.RestoreEnts(override);
    }, 10);

    // After entities are restored, clean up trees that are inside player bases.
    // Wait 6 seconds so RestoreEnts has fully run and placed all entities.
    setTimeout(function() {
        let removedTrees = 0;
        for (let ti = 0; ti < _G.ents.All.length; ti++) {
            let tEnt = _G.ents.All[ti];
            if (!tEnt || tEnt.ShouldRemove) continue;
            if (tEnt.class !== 'tree' && tEnt.class !== 'tree_oak') continue;
            for (let ci = 0; ci < _G.ents.All.length; ci++) {
                let tc = _G.ents.All[ci];
                if (tc.ShouldRemove || tc.class !== 'tool_cupboard' || !tc.BuildOrigin) continue;
                let tcX = tc.pos[0] + tc.bbox[0] + tc.bbox[2] * 0.5 + tc.BuildOrigin[0];
                let tcY = tc.pos[1] + tc.bbox[1] + tc.bbox[3] * 0.5 + tc.BuildOrigin[1];
                if (_G.distance(tEnt.pos[0], tEnt.pos[1], tcX, tcY) < tc.BuildRadius / 2) {
                    tEnt.ShouldRemove = true;
                    removedTrees++;
                    break;
                }
            }
        }
        if (removedTrees > 0) {
            console.log('[TreeCleanup] Removed ' + removedTrees + ' tree(s) inside player bases.');
        }
    }, 6000);
    /*IF_END*/
};

_G.Render = async function(tFrameClient) {
    //let tFrame = (tFrameClient - _G.offsetTick)+(_G.startTick);
    let tFrame = performance.now() - _G.offsetTick;
    _G.stopMain = window.requestAnimationFrame(_G.Render);

    /*
    var nextTick = _G.lastTick + _G.tickLength;
    var numTicks = 0;

    // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    // Note: As we mention in summary, you should keep track of how large numTicks is.
    // If it is large, then either your game was asleep, or the machine cannot keep up.
    if (tFrame > nextTick) {
        var timeSinceTick = tFrame - _G.lastTick;
        numTicks = Math.floor( timeSinceTick / _G.tickLength );
    }

            if (numTicks > 6) { numTicks = 6; }

    queueUpdates( numTicks );
            */

    render(tFrame);
    _G.lastRender = tFrame;

    if (!_G.Hidden && !_G.HiddenWait && tFrame - _G.lastTick >= 16) {
        _G.Think(tFrame);
    }

}

_G.Think = function(tFrame) {
    var nextTick = _G.lastTick + _G.tickLength;
    var numTicks = 0;

    // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    // Note: As we mention in summary, you should keep track of how large numTicks is.
    // If it is large, then either your game was asleep, or the machine cannot keep up.
    if (tFrame > nextTick) {
        var timeSinceTick = tFrame - _G.lastTick;
        numTicks = Math.floor(timeSinceTick / _G.tickLength);
    }

    if (numTicks > 6000) {
        numTicks = 6000;
    }

    queueUpdates(numTicks);
}

function queueUpdates(numTicks) {
    for (var i = 0; i < numTicks; i++) {
        _G.lastTick = _G.lastTick + _G.tickLength; // Now lastTick is this tick.
        _G.Tick(_G.lastTick).catch(function(e) {
            console.error('[Tick] Unhandled error:', e && e.message ? e.message : e);
        });
    }
}

_G.Initialize(pNow);

_G.Think(pNow); // Start the cycle

/*IF_SERVER*/

setInterval(function() {
    _G.Think(performance.now());
}, 16);
/*IF_END*/

/*
    setInterval(function() {
        _G.Think(performance.now());
    }, 1);
*/
const typeOf = o => Object.prototype.toString.call(o);
const isObject = o => o !== null && !Array.isArray(o) && typeOf(o).split(" ")[1].slice(0, -1) === "Object";

const isPrimitive = o => {
    switch (typeof o) {
        case "object": {
            return false;
        }
        case "function": {
            return false;
        }
        default: {
            return true;
        }
    }
};

const getChanges = (previous, current) => {
    if (isPrimitive(previous) && isPrimitive(current)) {
        if (previous === current) {
            return '@UN_C@';
        }

        return current;
    }

    if (isObject(previous) && isObject(current)) {
        const diff = getChanges(Object.entries(previous), Object.entries(current));

        return diff.reduce((merged, [key, value]) => {
            return {
                ...merged,
                [key]: value
            }
        }, {});
    }

    const changes = [];

    if (JSON.stringify(previous) === JSON.stringify(current)) {
        return changes;
    }

    let currentByKey = [];
    for (let i = 0; i < current.length; i++) {
        const item = current[i];

        if (typeof current[i] === 'object' && current[i] instanceof Array) {
            currentByKey[current[i][0]] = current[i][1];
        }

        if (JSON.stringify(item) !== JSON.stringify(previous[i])) {
            changes.push(item);
        }
    }

    for (let i = 0; i < previous.length; i++) {
        //console.log(current[i])

        if ((typeof previous[i] === 'object' && previous[i] instanceof Array && previous[i].length > 1) && (typeof currentByKey[previous[i][0]] === 'undefined')) {
            changes.push([previous[i][0], '@D_ME@']);
        }
    }

    return changes;
};

/*IF_SERVER*/

let lastEnts = [];
setInterval(function() {

    let changes = {};
    for (var x = 0; x < _G.ents.All.length; x++) {
        let parseEnt = JSON.parse(JSON.stringify(_G.ents.All[x], function(key, val) {
            if ((key === 'Owner' || key === 'parent' || key === 'ActiveWeapon' || key === 'Target' || key === 'Hammering' || key === 'Moving' || key === 'Mover' || key === 'Holstered' || key === 'IsOpen' || key === 'container' || key === 'Driver' || key === 'Driving' || key === 'Placing' || key === 'PlacingObj') && typeof val === 'object' && typeof val.class === 'string') {
                return 'ent_id:' + _G.ents.All.indexOf(val);
            } else if (key === 'colliding') {
                let colliding = [];
                for (var i = 0; i < val.length; i++) {
                    colliding.push('ent_id:' + _G.ents.All.indexOf(val[i]))
                }
                return colliding;
            } else if (key === 'type' && val === 'drawImage') {
                return 'drawImg';
            } else if (key === '_idlePrev' || key === '_idleNext' || key === 'Timeout') {
                return null;
            } else if (typeof val === 'undefined') {
                return '@D_ME@';
            }

            return val;
        }));
        //  console.log(parseEnt);

        if (typeof lastEnts[_G.ents.All[x].EntIndex] === 'undefined') {
            changes[_G.ents.All[x].EntIndex] = parseEnt;
        } else {
            let foundChanges = getChanges(lastEnts[_G.ents.All[x].EntIndex], parseEnt);
            if (Object.keys(foundChanges).length > 0) {
                changes[_G.ents.All[x].EntIndex] = foundChanges;
                //console.log(foundChanges);
            }
        }

        lastEnts[_G.ents.All[x].EntIndex] = parseEnt;
    }

    if (Object.keys(changes).length > 0) {

        for (var i = 0; i < wsClients.length; i++) {
            if (_G.lastTick - wsClients[i].ConnectedAt < 1000) {
                continue;
            }
            if (wsClients[i].Hidden) {
                continue;
            }

            wsClients[i].send(JSON.stringify({
                type: 'entUpdate',
                tick: _G.lastTick,
                data: changes
            }));
        }
    }
    //console.log(getChanges(lastEnts))

    /*
            wsClients[i].send(JSON.stringify({type: 'ents', tick: _G.lastTick, data: (_G.ents.All)}, function(key, val) {
                if ((key === 'Owner' || key === 'parent' || key === 'ActiveWeapon' || key === 'Holstered' || key === 'IsOpen' || key === 'container' || key === 'Driver' || key === 'Driving' || key === 'Placing' || key === 'PlacingObj') && typeof val === 'object' && typeof val.class === 'string') {
                return 'ent_id:' + _G.ents.All.indexOf(val);
                } else if (key === 'colliding') {
                let colliding = [];
                for (var i=0; i < val.length; i++) {
                    colliding.push('ent_id:' + _G.ents.All.indexOf(val[i]))
                }
                return colliding;
                } else if (key === 'type' && val === 'drawImage') {
                return 'drawImg';
                } else if (key === '_idlePrev' || key === '_idleNext' || key === 'Timeout') {
                        return null;
                        }

                return val;
            }));
            */
}, 64)
/*IF_END*/

/*IF_SERVER*/
// ── ZOMBIE SPAWN SYSTEM ───────────────────────────────────────────────────────
// Spawn zombies periodically in open areas outside player bases.
// Main map (Instance 0): max 1 zombie.
// Other survival instances: up to 8 zombies.
// Skip the ship instance (3).
setInterval(function() {
    if (_G.Instance === 3) return;

    let isMainMap = !_G.Instance;
    let maxZombies = isMainMap ? 1 : 8;

    let zombieCount = 0;
    for (let zi = 0; zi < _G.ents.All.length; zi++) {
        if (!_G.ents.All[zi].ShouldRemove && _G.ents.All[zi].class === 'npc_zombie') {
            zombieCount++;
        }
    }
    if (zombieCount >= maxZombies) return;

    // Find dick_head NPC position(s) to avoid spawning near them
    let dickHeadPositions = [];
    for (let di = 0; di < _G.ents.All.length; di++) {
        if (!_G.ents.All[di].ShouldRemove && _G.ents.All[di].class === 'dick_head' && _G.ents.All[di].pos) {
            dickHeadPositions.push([_G.ents.All[di].pos[0], _G.ents.All[di].pos[1]]);
        }
    }

    // Pick a random position outside all tool_cupboard base radii,
    // away from spawn point, and away from dick_head NPCs.
    let spawnPos = false;
    for (let attempt = 0; attempt < 30; attempt++) {
        let testPos = [
            randInt(_G.BoundaryMinX + 150, _G.BoundaryX - 150),
            randInt(_G.BoundaryMinY + 150, _G.BoundaryY - 150)
        ];
        let bad = false;

        // Avoid spawning in the player spawn area (first ~800 world units)
        if (isMainMap && testPos[0] < 900 && testPos[1] < 900) {
            bad = true;
        }

        // Avoid tool_cupboard bases
        if (!bad) {
            for (let bi = 0; bi < _G.ents.All.length; bi++) {
                let tc = _G.ents.All[bi];
                if (tc.ShouldRemove || tc.class !== 'tool_cupboard' || !tc.BuildOrigin) continue;
                let tcX = tc.pos[0] + tc.bbox[0] + tc.bbox[2] * 0.5 + tc.BuildOrigin[0];
                let tcY = tc.pos[1] + tc.bbox[1] + tc.bbox[3] * 0.5 + tc.BuildOrigin[1];
                if (_G.distance(testPos[0], testPos[1], tcX, tcY) < tc.BuildRadius / 2 + 100) {
                    bad = true;
                    break;
                }
            }
        }

        // Avoid dick_head NPC (don't spawn within 600px)
        if (!bad) {
            for (let di = 0; di < dickHeadPositions.length; di++) {
                if (_G.distance(testPos[0], testPos[1], dickHeadPositions[di][0], dickHeadPositions[di][1]) < 700) {
                    bad = true;
                    break;
                }
            }
        }

        // Avoid being too close to any online player (don't spawn on top of them)
        if (!bad) {
            for (let pi = 0; pi < _G.ents.All.length; pi++) {
                let _pp = _G.ents.All[pi];
                if (_pp.class !== 'player' || _pp.ShouldRemove || _pp.Dying) continue;
                if (_G.distance(testPos[0], testPos[1], _pp.pos[0], _pp.pos[1]) < 350) {
                    bad = true;
                    break;
                }
            }
        }

        if (!bad) {
            spawnPos = testPos;
            break;
        }
    }

    if (!spawnPos) return;

    let zombie = _G.ents.Create('npc_zombie');
    zombie.pos = [spawnPos[0], spawnPos[1]];
    zombie.posStart = [spawnPos[0], spawnPos[1]];
    zombie._isMainMapZombie = isMainMap;

    // Wrap the default NPC Think to add base avoidance + combat behaviours
    let origZombieThink = zombie.Think;
    zombie.Think = function(selfZ) {
        // ── Rage mode: disabled on main map (too small, unfair) ───────────
        if (!selfZ._isMainMapZombie) {
            if (typeof selfZ.Health === 'number' && selfZ.Health > 0 &&
                selfZ.Health / selfZ.HealthMax < 0.4) {
                if (!selfZ._raging) {
                    selfZ._raging = true;
                    selfZ._baseSpeed = selfZ._baseSpeed || selfZ.Speed;
                    selfZ._baseAttackDamage = selfZ._baseAttackDamage || selfZ.AttackDamage;
                }
                selfZ.AttackDamage = selfZ._baseAttackDamage * 1.5;
            } else if (selfZ._raging) {
                selfZ._raging = false;
                selfZ.AttackDamage = selfZ._baseAttackDamage || 8;
            }
        }

        // ── Variable speed lunge: faster when close to target ─────────────
        let _baseSpd = selfZ._baseSpeed || 0.85;
        if (selfZ.Target && typeof selfZ.Target === 'object' && selfZ.Target.pos) {
            let _dtTarget = _G.distance(selfZ.pos[0], selfZ.pos[1], selfZ.Target.pos[0], selfZ.Target.pos[1]);
            if (_dtTarget < 200) {
                let _lungeMultiplier = 1.5 + (1 - _dtTarget / 200) * 0.7;
                if (selfZ._raging) _lungeMultiplier *= 1.3;
                selfZ.Speed = _baseSpd * _lungeMultiplier;
            } else {
                selfZ.Speed = selfZ._raging ? _baseSpd * 1.3 : _baseSpd;
            }
        } else {
            selfZ.Speed = _baseSpd;
        }

        // ── Dodge: briefly move perpendicular when player attacks nearby ──
        // Detects a recent player weapon fire (LastAttack on the target) and
        // darts sideways for 400 ms so the hit lands behind the zombie.
        if (!selfZ._isMainMapZombie && selfZ.Target && typeof selfZ.Target === 'object'
            && selfZ.Target.pos && !selfZ._dodgeUntil) {
            let _tgt = selfZ.Target;
            let _tgtAttackAt = _tgt.LastAttack || 0;
            // Detect a fresh attack (within the last 220 ms)
            if (_tgtAttackAt && _G.lastTick - _tgtAttackAt < 220) {
                let _dist2 = _G.distance(selfZ.pos[0], selfZ.pos[1], _tgt.pos[0], _tgt.pos[1]);
                if (_dist2 < 260) {
                    // Dodge perpendicular to the player-zombie axis
                    let _ax = selfZ.pos[0] - _tgt.pos[0];
                    let _ay = selfZ.pos[1] - _tgt.pos[1];
                    let _len = Math.sqrt(_ax * _ax + _ay * _ay) || 1;
                    // Perpendicular unit vector (rotated 90°)
                    let _px = -_ay / _len;
                    let _py = _ax / _len;
                    // Randomly pick left or right flank
                    let _side = (randInt(0, 1) === 0 ? 1 : -1);
                    let _dodgeSpd = _baseSpd * 2.2;
                    selfZ._dodgeVec = [_px * _side * _dodgeSpd, _py * _side * _dodgeSpd];
                    selfZ._dodgeUntil = _G.lastTick + 380;
                }
            }
        }

        // Apply dodge velocity override
        if (selfZ._dodgeUntil) {
            if (_G.lastTick < selfZ._dodgeUntil) {
                let _dv = selfZ._dodgeVec;
                if (_dv) {
                    selfZ.pos[0] += _dv[0];
                    selfZ.pos[1] += _dv[1];
                }
                // Skip normal AI movement this tick
                // (still run the rest of the think for state updates)
                selfZ._skipMove = true;
            } else {
                selfZ._dodgeUntil = undefined;
                selfZ._dodgeVec = undefined;
                selfZ._skipMove = false;
            }
        }

        // ── Attack telegraph: slow down briefly before a charge lunge ──────
        // 600 ms before the next allowed attack, the zombie slows to 40% speed
        // giving the player a visual "wind-up" window to dodge.
        if (selfZ.Target && typeof selfZ.Target === 'object' && selfZ.Target.pos) {
            let _timeSinceLast = _G.lastTick - (selfZ.LastAttack || 0);
            let _cooldown = selfZ.AttackSpeed + selfZ.AttackDelay;
            let _windUpWindow = 600;
            if (_timeSinceLast > _cooldown - _windUpWindow && _timeSinceLast <= _cooldown) {
                // Telegraph phase: pull back speed (only when in attack range)
                let _distToTgt = _G.distance(selfZ.pos[0], selfZ.pos[1], selfZ.Target.pos[0], selfZ.Target.pos[1]);
                if (_distToTgt < 140) {
                    selfZ.Speed = Math.min(selfZ.Speed, _baseSpd * 0.4);
                    selfZ._telegraphing = true;
                }
            } else if (selfZ._telegraphing && _timeSinceLast > _cooldown) {
                // Charge: brief speed surge right as attack is allowed
                selfZ._telegraphing = false;
                if (!selfZ._chargingUntil) {
                    selfZ._chargingUntil = _G.lastTick + 220;
                }
            }
            if (selfZ._chargingUntil) {
                if (_G.lastTick < selfZ._chargingUntil) {
                    selfZ.Speed = _baseSpd * (selfZ._raging ? 3.5 : 2.8);
                } else {
                    selfZ._chargingUntil = undefined;
                }
            }
        }

        // ── Target position prediction: aim at where player will be ────────
        // Leads the target by 200 ms of estimated movement so the zombie
        // does not perpetually trail a running player.
        if (selfZ.Target && typeof selfZ.Target === 'object' && selfZ.Target.pos) {
            let _tgt = selfZ.Target;
            if (_tgt.posLast && _tgt.pos) {
                let _vx = _tgt.pos[0] - _tgt.posLast[0];
                let _vy = _tgt.pos[1] - _tgt.posLast[1];
                // Project 200 ms ahead (each tick ≈ 16 ms, so 12–13 ticks)
                let _lead = 12;
                if (!selfZ.TargetOffset) selfZ.TargetOffset = [0, 0];
                selfZ._leadOffset = [_vx * _lead, _vy * _lead];
            } else {
                selfZ._leadOffset = undefined;
            }
        } else {
            selfZ._leadOffset = undefined;
        }

        // ── Group spacing: push zombies apart so they don't clump ─────────
        // Each zombie nudges away from others within 60 px to spread out.
        if (!selfZ._isMainMapZombie && !selfZ._skipMove) {
            for (let _gi = 0; _gi < _G.ents.All.length; _gi++) {
                let _gb = _G.ents.All[_gi];
                if (_gb === selfZ || _gb.ShouldRemove || _gb.class !== 'npc_zombie') continue;
                let _sep = _G.distance(selfZ.pos[0], selfZ.pos[1], _gb.pos[0], _gb.pos[1]);
                if (_sep < 60 && _sep > 0) {
                    let _fx = (selfZ.pos[0] - _gb.pos[0]) / _sep;
                    let _fy = (selfZ.pos[1] - _gb.pos[1]) / _sep;
                    selfZ.pos[0] += _fx * 0.4;
                    selfZ.pos[1] += _fy * 0.4;
                }
            }
        }

        // ── Pack hunting alert: disabled on main map ───────────────────────
        if (!selfZ._isMainMapZombie) {
            if (!selfZ._hadTarget && selfZ.Target && typeof selfZ.Target === 'object'
                && selfZ.Target.class === 'player') {
                selfZ._hadTarget = true;
                for (let _pi = 0; _pi < _G.ents.All.length; _pi++) {
                    let _peer = _G.ents.All[_pi];
                    if (_peer === selfZ || _peer.ShouldRemove || _peer.class !== 'npc_zombie') continue;
                    if (_peer.Target && typeof _peer.Target === 'object' && _peer.Target.class === 'player') continue;
                    if (_G.distance(_peer.pos[0], _peer.pos[1], selfZ.pos[0], selfZ.pos[1]) < 400) {
                        _peer.Target = selfZ.Target;
                        // Each pack member approaches from a different flank angle
                        let _angle = randInt(0, 7) * (Math.PI / 4);
                        _peer.TargetOffset = [Math.cos(_angle) * randInt(20, 55), Math.sin(_angle) * randInt(15, 45)];
                    }
                }
            } else if (!selfZ.Target) {
                selfZ._hadTarget = false;
            }
        }

        // Apply lead offset into TargetOffset for this tick only
        let _savedTargetOffset = selfZ.TargetOffset;
        if (selfZ._leadOffset && selfZ.TargetOffset) {
            selfZ.TargetOffset = [
                selfZ.TargetOffset[0] + selfZ._leadOffset[0],
                selfZ.TargetOffset[1] + selfZ._leadOffset[1]
            ];
        } else if (selfZ._leadOffset) {
            selfZ.TargetOffset = [selfZ._leadOffset[0], selfZ._leadOffset[1]];
        }

        // ── Base avoidance: drop target if it is inside a player base ──────
        if (selfZ.Target && typeof selfZ.Target === 'object' && selfZ.Target.pos) {
            let tpos = selfZ.Target.pos;
            for (let bi = 0; bi < _G.ents.All.length; bi++) {
                let tc = _G.ents.All[bi];
                if (tc.ShouldRemove || tc.class !== 'tool_cupboard' || !tc.BuildOrigin) continue;
                let tcX = tc.pos[0] + tc.bbox[0] + tc.bbox[2] * 0.5 + tc.BuildOrigin[0];
                let tcY = tc.pos[1] + tc.bbox[1] + tc.bbox[3] * 0.5 + tc.BuildOrigin[1];
                if (_G.distance(tpos[0], tpos[1], tcX, tcY) < tc.BuildRadius / 2) {
                    selfZ.Target = undefined;
                    break;
                }
            }
        }

        // Skip base movement when dodge is active
        if (!selfZ._skipMove) {
            origZombieThink(selfZ);
        }

        // Restore original TargetOffset after the base Think ran
        selfZ.TargetOffset = _savedTargetOffset;
        selfZ._skipMove = false;
    };
}, 45000);
/*IF_END*/

if (_G.CLIENT) {
    _G.Render(pNow);
}

var ws = false,
    chat = false;


let isConnecting = false,
    isConnected = false;
let chatSendInitAttempt = async function() {

    chat.send(JSON.stringify({
        message: 'test',
        token: window.rsToken,
        owner_id: '49782',
        robot_id: '3341',
        gre_token: 'check-if-cached',
        tts_price: 0
    }));
};

let chatSendInit = function() {
    // Send initial chat message (try every 5 seconds just in case it fails the first time)
    isConnecting = setInterval(chatSendInitAttempt, 5000);
    chatSendInitAttempt();
};

function sendChat(msg) {
    if (!_G.IsLocal) {
        if (typeof chatBot !== 'undefined' && chatBot && typeof chatBot.readyState === 'number' && chatBot.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.OPEN : 1)) {
            chatBot.send(JSON.stringify({
                type: 'Chat',
                msg: (_G.IsLocal ? '[LOCAL] ' : '') + msg
            }));
        } else {
            console.log('[RS Chat] sendChat skipped, chat socket not open', chatBot && chatBot.readyState);
        }
    }

    for (var i = 0; i < wsClients.length; i++) {
        wsClients[i].send(JSON.stringify({
            type: 'Chat',
            msg: msg,
            user: 'ChatBot'
        }));
    }
}

_G.sendChat = sendChat;

function find(username) {
    for (var i = 0; i < _G.ents.All.length; i++) {
        if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === username) {
            return _G.ents.All[i];
        }
    }
    return false;
}
window.Player = function(username) {
    for (var i = 0; i < _G.ents.All.length; i++) {
        if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === username) {
            return _G.ents.All[i];
        }
    }
    return false;
}


/*IF_SERVER*/

function chatConnect() {
    let robotId = _G.SecondStream ? '7025' : '3341';
    let defaultHost = '208-113-134-124.robotstreamer.com';
    let defaultPort = 8765;
    let useSecure = true;
    let ownerId = '49782';
    let chatSocket;
    let chatPing;

    function createChatSocket(host, port, secure, owner_id) {
        let scheme = secure ? 'wss' : 'ws';
        chatSocket = new WebSocket(scheme + '://' + host + ':' + port + '/');
        console.log('[RS Chat] connecting to', scheme + '://' + host + ':' + port + '/', 'robot_id=' + robotId, 'owner_id=' + owner_id);

        chatSocket.onopen = function() {
            console.log('[RS Chat] opened connection with RS chat, sending join string...');
            chatSocket.send(JSON.stringify({
                type: 'connect',
                message: 'joined',
                token: window.rsToken,
                robot_id: robotId,
                owner_id: owner_id
            }));
        };

        chatSocket.onmessage = function(e) {
            console.log(e.data);
            try {
                _G.hook.Call('OnChat', JSON.parse(e.data));
            } catch (err) {
                console.log('[RS Chat] failed to parse incoming message', err, e.data);
            }
        };

        chatSocket.onerror = function(event) {
            console.log('[RS Chat] websocket error', event && event.message ? event.message : event);
        };

        chatSocket.onclose = function(event) {
            console.log('[RS Chat] connection closed', 'code=' + (event && event.code), 'reason=' + (event && event.reason), 'retrying...');
            if (chatPing) {
                clearInterval(chatPing);
                chatPing = null;
            }
            setTimeout(chatConnect, 1000);
        };

        /*
        chatPing = setInterval(function() {
            if (chatSocket && chatSocket.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.OPEN : 1)) {
                chatSocket.send(JSON.stringify({
                    message: '',
                    robot_id: robotId,
                    owner_id: owner_id,
                    gre_token: 'check-if-cached',
                    tts_price: 0
                }));
            } else {
                console.log('[RS Chat] ping skipped, socket not open', chatSocket && chatSocket.readyState);
            }
        }, 22000);
        */

        _G.RSChat = chatSocket;
    }

    fetch('https://api.robotstreamer.com/v1/robot_page_load', {
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        },
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            token: window.rsToken,
            robot_id: robotId
        }),
        credentials: 'omit'
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        let host = defaultHost;
        let port = defaultPort;

        if (useSecure && data && data.chat_ssl && typeof data.chat_ssl.host === 'string') {
            host = data.chat_ssl.host;
            port = data.chat_ssl.port;
        } else if (data && data.chat_service && typeof data.chat_service.host === 'string') {
            host = data.chat_service.host;
            port = data.chat_service.port;
        } else if (data && data.chat && typeof data.chat.host === 'string') {
            host = data.chat.host;
            port = data.chat.port;
        }

        if (data && data.owner) {
            ownerId = data.owner;
        } else if (data && data.title_data && data.title_data.owner_id) {
            ownerId = data.title_data.owner_id;
        }

        console.log('[RS Chat] robot_page_load selected endpoint', { host: host, port: port, ownerId: ownerId, useSecure: useSecure });
        createChatSocket(host, port, useSecure, ownerId);
    }).catch(function(err) {
        console.log('[RS Chat] robot_page_load failed', err);
        createChatSocket(defaultHost, defaultPort, useSecure, ownerId);
    });
}

function getVideoId(url) {
    let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
    let res = regex.exec(url);

    return (res && res.length > 3) ? res[3] : false;
}

_G.hook.Add('OnChat', 'Network chat to clients', function(chat) {

    if ((typeof chat.username === 'string' && chat.username.substring(0, 4) === 'anon') && (typeof chat.user_id === 'undefined' || parseInt(chat.user_id) !== 0)) {
        return;
    }

    if (typeof chat.username !== 'undefined' && chat.username.length > 0 && typeof chat.message !== 'undefined') {
        let chatMsg = chat.message.toLowerCase().trim();
        if (chatMsg.substring(0, 1) === '.') {
            chatMsg = chatMsg.substring(1);
        }

        for (var i = 0; i < wsClients.length; i++) {
            if (wsClients[i].authStr !== false && wsClients[i].authStr === chatMsg) {
                let shouldAuth = true;

                if (_G.Instance) {
                    let foundPly = false,
                        nameLow = chat.username.toLowerCase().trim();
                    for (var ii = 0; ii < _G.ents.All.length; ii++) {
                        if (_G.ents.All[ii].class === 'player' && _G.ents.All[ii].Owner === nameLow) {
                            foundPly = true;
                            break;
                        }
                    }

                    if (!foundPly) {
                        // Player does not exist in the current instance, send them back to main game world

                        // Send session ID to main game for auto client auth when they load the page
                        let userAuth = RandomString(64);

                        try {
                            wsMaster.send(JSON.stringify({
                                type: 'AuthToken',
                                user: chat.username.toLowerCase().trim(),
                                auth: userAuth,
                                instance: 0
                            }));
                        } catch (e) {}

                        // Send URL location change to client with the auth token
                        wsClients[i].send(JSON.stringify({
                            type: 'LocationChange',
                            url: '/?T=' + Date.now() + '#Auth=' + userAuth
                        }));
                        shouldAuth = false;
                    }
                }

                if (shouldAuth) {
                    wsClients[i].authUser = chat.username.toLowerCase().trim();
                    wsClients[i].send(JSON.stringify({
                        type: 'localplayer',
                        username: wsClients[i].authUser
                    }));
                    console.log('Authed ' + wsClients[i].authUser);
                    wsClients[i].authStr = false;
                    wsClients[i].send(JSON.stringify({
                        type: 'authed'
                    }));

                    _G.RSControl.onmessage({
                        data: JSON.stringify({
                            user: wsClients[i].authUser,
                            command: 'R',
                            key_position: 'up'
                        })
                    });
                }

                break;
            }
        }
        if (typeof chat.robot_id !== 'undefined' && chat.robot_id !== '3341') {
            return;
        }

        let foundPly = false,
            chatLow = chat.username.trim().toLowerCase();
        for (var i = 0; i < _G.ents.All.length; i++) {
            if (typeof _G.ents.All[i].Owner === 'string' && _G.ents.All[i].class === 'player' && _G.ents.All[i].username.toLowerCase() === chatLow) {
                foundPly = _G.ents.All[i];
                break;
            }
        }

        if (foundPly) {

            if (chat.message.trim().toLowerCase().indexOf('!suicide') !== -1) {
                foundPly.OnDamage(foundPly, 99999999);
            }


            /*
                                if (chat.message.trim().toLowerCase().indexOf('!title') !== -1) {
                                    let newTitle = chat.message.substring(chat.message.trim().toLowerCase().indexOf('!title')+6).trim();
                                    if (newTitle.length > 0) {
                                        //foundPly.title = newTitle;

                                        chatBot.send(JSON.stringify({
                                            type: 'Title',
                                            username:  chat.username,
                                            title: newTitle
                                        }));
                                    }
                                }
                                */
            if (chat.message.trim().toLowerCase().indexOf('!yt') === 0) {
                let parseYT = chat.message.substring(chat.message.trim().toLowerCase().indexOf('!yt') + 3).trim();
                if (parseYT.length > 0) {
                    try {
                        parseYT = getVideoId(parseYT);
                    } catch (e) {
                        parseYT = false;
                    }
                }

                if (parseYT && parseYT.length > 0) {
                    let hasCharms = foundPly.HasItem('charms', 1)
                    if (hasCharms >= 3) {

                        sendChat('Attempting to retrieve information from YouTube video...');

                        let ytInfo = spawn('youtube-dl', ['--dump-json', '--skip-download', parseYT]),
                            ytJSON = '';

                        ytInfo.stdout.on('data', function(data) {
                            console.log(`stdout: ${ data }`);
                            if (ytJSON !== false) {
                                ytJSON += data.toString();
                            }
                        });

                        ytInfo.stderr.on('data', function(data) {
                            ytJSON = false;
                        });

                        ytInfo.on('close', function(code) {
                            let ytData = false;
                            try {
                                ytData = JSON.parse(ytJSON);
                            } catch (e) {
                                ytData = false;
                            }

                            //console.log(ytData);

                            if (typeof ytData === 'object' && typeof ytData.duration !== 'undefined') {

                                let hasCharms = foundPly.HasItem('charms', 1)
                                if (hasCharms >= 3) {
                                    console.log('youtube duration ' + ytData.duration);
                                    _G.YTVideo = parseYT;
                                    _G.YTTime = _G.lastTick;
                                    _G.YTPos = [foundPly.pos[0], foundPly.pos[1]];
                                    _G.YTLength = parseInt(ytData.duration);

                                    foundPly.TakeItem('charms', 3);
                                    sendChat('@' + chat.username + ' spent 3 charms to play ' + (typeof ytData.title === 'string' ? ('"' + ytData.title + '"') : 'YouTube video') + ' (' + ytData.duration + ' sec, ' + (typeof ytData.view_count === 'number' ? ytData.view_count : '?') + ' views)');
                                    for (var zz = 0; zz < wsClients.length; zz++) {
                                        wsClients[zz].send(JSON.stringify({
                                            type: 'YTVideo',
                                            pos: foundPly.pos,
                                            id: parseYT,
                                            start: _G.lastTick - _G.YTTime,
                                            length: _G.YTLength
                                        }));
                                    }
                                }
                            } else {
                                sendChat('@' + chat.username + ' failed to retrieve information on YouTube video');
                            }
                        });

                    } else {
                        sendChat('@' + chat.username + ' need 3 charms to play YouTube video');
                    }
                } else {
                    sendChat('@' + chat.username + ' invalid YouTube URL');
                }

            }

            if (chat.message.trim().toLowerCase().indexOf('!text') !== -1) {
                let newTitle = chat.message.substring(chat.message.trim().toLowerCase().indexOf('!text') + 5).trim();
                if (newTitle.length > 0) {
                    //foundPly.title = newTitle;
                    if (newTitle.length > 54) {
                        newTitle = newTitle.substring(0, 54);
                    }

                    let nearSign = false,
                        nearDist = 99999;

                    for (var i = 0; i < _G.ents.All.length; i++) {
                        if (_G.ents.All[i].class === 'text_sign' && _G.ents.All[i].Owner === foundPly.Owner && _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], foundPly.pos[0], foundPly.pos[1]) < nearDist) {
                            nearSign = _G.ents.All[i];
                            nearDist = _G.distance(_G.ents.All[i].pos[0], _G.ents.All[i].pos[1], foundPly.pos[0], foundPly.pos[1]);
                        }
                    }

                    if (nearSign) {
                        nearSign.SignText = newTitle;
                    }

                    sendChat('Updated text sign nearest to you @' + chat.username)
                }
            }

            if (chat.message.trim().toLowerCase().indexOf('!pickup') === 0) {
                let foundEnt = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (typeof _G.ents.All[i].Hammering === 'object' && _G.ents.All[i].Hammering === foundPly && !_G.ents.All[i].ShouldRemove) {
                        if (_G.ents.All[i].Container && _G.ents.All[i].Container.length > 0) {
                            sendChat('@' + chat.username + ' container must be empty');

                            break;
                        } else {
                            let pickupStr = '@' + chat.username + ' you picked up ' + (typeof _G.items[_G.ents.All[i].class] !== 'undefined' ? _G.items[_G.ents.All[i].class].name : _G.ents.All[i].class);

                            foundPly.AddItem(_G.ents.All[i].class, 1);

                            if (_G.ents.All[i].class === 'tool_cupboard' && _G.ents.All[i].BuildRadius > 600) {
                                let radiusUpgrades = Math.floor((_G.ents.All[i].BuildRadius - 600) / 90);
                                if (radiusUpgrades > 0) {
                                    foundPly.AddItem('upgrade_radius', radiusUpgrades);
                                    pickupStr += '. Refunded ' + radiusUpgrades + ' radius upgrades.';
                                }
                            }

                            sendChat(pickupStr);
                            foundPly.ShowNotify('Picked up ' + (typeof _G.items[_G.ents.All[i].class] !== 'undefined' ? _G.items[_G.ents.All[i].class].name : _G.ents.All[i].class), 2000);

                            _G.ents.All[i].ShouldRemove = true;

                            break;
                        }
                    }
                }
            }

            // !upgrade — upgrade a hammered wall to the next tier
            // wood → stone (wall-wood → wall1), no downgrade
            if (chat.message.trim().toLowerCase().indexOf('!upgrade') === 0) {
                let _upgradeTiers = {
                    'wall-wood':      { next: 'wall1',      cost: [{ item: 'metal', am: 30 }],   name: 'Stone Wall' },
                    'wall-wood-half': { next: 'wall1-half', cost: [{ item: 'metal', am: 15 }],   name: 'Stone Half-Wall' },
                    'door-wood':      { next: 'forcefield', cost: [{ item: 'metal', am: 20 }],   name: 'Metal Door' }
                };
                let _upgDone = false;
                for (let _ui = 0; _ui < _G.ents.All.length; _ui++) {
                    let _ue = _G.ents.All[_ui];
                    if (typeof _ue.Hammering !== 'object' || _ue.Hammering !== foundPly || _ue.ShouldRemove) continue;
                    let _tier = _upgradeTiers[_ue.class];
                    if (!_tier) {
                        sendChat('@' + chat.username + ' this object cannot be upgraded');
                        _upgDone = true;
                        break;
                    }
                    // Check & consume cost
                    let _canAfford = true;
                    for (let _ci = 0; _ci < _tier.cost.length; _ci++) {
                        let _have = foundPly.HasItem(_tier.cost[_ci].item) || 0;
                        if (_have < _tier.cost[_ci].am) {
                            sendChat('@' + chat.username + ' you need ' + _tier.cost[_ci].am + 'x ' + _tier.cost[_ci].item + ' to upgrade to ' + _tier.name + ' (have ' + _have + ')');
                            _canAfford = false;
                            break;
                        }
                    }
                    if (!_canAfford) { _upgDone = true; break; }
                    for (let _ci = 0; _ci < _tier.cost.length; _ci++) {
                        foundPly.TakeItem(_tier.cost[_ci].item, _tier.cost[_ci].am);
                    }
                    // Swap entity class & parts in place
                    let _newPl = _G.placable[_tier.next];
                    if (_newPl) {
                        let _newEnt = _G.ents.Create(_tier.next);
                        _newEnt.pos = [_ue.pos[0], _ue.pos[1]];
                        _newEnt.rotate = _ue.rotate;
                        _newEnt.Owner = _ue.Owner;
                        _newEnt.Placable = true;
                        if (_ue.BuildOrigin) _newEnt.BuildOrigin = _ue.BuildOrigin;
                        _ue.ShouldRemove = true;
                        _ue.Hammering = undefined;
                        sendChat('@' + chat.username + ' upgraded to ' + _tier.name + '!');
                        foundPly.ShowNotify('Upgraded to ' + _tier.name, 2500);
                    }
                    _upgDone = true;
                    break;
                }
                if (!_upgDone) {
                    sendChat('@' + chat.username + ' hammer an object first (!upgrade to upgrade wall tier)');
                }
            }

            if (chat.message.trim().toLowerCase().indexOf('!origin') === 0) {
                let foundEnt = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (typeof _G.ents.All[i].Hammering === 'object' && _G.ents.All[i].Hammering === foundPly && _G.ents.All[i].class === 'tool_cupboard' && !_G.ents.All[i].ShouldRemove) {
                        sendChat('@' + chat.username + ' move to change Tool Cupboard origin, !save to save it');

                        _G.ents.All[i].PreviewOrigin = [_G.ents.All[i].BuildOrigin[0], _G.ents.All[i].BuildOrigin[1]];
						foundPly.PreviewOrigin = true;
                        _G.ents.All[i].PreviewOriginPly = foundPly;
                        _G.ents.All[i].PreviewOriginPos = [foundPly.pos[0], foundPly.pos[1]];

                        break;
                    }
                }
            }

            if (chat.message.trim().toLowerCase().indexOf('!save') === 0) {
                let foundEnt = false;
                for (var i = 0; i < _G.ents.All.length; i++) {
                    if (typeof _G.ents.All[i].Hammering === 'object' && _G.ents.All[i].Hammering === foundPly && _G.ents.All[i].class === 'tool_cupboard' && !_G.ents.All[i].ShouldRemove && _G.ents.All[i].PreviewOrigin) {
                        let checkPos = [_G.ents.All[i].pos[0] + _G.ents.All[i].PreviewOrigin[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].PreviewOrigin[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5];

                        if (_G.distance(checkPos[0], checkPos[1], _G.ents.All[i].pos[0], _G.ents.All[i].pos[1]) > 270) {
                            sendChat('@' + chat.username + ' this origin is too far from your Tool Cupboard');
                            break;
                        }

                        let foundCup = false;
                        for (var zz = 0; zz < _G.ents.All.length; zz++) {
                            if (_G.ents.All[zz].class === 'tool_cupboard' && _G.ents.All[zz].Owner !== _G.ents.All[i].Owner && _G.distance(_G.ents.All[zz].pos[0] + _G.ents.All[zz].bbox[0] + _G.ents.All[zz].bbox[2] * .5 + _G.ents.All[zz].BuildOrigin[0], _G.ents.All[zz].pos[1] + _G.ents.All[zz].bbox[1] + _G.ents.All[zz].bbox[3] * .5 + _G.ents.All[zz].BuildOrigin[1], checkPos[0], checkPos[1]) < (_G.ents.All[zz].BuildRadius / 2) + 10) {
                                foundCup = true;
                                break;
                            }
                        }

                        if (foundCup) {
                            sendChat('@' + chat.username + ' this origin is too close to another player\'s Tool Cupboard');
                            break;
                        }

                        sendChat('@' + chat.username + ' saved build origin for your Tool Cupboard');

                        _G.ents.All[i].BuildOrigin = [_G.ents.All[i].PreviewOrigin[0], _G.ents.All[i].PreviewOrigin[1]];

                        _G.ents.All[i].PreviewOrigin = undefined;
						_G.ents.All[i].PreviewOriginPly.PreviewOrigin = undefined;
                        _G.ents.All[i].PreviewOriginPly = undefined;
                        _G.ents.All[i].PreviewOriginPos = undefined;
                        delete _G.ents.All[i].PreviewOrigin;
                        delete _G.ents.All[i].PreviewOriginPly;
                        delete _G.ents.All[i].PreviewOriginPos;

                        break;
                    }
                }
            }


            if (chat.message.trim().toLowerCase().indexOf('!exe') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                let evalR = false;
                try {
                    evalR = eval(chat.message.substring(4));
                } catch (e) {
                    evalR = e;
                }

                if (typeof evalR === 'object' && typeof evalR.message !== 'undefined') {
                    sendChat(evalR.message + '');
                }
            } else if (chat.message.trim().toLowerCase().indexOf('!backupexport') === 0 && chat.username.trim().toLowerCase() === 'goosely' && !_G.IsLocal) {

                let backupExport = chat.message.substring(13).trim();

                if (backupExport === 'now') {
                    if (chatBot && chatBot.readyState === 1) chatBot.send(JSON.stringify({
                        type: 'Backup',
                        id: Date.now(),
                        data: _G.ents.GetSaveData(),
                        instance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0)
                    }));
                } else if (typeof _G.ents.Backups[backupExport] !== 'undefined') {

                    if (chatBot && chatBot.readyState === 1) chatBot.send(JSON.stringify({
                        type: 'Backup',
                        id: backupExport,
                        data: _G.ents.Backups[backupExport],
                        instance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0)
                    }));

                    sendChat('Exporting backup to chatbot...');
                } else {
                    sendChat('Backup with ID "' + backupExport + '" not found')
                }
            } else if (chat.message.trim().toLowerCase().indexOf('!backupload') === 0 && chat.username.trim().toLowerCase() === 'goosely') {

                let backupLoad = chat.message.substring(11).trim();

                if (typeof _G.ents.Backups[backupLoad] !== 'undefined') {
                    sendChat('Loading backup...');

                    _G.Initialize(_G.lastTick, backupLoad);

                } else {
                    sendChat('Backup with ID "' + backupLoad + '" not found')
                }
            } else if (chat.message.trim().toLowerCase().indexOf('!backuplist') === 0 && chat.username.trim().toLowerCase() === 'goosely') {

                sendChat('Backups: ' + Object.keys(_G.ents.Backups).join(', '));
            } else if (chat.message.trim().toLowerCase().indexOf('!playerexport') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                let backupExport = Date.now();

                if (chatBot && chatBot.readyState === 1) chatBot.send(JSON.stringify({
                    type: 'PlayerData',
                    id: backupExport,
                    data: _G.playerSaves,
                    instance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0)
                }));

                sendChat('Sending playerSaves to chatbot...');
            } else if (chat.message.trim().toLowerCase().indexOf('!movemode') === 0 && chat.username.trim().toLowerCase() === 'goosely') {

                foundPly.ActiveWeapon.MoveMode = true;
            } else if (chat.message.trim().toLowerCase().indexOf('!add') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                let parseItem = chat.message.trim().substring(4).trim();

                if (parseItem.split(' ').length > 1) {
                    let parseAm = 1;
                    try {
                        let parseIt = parseInt(parseItem.split(' ')[1].trim());
                        if (typeof parseIt === 'number' && parseIt > 1) {
                            parseAm = parseIt
                        }
                    } catch (e) {}

                    foundPly.AddItem(parseItem.split(' ')[0], parseAm)
                } else {
                    foundPly.AddItem(parseItem, 1)
                }


            } else if (chat.message.trim().toLowerCase().indexOf('!make') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                let parseItem = chat.message.trim().substring(5).trim();
                let entCreate = _G.ents.Create(parseItem);
                entCreate.pos = [foundPly.pos[0], foundPly.pos[1]];

            } else if (chat.message.trim().toLowerCase().indexOf('!zoom') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                _G.viewport.zoom = parseFloat(chat.message.trim().substring(5).trim());
                _G.viewport.zoomTo = parseFloat(chat.message.trim().substring(5).trim());
            } else if (chat.message.trim().toLowerCase().indexOf('!hax') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                if (typeof foundPly.SpeedHax === 'undefined') {
                    foundPly.SpeedHax = _G.lastTick;
                } else {
                    foundPly.SpeedHax = undefined;
                    delete foundPly.SpeedHax;
                }
            } else if (chat.message.trim().toLowerCase().indexOf('!camlock') === 0 && chat.username.trim().toLowerCase() === 'goosely') {

                _G.CamLock = !_G.CamLock;
            } else if (chat.message.trim().toLowerCase().indexOf('!cam') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                _G.viewport.x = parseFloat(chat.message.trim().substring(4).trim().split(' ')[0]);
                _G.viewport.xTo = parseFloat(chat.message.trim().substring(4).trim().split(' ')[0]);
                _G.viewport.y = parseFloat(chat.message.trim().substring(4).trim().split(' ')[1]);
                _G.viewport.yTo = parseFloat(chat.message.trim().substring(4).trim().split(' ')[1]);
            } else if (chat.message.trim().toLowerCase().indexOf('!camban') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                _G.banned[chat.message.substring(8).toLowerCase().trim()] = true;

                sendChat('[HoboQuest] Cam banned ' + chat.message.substring(7).toLowerCase().trim());

                if (_G.ents.PlayersActive.indexOf(_G.ents.PlayersByName[chat.message.substring(8).toLowerCase().trim()]) !== -1) {
                    _G.ents.PlayersActive.splice(_G.ents.PlayersActive.indexOf(_G.ents.PlayersByName[chat.message.substring(8).toLowerCase().trim()]), 1);
                }
            } else if (chat.message.trim().toLowerCase().indexOf('!backup') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                _G.ents.SaveEnts(true);
            } else if (chat.message.trim().toLowerCase().indexOf('!xcontrol') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                _G.XControl = !_G.XControl;
            } else if (chat.message.trim().toLowerCase().indexOf('!debug') === 0 && chat.username.trim().toLowerCase() === 'goosely') {
                _G.ents.Debug = !_G.ents.Debug;
            } else if (chat.message.trim().toLowerCase().indexOf('!level') === 0) {
                let statStr = '';

                let skillKeys = Object.keys(foundPly.skills);
                for (var z = 0; z < skillKeys.length; z++) {
                    statStr += (skillKeys[z] + ': LVL ' + foundPly.skills[skillKeys[z]].lvl + ' [' + (foundPly.skills[skillKeys[z]].xp - _G.LevelToXP(foundPly.skills[skillKeys[z]].lvl)) + '/' + (_G.LevelToXP(foundPly.skills[skillKeys[z]].lvl + 1) - _G.LevelToXP(foundPly.skills[skillKeys[z]].lvl)) + '] ');
                }
                sendChat(statStr);
            }

            chat.username = chat.username.toLowerCase().trim();

            /*
            _G.chats[chat.username] = (typeof _G.chats[chat.username] === 'object' ? _G.chats[chat.username] : []);

            chat.sent_at = Date.now();
            chat.fade_in = (chat.sent_at + 330);
            chat.fade_at = chat.sent_at + 3840 + (chat.message.length > 7 ? ((chat.message.length-7)*130) : 0);
            chat.scaleY = 0;
            chat.posY = 0;

            if (chat.message.length > 32) {
                chat.message = chat.message.substring(0, 31) + '...';

            }

            _G.chats[chat.username].push(chat);
            */

            let jsonChatMsg = JSON.stringify({
                type: 'Chat',
                msg: chat.message,
                user: chat.username,
                time: _G.lastTick
            });
            for (var i = 0; i < wsClients.length; i++) {
                wsClients[i].send(jsonChatMsg);
            }

            _G.ChatCache.push(jsonChatMsg);

            if (_G.ChatCache.length > 15) {
                _G.ChatCache.splice(0, _G.ChatCache.length - 15);
            }

        }
    }
});

/*IF_END*/

setInterval(function() {
    for (var i = (_G.ents.PlayersActive.length - 1); i >= 0; i--) {
        let ply = _G.ents.PlayersActive[i];
        if (!ply) {
            _G.ents.PlayersActive.splice(i, 1);
            continue;
        }

        let plyKey = (typeof ply.username !== 'undefined' ? ply.username : (typeof ply.ip !== 'undefined' ? ('ip-|-' + ply.ip) : false)),
            plyLastActive = (typeof ply.inputLast !== 'undefined' ? ply.inputLast : ((typeof _G.playerData[plyKey] !== 'undefined' && typeof _G.playerData[plyKey].inputLast !== 'undefined') ? _G.playerData[plyKey].inputLast : false));


        //console.log(plyKey + ' last input ' + (Date.now() - plyLastActive));

        if (plyLastActive !== false && (_G.lastTick - plyLastActive) >= 23000) {
            if (typeof _G.playerData[plyKey] === 'object') {

                _G.playerData[plyKey].input = {};
                _G.playerData[plyKey].mouse = {};
                _G.playerData[plyKey].unpress = {};
                /*IF_SERVER*/
                if (typeof _G.playerData[plyKey].ent === 'object') {
                    _G.playerData[plyKey].ent.skillOpen = undefined;
                    _G.playerData[plyKey].ent.invOpen = undefined;
                    _G.playerData[plyKey].ent.craftOpen = undefined;
                }
                for (var zz = 0; zz < wsClients.length; zz++) {
                    if (wsClients[zz].Hidden) {
                        continue;
                    }

                    wsClients[zz].send(JSON.stringify({
                        type: 'ClearInput',
                        user: plyKey,
                        time: _G.lastTick
                    }));
                }
                /*IF_END*/
            }

            _G.ents.PlayersActive.splice(i, 1);
        }

    }
}, 12500);

/*IF_CLIENT*/
setInterval(function() {
    _G._pingSentAt = Date.now();
    gameServer.send(
        JSON.stringify({
            type: 'ping',
            t: _G._pingSentAt
        })
    );
}, 5000);
/*IF_END*/

function getControlEndpoint() {
    let robotId = _G.SecondStream ? '7025' : '3341';
    let defaultEndpoint = {
        host: '137-220-60-228.robotstreamer.com',
        port: 8865,
        protocol: 'wss'
    };

    return fetch('https://api.robotstreamer.com/v1/robot_page_load', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        },
        body: JSON.stringify({
            token: window.rsToken,
            robot_id: robotId
        })
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (!data) {
            return defaultEndpoint;
        }

        if (data.control_service && typeof data.control_service.host === 'string') {
            return {
                host: data.control_service.host,
                port: data.control_service.port,
                protocol: 'wss'
            };
        }

        if (data.control_ssl && typeof data.control_ssl.host === 'string') {
            return {
                host: data.control_ssl.host,
                port: data.control_ssl.port,
                protocol: 'wss'
            };
        }

        if (data.control && typeof data.control.host === 'string') {
            return {
                host: data.control.host,
                port: data.control.port,
                protocol: (window.location && window.location.protocol === 'https:') ? 'wss' : 'ws'
            };
        }

        return defaultEndpoint;
    }).catch(function(err) {
        console.log('[RS Control] robot_page_load failed, using default endpoint', err);
        return defaultEndpoint;
    });
}

function buildControlUrl(endpoint) {
    return endpoint.protocol + '://' + endpoint.host + ':' + endpoint.port + '/echo';
}

function sendControlConnectMessage(socket, endpoint) {
    if (endpoint && endpoint.protocol === 'ws') {
        let payload = {
            command: window.streamKey
        };
        socket.send(JSON.stringify(payload));
        console.log('[RS Control] sent legacy ws handshake', payload);
        return;
    }

    let payload = {
        type: 'robot_connect',
        stream_key: window.streamKey || '',
        robot_id: _G.SecondStream ? '7025' : '3341'
    };

    /*
    if (typeof window.owner_id === 'string' && window.owner_id.length > 0) {
        payload.owner_id = window.owner_id.toString();
    }

    payload.sub_type = 'connect-broadcasting';
    */

    socket.send(JSON.stringify(payload));
    console.log('[RS Control] sent control connect payload', payload);
}

function handleRemoteControlMessage(msg) {
    console.log(msg);
    let plyKey = (typeof msg.user !== 'undefined' ? msg.user : (typeof msg.ip !== 'undefined' ? ('ip-|-' + msg.ip) : false));

    if ((typeof msg.user === 'string' && msg.user.substring(0, 4) === 'anon') && (typeof msg.user_id === 'undefined' || parseInt(msg.user_id) !== 0)) {
        return;
    }

    if (plyKey === false) {
        return;
    }

    plyKey = plyKey.toLowerCase().trim();

    if (_G.XControl && plyKey !== 'goosely') {
        return;
    }

    if (typeof _G.playerData[plyKey] !== 'object' || typeof _G.playerData[plyKey].ent !== 'object') {
        let ply = false;
        for (let i = 0; i < _G.ents.All.length; i++) {
            if (_G.ents.All[i].class === 'player' && _G.ents.All[i].Owner === plyKey) {
                ply = _G.ents.All[i];
            }
        }

        if (typeof _G.playerData[plyKey] !== 'object') {
            _G.playerData[plyKey] = {
                input: {},
                unpress: {},
                mouse: {},
                lastDir: 'L'
            };
        }

        if (!ply) {
            if (!_G.Instance && (typeof _G.InData[ply.Owner] === 'undefined' || Date.now() - _G.InData[ply.Owner] > 7000) && (typeof _G.InChecking[ply.Owner] === 'undefined' || _G.InChecking[ply.Owner] < _G.lastTick)) {
                _G.InChecking[ply.Owner] = _G.lastTick + 5000;
                try {
                    wsMaster.send(JSON.stringify({
                        type: 'InstanceCheck',
                        username: plyKey,
                        instance: (typeof _G.Instance !== 'undefined' ? _G.Instance : 0)
                    }));
                } catch (e) {}
            }
            return;
        } else {
            _G.playerData[plyKey].ent = ply;
        }
    }

    if (_G.Instance && typeof _G.playerData[plyKey] === 'undefined' && plyKey !== 'goosely') {
        return;
    }

    if (msg.key_position === 'down' && ['R', 'L', 'U', 'D'].indexOf(msg.command) !== -1) {
        _G.playerData[plyKey].lastDirPress = msg.command;
        if (typeof _G.ents.PlayersByName[plyKey] === 'object') {
            _G.ents.PlayersByName[plyKey].lastDirPress = msg.command;
        }
    }

    if (typeof _G.banned[plyKey] === 'undefined') {
        _G.playerData[plyKey].inputLast = _G.lastTick;
        if (typeof _G.ents.PlayersByName[plyKey] === 'object' && _G.ents.PlayersActive.indexOf(_G.ents.PlayersByName[plyKey]) === -1) {
            _G.ents.PlayersActive.push(_G.ents.PlayersByName[plyKey]);
        }
    }

    if (typeof _G.ents.PlayersByName[plyKey] === 'object') {
        _G.ents.PlayersByName[plyKey].inputLast = _G.lastTick;
    }


    console.log(msg.command, plyKey, _G.playerData[plyKey])

    // preserve original behavior for advanced input and inventory transitions
    // this is intentionally left as the existing logic path with no protocol changes
    if (msg.command === 'R' || msg.command === 'L' || msg.command === 'U' || msg.command === 'D' || msg.command === 'SHIFT' || msg.command === 'E' || msg.command === 'V' || msg.command === 'C' || msg.command === 'I' || msg.command === 'K' || msg.command === 'H' || msg.command === 'G') {
                if (msg.key_position === 'down') {
                    if (typeof _G.playerData[plyKey].unpress[msg.command] !== 'undefined') {
                        clearTimeout(_G.playerData[plyKey].unpress[msg.command]);
                    }

                    if (msg.command === 'SHIFT' && typeof _G.playerData[plyKey].ent.Driving === 'undefined' && (typeof _G.playerData[plyKey].input['R'] !== 'undefined' || typeof _G.playerData[plyKey].input['D'] !== 'undefined' || typeof _G.playerData[plyKey].input['L'] !== 'undefined' || typeof _G.playerData[plyKey].input['U'] !== 'undefined') && typeof _G.playerData[plyKey].input[msg.command] === 'undefined') {
                        let sprintSound = _G.sounds.sprint.cloneNode(true, _G.playerData[plyKey].ent.pos);
                        sprintSound.volume = 0.15;
                        sprintSound.play();
                    } else if (msg.command === 'G' && typeof _G.playerData[plyKey] !== 'undefined' && typeof _G.playerData[plyKey].ent === 'object' && _G.playerData[plyKey].ent.invOpen) {
                        let ply = (typeof _G.playerData[plyKey] === 'object' && typeof _G.playerData[plyKey].ent === 'object' && _G.playerData[plyKey].ent);
                        if (!ply || !ply.pos) {
                            return;
                        }

                        if (ply.container && ply.container.BuyItems) {
                            return;
                        }

                        if (ply.container && typeof ply.conSlot !== 'undefined') {

                            if (typeof ply.container.Container[ply.conSlot] === 'object' && ply.container.Container[ply.conSlot].am >= 5) {
                                ply.AddItem(ply.container.Container[ply.conSlot].item, 5);

                                ply.container.Container[ply.conSlot].am -= 5;

                                if (ply.container.Container[ply.conSlot].am <= 0) {
                                    ply.container.Container.splice(ply.conSlot, 1);
                                }

                            }

                        } else if (ply.container) {
                            if (typeof ply.inv[ply.invSlot] === 'object' && ply.inv[ply.invSlot].am >= 5) {
                                let foundItem = false;
                                for (var zz = 0; zz < ply.container.Container.length; zz++) {
                                    if (ply.container.Container[zz].item === ply.inv[ply.invSlot].item) {
                                        ply.container.Container[zz].am += 5;
                                        foundItem = true;
                                        break;
                                    }
                                }

                                if (!foundItem) {
                                    ply.container.Container.push({
                                        item: ply.inv[ply.invSlot].item,
                                        am: 5
                                    })
                                }

                                ply.inv[ply.invSlot].am -= 5;
                                if (ply.inv[ply.invSlot].am <= 0) {
                                    ply.inv.splice(ply.invSlot, 1);
                                }
                            }
                        } else {

                            if (typeof ply.inv[ply.invSlot] === 'object' && typeof _G.items[ply.inv[ply.invSlot].item].dropItem === 'string') {
                                let itemDrop = _G.ents.Create(_G.items[ply.inv[ply.invSlot].item].dropItem);
                                itemDrop.pos[0] = ply.pos[0] + randInt(-30, 30);
                                itemDrop.pos[1] = ply.pos[1] + 50 + randInt(0, 20)
                                itemDrop.rotate = angleToRadians(randInt(-6, 6));
                                itemDrop.itemAm = ply.inv[ply.invSlot].am;
                                itemDrop.PlacedBy = ply.Owner;

                                if (!ply.OutsideBoundary) {
                                    if (itemDrop.pos[0] > _G.BoundaryX - 120) {
                                        itemDrop.pos[0] = _G.BoundaryX - 120;
                                    } else if (itemDrop.pos[0] < _G.BoundaryMinX) {
                                        itemDrop.pos[0] = _G.BoundaryMinX;
                                    }

                                    if (itemDrop.pos[1] > _G.BoundaryY - 60) {
                                        itemDrop.pos[1] = _G.BoundaryY - 60;
                                    } else if (itemDrop.pos[1] < _G.BoundaryMinY + 100) {
                                        itemDrop.pos[1] = _G.BoundaryMinY + 100;
                                    }
                                }

                                ply.ShowNotify('Dropped ' + ply.inv[ply.invSlot].am + ' ' + _G.items[ply.inv[ply.invSlot].item].name, 2000);

                                ply.inv.splice(ply.invSlot, 1);

                            }
                        }
                    } else if (msg.command === 'G' && typeof _G.playerData[plyKey] !== 'undefined' && typeof _G.playerData[plyKey].ent === 'object') {
                        // G always drops the active weapon/item (hammer cycling moved to E key)
                        _G.playerData[plyKey].ent.DropWeapon();
                    } else if (msg.command === 'E' && typeof _G.playerData[plyKey] !== 'undefined' && typeof _G.playerData[plyKey].ent === 'object' && _G.playerData[plyKey].ent.invOpen) {
                        let ply = (typeof _G.playerData[plyKey] === 'object' && typeof _G.playerData[plyKey].ent === 'object' && _G.playerData[plyKey].ent);
                        if (!ply || !ply.pos) {
                            return;
                        }

                        if (typeof ply.invSlot !== 'undefined' && typeof ply.inv[ply.invSlot] !== 'undefined' && typeof ply.inv[ply.invSlot].item !== 'undefined' && ply.container && ply.container.StoreItems && typeof ply.container.StoreItems[ply.inv[ply.invSlot].item] === 'undefined') {
                            return;
                        }

                        if (ply.container && ply.container.BuyItems) {
                            let itemPrice = (typeof ply.conSlot !== 'undefined' && typeof ply.container.Container[ply.conSlot] !== 'undefined' && typeof ply.container.BuyItems[ply.container.Container[ply.conSlot].item] === 'number') ? ply.container.BuyItems[ply.container.Container[ply.conSlot].item] : false;

                            if (typeof itemPrice === 'number') {
                                itemPrice = Math.ceil(itemPrice * 1.34)
                            }

                            if (typeof ply.conSlot !== 'undefined' && typeof ply.container.Container[ply.conSlot] === 'object' && typeof ply.container.SellItems[ply.container.Container[ply.conSlot].item] === 'number') {
                                itemPrice = ply.container.SellItems[ply.container.Container[ply.conSlot].item];
                            }

                            if (typeof itemPrice === 'number') {

                                let currency = 'charms';
                                if (ply.container.Currency && typeof ply.conSlot !== 'undefined' && typeof ply.container.Container[ply.conSlot] === 'object' && typeof ply.container.Currency[ply.container.Container[ply.conSlot].item] !== 'undefined') {
                                    currency = ply.container.Currency[ply.container.Container[ply.conSlot].item];
                                }

                                let hasItem = ply.HasItem(currency, 1);
                                if (hasItem >= itemPrice) {
                                    ply.TakeItem(currency, itemPrice);

                                    ply.AddItem(ply.container.Container[ply.conSlot].item, 1);

                                    ply.ShowNotify('Bought ' + _G.items[ply.container.Container[ply.conSlot].item].name + ' for ' + itemPrice + ' ' + _G.items[currency].name, 2500);

                                    ply.container.Container[ply.conSlot].am -= 1;

                                    if (ply.container.Container[ply.conSlot].am <= 0) {
                                        ply.container.Container.splice(ply.conSlot, 1);
                                    }

                                } else {
                                    ply.ShowNotify('Need ' + itemPrice + ' ' + _G.items[currency].name, 2500);
                                }
                            } else if (typeof ply.invSlot !== 'undefined' && typeof ply.inv[ply.invSlot] !== 'undefined' && typeof ply.container.BuyItems[ply.inv[ply.invSlot].item] !== 'undefined') {

                                let currency = 'charms';
                                if (ply.container.Currency && typeof ply.container.Currency[ply.inv[ply.invSlot].item] !== 'undefined') {
                                    currency = ply.container.Currency[ply.inv[ply.invSlot].item];
                                }

                                ply.inv[ply.invSlot].am -= 1;

                                let foundItem = false;
                                for (var zz = 0; zz < ply.container.Container.length; zz++) {
                                    if (ply.container.Container[zz].item === ply.inv[ply.invSlot].item) {
                                        ply.container.Container[zz].am += 1;
                                        foundItem = true;
                                        break;
                                    }
                                }

                                if (!foundItem) {
                                    ply.container.Container.push({
                                        item: ply.inv[ply.invSlot].item,
                                        am: 1
                                    })
                                }

                                if (ply.container.BuyItems[ply.inv[ply.invSlot].item] > 0) {
                                    ply.AddItem(currency, ply.container.BuyItems[ply.inv[ply.invSlot].item]);
                                    ply.ShowNotify('Sold ' + _G.items[ply.inv[ply.invSlot].item].name + ' for ' + ply.container.BuyItems[ply.inv[ply.invSlot].item] + ' ' + _G.items[currency].name, 2500);
                                }

                                if (ply.inv[ply.invSlot].am <= 0) {
                                    ply.inv.splice(ply.invSlot, 1);
                                }


                            }

                            return;
                        }

                        if (ply.container && typeof ply.conSlot !== 'undefined') {

                            if (typeof ply.container.Container[ply.conSlot] === 'object' && ply.container.Container[ply.conSlot].am >= 1) {
                                ply.AddItem(ply.container.Container[ply.conSlot].item, 1);

                                ply.container.Container[ply.conSlot].am -= 1;

                                if (ply.container.Container[ply.conSlot].am <= 0) {
                                    ply.container.Container.splice(ply.conSlot, 1);
                                }

                            }

                        } else if (ply.container) {
                            if (typeof ply.inv[ply.invSlot] === 'object' && ply.inv[ply.invSlot].am >= 1) {
                                let foundItem = false;
                                for (var zz = 0; zz < ply.container.Container.length; zz++) {
                                    if (ply.container.Container[zz].item === ply.inv[ply.invSlot].item) {
                                        ply.container.Container[zz].am += 1;
                                        foundItem = true;
                                        break;
                                    }
                                }

                                if (!foundItem) {
                                    ply.container.Container.push({
                                        item: ply.inv[ply.invSlot].item,
                                        am: 1
                                    })
                                }

                                ply.inv[ply.invSlot].am -= 1;
                                if (ply.inv[ply.invSlot].am <= 0) {
                                    ply.inv.splice(ply.invSlot, 1);
                                }
                            }
                        } else {

                            if (typeof ply.inv[ply.invSlot] === 'object' && typeof _G.items[ply.inv[ply.invSlot].item].Use === 'function') {
                                let invSlot = ply.invSlot,
                                    invItem = ply.inv[invSlot].item;

                                ply.inv[invSlot].am -= 1;

                                if (typeof ply.inv[invSlot].am === 'undefined' || ply.inv[invSlot].am <= 0) {
                                    ply.inv.splice(invSlot, 1);
                                }

                                //ply.TakeItem(ply.inv[ply.invSlot].item, 1);
                                _G.items[invItem].Use(ply);

                                /*
                                if (typeof ply.inv[ply.invSlot].am === 'undefined' || ply.inv[ply.invSlot].am <= 0) {
                                    ply.inv.splice(ply.invSlot, 1);
                                }*/
                            }
                        }
                    } else if (msg.command === 'V' && typeof _G.playerData[plyKey] !== 'undefined' && typeof _G.playerData[plyKey].ent === 'object' && _G.playerData[plyKey].ent.invOpen && msg.key_position === 'down' && (typeof _G.playerData[plyKey].input['V'] === 'undefined' || _G.lastTick - _G.playerData[plyKey].input['V'] > 100)) {
                        let ply = (typeof _G.playerData[plyKey] === 'object' && typeof _G.playerData[plyKey].ent === 'object' && _G.playerData[plyKey].ent);
                        if (!ply || !ply.pos) {
                            return;
                        }

                        if (ply.container && ply.container.BuyItems) {
                            return;
                        }

                        if (typeof ply.invSlot !== 'undefined' && typeof ply.inv[ply.invSlot] !== 'undefined' && typeof ply.inv[ply.invSlot].item !== 'undefined' && ply.container && ply.container.StoreItems && typeof ply.container.StoreItems[ply.inv[ply.invSlot].item] === 'undefined') {
                            return;
                        }

                        if (ply.container && typeof ply.conSlot !== 'undefined') {

                            if (typeof ply.container.Container[ply.conSlot] === 'object' && ply.container.Container[ply.conSlot].am > 0) {
                                ply.AddItem(ply.container.Container[ply.conSlot].item, ply.container.Container[ply.conSlot].am);

                                ply.container.Container[ply.conSlot].am = 0;
                                ply.container.Container.splice(ply.conSlot, 1);

                            }

                        } else if (ply.container) {
                            if (typeof ply.inv[ply.invSlot] === 'object' && ply.inv[ply.invSlot].am >= 1) {
                                let foundItem = false;
                                for (var zz = 0; zz < ply.container.Container.length; zz++) {
                                    if (ply.container.Container[zz].item === ply.inv[ply.invSlot].item) {
                                        ply.container.Container[zz].am += ply.inv[ply.invSlot].am;
                                        foundItem = true;
                                        break;
                                    }
                                }

                                if (!foundItem) {
                                    ply.container.Container.push({
                                        item: ply.inv[ply.invSlot].item,
                                        am: ply.inv[ply.invSlot].am
                                    })
                                }

                                ply.inv.splice(ply.invSlot, 1);
                            }
                        } else {

                            if (typeof ply.inv[ply.invSlot] === 'object' && typeof _G.wep.List[ply.inv[ply.invSlot].item] === 'object' && (typeof ply.CanInvEquip === 'undefined' || _G.lastTick >= ply.CanInvPickup)) {
                                ply.CanInvPickup = _G.lastTick + 400;

                                let invSlot = ply.invSlot,
                                    invItem = ply.inv[invSlot].item;

                                ply.inv[invSlot].am -= 1;

                                if (typeof ply.ActiveWeapon === 'object' && !ply.ActiveWeapon.ShouldRemove && typeof ply.ActiveWeapon.class === 'string') {
                                    let activeWep = ply.ActiveWeapon;
                                    ply.DropWeapon();
                                    ply.ActiveWeapon = undefined;
                                    activeWep.ShouldRemove = true;
                                    ply.AddItem(activeWep.class.replace(/_pickup/gi, ''), (typeof activeWep.itemAm === 'number' ? activeWep.itemAm : 1));
                                }

                                let wep = _G.ents.Create(ply.inv[ply.invSlot].item);
                                _G.wep.BasicPickup(wep, ply, true);

                                if (typeof ply.inv[invSlot].am === 'undefined' || ply.inv[invSlot].am <= 0) {
                                    ply.inv.splice(invSlot, 1);
                                }


                                //ply.TakeItem(ply.inv[ply.invSlot].item, 1);
                                //_G.items[invItem].Use(ply);

                                /*
                                if (typeof ply.inv[ply.invSlot].am === 'undefined' || ply.inv[ply.invSlot].am <= 0) {
                                    ply.inv.splice(ply.invSlot, 1);
                                }*/
                            }
                        }
                    } else if (msg.command === 'E' && typeof _G.playerData[plyKey] !== 'undefined' && typeof _G.playerData[plyKey].ent === 'object') {
                        let findDoor = false,
                            findDist = 99999;

                        for (var i = 0; i < _G.ents.All.length; i++) {
                            if (_G.ents.All[i].class === 'forcefield' && !_G.ents.All[i].IsOpened && !_G.ents.All[i].Togglable && (_G.ents.All[i].Owner === _G.playerData[plyKey].ent.Owner || (_G.playerData[plyKey].ent.Owner === 'goosely' && _G.playerData[plyKey].ent.ActiveWeapon && _G.playerData[plyKey].ent.ActiveWeapon.class === 'hammer')) && _G.distance(_G.playerData[plyKey].ent.pos[0] + _G.playerData[plyKey].ent.bbox[0] + _G.playerData[plyKey].ent.bbox[2] * .5, _G.playerData[plyKey].ent.pos[1] + _G.playerData[plyKey].ent.bbox[1] + _G.playerData[plyKey].ent.bbox[3] * .5, _G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5) < findDist) {
                                findDoor = _G.ents.All[i];
                                findDist = _G.distance(_G.playerData[plyKey].ent.pos[0] + _G.playerData[plyKey].ent.bbox[0] + _G.playerData[plyKey].ent.bbox[2] * .5, _G.playerData[plyKey].ent.pos[1] + _G.playerData[plyKey].ent.bbox[1] + _G.playerData[plyKey].ent.bbox[3] * .5, _G.ents.All[i].pos[0] + _G.ents.All[i].bbox[0] + _G.ents.All[i].bbox[2] * .5, _G.ents.All[i].pos[1] + _G.ents.All[i].bbox[1] + _G.ents.All[i].bbox[3] * .5);
                            }
                        }

                        if (findDoor && findDist < 120) {
                            if (typeof findDoor.IsOpened === 'undefined') {
                                findDoor.IsOpened = true;
                            } else {
                                findDoor.IsOpened = !findDoor.IsOpened;
                            }
                            findDoor.LastUse = _G.lastTick;

                            findDoor.OwnerPass = true;
                            findDoor.Togglable = true;
                            findDoor.Toggled = false;
                            findDoor.IsGhost = Date.now();
                            if (findDoor.IsOpened) {
                                findDoor.AutoClose = _G.lastTick;
                            } else {
                                findDoor.AutoClose = undefined;
                            }
                        }
                    }

                    _G.playerData[plyKey].input[msg.command] = _G.lastTick;
                } else if (typeof _G.playerData[plyKey].input[msg.command] !== 'undefined') {
                    /*
                    if ( (_G.lastTick - _G.playerData[plyKey].input[msg.command]) < 50) {

                        _G.playerData[plyKey].unpress[msg.command] = setTimeout(function() {
                            _G.playerData[plyKey].unpress[msg.command] = undefined;
                            _G.playerData[plyKey].input[msg.command] = undefined;
                            delete _G.playerData[plyKey].input[msg.command];
                        }, 500);

                    } else {
                        _G.playerData[plyKey].input[msg.command] = undefined;
                        delete _G.playerData[plyKey].input[msg.command];
                    }
                            */
                    _G.playerData[plyKey].input[msg.command] = undefined;
                    delete _G.playerData[plyKey].input[msg.command];
                }
            }

    /*IF_SERVER*/
    for (let i = 0; i < wsClients.length; i++) {
        if (wsClients[i].Hidden) {
            continue;
        }
        wsClients[i].send(JSON.stringify({
            type: 'playerInput',
            data: msg,
            time: _G.lastTick,
            index: (typeof _G.playerData[plyKey] !== 'undefined' && _G.playerData[plyKey].ent) ? _G.playerData[plyKey].ent.EntIndex : undefined
        }));
    }
    /*IF_END*/
}

function handleControlMessage(event) {
    let msg;
    try {
        msg = JSON.parse(event.data);
    } catch (e) {
        console.log('[RS Control] invalid JSON', event.data);
        return;
    }

    if (msg.command === 'RS_PONG' || msg.type === 'RS_PING') {
        return;
    }

    if (msg.command && msg.key_position) {
        handleRemoteControlMessage(msg);
        return;
    }

    console.log('[RS Control] unhandled message', msg);
}

function wsConnect() {
    getControlEndpoint().then(function(endpoint) {
        let url = buildControlUrl(endpoint);
        ws = new WebSocket(url);
        _G.RSControl = ws;

        console.log('[RS Control] Attempting connection to WebSocket server', url);

        ws.onopen = function() {
            console.log('[RS Control] Opened connection to WebSocket server', url);
            sendControlConnectMessage(ws, endpoint);
        };

        ws.onmessage = handleControlMessage;

        ws.onclose = function() {
            console.log('[RS Control] Websocket closed, attempting to reconnect....');
            setTimeout(wsConnect, 1000);
        };

        ws.onerror = function(err) {
            console.log('[RS Control] Error', err);
        };
    }).catch(function(err) {
        console.log('[RS Control] failed to resolve endpoint', err);
        setTimeout(wsConnect, 1000);
    });
}

/*IF_CLIENT*/
let keyInfo = {
    68: 'R',
    65: 'L',
    75: 'K',
    72: 'H',
    71: 'G',
    87: 'U',
    32: 'V',
    67: 'C',
    73: 'I',
    83: 'D',
    16: 'SHIFT',
    69: 'E'
}

_G.ChatOpenLast = _G.lastTick;

let localKey = function(ev) {
    let key_position = (typeof ev.type !== 'undefined' && ev.type === 'keydown') ? 'down' : 'up';

    if (ev.keyCode === 17) {
        _G.CtrlDown = (key_position === 'down' ? true : false);

        if (!_G.CtrlDown && _G.MouseMesh) {
            _G.MouseMesh = undefined;
            delete _G.MouseMesh;
        }
    }

    if (_G.MouseMesh && key_position === 'up' && (ev.keyCode === 16 || ev.keyCode === 32)) {
        if (!_G.MouseMeshR) {
            _G.MouseMeshR = 0;
        }

        _G.MouseMeshR += angleToRadians(ev.keyCode === 16 ? 2 : -2);
    }

    if (key_position === 'down' && ev.keyCode === 13 && !_G.ChatOpen && _G.lastTick - _G.ChatOpenLast > 100) {
        _G.ChatOpenLast = _G.lastTick;
        _G.OpenChatbox(true);
        setTimeout(function() {
            document.getElementById('chatbox-input').focus();
        }, 1);
    }

    if (typeof keyInfo[ev.keyCode] === 'string' && (key_position === 'up' || (!_G.ChatInside && !_G.ChatHover))) {
        gameServer.send(
            JSON.stringify({
                type: 'input',
                command: keyInfo[ev.keyCode],
                key_position: key_position
            })
        );

        if (_G.LocalName) {
            if (typeof _G.playerData[_G.LocalName] !== 'undefined') {
                if (key_position === 'down') {
                    _G.playerData[_G.LocalName].input[keyInfo[ev.keyCode]] = _G.lastTick;
                } else {
                    _G.playerData[_G.LocalName].input[keyInfo[ev.keyCode]] = undefined;
                }
            }

            /*
            ws.onmessage({
                data: JSON.stringify({
                    user: _G.LocalName,
                    command: keyInfo[ev.keyCode],
                    key_position: key_position
                })
            });
            */
        }
    }
}

_G.localKey = localKey;

document.addEventListener('keydown', localKey);

document.addEventListener('keyup', localKey);

let HiddenTimer = false;
document.addEventListener('visibilitychange', function(ev) {
    _G.Hidden = (document.hidden ? true : false);
    if (!_G.Hidden) {
        _G.HiddenWait = Date.now();
    }
   
    try {
        gameServer.send(
            JSON.stringify({
                type: 'HiddenState',
                hidden: _G.Hidden
            })
        );
    } catch(e) { }

    if (_G.Hidden) {
        let playerKeys = Object.keys(_G.playerData);
        for (var z = 0; z < playerKeys.length; z++) {
            _G.playerData[playerKeys[z]].input = {};
            _G.playerData[playerKeys[z]].mouse = {};
        }

        document.getElementById('paused').style.display = 'block';
        document.getElementById('paused').classList.remove('hidden');
        if (HiddenTimer) {
            clearTimeout(HiddenTimer);
            HiddenTimer = false;
        }
    } else {
        document.getElementById('paused').classList.add('hidden');

        if (HiddenTimer) {
            clearTimeout(HiddenTimer);
            HiddenTimer = false;
        }

        HiddenTimer = setTimeout(function() {
            HiddenTimer = false;
            document.getElementById('paused').style.display = 'none';
        }, 450);
    }
});

window.addEventListener('blur', function() {
    gameServer.send(
        JSON.stringify({
            type: 'BlurState',
            blur: true
        })
    );
});

window.addEventListener('focus', function() {
    gameServer.send(
        JSON.stringify({
            type: 'BlurState',
            blur: false
        })
    );

    _G.viewport.loaded = _G.lastTick + 45;
    if (_G.LocalPlayer) {
        _G.LocalPlayer.CamBypass = _G.lastTick + 45;
    }
});

// =======================================
// == GAMEPAD SUPPORT ====================
// =======================================
let closeInterval = false,
    gamepadMenuOpen = false;

function gamepadMenu() {
    _G.GamepadNum = false;
    _G.GamepadActive = undefined;
    _G.GamepadType = undefined;
    _G.GamepadConfirm = undefined;
    _G.GamepadHold = undefined;
    _G.GamepadHoldBut = undefined;

    let menu = document.getElementById('gamepad-menu');

    menu.innerHTML = '<span class="main"><span id="gamepad-title"><i class="game-icon game-icon-console-controller"></i> Gamepad Setup</span><span class="small" id="gamepad-txt">Would you like to play using your controller?<br>Press any button on the controller to start.</span><button type="button" id="gamepad-no">or click here for <i class="game-icon game-icon-keyboard"></i> keyboard and mouse</button></span>';


    document.getElementById('gamepad-no').onclick = function(ev) {
        gamepadMenuClose();

        localStorage.setItem('gamepad-no', '1');

        ev.preventDefault();
    };


    if (menu.style.display !== 'block') {
        menu.style.display = 'block';
        setTimeout(function() {
            menu.classList.remove('hidden');
        }, 10);
    } else if (closeInterval) {
        try {
            clearInterval(closeInterval);
        } catch (e) {}
        closeInterval = false;
    }

    if (menu.className.indexOf('hidden') !== -1) {
        menu.classList.remove('hidden');
    }

    gamepadMenuOpen = _G.lastTick + 500;
}

function gamepadMenuClose() {
    gamepadMenuOpen = false;

    let menu = document.getElementById('gamepad-menu');
    if (menu.style.display !== 'none') {
        menu.classList.add('hidden');
        closeInterval = setTimeout(function() {
            closeInterval = false;
            if (menu.className.indexOf('hidden') !== -1) {
                menu.style.display = 'none';
            }
        }, 600);
    }
}

_G.GamepadTotal = 0;
_G.GamepadNum = false;

let testForConnections = (function() {

    // Keep track of the connection count
    let connectionCount = 0;

    // Return a function that does the actual tracking
    return function() {
        let gamepads = navigator.getGamepads();
        let count = 0;
        let diff;

        for (let i = gamepads.length - 1; i >= 0; i--) {
            let g = gamepads[i];

            // Make sure they're not null and connected
            if (g && g.connected) {
                count++;
            }
        }

        // Return any changes
        diff = count - connectionCount;

        connectionCount = count;
        _G.GamepadTotal = connectionCount;

        return diff;
    }
}());

function clampAnalog(x, y) {
    // Compute magnitude (length) of vector
    let m = Math.sqrt(x * x + y * y);

    // If the length greater than 1, normalize it (set it to 1)
    if (m > 1) {
        x /= m;
        y /= m;
    }

    // Return the (possibly normalized) vector
    return [x, y];
}

let wasPressed = [],
    analogInfo = {},
    keyCodes = {
        0: 69, // A = E (Use)
        1: 73, // B = I (Crafting)
        2: 67, // X = C (Inventory)
        3: 71, // Y = G (Drop)
        12: 87, // DPad Up
        13: 83, // DPad Down
        14: 65, // DPad Left
        15: 68, // DPad Right
        7: 32
    },
    loadedAt = _G.lastTick;


function gamepadCheck() {

    let tc = testForConnections();

    if (tc > 0) {
        console.log(tc + " gamepads connected");

        /*
            if (!localStorage.getItem('gamepad-no') || parseInt(localStorage.getItem('gamepad-no')) !== 1 || _G.lastTick-loadedAt > 29000) {
                // Open gamepad setup menu
                gamepadMenu();
            }
            */
    } else if (tc < 0) {
        console.log((-tc) + " gamepads disconnected");
        if (_G.GamepadTotal <= 0) {
            // No gamepads available, close gamepad menu if it exists
            gamepadMenuClose();
        } else if (_G.GamepadNum) {
            // User had controller setup and one was disconnected, reopen menu to reconfig
            gamepadMenuOpen();
        }
    }

    if (_G.GamepadTotal > 0) {
        let gamepads = navigator.getGamepads();

        if (_G.GamepadHold) {
            if (_G.GamepadNum === false || !gamepads[_G.GamepadNum] || !gamepads[_G.GamepadNum].connected || !gamepads[_G.GamepadNum].buttons[_G.GamepadHoldBut] || !gamepads[_G.GamepadNum].buttons[_G.GamepadHoldBut].pressed) {
                //document.getElementById('gamepad-txt').innerHTML = 'Would you like to play using your controller?<br>Press any button on the controller to start.';
                if (_G.GamepadConfirm && typeof _G.GamepadType === 'undefined') {
                    document.getElementById('gamepad-confirm').style.background = 'linear-gradient(to right, rgba(0,255,0,0.7) 0%, transparent 0)';
                    document.getElementById('gamepad-confirm').innerHTML = '<i class="game-icon game-icon-pointing"></i> Hold down any button to confirm';
                } else {
                    document.getElementById('gamepad-txt').innerHTML = '<i class="game-icon game-icon-confirmed"></i> Controller <b>#' + (_G.GamepadNum + 1) + '</b> Selected<br><i class="game-icon game-icon-pointing"></i> Hold down any button to confirm';
                }

                _G.GamepadHold = undefined;
                _G.GamepadHoldBut = undefined;
                return;
            }

            let confirmPercent = (_G.lastTick - _G.GamepadHold) / 1000;
            confirmPercent = parseInt(confirmPercent * 100);
            if (confirmPercent > 100) {
                _G.GamepadHold = undefined;

                if (_G.GamepadConfirm && typeof _G.GamepadType === 'undefined') {
                    _G.GamepadType = (document.getElementById('gamepad-styles').children[0].className.indexOf('active') !== -1 ? 0 : 1);

                    document.getElementById('gamepad-title').innerHTML = '<i class="game-icon game-icon-confirmed"></i> Setup Complete';
                    document.getElementById('gamepad-txt').innerHTML = '<i class="game-icon game-icon-thumbs-up"></i> Your controller has been setup!<br><i class="game-icon game-icon-pointing"></i> Press any button to continue.';
                } else {
                    _G.GamepadConfirm = true;
                    document.getElementById('gamepad-title').innerHTML = '<i class="game-icon game-icon-console-controller"></i> Gamepad Setup';
                    document.getElementById('gamepad-txt').innerHTML = '<i class="game-icon game-icon-gamepad-cross"></i> What button layout does the controller use?<div id="gamepad-styles"><img src="/img/controller1.png" class="active"> <img src="/img/controller2.png"></div><i class="game-icon game-icon-joystick"></i> Use analog sticks or DPad for selection<br><span id="gamepad-confirm" style="display:inline-block"><i class="game-icon game-icon-pointing"></i> Hold down any button to confirm</div>';
                }

            } else {
                document.getElementById('gamepad-confirm').style.background = 'linear-gradient(to right, rgba(0,255,0,0.7) ' + confirmPercent + '%, transparent 0)';
                if (document.getElementById('pointing')) {
                    document.getElementById('pointing').style.transform = 'rotate(' + Math.round(confirmPercent * 3.6) + 'deg)';
                }
            }
        }

        for (var i = 0; i < gamepads.length; i++) {
            let gp = gamepads[i];
            //console.log(gp);
            if (gp && gp.connected && ((gamepadMenuOpen && _G.lastTick > gamepadMenuOpen) || i === _G.GamepadNum)) {
                if (typeof wasPressed[gp] === 'undefined') {
                    wasPressed[gp] = {};
                }
                if (typeof analogInfo[gp] === 'undefined') {
                    analogInfo[gp] = {};
                }

                // Find buttons
                if (gp.buttons) {
                    for (var x = 0; x < gp.buttons.length; x++) {
                        if (gp.buttons[x]) {
                            if (typeof wasPressed[gp][x] === 'undefined') {
                                wasPressed[gp][x] = {
                                    pressed: gp.buttons[x].pressed,
                                    value: gp.buttons[x].value
                                };
                            }

                            if (gamepadMenuOpen) {
                                if (!_G.GamepadConfirm) {
                                    if (gp.buttons[x].pressed && !wasPressed[gp][x].pressed && _G.GamepadNum !== false) {
                                        _G.GamepadHold = _G.lastTick;
                                        _G.GamepadHoldBut = x;
                                        document.getElementById('gamepad-txt').innerHTML = '<i class="game-icon game-icon-confirmed"></i> Controller <b>#' + (_G.GamepadNum + 1) + '</b> Selected<br><span id="gamepad-confirm" style="display:inline-block"><i class="game-icon game-icon-pointing" id="pointing"></i> Confirming controller selection...</span>';
                                    }

                                    if (gp.buttons[x].pressed && !wasPressed[gp][x].pressed && _G.GamepadNum !== i) {
                                        _G.GamepadNum = i;
                                        _G.GamepadActive = gp;
                                        document.getElementById('gamepad-txt').innerHTML = '<i class="game-icon game-icon-confirmed"></i> Controller <b>#' + (_G.GamepadNum + 1) + '</b> Selected<br><i class="game-icon game-icon-pointing"></i> Hold down any button to confirm';
                                    }
                                }


                                if (_G.GamepadConfirm && typeof _G.GamepadType === 'undefined') {
                                    if ((x < 12 || x > 15) && gp.buttons[x].pressed && !wasPressed[gp][x].pressed) {
                                        _G.GamepadHold = _G.lastTick;
                                        _G.GamepadHoldBut = x;
                                        document.getElementById('gamepad-confirm').innerHTML = '<i class="game-icon game-icon-pointing" id="pointing"></i> Confirming controller layout...</span>';
                                    }

                                    if ((x === 15 || x === 14) && !gp.buttons[x].pressed && wasPressed[gp][x].pressed) {
                                        let opts = document.getElementById('gamepad-styles').children;
                                        if (opts[0].className.indexOf('active') !== -1) {
                                            opts[0].classList.remove('active');
                                            opts[1].classList.add('active');
                                        } else {
                                            opts[1].classList.remove('active');
                                            opts[0].classList.add('active');
                                        }
                                    }
                                }

                                if (_G.GamepadConfirm && typeof _G.GamepadType !== 'undefined') {
                                    if ((x < 12 || x > 15) && gp.buttons[x].pressed && !wasPressed[gp][x].pressed) {
                                        gamepadMenuClose();
                                    }
                                }
                            }


                            if (wasPressed[gp][x].pressed != gp.buttons[x].pressed) {
                                wasPressed[gp][x].pressed = gp.buttons[x].pressed;

                                if (keyCodes[x] && !wasPressed[gp][x].pressed && !gamepadMenuOpen) {
                                    _G.localKey({
                                        type: 'keyup',
                                        keyCode: keyCodes[x]
                                    });
                                    //console.log('keyup' + keyCodes[x])
                                }

                                if (x === 10 && !wasPressed[gp][x].pressed && !gamepadMenuOpen) {
                                    _G.localKey({
                                        type: (typeof _G.Sprinting !== 'undefined' ? 'keyup' : 'keydown'),
                                        keyCode: 16
                                    });

                                    _G.Sprinting = (typeof _G.Sprinting === 'undefined' ? _G.lastTick : undefined);
                                }
                            }
                            if (wasPressed[gp][x].value != gp.buttons[x].value) {
                                wasPressed[gp][x].value = gp.buttons[x].value;
                            }

                            if (keyCodes[x] && wasPressed[gp][x].pressed && !gamepadMenuOpen) {
                                _G.localKey({
                                    type: 'keydown',
                                    keyCode: keyCodes[x]
                                });
                                //console.log('keydown' + keyCodes[x])
                            }
                        }
                    }
                }

                // Find analog stick(s)
                if (gp.axes) {
                    for (var x = 0; x < gp.axes.length; x++) {
                        let pressed = (gp.axes[x] > 0.2 || gp.axes[x] < -0.2);
                        if (typeof analogInfo[gp][x] === 'undefined') {
                            analogInfo[gp][x] = {
                                pressed: pressed,
                                value: gp.axes[x]
                            };
                        }


                        if (gamepadMenuOpen) {
                            if (_G.GamepadConfirm && typeof _G.GamepadType === 'undefined') {
                                if ((x === 0 || x === 2) && !pressed && analogInfo[gp][x].pressed) {
                                    let opts = document.getElementById('gamepad-styles').children;
                                    if (opts[0].className.indexOf('active') !== -1) {
                                        opts[0].classList.remove('active');
                                        opts[1].classList.add('active');
                                    } else {
                                        opts[1].classList.remove('active');
                                        opts[0].classList.add('active');
                                    }
                                }
                            }
                        }


                        if (analogInfo[gp][x].pressed != pressed) {
                            analogInfo[gp][x].pressed = pressed;
                        }
                        if (analogInfo[gp][x].value != gp.axes[x]) {
                            analogInfo[gp][x].value = gp.axes[x];
                        }

                    }

                    if (!gamepadMenuOpen && _G.LocalPlayer) {
                        let leftStick = clampAnalog(gp.axes[0], gp.axes[1]);

                        if (leftStick[0] > 0.2 || leftStick[0] < -0.2 || leftStick[1] > 0.2 || leftStick[1] < -0.2) {
                            _G.AnalogPos = [_G.LocalPlayer.pos[0] + leftStick[0] * 110, _G.LocalPlayer.pos[1] + leftStick[1] * 110];

                            gameServer.send(
                                JSON.stringify({
                                    type: 'Mouse',
                                    button: 2,
                                    pos: _G.AnalogPos,
                                    key_position: 'down'
                                })
                            );

                            _G.MousePos = _G.AnalogPos;
                            _G.MouseShow = _G.lastTick + 600;

                            if (!_G.MouseDown[2]) {
                                _G.MouseDown[2] = _G.lastTick;
                            }

                        } else if (_G.AnalogPos) {
                            gameServer.send(
                                JSON.stringify({
                                    type: 'Mouse',
                                    button: 2,
                                    pos: _G.AnalogPos,
                                    key_position: 'up'
                                })
                            );

                            _G.AnalogPos = undefined;

                            _G.MouseDown[2] = undefined;
                            delete _G.MouseDown[2];
                            _G.MouseShow = _G.lastTick - 600;
                        }
                    }
                }
            }
        }
    }

}

/*IF_END*/

/*IF_SERVER*/
wsConnect();

chatConnect();
/*IF_END*/

/*IF_CLIENT*/
_G.slotSection = document.createElement('section');
_G.slotSection.id = 'slot_machines_container';
_G.slotSection.style.display = 'none';
document.body.appendChild(_G.slotSection);

function openSlotMachine(type) { 
    _G.SlotMachineOpen = type;
    let getBalance = (_G.LocalPlayer && _G.LocalPlayer.HasItem('chips', 1)) || 0;

    _G.slotSection.innerHTML = '<div id="slot_machines_backgrounds_container"><div class="SlotsClose">X</div><div id="slot_machines_backgrounds" class="slot_bg"></div></div><div id="slotsSelectorWrapper" class="slotMachine' + type + ' ' + _G.SlotMachines[type].reel + '" data-machine="1" data-reel="1"><div id="SlotsOuterContainer"><div id="SlotsInnerContainer"><div id="prizes_list"><div id="prizes_list_slotMachine' + type + '" class="prizes_list_slot_machine"></div></div><div id="slotMachineContainer"><div id="ReelContainer"><div id="reel1" class="reel" style="top:-634px"></div><div id="reel2" class="reel" style="top:-874px"></div><div id="reel3" class="reel" style="top:-994px"></div><div id="reelOverlay"></div></div><div id="failedRequestMessage" style="display:none"><span class="large">Sorry, we\'re unable to display your spin because your connection to our server was lost.</span><br>Rest assured that your spin was not wasted. Please check your connection and<a href="#" onclick="window.location.reload()">refresh</a>to try again.</div><div id="betContainer"><span id="lastWin"></span><span id="credits">' + getBalance + '</span><span id="bet">1</span><span id="dayWinnings">?</span><span id="lifetimeWinnings">?</span><div id="betSpinUp"></div><div id="betSpinDown"></div></div><div id="spinButton" class=""></div></div><div id="soundOffButton"></div></div></div></div>';

    _G.slotSection.getElementsByClassName('SlotsClose')[0].onclick = function(ev) {
        _G.slotSection.innerHTML = '';
        _G.slotSection.style.display = 'none';

        gameServer.send(
            JSON.stringify({
                type: 'SlotMachineClose'
            })
        );

        ev.preventDefault();

    };

    _G.slotSection.style.display = 'block';

    _G.slotSection.getElementsByClassName('prizes_list_slot_machine')[0].innerHTML = '';

    let machineBG = _G.slotSection.getElementsByClassName('slot_bg')[0];
    machineBG.innerHTML = '';

    let newBG = document.createElement('div');
    newBG.id = _G.SlotMachines[type].background;
    newBG.className = 'changeable_background';
    machineBG.appendChild(newBG);

    _G.maxBet = _G.SlotMachines[type].maxBet;

    for (var i = 0; i < _G.SlotMachines[type].odds.length; i++) {
        let trPrize = document.createElement('div');
        trPrize.id = 'trPrize_' + (i + 1);
        trPrize.className = 'trPrize';

        let tdReels = document.createElement('div');
        tdReels.className = 'tdReels';
        trPrize.appendChild(tdReels);

        for (var x = 0; x < _G.SlotMachines[type].odds[i].reels_prize.length; x++) {
            let reel = document.createElement('div');
            reel.className = 'reel1 reelIcon prize_' + _G.SlotMachines[type].odds[i].reels_prize[x];
            tdReels.appendChild(reel);
        }

        let clearer = document.createElement('div');
        clearer.className = 'clearer';
        tdReels.appendChild(clearer);

        let tdPayout = document.createElement('span');
        tdPayout.className = 'tdPayout';
        tdPayout.setAttribute('data-basepayout', _G.SlotMachines[type].odds[i].pays);
        tdPayout.innerText = _G.SlotMachines[type].odds[i].pays;

        clearer = document.createElement('div');
        clearer.className = 'clearer';
        tdPayout.appendChild(clearer);

        trPrize.appendChild(tdPayout);

        _G.slotSection.getElementsByClassName('prizes_list_slot_machine')[0].appendChild(trPrize);
    }

    _G.slotMachine.curBet = 1;
    _G.slotMachine.spinning = false;

    _G.slotMachine.init();
}

_G.openSlotMachine = openSlotMachine;


include('public/assets/js/jquery-1.7.1.min.js');
include('public/assets/js/jquery-ui-1.8.17.custom.min.js');
include('public/assets/js/soundmanager2.js');
include('scratchcard.js');
include('slots.js');
 
/*IF_END*/

})();