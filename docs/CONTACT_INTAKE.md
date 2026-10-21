# Contact intake — local preview

The new `/contact` form replaces the non-saving business worksheet. It accepts enquiries only from the loopback app at `http://127.0.0.1:3100` or `http://localhost:3100`. Nothing is emailed, submitted to n8n/Sarvam or written to GoHighLevel. Callback preferences never reserve appointments.

## Data and access

The server writes one JSON file per submitted UUID under `.data/contact-requests/`. `.data/` is ignored by Git. There is no public read/list/export endpoint. The owner can open that directory locally to review records. Do not paste these records into chat, logs or source control; they may contain personal contact details. Delete specific records through normal file management when no longer needed. Automatic retention and production access controls are not implemented.

On Unix files request mode 0600 and directories 0700. Windows access follows inherited filesystem permissions; this change does not modify Windows ACLs. This is suitable for the owner's local preview, not a public multi-user service. Use fictional submissions for testing.

## Validation and storage behavior

Required: name (100 characters), business (140), email (254), industry (real-estate/healthcare/other), requirements (2000) and explicit consent. Optional phone accepts 7–15 digits. Optional callback date/time must be supplied together, be valid and fall within the next 366 days, interpreted as Asia/Kolkata (UTC+05:30). The saved callback timestamp is UTC with the timezone retained.

The API rejects unknown fields, malformed/oversized bodies (16 KiB), wrong media types and non-local/cross-origin submissions. A honeypot and 10-attempt process-wide hourly limit provide a modest local boundary. No submitted content is logged. The UI retains fields on error, explains failed saves and never claims email/CRM delivery.

The browser supplies a random UUID for idempotency. Writes use exclusive file creation, a per-record process lock and a filesystem sync. An identical retry returns its existing receipt; changing a previously saved request with the same UUID returns 409. The UI disables duplicate submission and creates a new UUID only for a new enquiry. If a write fails, only the file created by that attempt is removed so a retry can proceed. Existing records are never overwritten. A file left corrupted by a process or machine crash fails closed and needs local owner inspection.

## Future GoHighLevel mapping

| Stored field                          | Intended destination                                                               |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| name                                  | Contact name; split only after agreeing a naming rule                              |
| email, phone                          | Contact email/phone; phone normalization needs country selection for a public form |
| company                               | Business/company field                                                             |
| industry                              | Custom industry field or agreed tag                                                |
| requirements                          | Enquiry notes or agreed custom field                                               |
| source                                | website-contact attribution                                                        |
| requestId / receiptId                 | Idempotency/external reference                                                     |
| createdAt                             | Original submitted timestamp                                                       |
| consent, consentVersion               | Contact permission evidence; no marketing subscription implied                     |
| callbackRequestedAt, callbackTimezone | Requested callback time; not an appointment                                        |
| appointmentStatus                     | requested-not-booked or not-requested                                              |
| deliveryStatus                        | local-only until a verified downstream delivery succeeds                           |

A later CRM integration must check a selected calendar's availability, timezone and booking rules before confirming an appointment. Voice-agent collected fields remain a separate source and are not automatically copied into these enquiry files. No contact deduplication by email or notification sending is enabled yet.

## Verification

Five tests cover required consent and bounded fields; valid future IST times; durable writes and concurrent retry idempotency; cross-origin/media/body rejection with no save; and rate-limit expiry. They use synthetic data in temporary directories and remove only those test-owned directories. Type checking is part of the parent's integrated build checks.
