# Local preview verification

Verified October 21, 2026. This record covers the disconnected local preview, not a production deployment or provider integration.

## Automated and runtime checks

- Seven deterministic workflow tests passed: booking guards, edited preferences, duplicate booking prevention/reset, unavailable-service recovery, rescheduling/cancellation, healthcare field boundaries, language locking/early exit, and appointment-only healthcare intent.
- TypeScript check and Next.js production build passed.
- All six public routes returned HTTP 200: homepage, both demo pages, contact, privacy and terms.
- Responses disable microphone, camera and geolocation with Permissions-Policy. The application CSP restricts connections to the local application.
- Source audit found no provider requests, environment reads, browser persistence or microphone calls in application code.
- `.env` is ignored and untracked. The original filled credentials were not copied to this worktree. Only blank provider placeholders are in the tracked template.
- Dependency installation reported zero audit vulnerabilities. Git whitespace validation passed.

## Browser checks

- Visually inspected the full desktop homepage and both industry pages at 1440px width.
- Inspected mobile layouts at 390px width, including the homepage and healthcare full pages, real estate hero and shared walkthrough. All three routes fit without horizontal overflow. These are browser viewport checks, not physical-device testing.
- Mobile menu opened, navigated to the real estate page and closed correctly.
- Completed the real estate scripted journey after changing the fictional location; the selected preference appeared in the simulated result.
- Completed the Hindi healthcare script, review, unavailable-service recovery, simulated booking and cancellation. Language stayed locked after starting.
- Confirmed keyboard focus moved to the stable walkthrough heading after a stage transition.
- Healthcare browser console inspection returned no warning or error entries.

## Review corrections

- Removed the clinic-information scenario from the appointment-only interactive journey and added a regression test.
- Restored keyboard focus on stage/booking-state changes.
- Removed redundant nested page containers and duplicate title suffixes.
- Fixed mobile homepage image/copy overlap and visually checked the result.
- Gave sample time radio controls explicit, readable accessible labels.

## Deliberate limitations

The dialogue is scripted. There is no audio capture or live AI response. CRM records and appointments are fictional and held only in page memory. Dates are fixed sample fixtures. Hindi changes dialogue, not the whole interface. Sarvam, n8n and GoHighLevel remain disconnected. No public deployment, live calendar, message delivery, clinical guidance, real patient record or production security acceptance is claimed.

JSON export and the local brief worksheet are implemented; the final browser acceptance pass focused on the core walkthroughs rather than claiming every control was exercised. The state-model tests cover rescheduling and cancellation.
