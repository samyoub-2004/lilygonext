import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import CookieBanner from "../components/cookie-banner"
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, ORGANIZATION_ADDRESS } from "../lib/seo"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] })
const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "600", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LILYGO - Transport VIP Premium en France",
    template: "%s | LILYGO VTC",
  },
  description:
    "Service de transport VIP haut de gamme en France. Réservez votre trajet avec nos véhicules premium, chauffeurs professionnels et assistance 24/7.",
  keywords: [
    "VTC",
    "chauffeur privé",
    "transport premium",
    "service VIP",
    "Marseille",
    "transfert aéroport",
    "luxe",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "LILYGO - Transport VIP Premium en France",
    description:
      "Voyagez sereinement avec LILYGO : chauffeurs certifiés, véhicules haut de gamme et réservation en quelques clics.",
    siteName: SITE_NAME,
    locale: "fr_FR",
    images: [
      {
        url: "/window.svg",
        width: 1200,
        height: 630,
        alt: "LILYGO - Transport VIP Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LILYGO - Transport VIP Premium en France",
    description:
      "Réservez votre chauffeur privé LILYGO : service haut de gamme, disponibilité 24/7 et paiement sécurisé.",
    images: ["/window.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "transport",
  generator: "Next.js",
  icons: {
    icon: "/window.svg",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LimousineService",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Service de transport VIP premium en France : chauffeurs certifiés, véhicules haut de gamme, réservation en ligne.",
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION_ADDRESS.streetAddress,
      addressLocality: ORGANIZATION_ADDRESS.addressLocality,
      postalCode: ORGANIZATION_ADDRESS.postalCode,
      addressCountry: ORGANIZATION_ADDRESS.addressCountry,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [
      "https://www.facebook.com/",
      "https://www.instagram.com/",
    ],
    priceRange: "€€",
    serviceType: "Transport VIP",
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Script
          id="ld-json-lilygo"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  )
}
