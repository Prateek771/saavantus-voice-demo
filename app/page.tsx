import type { Metadata } from "next";
import Link from "next/link";
import {
  Arrow,
  IntegrationBand,
  MarketingIcon,
  VoiceArtwork,
} from "@/components/marketing";
import "./marketing.css";

export const metadata: Metadata = {
  title: "Saavantus | Voice Agents for Real Estate & Healthcare",
  description:
    "Explore English and Hindi voice-agent demos for property enquiries and clinic reception. See sample qualification summaries and appointment requests.",
};

export default function Home() {
  return (
    <>
      <section className="home-hero container">
        <div className="home-hero-copy">
          <p className="eyebrow">VOICE AGENTS FOR INDIAN BUSINESSES</p>
          <h1>
            A better conversation.
            <br />A clear <em>next step.</em>
          </h1>
          <p className="hero-description">
            Voice agents for property enquiries and clinic reception. Explore a
            fictional conversation in English or Hindi. See the details your
            team receives.
          </p>
          <div className="hero-actions">
            <a className="button" href="#agents">
              Explore the demos <Arrow />
            </a>
            <a className="text-link" href="#agents">
              Explore the agents <Arrow diagonal />
            </a>
          </div>
          <p className="hero-support">
            English + Hindi examples · Built around your workflow
          </p>
        </div>
        <div className="home-hero-visual">
          <VoiceArtwork />
          <div className="example-speech">
            “I’m looking for a 2 BHK in Whitefield.”
            <span aria-hidden="true">
              <svg width="24" height="28" viewBox="0 0 24 28">
                <path
                  d="M3 12v4m4-10v16m5-22v28m5-21v14m4-10v6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </span>
          </div>
          <div className="example-tags">
            <span>BUY</span>
            <i />
            <span>WHITEFIELD</span>
            <i />
            <span>2 BHK</span>
          </div>
          <p className="example-label">EXAMPLE CONVERSATION · NOT LIVE AUDIO</p>
        </div>
      </section>
      <section id="agents" className="agent-section">
        <div className="container">
          <h2>Two roles. Ready to meet your customers.</h2>
          <div className="agent-card-grid">
            <article className="agent-card">
              <div className="agent-card-main">
                <img
                  src="/images/property.png"
                  width="540"
                  height="420"
                  alt="Illustrative modern apartment architecture; not an available property listing."
                  loading="lazy"
                />
                <div className="agent-card-copy">
                  <p className="eyebrow">01 / REAL ESTATE</p>
                  <h3>
                    Meet your next
                    <br />
                    qualified enquiry.
                  </h3>
                  <p>
                    Capture intent, preferences, budget and timing before your
                    consultant takes over.
                  </p>
                  <Link className="text-link" href="/real-estate-ai#voice-demo">
                    Try the property agent <Arrow diagonal />
                  </Link>
                </div>
              </div>
              <dl className="sample-mini">
                <div>
                  <dt>Intent</dt>
                  <dd>Buy</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>Whitefield, Bengaluru</dd>
                </div>
                <div>
                  <dt>Next step</dt>
                  <dd>Viewing request</dd>
                </div>
              </dl>
              <p className="sample-label">SAMPLE RESULT</p>
            </article>
            <article className="agent-card">
              <div className="agent-card-main">
                <img
                  src="/images/clinic.png"
                  width="540"
                  height="420"
                  alt="Illustrative clinic reception architecture; not a real clinic."
                  loading="lazy"
                />
                <div className="agent-card-copy">
                  <p className="eyebrow">02 / HEALTHCARE</p>
                  <h3>
                    Make the first
                    <br />
                    conversation easier.
                  </h3>
                  <p>
                    Answer clinic questions, collect appointment preferences and
                    route requests to reception.
                  </p>
                  <Link className="text-link" href="/healthcare-ai#voice-demo">
                    Try the receptionist <Arrow diagonal />
                  </Link>
                </div>
              </div>
              <dl className="sample-mini">
                <div>
                  <dt>Request</dt>
                  <dd>Consultation</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>Hindi</dd>
                </div>
                <div>
                  <dt>Next step</dt>
                  <dd>Appointment request</dd>
                </div>
              </dl>
              <p className="sample-label">SAMPLE RESULT</p>
            </article>
          </div>
          <p className="agent-section-note">
            Each demo page shows its voice connection status. Scripted walkthroughs remain available. No CRM save or real booking.
          </p>
        </div>
      </section>
      <section id="how-it-works" className="how-section container">
        <h2>From spoken details to an organised follow-up.</h2>
        <div className="how-grid">
          {[
            {
              icon: "conversation" as const,
              title: "Have a conversation",
              body: "Your customers speak naturally in English or Hindi about what they need.",
            },
            {
              icon: "record" as const,
              title: "Capture the essentials",
              body: "The agent asks relevant questions and checks the important details with the caller.",
            },
            {
              icon: "calendar" as const,
              title: "Give your team a next step",
              body: "Your team receives an organised enquiry or appointment request with the information needed to continue.",
            },
          ].map((step, i) => (
            <article className="how-step" key={step.title}>
              <span className="step-number">0{i + 1}</span>
              <div>
                <MarketingIcon kind={step.icon} />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              {i < 2 && (
                <span className="how-arrow">
                  <Arrow />
                </span>
              )}
            </article>
          ))}
        </div>
        <p className="how-note">
          The planned connected workflow, illustrated in this preview with
          fictional examples.
        </p>
      </section>
      <IntegrationBand home />
    </>
  );
}
