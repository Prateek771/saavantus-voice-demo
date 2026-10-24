import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/marketing";
import { services } from "@/lib/services";
import "../marketing.css";
import "./services.css";

export const metadata: Metadata = {
  title: "Automation Services",
  description:
    "Explore AI workflow automation, agent development, business process and support automation, integrations, SaaS operations, consulting and AWS cloud infrastructure services.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Services</span>
        </nav>
      </div>
      <section
        className="services-hero container"
        aria-labelledby="services-heading"
      >
        <h1 id="services-heading" data-reveal>
          Automation that fits
          <br />
          <em>the work you do.</em>
        </h1>
        <div data-reveal>
          <p>
            From a single workflow to the infrastructure behind it, we help you
            plan, build and operate automation around your business.
          </p>
          <p>
            Explore the scope, deliverables and example uses below. Each project
            starts with your systems, your constraints and an agreed way to
            measure progress.
          </p>
          <Link href="/contact" className="button">
            Discuss your project <Arrow />
          </Link>
        </div>
      </section>
      <nav className="service-index container" aria-label="Explore services">
        {services.map((service) => (
          <a href={`#${service.id}`} key={service.id}>
            {service.title}
            <Arrow diagonal />
          </a>
        ))}
      </nav>
      <div className="service-details container">
        {services.map((service) => (
          <section
            id={service.id}
            className="service-detail"
            key={service.id}
            aria-labelledby={`${service.id}-title`}
          >
            <div className="service-detail-intro" data-reveal>
              <h2 id={`${service.id}-title`}>{service.title}</h2>
              <p>{service.description}</p>
              <Link
                className="text-link"
                href="/contact"
                aria-label={`Discuss ${service.title}`}
              >
                Discuss this service <Arrow diagonal />
              </Link>
            </div>
            <div className="service-detail-content">
              <div className="service-deliverables" data-reveal>
                <h3>What we build with you</h3>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="service-benefits" data-reveal>
                <h3>How it helps</h3>
                <ul>
                  {service.benefits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="service-use-cases" data-reveal>
                <h3>Example use cases</h3>
                <ul>
                  {service.useCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
      <section
        className="services-contact"
        aria-labelledby="services-contact-heading"
      >
        <div className="container">
          <div data-reveal>
            <h2 id="services-contact-heading">
              Start with the problem.
              <br />
              <em>We’ll work through the options.</em>
            </h2>
            <p>
              Share the process you want to improve. We’ll discuss the scope,
              existing tools and a useful first project through our Assess,
              Architect, Adjust, Automate framework.
            </p>
          </div>
          <Link className="button" href="/contact">
            Contact Saavantus Excellence <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
