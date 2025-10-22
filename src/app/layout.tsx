import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] })
const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "600", "700"] })

export const metadata: Metadata = {
  title: "LILYGO - Transport VIP Premium en France",
  description:
    "Service de transport VIP haut de gamme en France. Réservez votre trajet avec nos véhicules premium et chauffeurs professionnels.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
