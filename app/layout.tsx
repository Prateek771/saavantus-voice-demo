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
    default: "Saavantus | Voice agents. Clear next steps.",
    template: "%s | Saavantus",
  },
  description:
    "Explore Saavantus voice agents for real estate and healthcare, in English and Hindi. Live voice demos, clear workflows and a practical path to connected business operations.",
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
