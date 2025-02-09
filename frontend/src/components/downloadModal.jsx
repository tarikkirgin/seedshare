/* global WebTorrent, download */

export default function DownloadModal() {
  function downloadTorrent(magnetURI) {
    if (window.WebTorrent && window.download) {
      const client = new WebTorrent({ dht: false });

      client.add(magnetURI, function (torrent) {
        torrent.on("done", () => {
          torrent.files.forEach((file) => {
            if (file.length > 0) {
              file.getBlob((err, blob) => {
                if (err) {
                  console.error("Error getting blob", err);
                  return;
                }
                console.log(blob);
                download(blob, file.name);
              });
            } else {
              console.log("The file is not a binary file");
            }
          });
        });
      });
    } else {
      console.error("Required libraries are not loaded");
    }
  }

  return (
    <div>
      <button onClick={downloadTorrent}>test</button>
    </div>
  );
}
