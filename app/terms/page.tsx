import Link from "next/link";
export const metadata = { title: "Preview scope" };
export default function Terms() {
  return (
    <article className="container page-prose">
      <p className="eyebrow">PREVIEW SCOPE</p>
      <h1>
        A demonstration, <em>clearly labelled.</em>
      </h1>
      <p>
        This local application lets you review Saavantus's proposed website and
        workflow before live implementation.
      </p>
      <h2>Sample conversations and records</h2>
      <p>
        All conversations are scripted and all displayed properties, clinics,
        dates and records are fictional. A simulated appointment does not
        reserve a viewing or clinic visit. No contact, enquiry or message is
        sent to a business.
      </p>
      <h2>Healthcare demonstration</h2>
      <p>
        The receptionist scenario is administrative only. It provides no medical
        advice, diagnosis or emergency service. Do not rely on this preview for
        care or urgent help.
      </p>
      <h2>Future integrations</h2>
      <p>
        References to Sarvam, n8n and GoHighLevel describe the planned
        architecture. They do not indicate an active connection, partnership,
        certification or guaranteed outcome. Production terms and data handling
        will be reviewed before public release.
      </p>
      <Link className="button secondary" href="/">
        Back to the homepage
      </Link>
    </article>
  );
}
