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

export function VoiceArtwork() {
  return (
    <div className="voice-artwork" aria-hidden="true">
      <svg viewBox="0 0 620 330" fill="none">
        <defs>
          <radialGradient id="voice-sphere">
            <stop offset="0" stopColor="#475055" />
            <stop offset="1" stopColor="#17242a" />
          </radialGradient>
        </defs>
        {Array.from({ length: 27 }, (_, row) => {
          const points = Array.from({ length: 155 }, (_, point) => {
            const x = point * 4;
            const envelope = Math.exp(-Math.pow((x - 310) / 170, 2));
            const y =
              166 +
              Math.sin(x / 39 + row * 0.055) * (20 + row * 4.7) * envelope;
            return `${point ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          }).join(" ");
          return (
            <path
              key={row}
              d={points}
              stroke="#da4c38"
              strokeWidth=".7"
              opacity=".65"
            />
          );
        })}
        <circle cx="310" cy="167" r="43" fill="url(#voice-sphere)" />
        {Array.from({ length: 45 }, (_, i) => {
          const x = 58 + i * 11.5;
          const height =
            8 +
            Math.pow(Math.sin(i * 0.68), 2) * 65 * (1 - Math.abs(i - 22) / 29);
          return (
            <path
              key={i}
              d={`M${x} ${166 - height / 2}v${height}`}
              stroke="#da4c38"
              strokeWidth="1"
              opacity=".8"
            />
          );
        })}
      </svg>
    </div>
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
        <div className="industry-hero-grid">
          <div className="industry-hero-copy">
            <p className="eyebrow">{eyebrow}</p>
            <h1>
              {firstLine}
              <br />
              {secondLine}
            </h1>
            {children}
            <p className="industry-language">
              English and Hindi · Voice setup shown below
            </p>
            <a className="text-link" href="#voice-demo">
              Explore the demo <Arrow />
            </a>
          </div>
          <div className="industry-image">
            <img
              src={healthcare ? "/images/clinic.png" : "/images/property.png"}
              width="780"
              height="650"
              alt={
                healthcare
                  ? "Illustrative architectural image of a warm, light-filled clinic reception. Not a real clinic."
                  : "Illustrative architectural image of a modern apartment building. Not a property listing."
              }
            />
            <span className="image-caption">Illustrative architecture</span>
          </div>
        </div>
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
          <p className="integration-label">INTEGRATION PREVIEW</p>
          <h2>
            {home
              ? "Your voice agent. Your CRM. Your calendar."
              : healthcare
                ? "An organised request. A clear appointment status."
                : "A record your sales team can use."}
          </h2>
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
              Discuss your workflow <Arrow diagonal />
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
          Discuss your workflow <Arrow />
        </Link>
      </div>
    </section>
  );
}
