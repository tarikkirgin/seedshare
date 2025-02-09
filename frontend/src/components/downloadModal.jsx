/* global WebTorrent, download */
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Download } from "lucide-react";
import { useState } from "react";

export default function DownloadModal() {
  const [pairingWords, setPairingWords] = useState("");

  async function onButtonClick() {
    try {
      const response = await fetch(
        "https://seedshare.thomascarey.co.uk/getMagnet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ words: pairingWords }),
        }
      );

      const data = await response.json();
      // TODO: handle error case (no success)
      downloadTorrent(await data?.magnet);
    } catch (e) {
      console.error(e);
    }
  }

  async function downloadTorrent(magnetURI) {
    console.log("trying to download");
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

        torrent.on("download", function (bytes) {
          console.log("just downloaded: " + bytes);
          console.log("total downloaded: " + torrent.downloaded);
          console.log("download speed: " + torrent.downloadSpeed);
          console.log("progress: " + torrent.progress);
        });
      });
    } else {
      console.error("Required libraries are not loaded");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tone">
          <Download />
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex">
          <DialogTitle>Enter pairing words</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter the 3 words to pair and receive files
        </DialogDescription>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="apple-shoe-cheese"
            onChange={(e) => setPairingWords(e.target.value)}
          />
          <Button onClick={onButtonClick}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
