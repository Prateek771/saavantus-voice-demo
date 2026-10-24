import {
  randomBytes,
  randomInt,
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { join } from "node:path";
import { resolveMx } from "node:dns/promises";
import { sameOriginRequest } from "./request-origin.mjs";
import { cachedCheck } from "./cached-check.ts";

const COOKIE = "saavantus_discovery_email";
const TEN_MINUTES = 600_000,
  DAY = 86_400_000,
  HOUR = 3_600_000;
const defaultDirectory = () =>
  join(process.cwd(), ".data", "discovery-email-verification");
type Session = {
  email: string;
  otp: string;
  expires: number;
  attempts: number;
  verifiedUntil: number;
};
type State = {
  sessions: Record<string, Session>;
  limits: Record<string, number[]>;
};
type Dependencies = {
  mailReady: () => Promise<boolean>;
  sendCode: (email: string, code: string) => Promise<unknown>;
  checkDomain?: (domain: string) => Promise<boolean>;
  now?: () => number;
  directory?: string;
};
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
export function normalizeVerificationEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 &&
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/.test(
      email,
    ) &&
    !email.includes("..")
    ? email
    : null;
}
export async function checkVerificationDomain(
  domain: string,
  options: { lookup?: typeof resolveMx; denylistPath?: string } = {},
): Promise<boolean> {
  // Fail closed if the local list is unavailable; never silently skip the policy.
  const list = options.denylistPath
    ? await readFile(/* turbopackIgnore: true */ options.denylistPath, "utf8")
    : await readFile(
        join(process.cwd(), "assets", "disposable-email-domains.txt"),
        "utf8",
      );
  const denied = new Set(
    list
      .split(/\r?\n/)
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith("#")),
  );
  const labels = domain.toLowerCase().split(".");
  if (labels.some((_, i) => denied.has(labels.slice(i).join("."))))
    return false;
  try {
    const mx = await (options.lookup ?? resolveMx)(domain);
    return (
      mx.length > 0 &&
      mx.every((record) => record.exchange && record.exchange !== ".")
    );
  } catch (error) {
    if (
      ["ENODATA", "ENOTFOUND"].includes(
        (error as NodeJS.ErrnoException).code ?? "",
      )
    )
      return false;
    throw error;
  }
}
function sessionHash(request: Request): string | null {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(COOKIE + "="))
    ?.slice(COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? hash(value) : null;
}
async function readState(directory: string): Promise<State> {
  try {
    return JSON.parse(await readFile(join(directory, "state.json"), "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return { sessions: {}, limits: {} };
  }
}
async function locked<T>(
  directory: string,
  operation: (state: State, key: Buffer) => Promise<T>,
): Promise<T> {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, "writer.lock");
  const lock = await open(path, "wx", 0o600);
  try {
    const secretPath = join(directory, "server.key");
    let key: Buffer;
    try {
      key = await readFile(secretPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      key = randomBytes(32);
      const file = await open(secretPath, "wx", 0o600);
      try {
        await file.writeFile(key);
        await file.sync();
      } finally {
        await file.close();
      }
    }
    if (key.byteLength !== 32) throw Error("Invalid verification key.");
    const state = await readState(directory);
    const result = await operation(state, key);
    const temporary = join(directory, "state.pending");
    const file = await open(temporary, "w", 0o600);
    try {
      await file.writeFile(JSON.stringify(state));
      await file.sync();
    } finally {
      await file.close();
    }
    await rename(temporary, join(directory, "state.json"));
    return result;
  } finally {
    await lock.close();
    await unlink(path);
  }
}
const codeHash = (key: Buffer, id: string, email: string, code: string) =>
  createHmac("sha256", key)
    .update(JSON.stringify([id, email, code]))
    .digest("hex");
function admit(
  state: State,
  bucket: string,
  time: number,
  max: number,
  window = HOUR,
) {
  const times = (state.limits[bucket] ?? []).filter(
    (start) => time - start < window,
  );
  state.limits[bucket] = times;
  if (times.length >= max) return false;
  times.push(time);
  return true;
}
export async function requireVerifiedEmail(
  request: Request,
  email: string,
  options: { directory?: string; now?: () => number } = {},
): Promise<boolean> {
  const normalized = normalizeVerificationEmail(email),
    id = sessionHash(request);
  if (!normalized || !id) return false;
  try {
    const session = (await readState(options.directory ?? defaultDirectory()))
      .sessions[id];
    return (
      !!session &&
      session.email === normalized &&
      session.verifiedUntil > (options.now ?? Date.now)()
    );
  } catch {
    return false;
  }
}
export function createEmailVerificationHandlers(deps: Dependencies) {
  const directory = deps.directory ?? defaultDirectory(),
    now = deps.now ?? Date.now;
  const mailReady = cachedCheck(deps.mailReady, now);
  const json = (body: unknown, status = 200, cookie?: string) =>
    Response.json(body, {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...(cookie ? { "Set-Cookie": cookie } : {}),
      },
    });
  const boundary = (request: Request, post = true) =>
    sameOriginRequest(request.headers, post) &&
    request.headers.get("sec-fetch-site") === "same-origin" &&
    request.headers.get("x-saavantus-discovery") === "1";
  return {
    GET: async (request: Request) => {
      if (!boundary(request, false))
        return json({ ready: false, verified: false }, 403);
      let ready = false;
      try {
        ready = await mailReady();
      } catch {}
      const email = new URL(request.url).searchParams.get("email") ?? "";
      return json({
        ready,
        verified: await requireVerifiedEmail(request, email, {
          directory,
          now,
        }),
      });
    },
    POST: async (request: Request) => {
      if (!boundary(request))
        return json(
          { error: "Open this form on the configured website." },
          403,
        );
      if (
        request.headers
          .get("content-type")
          ?.split(";")[0]
          .trim()
          .toLowerCase() !== "application/json"
      )
        return json({ error: "Use JSON." }, 415);
      let data: Record<string, unknown>;
      try {
        if (Number(request.headers.get("content-length")) > 4096)
          return json({ error: "Request is too large." }, 413);
        const reader = request.body?.getReader();
        if (!reader)
          return json({ error: "Complete the verification form." }, 400);
        const chunks: Uint8Array[] = [];
        let bytes = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          bytes += part.value.byteLength;
          if (bytes > 4096) {
            await reader.cancel();
            return json({ error: "Request is too large." }, 413);
          }
          chunks.push(part.value);
        }
        const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (!input || typeof input !== "object" || Array.isArray(input))
          throw Error();
        data = input;
      } catch {
        return json({ error: "Enter valid verification details." }, 400);
      }
      const email = normalizeVerificationEmail(data.email),
        action = data.action;
      if (
        !email ||
        !["send", "verify"].includes(String(action)) ||
        Object.keys(data).some(
          (k) =>
            ![
              "action",
              "email",
              ...(action === "verify" ? ["code"] : []),
            ].includes(k),
        )
      )
        return json(
          { error: "Enter a valid email and verification action." },
          400,
        );
      if (
        action === "verify" &&
        (typeof data.code !== "string" || !/^\d{6}$/.test(data.code))
      )
        return json({ error: "Enter the six-digit code." }, 400);
      try {
        return await locked(directory, async (state, key) => {
          const time = now();
          for (const [id, s] of Object.entries(state.sessions))
            if (Math.max(s.expires, s.verifiedUntil) <= time)
              delete state.sessions[id];
          for (const [bucket, times] of Object.entries(state.limits)) {
            const current = times.filter((t) => time - t < HOUR);
            if (current.length) state.limits[bucket] = current;
            else delete state.limits[bucket];
          }
          if (
            Object.keys(state.sessions).length > 10_000 ||
            Object.keys(state.limits).length > 30_000
          )
            return json({ error: "Verification is busy. Retry later." }, 503);
          // Local preview has no trusted proxy configuration. Never trust a caller-supplied IP header.
          const ip = "shared-local-preview";
          if (action === "verify") {
            if (!admit(state, "verify-ip:" + ip, time, 50))
              return json({ error: "Too many attempts. Retry later." }, 429);
            const id = sessionHash(request),
              session = id ? state.sessions[id] : undefined;
            if (
              !id ||
              !session ||
              session.email !== email ||
              session.expires <= time ||
              session.attempts >= 5
            )
              return json(
                { error: "Code is invalid or expired. Request a new code." },
                400,
              );
            session.attempts++;
            const expected = Buffer.from(session.otp, "hex"),
              provided = Buffer.from(
                codeHash(key, id, email, data.code as string),
                "hex",
              );
            if (
              expected.length !== provided.length ||
              !timingSafeEqual(expected, provided)
            )
              return json(
                { error: "Code is invalid or expired. Request a new code." },
                400,
              );
            session.verifiedUntil = time + DAY;
            session.otp = "";
            session.expires = time;
            return json({ verified: true });
          }
          if (
            !admit(state, "send-ip:" + ip, time, 20) ||
            !admit(state, "send-email:" + hash(email), time, 5) ||
            !admit(state, "cooldown:" + hash(email), time, 1, 60_000)
          )
            return json(
              { error: "Please wait before requesting another code." },
              429,
            );
          let ready = false;
          try {
            ready = await deps.mailReady();
          } catch {}
          if (!ready)
            return json(
              {
                error:
                  "Verification email is not configured. Please try again later.",
              },
              503,
            );
          let valid = false;
          try {
            valid = await (deps.checkDomain ?? checkVerificationDomain)(
              email.split("@")[1],
            );
          } catch {
            return json(
              {
                error:
                  "The email domain could not be checked. Please retry later.",
              },
              503,
            );
          }
          if (!valid)
            return json(
              {
                error: "Use a non-disposable email domain that accepts email.",
              },
              400,
            );
          const token = randomBytes(32).toString("hex"),
            id = hash(token),
            code = String(randomInt(0, 1_000_000)).padStart(6, "0");
          try {
            await deps.sendCode(email, code);
          } catch {
            return json(
              {
                error:
                  "The verification email could not be sent. Please retry later.",
              },
              503,
            );
          }
          const old = sessionHash(request);
          if (old) delete state.sessions[old];
          state.sessions[id] = {
            email,
            otp: codeHash(key, id, email, code),
            expires: time + TEN_MINUTES,
            attempts: 0,
            verifiedUntil: 0,
          };
          const secure =
            new URL(request.url).protocol === "https:" ||
            request.headers.get("origin")?.startsWith("https://");
          const cookie = `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${secure ? "; Secure" : ""}`;
          return json({ sent: true }, 200, cookie);
        });
      } catch {
        return json(
          { error: "Verification is temporarily unavailable. Please retry." },
          503,
        );
      }
    },
  };
}
