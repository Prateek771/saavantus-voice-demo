import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarketingIcon({
  kind,
}: {
  kind: "conversation" | "record" | "calendar" | "contact" | "shield";
}) {
  const paths = {
    conversation: (
      <>
        <path d="M20 11a8 8 0 0 1-8 8 9 9 0 0 1-3-.5L4 20l1.5-5A8 8 0 1 1 20 11Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" strokeWidth="3" />
      </>
    ),
    record: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h6M9 18h3" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 10h18M8 14h1m6 0h1m-8 4h1" />
      </>
    ),
    contact: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </>
    ),
  };
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}

export function IndustryHero({
  industry,
  eyebrow,
  firstLine,
  secondLine,
  children,
}: {
  industry: "real-estate" | "healthcare";
  eyebrow: string;
  firstLine: string;
  secondLine: ReactNode;
  children: ReactNode;
}) {
  const healthcare = industry === "healthcare";
  return (
    <section
      className={`industry-hero ${healthcare ? "clinic-hero" : "property-hero"}`}
    >
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{healthcare ? "Healthcare" : "Real estate"}</span>
        </nav>
        <div className="industry-hero-copy">
          <h1>
            {firstLine}
            <br />
            {secondLine}
          </h1>
          {children}
          <div className="industry-hero-actions">
            <a className="button" href="#voice-demo">
              Talk to the agent <Arrow />
            </a>
            <a className="text-link" href="#demo">
              Explore the walkthrough <Arrow />
            </a>
          </div>
          <p className="industry-language">
            English and Hindi · Fictional information only
          </p>
        </div>
        <figure
          className="industry-preview"
          aria-label={`${healthcare ? "Clinic reception" : "Property enquiry"} sample workflow`}
        >
          <figcaption className="industry-preview-bar">
            <span>{eyebrow}</span>
            <span className="industry-preview-mode">
              Illustrative conversation
            </span>
          </figcaption>
          <div className="industry-preview-flow">
            <div className="industry-preview-conversation">
              <span className="preview-role">
                <MarketingIcon kind="conversation" /> The enquiry
              </span>
              <p className="preview-quote">
                {healthcare
                  ? "“I'd like a general consultation on Friday afternoon.”"
                  : "“I'm looking for a two-bedroom home in Whitefield, under ₹1 crore.”"}
              </p>
              <div className="preview-wave" aria-hidden="true">
                <svg viewBox="0 0 380 44" fill="none">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <path
                      key={line}
                      d={`M0 22 C45 22 55 ${10 + line * 4} 95 22 S145 ${42 - line * 5} 190 22 S240 ${line * 5} 285 22 S340 ${33 - line * 2} 380 22`}
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity={0.3 + line * 0.13}
                    />
                  ))}
                </svg>
              </div>
            </div>
            <div className="industry-preview-record">
              <span className="preview-role">
                <MarketingIcon kind="record" /> Details to confirm
              </span>
              <dl>
                <div>
                  <dt>{healthcare ? "Service" : "Location"}</dt>
                  <dd>
                    {healthcare
                      ? "General consultation"
                      : "Whitefield, Bengaluru"}
                  </dd>
                </div>
                <div>
                  <dt>{healthcare ? "Preference" : "Property"}</dt>
                  <dd>{healthcare ? "Friday afternoon" : "2-bedroom home"}</dd>
                </div>
                <div>
                  <dt>{healthcare ? "Request" : "Budget"}</dt>
                  <dd>
                    {healthcare ? "Reception follow-up" : "Under ₹1 crore"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="industry-preview-next">
              <span className="preview-role">
                <MarketingIcon kind="calendar" /> The next step
              </span>
              <p>
                {healthcare
                  ? "An appointment request for the reception team."
                  : "A viewing request for the property team."}
              </p>
              <span className="preview-pending">Requested · Not booked</span>
            </div>
          </div>
          <p className="industry-preview-note">
            Sample details shown. CRM and calendar connections are not active in
            this demo.
          </p>
        </figure>
      </div>
    </section>
  );
}

export function Features({
  title,
  items,
}: {
  title: ReactNode;
  items: {
    icon: "conversation" | "record" | "calendar";
    title: string;
    body: string;
  }[];
}) {
  return (
    <section className="feature-section container">
      <h2>{title}</h2>
      <div className="feature-grid">
        {items.map((item) => (
          <article className="feature" key={item.title}>
            <div className="feature-icon">
              <MarketingIcon kind={item.icon} />
            </div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function IntegrationBand({
  home = false,
  healthcare = false,
}: {
  home?: boolean;
  healthcare?: boolean;
}) {
  return (
    <section className={`integration-band ${home ? "integration-home" : ""}`}>
      <div className="container integration-layout">
        <div>
          <h2>
            {home
              ? "Your voice agent. Your CRM. Your calendar."
              : healthcare
                ? "An organised request. A clear appointment status."
                : "A record your sales team can use."}
          </h2>
          <span className="integration-label">
            Integration preview · Not connected
          </span>
          {!home && !healthcare && (
            <div className="record-flow">
              {[
                {
                  icon: "conversation" as const,
                  title: "Conversation",
                  body: "Capture the enquiry details.",
                },
                {
                  icon: "contact" as const,
                  title: "Contact",
                  body: "Keep confirmed contact details.",
                },
                {
                  icon: "record" as const,
                  title: "Opportunity",
                  body: "Keep preferences and context.",
                },
                {
                  icon: "calendar" as const,
                  title: "Appointment",
                  body: "Only after a confirmed booking.",
                },
              ].map((step, i) => (
                <div className="record-flow-step" key={step.title}>
                  <span className="flow-icon">
                    <MarketingIcon kind={step.icon} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                  {i < 3 && (
                    <span className="flow-arrow">
                      <Arrow />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p>
            {home
              ? "Planned for GoHighLevel: organised contact details, enquiry context and appointment records."
              : healthcare
                ? "Planned GoHighLevel connection: contact details and appointment records for your reception team."
                : "Planned GoHighLevel connection: keep preferences, enquiry context and confirmed appointments together."}
          </p>
          <p className="integration-disclosure">
            {home
              ? "Integration preview — not connected in this demo."
              : healthcare
                ? "This public demo uses fictional information. Calendar access and real booking are not connected."
                : "Availability and bookings require a connected calendar. This local demo does not connect to GoHighLevel."}
          </p>
        </div>
        {home && (
          <div className="integration-home-art">
            <div className="integration-icons" aria-hidden="true">
              <span>
                <MarketingIcon kind="conversation" />
              </span>
              <i />
              <span>
                <MarketingIcon kind="record" />
              </span>
              <i />
              <span>
                <MarketingIcon kind="calendar" />
              </span>
            </div>
            <Link className="text-link" href="/contact">
              Contact us <Arrow diagonal />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function FAQs({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <section className="faq-section container">
      <h2>Frequently asked questions.</h2>
      <div className="faq-grid">
        {items.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <span className="faq-chevron" aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ClosingCTA({ children }: { children: ReactNode }) {
  return (
    <section className="closing-cta">
      <div className="container">
        <h2>{children}</h2>
        <Link className="button" href="/contact">
          Contact us <Arrow />
        </Link>
      </div>
    </section>
  );
}
