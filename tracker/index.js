import { Server } from 'bittorrent-tracker'; 

const server = new Server({
  // Disable UDP and HTTP servers, as they are not needed for WebRTC
  udp: false,  // Disable UDP server
  http: false, // Disable HTTP server
  ws: true,    // Enable WebSocket server for WebRTC connections
  dht: false,
  stats: true, // Optionally enable web-based statistics (optional)
  trustProxy: false, // Disable trusting proxy headers (optional)
  filter: function (infoHash, params, cb) {
    // Blacklist/whitelist function for allowing/disallowing torrents.
    // Example: Only allow a specific torrent based on infoHash.
    // const allowed = (infoHash === 'aaa67059ed6bd08362da625b3ae77f6f4a075aaa');
    let allowed = true;
    if (allowed) {
      cb(null); // Torrent allowed
    } else {
      cb(new Error('disallowed torrent')); // Torrent disallowed
    }
  }
});

// WebSocket server (for WebRTC) exposed as a public property
server.ws;

server.on('error', function (err) {
  // Fatal server error!
  console.log(err.message);
});

server.on('warning', function (err) {
  // Client sent bad data. Not necessarily a problem, just a buggy client.
  console.log(err.message);
});

server.on('listening', function () {
  // Fired when all requested servers are listening
  const wsAddr = server.ws.address();
  const wsHost = '127.0.0.1';
  const wsPort = wsAddr.port;
  console.log(`WebSocket tracker: ws://${wsHost}:${wsPort}`);
});

// Start the WebRTC tracker server. Use 0 to listen on a random free port.
const port = 44951;  // Automatically choose a free port
const hostname = '127.0.0.1';
server.listen(port, hostname, () => {
  // Do something after the tracker starts listening
});

// Listen for individual tracker messages from peers:
server.on('start', function (addr) {
  console.log('Received start message from ' + addr);
});

server.on('complete', function (addr) {
  console.log("\ncomplete::\n" + addr + "\n")
});
server.on('update', function (addr) {
  console.log("\nupdate::\n" + addr + "\n")
});
server.on('stop', function (addr) {
  console.log("\stop::\n" + addr + "\n")
});

// Get info hashes for all torrents in the tracker server
Object.keys(server.torrents);

// // Get the number of seeders for a particular torrent
// server.torrents[infoHash].complete;

// // Get the number of leechers for a particular torrent
// server.torrents[infoHash].incomplete;

// // Get the peers who are in a particular torrent swarm
// server.torrents[infoHash].peers;


