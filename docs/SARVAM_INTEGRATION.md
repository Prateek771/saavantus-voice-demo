# Sarvam voice integration — October 21, 2026

## Current state

The user authorized creating the two managed agents and wiring the local frontend. n8n and GoHighLevel remain disconnected. Hostinger/public deployment is not part of this change.

Created through Sarvam's official OAuth MCP at `https://mcp.sarvam.ai/voice-agents`:

| Role                           | Agent ID                    | Committed version |
| ------------------------------ | --------------------------- | ----------------- |
| Real estate lead qualification | `Saavantus---4de98d61-4ecf` | 1                 |
| Healthcare front desk          | `Saavantus---01b31d21-28b8` | 1                 |

Organization `01a15dca-354b-7ad5-ae4f-e5f4540115ac`, workspace `01a15dca-3558-7ecb-b130-8fb3e81a8ae4`. A commit creates the next editable draft (version 2); the website must pin committed version 1.

Both use English/Hindi, Ishita Expressive Support (Sarvam TTS v4, internal ID `01a0cf16-e8b3-7f97-909b-27be790e7330`), 180-second maximum interaction, interruption enabled, cross-conversation memory disabled and post-call extraction of confirmed administrative preferences. This workspace refused mid-call variable updates, so `is_agent_updatable` is false. No external business-action tools, transfer destinations, CRM, calendar or messaging connections exist. Readback confirmed `call_transfer_config: null` and `call_transfer` disabled; Sarvam's mutation report had misleadingly described the retained null field as not deleted. The template's hard-coded caller name was removed.

## Runtime credentials and verification

The Model API key returned HTTP 401 for Voice Agents signing. The owner supplied a separate `SARVAM_AGENTS_API_KEY`; it returned HTTP 200 for both configured agents. The ignored worktree `.env` now contains that key and the known IDs. The original credential file remains intact. Voice is enabled locally with the exact returned WebSocket origin `wss://apps.sarvam.ai`. No key is in client props, source control or browser JavaScript.

Bounded streaming checks initially sent no caller audio and received only zero-valued PCM frames without an acknowledgement. Repeating with synthetic silence in the SDK audio-chunk format produced `server.action.interaction_connected` and non-silent audio for both agents (real estate English, healthcare Hindi). No physical microphone was accessed. This confirms runtime connectivity, not speech intelligibility, two-way conversation quality or interruption handling.

## Connection

The official `sarvam-conv-ai-sdk/browser` 0.0.42 requests a signed URL through the app's `/api/sarvam/` proxy. The server injects the managed-agent key. Audio connects directly from browser to the returned Sarvam WebSocket. Permanent keys never enter client props or JavaScript.

The proxy accepts only the two configured agents, workspace and pinned versions. It rejects non-loopback/cross-site requests, arbitrary query parameters and unexpected socket origins; replies are no-store and errors omit provider bodies. It permits at most 20 signing requests per process/hour. This is a local-development boundary, not production abuse protection. Public deployment needs authentication, durable rate/concurrency limits and reviewed recording/retention. The remote agent's 180-second cap is authoritative; the frontend timer is additional cleanup.

The original scripted walkthrough remains separate. Live transcript text is not parsed into fake CRM records. Sarvam holds extracted variables; connecting them to the app's structured record view or CRM is a later action.

## SDK maintenance and dependencies

`scripts/patch-sarvam-sdk.mjs` runs after install. It checks version and upstream hashes, removes signed-URL/transcript logging, recognizes transcription messages, handles background socket errors and cleans up audio/timers on close, cancellation and end. Connection readiness requires the open socket, server acknowledgement and initialized audio interface. Six SDK regression checks cover readiness ordering, cancellation and cleanup. It refuses source drift; upgrading requires a fresh review.

The package includes optional Node audio dependencies. npm audit reports two high findings rooted in `speaker <=0.5.5`, with no upstream fix. The app imports only `/browser`; `speaker` is excluded by the SDK's browser mapping and is not used by this app. This finding remains documented rather than hidden. The browser build passed; do not introduce the package's Node audio entry point.

## Observed checks

- Eighteen tests pass, including session gating, local origin checks, pinned upstream identity, URL allowlisting, safe provider errors and rate limiting.
- TypeScript and production build pass. Exact-key scan of 11 generated browser JavaScript chunk files found no credential.
- Patch applied to the installed package. Separate temporary-copy checks covered idempotence, drift rejection and mocked socket cleanup; these do not establish real microphone behavior.
- Real estate text check correctly repeated fictional preferences and stated no booking or CRM save.
- Healthcare text check declined diagnosis/prescription and offered routine appointment administration.
- Both test conversations returned closing acknowledgements. The CLI subsequently emitted a Windows libuv shutdown assertion; no repeat sessions were started to work around it.
- Voice audio quality, barge-in and physical microphone cleanup remain untested. The user can now test these on both local voice-demo panels.

Sources: [Web SDK](https://docs.sarvam.ai/voice-agents/deploy/sdks/web), [Voice Agents API keys](https://docs.sarvam.ai/voice-agents/settings/api-key), [official MCP](https://docs.sarvam.ai/voice-agents/mcp). Workspace schema and readbacks were inspected through the authenticated MCP; keys and OAuth tokens are not in this repository.

Final local checks: desktop (1440px) real-estate and mobile (390px) healthcare voice panels inspected; consent controls enable/disable Start correctly and were reset unchecked. Missing-header and cross-origin proxy requests returned 403. Microphone policy is self-only and CSP allows the exact configured Sarvam socket origin. Physical microphone testing was not performed.
