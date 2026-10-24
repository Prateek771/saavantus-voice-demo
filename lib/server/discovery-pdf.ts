import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, rgb, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// Native Node test execution requires explicit TypeScript extensions.
// @ts-ignore -- stripped by Node in tests; bundled by Next on the server.
import { assess, level, practices, type Answers } from "../discovery.ts";
// @ts-ignore -- native Node test import.
import type { OrganizationProfile } from "../discovery-profile.ts";

/** Server-only PDF: recomputes all findings from the submitted answers. */
export async function generateDiscoveryPdf(
  profile: OrganizationProfile,
  answers: Answers,
): Promise<Uint8Array> {
  const result = assess(answers);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const [fontBytes, logoBytes] = await Promise.all([
    readFile(join(process.cwd(), "assets", "report-font.ttf")),
    readFile(
      join(process.cwd(), "public", "saavantus-excellence-warm-charcoal.png"),
    ),
  ]);
  const font = await pdf.embedFont(fontBytes, { subset: true });
  const logo = await pdf.embedPng(logoBytes);
  const supported = new Set(font.getCharacterSet());
  let substituted = false;
  const safe = (text: string) =>
    Array.from(text.normalize("NFC"))
      .map((char) => {
        const code = char.codePointAt(0)!;
        if (supported.has(code)) return char;
        substituted = true;
        return `[U+${code.toString(16).toUpperCase()}]`;
      })
      .join("");
  const W = 595.28,
    H = 841.89,
    M = 48,
    CW = W - M * 2;
  const ink = rgb(0.09, 0.14, 0.16),
    muted = rgb(0.36, 0.39, 0.4),
    red = rgb(0.72, 0.2, 0.14),
    line = rgb(0.86, 0.83, 0.79),
    paper = rgb(0.985, 0.975, 0.955);
  let page!: PDFPage;
  let y = 0;
  function addPage() {
    page = pdf.addPage([W, H]);
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: paper });
    const maxW = 435,
      maxH = 340;
    const scale = Math.min(maxW / logo.width, maxH / logo.height);
    page.drawImage(logo, {
      x: (W - logo.width * scale) / 2,
      y: (H - logo.height * scale) / 2,
      width: logo.width * scale,
      height: logo.height * scale,
      opacity: 0.07,
    });
    page.drawText("SAAVANTUS EXCELLENCE", {
      x: M,
      y: H - 36,
      font,
      size: 9,
      color: red,
    });
    page.drawLine({
      start: { x: M, y: H - 47 },
      end: { x: W - M, y: H - 47 },
      thickness: 0.6,
      color: line,
    });
    y = H - 76;
  }
  function room(height: number) {
    if (y - height < 55) addPage();
  }
  function lines(text: string, size: number, width = CW) {
    const result: string[] = [];
    let current = "";
    for (const word of safe(text).split(/\s+/)) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) {
        current = candidate;
        continue;
      }
      if (current) result.push(current);
      current = "";
      for (const char of Array.from(word)) {
        if (font.widthOfTextAtSize(current + char, size) > width && current) {
          result.push(current);
          current = "";
        }
        current += char;
      }
    }
    if (current) result.push(current);
    return result;
  }
  function text(value: string, size = 10, color = ink, width = CW, indent = 0) {
    for (const valueLine of lines(value, size, width)) {
      room(size * 1.55);
      page.drawText(valueLine, { x: M + indent, y, font, size, color });
      y -= size * 1.55;
    }
    y -= 5;
  }
  function heading(value: string, size = 19) {
    room(size * 1.7 + 24);
    y -= 12;
    text(value, size, ink);
    y -= 5;
  }
  function rule() {
    room(15);
    page.drawLine({
      start: { x: M, y },
      end: { x: W - M, y },
      thickness: 0.6,
      color: line,
    });
    y -= 17;
  }
  function bar(
    label: string,
    score: number | null,
    coverage: string,
    classify = true,
  ) {
    room(45);
    page.drawText(safe(label), { x: M, y, font, size: 10, color: ink });
    const value =
      score === null
        ? "Insufficient data"
        : `${Math.round(score)}%${classify ? ` · ${level(score)}` : ""}`;
    page.drawText(value, {
      x: W - M - font.widthOfTextAtSize(value, 9),
      y,
      font,
      size: 9,
      color: muted,
    });
    y -= 15;
    page.drawRectangle({ x: M, y: y - 4, width: CW, height: 6, color: line });
    if (score !== null && score > 0)
      page.drawRectangle({
        x: M,
        y: y - 4,
        width: (CW * score) / 100,
        height: 6,
        color: red,
      });
    y -= 18;
    text(coverage, 8, muted);
  }
  function newSection(title: string) {
    addPage();
    heading(title, 23);
  }
  const knownNames = (predicate: (s: number) => boolean) =>
    result.dimensions
      .filter((d) => d.score !== null && predicate(d.score))
      .map((d) => d.name)
      .join(", ");
  const priority = result.ranked.slice(0, 3);
  const governance = result.dimensions.find((d) => d.name === "Governance")!;
  addPage();
  heading("Organizational AI Discovery", 28);
  text(profile.organization, 19);
  text("A transparent self-assessment from Saavantus Excellence.", 11, muted);
  rule();
  heading("Your starting point");
  for (const [label, g] of [
    ["AI readiness", result.readiness],
    ["AI adoption", result.adoption],
  ] as const) {
    bar(
      label,
      g.score,
      `${g.known}/${g.questions} known responses · ${g.dimensions}/${g.total} dimensions represented`,
    );
    if (g.score === null && g.partial !== null)
      text(
        `Partial estimate: ${Math.round(g.partial)}% across available dimensions; not the full fixed-weight score.`,
        9,
        muted,
      );
  }
  heading("Response coverage");
  text(
    `${result.known}/40 known responses · ${40 - result.known} Not sure.`,
    14,
  );
  room(60);
  for (let i = 0; i < 40; i++) {
    page.drawRectangle({
      x: M + (i % 20) * 24.9,
      y: y - Math.floor(i / 20) * 15,
      width: 19,
      height: 8,
      color: i < result.known ? red : line,
    });
  }
  y -= 40;
  text(
    "Each mark represents one response, grouped by known status rather than question order.",
    8,
    muted,
  );
  heading("Workflow context");
  const total = profile.applicableWorkflows,
    production = profile.aiProductionWorkflows;
  if (total !== "" && production !== "" && Number(total) > 0) {
    bar(
      "AI workflows in production",
      (Number(production) / Number(total)) * 100,
      `${Number(production).toLocaleString("en-IN")} of ${Number(total).toLocaleString("en-IN")} applicable workflows. Separate from assessment scores.`,
      false,
    );
  } else
    text(
      total === "0"
        ? "No applicable workflows reported; a percentage cannot be calculated with a zero denominator."
        : "Workflow percentage unavailable. Both optional counts are needed.",
      10,
      muted,
    );
  text(
    "This report is rule-based, not a certification, audit or AI-generated analysis. Low response coverage limits what can be concluded. No business outcomes are guaranteed.",
    9,
    muted,
  );
  newSection("Dimension dashboard");
  for (const d of result.dimensions)
    bar(
      d.name,
      d.score,
      `${d.known}/5 known responses${d.known < 5 ? " · incomplete coverage" : ""}`,
    );
  heading("How scoring works", 16);
  text(
    "Known responses 1–5 become 0, 25, 50, 75 and 100. Each dimension averages its known responses. Not sure is excluded. Readiness weights Strategy, Data, Technology, People, Governance and ROI equally at 1/6 each. Adoption weights Automation and AI adoption at 1/2 each.",
    9,
    muted,
  );
  text(
    "A full group score requires at least one known answer in every constituent dimension. Otherwise only a separately labelled partial average of represented dimensions is shown. Foundational: below 40%; Developing: 40% to below 70%; Established: 70% or above. Classification uses unrounded values; displayed percentages are rounded.",
    9,
    muted,
  );
  newSection("SWOT and improvement priorities");
  const swot = [
    [
      "Strengths",
      knownNames((s) => s >= 70) ||
        "No known dimension meets the 70% strength threshold.",
    ],
    [
      "Weaknesses",
      knownNames((s) => s < 40) ||
        "No known dimension falls below the 40% foundational threshold.",
    ],
    [
      "Opportunities",
      priority.length
        ? `Investigate ${priority
            .slice(0, 2)
            .map((d) => d.name)
            .join(
              " and ",
            )}: these are your lowest known self-ratings, not a proven business case.`
        : "Gather evidence and complete unknown responses before ranking opportunities.",
    ],
    [
      "Threats",
      governance.score === null
        ? "Governance is unknown. Review privacy, fairness and accountability before selecting a pilot."
        : governance.score < 70
          ? "Governance ratings suggest gaps to review in privacy, fairness and accountability before scaling."
          : "Maintain oversight as usage scales; strong self-ratings do not eliminate risk.",
    ],
  ];
  for (const [title, body] of swot) {
    heading(title, 14);
    text(body);
  }
  text(
    "Unknown dimensions are never classified as strengths or weaknesses. These statements are prompts for investigation.",
    9,
    muted,
  );
  heading("Recommended tools and practices", 17);
  text(
    "Based on the three lowest known dimensions; ties follow questionnaire order. Evaluate privacy, security, integrations and cost before choosing tools.",
    9,
    muted,
  );
  if (priority.length)
    for (const d of priority) text(`${d.name}: ${practices[d.name]}.`);
  else
    text(
      "Start with evidence gathering: ask dimension owners to document what is in place.",
    );
  newSection("Your 30/60/90-day roadmap");
  for (const [title, body] of [
    [
      "Days 1–30 · Establish the foundation",
      `Assign an owner ${priority[0] ? `for ${priority[0].name}` : "to gather missing assessment evidence"}, document the current baseline, review data permissions and select one low-risk use case.`,
    ],
    [
      "Days 31–60 · Pilot with oversight",
      `${priority[1] ? `Review ${priority[1].name} with its owner. ` : "Resolve unknown responses with the relevant owners. "}Train a small pilot team, define human review and track quality, cost and time saved weekly.`,
    ],
    [
      "Days 61–90 · Review before expanding",
      `${priority[2] ? `Review progress in ${priority[2].name}. ` : ""}Compare pilot outcomes against the baseline and expand only where measurable benefits and risk controls are demonstrated.`,
    ],
  ]) {
    heading(title, 16);
    text(body, 11);
    y -= 16;
  }
  text(
    "A suggested sequence, not a delivery commitment. Validate priorities with your team.",
    9,
    muted,
  );
  newSection("Organization profile");
  for (const [label, data] of [
    ["Full name", profile.fullName],
    ["Business email", profile.businessEmail],
    ["Organization", profile.organization],
    ["Industry", profile.industry],
    ["Organization size", profile.organizationSize],
    ["Job title", profile.jobTitle],
    ["Country", profile.country],
    ["Phone", profile.phone],
    ["Applicable workflows", total],
    ["AI workflows in production", production],
    ["Data processing consent", profile.dataConsent ? "Yes" : "No"],
    ["Marketing consent", profile.marketingConsent ? "Yes" : "No"],
  ]) {
    room(40);
    text(`${label}:`, 9, muted);
    text(data || "Not provided", 11);
  }
  if (substituted) {
    heading("Character rendering note", 13);
    text(
      "Characters unavailable in the embedded report font are represented by their Unicode code point, for example [U+1F680]. Original profile and response data are unchanged.",
      9,
      muted,
    );
  }
  const pages = pdf.getPages();
  for (let i = 0; i < pages.length; i++) {
    const footer = `Saavantus Excellence · AI Discovery · ${i + 1} / ${pages.length}`;
    pages[i].drawText(footer, { x: M, y: 27, font, size: 8, color: muted });
  }
  pdf.setTitle("Organizational AI Discovery | Saavantus Excellence");
  pdf.setAuthor("Saavantus Excellence");
  pdf.setSubject("Deterministic organizational AI self-assessment");
  pdf.setCreator("Saavantus Excellence");
  pdf.setCreationDate(new Date("2026-01-01T00:00:00Z"));
  pdf.setModificationDate(new Date("2026-01-01T00:00:00Z"));
  return pdf.save();
}
