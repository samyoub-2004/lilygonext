"use client"

import { useState } from "react"
import ReservationForm from "../reservation-form"
import type { Language } from "../../lib/i18n"
import { translations } from "../../lib/i18n"

interface HeroProps {
  language: Language
}

export default function Hero({ language }: HeroProps) {
  const [showForm, setShowForm] = useState(true)
  const t = translations[language]

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">{t.hero.badge}</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              {t.hero.title}
              <span className="text-accent"> {t.hero.titleAccent}</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">{t.hero.description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "✓", text: t.hero.feature1 },
                { icon: "✓", text: t.hero.feature2 },
                { icon: "✓", text: t.hero.feature3 },
                { icon: "✓", text: t.hero.feature4 },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-accent font-bold">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => window.location.href = "/book"}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              {t.hero.cta}
            </button>
          </div>

          {/* Right - Reservation Form */}
          <div className="animate-slide-in-left">
            <ReservationForm />
          </div>
        </div>

        {/* France availability notice */}
        <div className="mt-16 p-6 glass rounded-2xl max-w-2xl mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">📍 {t.hero.availability}</span>
            <br />
            {t.hero.availabilityDesc}
          </p>
        </div>
      </div>
    </section>
  )
}
