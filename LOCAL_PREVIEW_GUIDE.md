# Your running Saavantus preview

Open [the homepage](http://127.0.0.1:3100), [real estate voice demo](http://127.0.0.1:3100/real-estate-ai#voice-demo), or [healthcare voice demo](http://127.0.0.1:3100/healthcare-ai#voice-demo).

Both Sarvam managed agents are committed at version 1. Your separate Voice Agents key passed session signing (HTTP 200) for both. Bounded streaming checks using synthetic silence received the connection acknowledgement and non-silent audio from both agents. Real microphone, conversation quality and interruptions still need your testing.

## Try voice

1. Open either demo in Brave on this computer.
2. Select English or Hindi under Talk to the agent.
3. Read and check the fictional-data consent checkbox.
4. Click Start voice demo and allow microphone access.
5. Speak using fictional information. Click End conversation when finished; each demo is limited to three minutes.

The separate scripted walkthrough still shows sample CRM records and appointments. It does not reflect your live voice conversation. n8n and GoHighLevel remain disconnected; no real appointment, CRM save or human transfer occurs.

Your original credential file remains here, ignored by Git. The app worktree has a separate ignored server environment containing the managed Voice Agents key. No key is included in browser JavaScript. Sarvam processes voice audio and may retain recordings/transcripts under its workspace settings.

## App and source

Private repository: https://github.com/Prateek771/saavantus-voice-demo

Implementation branch: feat/local-demo. No main-branch merge or Hostinger deployment.

App worktree: C:\Users\prate\.codex\worktrees\saavantus-local-preview\N8N (Saavantus )

To restart, open PowerShell in that worktree and run npm run dev. For a production preview run npm run build, then npm start. Stop the existing Saavantus server before reusing port 3100.

Eighteen tests, TypeScript and production build passed. Integration evidence and remaining limitations are in the repository's docs/SARVAM_INTEGRATION.md.

## Website redesign update

The redesigned homepage and local contact form are running at the same preview address. Homepage: http://127.0.0.1:3100/ — Contact: http://127.0.0.1:3100/contact

Full-width animated voice illustration, Lenis scrolling, a Pause motion control, revised SaaS 4A copy and verified public contact links are implemented. No testimonials or metrics were fabricated. Contact requests save only in the app worktree's ignored .data/contact-requests directory. No email, GoHighLevel delivery or appointment booking occurs yet.

Saved and pushed commit db80699 on feat/local-demo. Worktree clean. Twenty-three tests, TypeScript, production build and desktop/mobile browser checks passed. A synthetic form submission was verified on disk and the test-owned record removed. Sarvam readiness remains true for both agents. See WEBSITE_REDESIGN_PLAN.md and WEBSITE_REDESIGN_VERIFICATION.md for scope and evidence.
