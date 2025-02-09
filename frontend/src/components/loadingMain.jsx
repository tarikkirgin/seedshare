export default function LoadingMain({ size, count }) {
  return (
    <div>
      <p className="text-sm">
        File count: <span className="font-bold">{count}</span>
      </p>
      <p className="text-sm">
        Download size:{" "}
        <span className="font-bold">{Math.round(size / 1024)} kilobytes</span>
      </p>
    </div>
  );
}
