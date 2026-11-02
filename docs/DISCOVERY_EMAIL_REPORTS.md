# AI Discovery PDF downloads

## Current flow - November 2, 2026

The organization profile keeps its required business-email field and format validation, but no OTP or mailbox ownership check is required. Visitors give data-processing consent, complete the forty statements, and can use Download PDF or Print / save PDF. There is no Email my report control. The verification and report-email API routes and their mail adapters have been removed.

Assessment collection, scoring and connected Google Sheets storage are unchanged apart from removing the verification-cookie requirement. Server-side consent, email format, exact response schema, request origin, media type and request-size validation remain. Assessment saving still confirms Google Sheets delivery before reporting success.

PDFs are recomputed from the supplied validated answers. The generator, watermark, dimension dashboard, SWOT, roadmap and organization details are unchanged. The cover ends after the readiness/adoption scores. Downloads do not require Gmail credentials or a verification cookie and are not archived automatically.

PDF generation keeps ten downloads per supplied address per hour, sixty per process per hour and at most two concurrent jobs. The address is user supplied and is not a verified identity; the process-wide budget and concurrency cap still apply when an address changes. These are the existing single-process limits, not distributed deployment guarantees. Assessment saving keeps its existing process-wide acceptance budget and rejects invalid input before consuming that budget.

Existing ignored OAuth files, historical verification state and delivery receipts are left on the owner's computer; this change does not delete credentials or assessment records. No code path in the Discovery flow sends email. Historic setup scripts and assets do not activate email delivery.

The record below describes an earlier version and is retained as historical evidence only.

### Current verification

65 tests, TypeScript and the production build pass. Localhost checks confirm the assessment page loads without the verification section, both removed email POST endpoints return 404, and a synthetic PDF download returns HTTP 200/application/pdf without a verification cookie or Gmail dependency. The check sent no email and saved no assessment. A read-only review found no dangling runtime imports or outbound-email implementation. The browser inspection tool was unavailable for this final check; verification used the running routes and automated tests.

## Verification record — 2026-10-23

- 58 automated tests passed; production build and TypeScript checks passed without build warnings.
- Generated an eight-page synthetic PDF and visually reviewed its pages, including centered watermarks and the response appendix.
- Restarted the local production preview with all three report controls and profile verification.
- Separate Gmail authorization completed for the approved Workspace sender. The localhost verification endpoint returned ready=true.
- With the owner's explicit test approval, requested one verification code to the sender's own mailbox. The owner received and verified it. The browser continued to the assessment with the verified address.
- Completed all forty synthetic answers. Google Sheets confirmed receipt b4153d28-df04-4287-87bc-309c5f5e95c4 for the clearly labelled TEST organization.
- Clicked Email my report in the browser. Gmail accepted the watermarked attachment for mukesh.das@saavantus.com and the UI showed Report email sent. Actual PDF inbox receipt remains the recipient's confirmation.
- Audited site copy, metadata, PDF and email branding: all visible names use Saavantus Excellence. PDF attachment filenames now use the full name too.
