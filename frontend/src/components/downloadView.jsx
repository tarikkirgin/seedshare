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
            <p>loading</p>
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
