import Link from "next/link";
import { Brief } from "@/components/brief";
export const metadata = { title: "Discuss your workflow" };
export default function Contact() {
  return (
    <section className="container page-prose">
      <p className="eyebrow">YOUR WORKFLOW, YOUR NEXT STEP</p>
      <h1>
        Let’s make it <em>specific.</em>
      </h1>
      <p>
        Start with the job your team needs help with. Use this local worksheet
        to explore a deployment brief—nothing is sent or saved.
      </p>
      <Brief />
      <p className="tiny">
        This preview does not collect contact details or send enquiries. A real
        contact and booking flow will be added after approval.
      </p>
      <Link className="text-link" href="/">
        Return to the demos
      </Link>
    </section>
  );
}
