import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, MarketingIcon } from "@/components/marketing";
import { VoiceScene } from "@/components/voice-scene";
import "./marketing.css";
import "./home.css";

export const metadata: Metadata = {
  title: "Saavantus | Conversations that move business forward",
  description:
    "English and Hindi voice agents for property enquiries and clinic reception. Try the demos and see how the Saavantus 4A Framework turns a conversation into a clear next step.",
};

export default function Home() {
  return (
    <>
      <VoiceScene />
      <section
        className="home-introduction container"
        aria-labelledby="introduction-title"
      >
        <h2 id="introduction-title" data-reveal>
          A good conversation should
          <br />
          leave your team <em>better informed.</em>
        </h2>
        <div data-reveal>
          <p>
            People rarely arrive with a perfectly filled form. They have a
            question, a preference, a change of plan. Saavantus gives that
            conversation a structure—without making it feel like a checklist.
          </p>
          <p>
            Your agent listens, follows the enquiry and confirms what matters.
            Your team gets the context to take the next step.
          </p>
        </div>
      </section>
      <section
        id="agents"
        className="home-agent-section container"
        aria-labelledby="agents-title"
      >
        <div className="section-heading">
          <h2 id="agents-title" data-reveal>
            Hear what that sounds like.
          </h2>
          <p>
            Two focused roles. Real voice conversations.
            <br />
            Use fictional details when you try them.
          </p>
        </div>
        <div className="home-agent-grid">
          <article className="home-agent property-agent" data-reveal>
            <div className="agent-role">
              <MarketingIcon kind="conversation" />
              <span>Real estate</span>
            </div>
            <h3>
              Start with “I’m looking.”
              <br />
              Get to <em>what, where and when.</em>
            </h3>
            <p>
              A property enquiry can mean buying, renting or selling. Ask about
              the right things: location, budget, property preferences and
              timing. Confirm the details before a consultant continues.
            </p>
            <dl className="agent-example">
              <div>
                <dt>The conversation</dt>
                <dd>“I’m moving closer to work.”</dd>
              </div>
              <div>
                <dt>The useful context</dt>
                <dd>Preferred area · Budget · Move-in timeline</dd>
              </div>
            </dl>
            <Link className="text-link" href="/real-estate-ai#voice-demo">
              Try the property agent <Arrow diagonal />
            </Link>
          </article>
          <article className="home-agent clinic-agent" data-reveal>
            <div className="agent-role">
              <MarketingIcon kind="calendar" />
              <span>Healthcare</span>
            </div>
            <h3>
              A helpful first conversation.
              <br />
              <em>A clearer reception desk.</em>
            </h3>
            <p>
              Help people find routine clinic information and describe their
              appointment preferences. Keep administrative requests organised,
              with clear boundaries for questions that need qualified staff.
            </p>
            <dl className="agent-example">
              <div>
                <dt>The conversation</dt>
                <dd>“Is an evening appointment possible?”</dd>
              </div>
              <div>
                <dt>The useful context</dt>
                <dd>Requested service · Branch · Preferred time</dd>
              </div>
            </dl>
            <Link className="text-link" href="/healthcare-ai#voice-demo">
              Try the receptionist <Arrow diagonal />
            </Link>
          </article>
        </div>
        <p className="home-demo-note">
          English + Hindi · Up to three minutes per voice demo · Healthcare is
          administrative, not medical advice. CRM saves, real bookings and
          transfers are not connected.
        </p>
      </section>
      <section
        id="how-it-works"
        className="conversation-workflow"
        aria-labelledby="workflow-title"
      >
        <div className="container">
          <div className="section-heading">
            <h2 id="workflow-title" data-reveal>
              From a spoken thought
              <br />
              to a useful <em>next step.</em>
            </h2>
            <p>
              The conversation is only the beginning. We design the questions,
              checks and handoffs around the job your team needs to get done.
            </p>
          </div>
          <ol className="workflow-sequence">
            <li data-reveal>
              <span className="workflow-step">01</span>
              <div>
                <h3>Understand the enquiry</h3>
                <p>
                  Start with the person’s intent. Follow the right route for a
                  property search, a seller enquiry or a routine appointment
                  request.
                </p>
              </div>
            </li>
            <li data-reveal>
              <span className="workflow-step">02</span>
              <div>
                <h3>Confirm what matters</h3>
                <p>
                  Collect relevant preferences, read back important details and
                  make room for corrections. Keep unknowns visible instead of
                  guessing.
                </p>
              </div>
            </li>
            <li data-reveal>
              <span className="workflow-step">03</span>
              <div>
                <h3>Prepare the handoff</h3>
                <p>
                  Bring the context together: what the person needs, their
                  preferred time and what should happen next. A request becomes
                  a booking only after calendar confirmation.
                </p>
              </div>
            </li>
          </ol>
          <div className="connection-note">
            <MarketingIcon kind="record" />
            <p>
              <strong>One connected record is the next stage.</strong> Sarvam
              powers the voice demos today. The planned n8n and GoHighLevel
              connection will carry confirmed details into contacts,
              opportunities and appointments.
            </p>
          </div>
        </div>
      </section>
      <section
        className="delivery-section container"
        aria-labelledby="delivery-title"
      >
        <div className="delivery-intro" data-reveal>
          <h2 id="delivery-title">
            Built around your business.
            <br />
            <em>Refined with your team.</em>
          </h2>
          <p>
            Our SaaS 4A Framework gives each project a clear path from an
            everyday business problem to a working, reviewed workflow.
          </p>
          <Link className="text-link" href="/contact">
            Tell us what you want to improve <Arrow diagonal />
          </Link>
        </div>
        <ol className="four-a-framework">
          {[
            [
              "Assess",
              "Find the work worth improving.",
              "Map the incoming enquiries, repeated questions and existing handoffs. Agree what a useful outcome looks like for your team and your customers.",
            ],
            [
              "Architect",
              "Give the conversation a structure.",
              "Design the questions, approved knowledge, confirmation rules and data destinations. Decide when the agent can help and when a person should take over.",
            ],
            [
              "Adjust",
              "Test the moments that don’t follow a script.",
              "Review language, corrections, incomplete answers and edge cases with your team. Refine the experience before connecting it to live operations.",
            ],
            [
              "Automate",
              "Connect the tools. Keep learning.",
              "Connect approved systems, verify the handoffs and launch with monitoring. Review conversation outcomes and improve the workflow as the business changes.",
            ],
          ].map(([name, title, body], i) => (
            <li key={name} data-reveal>
              <span className="framework-order">{i + 1}</span>
              <div>
                <h3>{name}</h3>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="home-contact-band" aria-labelledby="contact-heading">
        <div className="container">
          <div data-reveal>
            <h2 id="contact-heading">
              What should your next
              <br />
              conversation <em>make possible?</em>
            </h2>
            <p>
              Tell us about your business, the enquiries you handle and the
              follow-up you want to improve. We’ll start with the workflow.
            </p>
          </div>
          <Link href="/contact" className="button">
            Contact us <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
