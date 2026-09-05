/**
 * Curriculo Presence WebSocket Server
 * ------------------------------------
 * Handles real-time user presence + live cursors for the curriculo static site.
 *
 * Events IN  (client → server):
 *   update-user  { username, avatar, color, location, flag }
 *   cursor-change { pos: { x, y }, socketId }
 *
 * Events OUT (server → client):
 *   session      { sessionId }
 *   users-updated  User[]
 *   cursor-changed { pos: { x, y }, socketId }
 */

const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

// Allowed origins – add your production domain here
const ALLOWED_ORIGINS = [
  'https://1harz.com',
  'http://1harz.com',
  'https://www.1harz.com',
  'https://1harz.github.io',
  'http://localhost',
  'http://127.0.0.1',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'null', // file:// protocol sends "null" as Origin
];

const httpServer = createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      users: users.size,
      uptime: Math.floor(process.uptime()),
    }));
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const users = new Map();

function broadcastUsers() {
  io.emit('users-updated', Array.from(users.values()));
}

// Keep all clients synchronized every 20s
setInterval(broadcastUsers, 20000);

io.on('connection', (socket) => {
  const sessionId = socket.handshake.auth?.sessionId || socket.id;

  console.log(`[+] Connected: ${socket.id} (session: ${sessionId})`);

  const now = new Date().toISOString();
  users.set(socket.id, {
    socketId: socket.id,
    id: sessionId,
    name: `Dev #${Math.floor(Math.random() * 900 + 100)}`,
    avatar: String(Math.floor(Math.random() * 80) + 1),
    color: '#00e5ff',
    location: 'Online',
    flag: '🌐',
    countryCode: '',
    isOnline: true,
    lastSeen: now,
    createdAt: now,
  });

  socket.emit('session', { sessionId });
  broadcastUsers();

  socket.on('get-users', () => {
    socket.emit('users-updated', Array.from(users.values()));
  });

  socket.on('update-user', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (data.username)    user.name = String(data.username).slice(0, 32);
    if (data.avatar)      user.avatar = String(data.avatar).slice(0, 64);
    if (data.color)       user.color = String(data.color).slice(0, 32);
    if (data.location)    user.location = String(data.location).slice(0, 64);
    if (data.flag)        user.flag = String(data.flag).slice(0, 8);
    if (data.countryCode) user.countryCode = String(data.countryCode).slice(0, 4);
    user.lastSeen = new Date().toISOString();

    broadcastUsers();
  });

  socket.on('cursor-change', (data) => {
    if (!data || !data.pos) return;
    const x = Number(data.pos.x) || 0;
    const y = Number(data.pos.y) || 0;

    socket.broadcast.emit('cursor-changed', {
      pos: { x, y },
      socketId: socket.id,
    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`[-] Disconnected: ${socket.id} -- ${reason}`);
    users.delete(socket.id);
    broadcastUsers();
  });
});

httpServer.listen(PORT, () => {
  console.log('\n[OK] Curriculo WS server running on port ' + PORT);
  console.log('     Health: http://localhost:' + PORT + '/health\n');
});
