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
        getWords(torrent.magnetURI);
      });
    }
  }

  return <input multiple type="file" onChange={onFileChange} />;
}


async function getWords(magnetURI) {
  try {
    const response = await fetch("http://localhost:4000/generateWords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify({ inputString: magnetURI }), // Convert to JSON
    });

    console.log(await response.json());
  } catch (e) {
    console.error(e);
  }
}
