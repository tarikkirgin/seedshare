import DownloadModal from "./components/downloadModal";
import UploadModal from "./components/uploadModal";
import { FlickeringGrid } from "components/ui/flickering-grid";
import "./index.css";
import { useState } from "react";
import ShareCard from "components/shareCard";
import DownloadView from "components/downloadView";

export default function App() {
  const [state, setState] = useState("default");
  const [pairingWords, setPairingWords] = useState("");
  const [downloadInfo, setDownloadInfo] = useState({});

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen py-2 bg-white overflow-hidden">
      <main className="flex flex-col justify-center items-center">
        {state === "default" && (
          <>
            <h1
              className="text-5xl sm:text-7xl font-bold z-10 -mt-60 text-tone px-40 py-16"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0) 100%)",
              }}
            >
              SeedShare
            </h1>
            <div className="z-10 w-max flex flex-col sm:flex-row gap-8 relative p-6 rounded-xl backdrop-blur-sm bg-white/30 border border-white/40 shadow-lg">
              <UploadModal
                setState={setState}
                setPairingWords={setPairingWords}
              />
              <DownloadModal
                setState={setState}
                setDownloadInfo={setDownloadInfo}
              />
            </div>
          </>
        )}
        {state === "seeding" && <ShareCard pairingWords={pairingWords} />}
        {state === "downloading" && (
          <div className="z-10">
            <DownloadView setState={setState} downloadInfo={downloadInfo} />
          </div>
        )}
      </main>

      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="size-full overflow-hidden"
          squareSize={4}
          gridGap={6}
          color="#46843D"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
        <div
          className="absolute inset-0 bg-white pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,1) 100%)",
          }}
        />
      </div>
    </div>
  );
}
