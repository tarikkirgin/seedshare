import WebTorrent from 'webtorrent'

const client = new WebTorrent({
    dht: false,   // Disable DHT
});

const magnetURI = 'magnet:?xt=urn:btih:846a1f85ad80def13115594dd16b4c7b3f6ca68a&dn=hi.txt&tr=ws%3A%2F%2F149.102.154.203%3A44851'

console.log('Adding torrent with magnet URI:', magnetURI)

client.on('ready', () => {
    console.log('WebTorrent client is ready')
})

client.add(magnetURI, { path: './downloads' }, torrent => {
  console.log('Torrent added:', torrent)

  torrent.on('download', (bytes) => {
    console.log(`Downloaded ${bytes} bytes`)
  })

  torrent.on('done', () => {
    console.log('Torrent download finished')
  })

  torrent.on('error', (err) => {
    console.error('Error during torrent download:', err)
  })
})

client.on('error', (err) => {
  console.error('Client error:', err)
})
