import WebTorrent from 'webtorrent'

const client = new WebTorrent({
    dht: false,   // Disable DHT
});

const customTrackers = [
  'ws://149.102.154.203:44851',
]

client.seed('./hi.txt', { announce: customTrackers }, torrent => {
    console.log('Client is seeding ' + torrent.magnetURI)
})
