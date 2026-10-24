import type { NextConfig } from "next";
const voiceEnabled = process.env.SARVAM_VOICE_ENABLED === "true";
const development = process.env.NODE_ENV === "development";
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
// Client-side navigation keeps the initial document's CSP. Permit only Google
// Maps paths and the approved Calendly origin on every document so navigating
// to Contact or back to the homepage can load the map or booking frame.
const contentSecurityPolicy = `default-src 'self'; script-src 'self' 'unsafe-inline' ${development ? "'unsafe-eval'" : ""} ${voiceEnabled ? "blob:" : ""}; worker-src 'self' ${voiceEnabled ? "blob:" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws://127.0.0.1:3100 ws://localhost:3100 ${voiceEnabled ? socketOrigin : ""}; media-src 'self' blob:; frame-src https://www.google.com/maps https://www.google.com/maps/ https://calendly.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'none'`;
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/discovery/*": [
      "./assets/**/*",
      "./public/saavantus-excellence-warm-charcoal.png",
    ],
  },
  // Owner OAuth credentials and recovery records are supplied at runtime only.
  outputFileTracingExcludes: {
    "/*": ["./.data/**/*", "./.env", "./.env.*", "./work/**/*"],
  },
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
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};
export default config;
