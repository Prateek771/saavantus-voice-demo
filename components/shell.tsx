"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui";
import { siteContact } from "@/lib/site-contact";
import "@/app/footer.css";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    if (open) window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="preview-bar">
        <span className="status-dot" />
        Local preview{" "}
        <span className="preview-detail">
          · Voice demos and scripted walkthroughs. CRM not connected.
        </span>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link
            className="wordmark"
            href="/"
            aria-label="Saavantus Excellence home"
            onClick={() => setOpen(false)}
          >
            <Image
              className="brand-logo"
              src="/saavantus-excellence-warm-charcoal.png"
              alt="Saavantus Excellence"
              width={1774}
              height={887}
              sizes="360px"
              priority
            />
          </Link>
          <button
            className="menu-toggle"
            ref={toggle}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            Menu <Icon name={open ? "close" : "menu"} />
          </button>
          <nav
            id="main-nav"
            className={open ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            <Link
              href="/services"
              aria-current={path === "/services" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/real-estate-ai"
              aria-current={path === "/real-estate-ai" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Real estate
            </Link>
            <Link
              href="/healthcare-ai"
              aria-current={path === "/healthcare-ai" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Healthcare
            </Link>
            <Link
              href="/ai-discovery"
              aria-current={path === "/ai-discovery" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              AI Discovery
            </Link>
            <Link
              href="/contact"
              className="button secondary nav-cta"
              aria-current={path === "/contact" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Contact us <Icon name="arrow" size={16} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="saavantus-footer">
      <div className="container">
        <div className="footer-directory">
          <div className="footer-introduction">
            <Link
              href="/"
              className="wordmark"
              aria-label="Saavantus Excellence home"
            >
              <Image
                className="brand-logo"
                src="/saavantus-excellence-warm-charcoal.png"
                alt="Saavantus Excellence"
                width={1774}
                height={887}
                sizes="360px"
              />
            </Link>
            <p>
              AI agents, workflow automation and cloud services. Built around
              your business, connected to the tools you use, and refined with
              the people who do the work.
            </p>
            <span className="footer-language">
              From the first process map to the next improvement.
            </span>
          </div>
          <nav
            className="footer-links"
            aria-label="Explore Saavantus Excellence"
          >
            <h3>Explore</h3>
            <Link href="/services">Services</Link>
            <Link href="/real-estate-ai#voice-demo">Real estate agent</Link>
            <Link href="/healthcare-ai#voice-demo">
              Healthcare receptionist
            </Link>
            <Link href="/ai-discovery">AI Discovery</Link>
            <Link href="/contact">Contact form</Link>
            <a
              className="footer-founder-link"
              href="https://www.linkedin.com/in/mukesh-k-das-author/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mukesh on LinkedIn <Icon name="external" size={15} />
            </a>
          </nav>
          <address className="footer-direct-contact">
            <h3>Talk to us</h3>
            <a className="footer-email" href={siteContact.emailHref}>
              {siteContact.email}
            </a>
            {siteContact.phones.map((phone) => (
              <a href={phone.href} key={phone.href}>
                {phone.label}
              </a>
            ))}
          </address>
        </div>
        <div className="footer-legal">
          <span>© 2026 Saavantus Excellence</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
          <span>Local preview · CRM not connected.</span>
        </div>
      </div>
    </footer>
  );
}
