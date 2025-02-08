"use client";

import WebTorrent from "@/public/webtorrent.min.js";
import { Torrent } from "webtorrent";

export default function FilePicker() {
  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const client = new WebTorrent({
      dht: false, // Disable DHT
    });

    const customTrackers = ["ws://149.102.154.203:44851"];

    client.seed(files, { announce: customTrackers }, (torrent: Torrent) => {
      console.log("Client is seeding " + torrent.magnetURI);
    });
  }
  return <input multiple type="file" onChange={onFileChange} />;
}
