import type { Metadata } from "next";
import { Demo } from "@/components/demo";
import { VoiceDemo } from "@/components/voice-demo";
import {
  Arrow,
  ClosingCTA,
  FAQs,
  Features,
  IndustryHero,
  IntegrationBand,
  MarketingIcon,
} from "@/components/marketing";
import "../marketing.css";
import "../industry-content.css";

export const metadata: Metadata = {
  title: "Healthcare Receptionist Voice Demo",
  description:
    "Explore a fictional clinic reception conversation in English or Hindi. See appointment requests, clinic information and clear staff handoffs.",
};

export default function HealthcarePage() {
  return (
    <>
      <IndustryHero
        industry="healthcare"
        eyebrow="HEALTHCARE FRONT DESK RECEPTIONIST"
        firstLine="A calmer first call."
        secondLine={
          <>
            A clearer <em>next step.</em>
          </>
        }
      >
        <p className="hero-description">
          Help callers with clinic information and appointment requests. Give
          your reception team the details to continue.
        </p>
      </IndustryHero>
      <div className="industry-demo">
        <VoiceDemo industry="healthcare" />
        <Demo industry="healthcare" />
      </div>
      <Features
        title="Helpful at the front desk."
        items={[
          {
            icon: "conversation",
            title: "Answer clinic questions",
            body: "Share approved hours, services, branch location and visit information. Keep unanswered questions for reception.",
          },
          {
            icon: "calendar",
            title: "Collect appointment preferences",
            body: "Collect only the administrative details needed: requested service, branch, clinician preference if relevant, and preferred time. Read them back before passing them on.",
          },
          {
            icon: "record",
            title: "Make the handoff clear",
            body: "Offer reception follow-up when staff help is needed. Tell the caller whether a request is pending or confirmed.",
          },
        ]}
      />
      <section
        className="industry-example container"
        aria-labelledby="clinic-example-heading"
      >
        <div className="industry-example-heading">
          <h2 id="clinic-example-heading">
            An evening preference. A clear reception request.
          </h2>
          <p>
            An illustrative administrative enquiry, ready for reception to
            review.
          </p>
        </div>
        <div className="industry-example-layout">
          <div className="industry-example-dialogue">
            <h3>The conversation and readback</h3>
            <ol>
              <li>
                <span>Caller</span>
                <p>
                  “Is an evening appointment possible for a general consultation
                  at your main branch?”
                </p>
              </li>
              <li>
                <span>Agent</span>
                <p>“Which day would you prefer?”</p>
              </li>
              <li>
                <span>Caller</span>
                <p>“Friday, please.”</p>
              </li>
              <li>
                <span>Agent</span>
                <p>
                  “A general consultation at the main branch on Friday evening.
                  Is that correct?”
                </p>
              </li>
              <li>
                <span>Caller</span>
                <p>“Yes.”</p>
              </li>
            </ol>
          </div>
          <div className="industry-example-record">
            <h3>Confirmed in this example</h3>
            <dl>
              <div>
                <dt>Requested service</dt>
                <dd>General consultation</dd>
              </div>
              <div>
                <dt>Branch preference</dt>
                <dd>Main branch</dd>
              </div>
              <div>
                <dt>Preferred time</dt>
                <dd>Friday evening</dd>
              </div>
              <div>
                <dt>Next step</dt>
                <dd>Reception reviews availability</dd>
              </div>
            </dl>
            <p className="industry-example-status">
              Appointment requested · Not booked
            </p>
            <p>
              Reception would check availability and confirm the next step.
              Medical questions stay with qualified healthcare staff.
            </p>
          </div>
        </div>
        <p className="industry-example-note">
          Fictional example. No clinic is contacted and no appointment is
          booked.
        </p>
      </section>
      <section
        className="scope-section container"
        aria-labelledby="scope-heading"
      >
        <div className="scope-icon">
          <MarketingIcon kind="shield" />
        </div>
        <div className="scope-copy">
          <h2 id="scope-heading">
            Reception support. Clinical decisions stay with clinicians.
          </h2>
          <p>
            The agent does not diagnose, prescribe or interpret reports. Urgent
            concerns leave the routine booking flow.
          </p>
          <details className="handoff-details">
            <summary>
              How handoff works <Arrow diagonal />
            </summary>
            <p>
              In this demo, a handoff is an example of how a request would reach
              staff; it does not call a clinic or emergency service. In a live
              deployment, the clinic must define the destination, operating
              hours and fallback. Clinical escalation wording requires review by
              a qualified clinician before the healthcare voice demo launches.
            </p>
          </details>
        </div>
      </section>
      <IntegrationBand healthcare />
      <FAQs
        items={[
          {
            question: "Can it book a real appointment?",
            answer:
              "This local preview shows a sample request. Real bookings require a connected clinic calendar and confirmation of the chosen time.",
          },
          {
            question: "What if a caller needs a person?",
            answer:
              "The planned workflow routes the request to your reception team. The demo explains the handoff; it does not transfer a real call.",
          },
          {
            question: "Will it answer medical questions?",
            answer:
              "Its role is administrative reception. Medical questions, diagnoses and treatment decisions stay with qualified healthcare staff.",
          },
          {
            question: "Will patient records go into the CRM?",
            answer:
              "This demo uses fictional information. A live setup needs the clinic’s approval for the minimum administrative data stored, who can access it and how long it is kept. Full clinical records are outside this CRM proposal.",
          },
        ]}
      />
      <ClosingCTA>Build a better first point of contact.</ClosingCTA>
    </>
  );
}
