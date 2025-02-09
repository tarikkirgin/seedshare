import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import LoadingMain from "./loadingMain";
import FileCard from "./fileCard";
import { AlertCircle } from "lucide-react"; // Replaced Error with AlertCircle

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
              <LoadingMain
                size={downloadInfo.length}
                count={downloadInfo.files.length}
              />
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
            <div className="border p-4 border-red-500 rounded-lg bg-red-600">
              <div className="flex items-center gap-4 mb-3">
                <AlertCircle className="text-white" size={32} />{" "}
                <h2 className="text-2xl text-white font-semibold">
                  Invalid Link
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-white">
                  This link is invalid; either the seeder disconnected or the
                  time to live has expired.
                </p>
                <p className="text-white">
                  Please contact the seeder to generate a new link.
                </p>
              </div>
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
