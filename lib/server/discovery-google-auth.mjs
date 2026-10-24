import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { OAuth2Client } from "google-auth-library";

export const EXPECTED_GOOGLE_EMAIL = "mukesh.das@saavantus.com";
export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/drive.file",
];
export const credentialsPath = () =>
  resolve(
    /* turbopackIgnore: true */
    process.env.DISCOVERY_GOOGLE_CREDENTIALS_FILE ||
      ".data/google-discovery-oauth.json",
  );
export const configurationPath = () =>
  resolve(
    /* turbopackIgnore: true */
    process.env.DISCOVERY_GOOGLE_CONFIG_FILE ||
      ".data/google-discovery-config.json",
  );

export async function readPrivateJson(path) {
  const text = await readFile(path, "utf8");
  if (text.length > 65536) throw new Error("Invalid Google configuration.");
  return JSON.parse(text);
}

export async function googleClient() {
  const stored = await readPrivateJson(credentialsPath());
  if (
    stored.type !== "authorized_user" ||
    stored.account_email !== EXPECTED_GOOGLE_EMAIL ||
    ![stored.client_id, stored.client_secret, stored.refresh_token].every(
      (v) => typeof v === "string" && v.length > 0,
    )
  ) {
    throw new Error("Google Workspace authorization is required.");
  }
  const client = new OAuth2Client(stored.client_id, stored.client_secret);
  client.setCredentials({ refresh_token: stored.refresh_token });
  const identity = await googleRequest(
    client,
    "https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)",
  );
  if (identity.user?.emailAddress?.toLowerCase() !== EXPECTED_GOOGLE_EMAIL)
    throw new Error(
      "Google account does not match the approved Workspace account.",
    );
  return client;
}

export async function googleRequest(client, url, options = {}) {
  const target = new URL(url);
  if (
    target.protocol !== "https:" ||
    !["www.googleapis.com", "sheets.googleapis.com"].includes(target.hostname)
  )
    throw new Error("Invalid Google API destination.");
  const result = await client.request({
    url,
    timeout: 15000,
    retry: false,
    ...options,
  });
  return result.data;
}
