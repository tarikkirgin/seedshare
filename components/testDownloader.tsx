"use client";

import WebTorrent from "@/public/webtorrent.min.js";
import { useState } from "react";
import { Torrent } from "webtorrent";

export default function TestDownloader() {
  const [magnetLink, setMagnetLink] = useState("");
  function onButtonClick() {
    const client = new WebTorrent({
      dht: false,
    });

    console.log("Adding torrent with magnet URI:", magnetLink);

    client.on("ready", () => {
      console.log("WebTorrent client is ready");
    });

    client.add(magnetLink, { path: "/tmp/" }, (torrent: Torrent) => {
      console.log("Torrent added:", torrent);

      console.log(torrent.files);
      console.log(
        torrent.files[0].getBlob((err, blob) => {
          console.log(blob);
        })
      );
      torrent.on("download", (bytes) => {
        console.log(`Downloaded ${bytes} bytes`);
      });

      torrent.on("done", () => {
        console.log("Torrent download finished");
      });

      torrent.on("error", (err) => {
        console.error("Error during torrent download:", err);
      });
    });
  }
  return (
    <div>
      <button onClick={onButtonClick}>download torrent</button>
      <input type="text" onChange={(e) => setMagnetLink(e.target.value)} />
    </div>
  );
}
