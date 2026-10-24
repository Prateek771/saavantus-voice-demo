# AI Discovery verified email and PDF reports

The organization profile requires a verified email before continuing. Assessment storage, PDF download and email delivery also check the exact normalized address against an HttpOnly session cookie on the server. Editing the address requires verification again. Case and surrounding whitespace do not change the identity.

## Owner setup

Approved sender: mukesh.das@saavantus.com. Enable Gmail API in the existing OAuth client's Google Cloud project. Run `npm run google:authorize -- --mail` and complete consent as that account. The existing loopback callback is http://127.0.0.1:3111/oauth2callback. Consent requests OpenID, email and Gmail send-only permission. It does not request inbox reading.

Mail credentials are stored only in ignored `.data/google-mail-oauth.json`. Drive/Sheets authorization remains in its separate existing file. Never copy tokens into frontend variables, Git, documentation or screenshots. The mail adapter refreshes the token and verifies the account before sending.

## Visitor flow

1. Enter the organization profile and request a six-digit verification code.
2. Email syntax, the bundled disposable-domain list, and domain MX records are checked before delivery. These checks do not prove a person's identity or guarantee every disposable service is blocked. Receiving and entering the code proves access to that mailbox at that time.
3. Codes expire after 10 minutes and five attempts. Verification is bound to the browser cookie and address for 24 hours. Codes and cookie values are not stored in plaintext.
4. Complete the forty statements. The report offers Print / save PDF, Download PDF and Email my report. Email always uses the verified profile address, never a caller-selected alternate recipient.
5. Downloaded and emailed PDFs use the same server generator and recomputed scores. Each page has the approved company logo as a large, faint centered watermark. Browser print also has a fixed watermark, but browser pagination may differ.

The attachment includes scores, coverage, dimension summaries, methodology, SWOT observations, the 30/60/90-day plan and organization details. The response appendix and individual answer statements were removed at the owner's request. Assessment collection, scoring and Google Sheets storage are unchanged. Report revision participates in email deduplication so an explicitly requested updated report can be sent even if an older-format report was sent before. Unsupported font characters are explicitly represented as Unicode code points rather than silently dropped.

## Delivery and persistence

Gmail acceptance is reported as sent; it is not proof of inbox delivery. Identical report content is deduplicated independently of request IDs. Unconfirmed sends retain a pending receipt and are not automatically resent. Verification messages are sent only on explicit request. No marketing messages are sent.

Local preview uses durable files under ignored `.data/discovery-email-verification` and `.data/discovery-report-delivery`. OTP requests have a 60-second cooldown and five requests per address per hour. A shared local-preview quota allows twenty sends and fifty code checks per hour, ignoring caller-supplied forwarding headers. Report email allows three attempts per address per hour. File locks and this shared quota are intended for the current single-process preview, not a distributed/serverless deployment. A public deployment needs shared transactional storage and trusted-proxy rate limiting. Stale lock files after a process crash require operator investigation, not blind deletion.

PDFs are generated in memory, not archived automatically. Receipt files contain hashes/status, not report content. Verification state contains the normalized address and expiry and is pruned on later verification requests; it is separate from the approved Google Sheet assessment records.

Security update 2026-10-24: PDF generation additionally allows ten downloads per verified address per hour, sixty per process per hour and at most two concurrent jobs. Public provider-readiness booleans coalesce concurrent requests and refresh at most every thirty seconds per handler; mailbox proof and send/save authorization are not shared or cached. Assessment acceptance quotas ignore untrusted forwarding headers and apply only after validation and email proof; invalid contact requests do not consume the enquiry acceptance budget. See SECURITY_REVIEW_2026-10-24.md for coverage and remaining public-deployment work.

## Bundled asset sources

- DM Sans font: https://github.com/google/fonts/tree/main/ofl/dmsans — SIL Open Font License, copied in assets/report-font-LICENSE.txt.
- Disposable domains: https://github.com/disposable-email-domains/disposable-email-domains — local blocklist snapshot retrieved 2026-10-23, license copied in assets/disposable-email-domains-LICENSE.txt. Update this snapshot periodically and review false positives.
- Gmail MIME/send contract: https://developers.google.com/workspace/gmail/api/guides/sending
- Gmail scope: https://developers.google.com/workspace/gmail/api/auth/scopes

Automated checks exercise mocked mail delivery, cookie/address binding, expiry, abuse boundaries, deduplication, uncertain failures and PDF pages/watermarks. Real Gmail authorization and inbox receipt are separate acceptance checks; tests do not send live email.

## Verification record — 2026-10-23

- 58 automated tests passed; production build and TypeScript checks passed without build warnings.
- Generated an eight-page synthetic PDF and visually reviewed its pages, including centered watermarks and the response appendix.
- Restarted the local production preview with all three report controls and profile verification.
- Separate Gmail authorization completed for the approved Workspace sender. The localhost verification endpoint returned ready=true.
- With the owner's explicit test approval, requested one verification code to the sender's own mailbox. The owner received and verified it. The browser continued to the assessment with the verified address.
- Completed all forty synthetic answers. Google Sheets confirmed receipt b4153d28-df04-4287-87bc-309c5f5e95c4 for the clearly labelled TEST organization.
- Clicked Email my report in the browser. Gmail accepted the watermarked attachment for mukesh.das@saavantus.com and the UI showed Report email sent. Actual PDF inbox receipt remains the recipient's confirmation.
- Audited site copy, metadata, PDF and email branding: all visible names use Saavantus Excellence. PDF attachment filenames now use the full name too.
