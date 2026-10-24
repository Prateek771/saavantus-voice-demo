import type { Metadata } from "next";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "./globals.css";
import { Header, Footer } from "@/components/shell";
import { MotionProvider } from "@/components/motion-provider";
export const metadata: Metadata = {
  title: {
    default: "Saavantus Excellence | AI agents and workflow automation",
    template: "%s | Saavantus Excellence",
  },
  description:
    "AI agents, workflow automation and cloud services from Saavantus Excellence. Assess your AI readiness with AI Discovery and try our real estate and healthcare voice demos.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
