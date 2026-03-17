import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BASE_URL = "https://slider-one.vercel.app";
const OG_IMAGE_PATH = "/metadata.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Slider One | Animated React Slider Component",
  description:
    "A smooth, animated React slider with tactile motion, dynamic progress, and a floating value label.",
  keywords: [
    "React slider",
    "range input",
    "animated slider",
    "tactile motion",
    "Slider One",
    "UI component",
    "Tailwind slider",
  ],
  authors: [
    {
      name: "Samet Ozkale",
      url: "https://samet.works",
    },
  ],
  creator: "Samet Ozkale",
  openGraph: {
    title: "Slider One | Animated React Slider Component",
    description:
      "A smooth, animated React slider with tactile motion, dynamic progress, and a floating value label.",
    url: "https://slider-one.vercel.app/",
    siteName: "Slider One",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Slider One – Animated React Slider Component",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slider One | Animated React Slider Component",
    description:
      "A smooth, animated React slider with tactile motion, dynamic progress, and a floating value label.",
    images: [OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Slider One",
    description:
      "Slider One: animated React slider component with floating label, tactile thumb motion, and themeable styling.",
    url: "https://slider-one.vercel.app/",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: "Samet Ozkale", url: "https://samet.works" },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
