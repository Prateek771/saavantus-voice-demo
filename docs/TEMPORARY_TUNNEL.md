# Temporary public preview

Authorized October 22, 2026: run the existing website locally and share it through a public tunnel. The installed ngrok client forwards HTTPS to the production Next.js server bound to 127.0.0.1:3100. HTTP inspection is disabled. No permanent hosting or CRM connection was added.

`SAAVANTUS_PREVIEW_ORIGIN` allows exactly one HTTPS origin in addition to localhost for voice and contact requests. It is set only in the running server's environment. An unset or invalid value grants no public API access. The Host and Origin must match the configured address, and existing same-origin fetch checks, custom headers, payload limits, consent, version pinning and per-process limits remain intact. Permanent credentials remain server-only.

The current URL and PIDs are in ignored `work/tunnel-url.txt`, `work/tunnel.pid` and `work/server.pid`. Stop the verified tunnel PID to remove public access. Restarting the website without the preview-origin environment variable restores localhost-only API access. The link depends on this computer and both processes staying online. Ngrok's free service may show a one-time Visit Site notice.

Verification: all 24 tests and production build pass. Public homepage, real estate, healthcare and contact pages return 200. Both public voice-status endpoints report ready. An empty same-origin contact submission returns validation status 422 without saving; a cross-site voice-status request returns 403. The public homepage was visually inspected with WebGL rendering active. No paid voice call was started.
