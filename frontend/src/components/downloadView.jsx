import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import FileCard from "./fileCard";

import { Loader2 } from "lucide-react";

export default function DownloadView({ downloadInfo }) {
  const hasFiles = downloadInfo?.files?.length > 0;

  return (
    <Card className={"bg-white z-10 shadow-lg w-64 sm:w-96"}>
      <CardHeader>
        <CardTitle>{downloadInfo.done ? "Seeding" : "Downloading"}</CardTitle>
      </CardHeader>
      <CardContent className={"flex flex-col justify-center items-center"}>
        <div className="w-full ">
          {hasFiles ? (
            <>
              <div>
                <p className="text-sm">
                  File count:{" "}
                  <span className="font-bold">{downloadInfo.files.length}</span>
                </p>
                <p className="text-sm">
                  Download size:{" "}
                  <span className="font-bold">
                    {Math.round(downloadInfo.length / 1024)} kilobytes
                  </span>
                </p>
              </div>
              <div className="pt-4 flex flex-col overflow-y-auto max-h-96 gap-3">
                {downloadInfo.files.map((file, index) => (
                  <FileCard
                    key={index}
                    filePath={file.path}
                    fileSize={file.length}
                    progress={file.progress}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => window.location.reload()} variant="secondary">
          {downloadInfo.done ? "Close" : "Cancel"}
        </Button>
      </CardFooter>
    </Card>
  );
}
