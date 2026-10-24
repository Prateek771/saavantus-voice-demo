import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import {
  googleClient,
  googleRequest,
  configurationPath,
  EXPECTED_GOOGLE_EMAIL,
} from "../lib/server/discovery-google-auth.mjs";
import { DISCOVERY_HEADERS } from "../lib/discovery-sheet.ts";
import { CONTACT_HEADERS } from "../lib/contact-sheet.ts";

const drive = "https://www.googleapis.com/drive/v3";
const quote = (text) => text.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
export function assertSetupSheetOwnership(file) {
  if (
    file.trashed ||
    file.mimeType !== "application/vnd.google-apps.spreadsheet" ||
    !file.capabilities?.canEdit ||
    !file.owners?.some(
      (owner) => owner.emailAddress?.toLowerCase() === EXPECTED_GOOGLE_EMAIL,
    )
  )
    throw new Error(
      "Setup requires a spreadsheet owned and editable by the approved account.",
    );
}
async function findOrCreate(client, name, parent, mimeType) {
  const query = `trashed = false and name = '${quote(name)}' and '${quote(parent)}' in parents and mimeType = '${mimeType}'`;
  const found = await googleRequest(
    client,
    `${drive}/files?${new URLSearchParams({ q: query, fields: "files(id,name,webViewLink),nextPageToken", pageSize: "100" })}`,
  );
  if ((found.files?.length ?? 0) > 1 || found.nextPageToken)
    throw new Error("Ambiguous destination.");
  if (found.files?.length) return { ...found.files[0], created: false };
  const created = await googleRequest(
    client,
    `${drive}/files?fields=id,name,webViewLink`,
    {
      method: "POST",
      data: { name, mimeType, parents: [parent] },
    },
  );
  return { ...created, created: true };
}
async function setup() {
  const client = await googleClient();
  const parent = process.env.DISCOVERY_GOOGLE_PARENT_FOLDER_ID || "root";
  if (!/^[a-zA-Z0-9_-]+$/.test(parent))
    throw new Error("Invalid selected parent.");
  if (parent !== "root") {
    const target = await googleRequest(
      client,
      `${drive}/files/${parent}?fields=id,mimeType,capabilities(canAddChildren),owners(emailAddress)`,
    );
    if (
      target.mimeType !== "application/vnd.google-apps.folder" ||
      !target.capabilities?.canAddChildren ||
      !target.owners?.some(
        (o) => o.emailAddress?.toLowerCase() === EXPECTED_GOOGLE_EMAIL,
      )
    )
      throw new Error(
        "Select a writable folder owned by the approved account.",
      );
  }
  const root = await findOrCreate(
    client,
    "Saavantus Excellence - AI Discovery 360",
    parent,
    "application/vnd.google-apps.folder",
  );
  const folders = {};
  for (const name of [
    "Assessment Data",
    "Generated Reports",
    "Report Templates",
    "System Logs",
    "Archived Reports",
  ])
    folders[name] = await findOrCreate(
      client,
      name,
      root.id,
      "application/vnd.google-apps.folder",
    );
  const sheet = await findOrCreate(
    client,
    "AI Discovery 360 - Assessments",
    folders["Assessment Data"].id,
    "application/vnd.google-apps.spreadsheet",
  );
  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}`;
  // A shared file can appear in My Drive. Apply the runtime ownership boundary
  // before adding tabs, writing headers, or changing any existing formatting.
  assertSetupSheetOwnership(
    await googleRequest(
      client,
      `${drive}/files/${sheet.id}?fields=mimeType,trashed,capabilities(canEdit),owners(emailAddress)`,
    ),
  );
  let meta = await googleRequest(
    client,
    base + "?fields=spreadsheetUrl,sheets(properties)",
  );
  for (const [title, headers] of [
    ["Assessments", DISCOVERY_HEADERS],
    ["Contact Queries", CONTACT_HEADERS],
  ]) {
    let tab = meta.sheets.find((s) => s.properties.title === title);
    if (!tab) {
      if (
        sheet.created &&
        title === "Assessments" &&
        meta.sheets.length === 1
      ) {
        const p = meta.sheets[0].properties;
        await googleRequest(client, base + ":batchUpdate", {
          method: "POST",
          data: {
            requests: [
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: p.sheetId,
                    title,
                    gridProperties: {
                      columnCount: headers.length,
                      rowCount: 1000,
                      frozenRowCount: 1,
                    },
                  },
                  fields: "title,gridProperties",
                },
              },
            ],
          },
        });
        tab = { properties: { ...p, title } };
      } else {
        // Add a tab without renaming, clearing, or shrinking any existing sheet.
        const added = await googleRequest(client, base + ":batchUpdate", {
          method: "POST",
          data: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title,
                    gridProperties: {
                      columnCount: Math.max(26, headers.length),
                      rowCount: 1000,
                      frozenRowCount: 1,
                    },
                  },
                },
              },
            ],
          },
        });
        tab = added.replies?.[0]?.addSheet;
        if (!tab?.properties)
          throw new Error("Sheet creation was not confirmed.");
      }
    }
    const range = encodeURIComponent(`'${title}'!1:1`);
    const header = await googleRequest(client, base + "/values/" + range);
    if (
      header.values?.length &&
      JSON.stringify(header.values[0]) !== JSON.stringify(headers)
    )
      throw new Error("Existing headers differ. Nothing was overwritten.");
    if (!header.values?.length)
      await googleRequest(
        client,
        base +
          "/values/" +
          encodeURIComponent(`'${title}'!A1`) +
          "?valueInputOption=RAW",
        { method: "PUT", data: { values: [headers] } },
      );
    await googleRequest(client, base + ":batchUpdate", {
      method: "POST",
      data: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: tab.properties.sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.25, green: 0.36, blue: 0.47 },
                  textFormat: {
                    bold: true,
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                  },
                  wrapStrategy: "WRAP",
                },
              },
              fields: "userEnteredFormat",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: tab.properties.sheetId,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: headers.length,
              },
              properties: { pixelSize: 180 },
              fields: "pixelSize",
            },
          },
        ],
      },
    });
    const readback = await googleRequest(client, base + "/values/" + range);
    if (JSON.stringify(readback.values?.[0]) !== JSON.stringify(headers))
      throw new Error("Header verification failed.");
  }
  meta = await googleRequest(client, base + "?fields=spreadsheetUrl");
  const config = {
    enabled: true,
    accountEmail: EXPECTED_GOOGLE_EMAIL,
    rootFolderId: root.id,
    folders: Object.fromEntries(
      Object.entries(folders).map(([name, file]) => [name, file.id]),
    ),
    spreadsheetId: sheet.id,
    spreadsheetUrl: meta.spreadsheetUrl,
  };
  await mkdir(dirname(configurationPath()), { recursive: true, mode: 0o700 });
  await writeFile(configurationPath(), JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
  console.log(
    "Verified Google Drive folders, assessment and contact headers for " +
      EXPECTED_GOOGLE_EMAIL +
      ".",
  );
  if (root.webViewLink) console.log("Folder: " + root.webViewLink);
  console.log("Sheet: " + meta.spreadsheetUrl);
  console.log(
    "Restart localhost, then complete one synthetic assessment and verify its saved row. Report folders are empty; no PDF or email feature is enabled.",
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  setup().catch(() => {
    console.error(
      "Google folder/sheet setup did not complete. No credentials or provider payloads were logged. Check authorization, selected folder access and existing headers; see docs/GOOGLE_DISCOVERY_SETUP.md.",
    );
    process.exitCode = 1;
  });
