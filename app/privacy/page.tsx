import Link from "next/link";
import "@/app/legal.css";
export const metadata = { title: "Local preview data handling" };
export default function Privacy() {
  return (
    <article className="container legal-page">
      <h1>Your data in this preview.</h1>
      <p>
        This notice describes the local Saavantus demo and its contact form.
        Please use fictional information while testing.
      </p>
      <h2>Voice conversations</h2>
      <p>
        When voice setup is available, selecting Start voice demo after the
        disclosure requests microphone permission. Audio streams to Sarvam for
        AI processing; Sarvam may retain recordings, transcripts and extracted
        preferences according to the workspace settings. Do not share real
        contact, identity, payment or medical information. End conversation
        stops capture. The app uses a random session identifier, not your phone
        number or email. n8n and GoHighLevel remain disconnected.
      </p>
      <h2>Fictional choices stay in the page</h2>
      <p>
        Scripted scenario preferences and selected sample times are held in
        memory. They are not written to a database, cookies or browser storage.
        Reset clears the walkthrough. Reloading the page clears its local state.
        The separate scripted walkthrough does not capture audio or send your
        choices to Sarvam. A live transcript stays in page memory until you
        reload or start another conversation; that does not delete any
        provider-held record.
      </p>
      <h2>Contact enquiries stay on this computer</h2>
      <p>
        The contact form saves the details you submit: name, business, email,
        optional phone, industry, requirements, optional preferred callback
        time, consent and submission time. They are stored in private local
        files on the computer running this preview, outside Git source control.
        The owner can review them locally. They are not emailed or sent to
        Sarvam, n8n or GoHighLevel. A callback preference is not a confirmed
        appointment.
      </p>
      <p>
        Local files remain until the owner deletes them; this preview has no
        automatic retention schedule or public enquiry-list endpoint. Do not
        submit patient records, identity documents or payment information. A
        live contact service needs approved retention, access and delivery
        arrangements before public release.
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
        Workspace recording and retention settings must be reviewed before a
        public release or use with real customer data. This local demonstration
        is not a healthcare service or a production privacy policy.
      </p>
      <Link className="button secondary" href="/">
        Back to the homepage
      </Link>
    </article>
  );
}
