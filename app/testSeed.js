import WebTorrent from 'webtorrent'

const client = new WebTorrent()

const customTrackers = [
  'ws://149.102.154.203:44851',
]

client.seed('./seed-me2.txt', { announce: customTrackers }, torrent => {
    console.log('Client is seeding ' + torrent.magnetURI)
})
