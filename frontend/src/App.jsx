import DownloadModal from "./components/downloadModal";
import UploadModal from "./components/uploadModal";
import { FlickeringGrid } from "components/ui/flickering-grid";
import "./index.css";
import { useState } from "react";
import ShareCard from "components/shareCard";

export default function App() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [pairingWords, setPairingWords] = useState("");

  return (
    <div className="relative flex flex-col items-center min-h-screen py-2 bg-white">
      <main className="flex flex-col justify-center items-center mt-40">
        <h1 className="text-5xl sm:text-7xl font-bold z-10 mb-20 text-tone">
          SeedShare
        </h1>
        {!isSeeding ? (
          <div className="z-10 w-max flex flex-row gap-8 relative p-6 rounded-xl backdrop-blur-sm bg-white/30 border border-white/40 shadow-lg">
            <UploadModal
              setIsSeeding={setIsSeeding}
              setPairingWords={setPairingWords}
            />
            <DownloadModal />
          </div>
        ) : (
          <ShareCard pairingWords={pairingWords} />
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
