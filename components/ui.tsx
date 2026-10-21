export function Icon({
  name = "arrow",
  size = 20,
}: {
  name?: string;
  size?: number;
}) {
  const paths: Record<string, string> = {
    arrow: "M4 12h15m-6-6 6 6-6 6",
    play: "m8 5 11 7-11 7Z",
    check: "m5 12 4 4L19 6",
    calendar: "M7 3v4m10-4v4M4 10h16M4 5h16v16H4Z",
    close: "m6 6 12 12M6 18 18 6",
    menu: "M4 6h16M4 12h16M4 18h16",
    reset: "M4 9a8 8 0 1 1 0 7M4 3v6h6",
    shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6",
    chat: "M4 4h16v13H9l-5 4Z",
    file: "M6 3h8l4 4v14H6Zm4 7h4m-4 4h4m-4 4h4",
    external: "M14 4h6v6m0-6L10 14M10 4H4v16h16v-6",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] ?? paths.arrow} />
    </svg>
  );
}
export function Waveform({
  active = false,
  className = "",
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`waveform ${active ? "is-active" : ""} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 600 240" fill="none">
        {Array.from({ length: 22 }, (_, i) => {
          const d = Array.from({ length: 121 }, (_, j) => {
            const x = j * 5;
            const envelope = Math.exp(-(((x - 300) / 155) ** 2));
            const y =
              120 + Math.sin(x / 60 + i * 0.12) * (18 + i * 3.6) * envelope;
            return `${j ? "L" : "M"}${x},${y.toFixed(2)}`;
          }).join(" ");
          return (
            <path
              key={i}
              d={d}
              stroke="currentColor"
              strokeWidth=".8"
              opacity={0.36 + i * 0.022}
            />
          );
        })}
      </svg>
      <div className="wave-core" />
    </div>
  );
}
