# Saavantus — website design and copy, revision 1

October 21, 2026. **Design review only.** Four static visual studies and exact draft copy for three pages. No application, agent, CRM connection or booking has been built. The prior plan's direction is approved; these designs are now presented for review.

## View the designs

- [Homepage](design/01-homepage.png)
- [Real estate demo page](design/02-real-estate.png)
- [Healthcare demo page](design/03-healthcare.png)
- [Mobile layout study](design/04-mobile-study.png)

The mockups establish hierarchy, composition and visual identity. The text below is the authoritative copy; raster images abbreviate some sections. Generated architectural imagery is illustrative, not an actual property listing or clinic. [Generation prompts](design/GENERATION_PROMPTS.md) record the built-in image-generation method.

## Design direction

Warm ivory, dark ink and restrained vermilion retain Saavantus's recognisable warmth. Large editorial headings bring confidence; clear voice controls and structured result panels explain the product. Use the waveform as a supporting visual, with the conversation and outcome as the main feature. No invented metrics, customer logos, testimonials or compliance badges.

| Element | Proposed specification |
|---|---|
| Canvas | Warm ivory `#F7F4EE` |
| Main text and result cards | Ink `#17242A` |
| Decorative accent | Vermilion `#DA4C38` |
| Filled action buttons | Deeper red `#B93626`, white text; verify contrast in implementation |
| Type | Clean sans-serif, restrained serif italics for short headline phrases; choose licensed/self-hosted font files during build |
| Layout | Maximum content width approximately 1200px; generous margins; 2-column desktop demo, single-column mobile |
| Body / controls | At least 16px body; at least 44px touch targets; visible focus and persistent text state labels |
| Motion | Subtle waveform only during audio activity; static alternative for reduced motion |
| Images | Original architectural illustrations; no implication that these represent available inventory or a real clinic |

**Corrections to carry into the build:** use neutral, not green, styling for “Requested · Not booked”; use the deeper red for readable button text; keep the small sample disclosures at readable size. The sample result is independent of the language toggle until a conversation starts, so its Hindi language field does not describe the selected English demo. Replace the static sample with the actual session's result only when available. Do not animate invented transcript text as if it came from a live call.

The mobile board shows the opening sections, not the entire scroll. In the build, stack all remaining sections and footer, retain the full copy below, and keep call controls reachable. This is visual review, not a tested responsive implementation or accessibility certification.

## Shared navigation and footer

Desktop: **saavantus.** → Home; **Real estate** → `/real-estate-ai`; **Healthcare** → `/healthcare-ai`; **How it works** → `/#how-it-works`; **Discuss your workflow** → `/contact`.

Mobile: wordmark and **Menu**; opening Menu reveals the same destinations. No microphone or session starts from opening navigation.

Footer: **Voice agents. Clear next steps.** Links: **Privacy · Terms · Contact**. Privacy and Terms must have real destination pages before public launch.

The English website introduces voice support in English and Hindi. This does not promise a fully translated website. Voice disclosures and critical confirmations need reviewed Hindi equivalents before release.

## 1. Homepage — `/`

### Hero

**Eyebrow:** VOICE AGENTS FOR INDIAN BUSINESSES

**Headline:** A better conversation. A clear next step.

**Body:** Voice agents for property enquiries and clinic reception. Try a conversation in English or Hindi. See the details your team receives.

**Primary CTA:** Try a live demo → scroll to the two demo cards; this label is for the future functioning release. In this design review, it is illustrative only. If the website launches before voice is connected, use **Explore the demos** instead.

**Secondary CTA:** Explore the agents → same cards, with their descriptions visible.

**Supporting line:** English + Hindi · Built around your workflow

**Visual sample:** “I’m looking for a 2 BHK in Whitefield.” / BUY · WHITEFIELD · 2 BHK

**Visual label:** EXAMPLE CONVERSATION

### Choose an agent

**Section heading:** Two roles. Ready to meet your customers.

**01 / REAL ESTATE**

**Meet your next qualified enquiry.**

Capture intent, preferences, budget and timing before your consultant takes over.

**CTA:** Try the property agent → `/real-estate-ai#demo`

Sample result: Intent — Buy; Location — Whitefield, Bengaluru; Next step — Viewing request. Label: **SAMPLE RESULT**.

**02 / HEALTHCARE**

**Make the first conversation easier.**

Answer clinic questions, collect appointment preferences and route requests to reception.

**CTA:** Try the receptionist → `/healthcare-ai#demo`

Sample result: Request — Consultation; Language — Hindi; Next step — Appointment request. Label: **SAMPLE RESULT**.

### How it works — `#how-it-works`

**Heading:** From spoken details to an organised follow-up.

**01 / Have a conversation**

Your customers speak naturally in English or Hindi about what they need.

**02 / Capture the essentials**

The agent asks relevant questions and checks the important details with the caller.

**03 / Give your team a next step**

Your team receives an organised enquiry or appointment request with the information needed to continue.

### CRM and calendar band

**Heading:** Your voice agent. Your CRM. Your calendar.

**Body:** Planned for GoHighLevel: organised contact details, enquiry context and appointment records.

**Disclosure:** Integration preview — not connected in this demo.

**CTA:** Discuss your workflow → `/contact`

Once the live integration has been separately authorised and verified, replace the future-tense copy with a precise statement of the capabilities actually connected. Do not remove the sample-data disclosure from a simulated demo.

**SEO title:** Saavantus | Voice Agents for Real Estate & Healthcare

**SEO description:** Explore English and Hindi voice-agent demos for property enquiries and clinic reception. See sample qualification summaries and appointment requests.

## 2. Real estate demo — `/real-estate-ai`

### Hero

**Eyebrow:** REAL ESTATE LEAD QUALIFICATION

**Headline:** Know what they want. Know what comes next.

**Body:** Capture location, budget, property preferences and buying timeline. Give your team an enquiry they can act on.

**Supporting line:** Speak in English or Hindi.

### Demo — `#demo`

**Panel heading:** Try the property agent

**Label:** FICTIONAL DEMO

**Language selector:** English / हिन्दी

**Idle state:** Ready when you are.

**Starter:** Try: “I want a 2 BHK in Whitefield under ₹1 crore.”

**Primary CTA:** Start conversation

**Disclosure:** Use made-up details. This demo does not book real viewings or save contacts to GoHighLevel.

**Privacy link:** How this demo uses your data

That link must explain the real Sarvam/backend processing and retention selected before launch. “No CRM record saved” must never imply that a voice provider receives no audio or retains nothing.

**Result panel heading:** What your team receives

**Result label:** SAMPLE CRM RECORD

| Field | Fictional example |
|---|---|
| Intent | Buy |
| Location preference | Whitefield, Bengaluru |
| Property | 2 BHK apartment |
| Budget | Up to ₹1 crore |
| Timeline | Within 3 months |
| Next step | Request a viewing |
| Preferred visit | Saturday, 24 October 2026 · 11:00 AM IST |
| Status | Requested · Not booked |

**Result footer:** GoHighLevel preview · No record saved

The static sample date is a design fixture, not offered availability. The future demo must use approved synthetic slots and distinguish the visitor's requested time from an offered or booked slot.

### Capabilities

**Heading:** One conversation. The details that matter.

**Understand the intent**

Find out whether the caller wants to buy, rent, sell or lease out a property. Ask questions that fit that enquiry.

**Capture the preferences**

Collect the preferred area, property type, budget and timeline. Read back key details so the caller can correct them.

**Agree the next step**

Record a viewing request, callback preference or need for a consultant. Keep unanswered questions visible.

### GoHighLevel outcome

**Heading:** A record your sales team can use.

**Flow labels:** Conversation → Contact → Opportunity → Appointment

**Body:** Planned GoHighLevel connection: keep preferences, enquiry context and confirmed appointments together.

**Supporting line:** Availability and bookings require a connected calendar.

The appointment step is conditional: not every qualified enquiry becomes a booking. An opportunity stores the enquiry; a native appointment stores an accepted calendar booking. A preferred area must not overwrite a person's home address.

### FAQ

**Can it handle buyers, tenants and sellers?**

The planned flow supports buying, renting, selling and leasing enquiries, with different questions for each. Buyer qualification scores will not be applied to sellers.

**Can it book property viewings?**

This demo shows a sample viewing request. In a connected deployment, the agent can check the selected GoHighLevel calendar, ask the caller to confirm a slot and report the returned booking status.

**What goes into the CRM?**

In the planned live flow, confirmed contact details, intent, location preferences, budget, timeline and the agreed next step. Appointment details belong to the linked calendar record. This public demo does not save a CRM contact.

**What happens when it cannot answer?**

The agent should say what is missing and offer the configured staff follow-up. It must not invent property availability, prices or a successful transfer.

### Closing CTA

**Headline:** Let’s shape it around your properties.

**CTA:** Discuss your workflow → `/contact`

**SEO title:** Real Estate Voice Agent Demo | Saavantus

**SEO description:** Try a property enquiry in English or Hindi. See how location, budget, timeline and viewing preferences become a structured sample lead.

## 3. Healthcare demo — `/healthcare-ai`

### Hero

**Eyebrow:** HEALTHCARE FRONT DESK RECEPTIONIST

**Headline:** A calmer first call. A clearer next step.

**Body:** Help callers with clinic information and appointment requests. Give your reception team the details to continue.

**Supporting line:** Speak in English or Hindi.

### Demo — `#demo`

**Panel heading:** Try the receptionist

**Label:** FICTIONAL CLINIC DEMO

**Language selector:** English / हिन्दी

**Idle state:** Ready when you are.

**Starter:** Try: “I’d like a consultation on Monday morning.”

**Primary CTA:** Start conversation

**Disclosure:** Use made-up details. No real appointment is booked and no contact is saved to GoHighLevel. This demo does not provide medical advice.

**Additional instruction:** Please do not share symptoms, medical records, prescriptions or insurance details.

**Privacy link:** How this demo uses your data

**Result panel heading:** What reception receives

**Result label:** SAMPLE APPOINTMENT REQUEST

| Field | Fictional example |
|---|---|
| Request | General consultation |
| Visit type | In-person |
| Preferred clinician | No preference |
| Preferred time | Monday, 26 October 2026 · 10:30 AM IST |
| Language | Hindi |
| Next step | Reception follow-up |
| Status | Requested · Not booked |

**Result footer:** GoHighLevel preview · No record saved

### Capabilities

**Heading:** Helpful at the front desk.

**Answer clinic questions**

Share approved hours, services, location and visit information.

**Collect appointment preferences**

Understand the requested service, clinician and time. Check the details before passing them on.

**Make the handoff clear**

Offer reception follow-up when staff help is needed. Tell the caller whether a request is pending or confirmed.

### Scope and handoff

**Heading:** Reception support. Clinical decisions stay with clinicians.

**Body:** The agent does not diagnose, prescribe or interpret reports. Urgent concerns leave the routine booking flow.

**Link:** How handoff works → expand an explanation on this page.

**Expanded text:** In this demo, a handoff is an example of how a request would reach staff; it does not call a clinic or emergency service. In a live deployment, the clinic must define the destination, operating hours and fallback. Clinical escalation wording requires review by a qualified clinician before the healthcare voice demo launches.

Do not depict an active emergency service transfer, claim triage accuracy, or convert a possible emergency into an ordinary appointment recommendation.

### GoHighLevel outcome

**Heading:** An organised request. A clear appointment status.

**Body:** Planned GoHighLevel connection: contact details and appointment records for your reception team.

**Supporting line:** This public demo uses fictional information. Calendar access and real booking are not connected.

### FAQ

**Can it book a real appointment?**

This preview shows a sample request. Real bookings require a connected clinic calendar and confirmation of the chosen time.

**What if a caller needs a person?**

The planned workflow routes the request to your reception team. The demo explains the handoff; it does not transfer a real call.

**Will it answer medical questions?**

Its role is administrative reception. Medical questions, diagnoses and treatment decisions stay with qualified healthcare staff.

**Will patient records go into the CRM?**

This demo uses fictional information. A live setup needs the clinic's approval for the minimum administrative data stored, who can access it and how long it is kept. Full clinical records are outside this CRM proposal.

### Closing CTA

**Headline:** Build a better first point of contact.

**CTA:** Discuss your workflow → `/contact`

**SEO title:** Healthcare Receptionist Voice Demo | Saavantus

**SEO description:** Try a fictional clinic reception conversation in English or Hindi. Explore appointment requests, clinic information and clear staff handoffs.

## Shared demo states and exact interface copy

These are design specifications for the later functioning demo, not features implemented now. Keep a persistent **Fictional demo** label. Render the sample panel before a call; label the actual result **Your demo summary** afterwards. Never silently turn role-play data into a real sales lead.

| State | Interface copy / action |
|---|---|
| Before start | Ready when you are. / Start conversation |
| Microphone request | Allow microphone access to talk to the agent. |
| Permission denied | Microphone access is blocked. Enable it in your browser settings, then try again. / Try again; View sample result |
| No microphone | No microphone was found. Connect one, then try again. / View sample result |
| Connecting | Connecting your demo… / Cancel |
| Listening | Listening — you can speak now. / Mute microphone; End conversation |
| Processing | One moment… / End conversation |
| Speaking | The agent is speaking. / Mute microphone; End conversation |
| Muted | Your microphone is muted. / Unmute microphone; End conversation |
| Service unavailable | The demo is unavailable right now. You can still explore the sample result. / Try again; View sample result |
| Disconnected | The connection ended. Start a new conversation to try again. |
| Ending | Ending the conversation… |
| Finished | Conversation ended. / View your demo summary; Try again |
| Incomplete result | We couldn’t complete the summary. No CRM contact or appointment was created. |
| Demo limit | This demo has reached its time limit. Review your summary or start again when another session is available. |
| Business interest, separate opt-in | Want this for your business? / Discuss your workflow |

Future connected booking states: **Checking availability… → Please confirm [date, time, timezone] → Checking booking result… → Confirmed [reference]**, or **Requested / Staff follow-up needed**. Only use “Confirmed” when the actual appointment record supports it. CRM save and appointment status are separate outcomes.

Do not promise barge-in, a recording-free session, unlimited retries, instant staff transfer or message delivery until that specific behaviour is configured and tested. On mobile, keep mute/end controls visible during an active session without covering content. Language switching during a call should require ending and restarting unless the SDK behaviour is verified.

## Review outcome and next boundary

Completed: desktop design concepts for all three pages, opening mobile layouts, exact copy, sample states, and proposed CRM/calendar flow. Visually inspected all four generated images for page structure, labels and scope; the requested/not-booked badges need the neutral treatment specified above. No browser implementation, phone runtime, microphone, accessibility or live integration tests have occurred.

Next decision: review the visual direction and wording. Building and connecting remain separate later steps. The [GoHighLevel plan](GOHIGHLEVEL_PLAN.md) specifies the future data and booking workflow.
