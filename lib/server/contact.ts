import { mkdir, open, readFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { sameOriginRequest } from "./request-origin.mjs";

type Contact = {
  requestId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  requirements: string;
  callbackRequestedAt: string | null;
  callbackTimezone: "Asia/Kolkata";
  consent: true;
};
type Validation =
  { ok: true; value: Contact } | { ok: false; errors: Record<string, string> };
const allowedFields = new Set([
  "requestId",
  "name",
  "company",
  "email",
  "phone",
  "industry",
  "requirements",
  "callbackDate",
  "callbackTime",
  "consent",
  "website",
]);
export function validateContact(input: unknown, now = Date.now()): Validation {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input))
    return { ok: false, errors: { form: "Please complete the contact form." } };
  const data = input as Record<string, unknown>;
  if (Object.keys(data).some((key) => !allowedFields.has(key)))
    errors.form =
      "The form contains an unsupported field. Reload and try again.";
  const text = (key: string, max: number, required = false) => {
    const value = typeof data[key] === "string" ? data[key].trim() : "";
    if (data[key] !== undefined && typeof data[key] !== "string")
      errors[key] = "Enter a text value.";
    if (
      (required && !value) ||
      value.length > max ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
    )
      errors[key] =
        required && !value
          ? "Please complete this field."
          : `Use ${max} characters or fewer, without control characters.`;
    return value;
  };
  const requestId = text("requestId", 36, true);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    errors.form = "Please reload the form and try again.";
  const name = text("name", 100, true),
    company = text("company", 140, true);
  const email = text("email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";
  const phone = text("phone", 32);
  if (
    phone &&
    (!/^[+()\d\s.-]+$/.test(phone) ||
      phone.replace(/\D/g, "").length < 7 ||
      phone.replace(/\D/g, "").length > 15)
  )
    errors.phone =
      "Enter a phone number with 7–15 digits, or leave this blank.";
  const industry = text("industry", 30, true);
  if (!["real-estate", "healthcare", "other"].includes(industry))
    errors.industry = "Choose your industry.";
  const requirements = text("requirements", 2000, true);
  const callbackDate = text("callbackDate", 10),
    callbackTime = text("callbackTime", 5);
  let callbackRequestedAt: string | null = null;
  if (callbackDate || callbackTime) {
    const timestamp = Date.parse(`${callbackDate}T${callbackTime}:00+05:30`);
    const validFormat =
      /^\d{4}-\d{2}-\d{2}$/.test(callbackDate) &&
      /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(callbackTime);
    const validDate =
      Number.isFinite(timestamp) &&
      new Date(timestamp + 330 * 60000).toISOString().slice(0, 16) ===
        `${callbackDate}T${callbackTime}`;
    if (
      !validFormat ||
      !validDate ||
      timestamp <= now ||
      timestamp > now + 366 * 86400000
    )
      errors.callbackDate =
        "Choose a future date and time within the next year, in India Standard Time.";
    else callbackRequestedAt = new Date(timestamp).toISOString();
  }
  if (data.consent !== true)
    errors.consent =
      "Please confirm that Saavantus may contact you about this enquiry.";
  if (text("website", 0))
    errors.form = "This submission could not be accepted.";
  return Object.keys(errors).length
    ? { ok: false, errors }
    : {
        ok: true,
        value: {
          requestId,
          name,
          company,
          email,
          phone,
          industry,
          requirements,
          callbackRequestedAt,
          callbackTimezone: "Asia/Kolkata",
          consent: true,
        },
      };
}
export function createContactLimiter(max = 10, windowMs = 3600000) {
  let starts: number[] = [];
  return (now: number) => {
    starts = starts.filter((time) => now - time < windowMs);
    if (starts.length >= max) return false;
    starts.push(now);
    return true;
  };
}
const defaultAdmit = createContactLimiter();
const locks = new Map<string, Promise<void>>();
async function storeContact(contact: Contact, storePath: string, now: number) {
  const file = join(storePath, `${contact.requestId}.json`);
  const previous = locks.get(file) ?? Promise.resolve();
  let unlock!: () => void;
  const current = new Promise<void>((resolve) => {
    unlock = resolve;
  });
  locks.set(file, current);
  await previous;
  try {
    await mkdir(storePath, { recursive: true, mode: 0o700 });
    const record = {
      ...contact,
      receiptId: contact.requestId,
      createdAt: new Date(now).toISOString(),
      source: "website-contact",
      deliveryStatus: "local-only",
      appointmentStatus: contact.callbackRequestedAt
        ? "requested-not-booked"
        : "not-requested",
      consentVersion: "contact-v1",
    };
    let handle;
    try {
      handle = await open(file, "wx", 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const saved = JSON.parse(await readFile(file, "utf8"));
      const matches = Object.keys(contact).every(
        (key) => saved[key] === contact[key as keyof Contact],
      );
      return {
        status: matches ? 200 : 409,
        receiptId: saved.receiptId as string,
      };
    }
    try {
      await handle.writeFile(JSON.stringify(record) + "\n", "utf8");
      await handle.sync();
      await handle.close();
    } catch (error) {
      await handle.close().catch(() => {});
      // Only this attempt created the file (wx). Preserve all existing records.
      await unlink(file).catch(() => {});
      throw error;
    }
    return { status: 201, receiptId: record.receiptId };
  } finally {
    unlock();
    if (locks.get(file) === current) locks.delete(file);
  }
}
const response = (body: unknown, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function handleContactRequest(
  request: Request,
  options: {
    storePath?: string;
    now?: () => number;
    admit?: (now: number) => boolean;
  } = {},
) {
  if (request.method !== "POST")
    return response({ error: "Method not allowed." }, 405);
  if (
    !sameOriginRequest(request.headers) ||
    request.headers.get("sec-fetch-site") !== "same-origin" ||
    request.headers.get("x-saavantus-contact") !== "1"
  )
    return response(
      { error: "Open the contact form on the configured website to submit." },
      403,
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  )
    return response(
      { error: "The form could not be read. Reload and try again." },
      415,
    );
  const now = (options.now ?? Date.now)();
  if (!(options.admit ?? defaultAdmit)(now))
    return response(
      {
        error:
          "This preview has reached its hourly submission limit. Please try again later.",
      },
      429,
    );
  const limit = 16384;
  if (Number(request.headers.get("content-length")) > limit)
    return response(
      { error: "The form is too large. Shorten your message and try again." },
      413,
    );
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader)
      return response({ error: "Please complete the contact form." }, 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        return response(
          {
            error: "The form is too large. Shorten your message and try again.",
          },
          413,
        );
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response(
      { error: "The form could not be read. Reload and try again." },
      400,
    );
  }
  const result = validateContact(input, now);
  if (!result.ok)
    return response(
      {
        error: "Check the highlighted fields and try again.",
        fields: result.errors,
      },
      422,
    );
  try {
    const saved = await storeContact(
      result.value,
      options.storePath ?? join(process.cwd(), ".data", "contact-requests"),
      now,
    );
    if (saved.status === 409)
      return response(
        {
          error:
            "An earlier version of this request was already saved. Reload to create a new enquiry.",
        },
        409,
      );
    return response(
      {
        receiptId: saved.receiptId,
        saved: true,
        deliveryStatus: "local-only",
        appointmentBooked: false,
      },
      saved.status,
    );
  } catch {
    return response(
      {
        error:
          "We could not save this request. Your details are still in the form; please try again.",
      },
      503,
    );
  }
}
