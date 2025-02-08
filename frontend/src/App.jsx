import DownloadTorrent from "./components/downloadTorrent";
import FileUpload from "./components/fileUpload";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FileUpload />
        <DownloadTorrent />
      </header>
    </div>
  );
}
