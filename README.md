# Hobo Quest

A real-time 2D multiplayer browser game built with Node.js and WebSockets.

## Play

[https://Hobo.Quest](https://Hobo.Quest)

## Features

- Real-time multiplayer with lag compensation (Source Engine methodology)
- Open-world survival: gather resources, craft, build, fight
- Building system: place and upgrade walls, doors, beds, tool cupboards, campfires, barbed wire
- Combat: melee knockback, ranged pistol, arrows with gravity arc
- NPCs with aggro, patrol, attack telegraph, and hit flash
- Skills system: Woodcutting, Mining, Herbology, Attack, and more
- Inventory, crafting, equipment, and bank systems
- Bus system for fast travel between map zones

## Development

### Prerequisites

- Node.js v18+

### Install

```bash
npm install
```

### Compile shared code

Shared game logic (`shared.js`) is compiled to `server.js` and `public/client.js`:

```bash
node compiler.js
```

### Run (single instance)

```bash
node server.js
```

### Run (multi-instance master, ports 9000–9003)

```bash
node server-master.js
```

## Architecture

| File | Purpose |
|------|---------|
| `shared.js` | Canonical game logic (compiled to server + client) |
| `server.js` | Compiled server-side output |
| `public/client.js` | Compiled client-side output |
| `server-master.js` | Spawns 4 game instances on ports 9000–9003 |
| `lib/c2d.js` | Canvas 2D rendering helpers |
| `rs/` | RobotStreamer livestream integration |
| `saves/` | Persisted entity and player save data |

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| V | Attack / Build (hammer) |
| E | Use / Pick up / Cycle build piece |
| SHIFT+E | Switch build category (with hammer) |
| H | Holster weapon |
| G | Drop weapon |
| I | Open crafting |
| K | Open skills |
| Space | Respawn |

## License

All rights reserved — © Hobo Quest
