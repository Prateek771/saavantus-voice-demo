import type { Metadata } from "next";
import { AIDiscovery } from "@/components/ai-discovery";
import "./discovery.css";
import "./visual-report.css";
export const metadata: Metadata = {
  title: "Organizational AI Discovery",
  description:
    "Explore AI readiness and adoption with transparent scoring and a practical 30/60/90-day roadmap.",
};
export default function DiscoveryPage() {
  return <AIDiscovery />;
}
