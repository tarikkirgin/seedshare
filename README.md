# SeedShare

## Running a Local PeerJS Server

To run a local PeerJS server for development, use the following command:

```
peerjs --port 9000 --key peerjs --path /myapp
```

- **--port 9000**: Runs the server on port 9000
- **--key peerjs**: Sets the API key to `peerjs`
- **--path /myapp**: Sets the server path to `/myapp`

Make sure you have PeerJS installed globally. If not, install it with:

```
pnpm add -g peer
```

For more information, see the [PeerJS documentation](https://peerjs.com/docs.html).
