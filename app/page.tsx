import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, MarketingIcon } from "@/components/marketing";
import { VoiceScene } from "@/components/voice-scene";
import { Icon } from "@/components/ui";
import { services } from "@/lib/services";
import "./marketing.css";
import "./home.css";

export const metadata: Metadata = {
  title: { absolute: "Saavantus Excellence | AI & Business Automation" },
  description:
    "AI agents, workflow automation, connected business processes and AWS cloud automation. Explore Saavantus Excellence services and try our industry voice demos.",
};

const problems = [
  [
    "The same task, again.",
    "Copying records, preparing documents and chasing updates leave less time for work that needs your judgement.",
  ],
  [
    "Work waiting between teams.",
    "Unclear ownership and manual approvals turn a simple request into a chain of reminders.",
  ],
  [
    "A queue of familiar questions.",
    "Repeated enquiries fill the support queue while more involved issues wait for attention.",
  ],
  [
    "More tools. Less visibility.",
    "Disconnected systems make it difficult to see what happened, what failed and what needs to happen next.",
  ],
];

const solutions = [
  {
    title: "AI agents with a defined job.",
    body: "Give routine conversations, research or internal questions a focused assistant, with approved knowledge and a route to a person.",
    example: "Request → Clarify → Prepare a reviewed handoff",
    service: "agents",
  },
  {
    title: "Support that starts with context.",
    body: "Help people find approved answers, gather the missing details and pass unresolved questions to the right team.",
    example: "Question → Approved knowledge → Answer or escalate",
    service: "support",
  },
  {
    title: "Tickets that reach the right owner.",
    body: "Classify incoming requests, apply your routing rules and keep exceptions visible instead of losing them in a shared inbox.",
    example: "Incoming ticket → Category and priority → Assigned owner",
    service: "bpa",
  },
  {
    title: "Reporting without the copy and paste.",
    body: "Bring agreed data into a recurring report, flag missing records and prepare summaries your team can check.",
    example: "Source data → Validation → Report ready for review",
    service: "integration",
  },
  {
    title: "One workflow across the whole task.",
    body: "Connect triggers, tools, approvals and follow-up. Include checks, retries and a clear response when a step cannot complete.",
    example: "Trigger → Connected steps → Approval → Status update",
    service: "workflow",
  },
];

export default function Home() {
  return (
    <>
      <VoiceScene />
      <section
        id="ai-discovery"
        className="home-discovery container"
        aria-labelledby="discovery-title"
      >
        <div className="home-discovery-intro" data-reveal>
          <h2 id="discovery-title">
            Where could AI
            <br />
            <em>make a useful difference?</em>
          </h2>
          <p>
            Start with a clearer picture of your business. AI Discovery gives
            you a practical view of your readiness, current adoption and where
            to focus next.
          </p>
          <Link className="button" href="/ai-discovery">
            Start AI Discovery <Arrow />
          </Link>
          <p className="home-discovery-privacy">
            Your profile and answers are saved to Google Sheets only when the
            connection is available and you submit the completed assessment with
            consent. Connection status is shown before you begin.
          </p>
        </div>
        <div className="home-discovery-preview" data-reveal>
          <h3>A starting point for your next decision.</h3>
          <dl className="home-discovery-results">
            <div>
              <dt>Readiness &amp; adoption</dt>
              <dd>
                See your foundations and everyday AI use as two separate scores.
              </dd>
            </div>
            <div>
              <dt>Clear priorities</dt>
              <dd>
                Understand your stronger areas, capability gaps and unanswered
                questions.
              </dd>
            </div>
            <div>
              <dt>A 30/60/90-day roadmap</dt>
              <dd>
                Turn your responses into practical next steps to review with
                your team.
              </dd>
            </div>
          </dl>
          <p className="home-discovery-note">
            A transparent, rule-based self-assessment. Results reflect your
            answers, not an independent audit or AI-generated analysis. Choose
            "Not sure" where you need more evidence.
          </p>
        </div>
      </section>

      <section className="home-problems" aria-labelledby="problems-title">
        <div className="container home-editorial-split">
          <div data-reveal>
            <h2 id="problems-title">
              Where does the
              <br />
              <em>work slow down?</em>
            </h2>
            <p>
              Start with the friction your team knows. A useful automation
              solves a specific problem and fits the way people work.
            </p>
          </div>
          <dl className="home-problem-list">
            {problems.map(([title, body]) => (
              <div key={title} data-reveal>
                <dt>{title}</dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        className="home-solutions container"
        aria-labelledby="solutions-title"
      >
        <div className="home-section-heading" data-reveal>
          <h2 id="solutions-title">
            Better ways to
            <br />
            <em>get the work done.</em>
          </h2>
          <p>
            From the first request to the final update, design the steps that
            belong together. These are examples of workflows we can build around
            your systems.
          </p>
        </div>
        <div className="home-solution-list">
          {solutions.map((solution) => (
            <article className="home-solution" key={solution.title} data-reveal>
              <h3>
                <Link href={`/services#${solution.service}`}>
                  {solution.title}
                  <Arrow diagonal />
                </Link>
              </h3>
              <div>
                <p>{solution.body}</p>
                <p className="home-solution-example">
                  <span>Example flow</span>
                  {solution.example}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-services" aria-labelledby="services-title">
        <div className="container">
          <div className="home-section-heading" data-reveal>
            <h2 id="services-title">
              The right support,
              <br />
              <em>from plan to operation.</em>
            </h2>
            <div>
              <p>
                Start with one process or plan a wider programme. Explore what
                each service includes and where it can help.
              </p>
              <Link className="text-link" href="/services">
                Explore all services <Arrow />
              </Link>
            </div>
          </div>
          <div className="home-service-list">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="home-service-link"
                data-reveal
              >
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                </div>
                <Arrow diagonal />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="agents"
        className="home-industries container"
        aria-labelledby="agents-title"
      >
        <div className="home-section-heading" data-reveal>
          <h2 id="agents-title">
            See an agent
            <br />
            <em>in your industry.</em>
          </h2>
          <p>
            Explore two focused voice demos in English and Hindi. Each page
            explains the role, the workflow and its boundaries.
          </p>
        </div>
        <div className="home-industry-links">
          <Link
            href="/real-estate-ai"
            className="home-industry-link"
            data-reveal
          >
            <MarketingIcon kind="conversation" />
            <div>
              <h3>Real estate</h3>
              <p>Property enquiries and lead qualification</p>
            </div>
            <Arrow diagonal />
          </Link>
          <Link
            href="/healthcare-ai"
            className="home-industry-link"
            data-reveal
          >
            <MarketingIcon kind="calendar" />
            <div>
              <h3>Healthcare</h3>
              <p>Administrative enquiries and reception</p>
            </div>
            <Arrow diagonal />
          </Link>
        </div>
      </section>

      <section
        className="home-outcomes container"
        aria-labelledby="outcomes-title"
      >
        <div data-reveal>
          <h2 id="outcomes-title">
            Agree what better
            <br />
            <em>looks like. Then measure it.</em>
          </h2>
          <p>
            Set a baseline before the build. Choose measures that reflect the
            work, compare them after launch and review the exceptions as well as
            the wins.
          </p>
        </div>
        <dl className="home-measures">
          {[
            ["Time back", "Manual steps and handling time per task"],
            [
              "Clearer handoffs",
              "Requests reaching the right owner with useful context",
            ],
            [
              "Reliable operations",
              "Completed runs, failures and recovery time",
            ],
            [
              "Cost in context",
              "Operating cost alongside workload and quality",
            ],
          ].map(([title, body]) => (
            <div key={title} data-reveal>
              <dt>{title}</dt>
              <dd>{body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="home-company container"
        aria-labelledby="vision-title"
      >
        <div className="home-company-vision" data-reveal>
          <h2 id="vision-title">
            More time for the work
            <br />
            <em>that moves you forward.</em>
          </h2>
          <p>
            Our vision is to make practical AI and automation part of everyday
            business: less repetitive work, clearer decisions and more time for
            customers and growth.
          </p>
          <p>
            We map the workflow, connect the tools and build around the people
            using them. From voice agents to cloud operations, we focus on
            dependable systems and improvements you can measure.
          </p>
        </div>
        <div className="home-founder" data-reveal>
          <h3>Mukesh Kumar Das</h3>
          <p className="home-founder-role">
            Founder &amp; CEO · Saavantus Excellence
          </p>
          <p>
            Former enterprise IT leader and author on AWS and AI. Brings 25+
            years of experience in infrastructure, cloud migration and business
            transformation.
          </p>
        </div>
      </section>

      <section className="home-contact-band" aria-labelledby="contact-heading">
        <div className="container">
          <div data-reveal>
            <h2 id="contact-heading">
              What could your team
              <br />
              <em>stop doing by hand?</em>
            </h2>
            <p>
              Tell us about the task, the tools involved and where things get
              stuck. We’ll start with the workflow and a practical next step.
            </p>
          </div>
          <Link href="/contact" className="button">
            Discuss your workflow <Arrow />
          </Link>
        </div>
      </section>

      <section
        id="book-a-call"
        className="home-booking"
        aria-labelledby="booking-title"
      >
        <div className="container home-booking-layout">
          <div className="home-booking-copy" data-reveal>
            <p className="home-booking-eyebrow">Book a strategy call</p>
            <h2 id="booking-title">
              A useful next step starts with a <span>conversation.</span>
            </h2>
            <p className="home-booking-description">
              Bring one workflow, a few questions, and the tools your team uses.
              We’ll explore where automation could help and discuss a practical
              next step.
            </p>
            <div className="home-booking-facts">
              <p>
                <Icon name="calendar" size={19} />
                30 minutes, focused on your business
              </p>
              <p>
                <Icon name="chat" size={19} />
                With Mukesh Kumar Das
              </p>
            </div>
            <a
              className="home-booking-external"
              href="https://calendly.com/mukesh-das-saavantus/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open calendar in a new tab <Icon name="external" size={17} />
            </a>
            <p className="home-booking-note">
              Choose a time that works for you.
              <br />
              Scheduling is handled by Calendly.
            </p>
          </div>
          <div className="home-booking-calendar" data-lenis-prevent>
            <div className="home-booking-calendar-label">
              <span aria-hidden="true" />
              Let’s make time for what’s next.
            </div>
            <iframe
              title="Book a 30-minute call with Mukesh Kumar Das"
              src="https://calendly.com/mukesh-das-saavantus/30min?hide_event_type_details=1&background_color=fffdf9&text_color=17242a&primary_color=b83223&embed_type=Inline"
              width="100%"
              height="750"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </>
  );
}
