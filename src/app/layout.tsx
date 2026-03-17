import type { Metadata } from "next";
import { Agentation } from "agentation";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Design Jobs — Curated Design Roles at Top AI Companies",
  description:
    "Browse curated design and design engineering jobs at the world's leading AI companies. Product designer, UX researcher, design engineer, and brand designer roles at OpenAI, Anthropic, Google DeepMind, Figma, Stripe, and 80+ more.",
  keywords: [
    "ai design jobs",
    "design jobs at ai companies",
    "product designer ai",
    "design engineer jobs",
    "ux designer ai",
    "ai company careers",
    "tech design jobs",
    "startup design jobs",
  ],
  openGraph: {
    title: "AI Design Jobs — Curated Design Roles at Top AI Companies",
    description:
      "Browse curated design and design engineering jobs at the world's leading AI companies.",
    type: "website",
    url: "https://designjobs.fyi",
    images: [
      {
        url: "https://designjobs.fyi/og.png",
        width: 1456,
        height: 816,
        alt: "AI Design Jobs — Curated design roles at top AI companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Design Jobs — Curated Design Roles at Top AI Companies",
    description:
      "Browse curated design and design engineering jobs at the world's leading AI companies.",
    images: ["https://designjobs.fyi/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
