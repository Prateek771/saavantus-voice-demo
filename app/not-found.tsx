import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container page-prose">
      <p className="eyebrow">404</p>
      <h1>
        Let’s find your <em>next step.</em>
      </h1>
      <p>That page is not part of this preview.</p>
      <Link className="button" href="/">
        Explore the demos
      </Link>
    </section>
  );
}
