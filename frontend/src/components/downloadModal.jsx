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

export default function DownloadModal() {
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
          <DialogTitle>Enter Link</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter the 3 words to pair and receive files
        </DialogDescription>
        <div className="flex gap-2">
          <Input type="text" placeholder="apple-shoe-cheese" />
          <Button>Submit</Button>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
