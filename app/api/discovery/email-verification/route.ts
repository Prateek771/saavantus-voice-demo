import { createEmailVerificationHandlers } from "@/lib/server/discovery-email-verification";
import { mailReady, sendVerificationCode } from "@/lib/server/discovery-mail";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const handlers = createEmailVerificationHandlers({mailReady,sendCode:sendVerificationCode});
export const GET = handlers.GET;
export const POST = handlers.POST;
