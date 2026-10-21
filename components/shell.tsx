"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui";
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
          <Link className="wordmark" href="/" onClick={() => setOpen(false)}>
            saavantus<span>.</span>
            <span className="sr-only"> Home</span>
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
            <Link href="/#how-it-works" onClick={() => setOpen(false)}>
              How it works
            </Link>
            <Link
              href="/contact"
              className="button secondary nav-cta"
              onClick={() => setOpen(false)}
            >
              Discuss your workflow <Icon name="arrow" size={16} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer container">
      <div>
        <Link href="/" className="wordmark">
          saavantus<span>.</span>
        </Link>
        <p>
          Voice agents. Clear <em>next steps.</em>
        </p>
      </div>
      <div className="footer-bottom">
        <span>Built for conversations that go somewhere.</span>
        <nav aria-label="Footer">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
