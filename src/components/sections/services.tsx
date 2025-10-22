"use client"

import { useEffect, useRef, useState } from "react"
import { Zap, Users, Clock, Shield } from "lucide-react"
import type { Language } from "../../lib/i18n"
import { translations } from "../../lib/i18n"

interface ServicesProps {
  language: Language
}

export default function Services({ language }: ServicesProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const t = translations[language]

  const services = [
    {
      icon: Zap,
      title: t.services.service1Title,
      description: t.services.service1Desc,
    },
    {
      icon: Users,
      title: t.services.service2Title,
      description: t.services.service2Desc,
    },
    {
      icon: Clock,
      title: t.services.service3Title,
      description: t.services.service3Desc,
    },
    {
      icon: Shield,
      title: t.services.service4Title,
      description: t.services.service4Desc,
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleCards((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.1 },
    )

    const cards = containerRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">{t.services.badge}</span>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mt-4 mb-6">{t.services.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.services.description}</p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            const isVisible = visibleCards.includes(index)

            return (
              <div
                key={index}
                data-index={index}
                className={`group glass rounded-2xl p-8 transition-all duration-500 hover:shadow-xl hover:scale-105 cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <div className="mb-6 inline-block p-4 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>

                <h3 className="text-xl font-semibold mb-3 font-serif">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
