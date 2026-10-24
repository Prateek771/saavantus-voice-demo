import { createDiscoveryReportHandlers } from "@/lib/server/discovery-report-delivery";
import { generateDiscoveryPdf } from "@/lib/server/discovery-pdf";
import { sendDiscoveryMail } from "@/lib/server/discovery-mail";
import { requireVerifiedEmail } from "@/lib/server/discovery-email-verification";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const handlers=createDiscoveryReportHandlers({generate:generateDiscoveryPdf,send:sendDiscoveryMail,verify:requireVerifiedEmail});
export const POST=handlers.EMAIL;
