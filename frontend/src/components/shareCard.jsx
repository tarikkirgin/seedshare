import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { useState } from "react";

import { Copy, Check } from "lucide-react";

export default function ShareCard() {
  const [copied, setCopied] = useState(false);
  const wordsToShare = "apple-concrete-tennis";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wordsToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={"bg-white z-10 shadow-lg"}>
      <CardHeader>
        <CardTitle>Pairing words</CardTitle>
        <CardDescription>
          Share these words with a peer to initiate file transfer.
          <p className={"italic"}>Closing the tab will end the transfer.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-2">
          <Input value={wordsToShare} readOnly className="flex-1" />
          <Button
            variant="outline"
            size="icon"
            className="relative ml-2 rounded-md"
            onClick={copyToClipboard}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
            <Copy
              className={`h-4 w-4 transition-all duration-300 ${
                copied ? "scale-0" : "scale-100"
              }`}
            />
            <Check
              className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-300 ${
                copied ? "scale-100" : "scale-0"
              }`}
            />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => window.location.reload()} variant="secondary">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
