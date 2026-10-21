import Link from "next/link";
export const metadata = { title: "Local preview data handling" };
export default function Privacy() {
  return (
    <article className="container page-prose">
      <p className="eyebrow">LOCAL PREVIEW</p>
      <h1>
        Your data in this <em>preview.</em>
      </h1>
      <p>
        This notice describes the disconnected local application you are trying.
        It is not the privacy policy for a future live voice service.
      </p>
      <h2>No voice or CRM connection</h2>
      <p>
        The preview never requests microphone access. Sarvam, n8n and
        GoHighLevel are disconnected. The conversation is a prewritten script;
        no AI model processes your input.
      </p>
      <h2>Fictional choices stay in the page</h2>
      <p>
        Scenario preferences, selected times and the local business brief are
        held in memory. They are not written to a database, cookies or browser
        storage. Reset clears the walkthrough. Reloading the page clears its
        local state.
      </p>
      <h2>Downloads are your choice</h2>
      <p>
        Downloading sample JSON creates a file on your device. It contains the
        selected fictional preferences and marks every record as a simulation.
        Delete that downloaded file yourself when you no longer need it.
      </p>
      <h2>Local technical requests</h2>
      <p>
        Your browser requests pages, fonts and images from the local app server.
        All fonts and images are served locally; there are no analytics, remote
        embeds or tracking scripts. The development server may record technical
        request information in local logs.
      </p>
      <h2>Before a live release</h2>
      <p>
        Provider processing, recording, retention, consent and access policies
        must be defined and reviewed before connecting real services. Please do
        not enter personal, patient or medical information into this preview.
      </p>
      <Link className="button secondary" href="/">
        Back to the homepage
      </Link>
    </article>
  );
}
