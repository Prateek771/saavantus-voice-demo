import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
const sender = "mukesh.das@saavantus.com";
async function mailClient() {
  const stored = JSON.parse(
    await readFile(join(process.cwd(), ".data/google-mail-oauth.json"), "utf8"),
  );
  if (
    stored.account_email !== sender ||
    !stored.scopes
      ?.split(" ")
      .includes("https://www.googleapis.com/auth/gmail.send")
  )
    throw Error("Email authorization required.");
  const client = new OAuth2Client(stored.client_id, stored.client_secret);
  client.setCredentials({ refresh_token: stored.refresh_token });
  const identity = await client.request<{
    email?: string;
    verified_email?: boolean;
  }>({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    timeout: 15000,
    retry: false,
  });
  if (
    identity.data.email?.toLowerCase() !== sender ||
    !identity.data.verified_email
  )
    throw Error("Incorrect sender account.");
  return client;
}
export async function mailReady() {
  try {
    await mailClient();
    return true;
  } catch {
    return false;
  }
}
export async function sendDiscoveryMail(
  to: string,
  subject: string,
  text: string,
  pdf?: Uint8Array,
) {
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      to,
    ) ||
    /[\r\n]/.test(subject)
  )
    throw Error("Invalid email.");
  const client = await mailClient(),
    boundary = "saavantus_" + randomUUID();
  const base64 = (value: Uint8Array | string) =>
    Buffer.from(value)
      .toString("base64")
      .match(/.{1,76}/g)
      ?.join("\r\n") ?? "";
  const lines = [
    `From: Saavantus Excellence <${sender}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    base64(text),
  ];
  if (pdf)
    lines.push(
      `--${boundary}`,
      'Content-Type: application/pdf; name="Saavantus-Excellence-AI-Discovery.pdf"',
      'Content-Disposition: attachment; filename="Saavantus-Excellence-AI-Discovery.pdf"',
      "Content-Transfer-Encoding: base64",
      "",
      base64(pdf),
    );
  lines.push(`--${boundary}--`, "");
  const response = await client.request<{ id?: string }>({
    url: "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    method: "POST",
    data: { raw: Buffer.from(lines.join("\r\n")).toString("base64url") },
    timeout: 20000,
    retry: false,
  });
  if (!response.data.id) throw Error("Email delivery unconfirmed.");
  return response.data.id;
}
export async function sendVerificationCode(email: string, code: string) {
  await sendDiscoveryMail(
    email,
    "Verify your email - Saavantus Excellence",
    `Your AI Discovery verification code is ${code}. It expires in 10 minutes. If you did not request it, ignore this message. Do not share this code.`,
  );
}
