import type { Metadata } from "next";
import { Demo } from "@/components/demo";
import { VoiceDemo } from "@/components/voice-demo";
import {
  ClosingCTA,
  FAQs,
  Features,
  IndustryHero,
  IntegrationBand,
} from "@/components/marketing";
import "../marketing.css";
import "../industry-content.css";

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
        <VoiceDemo industry="real-estate" />
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
            body: "Start with buying, renting, selling or leasing out. Follow the questions that fit the enquiry; an owner needs a different conversation from a buyer.",
          },
          {
            icon: "record",
            title: "Capture the preferences",
            body: "For a property search, capture area, property type, budget and timing. For an owner enquiry, capture the property and intended sale or lease. Read back key details and keep unknowns visible.",
          },
          {
            icon: "calendar",
            title: "Agree the next step",
            body: "Record a viewing request, callback preference or need for a consultant. Keep unanswered questions visible.",
          },
        ]}
      />
      <section
        className="industry-example container"
        aria-labelledby="property-example-heading"
      >
        <div className="industry-example-heading">
          <h2 id="property-example-heading">
            From a passing thought to a viewing request.
          </h2>
          <p>
            An illustrative buyer enquiry. Confirm the details before a
            consultant continues.
          </p>
        </div>
        <div className="industry-example-layout">
          <div className="industry-example-dialogue">
            <h3>The conversation and readback</h3>
            <ol>
              <li>
                <span>Caller</span>
                <p>“A 2 BHK in Whitefield. Sometime this weekend?”</p>
              </li>
              <li>
                <span>Agent</span>
                <p>
                  “Are you looking to buy or rent, and would you like to arrange
                  a viewing?”
                </p>
              </li>
              <li>
                <span>Caller</span>
                <p>
                  “Buy, under ₹1 crore. A Saturday afternoon viewing would be
                  good.”
                </p>
              </li>
              <li>
                <span>Agent</span>
                <p>
                  “Buying a 2 BHK in Whitefield, under ₹1 crore, with a viewing
                  requested for Saturday afternoon. Is that right?”
                </p>
              </li>
              <li>
                <span>Caller</span>
                <p>“Yes, that’s right.”</p>
              </li>
            </ol>
          </div>
          <div className="industry-example-record">
            <h3>Confirmed in this example</h3>
            <dl>
              <div>
                <dt>Intent</dt>
                <dd>Buy a home</dd>
              </div>
              <div>
                <dt>Location / type</dt>
                <dd>Whitefield · 2 BHK</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>Under ₹1 crore</dd>
              </div>
              <div>
                <dt>Viewing preference</dt>
                <dd>Saturday afternoon</dd>
              </div>
              <div>
                <dt>Still to confirm</dt>
                <dd>Buying timeline</dd>
              </div>
            </dl>
            <p className="industry-example-status">
              Viewing requested · Not booked
            </p>
            <p>
              The property team would review availability and follow up. The
              preferred time is a request, not an available slot.
            </p>
          </div>
        </div>
        <p className="industry-example-note">
          Illustrative only. No viewing, callback or CRM save occurs in this
          demo.
        </p>
      </section>
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
