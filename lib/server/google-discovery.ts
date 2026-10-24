import { mkdir, open, readFile, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import {
  googleClient,
  googleRequest,
  readPrivateJson,
  configurationPath,
  EXPECTED_GOOGLE_EMAIL,
} from "./discovery-google-auth.mjs";
import { DISCOVERY_HEADERS } from "../discovery-sheet.ts";
import { CONTACT_HEADERS } from "../contact-sheet.ts";

export function columnName(n: number): string {
  let result = "";
  while (n > 0) {
    n--;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
}

async function connection(tab = "Assessments", headers = DISCOVERY_HEADERS) {
  const config = await readPrivateJson(configurationPath());
  if (
    config.accountEmail !== EXPECTED_GOOGLE_EMAIL ||
    config.enabled !== true ||
    !/^[a-zA-Z0-9_-]+$/.test(config.spreadsheetId ?? "")
  )
    throw new Error("Google Sheets is not configured.");
  const client = await googleClient();
  const file = await googleRequest(
    client,
    `https://www.googleapis.com/drive/v3/files/${config.spreadsheetId}?fields=id,mimeType,trashed,capabilities(canEdit),owners(emailAddress)`,
  );
  if (
    file.trashed ||
    file.mimeType !== "application/vnd.google-apps.spreadsheet" ||
    !file.capabilities?.canEdit ||
    !file.owners?.some(
      (o: { emailAddress?: string }) =>
        o.emailAddress?.toLowerCase() === EXPECTED_GOOGLE_EMAIL,
    )
  )
    throw new Error(
      "The approved account must own and be able to edit the assessment sheet.",
    );
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/`;
  const header = await googleRequest(
    client,
    base + encodeURIComponent(`'${tab}'!A1:${columnName(headers.length)}1`),
  );
  if (JSON.stringify(header.values?.[0]) !== JSON.stringify(headers))
    throw new Error("Assessment sheet schema does not match.");
  return { client, base };
}

export async function googleDiscoveryReady(): Promise<boolean> {
  try {
    await connection();
    return true;
  } catch {
    return false;
  }
}

type SaveOptions = {
  connect?: () => Promise<Awaited<ReturnType<typeof connection>>>;
  directory?: string;
};
export async function saveDiscoveryRow(
  requestId: string,
  fingerprint: string,
  row: (string | number | boolean)[],
  options: SaveOptions = {},
): Promise<{ receiptId: string }> {
  return saveSheetRow(
    requestId,
    fingerprint,
    row,
    "Assessments",
    DISCOVERY_HEADERS,
    "discovery-receipts",
    options,
  );
}

export async function saveContactRow(
  requestId: string,
  fingerprint: string,
  row: (string | number | boolean)[],
  options: SaveOptions = {},
): Promise<{ receiptId: string }> {
  return saveSheetRow(
    requestId,
    fingerprint,
    row,
    "Contact Queries",
    CONTACT_HEADERS,
    "contact-google-receipts",
    options,
  );
}

async function saveSheetRow(
  requestId: string,
  fingerprint: string,
  row: (string | number | boolean)[],
  tab: string,
  headers: string[],
  namespace: string,
  options: SaveOptions,
): Promise<{ receiptId: string }> {
  if (
    !/^[a-f0-9-]{36}$/i.test(requestId) ||
    !/^[a-f0-9]{64}$/.test(fingerprint) ||
    row[0] !== requestId ||
    row[1] !== fingerprint ||
    row.length !== headers.length
  )
    throw new Error("Invalid assessment row.");
  const { client, base } = await (
    options.connect ?? (() => connection(tab, headers))
  )();
  const directory =
    options.directory ?? join(process.cwd(), ".data", namespace);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  // One writer across local processes. Never steal a possibly-live lock.
  const lockPath = join(directory, "writer.lock");
  const lock = await open(lockPath, "wx", 0o600);
  try {
    const receiptPath = join(directory, requestId + ".json");
    let prior: { fingerprint: string; status: string } | undefined;
    try {
      prior = JSON.parse(await readFile(receiptPath, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (prior && prior.fingerprint !== fingerprint)
      throw new Error("Submission identifier already used.");
    const metadata = await googleRequest(
      client,
      base.split("/values/")[0] +
        "?fields=sheets(properties(title,gridProperties(rowCount)))",
    );
    const capacity = metadata.sheets?.find(
      (s: { properties: { title: string } }) => s.properties.title === tab,
    )?.properties.gridProperties.rowCount;
    if (!Number.isInteger(capacity) || capacity < 2 || capacity > 100001)
      throw new Error("Assessment sheet capacity needs review.");
    const existing = await googleRequest(
      client,
      base + encodeURIComponent(`'${tab}'!A2:B${capacity}`),
    );
    const rows: string[][] = existing.values ?? [];
    const matches = rows.filter((r) => r[0] === requestId);
    if (matches.length) {
      if (matches.length !== 1 || matches[0][1] !== fingerprint)
        throw new Error("Submission identifier conflict.");
      await writeFile(
        receiptPath,
        JSON.stringify({ fingerprint, status: "confirmed" }),
        { mode: 0o600 },
      );
      return { receiptId: requestId };
    }
    if (prior)
      throw new Error(
        "Previous save is unconfirmed; review Google Sheets before retrying a write.",
      );
    if (rows.length >= 100000)
      throw new Error("Assessment sheet capacity reached.");
    // Persist no profile/answers here. A timed-out append is never blindly replayed.
    const receipt = await open(receiptPath, "wx", 0o600);
    try {
      await receipt.writeFile(
        JSON.stringify({ fingerprint, status: "pending" }),
      );
      await receipt.sync();
    } finally {
      await receipt.close();
    }
    const saved = await googleRequest(
      client,
      base +
        encodeURIComponent(`'${tab}'!A1`) +
        ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
      { method: "POST", data: { majorDimension: "ROWS", values: [row] } },
    );
    if (saved.updates?.updatedRows !== 1)
      throw new Error("Google save is unconfirmed.");
    await writeFile(
      receiptPath,
      JSON.stringify({ fingerprint, status: "confirmed" }),
      { mode: 0o600 },
    );
    return { receiptId: requestId };
  } finally {
    await lock.close();
    await unlink(lockPath);
  }
}
