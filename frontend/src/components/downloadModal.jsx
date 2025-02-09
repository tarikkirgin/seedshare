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

export default function DownloadModal({ setState, setDownloadInfo }) {
  const [pairingWords, setPairingWords] = useState("");
  const [error, setError] = useState(false);

  function onInputChange(e) {
    const input = e.target.value;
    // replace anything that isnt a lowercase letter or hyphen with nothing, turn spaces into hyphens
    const cleanedInput = input.replace(/[^a-z-\s]/g, "").replace(/\s/g, "-");

    setPairingWords(cleanedInput);
  }

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
      if (!data.magnet) {
        setError(true);
        return;
      }
      downloadTorrent(await data?.magnet);
    } catch (e) {
      console.error(e);
    }
  }

  async function downloadTorrent(magnetURI) {
    if (!magnetURI) {
      return; // no magnet URI to download
    }
    console.log("trying to download");
    if (window.WebTorrent && window.download) {
      const client = new WebTorrent({ dht: false });

      setTimeout(() => {
        setState("downloading");
      }, 10000);

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

        setInterval(() => {
          setDownloadInfo({ ...torrent });
          console.log("time", torrent.timeRemaining);
        }, 1000);

        torrent.on("download", function (bytes) {
          setState("downloading");
        });
      });
    } else {
      console.error("Required libraries are not loaded");
    }
  }

  return (
    <Dialog onOpenChange={() => setError(false)}>
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
        <div className="flex flex-col gap-2">
          {error && <p className="text-red-500 text-sm">No file(s) found</p>}
          <Input
            type="text"
            placeholder="apple-shoe-cheese"
            onChange={onInputChange}
            value={pairingWords}
            className={error ? "border-red-500" : ""}
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="tone" onClick={onButtonClick}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
