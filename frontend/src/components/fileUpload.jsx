/* global WebTorrent */

export default function FileUpload() {
  function onFileChange(event) {
    if (window.WebTorrent) {
      const files = event.target.files;
      if (!files) return;

      const client = new WebTorrent({
        dht: false,
      });

      const customTrackers = ["ws://thomascarey.co.uk:44851"];

      client.seed(files, { announce: customTrackers }, (torrent) => {
        console.log("Client is seeding " + torrent.magnetURI);
      });
    }
  }

  return <input multiple type="file" onChange={onFileChange} />;
}
