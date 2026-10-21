import { handleContactRequest } from "@/lib/server/contact";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  return handleContactRequest(request);
}
