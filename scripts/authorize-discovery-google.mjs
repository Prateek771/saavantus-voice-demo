import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { OAuth2Client } from "google-auth-library";
import {
  EXPECTED_GOOGLE_EMAIL,
  GOOGLE_SCOPES,
  credentialsPath,
  readPrivateJson,
} from "../lib/server/discovery-google-auth.mjs";

async function authorize() {
  const mailMode = process.argv.includes("--mail");
  const source = resolve(
    process.env.DISCOVERY_GOOGLE_CLIENT_FILE ||
      ".data/google-oauth-client.json",
  );
  const document = await readPrivateJson(source);
  const config = document.installed ?? document.web;
  if (!config?.client_id || !config?.client_secret)
    throw new Error("Use the downloaded Google OAuth client JSON.");
  const redirectUri = "http://127.0.0.1:3111/oauth2callback";
  const client = new OAuth2Client(
    config.client_id,
    config.client_secret,
    redirectUri,
  );
  const state = randomBytes(32).toString("hex");
  const pkce = await client.generateCodeVerifierAsync();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: mailMode
      ? ["openid", "email", "https://www.googleapis.com/auth/gmail.send"]
      : GOOGLE_SCOPES,
    state,
    login_hint: EXPECTED_GOOGLE_EMAIL,
    code_challenge: pkce.codeChallenge,
    code_challenge_method: "S256",
  });
  await new Promise((resolveFlow, reject) => {
    let processing = false;
    const server = createServer(async (request, response) => {
      response.setHeader("Cache-Control", "no-store");
      response.setHeader("Content-Type", "text/plain; charset=utf-8");
      response.setHeader("Referrer-Policy", "no-referrer");
      if (
        request.headers.host !== "127.0.0.1:3111" ||
        request.method !== "GET"
      ) {
        response.writeHead(400).end("Invalid callback.");
        return;
      }
      const incoming = new URL(request.url || "/", redirectUri);
      if (incoming.pathname !== "/oauth2callback") {
        response.writeHead(404).end("Not found.");
        return;
      }
      const returned = incoming.searchParams.get("state") || "";
      if (
        Buffer.byteLength(returned) !== Buffer.byteLength(state) ||
        !timingSafeEqual(Buffer.from(returned), Buffer.from(state))
      ) {
        response
          .writeHead(400)
          .end("Invalid authorization state. Restart authorization.");
        return;
      }
      if (processing) {
        response.writeHead(409).end("Authorization already processing.");
        return;
      }
      processing = true;
      try {
        const code = incoming.searchParams.get("code");
        if (!code || incoming.searchParams.has("error"))
          throw new Error("Authorization was not completed.");
        const { tokens } = await client.getToken({
          code,
          codeVerifier: pkce.codeVerifier,
          redirect_uri: redirectUri,
        });
        if (!tokens.id_token || !tokens.refresh_token)
          throw new Error("Offline authorization was not granted.");
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: config.client_id,
        });
        const identity = ticket.getPayload();
        if (
          !identity?.email_verified ||
          identity.email?.toLowerCase() !== EXPECTED_GOOGLE_EMAIL
        )
          throw new Error("Sign in with the approved Workspace account.");
        if (
          mailMode &&
          !tokens.scope
            ?.split(" ")
            .includes("https://www.googleapis.com/auth/gmail.send")
        )
          throw new Error("Sending permission was not granted.");
        const file = mailMode
          ? resolve(".data/google-mail-oauth.json")
          : credentialsPath();
        await mkdir(dirname(file), { recursive: true, mode: 0o700 });
        await writeFile(
          file,
          JSON.stringify({
            type: "authorized_user",
            account_email: EXPECTED_GOOGLE_EMAIL,
            client_id: config.client_id,
            client_secret: config.client_secret,
            refresh_token: tokens.refresh_token,
            scopes: tokens.scope,
          }),
          { mode: 0o600 },
        );
        response.end(
          "Google authorization complete for Saavantus Excellence. You can close this tab.",
        );
        console.log(
          mailMode
            ? "Authorized the approved Workspace sender. Gmail credentials saved locally outside Git."
            : "Authorized the approved Workspace account. Credentials saved locally outside Git. Run npm run google:setup next.",
        );
        clearTimeout(timer);
        server.close();
        resolveFlow();
      } catch {
        response
          .writeHead(400)
          .end(
            "Authorization was not completed for the approved Workspace account. Restart the local authorization command.",
          );
        clearTimeout(timer);
        server.close();
        reject(
          new Error(
            "Google authorization failed. No token details were logged.",
          ),
        );
      }
    });
    const timer = setTimeout(
      () => {
        server.close();
        reject(new Error("Authorization timed out. Run the command again."));
      },
      10 * 60 * 1000,
    );
    server.on("error", () => {
      clearTimeout(timer);
      reject(
        new Error("Could not start the local OAuth callback on port 3111."),
      );
    });
    server.listen(3111, "127.0.0.1", () => {
      console.log(
        "Open this URL and authorize " + EXPECTED_GOOGLE_EMAIL + ":\n" + url,
      );
    });
  });
}
authorize().catch(() => {
  console.error(
    "Google setup needs a valid OAuth client at .data/google-oauth-client.json and authorization by the approved Workspace account. See docs/GOOGLE_DISCOVERY_SETUP.md.",
  );
  process.exitCode = 1;
});
