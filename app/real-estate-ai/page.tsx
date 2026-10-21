import type { Metadata } from "next";
import { Demo } from "@/components/demo";
import {
  ClosingCTA,
  FAQs,
  Features,
  IndustryHero,
  IntegrationBand,
} from "@/components/marketing";
import "../marketing.css";

export const metadata: Metadata = {
  title: "Real Estate Voice Agent Demo",
  description:
    "Explore a fictional property enquiry in English or Hindi. See how location, budget, timeline and viewing preferences become a structured sample lead.",
};

export default function RealEstatePage() {
  return (
    <>
      <IndustryHero
        industry="real-estate"
        eyebrow="REAL ESTATE LEAD QUALIFICATION"
        firstLine="Know what they want."
        secondLine={
          <>
            Know what <em>comes next.</em>
          </>
        }
      >
        <p className="hero-description">
          Capture location, budget, property preferences and buying timeline.
          Give your team an enquiry they can act on.
        </p>
      </IndustryHero>
      <div className="industry-demo">
        <Demo industry="real-estate" />
      </div>
      <Features
        title={
          <>
            One conversation. The details <em>that matter.</em>
          </>
        }
        items={[
          {
            icon: "conversation",
            title: "Understand the intent",
            body: "Find out whether the caller wants to buy, rent, sell or lease out a property. Ask questions that fit that enquiry.",
          },
          {
            icon: "record",
            title: "Capture the preferences",
            body: "Collect the preferred area, property type, budget and timeline. Read back key details so the caller can correct them.",
          },
          {
            icon: "calendar",
            title: "Agree the next step",
            body: "Record a viewing request, callback preference or need for a consultant. Keep unanswered questions visible.",
          },
        ]}
      />
      <IntegrationBand />
      <FAQs
        items={[
          {
            question: "Can it handle buyers, tenants and sellers?",
            answer:
              "The planned flow supports buying, renting, selling and leasing enquiries, with different questions for each. Buyer qualification scores will not be applied to sellers.",
          },
          {
            question: "Can it book property viewings?",
            answer:
              "This local demo shows a sample viewing request. In a connected deployment, the agent can check the selected GoHighLevel calendar, ask the caller to confirm a slot and report the returned booking status.",
          },
          {
            question: "What goes into the CRM?",
            answer:
              "In the planned live flow, confirmed contact details, intent, location preferences, budget, timeline and the agreed next step. Appointment details belong to the linked calendar record. This demo does not save a CRM contact.",
          },
          {
            question: "What happens when it cannot answer?",
            answer:
              "The agent should say what is missing and offer the configured staff follow-up. It must not invent property availability, prices or a successful transfer. This local preview does not transfer calls.",
          },
        ]}
      />
      <ClosingCTA>Let’s shape it around your properties.</ClosingCTA>
    </>
  );
}
