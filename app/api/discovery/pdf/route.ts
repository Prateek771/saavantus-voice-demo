import { createDiscoveryReportHandlers } from "@/lib/server/discovery-report-delivery";
import { generateDiscoveryPdf } from "@/lib/server/discovery-pdf";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createDiscoveryReportHandlers({
  generate: generateDiscoveryPdf,
}).PDF;
