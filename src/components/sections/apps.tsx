"use client"

import type { Language } from "../../lib/i18n"
import { translations } from "../../lib/i18n"
import { Apple, Play } from "lucide-react"
import Image from "next/image"
import unnamed from "../unnamed.jpg"
import unnamed2 from "../unnamed2.jpg"

interface AppsProps {
  language: Language
}

export default function Apps({ language }: AppsProps) {
  const t = translations[language]

  return (
    <section id="apps" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">{t.apps.badge}</span>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mt-4 mb-4">{t.apps.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.apps.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://apps.apple.com/app/id6754383869"
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-border hover:border-accent transition-colors bg-background hover:bg-accent/10"
            aria-label={t.apps.appStore}
          >
            <Apple className="w-5 h-5 text-foreground group-hover:text-accent" />
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{language === "fr" ? "Télécharger sur" : "Download on the"}</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.lilygo.vtcs"
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-border hover:border-accent transition-colors bg-background hover:bg-accent/10"
            aria-label={t.apps.playStore}
          >
            <Play className="w-5 h-5 text-foreground group-hover:text-accent" />
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{language === "fr" ? "Disponible sur" : "Get it on"}</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </a>
        </div>

        {/* Android app screenshots */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="glass rounded-xl overflow-hidden shadow-sm">
            <Image
              src={unnamed2}
              alt={language === "fr" ? "Capture d'écran Android 1" : "Android screenshot 1"}
              width={120}
              height={240}
              className="h-48 w-auto object-cover"
            />
          </div>
          <div className="glass rounded-xl overflow-hidden shadow-sm">
            <Image
              src={unnamed}
              alt={language === "fr" ? "Capture d'écran Android 2" : "Android screenshot 2"}
              width={120}
              height={240}
              className="h-48 w-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
