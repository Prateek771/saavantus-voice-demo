import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, PDFDict, PDFName } from "pdf-lib";
import { generateDiscoveryPdf } from "../lib/server/discovery-pdf.ts";
import { emptyProfile } from "../lib/discovery-profile.ts";
import { dimensions } from "../lib/discovery.ts";
const answers = (value) =>
  Object.fromEntries(
    dimensions.flatMap((d) =>
      d.questions.map((_, i) => [`${d.name}-${i}`, value]),
    ),
  );
const profile = {
  ...emptyProfile,
  fullName: "Synthetic Report Reviewer",
  organization: "Synthetic Organization",
  businessEmail: "synthetic@example.test",
  country: "India",
};
test("complete assessment produces a valid paginated PDF with a watermark on every page", async () => {
  const bytes = await generateDiscoveryPdf(profile, answers(3));
  const pdf = await PDFDocument.load(bytes);
  assert.match(pdf.getTitle(), /AI Discovery/);
  assert.ok(pdf.getPageCount() >= 4);
  for (const page of pdf.getPages()) {
    assert.equal(Math.round(page.getWidth()), 595);
    const resources = page.node.Resources();
    const images = resources.lookup(PDFName.of("XObject"), PDFDict);
    assert.ok(
      images.keys().length > 0,
      "each page references the watermark image",
    );
  }
});
test("unknown assessments, zero workflows and long Unicode organization profiles still paginate", async () => {
  const bytes = await generateDiscoveryPdf(
    {
      ...profile,
      organization: "Synthetic लंबा नाम 🚀 ".repeat(8),
      applicableWorkflows: "0",
      aiProductionWorkflows: "0",
    },
    answers("unknown"),
  );
  const pdf = await PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount() >= 4);
  assert.ok(bytes.length > 10000);
});
