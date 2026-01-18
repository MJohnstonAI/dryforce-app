import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-inter",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dry Force",
    template: "%s",
  },
  description:
    "Dry Force provides 24/7 fire and flood restoration services across South Africa's major metros.",
  openGraph: {
    title: "Dry Force",
    description:
      "South Africa's trusted partner for fire and flood restoration services.",
    type: "website",
    url: "/",
    images: ["/images/home-hero.png"],
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dry Force",
    description:
      "Dry Force provides 24/7 fire and flood restoration services across South Africa's major metros.",
    images: ["/images/home-hero.png"],
  },
  other: {
    "geo.region": "ZA",
    "geo.placename": "South Africa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className={`light scroll-smooth ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
