import Link from "next/link";
import { siteContact } from "@/lib/site-contact";
import "@/app/legal.css";
export const metadata = { title: "Local preview data handling" };
export default function Privacy() {
  return (
    <article className="container legal-page">
      <h1>Your data in this preview.</h1>
      <p>
        This notice describes the local Saavantus Excellence demo and its
        contact form and AI Discovery assessment. Please use fictional
        information while testing.
      </p>
      <h2>Strategy call bookings</h2>
      <p>
        The homepage includes a live Calendly calendar for a 30-minute call with
        Mukesh Kumar Das. Calendly loads as the calendar approaches your
        viewport and processes the details you choose to submit under its{" "}
        <a
          href="https://calendly.com/legal/privacy-notice"
          target="_blank"
          rel="noopener noreferrer"
        >
          privacy notice
        </a>
        . These bookings are separate from the fictional voice-demo
        appointments. This website does not copy calendar submissions into its
        contact or AI Discovery sheets, and GoHighLevel remains disconnected.
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
      <h2>Contact enquiries and delivery</h2>
      <p>
        The contact form collects your name, business, email, optional phone,
        industry, requirements, optional preferred callback time, consent and
        submission time. With your consent, it saves a local recovery copy on
        the computer running this app, outside Git source control, and attempts
        to save the enquiry in the Contact Queries tab of Saavantus Excellence's
        authorized Google Sheets business spreadsheet. The team uses these
        details to review and follow up on your enquiry. They are not emailed or
        sent to Sarvam, n8n or GoHighLevel. A callback preference does not book
        an appointment.
      </p>
      <p>
        Success is shown only after Google Sheets confirms delivery. If Google
        delivery is unavailable but a local copy is saved, the form reports that
        limited result and keeps your fields for retry. A missing network
        confirmation may leave delivery uncertain. Retrying the same enquiry
        uses its existing request reference to check delivery; it does not
        intentionally create a new enquiry.
      </p>
      <p>
        Local recovery copies and Google Sheet records remain until the owner
        deletes them; no automatic retention schedule is configured. Contact the
        owner at <a href={siteContact.emailHref}>{siteContact.email}</a> with
        questions or to request manual deletion. Do not submit patient records,
        identity documents or payment information. Access and retention
        arrangements must be reviewed before public release.
      </p>
      <h2>AI Discovery profile and assessment</h2>
      <p>
        AI Discovery asks for your name, business email, organization, industry,
        organization size, job title and country. Phone number and workflow
        counts are optional. It uses 40 self-assessment answers to calculate
        readiness and adoption scores, coverage, priorities and a roadmap using
        fixed rules. It does not send your answers to an AI model.
      </p>
      <p>
        The page shows connection status before you begin. When the Google
        connection is unavailable, the assessment runs as a preview: your
        profile and answers remain in page memory and are not saved to Google
        Sheets. Email verification still sends your business email to the
        server. Reloading or leaving the page clears the local assessment state.
      </p>
      <p>
        When the connection is available, submitting a completed assessment with
        the required data consent sends your profile, all 40 answers, calculated
        scores, consent choices and submission details to the app server for
        storage in the Assessments tab of the same Google Sheet controlled by
        Saavantus Excellence. This allows the team to review your assessment and
        follow up about your priorities. Optional marketing consent is separate
        and is not required to submit. Submission does not automatically
        generate a PDF or send an email.
      </p>
      <p>
        A success message confirms a saved submission. If a network request
        fails or confirmation is missing, the save status may be uncertain; do
        not assume the record was not saved. Clearing this page does not delete
        a record already stored in Google Sheets. Google processes stored
        records through its service, and access depends on the owner's account
        and sharing settings.
      </p>
      <p>
        No automatic retention schedule is configured for assessment records.
        Contact the owner at{" "}
        <a href={siteContact.emailHref}>{siteContact.email}</a> with questions
        or to request manual deletion. Avoid confidential business details,
        patient records, identity documents and payment information.
      </p>
      <h2>Email verification and assessment reports</h2>
      <p>
        Before continuing, you must verify control of your business email using
        a code requested through this app. The server checks email syntax,
        disposable-domain indicators and domain mail records through DNS. These
        checks do not prove a business identity or detect every temporary or
        misleading address. Requesting a code sends your address to the
        configured email provider; code verification and delivery state are
        processed by the app. Verification data is separate from marketing
        consent.
      </p>
      <p>
        Download PDF sends your profile and answers to the app server to prepare
        the report and returns a file to your browser. Email my report sends the
        requested report to your verified business address through the
        configured mail provider. The report contains assessment information, so
        check the destination before sending. A confirmed send means provider
        acceptance, not guaranteed inbox delivery. Missing confirmation can
        leave delivery uncertain. No automatic retry is made by these controls.
      </p>
      <p>
        Generated report processing does not delete saved assessment records.
        Downloaded files remain on your device until you delete them; emailed
        copies remain subject to your mailbox and provider retention settings.
        Contact the owner for questions about server-held verification or report
        records. Do not include sensitive or confidential information.
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
        Contact submissions and connected AI Discovery submissions also send the
        data described above through the app server to Google Sheets. All fonts
        and images are served locally, except for the Google Maps embed on the
        Contact page. Loading that map connects your browser to Google, which
        may process technical information such as your IP address and browser
        details. Form entries are not included in the map request. There are no
        analytics or tracking scripts added by this app. The development server
        may record technical request information in local logs.
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
