/* global WebTorrent */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

import { Upload } from "lucide-react";

export default function UploadModal({ setIsSeeding, setPairingWords }) {
  const [files, setFiles] = useState([]);

  async function getWords(magnetURI) {
    try {
      const response = await fetch(
        "https://seedshare.thomascarey.co.uk/generateWords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputString: magnetURI }),
        }
      );

      const data = await response.json();
      // TODO: handle error case (no success)
      setPairingWords(await data?.words);
    } catch (e) {
      console.error(e);
    }
  }

  function onButtonClick() {
    if (window.WebTorrent) {
      if (files.length === 0) return;

      const client = new WebTorrent({
        dht: false,
      });

      const customTrackers = ["ws://thomascarey.co.uk:44851"];

      client.seed(files, { announce: customTrackers }, (torrent) => {
        getWords(torrent.magnetURI);
      });

      setIsSeeding(true);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="tone">
          <Upload />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>Choose files to send</DialogDescription>
        </DialogHeader>
        <div className="flex items-center">
          <Input
            id="picture"
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="tone" onClick={onButtonClick}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
