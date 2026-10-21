# Redesign content evidence — October 21, 2026

## Verified public contact details

Source: [Saavantus homepage](https://saavantus.com/), inspected in the live browser on October 21, 2026. These values appeared in both the top contact strip and footer, with matching link destinations.

| Published value       | Link destination             |
| --------------------- | ---------------------------- |
| support@saavantus.com | mailto:support@saavantus.com |
| 08031686962           | tel:08031686962              |
| 9845718730            | tel:9845718730               |

`lib/site-contact.ts` centralizes these public values. The phone strings and destinations are retained exactly as published; a country code has not been inferred. This verifies what the site publishes, not whether a mailbox or telephone is currently monitored. No email, call or form submission was sent to the existing website.

The official site renders client-side. Initial web text extraction was empty, and the Agent Reach Jina route failed DNS in the shell; the rendered official homepage supplied the evidence. No third-party directory was used.

## Existing framework and new delivery copy

The same homepage explicitly names the **SaaS 4A Framework** in this order: **Assess → Architect → Adjust → Automate**. Preserve these names and sequence. Describe concrete delivery work rather than claiming unverified results:

- **Assess:** Map enquiries, recurring questions and staff handoffs. Define what the business needs to capture and what a useful next step means.
- **Architect:** Design the conversation, approved knowledge, business rules and data destinations around the real workflow.
- **Adjust:** Test languages, corrections, incomplete details, exceptions and human handoff. Review the outcome before live operation.
- **Automate:** Connect approved systems, launch the agreed workflow and monitor outcomes for ongoing improvements.

The detailed conversation sequence remains grounded in the supplied diagrams and `GOHIGHLEVEL_PLAN.md`: capture, validate, ask relevant questions, confirm preferences, qualify or route, request an appointment, summarize and support follow-up. For healthcare, the implemented demo remains administrative; it does not diagnose, prescribe, provide clinical triage or access patient records.

## Proof and claim boundaries

The existing homepage publishes metrics and named testimonials. Their presence is only evidence that they were published; no supporting client evidence or approval was supplied. Do not copy those claims into the new site, and do not invent replacement quotations, logos, case studies, star ratings or numbers. Demonstrations, concrete example records and the delivery framework are the available proof.

Sarvam voice is connected in the local demo. n8n, GoHighLevel and real calendars are not connected. A callback time is a preference, not a confirmed appointment. The new local contact form must state its actual storage/delivery behavior; the footer CTA points to that form rather than promise a message was sent.

## Implemented navigation and footer

The navigation CTA now says **Contact us**. The footer contains a concise description of the two supported roles, direct verified email/phone links, both live demo entry links, the approach anchor, contact form and actual privacy/terms routes. A second large contact invitation was removed after visual review to avoid duplicating the homepage contact band or inviting visitors to a form they are already using. The footer deliberately omits the existing site's placeholder social links and newsletter, neither of which has a working destination or delivery setup in this app.
