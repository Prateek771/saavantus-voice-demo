import { createDiscoveryHandlers } from "@/lib/server/discovery-submission";
import {
  googleDiscoveryReady,
  saveDiscoveryRow,
} from "@/lib/server/google-discovery";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const handlers = createDiscoveryHandlers({
  ready: googleDiscoveryReady,
  save: saveDiscoveryRow,
});
export const GET = handlers.GET;
export const POST = handlers.POST;
