export type Industry = "real-estate" | "healthcare";
export type Language = "en" | "hi";
export type Phase =
  "idle" | "conversation" | "review" | "complete" | "ended" | "error";
export type DemoState = {
  industry: Industry;
  language: Language;
  phase: Phase;
  step: number;
  fields: Record<string, string>;
  slot: string | null;
  booking: "none" | "simulated" | "cancelled";
};
export type Action =
  | {
      type:
        | "start"
        | "next"
        | "book"
        | "fail"
        | "retry"
        | "reschedule"
        | "cancel"
        | "reset"
        | "end";
    }
  | { type: "field"; key: string; value: string }
  | { type: "slot"; value: string }
  | { type: "language"; value: Language };
export const slots = [
  {
    id: "sat-11",
    label: "Sat, 24 Oct 2026",
    time: "11:00 AM",
    iso: "2026-10-24T11:00:00+05:30",
  },
  {
    id: "mon-1030",
    label: "Mon, 26 Oct 2026",
    time: "10:30 AM",
    iso: "2026-10-26T10:30:00+05:30",
  },
  {
    id: "mon-1530",
    label: "Mon, 26 Oct 2026",
    time: "3:30 PM",
    iso: "2026-10-26T15:30:00+05:30",
  },
];
export const fieldOptions: Record<
  Industry,
  Record<string, { label: string; options: string[] }>
> = {
  "real-estate": {
    intent: { label: "Intent", options: ["Buy", "Rent", "Sell", "Lease out"] },
    location: {
      label: "Location preference",
      options: [
        "Whitefield, Bengaluru",
        "Indiranagar, Bengaluru",
        "Sarjapur Road, Bengaluru",
      ],
    },
    property: {
      label: "Property",
      options: ["2 BHK apartment", "3 BHK apartment", "Independent house"],
    },
    budget: {
      label: "Budget / asking price",
      options: [
        "Up to ₹1 crore",
        "₹1–1.5 crore",
        "Up to ₹40,000 / month",
        "To discuss with consultant",
      ],
    },
    timeline: {
      label: "Timeline",
      options: ["Within 3 months", "Within 6 months", "Just exploring"],
    },
  },
  healthcare: {
    service: {
      label: "Request",
      options: ["General consultation", "Routine follow-up"],
    },
    visit: {
      label: "Visit type",
      options: ["In-person", "Video consultation"],
    },
    clinician: {
      label: "Preferred clinician",
      options: ["No preference", "Available general physician"],
    },
    branch: {
      label: "Branch",
      options: ["Sample clinic · Whitefield", "Sample clinic · Indiranagar"],
    },
  },
};
export function initialState(industry: Industry): DemoState {
  return {
    industry,
    language: "en",
    phase: "idle",
    step: 0,
    fields: Object.fromEntries(
      Object.entries(fieldOptions[industry]).map(([key, v]) => [
        key,
        v.options[0],
      ]),
    ),
    slot: null,
    booking: "none",
  };
}
export function transition(s: DemoState, a: Action): DemoState {
  switch (a.type) {
    case "reset":
      return initialState(s.industry);
    case "language":
      return s.phase === "idle" ? { ...s, language: a.value } : s;
    case "field": {
      const field = fieldOptions[s.industry][a.key];
      return (s.phase === "idle" || s.phase === "review") &&
        field?.options.includes(a.value)
        ? { ...s, fields: { ...s.fields, [a.key]: a.value } }
        : s;
    }
    case "start":
      return s.phase === "idle" ? { ...s, phase: "conversation", step: 0 } : s;
    case "next":
      return s.phase === "conversation"
        ? {
            ...s,
            step: Math.min(3, s.step + 1),
            phase: s.step >= 3 ? "review" : "conversation",
          }
        : s;
    case "end":
      return s.phase === "conversation" ? { ...s, phase: "ended" } : s;
    case "slot":
      return s.phase === "review" && slots.some((slot) => slot.id === a.value)
        ? { ...s, slot: a.value }
        : s;
    case "book":
      return s.phase === "review" && s.slot
        ? { ...s, phase: "complete", booking: "simulated" }
        : s;
    case "fail":
      return s.phase === "review"
        ? { ...s, phase: "error", booking: "none" }
        : s;
    case "retry":
      return s.phase === "error" ? { ...s, phase: "review" } : s;
    case "reschedule":
      return s.phase === "complete" && s.booking === "simulated"
        ? { ...s, phase: "review", slot: null, booking: "none" }
        : s;
    case "cancel":
      return s.phase === "complete" && s.booking === "simulated"
        ? { ...s, booking: "cancelled" }
        : s;
    default:
      return s;
  }
}
export function resultRows(s: DemoState): [string, string][] {
  const rows = Object.entries(fieldOptions[s.industry]).map(
    ([key, v]) => [v.label, s.fields[key]] as [string, string],
  );
  return [...rows, ["Language", s.language === "en" ? "English" : "Hindi"]];
}
export function script(s: DemoState): { agent: string; visitor: string }[] {
  const f = s.fields;
  const hi = s.language === "hi";
  if (s.industry === "real-estate")
    return hi
      ? [
          {
            agent:
              "नमस्ते! यह एक स्थानीय डेमो है। आप किस तरह की प्रॉपर्टी के बारे में जानना चाहते हैं?",
            visitor: `मेरा उद्देश्य: ${f.intent}।`,
          },
          {
            agent: "कौन-सा इलाका और प्रॉपर्टी का प्रकार पसंद करेंगे?",
            visitor: `${f.location} में ${f.property}।`,
          },
          {
            agent: "आपका बजट या अपेक्षित मूल्य और समय सीमा क्या है?",
            visitor: `${f.budget}। समय सीमा: ${f.timeline}।`,
          },
          {
            agent:
              "मैंने आपकी प्राथमिकताएँ दर्ज कर ली हैं। अब विवरण जाँचें और एक नमूना समय चुनें। कोई वास्तविक बुकिंग नहीं होगी।",
            visitor: "ठीक है, पहले विवरण जाँच लेते हैं।",
          },
        ]
      : [
          {
            agent:
              "Hello! This is a local demo. What would you like help with today?",
            visitor: `I’m interested in ${f.intent === "Lease out" ? "leasing out a property" : f.intent.toLowerCase() === "buy" ? "buying a property" : f.intent === "Rent" ? "renting a property" : "selling a property"}.`,
          },
          {
            agent: "Which area and type of property do you have in mind?",
            visitor: `${f.property} in ${f.location}.`,
          },
          {
            agent:
              "What budget or asking price and timeline should the consultant know?",
            visitor: `${f.budget}. ${f.timeline}.`,
          },
          {
            agent:
              "Let’s check those details and choose a sample time with a consultant. Nothing will be booked for real.",
            visitor: "Yes, let’s review the details.",
          },
        ];
  return hi
    ? [
        {
          agent:
            "नमस्ते! यह एक काल्पनिक क्लिनिक का डेमो है। कृपया निजी या चिकित्सा जानकारी न दें।",
          visitor: "मुझे अपॉइंटमेंट के बारे में जानकारी चाहिए।",
        },
        {
          agent:
            "किस सेवा और किस प्रकार की मुलाकात के लिए अनुरोध करना चाहते हैं?",
          visitor: `${f.service}। ${f.visit}।`,
        },
        {
          agent: "किस शाखा या डॉक्टर को पसंद करेंगे?",
          visitor: `${f.branch}। ${f.clinician}।`,
        },
        {
          agent:
            "अब अपना अनुरोध जाँचें और नमूना समय चुनें। यह चिकित्सा सलाह या वास्तविक अपॉइंटमेंट नहीं है।",
          visitor: "ठीक है, अनुरोध जाँच लेते हैं।",
        },
      ]
    : [
        {
          agent:
            "Welcome to our fictional clinic demo. Please use sample details and don’t share medical information.",
          visitor: "I’d like help with an appointment enquiry.",
        },
        {
          agent: "Which service and visit type would you prefer?",
          visitor: `${f.service}, ${f.visit.toLowerCase()}.`,
        },
        {
          agent: "Do you have a preferred branch or clinician?",
          visitor: `${f.branch}. ${f.clinician}.`,
        },
        {
          agent:
            "Please review the request and choose a sample slot. This is reception support, not medical advice or a real appointment.",
          visitor: "Yes, let’s review my request.",
        },
      ];
}
