import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { siteContact } from "@/lib/site-contact";
import "@/app/contact.css";
export const metadata = {
  title: "Let’s build your next conversation",
  description:
    "Tell Saavantus about your business, enquiry workflow and preferred callback time. Explore voice agents for real estate and healthcare.",
};
export default function Contact() {
  return (
    <section className="container contact-page">
      <div className="contact-intro">
        <h1>
          Tell us where the conversation <em>gets stuck.</em>
        </h1>
        <p>
          Missed enquiries. Repeated questions. Follow-ups that lose their
          context. Start with the part your team wants to make better.
        </p>
        <p>
          Share a little about your business and what a useful next step looks
          like. We can then shape the agent, the questions and the handoff
          around your workflow.
        </p>
        <div className="contact-direct">
          <h2>Prefer a direct conversation?</h2>
          <a href={siteContact.emailHref}>{siteContact.email}</a>
          {siteContact.phones.map((phone) => (
            <a key={phone.href} href={phone.href}>
              {phone.label}
            </a>
          ))}
        </div>
        <Link className="text-link" href="/">
          Explore the voice demos
        </Link>
      </div>
      <ContactForm />
    </section>
  );
}
