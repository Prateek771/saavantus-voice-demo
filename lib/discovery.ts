export const dimensions = [
  {
    name: "Strategy",
    questions: [
      "Our AI objectives align with business priorities.",
      "Leadership sponsors AI initiatives.",
      "We have a documented AI strategy.",
      "We prioritize use cases by business value.",
      "AI initiatives have assigned owners.",
    ],
  },
  {
    name: "Data",
    questions: [
      "Our data is accurate and reliable.",
      "Data is accessible to authorized teams.",
      "We document data ownership.",
      "We have data quality controls.",
      "Our datasets represent the users we serve.",
    ],
  },
  {
    name: "Technology",
    questions: [
      "Our systems support secure integrations.",
      "Infrastructure can support AI workloads.",
      "We monitor system performance.",
      "We have development and testing environments.",
      "We can manage access to AI tools.",
    ],
  },
  {
    name: "Automation",
    questions: [
      "We have mapped repetitive processes.",
      "We actively use workflow automation.",
      "Automations connect across teams.",
      "We monitor automation failures.",
      "We measure automated process performance.",
    ],
  },
  {
    name: "AI adoption",
    questions: [
      "Staff regularly use approved AI tools.",
      "AI is embedded in daily workflows.",
      "Teams share successful AI use cases.",
      "AI outputs are reviewed before use.",
      "We track usage of deployed AI tools.",
    ],
  },
  {
    name: "People",
    questions: [
      "Staff receive AI training.",
      "We have internal AI expertise.",
      "Teams understand AI limitations.",
      "Employees have time to experiment safely.",
      "We support change management.",
    ],
  },
  {
    name: "Governance",
    questions: [
      "We have an AI usage policy.",
      "We assess privacy and security risks.",
      "We review bias and fairness.",
      "We maintain human oversight.",
      "We document accountability for AI outcomes.",
    ],
  },
  {
    name: "ROI",
    questions: [
      "We define baseline costs before deployment.",
      "We track time saved by AI.",
      "We measure the quality of AI outcomes.",
      "We track total operating costs.",
      "We review whether AI delivers business value.",
    ],
  },
];
export const practices: Record<string, string> = {
  Strategy: "Use-case prioritization matrix and an initiative backlog",
  Data: "Data cleanup and a data catalog",
  Technology: "API inventory and infrastructure monitoring",
  Automation: "Evaluate n8n or Power Automate for approved workflows",
  "AI adoption": "Approved AI assistant pilots with usage review",
  People: "Role-specific AI training and a champion network",
  Governance: "NIST AI RMF review and an AI risk register",
  ROI: "Benefits register and cost-versus-value dashboard",
};
export type Answers = Record<string, number | "unknown">;
export function level(score: number | null) {
  return score === null
    ? "Insufficient data"
    : score < 40
      ? "Foundational"
      : score < 70
        ? "Developing"
        : "Established";
}
export function assess(answers: Answers) {
  const scored = dimensions.map((d) => {
    const values = d.questions
      .map((_, i) => answers[`${d.name}-${i}`])
      .filter(
        (v): v is number =>
          typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5,
      );
    return {
      ...d,
      known: values.length,
      score: values.length
        ? values.reduce((s, v) => s + (v - 1) * 25, 0) / values.length
        : null,
    };
  });
  const group = (names: string[]) => {
    const rows = scored.filter((d) => names.includes(d.name));
    const available = rows.filter((d) => d.score !== null);
    const partial = available.length
      ? available.reduce((s, d) => s + d.score!, 0) / available.length
      : null;
    return {
      score: available.length === rows.length ? partial : null,
      partial,
      dimensions: available.length,
      total: rows.length,
      known: rows.reduce((s, d) => s + d.known, 0),
      questions: rows.length * 5,
    };
  };
  return {
    dimensions: scored,
    known: scored.reduce((s, d) => s + d.known, 0),
    readiness: group([
      "Strategy",
      "Data",
      "Technology",
      "People",
      "Governance",
      "ROI",
    ]),
    adoption: group(["Automation", "AI adoption"]),
    ranked: scored
      .filter((d) => d.score !== null)
      .sort((a, b) => a.score! - b.score!),
  };
}
