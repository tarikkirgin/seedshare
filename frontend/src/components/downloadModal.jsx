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
import { AlertCircle } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DownloadModal({ setState, setDownloadInfo }) {
  const [pairingWords, setPairingWords] = useState("");
  const [error, setError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  function onInputChange(e) {
    const input = e.target.value;
    // replace anything that isnt a lowercase letter or hyphen with nothing, turn spaces into hyphens
    const cleanedInput = input.replace(/[^a-z-\s]/g, "").replace(/\s/g, "-");

    setPairingWords(cleanedInput);
  }

  function onOpenChange(open) {
    if (!open) {
      setPairingWords("");
      setError(false);
      setShowWarning(false);
      setLoading(false);
    }
  }

  async function onButtonClick() {
    setError(false);
    setShowWarning(false);
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
        setLoading(false);
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

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowWarning(true);
        return;
      }, 10000);

      client.add(magnetURI, { strategy: "rarest" }, function (torrent) {
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
    <Dialog onOpenChange={onOpenChange}>
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
            {...(loading && { disabled: true })}
          />
        </div>
        {showWarning && (
          <div className="border p-4 border-red-500 rounded-lg bg-red-600 text-white ">
            <div className="flex items-center gap-4 mb-3">
              <AlertCircle size={32} />{" "}
              <h2 className=" font-semibold">Invalid Link</h2>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p>
                This link is invalid; either the seeder disconnected or the time
                to live has expired.
              </p>
              <p>Please contact the seeder to generate a new link.</p>
            </div>
          </div>
        )}
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="tone"
            onClick={onButtonClick}
            {...(loading && { disabled: true })}
          >
            {loading && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
