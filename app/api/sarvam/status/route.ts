import {
  localRequestAllowed,
  publicVoiceConfig,
  readVoiceConfig,
} from "@/lib/server/sarvam";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  if (!localRequestAllowed(request.headers))
    return Response.json({ ready: false }, { status: 403, headers });
  const industry = new URL(request.url).searchParams.get("industry") ?? "";
  const config = readVoiceConfig(process.env, industry);
  return Response.json(
    config
      ? { ready: true, config: publicVoiceConfig(config), maxSeconds: 180 }
      : {
          ready: false,
          message:
            "Voice setup is awaiting Sarvam workspace access. You can still use the scripted walkthrough below.",
        },
    { headers },
  );
}
