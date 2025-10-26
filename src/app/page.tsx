"use client"

import { useState, useEffect } from "react"
import PageLoader from "../components/page-loader"
import ScrollIndicator from "../components/scroll-indicator"
import Navbar from "../components/navbar"
import Hero from "../components/sections/hero"
import Services from "../components/sections/services"
import FAQ from "../components/sections/faq"
import Footer from "../components/sections/footer"
import BottomNav from "../components/bottom-nav"
import LilyGoChat from "../components/lilygo-chat"
import type { Language } from "../lib/i18n"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    setMounted(true)

    // Load saved language preference
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  if (isLoading) {
    return <PageLoader />
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="relative">
      <ScrollIndicator />
      <Navbar language={language} onLanguageChange={handleLanguageChange} />

      <main className="overflow-hidden">
        <Hero language={language} />
        <Services language={language} />
        <FAQ language={language} />
        <Footer language={language} />
      </main>

      <BottomNav />
      <LilyGoChat />
    </div>
  )
}
