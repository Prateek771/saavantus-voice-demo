import type { Metadata } from "next";
import { Demo } from "@/components/demo";
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
        <Demo industry="healthcare" />
      </div>
      <Features
        title="Helpful at the front desk."
        items={[
          {
            icon: "conversation",
            title: "Answer clinic questions",
            body: "Share approved hours, services, location and visit information.",
          },
          {
            icon: "calendar",
            title: "Collect appointment preferences",
            body: "Understand the requested service, clinician and time. Check the details before passing them on.",
          },
          {
            icon: "record",
            title: "Make the handoff clear",
            body: "Offer reception follow-up when staff help is needed. Tell the caller whether a request is pending or confirmed.",
          },
        ]}
      />
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
