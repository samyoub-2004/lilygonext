"use client"

import { Mail, Phone, MapPin, Sunrise as Stripe, CreditCard } from "lucide-react"
import type { Language } from "../../lib/i18n"
import { translations } from "../../lib/i18n"

interface FooterProps {
  language: Language
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language]
  const quickLinks =
    language === "fr"
      ? [
          { label: "Accueil", href: "/" },
          { label: "Services", href: "#services" },
          { label: "FAQ", href: "#faq" },
          { label: "Contact", href: "#contact" },
          { label: "Mentions légales", href: "/mentions-legales" },
          { label: "Politique de confidentialité", href: "/privacy" },
        ]
      : [
          { label: "Home", href: "/" },
          { label: "Services", href: "#services" },
          { label: "FAQ", href: "#faq" },
          { label: "Contact", href: "#contact" },
          { label: "Legal Notice", href: "/mentions-legales" },
          { label: "Privacy Policy", href: "/privacy" },
        ]

  return (
    <footer id="footer" className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">LUXE VTC</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {language === "fr"
                ? "Votre partenaire de confiance pour un transport VIP premium en France."
                : "Your trusted partner for premium VIP transport in France."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{language === "fr" ? "Navigation" : "Navigation"}</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{language === "fr" ? "Contact" : "Contact"}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+33123456789"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:contact@luxevtc.fr"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  contact@luxevtc.fr
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/70">France</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4">{language === "fr" ? "Moyens de Paiement" : "Payment Methods"}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <CreditCard className="w-4 h-4" />
                <span>Visa & Mastercard</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Stripe className="w-4 h-4" />
                <span>Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <span className="text-lg">🅿️</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>
              {language === "fr"
                ? "&copy; 2025 LUXE VTC. Tous droits réservés."
                : "&copy; 2025 LUXE VTC. All rights reserved."}
            </p>
            <div className="flex gap-6">
              <a href="/mentions-legales" className="hover:text-primary-foreground transition-colors">
                {language === "fr" ? "Mentions légales" : "Legal Notice"}
              </a>
              <a href="/privacy" className="hover:text-primary-foreground transition-colors">
                {language === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                {language === "fr" ? "Conditions d'utilisation" : "Terms of Use"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
