import type { NextConfig } from "next";
const voiceEnabled = process.env.SARVAM_VOICE_ENABLED === "true";
let socketOrigin = "";
try {
  const value = new URL(process.env.SARVAM_WS_ORIGIN ?? "");
  if (
    value.protocol === "wss:" &&
    value.origin === process.env.SARVAM_WS_ORIGIN
  )
    socketOrigin = value.origin;
} catch {
  /* Not configured. */
}
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              voiceEnabled && socketOrigin
                ? "microphone=(self), camera=(), geolocation=()"
                : "microphone=(), camera=(), geolocation=()",
          },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${voiceEnabled ? "blob:" : ""}; worker-src 'self' ${voiceEnabled ? "blob:" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws://127.0.0.1:3100 ws://localhost:3100 ${voiceEnabled ? socketOrigin : ""}; media-src 'self' blob:; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'`,
          },
        ],
      },
    ];
  },
};
export default config;
