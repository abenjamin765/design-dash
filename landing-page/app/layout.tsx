import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://abenjamin765.github.io/design-dash/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Design Dash — From fuzzy problem to build-ready plan",
  description: "An open-source, AI-facilitated product design method that connects evidence, object models, flows, alternatives, wireframes, and requirements.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Design Dash — From fuzzy problem to build-ready plan",
    description: "An open-source, AI-facilitated product design method that connects evidence, object models, flows, alternatives, wireframes, and requirements.",
    url: siteUrl,
    type: "website",
  },
  icons: {
    icon: "/design-dash/favicon.svg",
    shortcut: "/design-dash/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
