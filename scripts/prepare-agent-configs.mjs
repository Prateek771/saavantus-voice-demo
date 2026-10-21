// Produces reviewable authoring payloads only; never calls a provider.
import { readFileSync, writeFileSync } from "node:fs";
const fields = {
  "real-estate": {
    intent: "buy, rent, sell or lease out",
    location_preference: "city and broad preferred localities",
    property_preference: "property type and bedrooms or size",
    budget: "confirmed INR budget or asking price, including rental period",
    timeline: "stated timing for the property decision",
    appointment_preference:
      "requested date and time in IST; never a confirmed booking",
  },
  healthcare: {
    request_type: "routine consultation or follow-up request",
    location_preference: "broad location or branch preference",
    visit_format: "in-person or video preference",
    clinician_preference:
      "visitor-stated clinician or department; do not infer from symptoms",
    appointment_preference:
      "requested date and time in IST; never a confirmed booking",
  },
};
for (const [industry, definitions] of Object.entries(fields)) {
  const source = readFileSync(`agents/${industry}.md`, "utf8");
  const prompt = source.match(/```text\r?\n([\s\S]*?)\r?\n```/)[1];
  const greeting = source.match(/English:\r?\n> (.+)/)[1];
  const agent_variables = Object.fromEntries(
    Object.entries({
      ...definitions,
      call_summary:
        "a concise administrative summary, excluding sensitive details",
      demo_outcome:
        "confirmed_summary if visitor confirmed the recap; otherwise declined, incomplete, human_requested or urgent_redirect",
    }).map(([name, description]) => [
      name,
      {
        name,
        value: "",
        description,
        type: "string",
        is_agent_updatable: false,
        needs_initial_value: false,
        update_post_interaction: true,
        post_interaction_prompt: `Extract only the visitor-confirmed ${description}. Use an empty string when missing. Do not invent information. This is a fictional demo; exclude medical, identity, contact and payment details.`,
      },
    ]),
  );
  const config = {
    channel_type: "v2v",
    llm_config: {
      agent_config: {
        agent_variables: { ...agent_variables, user_name: null },
        is_single_prompt_mode: true,
        enable_lid: true,
        supported_languages: ["English", "Hindi"],
        enable_voicemail_detection: false,
        agent_can_end_interaction: true,
      },
    },
    language_config: {
      initial_language_name: "English",
      supported_languages: ["English", "Hindi"],
      lid_supported_languages: ["English", "Hindi"],
    },
    text_to_speech_config: {
      config_version: "2.0",
      internal_id: "01a0cf16-e8b3-7f97-909b-27be790e7330",
      speech_settings: { pace: 1.0 },
    },
    intro_message_config: { audio: greeting },
    interaction_config: {
      max_interaction_time_seconds: 180,
      allow_interrupt_during_playback: true,
      send_whatsapp_message_on_end: false,
      call_transfer_config: null,
      nudge_config: {
        enable_inactivity_nudge: true,
        user_nudge_message_configs: [
          {
            nudge_type: "template",
            timeout_seconds: 12,
            template_messages: [
              "Are you still there? We can continue the demo or stop here.",
            ],
          },
        ],
        end_interaction_after_consecutive_nudges: true,
      },
    },
    memory_config: {
      episodic_memory_config: { is_memory_enabled: false, k_recent: 1 },
    },
    evaluation_config: {
      criteria: [
        {
          name: "Confirmed demo summary",
          description:
            "Visitor confirmed an administrative summary; no real booking or CRM write.",
          config: {
            logic: "AND",
            conditions: [
              {
                variable: "demo_outcome",
                operator: "equals",
                value: "confirmed_summary",
              },
            ],
          },
        },
      ],
    },
  };
  const payload = {
    name:
      industry === "real-estate"
        ? "Saavantus - Real Estate Demo"
        : "Saavantus - Healthcare Reception Demo",
    template: "single",
    config,
    prompt:
      prompt +
      "\n\nRecord confirmed administrative preferences in the matching agent variables. Set demo_outcome to confirmed_summary only when the visitor confirms the recap. For declined consent, unfinished conversation, human request or urgent redirect use declined, incomplete, human_requested or urgent_redirect respectively. Never set a success outcome just because you spoke a summary.",
  };
  writeFileSync(
    `agents/${industry}.json`,
    JSON.stringify(payload, null, 2) + "\n",
  );
}
console.log(
  "Prepared two credential-free agent authoring payloads. No remote writes.",
);
